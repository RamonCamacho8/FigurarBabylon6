import * as BABYLON from "babylonjs";
import * as GUI from "babylonjs-gui"

export function GUI2D2(scene) {

    
    var sphereMaterial = new BABYLON.StandardMaterial();

     //Creation of 6 spheres
     var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 10.0, 1.0, scene);
     var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 2.0, 1.0, scene);//Only two segments
     var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 10.0, 1.0, scene);
     var sphere4 = BABYLON.Mesh.CreateSphere("Sphere4", 10.0, 0.5, scene);
     var sphere5 = BABYLON.Mesh.CreateSphere("Sphere5", 10.0, 1.0, scene);
     var sphere6 = BABYLON.Mesh.CreateSphere("Sphere6", 10.0, 1.0, scene);
     var sphere7 = BABYLON.Mesh.CreateSphere("Sphere7", 10.0, 1.0, scene);
 
     //Position the spheres
     sphere1.position.addInPlaceFromFloats(-6,3,0);
     sphere2.position.addInPlaceFromFloats(-4,3,0);
     sphere3.position.addInPlaceFromFloats(-2,3,0);
     sphere4.position.addInPlaceFromFloats(-0,3,0);
     sphere5.position.addInPlaceFromFloats(2,3,0);
     sphere6.position.addInPlaceFromFloats(4,3,0);
     sphere7.position.addInPlaceFromFloats(6,3,0);
     
 
     // Material
     sphere1.material = sphereMaterial;
     sphere2.material = sphereMaterial;
     sphere3.material = sphereMaterial;
     sphere4.material = sphereMaterial;
     sphere5.material = sphereMaterial;
     sphere6.material = sphereMaterial;
     sphere7.material = sphereMaterial;
 
     // GUI
     var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1",true,scene);
 
     var panel = new GUI.StackPanel();  
     panel.width = 0.25;
     panel.rotation = 0.2;
     panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
     advancedTexture.addControl(panel);
 
     var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
     button1.width = 0.2;
     button1.height = "40px";
     button1.color = "white";
     button1.cornerRadius = 20;
     button1.background = "green";
     button1.onPointerUpObservable.add(function() {
         circle.scaleX += 0.1;
     });
     panel.addControl(button1);
 
     var circle = new GUI.Ellipse();
     circle.width = "50px";
     circle.color = "white";
     circle.thickness = 5;
     circle.height = "50px";
     circle.paddingTop = "2px";
     circle.paddingBottom = "2px";
     panel.addControl(circle);
 
     var button2 = GUI.Button.CreateSimpleButton("but2", "Click Me 2");
     button2.width = 0.2;
     button2.height = "40px";
     button2.color = "white";
     button2.background = "green";
     button2.onPointerUpObservable.add(function() {
         circle.scaleX -= 0.1;
     });
     panel.addControl(button2); 
 
     var createLabel = function(mesh) {
         var label = new GUI.Rectangle("label for " + mesh.name);
         label.background = "black"
         label.height = "30px";
         label.alpha = 0.5;
         label.width = "100px";
         label.cornerRadius = 20;
         label.thickness = 1;
         label.linkOffsetY = 30;
         advancedTexture.addControl(label); 
         label.linkWithMesh(mesh);
 
         var text1 = new GUI.TextBlock();
         text1.text = mesh.name;
         text1.color = "white";
         label.addControl(text1);  
     }  
 
     createLabel(sphere1);
     createLabel(sphere2);
     createLabel(sphere3);
     createLabel(sphere4);
     createLabel(sphere5);
     createLabel(sphere6);
 
     var label = new GUI.Rectangle("label for " + sphere7.name);
     label.background = "black"
     label.height = "30px";
     label.alpha = 0.5;
     label.width = "100px";
     label.cornerRadius = 20;
     label.thickness = 1;
     label.linkOffsetY = 30;
     label.top = "10%";
     label.zIndex = 5;
     label.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;    
     advancedTexture.addControl(label); 
 
     var text1 = new GUI.TextBlock();
     text1.text = sphere7.name;
     text1.color = "white";
     label.addControl(text1);    
 
     var line = new GUI.Line();
     line.alpha = 0.5;
     line.lineWidth = 5;
     line.dash = [5, 10];
     advancedTexture.addControl(line); 
     line.linkWithMesh(sphere7);
     line.connectedControl = label;
 
     var endRound = new GUI.Ellipse();
     endRound.width = "10px";
     endRound.background = "black";
     endRound.height = "10px";
     endRound.color = "white";
     advancedTexture.addControl(endRound);
     endRound.linkWithMesh(sphere7);
 
     // Plane
     var plane = BABYLON.Mesh.CreatePlane("plane", 20);
     plane.parent = sphere4;
     plane.position.y = -10;
 
     // GUI
     var advancedTexture2 = GUI.AdvancedDynamicTexture.CreateForMesh(plane);
 
     var panel2 = new GUI.StackPanel();  
     panel2.top = "100px";
     advancedTexture2.addControl(panel2);    
 
     var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
     button1.width = 0.2;
     button1.height = "100px";
     button1.color = "white";
     button1.fontSize = 50;
     button1.background = "green";
     panel2.addControl(button1);
 
     var textblock = new GUI.TextBlock();
     textblock.height = "150px";
     textblock.fontSize = 100;
     textblock.text = "please pick an option:";
     panel2.addControl(textblock);   
 
     var addRadio = function(text, parent) {
 
         var button = new GUI.RadioButton();
         button.width = "40px";
         button.height = "40px";
         button.color = "white";
         button.background = "green";     
 
         button.onIsCheckedChangedObservable.add(function(state) {
             if (state) {
                 textblock.text = "You selected " + text;
             }
         }); 
 
         var header = GUI.Control.AddHeader(button, text, "400px", { isHorizontal: true, controlFirst: true });
         header.height = "100px";
         header.children[1].fontSize = 80;
         header.children[1].onPointerDownObservable.add(function() {
             button.isChecked = !button.isChecked;
         });
 
         parent.addControl(header);    
     }
 
 
     addRadio("option 1", panel2);
     addRadio("option 2", panel2);
     addRadio("option 3", panel2);
     addRadio("option 4", panel2);
     addRadio("option 5", panel2);    
 
     scene.registerBeforeRender(function() {
         panel.rotation += 0.01;
     });
 
     // Another GUI on the right
   var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
     advancedTexture.layer.layerMask = 2;
 
     var panel3 = new GUI.StackPanel();
     panel3.width = "220px";
     panel3.fontSize = "14px";
     panel3.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
     panel3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
     advancedTexture.addControl(panel3);
 
     var checkbox = new GUI.Checkbox();
     checkbox.width = "20px";
     checkbox.height = "20px";
     checkbox.isChecked = true;
     checkbox.color = "green";
 
     var panelForCheckbox = GUI.Control.AddHeader(checkbox, "checkbox", "180px", { isHorizontal: true, controlFirst: true});
     panelForCheckbox.color = "white";
     panelForCheckbox.height = "20px";
     panelForCheckbox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
     panel3.addControl(panelForCheckbox); 
 
     var header = new GUI.TextBlock();
     header.text = "Slider:";
     header.height = "40px";
     header.color = "white";
     header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
     header.paddingTop = "10px";
     panel3.addControl(header); 
 
     var slider = new GUI.Slider();
     slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
     slider.minimum = 0;
     slider.maximum = 2 * Math.PI;
     slider.color = "green";
     slider.value = 0;
     slider.height = "20px";
     slider.width = "200px";
     panel3.addControl(slider);   
 
     header = new GUI.TextBlock();
     header.text = "Sphere diffuse:";
     header.height = "40px";
     header.color = "white";
     header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
     header.paddingTop = "10px";
     panel3.addControl(header);      
 
     var picker = new GUI.ColorPicker();
     picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
     picker.value = sphereMaterial.diffuseColor;
     picker.height = "150px";
     picker.width = "150px";
     picker.onValueChangedObservable.add(function(value) { // value is a color3
         sphereMaterial.diffuseColor = value;
     });    
     panel3.addControl(picker);  

    
}

