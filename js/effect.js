function init_effect(){
		//Added oculus effect ////////////////////////////////////
		effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
		effect.setSize( window.innerWidth, window.innerHeight );
		controls = new THREE.FirstPersonControls( camera );
		controls.movementSpeed = 40;
		controls.lookSpeed = 0.1; //set to 0 to stop nausea
		controls.lookVertical = true;
		oculuscontrol = new THREE.OculusControls( camera );
	}