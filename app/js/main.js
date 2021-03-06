require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
     'vendor/three': { exports: 'THREE' },
     'vendor/threex.windowresize': { exports: 'THREEx' },
     'vendor/FlyControls': {
        deps: ['vendor/three'],
        exports: 'THREE' },
     'vendor/stats': { exports: 'Stats' },
     'vendor/dat.gui': { exports: 'dat' },
     'other/OBJLoader': {
        deps: ['vendor/three'],
        exports: 'THREE' },
    'other/ColladaLoader': {
        deps: ['vendor/three'],
        exports: 'THREE' },
    'shaders/DiscardShader': {
        deps: ['vendor/three'],
        exports: 'THREE' },
    'code/SkillParticleSystem': {
        deps: ['vendor/three'],
        exports: 'SkillParticleSystem' },
 }
}, [
    'vendor/three', 'vendor/threex.windowresize', 'vendor/stats', 'vendor/dat.gui', 'code/SkillParticleSystem', 'vendor/FlyControls',
    'other/OBJLoader', 'other/ColladaLoader', 'shaders/DiscardShader'
], function(THREE, THREEx, Stats, dat, SkillParticleSystem) {

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var skillDatas = [
{
    path: 'skills/__0000_OPENCV.png',
    url: 'http://opencv.org/',
    length: 34
},
{
    path: 'skills/__0001_UX.png',
    url: 'http://en.wikipedia.org/wiki/User_experience',
    length: 11
},
{
    path: 'skills/__0002_NUI.png',
    url: 'http://en.wikipedia.org/wiki/Natural_user_interface',
    length: 15
},
{
    path: 'skills/__0003_KINECT.png',
    url: 'http://www.microsoft.com/en-us/kinectforwindows/',
    length: 31
},
{
    path: 'skills/__0004_RPI.png',
    url: 'http://www.raspberrypi.org/',
    length: 15
},
{
    path: 'skills/__0005_ARDUINO.png',
    url: 'http://arduino.cc/',
    length: 39
},
{
    path: 'skills/__0006_GPGPU.png',
    url: 'http://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units',
    length: 29
},
{
    path: 'skills/__0007_threejs.png',
    url: 'http://threejs.org/',
    length: 38
},
{
    path: 'skills/__0008_shaders.png',
    url: 'http://en.wikipedia.org/wiki/Shader',
    length: 40
},
{
    path: 'skills/__0010_cuda.png',
    url: 'http://www.nvidia.ru/object/cuda_home_new.html',
    length: 23
},
{
    path: 'skills/__0011_qc.png',
    url: 'http://en.wikipedia.org/wiki/Quartz_Composer',
    length: 11
},
{
    path: 'skills/__0012_CG.png',
    url: 'http://en.wikipedia.org/wiki/Computer_graphics',
    length: 11
},
{
    path: 'skills/__0013_media-art.png',
    url: 'http://www.creativeapplications.net/',
    length: 51
},
{
    path: 'skills/__0014_cinema4d.png',
    url: 'http://www.maxon.net/products/cinema-4d-studio/who-should-use-it.html',
    length: 45
},
{
    path: 'skills/__0015_maya.png',
    url: 'http://www.autodesk.com/products/autodesk-maya/overview',
    length: 25
},
{
    path: 'skills/__0016_td.png',
    url: 'http://www.derivative.ca/',
    length: 11
},
{
    path: 'skills/__0017_C%2B%2B.png',
    url: 'http://en.wikipedia.org/wiki/C%2B%2B',
    length: 13
},
{
    path: 'skills/__0018_HOUDINI.png',
    url: 'http://www.sidefx.com/',
    length: 37
},
{
    path: 'skills/__0019_OF.png',
    url: 'http://www.openframeworks.cc/',
    length: 9
},
{
    path: 'skills/__0020_C%23.png',
    url: 'http://en.wikipedia.org/wiki/C_Sharp_(programming_language)',
    length: 11
},
{
    path: 'skills/__0021_WebGL.png',
    url: 'http://www.chromeexperiments.com/webgl/',
    length: 27
},
{
    path: 'skills/__0022_Direct3D.png',
    url: 'http://en.wikipedia.org/wiki/Direct3D',
    length: 44
},
{
    path: 'skills/__0024_HLSL.png',
    url: 'http://en.wikipedia.org/wiki/High-level_shader_language',
    length: 20
},
{
    path: 'skills/__0025_GLSL.png',
    url: 'http://en.wikipedia.org/wiki/OpenGL_Shading_Language',
    length: 20
},
{
    path: 'skills/__0026_Processing.png',
    url: 'https://www.processing.org/exhibition/',
    length: 56
},
{
    path: 'skills/__0027_VVVV.png',
    url: 'http://vvvv.org/',
    length: 23
},
{
    path: 'skills/__0028_Unity3D.png',
    url: 'http://unity3d.com/',
    length: 39
},
{
    path: 'skills/__0029_Flash.png',
    url: 'http://www.adobe.com/devnet/flash.html',
    length: 27
}
];

var skills = [];

var scene, renderer;
var winResize, controls, stats;
var camera;
var group, uiGroup, uiActiveGroup;

// interaction
var mouse = new THREE.Vector2();
var projector = new THREE.Projector();
var raycaster = new THREE.Raycaster();

// other
var clock = new THREE.Clock();

var gui;
var settings = {
    'XY Spread': 43,
    'Z Spread': 455,
    'iterations': 4,
    'damping': 0.92,
    'speed limit': 1000,
    'return speed': 0.2,
    'Test!': function() {
        for (var i = 0; i < skills.length; i++) {
            blowSkill(skills[i]);
        }
    }
};

preloadAssets();
init();
animate();

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

function preloadAssets() {
    for (var i = skillDatas.length - 1; i >= 0; i--) {
        var sd = skillDatas[i];
        sd.texture = THREE.ImageUtils.loadTexture( 'images/' + sd.path, THREE.UVMapping);
        sd.texture.minFilter = THREE.NearestFilter;
        sd.texture.magFilter = THREE.NearestFilter;
        sd.texture.generateMipmaps = false;
    }
}

function init() {
    renderer = new THREE.WebGLRenderer( {
        antialias: true
    } );
    renderer.setClearColor(0xffe300, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //renderer.sortObjects = false;
    document.body.appendChild(renderer.domElement);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    //renderer.setFaceCulling(THREE.CullFaceBack);

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.left = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);


    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.z = 2;
    winResize   = new THREEx.WindowResize(renderer, camera);
    
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffe300, 2, 5 );

    group = new THREE.Object3D();
                    group.position.y = 0;
                    scene.add( group );

    initUI();
    initHeader();
    initSkills();

    controls = new THREE.FlyControls( group, renderer.domElement );
    controls.movementSpeed = 0;
    controls.rollSpeed = -0.2;

    initAmbientShapes();

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'click', onDocumentClick, false );
}

