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
    //await createRoom_2(scene);
    //await createRoom_3(scene);
    //await createRoom_4(scene);
    
}

/**
 * 
 * @param {Scene} scene Scene
 */
export async function SetupScene(scene, canvas){
    
    CreatePlayerController(scene, canvas)

    let ambientLight = new HemisphericLight("ambientLight", new BABYLON.Vector3(0, 2, 0), scene);
    ambientLight.intensity = 0.5;
    

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
    
    //const isometricViewCamera = new BABYLON.UniversalCamera("isometricViewCamera", new BABYLON.Vector3(2.5, 10, -2.5), scene);
    //isometricViewCamera.setTarget(new BABYLON.Vector3(2.5, 0, -2.5));
   
    //ViewPort
    firstPersonCamera.viewport = new BABYLON.Viewport(0, .25, 1, 1);
    //isometricViewCamera.viewport = new BABYLON.Viewport(0.75, 0, .25, .25);

    //isometricViewCamera.inputs.clear();

    //scene.activeCameras.push(isometricViewCamera);
    scene.activeCameras.push(firstPersonCamera);

    player.position = firstPersonCamera.position;
    player.parent = firstPersonCamera;
    player.checkCollisions = false;

    return firstPersonCamera;
}

 async function createRoom_1(scene){
    const {meshes, animationGroups} = await SceneLoader.ImportMeshAsync("",Room_1,"",scene);

    animationGroups.map((animationGroup) => {
        animationGroup.stop();
    })

    console.log(animationGroups);
    
    meshes.map((mesh) => {
        mesh.checkCollisions = true;
    })

    const squareL = scene.getMeshByName("Room_1_Square_L");
    const circleL = scene.getMeshByName("Room_1_Circle_L");
    const triangleL = scene.getMeshByName("Room_1_Triangle_L");
    let door = scene.getMeshByName("Room_1_Door");
    const roof = scene.getMeshByName("Room_1_Roof");
    let colliderMesh = scene.getMeshByName("Room_1_Collider");
    colliderMesh.dispose();

  
    roof.isVisible = false;

     //Set PressAnimations 
    OpenDoorProcess(squareL,scene, door,animationGroups[0]);
    OpenDoorProcess(circleL,scene);
    OpenDoorProcess(triangleL,scene);

    return meshes;
}

async function createRoom_2(scene){
    
    const {meshes} = await SceneLoader.ImportMeshAsync("",Room_2,"",scene);
    
    meshes.map((mesh) => {
        mesh.checkCollisions = true;
    })
    
    let roof = scene.getMeshByName("Room_2_Roof");
    roof.isVisible = false;
    
    let colliderMesh = scene.getMeshByName("Room_2_Collider");
    colliderMesh.dispose();
    
    return meshes;
    
}

async function createRoom_3(scene){
    const {meshes} = await SceneLoader.ImportMeshAsync("",Room_3,"",scene);
    
    meshes.map((mesh) => {
        mesh.checkCollisions = true;
        
    })

    let roof = scene.getMeshByName("Room_3_Roof");
    roof.isVisible = false;
    
    let colliderMesh = scene.getMeshByName("Room_3_Collider");
    colliderMesh.dispose();
    return meshes;
    
}

async function createRoom_4(scene){
    const {meshes} = await SceneLoader.ImportMeshAsync("",Room_4,"",scene);
    
    let roof = scene.getMeshByName("Room_4_Roof");
    roof.isVisible = false;
    
    meshes.map((mesh) => {
        mesh.checkCollisions = true;
        
    })
    
    let door = scene.getMeshByName("Room_4_Door");
    let colliderMesh = scene.getMeshByName("Room_4_Collider");
    colliderMesh.dispose();
    door.dispose();
    
    return meshes;
    
}

function ColliderSetup(colliderMesh, scene){

    colliderMesh.checkCollisions = false;
    colliderMesh.isPickable = false;
    colliderMesh.isVisible = true;

    colliderMesh.actionManager = new BABYLON.ActionManager(scene);

    colliderMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
           {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: scene.getMeshByName("Player")
           },
           () => { colliderMesh.material.emissiveColor = BABYLON.Color3.Red();
            console.log("Collision"); }
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



export function OpenDoorProcess(mesh, scene, doorMesh, animation){
    mesh.actionManager = new BABYLON.ActionManager(scene);
    mesh.edgesWidth = 1.0;
    mesh.edgesColor = new BABYLON.Color4(0, 0, 0, 1);   
    
    let frameRate = setPressAnimation(mesh)


    mesh.actionManager.registerAction(new BABYLON.PlaySoundAction(
        BABYLON.ActionManager.OnPickDownTrigger,new BABYLON.Sound("down", buttonSound, scene)));

    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnLeftPickTrigger,
        function (evt) {
            scene.beginAnimation(mesh, 0,frameRate);
            console.log(mesh.name)
            if(doorMesh){
                animation.play();
                console.log("play")
            }
        }
    ));

    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function (evt) {

            mesh.enableEdgesRendering();
        }
    ));

    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function (evt) {
       
            mesh.disableEdgesRendering();


        }
    ));
}

function setPressAnimation(mesh,id){
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
        "pressAnimation"+id,
        "position.x",
        16, // Frames per second
        BABYLON.Animation.ANIMATIONTYPE_FLOAT,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT  
    );

    pressAnimation.setKeys(keyFrames);


    mesh.animations.push(pressAnimation);

    return frameRate;
} 





