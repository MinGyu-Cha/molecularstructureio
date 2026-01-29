import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader.js';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // DEBUG: Controls disabled
import pdbURL from '/caffeine.pdb?url';

const ProgressBar = ({ value }) => (
    <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '20px',
        backgroundColor: '#555',
        borderRadius: '10px',
        overflow: 'hidden',
        zIndex: 100,
    }}>
        <div style={{
            width: `${value}%`,
            height: '100%',
            backgroundColor: '#fff',
            transition: 'width 0.1s linear',
        }} />
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            textAlign: 'center',
            lineHeight: '20px',
            color: '#000',
        }}>
            {Math.round(value)}%
        </div>
    </div>
);

const MoleculeViewer = () => {
    const mountRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) {
            return;
        }

        let scene, camera, renderer; //, controls; // DEBUG: Controls disabled

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        // --- DEBUG: Controls disabled ---
        // controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.05;
        // controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;

        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(1, 1, 1);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        scene.add(ambientLight);

        const loader = new PDBLoader();
        loader.load(pdbURL, 
        (pdb) => { // onLoad
            setProgress(100);
            const { geometry, json } = pdb;
            
            const root = new THREE.Group();
            const positions = geometry.getAttribute('position');
            for (let i = 0; i < positions.count; i++) {
                const sphere = new THREE.Mesh(
                    new THREE.IcosahedronGeometry(1, 3),
                    new THREE.MeshPhongMaterial({ color: 'white' })
                );
                sphere.position.fromBufferAttribute(positions, i);
                sphere.scale.multiplyScalar(5);
                root.add(sphere);
            }
            
            const box = new THREE.Box3().setFromObject(root);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);

            // Create a single large red sphere at the center
            const debugSphere = new THREE.Mesh(
                new THREE.SphereGeometry(maxDim / 4, 32, 32),
                new THREE.MeshPhongMaterial({ color: 'red' })
            );
            debugSphere.position.copy(center);
            scene.add(debugSphere);

            // Frame the camera on the debug sphere
            const fov = camera.fov * (Math.PI / 180);
            // BUG FIX: Use maxDim instead of size.y for a robust calculation
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
            cameraZ *= 2; 

            camera.position.set(center.x, center.y, center.z + cameraZ);
            // controls.target.copy(center); // DEBUG: Controls disabled
            // controls.update(); // DEBUG: Controls disabled
            camera.lookAt(center); // Manually point camera since controls are off
        },
        (xhr) => { // onProgress
            if (xhr.lengthComputable) {
                setProgress((xhr.loaded / xhr.total) * 100);
            }
        },
        (error) => { // onError
            console.error('An error happened during PDB loading:', error);
            setProgress(100);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            // controls.update(); // DEBUG: Controls disabled
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <>
            {progress < 100 && <ProgressBar value={progress} />}
            <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
        </>
    );
};

export default MoleculeViewer;
