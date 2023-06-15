import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF";


import * as GUI from "@babylonjs/gui";
import havok from "@babylonjs/havok"


import meshesBlender from "../Assets/3Dmodels/FigurarEnviroment.glb";
 
import buttonSound from "../Assets/audio/buttonSound128kbs.mp3";
import hud_1 from "../Assets/images/HUD_1.png";
import hud_2 from "../Assets/images/HUD_2.png";
import hud_3 from "../Assets/images/HUD_3.png";
import hud_4 from "../Assets/images/HUD_4.png";
import finalHud from "../Assets/images/HUD_FINAL.png";

var scene = null;

var advancedTexture = null;
var image = null;
var firstPersonCamera = null;

var observerCollider_1 = null;
var observerCollider_2 = null;
var observerCollider_3 = null;
var observerCollider_4 = null;
var observerCollider_5 = null;

var collider_1_visited = false;
var collider_2_visited = false;
var collider_3_visited = false;
var collider_4_visited = false;
var collider_5_visited = false;

var firstQuestion = false;

export async function CreateEnviroment(){

    scene.useRightHandedSystem = true;
    await meshesHandler();
    CreatePlayerController();
    scene.stopAllAnimations();
    showHUD();

}

export function initScene(){
    setupLights();
    setPhysics();
    setWebXR();
}


export function setupScene(scene_){
    scene = scene_;
}

async function setPhysics(){
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.HavokPlugin(true, await havok()));
}

async function setWebXR(){

    const xrDefault = await scene.createDefaultXRExperienceAsync() // WebXRDefaultExperience
    const xrHelper = xrDefault.baseExperience
    const selectedMeshes = {}

    // POINTERDOWN
    scene.onPointerObservable.add((pointerInfo) => {
        const { pickInfo } = pointerInfo
        const { hit } = pickInfo
        const { pickedMesh } = pickInfo
        if (!hit) return
        if (!pickedMesh) return
        if (!pickedMesh.startInteraction) return
        selectedMeshes[pointerInfo.event.pointerId] = pickedMesh
        if (xrHelper && xrHelper.state === BABYLON.WebXRState.IN_XR) { // XR Mode
            const xrInput = xrDefault.pointerSelection.getXRControllerByPointerId(pointerInfo.event.pointerId)
            if (!xrInput) return
            const motionController = xrInput.motionController
            if (!motionController) return
            pickedMesh.startInteraction(pointerInfo, motionController.rootMesh)
        } else {
            pickedMesh.startInteraction(pointerInfo, scene.activeCamera)
        }
    }, BABYLON.PointerEventTypes.POINTERDOWN)

    // POINTERUP
    scene.onPointerObservable.add((pointerInfo) => {
        const pickedMesh = selectedMeshes[pointerInfo.event.pointerId]
        if (pickedMesh) {
            if (pickedMesh.endInteraction) {
                pickedMesh.endInteraction(pointerInfo)
            }
            delete selectedMeshes[pointerInfo.event.pointerId]
        }
    }, BABYLON.PointerEventTypes.POINTERUP)
}



function setupLights(){
    let ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 2, 0), scene);
    let ambientLight_2 = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, -2, 0), scene);
    ambientLight.intensity = 0.5;
    ambientLight_2.intensity = 0.5;
    new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-1, -1, 0), scene);
}



