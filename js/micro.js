class Obj3D {
	constructor(desc) {
	    this.desc = desc;
	    this.obj = new THREE.Object3D();
	}
}

class movObj extends Obj3D {
	constructor(desc,veloXMax,velX,velY,maxRotY,accF,accB) {
		super(desc);
		this.veloXMax=veloXMax;
		this.velX=velX;
		this.velY=velY;
		this.maxRotY=maxRotY;
		this.accF=accF;
		this.accB=accB;
		this.respawn=0;
		this.collision=false;
		this.allowFoward=false;
	}

	hasCollision() {
		return this.collision;
	}

	findIntersection(other) {
		var car1=this.obj.localToWorld(new THREE.Vector3(-6.75,0,0));
		var car2=this.obj.localToWorld(new THREE.Vector3(6.75,0,0));
		if (this.desc.indexOf("Torus")>=0) car1=this.obj.localToWorld(new THREE.Vector3(0,0,0));

		var desc=this.desc;
		var col = [];
		var coll = false;
		var allow = false;
		var torusFoward = false;
		if (other.desc.indexOf("Manteiga")>=0) {
			col.push(other.obj.localToWorld(new THREE.Vector3(15,0,0)));
			col.push(other.obj.localToWorld(new THREE.Vector3(-15,0,0)));
		}else
			col.push(other.obj.localToWorld(new THREE.Vector3(0,0,0)));

		col.forEach(function (p) {
			if(col.length==2) {
				if (collisionDistance(car1.x,p.x,car1.z,p.z)<=25) {
					allow=true;
					coll=true;
				}else if (collisionDistance(car2.x,p.x,car2.z,p.z)<=25) {
					allow=false;
					coll=true;
				}
			}else{
				if (desc.indexOf("Torus")>=0) {
					if ((other.desc.indexOf("Torus")>=0) && (collisionDistance(car1.x,p.x,car1.z,p.z)<=8))
						coll=true;
				}else{
					if ((other.desc.indexOf("Orange")>=0) && ((collisionDistance(car1.x,p.x,car1.z,p.z)<=30) || (collisionDistance(car2.x,p.x,car2.z,p.z)<=30))) {
						coll=true;
					}else if ((other.desc.indexOf("Torus")>=0) && ((collisionDistance(car2.x,p.x,car2.z,p.z)<=14) || (collisionDistance(car1.x,p.x,car1.z,p.z)<=14))) {
						coll=true;
					}
				}
			}
				
			
		});
		this.torusFoward=torusFoward;
		this.allowFoward=allow;
		this.collision=coll;
	}

	processCollision(other) {
		if (this.desc.indexOf("Torus")>=0) {
			other.obj.lookAt(this.obj.position);
			other.obj.translateZ(-3);
		}else{
			if (other.desc.indexOf("Orange")>=0) {
				this.obj.position.x=0;
				this.obj.position.z=200;
				this.obj.rotation.y=0;
				this.velX=0;
				this.velY=0;
				lives--;
				cars[lives].obj.position.y = 1000;
			}else if (other.desc.indexOf("Manteiga")>=0) {
				if (this.allowFoward) {
					if (this.velX<0)
						this.velX=0;
				}else {
					if (this.velX>0)
						this.velX=0;
				}		
			}else if (other.desc.indexOf("Torus")>=0) {
				other.obj.lookAt(this.obj.position);
				other.maxRotY=Math.abs(this.velX);
			}
		}3
		
		this.collision=false;
	}
} 

function collisionDistance(x1,x2,y1,y2){
	return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}

var camera;
var cameraN;
var scene;
var renderer;
var car = new movObj("carro",3.5,0,0,0.05,0.005,0.008);
var torusObjects = [];
var orangeObjects = [];
var manteigasObjects = [];
var frustumSize = 500.1;
var pressKeys = {up:false, down:false,left:false, right:false};
var prevTime=0;
var gameTime=0;
var pauseTime=0;
var gameRunning=true;
var pointOn= 1;
var lives=5;
var gameOver=false;
var cars = [];

var messages=[];

