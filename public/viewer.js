import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/DRACOLoader.js';

let scene, camera, renderer, controls;
let raycaster, mouse;
let clickableObjects = [];
let highlightedObject = null;
let movedObjects = new Map(); // uuid -> { object, material, position, underneathUUIDs: [] }
const MOVE_DISTANCE = 0.3;

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

    loadModel();

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);
    document.getElementById('close-btn').addEventListener('click', closeInfoPanel);
    document.getElementById('reset-btn').addEventListener('click', resetAllObjects);

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

function moveObjectAway(object) {
    if (!object.userData.originalMaterial) return;

    const underneathUUIDs = findObjectsUnderneath(object);

    movedObjects.set(object.uuid, {
        object: object,
        material: object.userData.originalMaterial,
        position: object.position.clone(),
        underneathUUIDs: underneathUUIDs
    });

    const box = new THREE.Box3().setFromObject(object);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const direction = center.normalize();
    const targetPos = object.position.clone().add(direction.multiplyScalar(MOVE_DISTANCE));

    object.material = object.material.clone();
    object.material.transparent = true;
    object.material.opacity = 0.3;
    object.material.color.set(0xff0000);
    object.material.emissive = new THREE.Color(0x000000);
    object.material.depthWrite = false;

    new TWEEN.Tween(object.position)
        .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 800)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

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

    // Only unhighlight for top-level restore
    if (shouldHighlight && highlightedObject) {
        unhighlightObject(highlightedObject);
    }

    new TWEEN.Tween(object.position)
        .to({ x: state.position.x, y: state.position.y, z: state.position.z }, 800)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(() => {
            object.material = state.material;
            // Only highlight the clicked object, not recursively restored ones
            if (shouldHighlight) {
                highlightObject(object);
            }
        })
        .start();

    movedObjects.delete(uuid);

    // Restore objects that were underneath (don't highlight them)
    state.underneathUUIDs.forEach(underneathUUID => {
        if (movedObjects.has(underneathUUID)) {
            restoreObject(underneathUUID, false);
        }
    });
}

function showObjectInfo(object) {
    const {name, description, type, wikiLink} = object?.userData || {};

    document.getElementById('info-title').textContent = name || object.name || 'Unnamed Object';
    document.getElementById('info-description').textContent = description || 'No description available.';

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

function resetAllObjects() {
    if (highlightedObject) {
        unhighlightObject(highlightedObject);
        highlightedObject = null;
    }

    movedObjects.forEach((state) => {
        new TWEEN.Tween(state.object.position)
            .to({ x: state.position.x, y: state.position.y, z: state.position.z }, 800)
            .easing(TWEEN.Easing.Cubic.Out)
            .onComplete(() => {
                state.object.material = state.material;
            })
            .start();
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
