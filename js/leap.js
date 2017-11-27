function init_leap() {
		console.log("Initialized Leap");
		leapcontroller = new Leap.Controller({enableGestures: true})
		.use('screenPosition')
		.use('transform', {
	      // move 20 cm back.
	      VR: true
	    })
		.connect()
		.on('frame', function(frame){
			//console.log(frame);	//will get a frame, no need to check
			currentframe = frame; //update a reference to the current frame for use in setting in the phys sim
			//lhand = currentframe.
			//console.log(currentframe);
			
		})
		


	}