function onDocumentMouseMove( event ) {
    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onDocumentClick( event ) {
    event.preventDefault();

    checkInteraction(function(obj) {
        console.log('click', obj);
        if (obj.name === 'logo') {
            openInNewTab('http://interactivelab.ru');
        } else if (obj.name === 'itsnotme') {
            for (var i = 0; i < skills.length; i++) {
                blowSkill(skills[i]);
            }
        } else if (obj.name === 'itsme') {
            document.location.href = 'http://interactivelab.ru/Jobs';
        }
    });
}

function initHeader() {
    var headerTexture = THREE.ImageUtils.loadTexture( 'images/header.png', THREE.UVMapping, function() {
        var geometry = new THREE.PlaneGeometry( 0.812, 0.093 );
        //var geometry = new THREE.BoxGeometry( 0.222, 0.022, 0.022 );
        var materialHeader = new THREE.MeshBasicMaterial( { color: 0xffe300, map: headerTexture, transparent: true } );
        var header = new THREE.Mesh( geometry, materialHeader );
        header.name = 'header';
        header.position.set(0, 0, 0);
        header.position.y = 0.7;
        header.position.z = 0.5;
        header.scale.set(3, 3, 3);
        //logo.scale.set(5, 5, 5);
        uiGroup.add(header);
    } );
    var headerBackTexture = THREE.ImageUtils.loadTexture( 'images/header_back.png', THREE.UVMapping, function() {
        var geometry = new THREE.PlaneGeometry( 0.812, 0.093 );
        //var geometry = new THREE.BoxGeometry( 0.222, 0.022, 0.022 );
        var materialHeader = new THREE.MeshBasicMaterial( { color: 0xffe300, map: headerBackTexture, transparent: true } );
        var headerBack = new THREE.Mesh( geometry, materialHeader );
        headerBack.name = 'header_back';
        headerBack.position.set(0, 0, 0);
        headerBack.position.y = 0.7;
        headerBack.position.z = 0.47;
        headerBack.scale.set(3, 3, 3);
        //logo.scale.set(5, 5, 5);
        uiGroup.add(headerBack);
    } );
}

function pickSkills() {
    var skills = [];
    var usedIdx = [];
    var l = 0;
    while(true) {
        var randInd = THREE.Math.randInt(0, skillDatas.length - 1);
        var sd = skillDatas[randInd];
        if (l + (sd.length + 2) < 80 && !usedIdx.contains(randInd)) {
            usedIdx.push(randInd);
            skills.push({
                data: sd,
                offset: l + sd.length/2
            });
            l += (sd.length + 5);
        } else {
            break;
        }
    }
    console.log('LENGTH ', l);
    return {
        'skills': skills,
        length: l
    };
}

function initSkills() {
    var loader = new THREE.ColladaLoader();
    loader.load( 'models/grid.dae', function ( collada ) {
        skills = [];

        var gridObj = collada.scene.children[0];
        gridObj.position.z = 0.5;
        gridObj.position.y = 0.1;

        gridObj.rotation.x = Math.PI/2;
        gridObj.rotation.y = Math.PI/2;

        var k = 0.03;
        gridObj.scale.set(k, k, k);

        console.log(gridObj);

        var ss = pickSkills();

        for (var i = 0; i < ss.skills.length; i++) {
            var cs = gridObj.clone();
            cs.userData.alive = false;
            //cs.name = 'skill';
            var uniforms = THREE.UniformsUtils.clone(THREE.DiscardShader.uniforms);

            var mat = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: THREE.DiscardShader.vertexShader,
                fragmentShader: THREE.DiscardShader.fragmentShader,
                transparent: true,
                //wireframe: true
            } );
            console.log(mat);
            if (ss.skills[i]) {
                uniforms.map.value = ss.skills[i].data.texture;
                uniforms.opacity.value = 1;
               // cs.position.x = (-ss.length/2 + ss.skills[i].offset) / 32.0;                
                console.log('Position: ' + cs.position.x);
            } else {
                uniforms.opacity.value = 0;
            }
            //cs.scale.set(0.01, 0.01, 0.001);
            
            //cs.userData.url = skillData[0].url;
            cs.userData.color1 = new THREE.Color().setHSL(THREE.Math.randFloat(0, 1), 1, 0.5);
            cs.userData.color2 = new THREE.Color().setHSL(THREE.Math.randFloat(0, 1), 1, 0.5);
            cs.userData.colodIdx = 0;
            uniforms.color.value = new THREE.Color().set(cs.userData.color1);

            cs.userData.sharedMaterial = mat;
            setSkillMaterial(cs, mat);
            
            cs.position.z = 0.5 + 0.0001 * i; // avoid z-fighting
            skills.push(cs);

            uiActiveGroup.add(cs);

            for (var l = cs.children.length - 1; l >= 0; l--) {
                var c = cs.children[l];
                c.userData.state = 0;
                c.userData.defPos = c.position.clone();
                c.position.z = c.userData.defPos.z + (-ss.length/2 + ss.skills[i].offset);
                c.userData.origPos = c.position.clone();
                c.userData.damping = 0;
                c.userData.velocity = new THREE.Vector3();
            }
        }
    } );
    setInterval(function() {
        for (var i = skills.length - 1; i >= 0; i--) {
            var skill = skills[i];
            if (!skill.userData.alive) {
                if (skill.userData.colorIdx === 0) {
                    skill.userData.colorIdx = 1;
                    skill.userData.sharedMaterial.uniforms.color.value.set(skill.userData.color1);
                } else {
                    skill.userData.colorIdx = 0;
                    skill.userData.sharedMaterial.uniforms.color.value.set(skill.userData.color2);
                }
            }
        }
    }, 1000);
}

