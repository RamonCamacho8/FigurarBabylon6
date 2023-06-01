import * as BABYLON from "babylonjs"
import * as  MATERIALS from "babylonjs-materials"


/**
 * function that generates a random color material
 * @param {BABYLON.scene} scene 
 * @returns the random generated material
 */
export function MaterialRandom(scene) {
    var material = new BABYLON.StandardMaterial("material_random", scene);
    material.diffuseColor = BABYLON.Color3.Random();

    return material;
}


/**
 * Helper function to create material from RBG hex string (#ffffff) format
 * @param {string} name string name of the instanced material
 * @param {string} options.diffuseColor_hex hex color string (#ffffff)
 * @param {string} options.specularColor_hex hex color string (#ffffff)
 * @param {string} options.emissiveColor_hex hex color string (#ffffff)
 * @param {string} options.ambientColor_hex hex color string (#ffffff)
 * @param {BABYLON.scene} scene a constructed babylonjs scene
 * @returns the generated standard material
 */
export function MaterialFromRGB_Hex(name, options = { diffuseColor_hex: "", specularColor_hex: "", emissiveColor_hex: '', ambientColor_hex: "" }, scene) {


    var material = new BABYLON.StandardMaterial(name, scene)

    if (options.diffuseColor_hex) {
        material.diffuseColor = BABYLON.Color3.FromHexString(options.diffuseColor_hex)
    }

    if (options.specularColor_hex) {
        material.specularColor = BABYLON.Color3.FromHexString(options.specularColor_hex)
    }

    if (options.emissiveColor_hex) {
        material.emissiveColor = BABYLON.Color3.FromHexString(options.emissiveColor_hex)
    }

    if (options.ambientColor_hex) {
        material.ambientColor = BABYLON.Color3.FromHexString(options.ambientColor_hex)
    }

    return material
}


/**
 * Helper function to create material from textures (URL format)
 * @param {string} name string name of the instanced material
 * @param {string} options.diffuseTexture URL (String) or import of the picture to load as a texture
 * @param {string} options.specularTexture URL (String) or import of the picture to load as a texture
 * @param {string} options.emisissiveTexture URL (String) or import of the picture to load as a texture
 * @param {string} options.ambientTexture URL (String) or import of the picture to load as a texture
 * @param {BABYLON.scene} scene a constructed babylonjs scene
 * @returns the generated material
 */
export function MaterialFromTexture(name, options={ diffuseTexture:"", specularTexture:"", emisissiveTexture:"", ambientTexture:"" }, scene) {


    var material = new BABYLON.StandardMaterial(name, scene)

    if (options.diffuseTexture) {
        material.diffuseTexture = new BABYLON.Texture(options.diffuseTexture, scene)
    }

    if (options.specularTexture) {
        material.specularTexture = new BABYLON.Texture(options.specularTexture, scene)
    }

    if (options.emisissiveTexture) {
        material.emissiveTexture = new BABYLON.Texture(options.emisissiveTexture, scene)
    }

    if (options.ambientTexture) {
        material.ambientTexture = new BABYLON.Texture(options.ambientTexture, scene)
    }

    return material
}