function createScene() {
	'use strict';
	scene = new THREE.Scene();

	scene.add(new THREE.AxisHelper(200));

	createCar(car.obj,0,0,200);
	scene.add(car.obj);

	createTrack(0,0,0);

	//Mensagens
	messages[0] = new Obj3D("pausa");
	messages[1] = new Obj3D("gameOver");
	createMessage(messages[0].obj,0,-50,0,50,50,0,'imgs/pause.png');
	createMessage(messages[1].obj, 0, -50, 0, 100, 20, 0, 'imgs/gameOver.png');

	messages.forEach(function (msg) {
		scene.add(msg.obj);
	})



	createOrange(0);
	createOrange(1);
}

function createCars() {
	////Vidas
	for (var i = 0; i < 5; i++) {
		cars[i] = new Obj3D("car" + i);
		createCar(cars[i].obj, -(i * 15)+ 230, 0, -230);
		cars[i].obj.scale.set(0.6, 0.6, 0.6);
		cars[i].obj.rotateY(Math.PI / 2);
		scene.add(cars[i].obj);
	}
}

function getOrthoCam(frustumSize) {
	var data = {leftRight:0,topBot:0};
	if (window.innerWidth>window.innerHeight) {
		data.leftRight = (frustumSize/2)*getAspectOrtho();
		data.topBot = frustumSize/2;
	}else {
		data.leftRight = frustumSize/2;
		data.topBot = (frustumSize/2)*getAspectOrtho(false);
	}
	return data;
}

function cameraOrto(){
	'use strict'
	var camParam = getOrthoCam(frustumSize);
	camera = new THREE.OrthographicCamera(-camParam.leftRight, camParam.leftRight,  camParam.topBot,  -camParam.topBot, 0.1, 100 );
	camera.position.x = 0;
	camera.position.y = 63;
	camera.position.z = 0;
	cameraN = 1;
	camera.lookAt(scene.position);
	if (car.obj.children[41]!=undefined) car.obj.children.pop(41);
	if (messages[0].obj.position.y != 1000 && messages[0].obj.position.y != 0)
		movMsg(messages[0].obj, true, false);
	if (gameOver)
		movMsg(messages[1].obj, true, false);
	movLives();
}
	
function cameraPersp(){
	'use strict'
	camera = new THREE.PerspectiveCamera(70, getAspect(), 1, 1000);
	camera.position.x = 0;
	camera.position.y = 365;
	camera.position.z = 0;
	cameraN = 2;
	camera.lookAt(scene.position);
	if (car.obj.children[41]!=undefined) car.obj.children.pop(41);
	if (messages[0].obj.position.y != 1000 && messages[0].obj.position.y != 0)
		movMsg(messages[0].obj, true, false);
	if (gameOver)
		movMsg(messages[1].obj, true, false);
	movLives();
}
		
function cameraPerspFollow(){
	'use strict'
	if (car.obj.children[41]==undefined) {
		camera = new THREE.PerspectiveCamera(70, getAspect(), 1, 1000);
		camera.position.x = car.obj.position.x;
		camera.position.y = 40;
		camera.position.z = car.obj.position.z;
		cameraN = 3;
		car.obj.add(camera);
		camera.position.x = -100;
		camera.position.z= 0;
		camera.rotation.y=-Math.PI/2
		if (messages[0].obj.position.y != 1000 && messages[0].obj.position.y != 0)
			movMsg(messages[0].obj, true, true);
		if (gameOver)
			movMsg(messages[1].obj, true, true);
		//movLives(true, true);
		
		for (var i = 0; i < 5; i++) {
			cars[i].obj.position.x = -(i * 15) + 85;
			if (cars[i].obj.position.y<1000)
				cars[i].obj.position.y = 90;
			cars[i].obj.position.z = -200;
			cars[i].obj.rotation.x=Math.PI/2;
			camera.add(cars[i].obj);
		}
	}
}

