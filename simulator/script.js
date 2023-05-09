import * as THREE from "https://unpkg.com/three@0.119.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.119.0/examples/jsm/controls/OrbitControls.js";
import { GUI } from "https://unpkg.com/three@0.119.0/examples/jsm/libs/dat.gui.module.js";


var camera, scene, renderer;
var cameraControls, effectController;
var arm, forearm, body, handLeft, handRight;
var workspace;
// var gridX = true;
// var gridY = false;
// var gridZ = false;
// var axes = true;
// var ground = true;
var clock = new THREE.Clock();


function fillScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x808080, 2000, 4000);

  // LIGHTS
  var ambientLight = new THREE.AmbientLight(0x222222);
  var light = new THREE.DirectionalLight(0xffffff, 1.0);
  light.position.set(200, 400, 500);
  var light2 = new THREE.DirectionalLight(0xffffff, 1.0);
  light2.position.set(-500, 250, -200);
  scene.add(ambientLight);
  scene.add(light);
  scene.add(light2);

  // Robot definitions
  var robotBaseMaterial = new THREE.MeshPhongMaterial({
    color: 0x6e23bb,
    specular: 0x6e23bb,
    shininess: 20
  });
  var robotForearmMaterial = new THREE.MeshPhongMaterial({
    color: 0xf4c154,
    specular: 0xf4c154,
    shininess: 100
  });
  var robotUpperArmMaterial = new THREE.MeshPhongMaterial({
    color: 0x95e4fb,
    specular: 0x95e4fb,
    shininess: 100
  });
  var robotBodyMaterial = new THREE.MeshPhongMaterial({
    color: 0x279933,
    specular: 0x279933,
    shininess: 100
  });

  var robotHandLeftMaterial = new THREE.MeshPhongMaterial({
    color: 0xcc3399,
    specular: 0xcc3399,
    shininess: 20
  });
  var robotHandRightMaterial = new THREE.MeshPhongMaterial({
    color: 0xdd3388,
    specular: 0xdd3388,
    shininess: 20
  });

  var torus = new THREE.Mesh(
    new THREE.TorusGeometry(22, 15, 32, 32),
    robotBaseMaterial
  );
  torus.rotation.x = (90 * Math.PI) / 180;
  scene.add(torus);

  forearm = new THREE.Object3D();
  var faLength = 80;

  createRobotExtender(forearm, faLength, robotForearmMaterial);

  arm = new THREE.Object3D();
  var uaLength = 120;

  createRobotCrane(arm, uaLength, robotUpperArmMaterial);

  // Move the forearm itself to the end of the upper arm.
  forearm.position.y = uaLength;
  arm.add(forearm);
  // scene.add(arm);

  body = new THREE.Object3D();
  var bodyLength = 60;
  // solution
  createRobotBody(body, bodyLength, robotBodyMaterial);

  // Move the upper arm itself to the end of the body.
  arm.position.y = bodyLength;
  body.add(arm);

  scene.add(body);

  var handLength = 38;

  handLeft = new THREE.Object3D();
  createRobotGrabber(handLeft, handLength, robotHandLeftMaterial);
  // Move the hand part to the end of the forearm.
  handLeft.position.y = faLength;
  forearm.add(handLeft);
  handRight = new THREE.Object3D();
  createRobotGrabber(handRight, handLength, robotHandRightMaterial);
  // Move the hand part to the end of the forearm.
  handRight.position.y = faLength;
  forearm.add(handRight);
}

function createRobotGrabber(part, length, material) {
  var box = new THREE.Mesh(new THREE.CubeGeometry(30, length, 4), material);
  box.position.y = length / 2;
  part.add(box);
}

function createRobotExtender(part, length, material) {
  var cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(22, 22, 6, 32),
    material
  );
  part.add(cylinder);

  var i;
  for (i = 0; i < 4; i++) {
    var box = new THREE.Mesh(new THREE.CubeGeometry(4, length, 4), material);
    box.position.x = i < 2 ? -8 : 8;
    box.position.y = length / 2;
    box.position.z = i % 2 ? -8 : 8;
    part.add(box);
  }

  cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 40, 32),
    material
  );
  cylinder.rotation.x = (90 * Math.PI) / 180;
  cylinder.position.y = length;
  part.add(cylinder);
}

function createRobotCrane(part, length, material) {
  var box = new THREE.Mesh(new THREE.CubeGeometry(18, length, 18), material);
  box.position.y = length / 2;
  part.add(box);

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), material);
  // place sphere at end of arm
  sphere.position.y = length;
  part.add(sphere);
}

function createRobotBody(part, length, material) {
  var cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(50, 12, length / 2, 18),
    material
  );
  cylinder.position.y = length / 4;
  part.add(cylinder);

  cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(12, 50, length / 2, 18),
    material
  );
  cylinder.position.y = (3 * length) / 4;
  part.add(cylinder);

  var box = new THREE.Mesh(
    new THREE.CubeGeometry(12, length / 4, 110),
    material
  );
  box.position.y = length / 2;
  part.add(box);

  var sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 32, 16), material);
  // place sphere at end of arm
  sphere.position.y = length;
  part.add(sphere);
}

