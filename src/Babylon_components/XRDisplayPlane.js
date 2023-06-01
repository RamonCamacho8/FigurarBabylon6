
import * as BABYLON from 'babylonjs'
import * as GUI from 'babylonjs-gui';

export default class XRDisplayPlane{

    observables_list = [];

    constructor(width,height,XRPickable,nonXREditable,scene){
        this.scene=scene;

        this.displayPlane = new BABYLON.MeshBuilder.CreatePlane("displayPlaneinfo", {
            width: width,
            height: height 
        }, this.scene);
        
        this.displayPlane.nonXREditable = nonXREditable;
        this.displayPlane.XRPickable = XRPickable;

    //displayPlane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL       


    this.container_texture =  GUI.AdvancedDynamicTexture.CreateForMesh(this.displayPlane);

    var local_pos = new BABYLON.Vector3(0, 1.5, 0);
    
    this.displayPlane.position = local_pos; //position sphere relative to world
    //this.displayPlane.rotation.y = (90 * (Math.PI / 180))
    
 
    var container = new GUI.Rectangle("container")
    //container.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    //container.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
    container.width = 1;
    container.height = 1;
    //container.cornerRadius = 20;
    //container.color = "Orange";
    container.thickness = 0;
    container.background = "white";
    container.alpha=0.05;
    //container.paddingTopInPixels = 15;
    //container.paddingLeftInPixels = 15;
    container.zIndex=-1;


    this.container_texture.addControl(container);
   

    }
    
    displayPlaneRPosition(x,y,z){
        var local_pos = new BABYLON.Vector3(x, y, z);
        this.displayPlane.position = local_pos; 
    }

    displayPlaneRotation(degrees){
        this.displayPlane.rotation.y = (degrees * (Math.PI / 180))
    }

    setScaleToInPixels(width,height){
        this.container_texture.scaleTo(width,height)
    }

    idealHeight(height){
        this.container_texture.idealHeight =height;
    }

    idealWidth(height){
        this.container_texture.idealWidth=height;
    }

    useSmallestIdeal(bool){
        this.container_texture.useSmallestIdeal = bool;
    }

    addControl(container){        
        this.container_texture.addControl(container);
    }

    open() {


        var openKeys = [];
        openKeys.push({
            frame: 0,
            value: 0 //BABYLON.Vector2.Zero()
        });
        openKeys.push({
            frame: 10,
            value: 1 // new BABYLON.Vector2(1, 1)
        });

        var animationOpen = new BABYLON.Animation(
            'scaleAnimationOpen',
            'scaleX',
            30,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, //VECTOR2,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        animationOpen.setKeys(openKeys);

        let easingFunction = new BABYLON.BounceEase(1, 4);
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        animationOpen.setEasingFunction(easingFunction);

        //container.animations.push(animationOpen);

        //scene.beginAnimation(container, 0, 100, false, 1);
        //scene.beginDirectAnimation(container, [animationOpen], 0, openKeys[openKeys.length-1].frame, false, 1);
        this.scene.beginDirectAnimation( this.displayPlane, [animationOpen], 0, 100, false, 1);

    }

    close() {


        var keys = [];
        keys.push({
            frame: 0,
            value: 1
        });
        keys.push({
            frame: 10,
            value: 0
        });


        var animationClose = new BABYLON.Animation(
            'scaleAnimation',
            'scaleX',
            10,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        animationClose.setKeys(keys);

        let easingFunction = new BABYLON.ExponentialEase(9.7); // BABYLON.QuarticEase()
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        animationClose.setEasingFunction(easingFunction);

        //container.animations.push(animationClose);

        //scene.beginAnimation(container, 0, 100, false, 1, () => {
        //menuPlane.dispose();
        //});

        this.scene.beginDirectAnimation(this.displayPlane, [animationClose], 0, 100, false, 1);

    }

    addObserver(params) {

        this.observables_list.push(params);

    }

    removeObserver(number) {

        this.observables_list.splice(number, 1);
    }

    clearObservers() {

        this.observables_list = [];
    }



}

