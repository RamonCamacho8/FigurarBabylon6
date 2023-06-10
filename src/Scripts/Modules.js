import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";


import * as GUI from "@babylonjs/gui";
import havok from "@babylonjs/havok"


import meshesBlender from "../Assets/3Dmodels/FigurarEnviroment.glb";
 
import buttonSound from "../Assets/audio/buttonSound128kbs.mp3";


export async function CreateEnviroment(scene){

    await meshesHandler(scene);
    scene.stopAllAnimations();


}

/**
 * 
 * @param {Scene} scene Scene
 */
export async function SetupScene(scene){
    
    

    let ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 2, 0), scene);
    ambientLight.intensity = 0.5;

    const light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 0), scene);
    
    scene.enablePhysics(new BABYLON.Vector3(0, 9.81, 0), new BABYLON.HavokPlugin(true, await havok()));
    

}



export async function CreatePlayerController(scene){

    const firstPersonCamera = new BABYLON.FreeCamera("firstPersonCamera", new BABYLON.Vector3(0, 1, 0), scene);

    firstPersonCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);

    firstPersonCamera.checkCollisions = false;
    firstPersonCamera.applyGravity = false;
    firstPersonCamera.ellipsoid = new BABYLON.Vector3(.25, .5, .25);
    firstPersonCamera.speed = 0.1;
    firstPersonCamera.minZ = 0.45;
    firstPersonCamera.angularSensibility = 4000;
    firstPersonCamera.fov = 1.2;

    scene.activeCameras.push(firstPersonCamera);

    console.log("Player created")

    /*let player = scene.getMeshByName("Player");
    
    
    player.checkCollisions = false;

    scene.onBeforeRenderObservable.add(() => {
        player.position.x = -firstPersonCamera.position._x;
        player.position.z = firstPersonCamera.position._z;
        
    })*/

    return firstPersonCamera;
}

async function meshesHandler(scene){
    const {meshes, animationGroups} = await BABYLON.SceneLoader.ImportMeshAsync("",meshesBlender,"",scene);

    meshes.map((mesh) => {
        //mesh.checkCollisions = true;
        if(mesh.name.includes("Collider")){
            ColliderSetup(mesh, scene);
        }
        if(mesh.name.includes("Button")){
            edgeRenderForSelectables(mesh, scene);
        }
        if(mesh.name.includes("Floor")){
            console.log("Setting up ground")
            groundSetup(mesh, scene);
        }

        if(mesh.name.includes("Roof")){
            mesh.isVisible = false;
        }

        if(mesh.name.includes("Door")){
            console.log("Position: ", mesh.position)
            physicBodyCreation(mesh, scene);
        }
    })

    animationGroups.map((animation) => {
        if (animation.name.includes("Door")){
            correctAnswer(scene.getMeshByName("Room_1_Square_Button"), animation, scene);
        }
    })


}

function physicBodyCreation(mesh, scene){
    console.log("First position: ", mesh.position)
    let groundAggregate = new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)
    groundAggregate.body.setMotionType(BABYLON.PhysicsMotionType.STATIC)
    console.log("Final position: ", mesh.position)
    
}

function groundSetup(mesh, scene){

    
    let groundAggregate = new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)
    groundAggregate.body.setMotionType(BABYLON.PhysicsMotionType.STATIC)
    console.log(groundAggregate.body)
   
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





