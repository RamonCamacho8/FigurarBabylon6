import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";


import * as GUI from "@babylonjs/gui";
import havok from "@babylonjs/havok"


import meshesBlender from "../Assets/3Dmodels/FigurarEnviroment.glb";
 
import buttonSound from "../Assets/audio/buttonSound128kbs.mp3";

var scene = null;
var hud = null;

var observerCollider_1 = null;
var observerCollider_2 = null;
var observerCollider_3 = null;
var observerCollider_4 = null;

var collider_1_visited = false;
var collider_2_visited = false;
var collider_3_visited = false;
var collider_4_visited = false;

var firstQuestion = false;

export async function CreateEnviroment(){
    scene.useRightHandedSystem = true;
    await meshesHandler();
    CreatePlayerController();
    scene.stopAllAnimations();

}

export function initScene(){
    setupLights();
    setPhysics();
}


export function setupScene(scene_){
    scene = scene_;
}

async function setPhysics(){
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.HavokPlugin(true, await havok()));
}



function setupLights(){
    let ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 2, 0), scene);
    let ambientLight_2 = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, -2, 0), scene);
    ambientLight.intensity = 0.5;
    ambientLight_2.intensity = 0.5;
    new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 0), scene);
}



export function CreatePlayerController(){

    const firstPersonCamera = new BABYLON.FreeCamera("firstPersonCamera", new BABYLON.Vector3(0, 1, 0), scene);

    firstPersonCamera.attachControl(scene.getEngine().getRenderingCanvas(), true);

    firstPersonCamera.checkCollisions = true;
    firstPersonCamera.applyGravity = true;
    firstPersonCamera.ellipsoid = new BABYLON.Vector3(.2, .5, .2);
    firstPersonCamera.speed = 0.1;
    firstPersonCamera.minZ = 0.45;
    firstPersonCamera.angularSensibility = 4000;
    firstPersonCamera.fov = 1.2;

    scene.activeCameras.push(firstPersonCamera);

    let player = scene.getMeshByName("Player");
    const plugin = scene.getPhysicsEngine().getPhysicsPlugin();

    
    
    scene.onBeforeRenderObservable.add(() => {
        
        player.position.x = firstPersonCamera.position.x;
        player.position.z = firstPersonCamera.position.z;
        
    })

    return firstPersonCamera;
}

async function meshesImport(){

    const {meshes_, animationGroups} = await BABYLON.SceneLoader.ImportMeshAsync("",meshesBlender,"",scene).then((results) => {
        
        var root = results.meshes[0];
        root.name = "xyz3";
        root.id = "xyz3";
        return {meshes_: results.meshes, animationGroups: results.animationGroups}
    });

    return {meshes_, animationGroups};
}

async function meshesHandler(){

    const {meshes_, animationGroups} = await meshesImport(scene);

    let viewer = new BABYLON.PhysicsViewer();

    let room_1_Buttons = [];
    let room_2_Buttons = [];
    let room_3_Buttons = [];
    let room_4_Buttons = [];


    meshes_.map((mesh) => {
        
        if(mesh.name.includes("Collider")){
            ColliderSetup(mesh);
        }
        if(mesh.name.includes("Button") && mesh.name.includes("Room_1")){
            room_1_Buttons.push(mesh);
        }

        if(mesh.name.includes("Button") && mesh.name.includes("Room_2")){
            room_2_Buttons.push(mesh);
        }

        if(mesh.name.includes("Button") && mesh.name.includes("Room_3")){
            room_3_Buttons.push(mesh);
        }

        if(mesh.name.includes("Button") && mesh.name.includes("Room_4")){
            room_4_Buttons.push(mesh);
        }


        if(mesh.name.includes("Floor")){
            console.log("Setting up ground")
            groundSetup(mesh);
        }

        if(mesh.name.includes("Wall")){
            wallsPhisycsEnabler(mesh);
        }

        if(mesh.name.includes("Roof")){
            mesh.isVisible = true;
        }

        if(mesh.name.includes("Door") ){
            console.log("Position: ", mesh.position)
            doorPhisycsEnabler(mesh);
        }

        if(mesh.name.includes("Player")){
            playerPhisycsEnabler(mesh);
        }

        if(mesh.name.includes("Desk")){
            mesh.isPickable = true;
        }

        if(mesh.name.includes("Locker")){
            lockPhisycsEnabler(mesh);
        }

        if (mesh.physicsBody) {
            //viewer.showBody(mesh.physicsBody);
        }
    })

    observerCollider_1 = scene.onBeforeRenderObservable.add(() => {
        if(collider_1_visited){
            room_1_Buttons.map((button) => {
                edgeRenderForSelectables(button);
            })
            correctAnswer(scene.getMeshByName("Room_1_Square_Button"), scene.getMeshByName("Room_1_Door"), scene.getMeshByName("Room_1_Locker"));
            scene.onBeforeRenderObservable.remove(observerCollider_1);
        }
    });
    
    observerCollider_2 = scene.onBeforeRenderObservable.add(() => {
        if(collider_2_visited){
            room_3_Buttons.map((button) => {
                edgeRenderForSelectables(button);
            })
            correctAnswer(scene.getMeshByName("Room_3_Option_B_Button"), scene.getMeshByName("Room_3_Door"), scene.getMeshByName("Room_3_Locker"));
            
            scene.onBeforeRenderObservable.remove(observerCollider_2);
        }
    });

    observerCollider_3 = scene.onBeforeRenderObservable.add(() => {
        if(collider_3_visited){
            room_4_Buttons.map((button) => {
                edgeRenderForSelectables(button);
            })
            correctAnswer(scene.getMeshByName("Room_4_Option_A_Button"), scene.getMeshByName("Room_4_Door"), scene.getMeshByName("Room_4_Locker"));
            
            scene.onBeforeRenderObservable.remove(observerCollider_3);
        }
    });


    

}

