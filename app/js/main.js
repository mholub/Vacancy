require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
     'vendor/three': { exports: 'THREE' },
     'vendor/threex.windowresize': { exports: 'THREEx' },
    }
}, [
    'vendor/three', 'vendor/threex.windowresize'
], function(THREE, THREEx) {

var camera, scene, renderer, winResize;
var geometry, material, mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    geometry = new THREE.BoxGeometry(200, 200, 200);
    material = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true,
        linewidth: 3
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer( {
        antialias: true
    } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    winResize   = new THREEx.WindowResize(renderer, camera);

    renderer.setClearColor(0xffe300, 1);

    document.body.appendChild(renderer.domElement);

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(animate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    renderer.render(scene, camera);

}

});
