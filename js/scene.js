function init_renderer(){
		//set renderer
		renderer = new THREE.WebGLRenderer({ antialias: true, depth:true});
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		renderer.setClearColor (0xffffff, 1);
		document.getElementById( 'viewport' ).appendChild( renderer.domElement );
}
function init_camera(){
	//Init camera ////////////////////
	camera = new THREE.PerspectiveCamera(
		35,

		window.innerWidth / window.innerHeight,
		-100,
		1000
		);
	camera.position.set( 10, 10, 25 );
	camera.lookAt(new THREE.Vector3( 0, 7, 0 ));
}
function init_scene(){

	scene = new Physijs.Scene({ fixedTimeStep: 1 / 30});
	scene.add( camera ); //order is weird
	//scene = Leap.loopController.plugins.boneHand.scene;
	// setting up
	scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
	scene.addEventListener(
		'update',		//when physijs rendering is ready
		function() {

			if ( selected_block !== null ) {
				
				_v3.copy( mouse_position ).add( block_offset ).sub( selected_block.position ).multiplyScalar( 5 );
				_v3.y = 0;
				selected_block.setLinearVelocity( _v3 );
				
				// Reactivate all of the blocks
				_v3.set( 0, 0, 0 );
				for ( _i = 0; _i < blocks.length; _i++ ) {
					blocks[_i].applyCentralImpulse( _v3 );
				}
			}

			//scene.simulate( undefined, 1 );
			//physics_stats.update();
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
		new THREE.BoxGeometry(50, 1, 50),
		table_material,
		0, // mass
		{ restitution: .2, friction: .8 }
		);
	table.position.y = -.5;
	table.receiveShadow = true;
	scene.add( table );
	
	createTower();
	init_bone_meshes();
	for (var i = 0; i < boneMeshes.length; i++) {
		boneMeshes[i].receiveShadow = false;
		boneMeshes[i].castShadow = true;
		scene.add(boneMeshes[i]);
		
	}
	intersect_plane = new THREE.Mesh(
		new THREE.PlaneGeometry( 150, 150 ),
		new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
		);
	intersect_plane.rotation.x = Math.PI / -2;
	scene.add( intersect_plane );
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
		var block_length = 6, block_height = 2, block_width = 0.5, block_offset = 2,
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
					//block.receiveShadow = true;
					//block.castShadow = true;
					scene.add( block );
					blocks.push( block );
				}
			}
			
		}
	})();