function updateSkills(delta) {
    for (var i = skills.length - 1; i >= 0; i--) {
        var skill = skills[i];
        if (skill.userData.alive) {
            for (var l = skill.children.length - 1; l >= 0; l--) {
                var p = skill.children[l];

                if (p.userData.state < settings.iterations) {
                    
                    p.userData.velocity.multiplyScalar(p.userData.damping);
                    p.position.add(p.userData.velocity.clone().multiplyScalar(delta));

                    if (p.userData.velocity.lengthSq() < settings['speed limit']) {
                        p.userData.state += 1;
                        var v = new THREE.Vector3( THREE.Math.randFloatSpread(50), 0, THREE.Math.randFloatSpread(50) )
                            .normalize();
                        v.multiplyScalar(THREE.Math.randFloat(0.8 * settings['XY Spread'], settings['XY Spread']));
                        v.y = THREE.Math.randFloatSpread(settings['Z Spread']);
                        p.userData.velocity = v.clone();
                    }
                } else {
                    p.position.lerp(p.userData.origPos, settings['return speed']);
                }
            }
        }
    }
}

function blowSkill(skill) {
    skill.userData.alive = true;
    skill.userData.state = 'blowStart';
    for (var l = skill.children.length - 1; l >= 0; l--) {
        var p = skill.children[l];
        var v = new THREE.Vector3( THREE.Math.randFloatSpread(50), 0, THREE.Math.randFloatSpread(50) )
        .normalize();
        v.multiplyScalar(THREE.Math.randFloat(0.8 * settings['XY Spread'], settings['XY Spread']));
        v.y = THREE.Math.randFloatSpread(settings['Z Spread']);
        p.userData.velocity = v.clone();
        p.userData.damping = settings.damping;
        p.userData.state = 0;
    }
    console.log('Blow: ', skill);
}

