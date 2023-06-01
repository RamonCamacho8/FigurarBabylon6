import * as BABYLON from "babylonjs";




/**
 * Actions examples using babylonjs actions managers.
 * @param {BABYLON.Camera} camera The instanced babylonjs camera.
 * @param {BABYLON.Scene} scene The instanced babylonjs scene.
 */
export function Acciones(camera, scene) {

    var light1 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), scene);
    var light2 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), scene);
    var light3 = new BABYLON.PointLight("omni", new BABYLON.Vector3(0, 50, 0), scene);

    light1.diffuse = BABYLON.Color3.Red();
    light2.diffuse = BABYLON.Color3.Green();
    light3.diffuse = BABYLON.Color3.Blue();

    // Define states
    light1.state = "on";
    light2.state = "on";
    light3.state = "on";


    var redBox = BABYLON.Mesh.CreateBox("red", 2, scene);
    var redMat = new BABYLON.StandardMaterial("ground", scene);
    redMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    redMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    redMat.emissiveColor = BABYLON.Color3.Red();
    redBox.material = redMat;
    redBox.position.x -= 10;

    var greenBox = BABYLON.Mesh.CreateBox("green", 2, scene);
    var greenMat = new BABYLON.StandardMaterial("ground", scene);
    greenMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    greenMat.emissiveColor = BABYLON.Color3.Green();
    greenBox.material = greenMat;
    greenBox.position.z -= 10;

    var blueBox = BABYLON.Mesh.CreateBox("blue", 2, scene);
    var blueMat = new BABYLON.StandardMaterial("ground", scene);
    blueMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    blueMat.emissiveColor = BABYLON.Color3.Blue();
    blueBox.material = blueMat;
    blueBox.position.x += 10;

    // Sphere
    var sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    var sphereMat = new BABYLON.StandardMaterial("ground", scene);
    sphereMat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sphereMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    sphereMat.emissiveColor = BABYLON.Color3.Purple();
    sphere.material = sphereMat;
    sphere.position.z += 10;

    // Rotating donut
    var donut = BABYLON.Mesh.CreateTorus("donut", 2, 1, 16, scene);

    // On pick interpolations
    var LightSwitch3D = function (mesh, color, light) {
        var goToColorAction = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", color, 1000, null, true);

        mesh.actionManager = new BABYLON.ActionManager(scene);

        mesh.actionManager.registerAction(
            new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPickTrigger, light, "diffuse", BABYLON.Color3.Black(), 1000))
            .then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action. 
                goToColorAction,                                                 // First click: root action. Second click: child action. Third click: going back to root action and so on...   
                new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, mesh.material, "wireframe", false)
            ]));

        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPickTrigger, mesh.material, "wireframe", true))
            .then(new BABYLON.DoNothingAction());
            
        mesh.actionManager.registerAction(new BABYLON.SetStateAction(BABYLON.ActionManager.OnPickTrigger, light, "off"))
            .then(new BABYLON.SetStateAction(BABYLON.ActionManager.OnPickTrigger, light, "on"));
    }

    LightSwitch3D(redBox, BABYLON.Color3.Red(), light1);
    LightSwitch3D(greenBox, BABYLON.Color3.Green(), light2);
    LightSwitch3D(blueBox, BABYLON.Color3.Blue(), light3);

    // Conditions
    sphere.actionManager = new BABYLON.ActionManager(scene);
    var condition1 = new BABYLON.StateCondition(sphere.actionManager, light1, "off");
    var condition2 = new BABYLON.StateCondition(sphere.actionManager, light1, "on");

    sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLeftPickTrigger, camera, "target", donut.position, 3000, condition1));
    sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLeftPickTrigger, camera, "position", new BABYLON.Vector3(0, 5, -10), 800, condition2));
    sphere.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLeftPickTrigger, camera, "target", new BABYLON.Vector3(0, 0, 0), 1200, condition2));

    // Over/Out
    var makeOverOut = function (mesh) {
        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
        mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.White()));
        mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh, "scaling", new BABYLON.Vector3(1, 1, 1), 150));
        mesh.actionManager.registerAction(new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh, "scaling", new BABYLON.Vector3(1.1, 1.1, 1.1), 150));
    }

    makeOverOut(redBox);
    makeOverOut(greenBox);
    makeOverOut(blueBox);
    makeOverOut(sphere);

    // scene's actions
    scene.actionManager = new BABYLON.ActionManager(scene);

    var rotate = function (mesh) {
        scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", 0.01));
    }

    rotate(redBox);
    rotate(greenBox);
    rotate(blueBox);


    // Intersections
    donut.actionManager = new BABYLON.ActionManager(scene);

    donut.actionManager.registerAction(new BABYLON.SetValueAction(
        { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: sphere },
        donut, "scaling", new BABYLON.Vector3(1.5, 1.5, 1.5)));

    donut.actionManager.registerAction(new BABYLON.SetValueAction(
        { trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: sphere }
        , donut, "scaling", new BABYLON.Vector3(1, 1, 1)));

    // Animations
    var alpha = 0;
    scene.registerBeforeRender(function () {
        donut.position.x = 10 * Math.cos(alpha);
        donut.position.y = 1;
        donut.position.z = 10 * Math.sin(alpha);
        alpha += 0.01;
    });

}


