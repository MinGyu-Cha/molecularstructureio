import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

        let scene, camera, renderer, controls;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30; // Position camera for a single atom at origin
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.mouseButtons.RIGHT = THREE.MOUSE.DOLLY;

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));

        const loader = new PDBLoader();
        loader.load(pdbURL,
        (pdb) => { // onLoad
            try {
                setProgress(100);
                const { geometry } = pdb;
                const positions = geometry.getAttribute('position');

                // FINAL DEBUG: Try to render only the VERY FIRST atom as a blue sphere
                const firstAtomPosition = new THREE.Vector3().fromBufferAttribute(positions, 0);
                const blueSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(2, 32, 32), // Make it a decent size
                    new THREE.MeshPhongMaterial({ color: 'blue' })
                );
                blueSphere.position.copy(firstAtomPosition);
                scene.add(blueSphere);

            } catch (error) {
                console.error("Failed to process PDB model:", error);
                // Fallback: render a red sphere if model processing fails
                const errorSphere = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 32, 32),
                    new THREE.MeshPhongMaterial({ color: 'red' })
                );
                scene.add(errorSphere);
                camera.position.z = 5;
            }
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

    return (
        <>
            {progress < 100 && <ProgressBar value={progress} />}
            <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />
        </>
    );
};

export default MoleculeViewer;
