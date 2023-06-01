import { useEffect, useRef } from "react";
import * as BABYLON from "@babylonjs/core";
import "../App.css"


export default ({ antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onSceneReady, ...rest }) => {
  const reactCanvas = useRef(null);

  

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new BABYLON.Engine(canvas, antialias, engineOptions, adaptToDeviceRatio);
    const scene = new BABYLON.Scene(engine, sceneOptions);


    if (scene.isReady()) {
      onSceneReady({canvas,scene,engine});
    } else {
      console.log("onSceneReady is not avaliable")
      console.error("onSceneReady is not avaliable")
      scene.onReadyObservable.addOnce((scene) => onSceneReady({canvas,scene,engine}));
    }

    /*engine.runRenderLoop(() => {
     
      scene.render();
    });*/

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [antialias, engineOptions, adaptToDeviceRatio, sceneOptions, onSceneReady]);

  return <canvas className="SceneComponent" ref={reactCanvas} {...rest} />;
};