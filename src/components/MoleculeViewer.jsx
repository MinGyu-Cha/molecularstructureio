import React, { useEffect, useRef, useState } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Color4,
  TransformNode,
} from '@babylonjs/core';

const createAtom = (name, position, color, scene) => {
  const atom = MeshBuilder.CreateSphere(name, { diameter: 1 }, scene);
  atom.position = position;
  const material = new StandardMaterial(`${name}-mat`, scene);
  material.diffuseColor = color;
  atom.material = material;
  return atom;
};

const createBond = (name, from, to, scene) => {
  const path = [from, to];
  const bond = MeshBuilder.CreateTube(name, { path, radius: 0.1, cap: MeshBuilder.CAP_ROUND }, scene);
  const material = new StandardMaterial(`${name}-mat`, scene);
  material.diffuseColor = Color3.Gray();
  bond.material = material;
  return bond;
};

const buildMolecule = (moleculeId, scene) => {
  const root = new TransformNode("moleculeRoot", scene);

  switch (moleculeId) {
    case 'h2o': { // Water - Bent
      const angle = 104.5 * (Math.PI / 180);
      const bondLength = 3;
      const o = createAtom('O', Vector3.Zero(), Color3.Red(), scene);
      const h1 = createAtom('H1', new Vector3(Math.cos(angle / 2) * bondLength, Math.sin(angle / 2) * bondLength, 0), Color3.White(), scene);
      const h2 = createAtom('H2', new Vector3(-Math.cos(angle / 2) * bondLength, Math.sin(angle / 2) * bondLength, 0), Color3.White(), scene);
      const b1 = createBond('B1', o.position, h1.position, scene);
      const b2 = createBond('B2', o.position, h2.position, scene);
      o.parent = root; h1.parent = root; h2.parent = root; b1.parent = root; b2.parent = root;
      break;
    }
    case 'ch4': { // Methane - Tetrahedral
      const bondLength = 4;
      const angle = 109.5 * (Math.PI / 180);
      const c = createAtom('C', Vector3.Zero(), Color3.Gray(), scene);
      const h1 = createAtom('H1', new Vector3(0, bondLength, 0), Color3.White(), scene);
      const h2 = createAtom('H2', new Vector3(bondLength * Math.sin(angle) * Math.cos(0), bondLength * Math.cos(angle), bondLength * Math.sin(angle) * Math.sin(0)), Color3.White(), scene);
      const h3 = createAtom('H3', new Vector3(bondLength * Math.sin(angle) * Math.cos(2 * Math.PI / 3), bondLength * Math.cos(angle), bondLength * Math.sin(angle) * Math.sin(2 * Math.PI / 3)), Color3.White(), scene);
      const h4 = createAtom('H4', new Vector3(bondLength * Math.sin(angle) * Math.cos(4 * Math.PI / 3), bondLength * Math.cos(angle), bondLength * Math.sin(angle) * Math.sin(4 * Math.PI / 3)), Color3.White(), scene);
      const b1 = createBond('B1', c.position, h1.position, scene);
      const b2 = createBond('B2', c.position, h2.position, scene);
      const b3 = createBond('B3', c.position, h3.position, scene);
      const b4 = createBond('B4', c.position, h4.position, scene);
      c.parent = root; h1.parent = root; h2.parent = root; h3.parent = root; h4.parent = root; b1.parent = root; b2.parent = root; b3.parent = root; b4.parent = root;
      break;
    }
    case 'co2': { // Carbon Dioxide - Linear
      const bondLength = 4;
      const c = createAtom('C', Vector3.Zero(), Color3.Gray(), scene);
      const o1 = createAtom('O1', new Vector3(bondLength, 0, 0), Color3.Red(), scene);
      const o2 = createAtom('O2', new Vector3(-bondLength, 0, 0), Color3.Red(), scene);
      const b1 = createBond('B1', c.position, o1.position, scene);
      const b2 = createBond('B2', c.position, o2.position, scene);
      c.parent = root; o1.parent = root; o2.parent = root; b1.parent = root; b2.parent = root;
      break;
    }
    default:
      break;
  }
  return root;
};

const MoleculeViewer = ({ moleculeId }) => {
    const reactCanvas = useRef(null);
    const [scene, setScene] = useState(null);
    const [camera, setCamera] = useState(null);

    // Effect for initializing Babylon scene, engine, and camera
    useEffect(() => {
        if (!reactCanvas.current) return;

        const engine = new Engine(reactCanvas.current, true);
        const scene = new Scene(engine);
        scene.clearColor = new Color4(0.2, 0.2, 0.25, 1);
        
        const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 20, Vector3.Zero(), scene);
        camera.attachControl(reactCanvas.current, true);
        
        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 1;

        setScene(scene);
        setCamera(camera);

        engine.runRenderLoop(() => {
            scene.render();
        });

        const resize = () => engine.resize();
        window.addEventListener('resize', resize);

        return () => {
            window.removeEventListener('resize', resize);
            engine.dispose();
        };
    }, []);

    // Effect for building and updating the molecule when moleculeId changes
    useEffect(() => {
        if (!scene || !camera) return;

        // Clear previous molecule
        const oldMolecule = scene.getTransformNodeByName("moleculeRoot");
        if (oldMolecule) {
          oldMolecule.dispose(false, true);
        }

        // Build new molecule
        const moleculeRoot = buildMolecule(moleculeId, scene);
        
        // Frame camera on the new molecule
        const boundingInfo = moleculeRoot.getHierarchyBoundingVectors(true);
        camera.lowerRadiusLimit = boundingInfo.boundingSphere.radius;
        camera.radius = boundingInfo.boundingSphere.radius * 3;
        camera.target = boundingInfo.boundingSphere.center;

    }, [scene, camera, moleculeId]);

    return <canvas ref={reactCanvas} style={{ width: '100%', height: '100%', outline: 'none' }} />;
};

export default MoleculeViewer;