export function CreatePlayerController(){

    firstPersonCamera = new BABYLON.FreeCamera("firstPersonCamera", new BABYLON.Vector3(0, 1, 0), scene);

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
    let room_5_Buttons = [];
    let room_6_Buttons = [];


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

        if(mesh.name.includes("Button") && mesh.name.includes("Room_5")){
            room_5_Buttons.push(mesh);
        }
        if (mesh.name.includes("Button") && mesh.name.includes("Room_6")) {
            room_6_Buttons.push(mesh);
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

        if(mesh.name.includes("Locker") && !mesh.name.includes("Final")){
            lockPhisycsEnabler(mesh);
            lockAnimation(mesh);
        }
        if(mesh.name.includes("Locker") && mesh.name.includes("Final")){
            lockAnimation(mesh);
        }


        if (mesh.physicsBody) {
            //viewer.showBody(mesh.physicsBody);
        }

        if(mesh.name.includes("Prop")){
            makeGrabbable(mesh);
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

    observerCollider_4 = scene.onBeforeRenderObservable.add(() => {
        if(collider_4_visited){
            room_5_Buttons.map((button) => {
                edgeRenderForSelectables(button);
            })
            correctAnswer(scene.getMeshByName("Room_5_Option_C_Button"), scene.getMeshByName("Room_5_Door"), scene.getMeshByName("Room_5_Locker"));
            
            scene.onBeforeRenderObservable.remove(observerCollider_4);
        }
    }   
    );

   observerCollider_5 = scene.onBeforeRenderObservable.add(() => {
        if(collider_5_visited){
            
            finalAnswer(scene.getMeshByName("Room_2_FinalLocker"));
            scene.onBeforeRenderObservable.remove(observerCollider_5);
        }
    }
    );


    

}

function playerPhisycsEnabler(mesh){
    mesh.checkCollisions = false;
}

function lockAnimation(mesh){
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

function finalAnswer(colliderMesh){

    colliderMesh.actionManager = new BABYLON.ActionManager(scene);

    colliderMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
           {
            trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
            parameter: scene.getMeshByName("PyramidProp")
           },
           () => { 
                advancedTexture.removeControl(image);
                image = new GUI.Image("but", finalHud);
                advancedTexture.addControl(image);
                firstPersonCamera.detachControl(scene.getEngine().getRenderingCanvas());
                
        })
    )

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
                image = new GUI.Image("but", hud_1);
                advancedTexture.addControl(image);

            }
            if(colliderMesh.name.includes("Room_2")){
                collider_2_visited = true;
                if(!collider_3_visited){
                    advancedTexture.removeControl(image);
                    image = new GUI.Image("but", hud_2);
                    advancedTexture.addControl(image);
                }
                
            }
            if(colliderMesh.name.includes("Room_3")){
                collider_3_visited = true;
                advancedTexture.removeControl(image);
                image = new GUI.Image("but", hud_3);
                advancedTexture.addControl(image);
            }
            if(colliderMesh.name.includes("Room_4")){
                collider_4_visited = true;
                advancedTexture.removeControl(image);
                image = new GUI.Image("but", hud_4);
                advancedTexture.addControl(image);
            }
            if(colliderMesh.name.includes("Room_5")){
                collider_5_visited = true;
            }
            
        })
    )

    
}
async function showHUD(){
    //Create advance texture

    advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    advancedTexture.idealWidth = 1920;
    advancedTexture.renderAtIdealSize = true;
    advancedTexture.addControl(image);
   
}

function correctAnswer(answerMesh, doorMesh, lockMesh){

    if(answerMesh){
        console.log("Answer mesh: ", answerMesh)
    }
    if(doorMesh){
        console.log("Door mesh: ", doorMesh)
    }
    if(lockMesh){
        console.log("Lock mesh: ", lockMesh)
    }

    console.log("DONE.")

    
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
function edgeRenderForProps(selectableMesh){
    selectableMesh.actionManager = new BABYLON.ActionManager(scene);
    selectableMesh.edgesWidth = 1.0;
    selectableMesh.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    
    //For sound when mouse is clicked
    selectableMesh.actionManager.registerAction(new BABYLON.PlaySoundAction(
        BABYLON.ActionManager.OnPickDownTrigger,new BABYLON.Sound("down", buttonSound, scene)));
    
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


function edgeRenderForSelectables(selectableMesh){
    selectableMesh.actionManager = new BABYLON.ActionManager(scene);
    selectableMesh.edgesWidth = 1.0;
    selectableMesh.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
    
    //For sound when mouse is clicked
    selectableMesh.actionManager.registerAction(new BABYLON.PlaySoundAction(
        BABYLON.ActionManager.OnPickDownTrigger,new BABYLON.Sound("down", buttonSound, scene)));
    
    //For animation when mouse is clicked
    selectableMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnLeftPickTrigger,
        function () {
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

const makeGrabbable = function(model) {
    model.checkCollisions = true;
    edgeRenderForProps(model);
    Object.assign(model, {
        startInteraction(pointerInfo, controllerMesh) {
            this.props = this.props || {}
            if (this.props.grabbedPointerId === undefined) {
                this.props.originalParent = this.parent
            }
            this.props.grabbedPointerId = pointerInfo.event.pointerId
            this.setParent(controllerMesh)
        },
        endInteraction(pointerInfo) {
            if (this.props.grabbedPointerId === pointerInfo.event.pointerId) {
                this.setParent(this.props.originalParent)
                delete this.props.grabbedPointerId
            }
        }
    })
}




