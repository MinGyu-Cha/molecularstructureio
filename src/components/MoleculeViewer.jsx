import { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader, Color4, BoundingInfo } from '@babylonjs/core';
import '@babylonjs/loaders';
import glbURL from '/Caffeine.glb?url'; // Use Vite's explicit asset URL import

const BabylonScene = () => {
    const reactCanvas = useRef(null);

    useEffect(() => {
        if (!reactCanvas.current) {
            return;
        }

        const engine = new Engine(reactCanvas.current, true);
        const scene = new Scene(engine);
        scene.clearColor = new Color4(0.2, 0.2, 0.2, 1);
        
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
        camera.attachControl(reactCanvas.current, true);
        
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        light.intensity = 1.5;
        
        SceneLoader.ImportMeshAsync(null, glbURL, "", scene) // Use the imported URL
            .then((result) => {
                const rootMesh = result.meshes[0];
                
                let min = new Vector3(Infinity, Infinity, Infinity);
                let max = new Vector3(-Infinity, -Infinity, -Infinity);

                rootMesh.getChildMeshes().forEach((mesh) => {
                    let meshBoundingBox = mesh.getBoundingInfo().boundingBox;
                    min.minimizeInPlace(meshBoundingBox.minimumWorld);
                    max.maximizeInPlace(meshBoundingBox.maximumWorld);
                });

                const boundingInfo = new BoundingInfo(min, max);
                const center = boundingInfo.boundingSphere.center;
                const radius = boundingInfo.boundingSphere.radius;
                
                camera.target = center;
                camera.radius = radius * 3; 
                camera.lowerRadiusLimit = radius / 2;
                camera.upperRadiusLimit = radius * 10;

            })
            .catch((error) => {
                console.error("Failed to load GLB model:", error);
                scene.clearColor = new Color4(1, 0, 0, 1);
            });

        engine.runRenderLoop(() => {
            scene.render();
        });

        const resize = () => {
            engine.resize();
        };

        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            engine.dispose();
        };
    }, []);

    return <canvas ref={reactCanvas} style={{ width: '100%', height: '100%', outline: 'none' }} />;
};

const MoleculeViewer = () => {
    return <BabylonScene />;
};

export default MoleculeViewer;
