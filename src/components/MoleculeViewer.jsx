import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import pdbURL from '/caffeine.pdb?url';

const MoleculeViewer = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const currentMount = mountRef.current;
        if (!currentMount) {
            return;
        }

        let scene, camera, renderer, controls;

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000); // Set background to black

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 200;

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentMount.appendChild(renderer.domElement);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // Animate controls for smoother feel
        controls.dampingFactor = 0.05;

        const light = new THREE.DirectionalLight(0xffffff, 0.8);
        light.position.set(1, 1, 1);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        scene.add(ambientLight);

        const loader = new PDBLoader();
        loader.load(pdbURL, (pdb) => {
            const { geometry, json } = pdb;
            const positions = geometry.getAttribute('position');
            const colors = geometry.getAttribute('color');
            const sphereGeometry = new THREE.IcosahedronGeometry(1, 3);

            for (let i = 0; i < positions.count; i++) {
                const position = new THREE.Vector3().fromBufferAttribute(positions, i);
                const color = new THREE.Color().fromBufferAttribute(colors, i);
                const material = new THREE.MeshPhongMaterial({ color });
                const sphere = new THREE.Mesh(sphereGeometry, material);
                sphere.position.copy(position);
                sphere.scale.multiplyScalar(5);
                scene.add(sphere);
            }

            const bonds = json.connections;
            for (let i = 0; i < bonds.length; i++) {
                const bond = bonds[i];
                const start = bond[0] - 1;
                const end = bond[1] - 1;
                const startPos = new THREE.Vector3().fromBufferAttribute(positions, start);
                const endPos = new THREE.Vector3().fromBufferAttribute(positions, end);

                const path = new THREE.CatmullRomCurve3([startPos, endPos]);
                const bondGeometry = new THREE.TubeGeometry(path, 1, 2, 8, false);
                const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
                const tube = new THREE.Mesh(bondGeometry, material);
                scene.add(tube);
            }
            controls.target.copy(scene.children[scene.children.length-1].position) // set target to the last added atom
        },
        // onProgress callback
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // onError callback
        (error) => {
            console.error('An error happened during PDB loading:', error);
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

        // Cleanup
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
