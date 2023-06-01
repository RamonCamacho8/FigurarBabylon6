
import * as BABYLON from "babylonjs";


export function GizmoInterface(scene) {


    var attachedMesh = null;
    var attachedMesh_mass = 0;
    var holding = false;

    const gizmoManager = new BABYLON.GizmoManager(scene, 1);


    gizmoManager.scaleGizmoEnabled = false;
    gizmoManager.positionGizmoEnabled = false;
    gizmoManager.rotationGizmoEnabled = false;
    gizmoManager.boundingBoxGizmoEnabled = true;

    gizmoManager.gizmos.boundingBoxGizmo.fixedDragMeshBoundsSize=true;
    gizmoManager.gizmos.boundingBoxGizmo.ignoreChildren=true;
    

    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.clearGizmoOnEmptyPointerEvent = true;


    scene.onPointerObservable.add((pointerInfo) => {
       

        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (!holding && pointerInfo.pickInfo.pickedMesh && pointerInfo.pickInfo.pickedMesh.XRpickable) {
                  
                    holding = true;
                    attachedMesh = pointerInfo.pickInfo.pickedMesh;
                    gizmoManager.attachToMesh(attachedMesh);
                    
                    if (attachedMesh.physicsImpostor) {
                       
                      
                        attachedMesh_mass = attachedMesh.physicsImpostor.mass;
                        attachedMesh.physicsImpostor.setMass(0);
                       

                    }
                }

                if (!holding && pointerInfo.pickInfo.pickedMesh && !pointerInfo.pickInfo.pickedMesh.XRpickable) {
                    attachedMesh = null;
                    gizmoManager.attachToMesh(null);
                }

                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                if (holding && attachedMesh) {
                    holding = false;
                    if (attachedMesh.physicsImpostor) {
                        attachedMesh.physicsImpostor.setMass(attachedMesh_mass);
                    }

                }

            default:
                break;
        }

    })


    scene.onKeyboardObservable.add((keydata) => {

        //keydata.event.key
        switch (keydata.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                console.log("key pressed")
                switch (keydata.event.key) {

                    case "1":
                        gizmoManager.scaleGizmoEnabled = !gizmoManager.scaleGizmoEnabled;                            
                        gizmoManager.positionGizmoEnabled = false;
                        gizmoManager.rotationGizmoEnabled = false;
                        gizmoManager.boundingBoxGizmoEnabled = false;

                        break;
                    case "2":
                        gizmoManager.positionGizmoEnabled = !gizmoManager.positionGizmoEnabled;
                        gizmoManager.scaleGizmoEnabled = false;
                        gizmoManager.rotationGizmoEnabled = false;
                        gizmoManager.boundingBoxGizmoEnabled = false;
                        break;
                    case "3":
                        gizmoManager.rotationGizmoEnabled = !gizmoManager.rotationGizmoEnabled;
                        gizmoManager.scaleGizmoEnabled = false;
                        gizmoManager.positionGizmoEnabled = false;
                        gizmoManager.boundingBoxGizmoEnabled = false;
                        break;
                    case "4":
                        gizmoManager.boundingBoxGizmoEnabled = !gizmoManager.boundingBoxGizmoEnabled;
                        gizmoManager.scaleGizmoEnabled = false;
                        gizmoManager.positionGizmoEnabled = false;
                        gizmoManager.rotationGizmoEnabled = false;
                        break;
                }
                break;

        }

    })

}