function carSpotLight(){
	lightcar1 = new THREE.SpotLight(0x00aaaa,10,60);
	lightcar2 = new THREE.SpotLight(0x00aaaa,10,60);

	lightcar1.position.x = car.obj.position.x +15;
	lightcar1.position.y = 2.5;
	lightcar1.position.y = car.obj.position.z +8;

	lightcar1.position.x = car.obj.position.x +15;//
	lightcar1.position.y = 2.5;
	lightcar1.position.z = car.obj.position.z -8;

	car.obj.add(lightcar1);
	car.obj.add(lightcar2);

	lightcar1.position.x = 15;
	lightcar1.position.z= 8;
	lightcar1.position.y = 2.5;

	lightcar2.position.x = 15;
	lightcar2.position.z= -8;
	lightcar2.position.y= 2.5;


	//lightcar1.target = car.obj.targetObj;
	//lightcar2.target = car.obj.targetObj;

	lightcar1.target.position.x = car.obj.position.x + 40;
	lightcar1.target.position.y = 0;
	lightcar1.target.position.z = car.obj.position.z +8;

	lightcar2.target.position.x = car.obj.position.x + 40;
	lightcar2.target.position.y=0;
	lightcar2.target.position.z = car.obj.position.z -8;

	car.obj.add(lightcar1.target);
	car.obj.add(lightcar2.target);

	lightcar1.target.position.x = 40;
	lightcar1.target.rotation.y = -Math.PI/2;
	lightcar1.target.position.z = 8;

	lightcar2.target.position.x = 40;
	lightcar2.target.rotation.y = -Math.PI/2;
	lightcar2.target.position.z = -8;

	//scene.add(lightcar1.target);
	//scene.add(lightcar2.target);

}

function dirLight(){
	lightDir = new THREE.DirectionalLight(0xffffff,1);
	lightDir.position.x = 40;
	lightDir.position.y = 200;
	lightDir.position.z = 200;
	lightDir.intensity = 1;
	scene.add(lightDir);
}

function pointLight(){

	light1 = new THREE.PointLight(0xffff00,10,150,2);
	light2 = new THREE.PointLight(0xffff00,10,150,2);
	light3 = new THREE.PointLight(0xffff00,10,150,2);
	light4 = new THREE.PointLight(0xffff00,10,150,2);
	light5 = new THREE.PointLight(0xffff00,10,150,2);
	light6 = new THREE.PointLight(0xffff00,10,150,2);


	light1.position.set(80,80,-40);
	light2.position.set(-115,80,150);
	light3.position.set(135,80,140);
	light4.position.set(-100,80,-40);
	light5.position.set(-215,80,-220);
	light6.position.set(110,80,-210);
	
	scene.add(light1); 
	scene.add(light2);
	scene.add(light3);
	scene.add(light4);
	scene.add(light5);
	scene.add(light6);
}

function init() {
	'use strict';
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	createScene();
	pointLight();
	cameraOrto();
	createCars();
	render();
	dirLight();
	carSpotLight();

	messages[0].obj.position.y=1000;
	messages[1].obj.position.y = 1000;

	var onKeyDown = function(event) {event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, true);};
	var onKeyUp = function(event) {event.preventDefault(); event.stopPropagation(); handleKeyInteraction(event.keyCode, false);};
	window.addEventListener("resize", onResize, false);
	window.addEventListener("keydown", onKeyDown, false);
	window.addEventListener("keyup", onKeyUp, false);
}

