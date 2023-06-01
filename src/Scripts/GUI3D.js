import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui"

export function HorizontalPanel(scene) {

    // Create the 3D UI manager
    var manager = new GUI.GUI3DManager(scene);
    var anchor = new BABYLON.TransformNode("");


    var panel = new GUI.PlanePanel();
    panel.margin = 0.2;

    manager.addControl(panel);
    panel.linkToTransformNode(anchor);
    panel.position.z = -1.5;

    // Let's add some buttons!
    var addButton = function() {
        var button = new GUI.HolographicButton("orientation");
        panel.addControl(button);

        button.text = "Button #" + panel.children.length;
    }

    panel.blockLayout = true;
    for (var index = 0; index < 60; index++) {
        addButton();    
    }
    panel.blockLayout = false;

}

export function SpherePanel(scene) {
    // Create the 3D UI manager
    var manager = new GUI.GUI3DManager(scene);

    // Create a horizontal stack panel
    var panel = new GUI.SpherePanel();

    manager.addControl(panel);
    panel.position.z = -1.5;

    // Let's add some buttons!
    var addButton = function () {
        var button = new GUI.HolographicButton("orientation");
        panel.addControl(button);

        button.text = "Button #" + panel.children.length;
    }

    panel.blockLayout = true;
    for (var index = 0; index < 60; index++) {
        addButton();
    }
    panel.blockLayout = false;

}


export function StackPanel(scene){
     // Create the 3D UI manager
     var manager = new GUI.GUI3DManager(scene);

     // Create a horizontal stack panel
     var panel = new GUI.StackPanel3D();
     panel.margin = 0.02;
   
     manager.addControl(panel);
     panel.position.z = -1.5;
 
     // Let's add some buttons!
     var addButton = function() {
         var button = new GUI.Button3D("orientation");
         panel.addControl(button);
         button.onPointerUpObservable.add(function(){
             panel.isVertical = !panel.isVertical;
         });   
         
         var text1 = new GUI.TextBlock();
         text1.text = "change orientation";
         text1.color = "white";
         text1.fontSize = 24;
         button.content = text1;  
     }
 
     addButton();    
     addButton();
     addButton();
}


export function HolographicSlate(scene) {
    var manager = new GUI.GUI3DManager(scene);

    // Let's add a slate
    const slate = new GUI.HolographicSlate("down");
    slate.minDimensions = new BABYLON.Vector2(5, 5);
    slate.dimensions = new BABYLON.Vector2(5, 5);
    slate.titleBarHeight = 0.75;
    slate.title = "Cats!";
    manager.addControl(slate);
    slate.content = new GUI.Image("random", "https://picsum.photos/300/300");
    slate.position = new BABYLON.Vector3(20, 10, -8);

}