export function ToonMaterial(name, scene){
var nodeMaterial = new BABYLON.NodeMaterial(name, scene);

// InputBlock
var position = new BABYLON.InputBlock("position");
position.visibleInInspector = false;
position.visibleOnFrame = false;
position.target = 1;
position.setAsAttribute("position");

// TransformBlock
var WorldPos = new BABYLON.TransformBlock("WorldPos");
WorldPos.visibleInInspector = false;
WorldPos.visibleOnFrame = false;
WorldPos.target = 1;
WorldPos.complementZ = 0;
WorldPos.complementW = 1;

// InputBlock
var World = new BABYLON.InputBlock("World");
World.visibleInInspector = false;
World.visibleOnFrame = false;
World.target = 1;
World.setAsSystemValue(BABYLON.NodeMaterialSystemValues.World);

// TransformBlock
var WorldnormalN = new BABYLON.TransformBlock("World normal (N)");
WorldnormalN.visibleInInspector = false;
WorldnormalN.visibleOnFrame = false;
WorldnormalN.target = 1;
WorldnormalN.complementZ = 0;
WorldnormalN.complementW = 0;

// InputBlock
var normal = new BABYLON.InputBlock("normal");
normal.visibleInInspector = false;
normal.visibleOnFrame = false;
normal.target = 1;
normal.setAsAttribute("normal");

// VectorSplitterBlock
var N = new BABYLON.VectorSplitterBlock("N");
N.visibleInInspector = false;
N.visibleOnFrame = false;
N.target = 4;

// NormalizeBlock
var NNormalize = new BABYLON.NormalizeBlock("N Normalize");
NNormalize.visibleInInspector = false;
NNormalize.visibleOnFrame = false;
NNormalize.target = 4;

// DotBlock
var NdotL = new BABYLON.DotBlock("N dot L");
NdotL.visibleInInspector = false;
NdotL.visibleOnFrame = false;
NdotL.target = 4;

// NormalizeBlock
var LNormalize = new BABYLON.NormalizeBlock("L Normalize");
LNormalize.visibleInInspector = false;
LNormalize.visibleOnFrame = false;
LNormalize.target = 4;

// LightInformationBlock
var Lightinformation = new BABYLON.LightInformationBlock("Light information");
Lightinformation.visibleInInspector = false;
Lightinformation.visibleOnFrame = false;
Lightinformation.target = 1;

// ScaleBlock
var DiffuseLightningCALC = new BABYLON.ScaleBlock("Diffuse Lightning CALC");
DiffuseLightningCALC.visibleInInspector = false;
DiffuseLightningCALC.visibleOnFrame = false;
DiffuseLightningCALC.target = 4;

// StepBlock
var Step = new BABYLON.StepBlock("Step");
Step.visibleInInspector = false;
Step.visibleOnFrame = false;
Step.target = 4;

// InputBlock
var StepFloat = new BABYLON.InputBlock("StepFloat");
StepFloat.visibleInInspector = false;
StepFloat.visibleOnFrame = false;
StepFloat.target = 1;
StepFloat.value = 0.01;
StepFloat.min = 0;
StepFloat.max = 0;
StepFloat.isBoolean = false;
StepFloat.matrixMode = 0;
StepFloat.animationType = BABYLON.AnimatedInputBlockTypes.None;
StepFloat.isConstant = false;

// MultiplyBlock
var SpecularFactor = new BABYLON.MultiplyBlock("Specular Factor");
SpecularFactor.visibleInInspector = false;
SpecularFactor.visibleOnFrame = false;
SpecularFactor.target = 4;

// DotBlock
var NDotH = new BABYLON.DotBlock("N Dot H");
NDotH.visibleInInspector = false;
NDotH.visibleOnFrame = false;
NDotH.target = 4;

// NormalizeBlock
var HNormalize = new BABYLON.NormalizeBlock("H Normalize");
HNormalize.visibleInInspector = false;
HNormalize.visibleOnFrame = false;
HNormalize.target = 4;

// AddBlock
var H = new BABYLON.AddBlock("H");
H.visibleInInspector = false;
H.visibleOnFrame = false;
H.target = 4;

// NormalizeBlock
var VNormalize = new BABYLON.NormalizeBlock("V Normalize");
VNormalize.visibleInInspector = false;
VNormalize.visibleOnFrame = false;
VNormalize.target = 4;

// ViewDirectionBlock
var Viewdirection = new BABYLON.ViewDirectionBlock("View direction");
Viewdirection.visibleInInspector = false;
Viewdirection.visibleOnFrame = false;
Viewdirection.target = 4;

// InputBlock
var cameraPosition = new BABYLON.InputBlock("cameraPosition");
cameraPosition.visibleInInspector = false;
cameraPosition.visibleOnFrame = false;
cameraPosition.target = 1;
cameraPosition.setAsSystemValue(BABYLON.NodeMaterialSystemValues.CameraPosition);

// DotBlock
var NDotV = new BABYLON.DotBlock("N Dot V");
NDotV.visibleInInspector = false;
NDotV.visibleOnFrame = false;
NDotV.target = 4;

// OneMinusBlock
var OneminusNDotV = new BABYLON.OneMinusBlock("One minus N Dot V");
OneminusNDotV.visibleInInspector = false;
OneminusNDotV.visibleOnFrame = false;
OneminusNDotV.target = 4;

// MultiplyBlock
var Multiply = new BABYLON.MultiplyBlock("Multiply");
Multiply.visibleInInspector = false;
Multiply.visibleOnFrame = false;
Multiply.target = 4;

// PowBlock
var RimFactor = new BABYLON.PowBlock("Rim Factor");
RimFactor.visibleInInspector = false;
RimFactor.visibleOnFrame = false;
RimFactor.target = 4;

// InputBlock
var RimIntensity = new BABYLON.InputBlock("Rim Intensity");
RimIntensity.visibleInInspector = false;
RimIntensity.visibleOnFrame = false;
RimIntensity.target = 1;
RimIntensity.value = 0.8;
RimIntensity.min = 0;
RimIntensity.max = 0;
RimIntensity.isBoolean = false;
RimIntensity.matrixMode = 0;
RimIntensity.animationType = BABYLON.AnimatedInputBlockTypes.None;
RimIntensity.isConstant = false;

// StepBlock
var QuantizedRimintensity = new BABYLON.StepBlock("Quantized Rim intensity");
QuantizedRimintensity.visibleInInspector = false;
QuantizedRimintensity.visibleOnFrame = false;
QuantizedRimintensity.target = 4;

// InputBlock
var RimCutOff = new BABYLON.InputBlock("Rim CutOff");
RimCutOff.visibleInInspector = false;
RimCutOff.visibleOnFrame = false;
RimCutOff.target = 1;
RimCutOff.value = 0.5;
RimCutOff.min = 0;
RimCutOff.max = 0;
RimCutOff.isBoolean = false;
RimCutOff.matrixMode = 0;
RimCutOff.animationType = BABYLON.AnimatedInputBlockTypes.None;
RimCutOff.isConstant = false;

// ScaleBlock
var Scale = new BABYLON.ScaleBlock("Scale");
Scale.visibleInInspector = false;
Scale.visibleOnFrame = false;
Scale.target = 4;

// AddBlock
var SpecularAmbienceDiffuseRim = new BABYLON.AddBlock("Specular + Ambience + Diffuse + Rim");
SpecularAmbienceDiffuseRim.visibleInInspector = false;
SpecularAmbienceDiffuseRim.visibleOnFrame = false;
SpecularAmbienceDiffuseRim.target = 4;

// AddBlock
var SpecularAmbienceDiffuse = new BABYLON.AddBlock("Specular + Ambience + Diffuse");
SpecularAmbienceDiffuse.visibleInInspector = false;
SpecularAmbienceDiffuse.visibleOnFrame = false;
SpecularAmbienceDiffuse.target = 4;

// AddBlock
var AddAmbienttoDiffuse = new BABYLON.AddBlock("Add Ambient to Diffuse");
AddAmbienttoDiffuse.visibleInInspector = false;
AddAmbienttoDiffuse.visibleOnFrame = false;
AddAmbienttoDiffuse.target = 4;

// ScaleBlock
var SpecularLightningCALC = new BABYLON.ScaleBlock("Specular Lightning CALC");
SpecularLightningCALC.visibleInInspector = false;
SpecularLightningCALC.visibleOnFrame = false;
SpecularLightningCALC.target = 4;

// StepBlock
var SpecularCuantized = new BABYLON.StepBlock("Specular Cuantized");
SpecularCuantized.visibleInInspector = false;
SpecularCuantized.visibleOnFrame = false;
SpecularCuantized.target = 4;

// PowBlock
var Pow = new BABYLON.PowBlock("Pow");
Pow.visibleInInspector = false;
Pow.visibleOnFrame = false;
Pow.target = 4;

// MultiplyBlock
var SquareofGlossiness = new BABYLON.MultiplyBlock("Square of Glossiness");
SquareofGlossiness.visibleInInspector = false;
SquareofGlossiness.visibleOnFrame = false;
SquareofGlossiness.target = 4;

// InputBlock
var Glossiness = new BABYLON.InputBlock("Glossiness");
Glossiness.visibleInInspector = false;
Glossiness.visibleOnFrame = false;
Glossiness.target = 1;
Glossiness.value = .1;
Glossiness.min = 0;
Glossiness.max = 0;
Glossiness.isBoolean = false;
Glossiness.matrixMode = 0;
Glossiness.animationType = BABYLON.AnimatedInputBlockTypes.None;
Glossiness.isConstant = false;

// InputBlock
var SpecularCutOff = new BABYLON.InputBlock("Specular CutOff");
SpecularCutOff.visibleInInspector = false;
SpecularCutOff.visibleOnFrame = false;
SpecularCutOff.target = 1;
SpecularCutOff.value = 1;
SpecularCutOff.min = 0;
SpecularCutOff.max = 0;
SpecularCutOff.isBoolean = false;
SpecularCutOff.matrixMode = 0;
SpecularCutOff.animationType = BABYLON.AnimatedInputBlockTypes.None;
SpecularCutOff.isConstant = false;

// MultiplyBlock
var LightSurface = new BABYLON.MultiplyBlock("Light*Surface");
LightSurface.visibleInInspector = false;
LightSurface.visibleOnFrame = false;
LightSurface.target = 4;

// InputBlock
var SurfaceColor = new BABYLON.InputBlock("Surface Color");
SurfaceColor.visibleInInspector = false;
SurfaceColor.visibleOnFrame = false;
SurfaceColor.target = 1;
SurfaceColor.value = new BABYLON.Color3(0.21176470588235294, 0.25098039215686274, 0.9450980392156862);



SurfaceColor.isConstant = false;

// FragmentOutputBlock
var FragmentOutput = new BABYLON.FragmentOutputBlock("FragmentOutput");
FragmentOutput.visibleInInspector = false;
FragmentOutput.visibleOnFrame = false;
FragmentOutput.target = 2;
FragmentOutput.convertToGammaSpace = false;
FragmentOutput.convertToLinearSpace = false;
FragmentOutput.useLogarithmicDepth = false;

// TransformBlock
var WorldPosViewProjectionTransform = new BABYLON.TransformBlock("WorldPos * ViewProjectionTransform");
WorldPosViewProjectionTransform.visibleInInspector = false;
WorldPosViewProjectionTransform.visibleOnFrame = false;
WorldPosViewProjectionTransform.target = 1;
WorldPosViewProjectionTransform.complementZ = 0;
WorldPosViewProjectionTransform.complementW = 1;

// InputBlock
var ViewProjection = new BABYLON.InputBlock("ViewProjection");
ViewProjection.visibleInInspector = false;
ViewProjection.visibleOnFrame = false;
ViewProjection.target = 1;
ViewProjection.setAsSystemValue(BABYLON.NodeMaterialSystemValues.ViewProjection);

// VertexOutputBlock
var VertexOutput = new BABYLON.VertexOutputBlock("VertexOutput");
VertexOutput.visibleInInspector = false;
VertexOutput.visibleOnFrame = false;
VertexOutput.target = 1;

// Connections
position.output.connectTo(WorldPos.vector);
World.output.connectTo(WorldPos.transform);
WorldPos.output.connectTo(WorldPosViewProjectionTransform.vector);
ViewProjection.output.connectTo(WorldPosViewProjectionTransform.transform);
WorldPosViewProjectionTransform.output.connectTo(VertexOutput.vector);
WorldPos.output.connectTo(Lightinformation.worldPosition);
Lightinformation.color.connectTo(AddAmbienttoDiffuse.left);
Lightinformation.color.connectTo(DiffuseLightningCALC.input);
normal.output.connectTo(WorldnormalN.vector);
World.output.connectTo(WorldnormalN.transform);
WorldnormalN.output.connectTo(N.xyzw);
N.xyzOut.connectTo(NNormalize.input);
NNormalize.output.connectTo(NdotL.left);
Lightinformation.direction.connectTo(LNormalize.input);
LNormalize.output.connectTo(NdotL.right);
NdotL.output.connectTo(Step.value);
StepFloat.output.connectTo(Step.edge);
Step.output.connectTo(DiffuseLightningCALC.factor);
DiffuseLightningCALC.output.connectTo(AddAmbienttoDiffuse.right);
AddAmbienttoDiffuse.output.connectTo(SpecularAmbienceDiffuse.left);
Lightinformation.color.connectTo(SpecularLightningCALC.input);
Step.output.connectTo(SpecularFactor.left);
NNormalize.output.connectTo(NDotH.left);
LNormalize.output.connectTo(H.left);
WorldPos.output.connectTo(Viewdirection.worldPosition);
cameraPosition.output.connectTo(Viewdirection.cameraPosition);
Viewdirection.output.connectTo(VNormalize.input);
VNormalize.output.connectTo(H.right);
H.output.connectTo(HNormalize.input);
HNormalize.output.connectTo(NDotH.right);
NDotH.output.connectTo(SpecularFactor.right);
SpecularFactor.output.connectTo(Pow.value);
Glossiness.output.connectTo(SquareofGlossiness.left);
Glossiness.output.connectTo(SquareofGlossiness.right);
SquareofGlossiness.output.connectTo(Pow.power);
Pow.output.connectTo(SpecularCuantized.value);
SpecularCutOff.output.connectTo(SpecularCuantized.edge);
SpecularCuantized.output.connectTo(SpecularLightningCALC.factor);
SpecularLightningCALC.output.connectTo(SpecularAmbienceDiffuse.right);
SpecularAmbienceDiffuse.output.connectTo(SpecularAmbienceDiffuseRim.left);
Lightinformation.color.connectTo(Scale.input);
NNormalize.output.connectTo(NDotV.left);
VNormalize.output.connectTo(NDotV.right);
NDotV.output.connectTo(OneminusNDotV.input);
OneminusNDotV.output.connectTo(Multiply.left);
NdotL.output.connectTo(RimFactor.value);
RimIntensity.output.connectTo(RimFactor.power);
RimFactor.output.connectTo(Multiply.right);
Multiply.output.connectTo(QuantizedRimintensity.value);
RimCutOff.output.connectTo(QuantizedRimintensity.edge);
QuantizedRimintensity.output.connectTo(Scale.factor);
Scale.output.connectTo(SpecularAmbienceDiffuseRim.right);
SpecularAmbienceDiffuseRim.output.connectTo(LightSurface.left);
SurfaceColor.output.connectTo(LightSurface.right);
LightSurface.output.connectTo(FragmentOutput.rgb);

// Output nodes
nodeMaterial.addOutputNode(VertexOutput);
nodeMaterial.addOutputNode(FragmentOutput);
nodeMaterial.build();

return nodeMaterial;
}


