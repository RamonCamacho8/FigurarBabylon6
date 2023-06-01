
import React from "react";
import * as BABYLON from "@babylonjs/core";
import SceneComponent from "../Babylon_components/SceneComponent"; 
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.


const onSceneReady = (e = { engine: BABYLON.Engine, scene: BABYLON.Scene, canvas: HTMLCanvasElement }) => {

  const { canvas, scene, engine } = e;
  // This creates and positions a free camera (non-mesh)
  const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

  // This targets the camera to scene origin
  camera.setTarget(BABYLON.Vector3.Zero());

  // This attaches the camera to the canvas
  camera.attachControl(canvas, false);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // Our built-in 'box' shape.
  var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);

  // Move the box upward 1/2 its height
  box.position.y = 1;

  // Our built-in 'ground' shape.
  BABYLON.MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);


  scene.onBeforeRenderObservable.add(() =>{
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();
  
      const rpm = 30
      box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);  
    } 

  });


  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });
  

};


function Test() {
  return (
      <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Test;
