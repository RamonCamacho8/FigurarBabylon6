
import * as BABYLON from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";



function createLabel(scene, position, text) {
    var dynamicTexture = new BABYLON.DynamicTexture(
        "dynamicTexture" + text,
        512,
        scene,
        true
    );
    dynamicTexture.hasAlpha = true;
    dynamicTexture.drawText(
        text,
        null,
        null,
        "64px Arial",
        "white",
        "transparent"
    );

    var plane = BABYLON.Mesh.CreatePlane("label" + text, 2, scene);
    plane.scaling.scaleInPlace(3);
    plane.position.copyFrom(position);
    plane.position.y += 2.5;
    plane.position.x += 1.4;
    //plane.rotation.y += Math.PI;
    //plane.rotation.x = Math.PI * 0.5;
    plane.rotation.z += 1;
    plane.material = new BABYLON.PBRMaterial("material" + text, scene);
    plane.material.unlit = true;
    plane.material.backFaceCulling = false;
    plane.material.albedoTexture = dynamicTexture;
    plane.material.useAlphaFromAlbedoTexture = true;
}

function addMat(mesh, col = null) {
    mesh.material = new BABYLON.StandardMaterial("mat" + mesh.name);
    if (!col) {
        col = BABYLON.Color3.Random();
    }
    mesh.material.diffuseColor = col;
    return col;
}

var curX = -8;

export var ballAndSocket = function (scene) {
    let box1 = BABYLON.Mesh.CreateBox("ballAndSocketBox1", 1, scene);
    box1.position.x = curX;
    box1.position.y = 1;
    box1.scaling.y = 0.2;
    const col = addMat(box1);

    let box2 = BABYLON.Mesh.CreateBox("ballAndSocketBox2", 1, scene);
    box2.position.x = curX;
    box2.position.y = 1;
    box2.position.z = -1;
    box2.scaling.y = 0.2;
    addMat(box2, col);

    let agg1 = new BABYLON.PhysicsAggregate(
        box1,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );
    let agg2 = new BABYLON.PhysicsAggregate(
        box2,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 1 },
        scene
    );
    let joint = new BABYLON.BallAndSocketConstraint(
        new BABYLON.Vector3(-0.5, 0, -0.5),
        new BABYLON.Vector3(-0.5, 0, 0.5),
        new BABYLON.Vector3(0, 1, 0),
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    agg1.body.addConstraint(agg2.body, joint);

    createLabel(scene, box1.position, "ball and socket");

    curX += 2;
};

export var distance = function (scene) {
    let sphere1 = BABYLON.Mesh.CreateSphere("distanceSphere1", 5, 1, scene);
    sphere1.position.x = curX;
    sphere1.position.y = 1;
    const col = addMat(sphere1);

    let box1 = BABYLON.Mesh.CreateBox("distanceBox1", 1, scene);
    box1.position = new BABYLON.Vector3(curX, 1, -2);
    addMat(box1, col);

    let agg1 = new BABYLON.PhysicsAggregate(
        sphere1,
        BABYLON.PhysicsShapeType.SPHERE,
        { mass: 0, restitution: 0.9 },
        scene
    );
    let agg2 = new BABYLON.PhysicsAggregate(
        box1,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 0.9 },
        scene
    );

    let distanceJoint = new BABYLON.DistanceConstraint(2, scene);
    agg1.body.addConstraint(agg2.body, distanceJoint);

    createLabel(scene, sphere1.position, "distance");
    curX += 2;
};

export var hinge = function (scene) {
    let box1 = BABYLON.Mesh.CreateBox("hingeBox1", 1, scene);
    box1.position.x = curX;
    box1.position.y = 1;
    box1.scaling.y = 0.2;
    const col = addMat(box1);

    let box2 = BABYLON.Mesh.CreateBox("hingeBox2", 1, scene);
    box2.position.x = curX;
    box2.position.y = 1;
    box2.position.z = -1;
    box2.scaling.y = 0.2;
    addMat(box2, col);

    let agg1 = new BABYLON.PhysicsAggregate(
        box1,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );
    let agg2 = new BABYLON.PhysicsAggregate(
        box2,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 1 },
        scene
    );

    let joint = new BABYLON.HingeConstraint(
        new BABYLON.Vector3(0, 0, -0.5),
        new BABYLON.Vector3(0, 0, 0.5),
        undefined,
        undefined,
        scene
    );
    agg1.body.addConstraint(agg2.body, joint);

    createLabel(scene, box1.position, "hinge");
    curX += 2;
};