function setSkillMaterial(skill, mat) {
    skill.traverse(function(obj) {
        if (obj instanceof THREE.Mesh) {
            obj.material = mat;
        }
    });
}

function addAmbientShape(shape) {
    var k = 5;

    var x = THREE.Math.randFloat(-k, k);
    var y = THREE.Math.randFloat(-k, k);
    var z = THREE.Math.randFloat(-5, 0);
    var sx = THREE.Math.randFloat(0, 0.2);
    var sy = sx + THREE.Math.randFloat(0, 0.2);
    var ss = THREE.Math.randFloat(0, 1);
    var d = THREE.Math.randFloat(0.05, 0.2);
    var flat = THREE.Math.randFloat(0, 1) > 0.3;

    if (ss > 0.8) {
        addShape( shape, 0x000000, x, y, z, 0, 0, 0, sx, sy, d, flat );
    } else {
        addShape( shape, 0x000000, x, y, z, 0, 0, 0, sx, sx, d, flat );
    }
}

function initAmbientShapes() {
    var sqLength = 1;

    var squareShape = new THREE.Shape();
    squareShape.moveTo( -sqLength/2, -sqLength/2);
    squareShape.lineTo( -sqLength/2, sqLength/2 );
    squareShape.lineTo( sqLength/2, sqLength/2 );
    squareShape.lineTo( sqLength/2, -sqLength/2 );
    squareShape.lineTo( -sqLength/2, -sqLength/2 );

    for (var i = 0; i < 100; i++) {
        addAmbientShape(squareShape);
    }
}

function initLogo() {
    initImage('logo', 'images/logo.png', new THREE.Vector2( 0.222, 0.022 ),
        0xffe300, new THREE.Vector3( 0, -1, 0.5 ), 2);
}