function init() {
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight/2;
  var canvasRatio = canvasWidth / canvasHeight;

  // RENDERER
  renderer = new THREE.WebGLRenderer({ antialias: true });
  document.body.appendChild(renderer.domElement);
  renderer.setSize(canvasWidth, canvasHeight);
  renderer.setClearColor(0xaaaaaa, 1.0);

  // CAMERA
  camera = new THREE.PerspectiveCamera(38, canvasRatio, 1, 10000);
  camera.position.set(-1000, 0, 0);
  // CONTROLS
  cameraControls = new OrbitControls(camera, renderer.domElement);
}

function setupGui() {
  effectController = {
    // newGridX: gridX,
    // newGridY: gridY,
    // newGridZ: gridZ,
    // newGround: ground,
    // newAxes: axes,

    // UNCOMMENT FOLLOWING LINE TO SET DEFAULT VALUE OF CONTROLS FOR BODY:
    by: 0.0,

    uy: 70.0,
    uz: -15.0,

    fy: 10.0,
    fz: 60.0,
    
    hz: 30.0,
		htz: 12.0
  };

  var gui = new GUI();
  // var h = gui.addFolder("Grid display");
  // h.add(effectController, "newGridX").name("Show XZ grid");
  // h.add(effectController, "newGridY").name("Show YZ grid");
  // h.add(effectController, "newGridZ").name("Show XY grid");
  // h.add(effectController, "newGround").name("Show ground");
  // h.add(effectController, "newAxes").name("Show axes");
  let h = gui.addFolder("Arm angles manual control");
  // h.add(effectController, "by", -180.0, 180.0, 0.025).name("Body y");
  h.add(effectController, "uy", -180.0, 180.0, 0.025).name("Upper arm y");
  h.add(effectController, "uz", -45.0, 45.0, 0.025).name("Upper arm z");
  h.add(effectController, "fy", -180.0, 180.0, 0.025).name("Forearm y");
  h.add(effectController, "fz", -120.0, 120.0, 0.025).name("Forearm z");
  h.add(effectController, "hz", -45.0, 45.0, 0.025).name("Hand z");
	h.add(effectController, "htz", 2.0, 17.0, 0.025).name("Hand spread");
  animate();
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

function render() {
  var delta = clock.getDelta();
  cameraControls.update(delta);

  // if (
  //   effectController.newGridX !== gridX ||
  //   effectController.newGridY !== gridY ||
  //   effectController.newGridZ !== gridZ ||
  //   effectController.newGround !== ground ||
  //   effectController.newAxes !== axes
  // ) {
  // gridX = effectController.newGridX;
  // gridY = effectController.newGridY;
  // gridZ = effectController.newGridZ;
  // ground = effectController.newGround;
  // axes = effectController.newAxes;

  // fillScene();
  // drawHelpers();
  // }

  // UNCOMMENT FOLLOWING LINES TO ENABLE CONTROLS FOR BODY:

  body.rotation.y = (effectController.by * Math.PI) / 180; // yaw

  arm.rotation.y = (effectController.uy * Math.PI) / 180; // yaw
  arm.rotation.z = (effectController.uz * Math.PI) / 180; // roll

  forearm.rotation.y = (effectController.fy * Math.PI) / 180; // yaw
  forearm.rotation.z = (effectController.fz * Math.PI) / 180; // roll

  handLeft.rotation.z = (effectController.hz * Math.PI) / 180; // yaw
  handLeft.position.z = effectController.htz; // translate

  handRight.rotation.z = (effectController.hz * Math.PI) / 180; // yaw
  handRight.position.z = -effectController.htz;
  
  renderer.render(scene, camera);
}

function blockcontrols() {
  

  Blockly.defineBlocksWithJsonArray([
    // Block for colour picker.
    {
      "type": "change_body_y",
      "lastDummyAlign0": "CENTRE",
      "message0": "Set Upper arm Y angle to %1 °",
      "args0": [
        {
          "type": "field_number",
          "name": "input",
          "value": 70,
          "min": -180,
          "max": 180
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 120,
      "tooltip": "Set Upper arm Y angle",
      "helpUrl": ""
    },
    {
      "type": "change_body_z",
      "lastDummyAlign0": "CENTRE",
      "message0": "Set Upper arm Z angle to %1 °",
      "args0": [
        {
          "type": "field_number",
          "name": "input",
          "value": -15,
          "min": -180,
          "max": 180
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 120,
      "tooltip": "Set Upper arm Z angle",
      "helpUrl": ""
    },
    {
      "type": "change_forearm_y",
      "lastDummyAlign0": "CENTRE",
      "message0": "Set Forearm Y angle to %1 °",
      "args0": [
        {
          "type": "field_number",
          "name": "input",
          "value": 10,
          "min": -180,
          "max": 180
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 210,
      "tooltip": "Set Forearm Y angle",
      "helpUrl": ""
    },
    {
      "type": "change_forearm_z",
      "lastDummyAlign0": "CENTRE",
      "message0": "Set Forearm Z angle to %1 °",
      "args0": [
        {
          "type": "field_number",
          "name": "input",
          "value": 60,
          "min": -180,
          "max": 180
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 210,
      "tooltip": "Set Forearm Z angle",
      "helpUrl": ""
    },
    {
      "type": "change_hand_z",
      "lastDummyAlign0": "CENTRE",
      "message0": "Set Hand Z angle to %1 °",
      "args0": [
        {
          "type": "field_number",
          "name": "input",
          "value": 30,
          "min": -180,
          "max": 180
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 65,
      "tooltip": "Set Hand Z angle",
      "helpUrl": ""
    },
    {
      "type": "change_hand_spread",
      "lastDummyAlign0": "CENTRE",
      "message0": "Set Hand Spread to %1",
      "args0": [
        {
          "type": "field_number",
          "name": "input",
          "value": 12,
          "min": 2,
          "max": 17
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 290,
      "tooltip": "Set Hand Z angle",
      "helpUrl": ""
    },
    {
      "type": "start",
      "message0": "Start",
      "nextStatement": null,
      "colour": 120,
      "tooltip": "",
      "helpUrl": ""
    }
  ]);

  const toolbox = {
    "kind": "categoryToolbox",
    "contents": [
      {
        "kind": "category",
        "name": "Control",
        "contents": [
          {
            "kind": "block",
            "type": "start"
          },
          {
            "kind": "block",
            "type": "controls_if"
          },
          {
            "kind": "block",
            "type": "controls_repeat_ext"
          },
        ]
        
      },
      {
        "kind": "category",
        "name": "Math",
        "contents": [
          {
            "kind": "block",
            "type": "math_number"
          },
          {
            "kind": "block",
            "type": "math_arithmetic"
          },
        ]
      },
      {
        "kind": "category",
        "name": "Logic",
        "contents": [
          {
            "kind": "block",
            "type": "logic_compare"
          },
        ]
      },
      {
        "kind": "category",
        "name": "Robot Arm",
        "contents": [
          {
            "kind": "block",
            "type": "change_body_y"
          },
          {
            "kind": "block",
            "type": "change_body_z"
          },
          {
            "kind": "block",
            "type": "change_forearm_y"
          },
          {
            "kind": "block",
            "type": "change_forearm_z"
          },
          {
            "kind": "block",
            "type": "change_hand_z"
          },
          {
            "kind": "block",
            "type": "change_hand_spread"
          },
        ]
      }
    ]
  }
  
  workspace = Blockly.inject('blocklyDiv', {toolbox: toolbox});

  Blockly.JavaScript['start'] = (block) => {
    var code =`console.log("start");`;
    return code;
  };

  Blockly.JavaScript['change_body_y'] = (block) => {
    var angle_input = block.getFieldValue('input');
    var code =`
            effectController.uy = ${angle_input}; `;
    return code;
  };

  Blockly.JavaScript['change_body_z'] = (block) => {
    var angle_input = block.getFieldValue('input');
    var code =`effectController.uz = ${angle_input};`;
    return code;
  };

  Blockly.JavaScript['change_forearm_y'] = (block) => {
    var angle_input = block.getFieldValue('input');
    var code =`effectController.fy = ${angle_input};`;
    return code;
  };

  Blockly.JavaScript['change_forearm_z'] = (block) => {
    var angle_input = block.getFieldValue('input');
    var code =`effectController.fz = ${angle_input};`;
    return code;
  };

  Blockly.JavaScript['change_hand_z'] = (block) => {
    var angle_input = block.getFieldValue('input');
    var code =`effectController.hz = ${angle_input};`;
    return code;
  };

  Blockly.JavaScript['change_hand_spread'] = (block) => {
    var angle_input = block.getFieldValue('input');
    var code =`effectController.htz = ${angle_input};`;
    return code;
  };

  // function updateCode(event) {
  //   const code = Blockly.JavaScript.workspaceToCode(workspace);
  //   console.log(code);
  //   eval(code)
  //   animate();
  // }


  // workspace.addChangeListener((updateCode));


  
}



init();
fillScene();
blockcontrols()
setupGui();
animate();

var button = document.createElement("Button");
  button.innerHTML = `<a  class="float">
                        <i class="fa fa-play my-float"></i>
                        </a>`;
  
  button.onclick = function(){runCode()};  

  document.body.appendChild(button);

  function runCode() {
    // Generate JavaScript code and run it.
    console.log("YAYY")
    
    var code = Blockly.JavaScript.workspaceToCode(workspace);

    try {
      console.log(code)
      eval(code);
      
      
    } catch (e) {
      console.log("AAA",e);
    }
  }