function update(delta) {
	if (lives>0) {
		if (pressKeys.up && car.velX < car.veloXMax)
			car.velX += car.accF * delta;
		if (pressKeys.down && -car.velX < car.veloXMax)
			car.velX -= car.accB * delta;
		if (pressKeys.left && car.velY < car.maxRotY && car.velX != 0)
			if (car.velX > 0)
				car.velY += 0.02;
			else
				if (Math.abs(car.velY) <= Math.abs(car.maxRotY))
					car.velY -= 0.02;
		if (pressKeys.right && -car.velY < car.maxRotY && car.velX != 0)
			if (car.velX > 0)
				car.velY -= 0.02;
			else
				if (Math.abs(car.velY) <= Math.abs(car.maxRotY))
					car.velY += 0.02;


		//Carro Cair
		if (car.obj.position.x >= 260 || car.obj.position.x <= -260 || car.obj.position.z >= 260 || car.obj.position.z <= -260) {
			car.obj.position.x = 0;
			car.obj.position.z = 200;
			car.obj.rotation.y = 0;
			car.velX = 0;
			car.velY = 0;
			lives--;
			cars[lives].obj.position.y = 1000;
		}

		//LARANJA
		orangeObjects.forEach(function (ora) {
			ora.obj.translateX(ora.velX);
			ora.obj.children[0].rotation.z -= ora.velX * 0.05;

			if (ora.obj.position.x >= 270 || ora.obj.position.x <= -270 || ora.obj.position.z >= 270 || ora.obj.position.z <= -270) {
				ora.obj.position.y = 1000;
				if (ora.respawn == 0)
					ora.respawn = gameTime + (Math.floor((Math.random() * 4)) + 2) * 1000;
			}
			if (ora.respawn <= gameTime && ora.respawn > 0) {
				id = ora.desc.replace("Orange", "");
				createOrange(id);
				orangeObjects[id].velX += gameTime * 0.00005;
			}

			// Colisao carro->laranja
			ora.obj.updateMatrix();
			car.obj.updateMatrix();
			car.findIntersection(ora);
			if (car.hasCollision())
				car.processCollision(ora);

		});

		// Colisao carro->manteiga
		manteigasObjects.forEach(function (p) {
			p.obj.updateMatrix();
			car.obj.updateMatrix();
			car.findIntersection(p);
			if (car.hasCollision())
				car.processCollision(p);
		})

		// Colisao carro->torus
		torusObjects.forEach(function (p) {
			p.obj.updateMatrix();
			car.obj.updateMatrix();
			car.findIntersection(p);
			if (car.hasCollision())
				car.processCollision(p);

			//Mov Torus
			if (p.maxRotY > 0) {
				p.obj.translateZ(-(-p.accB * delta + p.veloXMax));
				p.maxRotY -= (-p.accB * delta + p.veloXMax);
			}
		})


		//Colisao torus->torus
		torusObjects.forEach(function (p) {
			torusObjects.forEach(function (p2) {
				if (p.desc != p2.desc) {
					p.obj.updateMatrix();
					p2.obj.updateMatrix();
					p.findIntersection(p2);

					if (p.hasCollision()) p.processCollision(p2);
				}

			})

		})

		car.obj.translateX(car.velX);
		car.obj.rotation.y += car.velY;

		//if (car.obj.children[41] != undefined) movLives(true, true);
	}else{
		
		if (!gameOver) {
			if (car.obj.children[41] != undefined) {
				movMsg(messages[1].obj, true, true);
			} else {
				movMsg(messages[1].obj, true, false);
			}
			gameOver=!gameOver;
		}
		
		
	}
	
}

function animate() {
	var time = performance.now();
	if (gameRunning) {
		var delta = time-prevTime;
		gameTime+=delta;

		update(delta);
	}
	
	requestAnimationFrame( animate );
	render();

	prevTime=time;
}

function render() {
	'use strict';
	renderer.render(scene, camera);
}

function getAspectOrtho(l) {
	if (typeof(l)==='undefined') l = true;
	if (l) return window.innerWidth / window.innerHeight;
	else return window.innerHeight / window.innerWidth;
}

function getAspect() {
	return renderer.getSize().width / renderer.getSize().height;
}

function random(x,z){
	var s = Math.floor((Math.random()*2)+1);
	var x1 = Math.floor((Math.random()*x)+1);
	if(s==1){
		x1=-x1;
	}
	s = Math.floor((Math.random()*2)+1);
	var z1 = Math.floor((Math.random()*z)+1);
	if(s==1){
		z1=-z1;
	}
	var res=[];
	res.push(x1);
	res.push(z1);

	return res;
}

function onResize() {
	'use strict';
	if (cameraN == 1){
		var camParam = getOrthoCam(frustumSize);

		camera.left   = -camParam.leftRight;
		camera.right  = camParam.leftRight;
		camera.top    = camParam.topBot;
		camera.bottom = -camParam.topBot;
	}else 
		if(window.innerWidth > 0 && window.innerHeight > 0){
			if (cameraN==3) {
				camera.position.x = car.obj.position.x;
				camera.position.y = 40;
				camera.position.z = car.obj.position.z;
				camera.position.x = -100;
				camera.position.z= 0;
				camera.rotation.y=-Math.PI/2
			}
			
			camera.aspect = getAspect();
			
		}

	camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}

