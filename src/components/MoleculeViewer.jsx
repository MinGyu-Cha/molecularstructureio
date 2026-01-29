import { useEffect, useRef } from 'react';
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, SceneLoader } from '@babylonjs/core';
import '@babylonjs/loaders'; // This is required for GLB loader

const BabylonScene = () => {
    const reactCanvas = useRef(null);

    useEffect(() => {
        if (!reactCanvas.current) {
            return;
        }

        const engine = new Engine(reactCanvas.current, true);
        const scene = new Scene(engine);
        
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, Vector3.Zero(), scene);
        camera.attachControl(reactCanvas.current, true);
        
        const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);
        
        SceneLoader.ImportMeshAsync("", "/Caffeine.glb", "", scene).then((result) => {
            // The first mesh in the result is the parent, let's frame all children
            const parentMesh = result.meshes[0];
            camera.zoomOnFactor = 1.5;
            camera.zoomOn([parentMesh]);
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
