import * as THREE from 'three';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/DRACOLoader.js';

let scene, camera, renderer, controls;
let raycaster, mouse;
let clickableObjects = [];
let selectedObject = null;
let clickedObjects = new Map(); // Store clicked objects with their original materials and positions
const MOVE_DISTANCE = 0.3; // Distance to move objects outward

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(5, 5, 5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, -10, -5);
    scene.add(directionalLight2);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50;

    // Raycaster for click detection
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Load GLB model
    loadModel();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onMouseClick);
    document.getElementById('close-btn').addEventListener('click', closeInfoPanel);
    document.getElementById('reset-btn').addEventListener('click', resetAllObjects);

    // Animation loop
    animate();
}

function loadModel() {
    const loader = new GLTFLoader();

    // Setup Draco decoder
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('./libs/draco/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
        'body.glb',
        (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            // Adjust camera to fit the model
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
            camera.position.set(cameraZ, cameraZ, cameraZ);
            camera.lookAt(0, 0, 0);
            controls.update();

            // Collect all meshes for click detection
            model.traverse((child) => {
                if (child.isMesh) {
                    clickableObjects.push(child);
                }
            });

            console.log('Model loaded successfully');
        },
        (progress) => {
            console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
        },
        (error) => {
            console.error('Error loading model:', error);
        }
    );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with all objects
    const intersects = raycaster.intersectObjects(clickableObjects, false);

    if (intersects.length > 0) {
        // Find the first object that hasn't been clicked yet, or use the first one
        let targetObject = null;

        for (const intersect of intersects) {
            const obj = intersect.object;
            if (!clickedObjects.has(obj)) {
                targetObject = obj;
                break;
            }
        }

        // If all intersected objects were already clicked, use the first one
        if (!targetObject && intersects.length > 0) {
            targetObject = intersects[0].object;
        }

        if (targetObject) {
            showObjectInfo(targetObject);
        }
    }
}

function showObjectInfo(object) {
    const infoPanel = document.getElementById('info-panel');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');

    // If selecting a different object, move the previous one away
    if (selectedObject && selectedObject !== object) {
        if (clickedObjects.has(selectedObject)) {
            // Dim the previous object
            selectedObject.material.color.set(0xff0000);
            selectedObject.material.opacity = 0.3;

            // Move it away now that we're looking at something underneath
            const originalState = clickedObjects.get(selectedObject);
            if (!originalState.moved) {
                const objectCenter = new THREE.Vector3();
                const box = new THREE.Box3().setFromObject(selectedObject);
                box.getCenter(objectCenter);

                // Calculate target position
                const direction = objectCenter.clone().normalize();
                const targetPosition = selectedObject.position.clone().add(
                    direction.multiplyScalar(MOVE_DISTANCE)
                );

                // Animate the movement
                new TWEEN.Tween(selectedObject.position)
                    .to({
                        x: targetPosition.x,
                        y: targetPosition.y,
                        z: targetPosition.z
                    }, 800)
                    .easing(TWEEN.Easing.Cubic.Out)
                    .start();

                originalState.moved = true;
            }
        }
    }

    // If this object hasn't been clicked before, store its original state (but don't move it yet)
    if (!clickedObjects.has(object)) {
        // Store original material and position
        clickedObjects.set(object, {
            material: object.material,
            position: object.position.clone(),
            moved: false
        });

        // Clone material and make it semi-transparent red
        object.material = object.material.clone();
        object.material.transparent = true;
        object.material.opacity = 0.3;
        object.material.color.set(0xff0000);
        object.material.depthWrite = false; // Allow seeing through
    }

    // Highlight the current selection with brighter red
    selectedObject = object;
    object.material.color.set(0xff3333);
    object.material.opacity = 0.5;

    // Get object name
    const name = object.userData?.name || object.name || 'Unnamed Object';

    // Try to get description from userData or generate default
    let description = object.userData?.description || 'No description available.';

    infoTitle.textContent = name;
    infoDescription.textContent = description;
    infoDescription.style.whiteSpace = 'pre-line';
    infoPanel.classList.remove('hidden');
}

function closeInfoPanel() {
    // Dim the current selection
    if (selectedObject && clickedObjects.has(selectedObject)) {
        selectedObject.material.color.set(0xff0000);
        selectedObject.material.opacity = 0.3;
    }
    selectedObject = null;
    document.getElementById('info-panel').classList.add('hidden');
}

function resetAllObjects() {
    // Animate all clicked objects back to their original positions
    clickedObjects.forEach((originalState, object) => {
        // Animate position back
        new TWEEN.Tween(object.position)
            .to({
                x: originalState.position.x,
                y: originalState.position.y,
                z: originalState.position.z
            }, 800)
            .easing(TWEEN.Easing.Cubic.Out)
            .onComplete(() => {
                // Restore material after animation completes
                object.material = originalState.material;
            })
            .start();
    });

    // Clear tracking after animations start
    setTimeout(() => {
        clickedObjects.clear();
        selectedObject = null;
    }, 850);

    closeInfoPanel();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}

// Initialize the scene
init();
