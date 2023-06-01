import * as BABYLON from "@babylonjs/core";
import SceneComponent from "../Babylon_components/SceneComponent";
import { PlayGround } from "./PlayGround";
import havok from "@babylonjs/havok"


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

  camera.checkCollisions = true;
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(2, 1, 2);

  var test = PlayGround({ playground_width: 100, playground_depth: 100 }, scene)


  //Babylon PhysicsAggregate example: helper class similar to PhysicsImpostor but for multiple meshes.
  //it creates a shape,body and material for each mesh and adds them to the physics world.

  var blueMaterial = new BABYLON.StandardMaterial("mat", scene);
  blueMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.3, 1);
  blueMaterial.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.2);


  var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)
  sphere.position = new BABYLON.Vector3(3, 5, 0);
  sphere.material = blueMaterial;

  var box = BABYLON.MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;
  box.material = blueMaterial;

  box.checkCollisions = true;
  sphere.checkCollisions = true;

  //box.physicsImpostor = new BABYLON.PhysicsImpostor(box,BABYLON.PhysicsImpostor.BoxImpostor,{mass: 1, restitution:0.9}, scene)
  var sphereAgregate = new BABYLON.PhysicsAggregate(sphere, BABYLON.PhysicsShapeType.SPHERE, { mass: 1, restitution: 0.9, startAsleep: false }, scene);
  var boxAgregate = new BABYLON.PhysicsAggregate(box, BABYLON.PhysicsShapeType.BOX, { mass: 1, restitution: 0.9 }, scene);

  var groundAgregate = new BABYLON.PhysicsAggregate(test.ground, BABYLON.PhysicsShapeType.BOX, { mass: 0, restitution: 0.9, startAsleep: false }, scene);

  /*Babylon physics motion types*/

  //BABYLON.PhysicsMotionType.STATIC: Static bodies are immovable and do not respond to forces. They are useful for level boundaries or terrain.
  //BABYLON.PhysicsMotionType.DYNAMIC: Dynamic bodies are fully simulated. They can be moved manually by the user or affected by forces. They are useful for most objects that need to move around in the world.
  //BABYLON.PhysicsMotionType.ANIMATED: Animated bodies are bodies that are controlled by code but are not fully simulated. They are useful for moving platforms or ragdolls.

  sphereAgregate.body.setMotionType(BABYLON.PhysicsMotionType.DYNAMIC);
  boxAgregate.body.setMotionType(BABYLON.PhysicsMotionType.DYNAMIC);



  sphereAgregate.body.applyForce(BABYLON.Vector3.Left().scale(100), new BABYLON.Vector3(0, 0, 0));
  //sphereAgregate.body.applyImpulse(new BABYLON.Vector3(-5, 0, 0), new BABYLON.Vector3(1, 0, 0));
  boxAgregate.body.setAngularVelocity(new BABYLON.Vector3(0, 5, 0));





  //Babylon create PhysicsShape and PhysicsBody example: classes used to represent a physics body.

  var customCylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 2, diameter: 2 }, scene);
  customCylinder.position = new BABYLON.Vector3(3, 8, 4);

  var customCylinderShape = new BABYLON.PhysicsShapeCylinder(new BABYLON.Vector3(0, 1, 0), new BABYLON.Vector3(0, -1, 0), 1, scene);

  var customCylinderBody = new BABYLON.PhysicsBody(customCylinder, BABYLON.PhysicsMotionType.DYNAMIC, false, scene);


  customCylinderBody.setMassProperties({
    mass: 100,
    centerOfMass: new BABYLON.Vector3(0, 0, 0),
    inertia: new BABYLON.Vector3(1, 1, 1),
    inertiaOrientation: BABYLON.Quaternion.Identity()
  })


  //Babylon create PhysicsShape example:  class used to create physics shapes.

  //customCylinderBody.shape= customCylinderShape;


  //Babylon Physics compounds with ShapeContainer example: class used to create a container for physics shapes.

  const shapeContainer = new BABYLON.PhysicsShapeContainer(scene);
  shapeContainer.addChild(customCylinderShape);

  customCylinderBody.shape = shapeContainer;



  var viewer = new BABYLON.PhysicsViewer();
  scene.meshes.forEach((mesh) => {
      if (mesh.physicsBody) {
         // viewer.showBody(mesh.physicsBody);
      }
  });




  scene.onBeforeRenderObservable.add(() => {
    if (box !== undefined) {
      const deltaTimeInMillis = scene.getEngine().getDeltaTime();

      const rpm = 30
      //box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
      //box.rotate(BABYLON.Axis.Y, (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
    }

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
