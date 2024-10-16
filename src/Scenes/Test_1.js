import * as BABYLON from "@babylonjs/core";
import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import SceneComponent from "../Babylon_components/SceneComponent";
import * as Modules from "../Scripts/Modules";


import "@babylonjs/loaders";

const onSceneReady = async (
  e = {
    engine: new BABYLON.Engine(),
    scene: new BABYLON.Scene(),
    canvas: new HTMLCanvasElement(),
  }
) => {
  const { canvas, scene, engine } = e;

  scene.onPointerDown = (evt) => {
    if (evt.button === 0) engine.enterPointerlock();
    if (evt.button === 1) engine.exitPointerlock();
  };


  // Setup scene
  Modules.setupScene(scene);
  Modules.initScene();
  await Modules.CreateEnviroment(scene);

 
  scene.onBeforeRenderObservable.add(() =>{
  });

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
