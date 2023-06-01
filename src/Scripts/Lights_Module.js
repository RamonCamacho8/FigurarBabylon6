import * as BABYLON from "babylonjs"


/**
 * Point light: Luz que se define como un punto en el espacio.
 * @param {String} options.diffuseColor  hex color string (#ffffff)
 * @param {String} options.specularColor  hex color string (#ffffff)
 * @param {BABYLON.Scene} scene a constructed babylonjs scene
 * @returns a constructed point light
 */
export function PointLight(options = { diffuseColor: "", specularColor: "" }, scene) {

    options.diffuseColor = options.diffuseColor !== undefined ? options.diffuseColor : "#ffffff";
    options.specularColor = options.specularColor !== undefined ? options.specularColor : "#f5f1ed";


    var pointlight = new BABYLON.PointLight("pointlight", new BABYLON.Vector3(0, 10, 0), scene);
    pointlight.diffuse = new BABYLON.Color3.FromHexString(options.diffuseColor)
    pointlight.specular = new BABYLON.Color3.FromHexString(options.specularColor)

    return pointlight;

}

/**
 * Directional light: Luz que representa iluminacion de forma global y absoluta, tiene un rango infinito.
 * @param {String} options.diffuseColor a hex color string (#ffffff)
 * @param {String} options.specularColor a hex color string (#ffffff)
 * @param {BABYLON.Scene} scene a constructed babylonjs scene
 * @returns a constructed directional light.
 */
export function DirectionalLight(options = { diffuseColor: "", specularColor: "" }, scene) {

    options.diffuseColor = options.diffuseColor !== undefined ? options.diffuseColor : "#ffffff";
    options.specularColor = options.specularColor !== undefined ? options.specularColor : "#f5f1ed";


    var directionallight = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, -1, -5), scene);
    directionallight.diffuse = new BABYLON.Color3.FromHexString(options.diffuseColor);
    directionallight.specular = new BABYLON.Color3.FromHexString(options.specularColor);

    return directionallight;

}

/**
 * Spot light: luz definida por una posicion, direccion, angulo y un exponente, se define como un cono.
 * @param {String} options.diffuseColor a hex color string (#ffffff)
 * @param {String} options.specularColor a hex color string (#ffffff)
 * @param {BABYLON.scene} scene
 * @returns a constructed spotlight
 */
export function SpotLight(options = { diffuseColor: "", specularColor: "" }, scene) {

    options.diffuseColor = options.diffuseColor !== undefined ? options.diffuseColor : "#ffffff";
    options.specularColor = options.specularColor !== undefined ? options.specularColor : "#f5f1ed";

    //Light direction is directly down from a position one unit up, slow decay
    var SpotLight = new BABYLON.SpotLight("spotLight", new BABYLON.Vector3(3, 4, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 2, 10, scene);
    SpotLight.diffuse = new BABYLON.Color3.FromHexString(options.diffuseColor);
    SpotLight.specular = new BABYLON.Color3.FromHexString(options.specularColor);


    return SpotLight;

}

/**
 * Hemispheric light: luz definida por una direccion, usualmente hacia arriba (cielo). Permite simular facilmente luz ambiental.
 * @param {String} options.diffuseColor a hex color string (#ffffff)
 * @param {String} options.specularColor a hex color string (#ffffff)
 * @param {String} options.groundColor a hex color string (#ffffff)
 * @param {BABYLON.Scene} scene 
 * @returns a constructed hemispheric light
 */
export function HemisphericLight(options = { diffuseColor: "", specularColor: "",groundColor:"" }, scene) {

    options.diffuseColor = options.diffuseColor !== undefined ? options.diffuseColor : "#f0f8ff";
    options.specularColor = options.specularColor !== undefined ? options.specularColor : "#237597";
    options.groundColor = options.groundColor !== undefined ? options.groundColor : "#010101";

    var hemisphericlight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 1), scene);
    hemisphericlight.intensity = 0.8;
    hemisphericlight.diffuse = new BABYLON.Color3.FromHexString(options.diffuseColor);
    hemisphericlight.specular = new BABYLON.Color3.FromHexString(options.specularColor);
    hemisphericlight.groundColor = new BABYLON.Color3.FromHexString(options.groundColor);

    return hemisphericlight;

}

/**
 * Spot light from a texture example: usando una imagen png de una ventana.
 * @param {String} textureImport_URL URL (String) or import of the picture to load as a texture
 * @param {BABYLON.Scene} scene
 * @returns a constructed spotlight from a texture
 */
export function EmissiveLightFromTexture(textureImport_URL,scene) {

    var spotLight = new BABYLON.SpotLight("spotlight_texture", new BABYLON.Vector3(10, 15, 10),
        new BABYLON.Vector3(-1, -2, -1), 1.1, 16, scene);
    spotLight.projectionTexture = new BABYLON.Texture(textureImport_URL, scene);
    spotLight.setDirectionToTarget(BABYLON.Vector3.Zero());
    spotLight.intensity = 1.5;

    return spotLight;
}