function initImage(name, path, size, color, position, scale) {
   var tex = THREE.ImageUtils.loadTexture( path, THREE.UVMapping, function() {
        console.log(path + ' loaded');
        var geometry = new THREE.PlaneGeometry( size.x, size.y );
        var material = new THREE.MeshBasicMaterial( { color: color, map: tex, transparent: true } );
        var image = new THREE.Mesh( geometry, material );
        image.name = name;
        image.position.copy(position);
        image.scale.set(scale, scale, scale);
        uiActiveGroup.add(image);
        console.log(image);
    } );
}

function initButtons() {
    initImage('itsme', 'images/itsme.png', new THREE.Vector2( 0.159, 0.038 ),
        0x000000, new THREE.Vector3( 0, -0.75, 0.5 ), 3);
    initImage('itsnotme', 'images/itsnotme.png', new THREE.Vector2( 0.336, 0.027 ),
        0x000000, new THREE.Vector3( 0, -0.5, 0.5 ), 3);
}

function initUI() {
    gui = new dat.GUI({height: 100});
    gui.add(settings, 'XY Spread', 0, 1000);
    gui.add(settings, 'Z Spread', 0, 7000);
    gui.add(settings, 'iterations', 0, 50);
    gui.add(settings, 'speed limit', 0, 10000);
    gui.add(settings, 'damping', 0, 1);
    gui.add(settings, 'return speed', 0, 1);
    gui.add(settings, 'Test!');
    gui.close();

    uiGroup = new THREE.Object3D();
    uiGroup.name = 'UI';
    scene.add(uiGroup);
    uiActiveGroup = new THREE.Object3D();
    uiActiveGroup.name = 'Active UI';
    uiGroup.add(uiActiveGroup);

    initLogo();
    initHeader();
    initButtons();
}

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

    target.rotation.x = THREE.Math.clamp(target.rotation.x, -5 * l, 5 * l);
    target.rotation.y = THREE.Math.clamp(target.rotation.y, -5 * l, 5 * l);
}

function addShape( shape, color, x, y, z, rx, ry, rz, sx, sy, d, flat ) {
    var points = shape.createPointsGeometry();

    // flat shape

    if (flat) {
        var geometry = new THREE.ShapeGeometry( shape );

        var mesh = THREE.SceneUtils.createMultiMaterialObject( geometry, [ new THREE.MeshLambertMaterial( { color: color } ) ] );
        mesh.position.set( x, y, z );
        mesh.rotation.set( rx, ry, rz );
        mesh.scale.set( sx, sy, 1 );
        group.add( mesh );
    }
    

    // solid line

    var line = new THREE.Line( points, new THREE.LineBasicMaterial( { color: color, linewidth: 2 } ) );
    line.position.set( x, y, z - d );
    line.rotation.set( rx, ry, rz );
    line.scale.set( sx, sy, 1 );
    group.add( line );
}

function checkInteraction(callback, noCallback) {
    //console.log('checking');

    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );
    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );
    var intersects = raycaster.intersectObjects( uiActiveGroup.children );

    if ( intersects.length > 0 ) {
        // if (intersects[0].object !== uiGroup) {
             callback(intersects[0].object);
        // }
    } else {
        if (noCallback) {
            noCallback();
        }
    }
}

function animate() {
    stats.begin();
    var delta = clock.getDelta();

    updateSkills(delta);

    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.02;
    controls.update( delta );
    limitControls(group, controls);

    var k = 0.05;
    var s = 0.2;
    uiGroup.rotation.set(uiGroup.rotation.x * (1 - k) + s * k * group.rotation.x,
        uiGroup.rotation.y * (1 - k) + s * k * group.rotation.y,
        uiGroup.rotation.z * (1 - k) + s * k * group.rotation.z);

    checkInteraction(function() {
        document.body.style.cursor = 'pointer';
    }, function() {
        document.body.style.cursor = 'auto';
    });

    renderer.render(scene, camera);

    stats.end();
}

});
