function init_leap() {
		console.log("Initialized Leap");
		leapcontroller = new Leap.Controller({
			enableGestures: true,
			optimizeHMD:true}
			)
		.use('screenPosition')
		.use('transform', {

		// This matrix flips the x, y, and z axis, scales to meters, and offsets the hands by -8cm.
		vr: true,

		// This causes the camera's matrix transforms (position, rotation, scale) to be applied to the hands themselves
		// The parent of the bones remain the scene, allowing the data to remain in easy-to-work-with world space.
		// (As the hands will usually interact with multiple objects in the scene.)
		effectiveParent: camera

		})
		.connect()
		.on('frame', function(frame){
			//console.log(frame);	//will get a frame, no need to check
			currentframe = frame; //update a reference to the current frame for use in setting in the phys sim
			//lhand = currentframe.
			//console.log(currentframe);
			
		})
		


	}