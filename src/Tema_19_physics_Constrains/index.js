import * as BABYLON from "@babylonjs/core";
import SceneComponent from "../Babylon_components/SceneComponent";
import { PlayGround } from "./PlayGround";
import havok from "@babylonjs/havok"

import * as Constrains from "./Constraints"


const onSceneReady = async (e = { engine: new BABYLON.Engine, scene: new BABYLON.Scene, canvas: new HTMLCanvasElement }) => {

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


  // scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.AmmoJSPlugin(true,await ammo()));
  scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.HavokPlugin(true, await havok()));


  scene.gravity = new BABYLON.Vector3(0, -0.98, 0)
  scene.collitionsEnabled = true;


  Constrains.ballAndSocket(scene);
  Constrains.distance(scene);
  Constrains.hinge(scene);
  Constrains.prismatic(scene);
  Constrains.locked(scene);
  Constrains.slider(scene);
  Constrains.sixdof(scene);




  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
    }
  });

};


function Scene() {
  return (
    <SceneComponent antialias onSceneReady={onSceneReady} id="SceneCanvas" />
  );
}

export default Scene;
