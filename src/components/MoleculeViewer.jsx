import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const MoleculeViewer = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        let scene, camera, renderer, controls;
        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 200;

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            mountRef.current.appendChild(renderer.domElement);

            controls = new OrbitControls(camera, renderer.domElement);

            const light = new THREE.DirectionalLight(0xffffff, 0.8);
            light.position.set(1, 1, 1);
            scene.add(light);

            const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
            scene.add(ambientLight);

            const loader = new PDBLoader();
            loader.load('/caffeine.pdb', (pdb) => {
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
                    const geometry = new THREE.TubeGeometry(path, 1, 2, 8, false);
                    const material = new THREE.MeshPhongMaterial({ color: 0xcccccc });
                    const tube = new THREE.Mesh(geometry, material);
                    scene.add(tube);
                }
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
        };

        init();

        return () => {
            // cleanup
        };
    }, []);

    return <div ref={mountRef} />;
};

export default MoleculeViewer;
