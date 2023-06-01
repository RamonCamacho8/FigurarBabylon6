import * as BABYLON from '@babylonjs/core'



/**
 * Creates a default playground with collisions
 * @param {Number} playground_width the width of the playground (x axis dimension)
 * @param {Number} playground_depth the depth of the playground (z axis dimension)
 * @param {Number} walls_width the thickness of the walls
 * @param {Number} walls_height the height of the walls
 * @param {BABYLON.Scene} scene 
 * @returns the generated playground
 */
export function PlayGround({playground_width=50,playground_depth=50,walls_width=5,walls_height=10}={},scene) {

    var ground =  BABYLON.MeshBuilder.CreateGround("ground", { width: playground_width, height: playground_depth, subdivisionsX: 50, subdivisionsY: 50 },scene)

    var wallF =  BABYLON.MeshBuilder.CreateBox("wallF", { width: playground_width, height: walls_height, depth: walls_width },scene)
    wallF.position.set(0, walls_height/2, playground_depth/2+walls_width/2)

    var wallB =  BABYLON.MeshBuilder.CreateBox("wallB", { width: playground_width, height: walls_height, depth: walls_width },scene)
    wallB.position.set(0, walls_height/2, -playground_depth/2-walls_width/2)

    var wallL = BABYLON.MeshBuilder.CreateBox("wallL", { width: walls_width, height: walls_height, depth: playground_depth },scene)
    wallL.position.set(-playground_width/2-walls_width/2, walls_height/2, 0)

    var wallR = BABYLON.MeshBuilder.CreateBox("wallR", { width: walls_width, height: walls_height, depth: playground_depth },scene)
    wallR.position.set(playground_width/2+walls_width/2, walls_height/2 ,0)

    wallF.visibility=0.1;
    wallB.visibility=0.1;
    wallL.visibility=0.1;
    wallR.visibility=0.1;

    ground.checkCollisions=true;
    wallF.checkCollisions=true;
    wallB.checkCollisions=true;
    wallL.checkCollisions=true;
    wallR.checkCollisions=true;

    ground.addChild(wallF);
    ground.addChild(wallB);
    ground.addChild(wallL);
    ground.addChild(wallR);


    return {ground, wallF, wallB, wallL, wallR};

}