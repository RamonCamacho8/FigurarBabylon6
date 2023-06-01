import * as BABYLON from "babylonjs";

/**
 * General events example: OnPointerObservable using PointerEventsTypes and OnKeyBoardObservable using KeyboardEventTypes.
 * check console.log to see the called events.
 * @param {BABYLON.Scene} scene The instanced babylonjs scene.
 */ 
export function GeneralEvents(scene) {

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                console.log("POINTER DOWN");
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                console.log("POINTER UP");
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                console.log("POINTER MOVE");
                break;
            case BABYLON.PointerEventTypes.POINTERWHEEL:
                console.log("POINTER WHEEL");
                break;
            case BABYLON.PointerEventTypes.POINTERPICK:
                console.log("POINTER PICK");
                break;
            case BABYLON.PointerEventTypes.POINTERTAP:
                console.log("POINTER TAP");
                break;
            case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                console.log("POINTER DOUBLE-TAP");
                break;
        }
    });

    scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
                console.log("KEY DOWN: ", kbInfo.event.key);
                break;
            case BABYLON.KeyboardEventTypes.KEYUP:
                console.log("KEY UP: ", kbInfo.event.keyCode);
                break;
        }
    });


}

/**
 * Drag events example: using scene.pick() function and OnPointerObsevable.
 * @param {BABYLON.Camera} camera The instanced babylonjs camera.
 * @param {BABYLON.Mesh} ground The instanced mesh that represents the ground of a scene.
 * @param {HTMLCanvasElement} canvas The canvas used to render the session.
 * @param {BABYLON.Scene} scene The instanced babylon scene.
 */
export function DragEvents(camera,ground,canvas,scene) {


    var startingPoint;
    var currentMesh;

    var getGroundPosition = function () {
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    var pointerDown = function (mesh) {
        currentMesh = mesh;
        startingPoint = getGroundPosition();
        if (startingPoint) { // we need to disconnect camera from canvas
            setTimeout(function () {
                camera.detachControl(canvas);
            }, 0);
        }
    }

    var pointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas, true);
            startingPoint = null;
            return;
        }
    }

    var pointerMove = function () {
        if (!startingPoint) {
            return;
        }
        var current = getGroundPosition();
        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERDOWN:
                if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != ground) {
                    pointerDown(pointerInfo.pickInfo.pickedMesh)
                }
                break;
            case BABYLON.PointerEventTypes.POINTERUP:
                pointerUp();
                break;
            case BABYLON.PointerEventTypes.POINTERMOVE:
                pointerMove();
                break;
        }
    });

}

/**
 * KeyBoard events example: using OnKeyboardObservable and KeyboardEventTypes.
 * @param {BABYLON.Mesh} mesh The mesh to control using AWSD buttons.
 * @param {BABYLON.Scene} scene The instanced babylonjs scene.
 */
export function KeyBoardEvents(mesh,scene) {

	scene.onKeyboardObservable.add((kbInfo) => {
		switch (kbInfo.type) {
			case BABYLON.KeyboardEventTypes.KEYDOWN:
				switch (kbInfo.event.key) {
                    case "a":
                    case "A":
                        mesh.position.x -= 0.1;
                    break
                    case "d":
                    case "D":
                        mesh.position.x += 0.1;
                    break
                    case "w":
                    case "W":
                        mesh.position.y += 0.1;
                    break
                    case "s":
                    case "S":
                        mesh.position.y -= 0.1;
                    break
                }
			break;
            
		}
	});
    
}