function iluminationCalc(){
	scene.traverse(function(node){
		if (node instanceof THREE.Mesh) {
			if (node.material.type == "MeshBasicMaterial" && node.name != "msg"){
				node.material = new THREE.MeshLambertMaterial({ color: node.material.color, wireframe: node.material.wireframe, map:node.material.map, side:node.material.side});
			} else if (node.material.type == "MeshLambertMaterial" && node.name != "msg"){
				node.material = new THREE.MeshBasicMaterial({ color: node.material.color, wireframe: node.material.wireframe, map: node.material.map, side: node.material.side});
			}
			cars.forEach(function (c) {
				c.obj.traverse(function (n) {
					if (n instanceof THREE.Mesh && n.material.type == "MeshLambertMaterial")
						n.material = new THREE.MeshBasicMaterial({ color: n.material.color, wireframe: n.material.wireframe, map: n.material.map, side: n.material.side });
				})
			})
		}
	});
}

function shadowCalc(){
	scene.traverse(function(node){
		if (node instanceof THREE.Mesh && node.name != "msg") {
			if (node.material.type == "MeshLambertMaterial"){     // difuse
				node.material = new THREE.MeshPhongMaterial({ color: node.material.color, wireframe: node.material.wireframe, specular: node.material.color, shininess: 60, map: node.material.map, side: node.material.side});
			} else if (node.material.type == "MeshPhongMaterial" && node.name != "msg"){
				node.material = new THREE.MeshLambertMaterial({ color: node.material.color, wireframe: node.material.wireframe, map: node.material.map, side: node.material.side});
			}
		}
	});
}

function handleKeyInteraction(keyCode, boolean) {
	var isKeyDown = boolean;
	switch(keyCode) {
		case 65:
		case 97: {
			if (isKeyDown){
				scene.traverse(function (node) {
					if (node instanceof THREE.Mesh && node.name!="msg")
						node.material.wireframe = !node.material.wireframe;
				});
			}
			break;
		}
		case 38: { // up
			if (car.velX<car.veloXMax && isKeyDown) 
				pressKeys.up=true;
			else if(!isKeyDown) 
				pressKeys.up=false;
			break;
		}
		case 40: { // down
			if (-car.velX<car.veloXMax && isKeyDown) 
				pressKeys.down=true;
			else if(!isKeyDown) 
				pressKeys.down=false;
			break;
		}
		case 37: { // left
			if (car.velY<car.maxRotY && isKeyDown) 
				pressKeys.left=true;
			else if(!isKeyDown) {
				pressKeys.left=false;
				car.velY=0;
			}
			break;
		}
		case 39: { // right
			if (-car.velY<car.maxRotY && isKeyDown) 
				pressKeys.right=true;
			else if(!isKeyDown) {
				pressKeys.right=false;
				car.velY=0;
			}
			break;
		}
		case 49: { // 1
			if (isKeyDown)
				cameraOrto();
			break;
		}
		case 50: { // 2
			if (isKeyDown)
				cameraPersp();
			break;
		}
		case 51: { // 3
			if (isKeyDown)
				cameraPerspFollow();
			break;
		}
		case 78: { //N
			if (isKeyDown)
				if (lightDir.intensity == 1)
	        		lightDir.intensity = 0.1;
	        	else
	        		lightDir.intensity = 1;

			break;
		}
		case 76: { //L
			if (isKeyDown)
				iluminationCalc();
			break;
	}

		case 71: { //G
			if (isKeyDown)
				shadowCalc();

			break;
		}
		case 67: { //C
			if (isKeyDown){
	        	if (pointOn == 1 ){
	        	 	light1.intensity = 0;
					light2.intensity = 0;
					light3.intensity = 0;
					light4.intensity = 0;
					light5.intensity = 0;
					light6.intensity = 0;
					pointOn = 0;
	        	}
	        	else{
	        	 	light1.intensity = 10;
					light2.intensity = 10;
					light3.intensity = 10;
					light4.intensity = 10;
					light5.intensity = 10;
					light6.intensity = 10;
					pointOn = 1;
				}
			}
			break;
		}
		case 72: { //H
			if (isKeyDown)
				if (lightcar1.intensity == 10 && lightcar2.intensity ==10){
	        		lightcar1.intensity = 0;
	        		lightcar2.intensity = 0;
	        	}else{
	        		lightcar1.intensity = 10;
	        		lightcar2.intensity = 10;
	        	}
			break;
		}
		case 83: { //S
			if (isKeyDown) {
				gameRunning = !gameRunning;
				if (!gameRunning)
					if (car.obj.children[41] != undefined)
						movMsg(messages[0].obj, true, true);
					else
						movMsg(messages[0].obj, true, false);
				else
					movMsg(messages[0].obj, false, false);
				
			}
				
			break;
		}
		case 82: { //R
			if (isKeyDown)
				window.location.reload();

			break;
		}
		
	}
}