export function GUI2D(scene) {

    var sphereMaterial = new BABYLON.StandardMaterial();

    //Creation of 6 spheres
    var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 10.0, 9.0, scene);
    var sphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 2.0, 9.0, scene);//Only two segments
    var sphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 10.0, 9.0, scene);
    var sphere4 = BABYLON.Mesh.CreateSphere("Sphere4", 10.0, 0.5, scene);
    var sphere5 = BABYLON.Mesh.CreateSphere("Sphere5", 10.0, 9.0, scene);
    var sphere6 = BABYLON.Mesh.CreateSphere("Sphere6", 10.0, 9.0, scene);
    var sphere7 = BABYLON.Mesh.CreateSphere("Sphere7", 10.0, 9.0, scene);

    //Position the spheres
    sphere1.position.x = -30;
    sphere2.position.x = -20;
    sphere3.position.x = -10;
    sphere4.position.x = 0;
    sphere5.position.x = 10;
    sphere6.position.x = 20;
    sphere7.position.x = 30;

    // Material
    sphere1.material = sphereMaterial;
    sphere2.material = sphereMaterial;
    sphere3.material = sphereMaterial;
    sphere4.material = sphereMaterial;
    sphere5.material = sphereMaterial;
    sphere6.material = sphereMaterial;
    sphere7.material = sphereMaterial;

    // GUI
    var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("ui1",true,scene);

    var panel = new GUI.StackPanel();  
    panel.width = 0.25;
    panel.rotation = 0.2;
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    advancedTexture.addControl(panel);

    var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
    button1.width = 0.2;
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        circle.scaleX += 0.1;
    });
    panel.addControl(button1);

    var circle = new GUI.Ellipse();
    circle.width = "50px";
    circle.color = "white";
    circle.thickness = 5;
    circle.height = "50px";
    circle.paddingTop = "2px";
    circle.paddingBottom = "2px";
    panel.addControl(circle);

    var button2 = GUI.Button.CreateSimpleButton("but2", "Click Me 2");
    button2.width = 0.2;
    button2.height = "40px";
    button2.color = "white";
    button2.background = "green";
    button2.onPointerUpObservable.add(function() {
        circle.scaleX -= 0.1;
    });
    panel.addControl(button2); 

    var createLabel = function(mesh) {
        var label = new GUI.Rectangle("label for " + mesh.name);
        label.background = "black"
        label.height = "30px";
        label.alpha = 0.5;
        label.width = "100px";
        label.cornerRadius = 20;
        label.thickness = 1;
        label.linkOffsetY = 30;
        advancedTexture.addControl(label); 
        label.linkWithMesh(mesh);

        var text1 = new GUI.TextBlock();
        text1.text = mesh.name;
        text1.color = "white";
        label.addControl(text1);  
    }  

    createLabel(sphere1);
    createLabel(sphere2);
    createLabel(sphere3);
    createLabel(sphere4);
    createLabel(sphere5);
    createLabel(sphere6);

    var label = new GUI.Rectangle("label for " + sphere7.name);
    label.background = "black"
    label.height = "30px";
    label.alpha = 0.5;
    label.width = "100px";
    label.cornerRadius = 20;
    label.thickness = 1;
    label.linkOffsetY = 30;
    label.top = "10%";
    label.zIndex = 5;
    label.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;    
    advancedTexture.addControl(label); 

    var text1 = new GUI.TextBlock();
    text1.text = sphere7.name;
    text1.color = "white";
    label.addControl(text1);    

    var line = new GUI.Line();
    line.alpha = 0.5;
    line.lineWidth = 5;
    line.dash = [5, 10];
    advancedTexture.addControl(line); 
    line.linkWithMesh(sphere7);
    line.connectedControl = label;

    var endRound = new GUI.Ellipse();
    endRound.width = "10px";
    endRound.background = "black";
    endRound.height = "10px";
    endRound.color = "white";
    advancedTexture.addControl(endRound);
    endRound.linkWithMesh(sphere7);

    // Plane
    var plane = BABYLON.MeshBuilder.CreatePlane("plane", {width: 20, height: 20}, scene);
    plane.parent = sphere4;
    plane.position.y = -10;

    // GUI
    var advancedTexture2 = GUI.AdvancedDynamicTexture.CreateForMesh(plane);

    var panel2 = new GUI.StackPanel();  
    panel2.top = "100px";
    advancedTexture2.addControl(panel2);    

    var button1 = GUI.Button.CreateSimpleButton("but1", "Click Me");
    button1.width = 1;
    button1.height = "100px";
    button1.color = "white";
    button1.fontSize = 50;
    button1.background = "green";
    panel2.addControl(button1);

    var textblock = new GUI.TextBlock();
    textblock.height = "150px";
    textblock.fontSize = 100;
    textblock.text = "please pick an option:";
    panel2.addControl(textblock);   

    var addRadio = function(text, parent) {

        var button = new GUI.RadioButton();
        button.width = "40px";
        button.height = "40px";
        button.color = "white";
        button.background = "green";     

        button.onIsCheckedChangedObservable.add(function(state) {
            if (state) {
                textblock.text = "You selected " + text;
            }
        }); 

        var header = GUI.Control.AddHeader(button, text, "400px", { isHorizontal: true, controlFirst: true });
        header.height = "100px";
        header.children[1].fontSize = 80;
        header.children[1].onPointerDownObservable.add(function() {
            button.isChecked = !button.isChecked;
        });

        parent.addControl(header);    
    }


    addRadio("option 1", panel2);
    addRadio("option 2", panel2);
    addRadio("option 3", panel2);
    addRadio("option 4", panel2);
    addRadio("option 5", panel2);    

    scene.registerBeforeRender(function() {
        panel.rotation += 0.01;
    });

    // Another GUI on the right
  var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene);
    advancedTexture.layer.layerMask = 2;

    var panel3 = new GUI.StackPanel();
    panel3.width = "220px";
    panel3.fontSize = "14px";
    panel3.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    panel3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(panel3);

    var checkbox = new GUI.Checkbox();
    checkbox.width = "20px";
    checkbox.height = "20px";
    checkbox.isChecked = true;
    checkbox.color = "green";

    var panelForCheckbox = GUI.Control.AddHeader(checkbox, "checkbox", "180px", { isHorizontal: true, controlFirst: true});
    panelForCheckbox.color = "white";
    panelForCheckbox.height = "20px";
    panelForCheckbox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel3.addControl(panelForCheckbox); 

    var header = new GUI.TextBlock();
    header.text = "Slider:";
    header.height = "40px";
    header.color = "white";
    header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.paddingTop = "10px";
    panel3.addControl(header); 

    var slider = new GUI.Slider();
    slider.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    slider.minimum = 0;
    slider.maximum = 2 * Math.PI;
    slider.color = "green";
    slider.value = 0;
    slider.height = "20px";
    slider.width = "200px";
    panel3.addControl(slider);   

    header = new GUI.TextBlock();
    header.text = "Sphere diffuse:";
    header.height = "40px";
    header.color = "white";
    header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    header.paddingTop = "10px";
    panel3.addControl(header);      

    var picker = new GUI.ColorPicker();
    picker.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    picker.value = sphereMaterial.diffuseColor;
    picker.height = "150px";
    picker.width = "150px";
    picker.onValueChangedObservable.add(function(value) { // value is a color3
        sphereMaterial.diffuseColor = value;
    });    
    panel3.addControl(picker);  

    
}

