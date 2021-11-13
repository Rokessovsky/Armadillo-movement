// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();


// Initialize uniforms
const lightOffset = { type: 'v3', value: new THREE.Vector3(0.0, 5.0, 5.0) };


const rotationMatrix = {type: 'mat4', value: new THREE.Matrix4()};

// Make corresponding changes in the update function
time = 0;

// Materials: specifying uniforms and shaders 

const sphereMaterial = new THREE.ShaderMaterial();

const coneMaterial = new THREE.ShaderMaterial();

const eyeMaterial = new THREE.ShaderMaterial();

const armadilloFrame = new THREE.Object3D();

let eyeFrame = new THREE.Object3D();
armadilloFrame.position.set(0, 0, -8);

scene.add(armadilloFrame);

armadilloFrame.add(eyeFrame);
eyeFrame.position.set(0,5.3,0);
eyeFrame.rotateY(Math.PI);

const eyeFrameAxesHelper = new THREE.AxesHelper(10);
eyeFrame.add(eyeFrameAxesHelper);



const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightOffset: lightOffset,
    rotationMatrix: rotationMatrix,
  }
});

// Load shaders.t
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/eye.vs.glsl',
  'glsl/eye.fs.glsl',
  'glsl/cone.vs.glsl',
  'glsl/cone.fs.glsl',
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  eyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
  eyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];

  coneMaterial.vertexShader = shaders['glsl/cone.vs.glsl'];
  coneMaterial.fragmentShader = shaders['glsl/cone.fs.glsl'];

});

const armadilloAxesHelper = new THREE.AxesHelper(15);

// Load and place the Armadillo geometry.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, armadilloFrame, function (armadillo) {
  armadillo.rotation.y = Math.PI;
  armadillo.position.y = 5.3
  armadillo.scale.set(0.1, 0.1, 0.1);
  armadillo.add(armadilloAxesHelper);
});

// Create the icecream scoop geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const coneGeometry = new THREE.ConeGeometry(1, -3, 32);
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
scene.add(cone);

cone.position.set(7, 10, 10);
sphere.position.set(0, 2, 0);
cone.add(sphere);
// sphere.parent = cone;
// sphere.position.y += 2;
// cone.position.set(0, 10, 10)
// Eyes (Q1c)
// Create the eye ball geometry
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);


const templateEye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
templateEye1.position.set(-1.5, 6.7, -3);
scene.add(templateEye1);

const templateEye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
templateEye2.position.set(1.5, 6.7, -3);
scene.add(templateEye2);

eyeFrame.add(templateEye1);
eyeFrame.add(templateEye2);

let theta = 0.1;
const constMatrix = rotationMatrix;
// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {

  if (keyboard.pressed("W"))
    armadilloFrame.position.z += 0.3;
  else if (keyboard.pressed("S"))
    armadilloFrame.position.z -= 0.3;
  if (keyboard.pressed("A")) {
    var rMatrix = new THREE.Matrix4().makeRotationY(-Math.PI * 0.05);
    rotationMatrix.value = rotationMatrix.value.multiply(rotationMatrix.value, rMatrix);
    eyeFrame.rotateY(-Math.PI * 0.05);
    // armadilloFrame.rotateY(-0.05);
    // eyeFrame.rotateY(-0.2);
  }else if (keyboard.pressed("D")){
    var rMatrix = new THREE.Matrix4().makeRotationY(Math.PI * 0.05);
    rotationMatrix.value = rotationMatrix.value.multiply(rotationMatrix.value, rMatrix);
    eyeFrame.rotateY(Math.PI * 0.05);
    // armadilloFrame.rotateY(0.05);
    // eyeFrame.rotateY(theta);
    // eyeFrame.rotateY(0.2);
  }

  if (keyboard.pressed("E")){
    var rMatrix = new THREE.Matrix4().makeRotationX(-Math.PI * 0.05);
    rotationMatrix.value = rotationMatrix.value.multiply(rotationMatrix.value, rMatrix);
    eyeFrame.rotateX(-Math.PI * 0.05);
  }
  else if (keyboard.pressed("Q")){
    var rMatrix = new THREE.Matrix4().makeRotationX(Math.PI * 0.05);
    rotationMatrix.value = rotationMatrix.value.multiply(rotationMatrix.value, rMatrix);
    eyeFrame.rotateX(Math.PI * 0.05);
  }


  // The following tells three.js that some uniforms might have changed.
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;
  coneMaterial.needsUpdate = true;
}

// Setup update callback
function update() {
  checkKeyboard();

  time += 1/60; //Assumes 60 frames per second
  cone.position.x = 9.5 * Math.sin(time);
  cone.position.y = 9.5 * Math.sin(time) * Math.cos(time) + 10;

  templateEye1.lookAt(cone.position);
  templateEye2.lookAt(cone.position);

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();