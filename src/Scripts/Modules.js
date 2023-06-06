import { HemisphericLight, SceneLoader } from "@babylonjs/core";
import * as BABYLON from "@babylonjs/core";


import * as GUI from "@babylonjs/gui";
import havok from "@babylonjs/havok"

import Player from "../Assets/3Dmodels/Player.glb";
import Room_1 from "../Assets/3Dmodels/Room_1.glb";
import Room_2 from "../Assets/3Dmodels/Room_2.glb";
import Room_3 from "../Assets/3Dmodels/Room_3.glb";
import Room_4 from "../Assets/3Dmodels/Room_4.glb";
import buttonSound from "../Assets/audio/buttonSound128kbs.mp3";


export async function CreateEnviroment(scene){

    await createRoom_1(scene);
    await createRoom_2(scene);
    await createRoom_3(scene);
    await createRoom_4(scene);

    scene.stopAllAnimations();


}

/**
 * 
 * @param {Scene} scene Scene
 */
export async function SetupScene(scene, canvas){
    
    CreatePlayerController(scene, canvas)

    let ambientLight = new HemisphericLight("ambientLight", new BABYLON.Vector3(0, 2, 0), scene);
    ambientLight.intensity = 0.5;

    const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 0), scene);
    
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.HavokPlugin(true, await havok()));
    scene.collitionsEnabled = true;

}

async function CreatePlayerController(scene ,canvas){

    const firstPersonCamera = new BABYLON.FreeCamera("firstPersonCamera", new BABYLON.Vector3(0, 1, 0), scene);
    firstPersonCamera.attachControl(canvas, true);
    firstPersonCamera.checkCollisions = true;
    firstPersonCamera.applyGravity = true;
    firstPersonCamera.ellipsoid = new BABYLON.Vector3(.25, .5, .25);
    firstPersonCamera.speed = 0.1;
    firstPersonCamera.minZ = 0.45;
    firstPersonCamera.angularSensibility = 4000;
    firstPersonCamera.fov = 1.2;

    await SceneLoader.ImportMeshAsync("",Player,"",scene);
    let player = scene.getMeshByName("Player");
    
    scene.activeCameras.push(firstPersonCamera);

    

    player.checkCollisions = false;

    scene.onBeforeRenderObservable.add(() => {
        player.position.x = -firstPersonCamera.position._x;
        player.position.z = firstPersonCamera.position._z;
        
    })

    return firstPersonCamera;
}

 async function createRoom_1(scene){

    const {meshes, animationGroups} = await SceneLoader.ImportMeshAsync("",Room_1,"",scene);
    

    meshes.map((mesh) => {

        mesh.checkCollisions = true;

        if(mesh.name.includes("Collider")){
            ColliderSetup(mesh, scene);
        }
        if(mesh.name.includes("Button")){
            edgeRenderForSelectables(mesh, scene);
        }

    })

    animationGroups.map((animation) => {
        if (animation.name.includes("Door")){
            correctAnswer(scene.getMeshByName("Room_1_Square_Button"), animation, scene);
        }
    })


    const roof = scene.getMeshByName("Room_1_Roof");
    roof.isVisible = false;

    return meshes;
}

async function createRoom_2(scene){
    
    const {meshes} = await SceneLoader.ImportMeshAsync("",Room_2,"",scene);
    
    meshes.map((mesh) => {
        mesh.checkCollisions = true;
        if(mesh.name.includes("Collider")){
            ColliderSetup(mesh, scene);
        }
    })
    
    let roof = scene.getMeshByName("Room_2_Roof");
    roof.isVisible = false;
    
    
    return meshes;
    
}

async function createRoom_3(scene){
    const {meshes} = await SceneLoader.ImportMeshAsync("",Room_3,"",scene);
    
    meshes.map((mesh) => {
        mesh.checkCollisions = true;
        if(mesh.name.includes("Collider")){
            ColliderSetup(mesh, scene);
        }
    })

    let roof = scene.getMeshByName("Room_3_Roof");
    roof.isVisible = false;
    
    return meshes;
    
}