export function SelectionPanelHelper(scene) {

    var blueMat = new BABYLON.StandardMaterial("blue", scene);
    blueMat.emissiveColor = new BABYLON.Color3(0,0,1);
    
    var redMat = new BABYLON.StandardMaterial("red", scene);
    redMat.emissiveColor = new BABYLON.Color3(1,0,0);
    
    var box = BABYLON.MeshBuilder.CreateBox("box", {}, scene);
    box.position.y = 0.5;


	var toSize = function(isChecked) {
		if (isChecked) {
            box.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
        }
        else {
            box.scaling = new BABYLON.Vector3(1, 1, 1);
        }
	}
	
	var toPlace = function(isChecked) {
		if (isChecked) {
            box.position.y = 1.5;
        }
        else {
            box.position.y = 0.5;
        }
	}
	
	var setColor = function(but) {   
		switch(but) {
            case 0: 
                box.material = blueMat;
            break
            case 1: 
                box.material = redMat;
            break
        }
	}
	
	var orientateY = function(angle) {
		box.rotation.y = angle;
	}
	
    var displayValue = function(value) {
        return BABYLON.Tools.ToDegrees(value) | 0;
    }
	
	var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI",true,scene);

    var selectBox = new GUI.SelectionPanel("sp");
    selectBox.width = 0.25;
    selectBox.height = 0.48;
    selectBox.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    selectBox.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
     
    advancedTexture.addControl(selectBox);

	var transformGroup = new GUI.CheckboxGroup("Transformation");
	transformGroup.addCheckbox("Small", toSize);
    transformGroup.addCheckbox("High", toPlace);
	
	var colorGroup = new GUI.RadioGroup("Color");
	colorGroup.addRadio("Blue", setColor, true);
    colorGroup.addRadio("Red", setColor);
	
	var rotateGroup = new GUI.SliderGroup("Rotation", "S");
	rotateGroup.addSlider("Angle", orientateY, "degs", 0, 2 * Math.PI, 0, displayValue) 

    selectBox.addGroup(transformGroup);
    selectBox.addGroup(colorGroup);
    selectBox.addGroup(rotateGroup);

    
}