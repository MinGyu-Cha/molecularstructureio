import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import glbURL from '/Caffeine.glb?url';

const MoleculeViewer = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) {
            return;
        }

        let scene, camera, renderer, controls;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        // This is the confirmed way to re-enable the context menu
        controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

        scene.add(new THREE.AmbientLight(0xffffff, 1.5));
        const light = new THREE.DirectionalLight(0xffffff, 2.5);
        light.position.set(1, 1, 1);
        scene.add(light);

        const loader = new GLTFLoader();
        loader.load(glbURL, (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            // Auto-frame the camera to the loaded model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 2; // Add some padding

            camera.position.set(center.x, center.y, center.z + cameraZ);
            controls.target.copy(center);
            controls.update();
        }, 
        undefined, // onProgress is not as straightforward with GLB as it is with PDB
        (error) => {
            console.error('An error happened while loading the GLB model:', error);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default MoleculeViewer;