async function createRoom_4(scene){
    const {meshes} = await SceneLoader.ImportMeshAsync("",Room_4,"",scene);
    
    let roof = scene.getMeshByName("Room_4_Roof");
    roof.isVisible = false;
    
    meshes.map((mesh) => {
        //mesh.checkCollisions = true;
        if(mesh.name.includes("Collider")){
            ColliderSetup(mesh, scene);
        }
        
    })

    let doorMesh = scene.getMeshByName("Room_4_Door");

    const doorBody = new BABYLON.PhysicsBody(doorMesh, BABYLON.PhysicsMotionType.DYNAMIC, true, scene)
    doorBody.setMassProperties({
        mass: 1,
      });
    
    const doorShape = new BABYLON.PhysicsShapeConvexHull(
        doorMesh,   // mesh from which to produce the convex hull
        scene   // scene of the shape
    );
    
    doorBody.shape = doorShape;



    return meshes;
    
}

function ColliderSetup(colliderMesh, scene){

    colliderMesh.checkCollisions = false;
    colliderMesh.isPickable = false;
    colliderMesh.isVisible = false;

    colliderMesh.actionManager = new BABYLON.ActionManager(scene);

    colliderMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
           {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: scene.getMeshByName("Player")
           },
           () => { colliderMesh.material.emissiveColor = BABYLON.Color3.Red();
            console.log("Collision on:  ", colliderMesh.name ); }
        )
    )

}
async function showHUD(scene){
    //Create advance texture
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    advancedTexture.idealWidth = 1600;
    advancedTexture.renderAtIdealSize = true;
   
    await advancedTexture.parseFromSnippetAsync("ET5SI0#1");
    return scene;
   
}

function correctAnswer(answer, doorAnimation){

    answer.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnLeftPickTrigger,
        function (evt) {
            console.log("Correct Answer")
            doorAnimation.play();
        }
    ));
}

function edgeRenderForSelectables(selectableMesh, scene){
    selectableMesh.actionManager = new BABYLON.ActionManager(scene);
    selectableMesh.edgesWidth = 1.0;
    selectableMesh.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    
    let frameRate = buttonPressAnimation(selectableMesh)


    //For sound when mouse is clicked
    selectableMesh.actionManager.registerAction(new BABYLON.PlaySoundAction(
        BABYLON.ActionManager.OnPickDownTrigger,new BABYLON.Sound("down", buttonSound, scene)));
    
    //For animation when mouse is clicked
    selectableMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnLeftPickTrigger,
        function (evt) {
            scene.beginAnimation(selectableMesh, 0,frameRate);
            console.log(selectableMesh.name)
            selectableMesh.isPickable = false;
        }
    ));

    //For edge rendering when mouse is over the mesh
    selectableMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function (evt) {

            selectableMesh.enableEdgesRendering();
        }
    ));

    selectableMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function (evt) {
       
            selectableMesh.disableEdgesRendering();


        }
    ));

}

function buttonPressAnimation(mesh){

    const frameRate = 2;
    const keyFrames = [];
    let initialPos = mesh.position.x 


    keyFrames.push({
        frame: 0,
        value: initialPos // Starting rotation
    });
    keyFrames.push({
        frame: frameRate/2, // Duration of animation (in frames)
        value: initialPos-.005 // Ending rotation
    });

    keyFrames.push({
        frame: frameRate, // Duration of animation (in frames)
        value: initialPos // Ending rotation
    });


    const pressAnimation = new BABYLON.Animation(
        "pressAnimation",
        "position.x",
        16, // Frames per second
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT  
    );

    pressAnimation.setKeys(keyFrames);
    mesh.animations.push(pressAnimation);

    return frameRate;
} 





