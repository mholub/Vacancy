var SkillParticleSystem = function(meshProto) {
	var mesh = meshProto.clone();
	mesh.position.z = 0.5;
    mesh.position.y = 0.1;

    mesh.rotation.x = Math.PI/2;
    mesh.rotation.y = Math.PI/2;

    var k = 0.03;
    mesh.scale.set(k, k, k);

    return mesh;
}