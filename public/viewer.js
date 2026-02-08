import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/DRACOLoader.js';

let scene, camera, renderer, controls;
let raycaster, mouse;
let clickableObjects = [];
let highlightedObject = null;
let movedObjects = new Map(); // uuid -> { object, material, position, underneathUUIDs: [] }
let originalPositions = new Map(); // uuid -> original position
let visibleTypes = new Set(['muscle', 'bone']); // Currently visible types
let axesHelper;
const PILE_Y = -1.5; // Feet level for piles
const PILE_RADIUS = 0.3; // Pile radius

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, -10, -5);
    scene.add(directionalLight2);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Add axes helper with labels
    axesHelper = new THREE.Group();
    axesHelper.visible = false;

    const axes = new THREE.AxesHelper(2);
    axesHelper.add(axes);

    // Add labels (X=red, Y=green, Z=blue)
    axesHelper.add(createAxisLabel('X', 2.2, 0, 0, 0xff0000));
    axesHelper.add(createAxisLabel('Y', 0, 2.2, 0, 0x00ff00));
    axesHelper.add(createAxisLabel('Z', 0, 0, 2.2, 0x0000ff));

    scene.add(axesHelper);

    loadModel();

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);
    document.getElementById('close-btn').addEventListener('click', closeInfoPanel);
    document.getElementById('reset-btn').addEventListener('click', resetAllObjects);
    document.getElementById('toggle-muscles').addEventListener('click', () => toggleType('muscle'));
    document.getElementById('toggle-bones').addEventListener('click', () => toggleType('bone'));
    document.getElementById('toggle-axes').addEventListener('click', toggleAxes);

    animate();
}

function loadModel() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
        'body.glb',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
            camera.position.set(cameraZ, cameraZ, cameraZ);
            camera.lookAt(0, 0, 0);
            controls.update();

            model.traverse((child) => {
                if (child.isMesh) {
                    clickableObjects.push(child);
                    originalPositions.set(child.uuid, child.position.clone());
                }
            });

            console.log('Model loaded successfully');
        },
        (progress) => console.log('Loading:', (progress.loaded / progress.total * 100) + '%'),
        (error) => console.error('Error loading model:', error)
    );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects, false);

    if (intersects.length > 0) {
        handleObjectClick(intersects[0].object);
    }
}

function handleObjectClick(object) {
    // Clicking moved object -> restore it and objects underneath
    if (movedObjects.has(object.uuid)) {
        restoreObject(object.uuid, true);
        return;
    }

    // Clicking same highlighted object -> move it away
    if (highlightedObject === object) {
        moveObjectAway(object);
        return;
    }

    // Clicking different object -> unhighlight previous, highlight new
    if (highlightedObject) {
        unhighlightObject(highlightedObject);
    }

    highlightObject(object);
}

function highlightObject(object) {
    if (!object.userData.originalMaterial) {
        object.userData.originalMaterial = object.material;
    }

    object.material = object.material.clone();
    object.material.emissive = new THREE.Color(0xff0000);
    object.material.emissiveIntensity = 0.3;

    highlightedObject = object;
    showObjectInfo(object);
}

function unhighlightObject(object) {
    if (object.userData.originalMaterial) {
        object.material = object.userData.originalMaterial;
        delete object.userData.originalMaterial;
    }
}

function getPilePosition(type) {
    const xOffset = type === 'muscle' ? -0.9 : 0.9;
    return {
        x: xOffset + (Math.random() - 0.5) * PILE_RADIUS * 2,
        y: PILE_Y + Math.random() * 0.2,  // 0.2 units vertical spread
        z: (Math.random() - 0.5) * PILE_RADIUS * 2
    };
}

function moveToPile(object, duration = 800) {
    const pile = getPilePosition(object.userData?.type);
    animateSmoothArc(object, pile, duration);
}

function moveObjectAway(object) {
    if (!object.userData.originalMaterial) return;

    const underneathUUIDs = findObjectsUnderneath(object);

    movedObjects.set(object.uuid, {
        object: object,
        material: object.userData.originalMaterial,
        position: object.position.clone(),
        underneathUUIDs: underneathUUIDs
    });

    object.material = object.material.clone();
    object.material.transparent = true;
    object.material.opacity = 0.3;
    object.material.color.set(0xff0000);
    object.material.emissive = new THREE.Color(0x000000);
    object.material.depthWrite = false;

    moveToPile(object);

    delete object.userData.originalMaterial;
    highlightedObject = null;
}

function findObjectsUnderneath(object) {
    const objectBox = new THREE.Box3().setFromObject(object);
    const underneathUUIDs = [];

    // Check which objects overlap with this one
    clickableObjects.forEach(obj => {
        if (obj.uuid === object.uuid) return;

        const objBox = new THREE.Box3().setFromObject(obj);

        // If bounding boxes intersect, object is underneath
        if (objectBox.intersectsBox(objBox)) {
            underneathUUIDs.push(obj.uuid);
        }
    });

    return underneathUUIDs;
}

