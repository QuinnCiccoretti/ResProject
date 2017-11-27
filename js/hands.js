function init_bone_meshes() {
		console.log("----------------------");
		for (var i = 0; i < 40; i++) {
			var m = new Physijs.SphereMesh(
				new THREE.SphereGeometry(0.25),
				Physijs.createMaterial(new THREE.MeshBasicMaterial({color: 0xff0000}), 1, 1),
				1
				);
			m.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
				// `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
				if(checking_collisions){
					if(other_object.geometry.type != "SphereGeometry"){
						touched_block = other_object;
						//console.log("collided! with other:");
						//console.log(other_object);
						//last_relv = relative_velocity;
					}
				}
				
			});
			boneMeshes.push(m);
		}
		console.log("BoneMeshes");
		console.log(boneMeshes);
}

var hand_offset_to_camera = new THREE.Vector3(0,-7,0);
draw_hands = function(){
	if(currentframe == 0){
		return 0;
	}
	var dat = [];
	fingers = currentframe.fingers;
	var count = 0;
	for (var i = 0; i < fingers.length; i++) {
		for (var j = 0; j < fingers[i].bones.length; j++) {
			var b = fingers[i].bones[j];
			
				var bmesh = boneMeshes[count];
				
				var bpos = new THREE.Vector3().fromArray(b.center());
				
				bpos.z = -1*bpos.z;
				bpos.multiplyScalar(1/20);
				bpos.applyEuler(camera.rotation);
				var adjpos = bpos.add(camera.position).add(hand_offset_to_camera); //adjusts for camera position.
				bmesh.__dirtyRotation = true;
				bmesh.__dirtyPosition = true;
				bmesh.position.set( adjpos.x, adjpos.y, adjpos.z);
			

			// You may also want to cancel the object's velocity
			//bmesh.setLinearVelocity(new THREE.Vector3(0, 0, 0));
			//bmesh.setAngularVelocity(new THREE.Vector3(0, 0, 0));
			count = count +1;
		}
	}
}
function handlepinch(){
	var ray, intersections;
	var hands = currentframe.hands;
	
	if(hands.length>0){
		
		var l_hand = currentframe.hands[0];
		var a = new THREE.Vector3().fromArray(l_hand.indexFinger.tipPosition).divideScalar(20);
		var tempa = new THREE.Vector3().fromArray(l_hand.indexFinger.tipPosition).divideScalar(20);
		var b = new THREE.Vector3().fromArray(l_hand.thumb.tipPosition).divideScalar(20);
		lineGeometry.vertices[0] = a;
		lineGeometry.vertices[1] = b;
		lineGeometry.verticesNeedUpdate = true;
		
		ray = new THREE.Raycaster( a, b);
		intersections = ray.intersectObjects( blocks );
		
		
		if(l_hand.pinchStrength>.9){	//if we have started pinching something
			pinching = true;
		}
		else{	//if we have stopped pinching something
			pinching = false;
			if(touched_block!=null){
				var onevec = new THREE.Vector3(1,1,1);
				touched_block.setAngularFactor( onevec );
				touched_block.setAngularVelocity( onevec );
				
				
				if(oldpos!=null){
					var velo = calcvelocity(oldpos, tempa , 1)
					console.log("Velo");
					console.log(velo);
					touched_block.setLinearFactor( onevec );
					touched_block.applyCentralImpulse( velo.multiplyScalar(2));
				}
				oldpos = tempa;
			}
			touched_block = null;
		}
			if(pinching && touched_block!=null){
				
				console.log("Was successful");
				console.log(touched_block);
				touched_block.__dirtyRotation = true;
				touched_block.__dirtyPosition = true;
				touched_block.position.set( a.x , a.y , a.z );
		   		
		   		var zvec = new THREE.Vector3(0,0,0);
		   		touched_block.setAngularFactor( zvec );
		   		touched_block.setAngularVelocity( zvec );
		   		touched_block.setLinearFactor( zvec );
		   		touched_block.setLinearVelocity( zvec );
				
				touched_block.setLinearVelocity(new THREE.Vector3(0, 0, 0));
				touched_block.setAngularVelocity(new THREE.Vector3(0, 0, 0));
			}
		
	//}
}
if(hands.length>1){

}

};