function movLives() {
	if (cars[0]!=undefined) {
		for (var i = 0; i < 5; i++) {
			cars[i].obj.position.x = -(i * 15) + 230;
			if (cars[i].obj.position.y < 1000)
				cars[i].obj.position.y = 0;
			cars[i].obj.position.z = -230;

			cars[i].obj.rotation.x = 0;
			scene.add(cars[i].obj);
		}
	}
	
}

function movMsg(obj,show,carCam) {
	if (show) {
		if (carCam){
			obj.position.x = car.obj.position.x;
			obj.position.y = 100;
			obj.position.z = car.obj.position.z;
			obj.rotation.y = car.obj.rotation.y + Math.PI / 2;
			obj.rotation.z = 0;
			obj.rotation.x = 0;
		}else{
			obj.rotation.z = 0;
			obj.position.x = 0;
			obj.position.y = 50;
			obj.position.z = -50;
			obj.rotation.y = 0;
			obj.rotateZ(Math.PI);
			obj.rotation.x = (Math.PI / 2);
		}
	}else
		obj.position.y = 1000;
}

// Criacao
function createCar(obj,x,y,z){
	'use strict';

	//window
	addWindow(obj,12,9.5,7.5,0x0000ff,true);

  	//meio 
	addCube(obj,0,5.25,0,6,4.5,6,0xff0000,true);
	//tras
	addCube(obj,-7.5,5.25,0,9,7.5,15,0xff0000,true);

	//frente
	addCube(obj,7.5,5.25,0,9,7.5,15,0xff0000,true);

	//frente para
	addCube(obj,13.5,3.75,0,3,4.5,19,0x99ccff,true);

	// rodas
	//addTorus(car.obj,-7.5,3,-8.5,2,1,10,10,0xffffff,true,false);
	//addTorus(car.obj,7.5,3,-8.5,2,1,10,10,0xffffff,true,false);
	//addTorus(car.obj,-7.5,3,8.5,2,1,10,10,0xffffff,true,false);
	//addTorus(car.obj,7.5,3,8.5,2,1,10,10,0xffffff,true,false);

	addWheel(obj,-7.5,3,-7.5,0xffffff,true,0);
	addWheel(obj,-7.5,3,-7.5,0xffffff,true,Math.PI/4);
	addWheel(obj,-7.5,3,-7.5,0xffffff,true,2*Math.PI/4);
	addWheel(obj,-7.5,3,-7.5,0xffffff,true,3*Math.PI/4);
	addWheel(obj,-7.5,3,-7.5,0xffffff,true,4*Math.PI/4);
	addWheel(obj,-7.5,3,-7.5,0xffffff,true,5*Math.PI/4);
	addWheel(obj,-7.5,3,-7.5,0xffffff,true,6*Math.PI/4);
	addWheel(obj,-7.5,3,-7.5,0xffffff,true,7*Math.PI/4);

	addWheel(obj,7.5,3,-7.5,0xffffff,true,0);
	addWheel(obj,7.5,3,-7.5,0xffffff,true,Math.PI/4);
	addWheel(obj,7.5,3,-7.5,0xffffff,true,2*Math.PI/4);
	addWheel(obj,7.5,3,-7.5,0xffffff,true,3*Math.PI/4);
	addWheel(obj,7.5,3,-7.5,0xffffff,true,4*Math.PI/4);
	addWheel(obj,7.5,3,-7.5,0xffffff,true,5*Math.PI/4);
	addWheel(obj,7.5,3,-7.5,0xffffff,true,6*Math.PI/4);
	addWheel(obj,7.5,3,-7.5,0xffffff,true,7*Math.PI/4);

	addWheel(obj,-7.5,3,9.5,0xffffff,true,0);
	addWheel(obj,-7.5,3,9.5,0xffffff,true,Math.PI/4);
	addWheel(obj,-7.5,3,9.5,0xffffff,true,2*Math.PI/4);
	addWheel(obj,-7.5,3,9.5,0xffffff,true,3*Math.PI/4);
	addWheel(obj,-7.5,3,9.5,0xffffff,true,4*Math.PI/4);
	addWheel(obj,-7.5,3,9.5,0xffffff,true,5*Math.PI/4);
	addWheel(obj,-7.5,3,9.5,0xffffff,true,6*Math.PI/4);
	addWheel(obj,-7.5,3,9.5,0xffffff,true,7*Math.PI/4);

	addWheel(obj,7.5,3,9.5,0xffffff,true,0);
	addWheel(obj,7.5,3,9.5,0xffffff,true,Math.PI/4);
	addWheel(obj,7.5,3,9.5,0xffffff,true,2*Math.PI/4);
	addWheel(obj,7.5,3,9.5,0xffffff,true,3*Math.PI/4);
	addWheel(obj,7.5,3,9.5,0xffffff,true,4*Math.PI/4);
	addWheel(obj,7.5,3,9.5,0xffffff,true,5*Math.PI/4);
	addWheel(obj,7.5,3,9.5,0xffffff,true,6*Math.PI/4);
	addWheel(obj,7.5,3,9.5,0xffffff,true,7*Math.PI/4);


	obj.position.x = x;
	obj.position.y = y;
	obj.position.z = z;
}