function playerPhisycsEnabler(mesh){
    mesh.checkCollisions = false;
}

function lockPhisycsEnabler(mesh){
    mesh.checkCollisions = false;
    mesh.actionManager = new BABYLON.ActionManager(scene);
    let lockShape = new BABYLON.PhysicsShapeConvexHull(
        mesh,   // mesh from which to produce the convex hull
        scene   // scene of the shape
    );
    let lockAggregate = new BABYLON.PhysicsAggregate(mesh, lockShape, { mass: 1, startAsleep: false, restitution: 1 }, scene)
    lockAggregate.body.setMotionType(BABYLON.PhysicsMotionType.STATIC)

    //Change scale of the lock 
    let i = 1;
    let factor = -1;
    let increment = 0.001;
    
    scene.onBeforeRenderObservable.add(() => {
        mesh.scaling.x = i;
        mesh.scaling.y = i;
        mesh.scaling.z = i;
        if(i >= 1.1 || i <= 0.9){
            factor *= -1;
        }
        i+= increment*factor;
    })

}


function doorPhisycsEnabler(mesh){
    mesh.actionManager = new BABYLON.ActionManager(scene);
    let doorShape = new BABYLON.PhysicsShapeConvexHull(
        mesh,   // mesh from which to produce the convex hull
        scene   // scene of the shape
    );
    let doorAggregate = new BABYLON.PhysicsAggregate(mesh, doorShape, { mass: 1, startAsleep: true, restitution: 0 }, scene)
    doorAggregate.body.setMotionType(BABYLON.PhysicsMotionType.STATIC)
    mesh.checkCollisions = true;

}

function wallsPhisycsEnabler(mesh){
    mesh.checkCollisions = true;
    let wallShape = new BABYLON.PhysicsShapeMesh(
        mesh,   // mesh from which to produce the convex hull
        scene   // scene of the shape
    );
    let wallAggregate = new BABYLON.PhysicsAggregate(mesh, wallShape, { mass: 0 }, scene)
    wallAggregate.body.setMotionType(BABYLON.PhysicsMotionType.STATIC)
}


function groundSetup(mesh){

    let groundAggregate = new BABYLON.PhysicsAggregate(mesh, BABYLON.PhysicsShapeType.BOX, { mass: 0 }, scene)
    groundAggregate.body.setMotionType(BABYLON.PhysicsMotionType.STATIC)
    mesh.checkCollisions = true;

}


function ColliderSetup(colliderMesh){

    colliderMesh.checkCollisions = false;
    colliderMesh.isPickable = false;
    colliderMesh.isVisible = false;
    let materialName = ("colliderMaterial",colliderMesh.name);
    let colliderMaterial = new BABYLON.StandardMaterial(materialName, scene);
    colliderMaterial.alpha = 0.5;
    colliderMaterial.emissiveColor = BABYLON.Color3.Red();
    colliderMesh.material = colliderMaterial;



    colliderMesh.actionManager = new BABYLON.ActionManager(scene);

    colliderMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
           {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: scene.getMeshByName("Player")
           },
           () => { 

            colliderMesh.material.emissiveColor = BABYLON.Color3.Green();
            if(colliderMesh.name.includes("Room_1")){
                collider_1_visited = true;
            }
            if(colliderMesh.name.includes("Room_2")){
                collider_2_visited = true;
            }
            if(colliderMesh.name.includes("Room_3")){
                collider_3_visited = true;
            }
            if(colliderMesh.name.includes("Room_4")){
                collider_4_visited = true;
            }
        })
    )

    colliderMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                parameter: scene.getMeshByName("Player")
                },
                () => { 
                    colliderMesh.material.emissiveColor = BABYLON.Color3.Red();
                    console.log("Collision off:  ", colliderMesh.name );
                    
            }
        )
    )
}
async function showHUD(){
    //Create advance texture
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    advancedTexture.idealWidth = 1600;
    advancedTexture.renderAtIdealSize = true;
   
    await advancedTexture.parseFromSnippetAsync("ET5SI0#1");
    return scene;
   
}

function correctAnswer(answerMesh, doorMesh, lockMesh){
    
    answerMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnLeftPickTrigger,
        function () {
          
            lockMesh.physicsBody.setMotionType(BABYLON.PhysicsMotionType.DYNAMIC)
            lockMesh.physicsBody.applyForce(new BABYLON.Vector3(1000, 0, 0), lockMesh.getAbsolutePosition());
            doorMesh.physicsBody.setMotionType(BABYLON.PhysicsMotionType.DYNAMIC)

            doorMesh.isVisible = false;
            doorMesh.checkCollisions = false;

        }
    ))
}

function edgeRenderForSelectables(selectableMesh){
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
        function () {
            scene.beginAnimation(selectableMesh, 0,frameRate);
            console.log(selectableMesh.name)
            selectableMesh.isPickable = false;
        }
    ));

    //For edge rendering when mouse is over the mesh
    selectableMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function () {

            selectableMesh.enableEdgesRendering();
        }
    ));

    selectableMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function () {
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





