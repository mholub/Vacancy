require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
     'vendor/three': { exports: 'THREE' },
     'vendor/threex.windowresize': { exports: 'THREEx' },
     'vendor/FlyControls': {
        deps: ['vendor/three'],
        exports: 'THREE' },
     'vendor/stats': { exports: 'Stats' }
    }
}, [
    'vendor/three', 'vendor/threex.windowresize', 'vendor/stats', 'vendor/FlyControls'
], function(THREE, THREEx, Stats) {

var scene, renderer;
var winResize, controls, stats;
var camera, cameraParent;
var geometry, material, mesh;

var clock = new THREE.Clock();

init();
animate();

function init() {
    renderer = new THREE.WebGLRenderer( {
        antialias: true
    } );
    renderer.setClearColor(0xffe300, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.bottom = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);


    cameraParent = new THREE.Object3D();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 2;
    cameraParent.add(camera);
    winResize   = new THREEx.WindowResize(renderer, camera);

    controls = new THREE.FlyControls( cameraParent, renderer.domElement );
    controls.movementSpeed = 0;
    controls.rollSpeed = 0.2;
    
    scene = new THREE.Scene();

    geometry = new THREE.TorusGeometry(1, 0.2, 16, 32);
    material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        wireframeLinewidth: 2
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    scene.add(cameraParent);
}

// hard limit
function limitControls(target) {
    var l = 0.1;
    var k = 0.98;
    target.rotation.z = 0;

    if (Math.abs(target.rotation.x) > l) {
        target.rotation.x = k * target.rotation.x + (1 - k) * THREE.Math.sign(target.rotation.x) * l;
    }
    if (Math.abs(target.rotation.y) > l) {
        target.rotation.y = k * target.rotation.y + (1 - k) * THREE.Math.sign(target.rotation.y) * l;
    }
    // target.rotation.x = THREE.Math.clamp(target.rotation.x, -l, l);
    // target.rotation.y = THREE.Math.clamp(target.rotation.y, -l, l);
}

function animate() {
    stats.begin();

    var delta = clock.getDelta();
    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    controls.update( delta );
    limitControls(cameraParent, controls);

    renderer.render(scene, camera);

    stats.end();
}

});
