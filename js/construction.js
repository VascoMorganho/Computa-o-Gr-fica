//Construcao

function addCube(obj,x,y,z,p1,p2,p3,color,wireframe){
	'use strict';
	var geometry = new THREE.Geometry();

	geometry.vertices.push( new THREE.Vector3( -p1/2, -p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2, -p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2,  p2/2, p3/2 ));

	geometry.vertices.push( new THREE.Vector3( -p1/2, -p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2,  p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  -p1/2, p2/2, p3/2 ));

	//chao
 	geometry.vertices.push( new THREE.Vector3( -p1/2, p2/2, p3/2 ));	
	geometry.vertices.push( new THREE.Vector3(  p1/2, p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2, p2/2, -p3/2 )); 

	geometry.vertices.push( new THREE.Vector3( -p1/2, p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2, p2/2, -p3/2 )); 
	geometry.vertices.push( new THREE.Vector3( -p1/2, p2/2, -p3/2 ));
	
 	geometry.vertices.push( new THREE.Vector3( -p1/2,-p2/2, -p3/2 ));	
	geometry.vertices.push( new THREE.Vector3(  p1/2, -p2/2,-p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2,  -p2/2,p3/2 ));
	
	geometry.vertices.push( new THREE.Vector3( -p1/2,-p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2,  -p2/2,p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  -p1/2, -p2/2,p3/2 ));
	
	
 	geometry.vertices.push( new THREE.Vector3( -p1/2, -p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( p1/2, p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( p1/2, -p2/2, -p3/2 ));
	
	geometry.vertices.push( new THREE.Vector3( -p1/2, -p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( -p1/2, p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( p1/2, p2/2, -p3/2 ));

 	geometry.vertices.push( new THREE.Vector3( p1/2, p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( p1/2,  p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3( p1/2, -p2/2, p3/2 ));
	
	geometry.vertices.push( new THREE.Vector3( p1/2, p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( p1/2, -p2/2, p3/2 ));
	geometry.vertices.push( new THREE.Vector3(  p1/2,  -p2/2, -p3/2 ));
	
	
	geometry.vertices.push( new THREE.Vector3( -p1/2, p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( -p1/2, -p2/2,p3/2 ));
	geometry.vertices.push( new THREE.Vector3( -p1/2,  p2/2, p3/2 ));
	
	geometry.vertices.push( new THREE.Vector3( -p1/2, p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( -p1/2, -p2/2, -p3/2 ));
	geometry.vertices.push( new THREE.Vector3( -p1/2, -p2/2, p3/2 )); 

	var face;
	var point1=-3;
	var point2=-2;
	var point3=-1;
	for (var i = 0; i < geometry.vertices.length/3; i++) { 
		point1+=3;
		point2+=3;
		point3+=3;
		face = new THREE.Face3( point1, point2, point3);
		geometry.faces.push( face );
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	var material = new THREE.MeshBasicMaterial({color:color, wireframe: wireframe});
	var mesh = new THREE.Mesh(geometry,material);

	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function addWindow(obj,x,y,z,color,wireframe) {
	var geometry = new THREE.Geometry();
	
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ));
		geometry.vertices.push( new THREE.Vector3(  15, 0, 0 ));
		geometry.vertices.push( new THREE.Vector3(  7.5, 3, -5 ));

		geometry.vertices.push( new THREE.Vector3( 0, 0, -3 ));
		geometry.vertices.push( new THREE.Vector3(  7.5, 3, -8 ));
		geometry.vertices.push( new THREE.Vector3(  15, 0, -3 ));

		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ));
		geometry.vertices.push( new THREE.Vector3(  7.5, 3, -5 ));
		geometry.vertices.push( new THREE.Vector3(  0, 0, -3 ));

		geometry.vertices.push( new THREE.Vector3( 7.5,3,-8));
		geometry.vertices.push( new THREE.Vector3(  0, 0, -3 ));
		geometry.vertices.push( new THREE.Vector3(  7.5, 3, -5 ));

		geometry.vertices.push( new THREE.Vector3( 15, 0, 0 ));
		geometry.vertices.push( new THREE.Vector3(  15, 0, -3 ));
		geometry.vertices.push( new THREE.Vector3(  7.5, 3, -5 ));

		geometry.vertices.push( new THREE.Vector3( 7.5,3,-8));
		geometry.vertices.push( new THREE.Vector3(  7.5, 3, -5 ));
		geometry.vertices.push( new THREE.Vector3(  15, 0, -3 ));

		geometry.vertices.push( new THREE.Vector3( 0,0,0));
		geometry.vertices.push( new THREE.Vector3(  0, 0, -3 ));
		geometry.vertices.push( new THREE.Vector3(  15, 0, 0 ));

		geometry.vertices.push( new THREE.Vector3( 0,0,-3));
		geometry.vertices.push( new THREE.Vector3(  15, 0, -3 ));
		geometry.vertices.push( new THREE.Vector3(  15, 0, 0 ));
		
		var face;
		var point1=-3;
		var point2=-2;
		var point3=-1;
		for (var i = 0; i < geometry.vertices.length/3; i++) { 
			point1+=3;
			point2+=3;
			point3+=3;
			face = new THREE.Face3( point1, point2, point3);
			geometry.faces.push( face );
		}
		
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
	
		var material = new THREE.MeshBasicMaterial({color:color, wireframe: wireframe});
		var mesh = new THREE.Mesh(geometry,material);
	
		mesh.position.set(x,y,z);
		mesh.rotation.y=Math.PI/2;
		obj.add(mesh);
}

function createMessage(obj, x, y, z, p1, p2, p3, text) {
	'use stricts';

	var geometry = new THREE.CubeGeometry(p1, p2, p3);
	var loader = new THREE.TextureLoader();

	var texture = loader.load(text, function (texture) {
		var material = new THREE.MeshBasicMaterial({ transparent: true, wireframe: false, map: texture });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		mesh.name="msg";
		obj.add(mesh);
	});
}

function addCube2(obj,x,y,z,p1,p2,p3,color,wireframe){
	'use strict';
	var geometry = new THREE.CubeGeometry(p1,p2,p3);
	var loader = new THREE.TextureLoader();

	var texture = loader.load('imgs/table.jpg', function (texture) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(10, 10);
		var material = new THREE.MeshBasicMaterial({ wireframe: wireframe, map: texture, side: THREE.DoubleSide });
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, z);
		obj.add(mesh);
	});
	
}

function addTorus(obj,x,y,z,p1,p2,p3,p4,color,wireframe,bool) {
	'use strict';
	var geometry = new THREE.TorusGeometry(p1, p2, p3, p4);
	var material = new THREE.MeshBasicMaterial({color: color, wireframe:wireframe});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y,z);
	if (bool)
		mesh.rotation.x = Math.PI/2;
	obj.add(mesh);
}

function addSphere(obj,x,y,z,p1,p2,p3,color,wireframe){
	'use strict';
	var geometry = new THREE.SphereGeometry(p1, p2, p3);
	var material = new THREE.MeshBasicMaterial({color: color, wireframe:wireframe});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function addCylinder(obj,x,y,z,p1,p2,p3,p4,color,wireframe){
	'use strict';
	var geometry = new THREE.CylinderGeometry(p1, p2, p3);
	var material = new THREE.MeshBasicMaterial({color: color, wireframe:wireframe});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function addCone(obj,x,y,z,p1,p2,p3,color,wireframe){
	'use strict';
	var geometry = new THREE.ConeGeometry(p1, p2, p3);
	var material = new THREE.MeshBasicMaterial({color: color, wireframe:wireframe});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(x,y,z);
	obj.add(mesh);
}

function addWheel(obj,x,y,z,color,wireframe,rot) {
	var geometry = new THREE.Geometry();
	
		geometry.vertices.push( new THREE.Vector3( -1, -2.5, 0 ));
		geometry.vertices.push( new THREE.Vector3(  1, -2.5, 0 ));
		geometry.vertices.push( new THREE.Vector3(  0, 0, 0 ));

		geometry.vertices.push( new THREE.Vector3( -1, -2.5, -2 ));
		geometry.vertices.push( new THREE.Vector3(  0, 0, -2 ));
		geometry.vertices.push( new THREE.Vector3(  1, -2.5, -2 ));

		geometry.vertices.push( new THREE.Vector3( -1, -2.5, 0 ));
		geometry.vertices.push( new THREE.Vector3(  0, 0, 0 ));
		geometry.vertices.push( new THREE.Vector3(  -1, -2.5, -2 ));

		geometry.vertices.push( new THREE.Vector3( 0,0,-2));
		geometry.vertices.push( new THREE.Vector3(  -1, -2.5, -2 ));
		geometry.vertices.push( new THREE.Vector3(  0, 0, 0 ));

		geometry.vertices.push( new THREE.Vector3( 1, -2.5, 0 ));
		geometry.vertices.push( new THREE.Vector3(  1, -2.5, -2 ));
		geometry.vertices.push( new THREE.Vector3(  0, 0, 0 ));

		geometry.vertices.push( new THREE.Vector3( 0,0,-2));
		geometry.vertices.push( new THREE.Vector3(  0, 0, 0 ));
		geometry.vertices.push( new THREE.Vector3(  1, -2.5, -2 ));

		geometry.vertices.push( new THREE.Vector3( -1,-2.5,-2));
		geometry.vertices.push( new THREE.Vector3(  1, -2.5, 0 ));
		geometry.vertices.push( new THREE.Vector3(  -1, -2.5, 0 ));

		geometry.vertices.push( new THREE.Vector3( -1,-2.5,-2));
		geometry.vertices.push( new THREE.Vector3(  1, -2.5, -2 ));
		geometry.vertices.push( new THREE.Vector3(  1, -2.5, 0 ));
		var face;
		var point1=-3;
		var point2=-2;
		var point3=-1;

		for (var i = 0; i < geometry.vertices.length/3; i++) { 
			point1+=3;
			point2+=3;
			point3+=3;
			face = new THREE.Face3( point1, point2, point3);
			geometry.faces.push( face );

		}
	
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
	
		var material = new THREE.MeshBasicMaterial({color:color, wireframe: wireframe});
		var mesh = new THREE.Mesh(geometry,material);
		mesh.rotation.z=rot;
		mesh.position.set(x,y,z);
		obj.add(mesh);
}
