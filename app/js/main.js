require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
     'vendor/three': { exports: 'THREE' },
     'vendor/threex.windowresize': { exports: 'THREEx' },
     'vendor/FlyControls': { exports: 'THREE' },
    }
}, [
    'vendor/three', 'vendor/threex.windowresize', 'vendor/FlyControls'
], function(THREE, THREEx) {

var scene, renderer, winResize, controls;
var camera, cameraParent;
var geometry, material, mesh;

var clock = new THREE.Clock();

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer( {
        antialias: true
    } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderer.setClearColor(0xffe300, 1);

    cameraParent = new THREE.Object3D();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 2;
    cameraParent.add(camera);
    winResize   = new THREEx.WindowResize(renderer, camera);

    controls = new THREE.FlyControls( cameraParent, renderer.domElement );
    controls.movementSpeed = 0;
    controls.rollSpeed = 0.05;
    
    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        wireframeLinewidth: 3
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    scene.add(cameraParent);
}

function limitControls() {
    var l = 0.2;
    cameraParent.rotation.x = Math.max(-l, Math.min(l, cameraParent.rotation.x));
    cameraParent.rotation.y = Math.max(-l, Math.min(l, cameraParent.rotation.y));
    cameraParent.rotation.z = 0;
}

function animate() {
    var delta = clock.getDelta();
    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    controls.update( delta );
    limitControls();

    renderer.render(scene, camera);
}

});
