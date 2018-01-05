
function init_effect(){
		//Added oculus effect ////////////////////////////////////
		effect = new THREE.OculusRiftEffect( renderer, { worldScale: 1 } );
		effect.setSize( window.innerWidth, window.innerHeight );
		controls = new THREE.FirstPersonControls( camera );
		controls.movementSpeed = 4;
		controls.lookSpeed = 0.05; //set to 0 to stop nausea
		controls.lookVertical = true;
		oculuscontrol = new THREE.OculusControls( camera );
	}