export var prismatic = function (scene) {
    let box1 = BABYLON.Mesh.CreateBox("prismaticBox1", 1, scene);
    box1.position.x = curX;
    box1.scaling = new BABYLON.Vector3(0.2, 3, 0.2);
    const col = addMat(box1);

    let box2 = BABYLON.Mesh.CreateBox("prismaticBox2", 1, scene);
    box2.position = new BABYLON.Vector3(curX, 1.5, -0.2);
    box2.scaling = new BABYLON.Vector3(0.2, 0.5, 0.2);
    addMat(box2, col);

    let box3 = BABYLON.Mesh.CreateBox("prismaticBox3", 1, scene);
    box3.position = new BABYLON.Vector3(curX, -1.5, 0);
    box3.scaling = new BABYLON.Vector3(1.5, 0.1, 1.5);
    addMat(box3, col);

    let joint = new BABYLON.PrismaticConstraint(
        new BABYLON.Vector3(0, 0, -0.2),
        new BABYLON.Vector3(0, 0, 0.25),
        new BABYLON.Vector3(0, 1, 0),
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    let agg1 = new BABYLON.PhysicsAggregate(
        box1,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );
    let agg2 = new BABYLON.PhysicsAggregate(
        box2,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 1 },
        scene
    );
    let agg3 = new BABYLON.PhysicsAggregate(
        box3,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );

    agg1.body.addConstraint(agg2.body, joint);
    createLabel(scene, box1.position, "prismatic");
    curX += 2;
};

export var locked = function (scene) {
    let box1 = BABYLON.Mesh.CreateBox("fixedBox1", 1, scene);
    box1.position.x = curX;
    const col = addMat(box1);

    let box2 = BABYLON.Mesh.CreateBox("fixedBox2", 1, scene);
    box2.position = new BABYLON.Vector3(curX, 0, -2);
    addMat(box2, col);

    let joint = new BABYLON.LockConstraint(
        new BABYLON.Vector3(0.5, 0.5, -0.5),
        new BABYLON.Vector3(-0.5, -0.5, 0.5),
        new BABYLON.Vector3(0, 1, 0),
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    let agg1 = new BABYLON.PhysicsAggregate(
        box1,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );
    let agg2 = new BABYLON.PhysicsAggregate(
        box2,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 1 },
        scene
    );

    agg1.body.addConstraint(agg2.body, joint);

    createLabel(scene, box1.position, "locked");

    curX += 2;
};

export var slider = function (scene) {
    let box1 = BABYLON.Mesh.CreateBox("prismaticBox1", 1, scene);
    box1.position.x = curX;
    box1.scaling = new BABYLON.Vector3(0.2, 3, 0.2);
    const col = addMat(box1);

    let box2 = BABYLON.Mesh.CreateBox("prismaticBox2", 1, scene);
    box2.position = new BABYLON.Vector3(curX, 1.5, -0.2);
    box2.scaling = new BABYLON.Vector3(0.2, 0.5, 0.2);
    addMat(box2, col);

    let box3 = BABYLON.Mesh.CreateBox("prismaticBox3", 1, scene);
    box3.position = new BABYLON.Vector3(curX, -1.5, 0);
    box3.scaling = new BABYLON.Vector3(1.5, 0.1, 1.5);
    addMat(box3, col);

    let joint = new BABYLON.SliderConstraint(
        new BABYLON.Vector3(0, 0, -0.2),
        new BABYLON.Vector3(0, 0, 0.25),
        new BABYLON.Vector3(0, 1, 0),
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    let agg1 = new BABYLON.PhysicsAggregate(
        box1,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );
    let agg2 = new BABYLON.PhysicsAggregate(
        box2,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 1 },
        scene
    );
    let agg3 = new BABYLON.PhysicsAggregate(
        box3,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );

    agg1.body.addConstraint(agg2.body, joint);

    createLabel(scene, box1.position, "slider");
    curX += 2;
};

export var sixdof = function (scene) {
    let box1 = BABYLON.Mesh.CreateBox("sixdofBox1", 1, scene);
    box1.position.x = curX;
    const col = addMat(box1);

    let box2 = BABYLON.Mesh.CreateBox("sixdofBox2", 1, scene);
    box2.position = new BABYLON.Vector3(curX, 1.5, -0.2);
    addMat(box2, col);

    let joint = new BABYLON.Physics6DoFConstraint(
        {
            pivotA: new BABYLON.Vector3(0, -0.5, 0),
            pivotB: new BABYLON.Vector3(0, 0.5, 0),
            perpAxisA: new BABYLON.Vector3(1, 0, 0),
            perpAxisB: new BABYLON.Vector3(1, 0, 0),
        },
        [
            {
                axis: BABYLON.PhysicsConstraintAxis.LINEAR_DISTANCE,
                minLimit: 1,
                maxLimit: 2,
            },
        ],
        scene
    );

    let agg1 = new BABYLON.PhysicsAggregate(
        box1,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 0, restitution: 1 },
        scene
    );
    let agg2 = new BABYLON.PhysicsAggregate(
        box2,
        BABYLON.PhysicsShapeType.BOX,
        { mass: 1, restitution: 1 },
        scene
    );

    agg1.body.addConstraint(agg2.body, joint);

    createLabel(scene, box1.position, "6 dof");
    curX += 2;
};