function createTrack(x,y,z) {
	'use strict';

	var track = new Obj3D("pista");
	var tor;
	var i=0;

	// Mesa
	addCube2(track.obj,0,-1,0,500,1,500,0x090909,true);

	//Manteigas
	var poss=[[138,15,0],[-30,15,30],[-90,15,230],[135,15,-135],[-170,15,50],[-120,15,-150]];
	
	poss.forEach(function(p) {
		var man = new Obj3D("Manteiga"+i);
		addCube(man.obj,0,0,0,60,30,30,0xffff00,true);
		//addCube2(man.obj,0,0,0,60,30,30,0xff0000,true);
		if(i>2)
			man.obj.rotation.y=Math.PI/2;
		man.obj.position.x=p[0];
		man.obj.position.y=p[1];
		man.obj.position.z=p[2];
		manteigasObjects.push(man);
		scene.add(man.obj);
		i++;
	});
	i=0;

	// Torus
 	var pos = [[0,0,230],[0,0,170],[20,0,230],[20,0,170],[-20,0,230],[-20,0,170],[40,0,230],[40,0,170],[-40,0,230],[-40,0,170],[60,0,230],[60,0,170],[-60,0,230],[-60,0,170],[80,0,230],[80,0,170],[-80,0,230],[-80,0,170],[100,0,230],[100,0,170],[-100,0,230],[-100,0,170],[120,0,230],[120,0,170],[-120,0,230],[-120,0,170],[140,0,230],[140,0,170],[-140,0,230],[-140,0,170],[160,0,225],[160,0,150],[180,0,215],[200,0,200],[220,0,180],[230,0,160],[230,0,140],[230,0,120],[230,0,100],[230,0,80],[230,0,60],[230,0,40],[230,0,20],[230,0,0],[0,0,-230],[220,0,-20],[205,0,-40],[190,0,-60],[175,0,-80],[160,0,-100],[145,0,-120],[130,0,-140],[115,0,-160],[100,0,-180],[85,0,-200],[60,0,-220],[30,0,-230],[-30,0,-230],[-50,0,-230],[-70,0,-230],[-90,0,-230],[-110,0,-230],[-130,0,-230],[-150,0,-230],[-170,0,-225],[-190,0,-215],[-210,0,-200],[-225,0,-180],[-230,0,-155],[-230,0,-135],[-225,0,-110],[-210,0,-90],[-190,0,-75],[-160,0,-70],[-140,0,-70],[-120,0,-70],[-100,0,-70],[-80,0,-55],[-65,0,-40],[-80,0,-25],[-100,0,-10],[-120,0,5],[-140,0,20],[-160,0,35],[-180,0,50],[-200,0,65],[-210,0,90],[-220,0,110],[-230,0,130],[-230,0,150],[-230,0,170],[-220,0,190],[-210,0,210],[-190,0,225],[-165,0,230],[160,0,130],[160,0,110],[160,0,90],[160,0,70],[160,0,50],[160,0,30],[150,0,10],[135,0,-10],[120,0,-30],[105,0,-50],[90,0,-70],[75,0,-90],[60,0,-110],[45,0,-130],[30,0,-150],[15,0,-160],[-10,0,-160],[-30,0,-160],[-50,0,-160],[-70,0,-160],[-90,0,-160],[-110,0,-160],[-130,0,-160],[-150,0,-160],[-160,0,-150],[-150,0,-140],[-130,0,-140],[-110,0,-140],[-90,0,-140],[-70,0,-130],[-50,0,-110],[-30,0,-90],[-10,0,-70],[10,0,-50],[15,0,-30],[5,0,-10],[-10,0,10],[-30,0,30],[-50,0,50],[-70,0,70],[-90,0,90],[-110,0,110],[-130,0,130],[-150,0,150]];
	
	pos.forEach(function(p) {
		tor = new movObj("Torus"+i,4,0,0,0,0,0.05);

	    addTorus(tor.obj,0,0,0,4,1,10,10,0x0000ff,true,true);	
	   	tor.obj.position.x=p[0];
		tor.obj.position.y=p[1];
		tor.obj.position.z=p[2];
	    scene.add(tor.obj);
	
	      
	    torusObjects.push(tor);
	    i++;
	});


	//addWheel(track.obj,7.5,3,-8.5,0xffffff,true);
	//addWheel(track.obj,-7.5,3,8.5,0xffffff,true);
	//addWheel(track.obj,7.5,3,8.5,0xffffff,true);


	//Candles
	var posC = [[80,25,-40],[-115,25,150],[135,25,140],[-100,25,-40],[-215,25,-220],[110,25,-210]];
	
	posC.forEach(function(p) {
		createCandle(p[0],p[1],p[2]);
	});

	//addCube2(track.obj,-30,75,100,60,30,10,0xffffff,true);
	scene.add(track.obj);

	track.obj.position.x = x;
	track.obj.position.y = y;
	track.obj.position.z = z;
}

