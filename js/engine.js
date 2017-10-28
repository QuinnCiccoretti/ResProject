	
	var currentframe = 0; //most recent leap data
	var leapcontroller; 	// for getting leap data
	'use strict';
	
	Physijs.scripts.worker = 'js/physijs_worker.js';
	Physijs.scripts.ammo = 'ammo.js';
	
	var test_block, draw_hands, init_world, initEventHandling, draw_test_block, currmousex, currmousey, render, createTower, loader,
		renderer, render_stats, physics_stats, scene, dir_light, am_light, camera,
		table, blocks = [], lhand, rhand,lbock,rblock,table_material, block_material, intersect_plane,
		selected_block = null, mouse_position = new THREE.Vector3, block_offset = new THREE.Vector3, _i, _v3 = new THREE.Vector3;
	// var boneboxes = [];
	var boneMeshes;
 //    var jointMeshes = [];
 	console.log("----------------------");
		for (var i = 0; i < 54; i++) {
			boneMeshes.push(new Physijs.SphereMesh(
		        new THREE.SphereGeometry(1),
		        Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xff0000}), 0, 1),
		        1
		    ));
		}
 	console.log("BoneMeshes");
		console.log(boneMeshes);
	//from effect demo
	var realcamera;
	var guiVisible = true;
	var mesh, effect, controls, oculuscontrol;
	var clock = new THREE.Clock();
	var mousehasbeenmoved = false;
	
	//init_all();		var bmesh = [];
		
		
	function init_leap() {
		console.log("Initialized Leap");
		leapcontroller = new Leap.Controller({enableGestures: true})
		.use('screenPosition')
		.connect()
		.on('frame', function(frame){
			//console.log(frame);	//will get a frame, no need to check
			currentframe = frame; //update a reference to the current frame for use in setting in the phys sim
			//lhand = currentframe.
			console.log(currentframe);
			
		})
		


	}	
	function init_renderer(){
		//set renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMap.enabled = true;
		renderer.shadowMapSoft = true;
		document.getElementById( 'viewport' ).appendChild( renderer.domElement );
	}
	function init_camera(){
		//Init camera ////////////////////
		camera = new THREE.PerspectiveCamera(
			35,

			window.innerWidth / window.innerHeight,
			1,
			1000
		);
		camera.position.set( 25, 20, 25 );
		camera.lookAt(new THREE.Vector3( 0, 7, 0 ));
	}
	function init_stats (argument) {
		//init stats module
		render_stats = new Stats();
		render_stats.domElement.style.position = 'absolute';
		render_stats.domElement.style.top = '1px';
		render_stats.domElement.style.zIndex = 100;
		document.getElementById( 'viewport' ).appendChild( render_stats.domElement );
		//init stats module
		physics_stats = new Stats();
		physics_stats.domElement.style.position = 'absolute';
		physics_stats.domElement.style.top = '50px';
		physics_stats.domElement.style.zIndex = 100;
		document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );
	}
	function init_effect(){
		//Added oculus effect ////////////////////////////////////
		effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
		effect.setSize( window.innerWidth, window.innerHeight );
	}
	function init_scene(){
		scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
		scene.add( camera ); //order is weir d
		//var scene = Leap.loopController.plugins.boneHand.scene;
		// setting up
		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
		scene.addEventListener(
			'update',
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

				scene.simulate( undefined, 1 );
				physics_stats.update();
			}
		);
		
		
		
		// ambient light
		am_light = new THREE.AmbientLight( 0x444444 );
		scene.add( am_light );

		// directional light
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

		// Loader
		loader = new THREE.TextureLoader();
		
		// Materials
		table_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: loader.load( 'images/mcafee.jpg' )}),
			.9, // high friction
			.2 // low restitution
		);
		table_material.map.wrapS = table_material.map.wrapT = THREE.RepeatWrapping;
		table_material.map.repeat.set( 5, 5 );
		
		block_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: loader.load( 'images/plywood.jpg' )}),
			.4, // medium friction
			.4 // medium restitution
		);
		block_material.map.wrapS = block_material.map.wrapT = THREE.RepeatWrapping;
		block_material.map.repeat.set( 1, .5 );
		
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
		
		intersect_plane = new THREE.Mesh(
			new THREE.PlaneGeometry( 150, 150 ),
			new THREE.MeshBasicMaterial({ opacity: 0, transparent: true })
		);
		intersect_plane.rotation.x = Math.PI / -2;
		scene.add( intersect_plane );
	}
	init_world = function() {
		init_renderer();
		init_camera();
		init_effect();

		controls = new THREE.FirstPersonControls( camera );
		controls.movementSpeed = 40;
		controls.lookSpeed = 0.1;
		controls.lookVertical = true;
		oculuscontrol = new THREE.OculusControls( camera );
		
		init_stats();

		init_scene();
		
		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener('keydown', keyPressed, false);
		oculuscontrol.connect();//presumably engages oculus tracking
		initEventHandling();
		requestAnimationFrame( render );
		scene.simulate();
	};
	//from the effect demo
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		// realcamera.aspect = window.innerWidth / window.innerHeight;
		//realcamera.updateProjectionMatrix();
		effect.setSize( window.innerWidth, window.innerHeight );
		controls.handleResize();
	}
	
	draw_hands = function(){
		if(currentframe == 0){
			return 0;
		}
		//console.log(currentframe);
		var dat = [];
		fingers = currentframe.fingers;
		var count = 0;
		for (var i = 0; i < fingers.length; i++) {
			for (var j = 0; j < fingers[i].bones.length; j++) {
				var b = fingers[i].bones[j];
				var center = b.center();
				console.log("BoneMeshes");
				console.log(boneMeshes);
				console.log(center);
				var cmesh = boneMeshes[count];
				cmesh.position.set( 0, 0, 0 );
		   		cmesh.__dirtyPosition = true;
				// You may also want to cancel the object's velocity
				cmesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
				cmesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));

			}
		}
		console.log(boneMeshes);
		var hands = currentframe.hands;
		for (var i = 0; i < boneMeshes.length; i++) {
			var mesh = boneMeshes[i];
			mesh.position.set( 0, 0, 0 );
		    mesh.__dirtyPosition = true;

		    // Change the object's rotation
		    mesh.rotation.set(0, 90, 180);
		    mesh.__dirtyRotation = true;
		    
		    // You may also want to cancel the object's velocity
		    mesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
		    mesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
		};
		
		


	}
	function draw_h(hand){
		
		
		
	}
	draw_test_block = function(){
		var cvec = new THREE.Vector3;
		cvec.set(
					( currmousex / window.innerWidth ) * 2 - 1,
					-( currmousey / window.innerHeight ) * 2 + 1,
					1
				);
				cvec.unproject( camera );
				//console.log(cvec);

				var scalex = 20;
				var scaley = 20;
				var scalez = 20;
				var xpos = cvec.x/scalex+40;
				var ypos = cvec.y/scaley+40;
				var zpos = cvec.z/scalez +20;
				if(mousehasbeenmoved){
				
					test_block.position.set(xpos, ypos, zpos);
				    test_block.__dirtyPosition = true;
				    //console.log(test_block.position);
				    // Change the object's rotation
				    test_block.rotation.set(0, 0, 0);
				    test_block.__dirtyRotation = true;
				}
	}
	render = function() {
		draw_hands();
		//draw_test_block();
		requestAnimationFrame( render );
		//renderer.render( scene, camera );
		//effect
		//var t = clock.getElapsedTime();
		controls.update( clock.getDelta() );		//Necessary for movement
		oculuscontrol.update( clock.getDelta() );	//Necessary for movement
		effect.render( scene, camera );
		render_stats.update();
	};
	
	createTower = (function() {
		var block_length = 6, block_height = 1, block_width = 1.5, block_offset = 2,
			block_geometry = new THREE.BoxGeometry( block_length, block_height, block_width );
		
		return function() {
			var i, j, rows = 200,
				block;
			
			for ( i = 0; i < rows; i++ ) {
				for ( j = 0; j < 3; j++ ) {
					block = new Physijs.BoxMesh( block_geometry, block_material );
					block.position.y = (block_height / 2) + block_height * i;
					if ( i % 2 === 0 ) {
						block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
						block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
					} else {
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
	
	initEventHandling = (function() {
		var _vector = new THREE.Vector3,
			handleMouseDown, handleMouseMove, handleMouseUp;
		
		handleMouseDown = function( evt ) {
			var ray, intersections;
			
			_vector.set(
				( evt.clientX / window.innerWidth ) * 2 - 1,
				-( evt.clientY / window.innerHeight ) * 2 + 1,
				1
			);

			_vector.unproject( camera );
			// console.log(_vector);
			ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
			intersections = ray.intersectObjects( blocks );

			if ( intersections.length > 0 ) {
				selected_block = intersections[0].object;
				
				_vector.set( 0, 0, 0 );
				selected_block.setAngularFactor( _vector );
				selected_block.setAngularVelocity( _vector );
				selected_block.setLinearFactor( _vector );
				selected_block.setLinearVelocity( _vector );

				mouse_position.copy( intersections[0].point );
				block_offset.subVectors( selected_block.position, mouse_position );
				
				intersect_plane.position.y = mouse_position.y;
			}
		};
		
		handleMouseMove = function( evt ) {
			
			var ray, intersection,
				i, scalar;
			currmousey = evt.clientY;
			currmousex = evt.clientX;
			mousehasbeenmoved = true;
			if ( selected_block !== null ) {
				
				_vector.set(
				( evt.clientX / window.innerWidth ) * 2 - 1,
				-( evt.clientY / window.innerHeight ) * 2 + 1,
				1
				);

				_vector.unproject( camera );
				ray = new THREE.Raycaster( camera.position, _vector.sub( camera.position ).normalize() );
				intersection = ray.intersectObject( intersect_plane );
				mouse_position.copy( intersection[0].point );
			}
			
		};
		
		handleMouseUp = function( evt ) {
			
			if ( selected_block !== null ) {
				_vector.set( 1, 1, 1 );
				selected_block.setAngularFactor( _vector );
				selected_block.setLinearFactor( _vector );
				
				selected_block = null;
			}
			
		};
		
		return function() {
			renderer.domElement.addEventListener( 'mousedown', handleMouseDown );
			renderer.domElement.addEventListener( 'mousemove', handleMouseMove );
			renderer.domElement.addEventListener( 'mouseup', handleMouseUp );
		};
	})();
	