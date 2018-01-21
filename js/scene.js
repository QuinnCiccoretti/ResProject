var worldscale = 0.1;
function init_renderer(){
		//set renderer
		renderer = new THREE.WebGLRenderer({ antialias: true, depth:true});
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		renderer.setClearColor (0xffffff, 1);
		// renderer.vr.enabled = true;	//for some reason bricks everything
		document.getElementById( 'viewport' ).appendChild( renderer.domElement );
		//create view in VR button
		document.body.appendChild(WEBVR.createButton( renderer ) );	
}
function init_user(){
	//Init user group
	var user = new THREE.Group();
	user.position.set( 0, 1.6, 0 );
	scene.add( user );
	// Cam
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10 );
	user.add( camera );
	// VIVE controllers
	controller1 = new THREE.ViveController( 0 );
	user.add( controller1 );

	controller2 = new THREE.ViveController( 1 );
	user.add( controller2 );

	var loader = new THREE.OBJLoader();
	loader.setPath( 'models/obj/vive-controller/' );
	loader.load( 'vr_controller_vive_1_5.obj', function ( object ) {

		var loader = new THREE.TextureLoader();
		loader.setPath( 'models/obj/vive-controller/' );

		var controller = object.children[ 0 ];
		controller.material.map = loader.load( 'onepointfive_texture.png' );
		controller.material.specularMap = loader.load( 'onepointfive_spec.png' );

		controller1.add( object.clone() );
		controller2.add( object.clone() );

	} );

}
function init_scene(){
	
	scene = new Physijs.Scene({ fixedTimeStep: 1 / 30});
	
	
	// setting up
	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
	scene.addEventListener(
		'update',		//when physijs rendering is ready
		function() {
		}
		);
	// ambient light
	am_light = new THREE.AmbientLight( 0x444444 );
	scene.add( am_light );

	// directional light
	init_dir_light();

	//Setup materials
	load_materials();
	
	// Table
	table = new Physijs.BoxMesh(
		new THREE.BoxGeometry(50*worldscale, 1, 50*worldscale),
		table_material,
		0, // mass
		{ restitution: 0, friction: 1 }
		);
	table.position.y = -.6;
	table.receiveShadow = true;
	scene.add( table );

	createTower();
	init_bone_meshes();
	for (var i = 0; i < boneMeshes.length; i++) {
		boneMeshes[i].receiveShadow = false;
		boneMeshes[i].castShadow = true;
		scene.add(boneMeshes[i]);
		
	}
	requestAnimationFrame( render );
	scene.simulate();
}
function init_dir_light(){
	dir_light = new THREE.DirectionalLight( 0xFFFFFF );
	dir_light.position.set( 20, 30, -5 );
	dir_light.target.position.copy( scene.position );
	dir_light.castShadow = true;
	dir_light.shadowCameraLeft = -30;
	dir_light.shadowCameraTop = -30;
	dir_light.shadowCameraRight = 30;
	dir_light.shadowCameraBottom = 30;
	dir_light.shadowCameraNear = 20;
	dir_light.shadowCameraFar = 200;
	dir_light.shadowBias = -.001
	dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
	dir_light.shadowDarkness = .5;
	scene.add( dir_light );
}
function load_materials(){
	// Loader
	loader = new THREE.TextureLoader();
	// Materials
	table_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'images/nature.jpg' )}),
		.9, // high friction
		.2 // low restitution
	);

	block_material = Physijs.createMaterial(
		new THREE.MeshLambertMaterial({ map: loader.load( 'images/hunna.jpg' )}),
		0.4, // medium friction
		.4 // medium restitution
	);
}
createTower = (function() {
		var block_length = 6*worldscale, block_height = 2*worldscale, block_width = 0.5*worldscale, block_offset = 2*worldscale,
		block_geometry = new THREE.BoxGeometry( block_length, block_height, block_width );
		
		return function() {
			var i, j, rows =  4,
			block;
			
			for ( i = 0; i < rows; i++ ) {
				for ( j = 0; j < 3; j++ ) {
					block = new Physijs.BoxMesh( block_geometry, block_material );
					block.position.y = (block_height / 2) + block_height * i;
					if ( i % 2 === 0 ) {
						block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
						block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
					} 
					else {
						block.position.z = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
					}
					block.receiveShadow = true;
					block.castShadow = true;
					scene.add( block );
					blocks.push( block );
				}
			}
			
		}
	})();