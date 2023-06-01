import * as BABYLON from "babylonjs"

/**
 * Defines a default free camera for a babylon js scene
 * @param {HTMLCanvasElement} canvas the instanced HTML canvas interface
 * @param {BABYLON.Scene} scene the instanced babylon js scene
 * @returns the instanced camera
 */
export function FreeCameraDefault(canvas, scene) {

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    return camera;
}

/**
 * Defines an universal camera for a babylon js scene
 * @param {HTMLCanvasElement} canvas the instanced HTML canvas interface
 * @param {BABYLON.Scene} scene the instanced babylon js scene
 * @returns the instanced camera
 */
export function UniversalCameraDefault(canvas, scene) {

    // This creates and positions a universal camera (non-mesh)
    var camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    return camera;
}

/**
 * Defines an Arc rotate camera for a babylon js scene
 * @param {HTMLCanvasElement} canvas the instanced HTML canvas interface
 * @param {BABYLON.Scene} scene the instanced babylon js scene
 * @returns the instanced camera
 */
export function ArcRotateCameraDefault(canvas, scene) {

    // Creates, angles, distances and targets the ArcRotateCamera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

    //This positions the camera
    camera.setPosition(new BABYLON.Vector3(0, 12, -10));

    // This targets the camera to scene origin
    camera.setTarget(new BABYLON.Vector3(0, 0, 0));

    // This attaches the camera to the canvas
    camera.attachControl(canvas, false);

    return camera;
}

/**
 * Defines a default free camera for a babylon js scene
 * @param {HTMLCanvasElement} canvas the instanced HTML canvas interface
 * @param {BABYLON.Mesh} mesh the mesh to follow
 * @param {BABYLON.Scene} scene the instanced babylon js scene
 * @returns the instanced camera
 */
export function FollowCameraDefault(canvas, mesh, scene) {

    //This creates and initially positions a follow camera 	
    var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 10, -10), scene);

    //The goal distance of camera from target
    camera.radius = 30;

    // The goal height of camera above local origin (centre) of target
    camera.heightOffset = 10;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    camera.rotationOffset = 0;

    //Acceleration of camera in moving from current to goal position
    camera.cameraAcceleration = 0.005

    //The speed at which acceleration is halted 
    camera.maxCameraSpeed = 10

    //camera.target is set after the target's creation

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    //Set target for camera
    camera.lockedTarget = mesh;

}