function createOrange(id){
	'use strict';
	var material1,material2;
	if (orangeObjects[id] instanceof movObj) {
		material1=orangeObjects[id].obj.children[0].material;
		material2=orangeObjects[id].obj.children[0].children[0].material;
		scene.remove(orangeObjects[id].obj);
	}
	var r = random(230,230);
	var orange = new movObj("Orange"+id, 2, Math.floor((Math.random()*2)+1), 0, 0, 0, 0);
    addSphere(orange.obj,0,0,0,20,32,32,0xFF4500,true);
	addCube(orange.obj.children[0],0,20,0,2,6,2,0x008000,true);
	
	if (orangeObjects[id] instanceof movObj) {
		orange.obj.children[0].material=material1;
		orange.obj.children[0].children[0].material=material2;
	}

    orange.obj.position.x = r[0];
	orange.obj.position.y = 20;
	orange.obj.position.z = r[1];
	orange.obj.rotation.y = (2*Math.PI)*Math.random();
	scene.add(orange.obj);
    orangeObjects[id]=orange;
}

function createCandle(x,y,z){
	'use strict'

	var candle = new Obj3D("Candle");

	addCylinder(candle.obj,0,0,0,10,10,50,20,0xffcc99,true);
	addCone(candle.obj,0,40,0,5,20,10,0xff0000,true);
	addSphere(candle.obj,0,30,0,5,10,10,0xff0000,true);

	candle.obj.position.x=x;
	candle.obj.position.y=y;
	candle.obj.position.z=z;
	scene.add(candle.obj);
}