function restoreObject(uuid, shouldHighlight = false) {
    const state = movedObjects.get(uuid);
    if (!state) return;

    const object = state.object;

    if (shouldHighlight && highlightedObject) {
        unhighlightObject(highlightedObject);
    }

    const current = object.position.clone();
    const target = state.position;
    const height = Math.max(current.y, target.y) + 0.5;
    const mid1 = {
        x: current.x * 0.7 + target.x * 0.3,
        y: current.y * 0.5 + height * 0.5,
        z: current.z * 0.7 + target.z * 0.3
    };
    const mid2 = {
        x: current.x * 0.3 + target.x * 0.7,
        y: target.y * 0.5 + height * 0.5,
        z: current.z * 0.3 + target.z * 0.7
    };

    new TWEEN.Tween(object.position)
        .to(mid1, 240)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .chain(
            new TWEEN.Tween(object.position)
                .to(mid2, 240)
                .easing(TWEEN.Easing.Sinusoidal.InOut)
                .chain(
                    new TWEEN.Tween(object.position)
                        .to(target, 320)
                        .easing(TWEEN.Easing.Sinusoidal.In)
                        .onComplete(() => {
                            object.material = state.material;
                            if (shouldHighlight) {
                                highlightObject(object);
                            }
                        })
                )
        )
        .start();

    movedObjects.delete(uuid);

    state.underneathUUIDs.forEach(underneathUUID => {
        if (movedObjects.has(underneathUUID)) {
            restoreObject(underneathUUID, false);
        }
    });
}

function showObjectInfo(object) {
    const {type, name, nameDetail, wikiLink} = object?.userData || {};

    document.getElementById('info-type').textContent = type || '';
    document.getElementById('info-title').textContent = name || object.name || 'Unnamed Object';
    document.getElementById('info-detail').textContent = nameDetail || '';

    const wikiLinkEl = document.getElementById('info-wiki-link');
    if (wikiLink) {
        wikiLinkEl.href = wikiLink;
        wikiLinkEl.style.display = 'block';
    } else {
        wikiLinkEl.style.display = 'none';
    }

    document.getElementById('info-panel').classList.remove('hidden');
}

function closeInfoPanel() {
    document.getElementById('info-panel').classList.add('hidden');
}

function createAxisLabel(text, x, y, z, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 64;
    canvas.height = 64;

    context.fillStyle = '#' + color.toString(16).padStart(6, '0');
    context.font = 'bold 48px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, y, z);
    sprite.scale.set(0.3, 0.3, 1);

    return sprite;
}

function toggleAxes() {
    const btn = document.getElementById('toggle-axes');
    axesHelper.visible = !axesHelper.visible;
    if (axesHelper.visible) {
        btn.classList.add('active');
    } else {
        btn.classList.remove('active');
    }
}

function toggleType(type) {
    const btn = document.getElementById(`toggle-${type}s`);

    if (visibleTypes.has(type)) {
        visibleTypes.delete(type);
        btn.classList.remove('active');
        hideObjectsOfType(type);
    } else {
        visibleTypes.add(type);
        btn.classList.add('active');
        showObjectsOfType(type);
    }
}

function hideObjectsOfType(type) {
    clickableObjects.forEach(obj => {
        if (obj.userData?.type === type) {
            moveToPile(obj);
        }
    });
}

function showObjectsOfType(type) {
    clickableObjects.forEach(obj => {
        if (obj.userData?.type === type) {
            const originalPos = originalPositions.get(obj.uuid);
            if (originalPos) {
                const movedState = movedObjects.get(obj.uuid);
                const targetPos = movedState ? movedState.position : originalPos;
                animateSmoothArc(obj, targetPos, 800);
            }
        }
    });
}

function animateSmoothArc(object, target, duration) {
    const start = object.position.clone();
    const height = Math.max(start.y, target.y) + 0.5;

    // Create smooth curve with 4 control points
    const curve = new THREE.CatmullRomCurve3([
        start,
        new THREE.Vector3(
            start.x * 0.75 + target.x * 0.25,
            start.y * 0.25 + height * 0.75,
            start.z * 0.75 + target.z * 0.25
        ),
        new THREE.Vector3(
            start.x * 0.25 + target.x * 0.75,
            target.y * 0.25 + height * 0.75,
            start.z * 0.25 + target.z * 0.75
        ),
        new THREE.Vector3(target.x, target.y, target.z)
    ]);

    const tweenObj = { t: 0 };
    new TWEEN.Tween(tweenObj)
        .to({ t: 1 }, duration)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
            const point = curve.getPointAt(tweenObj.t);
            object.position.copy(point);
        })
        .start();
}

function resetAllObjects() {
    if (highlightedObject) {
        unhighlightObject(highlightedObject);
        highlightedObject = null;
    }

    movedObjects.forEach((state) => {
        const originalPos = originalPositions.get(state.object.uuid);
        const isVisible = visibleTypes.has(state.object.userData?.type);

        if (isVisible) {
            animateSmoothArc(state.object, originalPos, 800);
            setTimeout(() => {
                state.object.material = state.material;
            }, 800);
        } else {
            moveToPile(state.object);
            state.object.material = state.material;
        }
    });

    setTimeout(() => movedObjects.clear(), 850);
    closeInfoPanel();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}

init();
