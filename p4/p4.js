var camera, scene, renderer, container;
var objects = [];
var objSpeeds = [];
var t = 0;

var bg1,bg2,bg3,bg4,bg5,frog;
var car1a,car1b,car1c,car2a,car2b,car3a,car3b,car3c; 
var turtle1, turtle2, turtle3;
var log1a,log1b,log2a,log2b;

var objSpeed = 0.1;
var objStandingOnIdx = -1;
var lives = 3;
var currMaxDist = -4;
var points = 0;
var level = 1;
var livesElement = document.getElementById("lives");
livesElement.innerHTML = "Lives: " + lives;            
var pointsElement = document.getElementById("score");
pointsElement.innerHTML = "Score: " + points; 
var levelElement = document.getElementById("level");
levelElement.innerHTML = "Level: " + level; 

init();		
animate();

function init() {
	
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	// scene
	scene = new THREE.Scene();
	
	// camera
	camera = new THREE.PerspectiveCamera( 75, 1,0.1, 1000 );
	camera.position.set(0,-6,6);	
	camera.rotation.x = Math.PI/4;
	scene.add( camera );

	// light 
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( 0, 0, 10 );
	light.castShadow = true;
	scene.add(light);
	var alight = new THREE.AmbientLight( 0x404040 ); // soft white light
	scene.add( alight );
	
	// materials
	var bg135Material = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#F0B105" ) } );
	var bg2Material = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#B0BBBF" ) } );
	var bg4Material = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#4005F0") } );
    var frogMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#5FF22E" )} );
	var logMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#85694A" ) } );
	var turtleMaterial = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#435C46" )} );
	var car13Material = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#F71919" ) } );
	var car2Material = new THREE.MeshLambertMaterial( { color: new THREE.Color( "#E010CF" ) } );
	
	// geometry
	var bg135Geometry = new THREE.BoxGeometry(9, 1, 0.1);
	var bg24Geometry = new THREE.BoxGeometry(9, 3, 0.1);
	var frogGeometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2);
	var car13Geometry = new THREE.BoxGeometry( 1, 0.6, 0.6 );
	var car2Geometry = new THREE.BoxGeometry( 2, 0.8, 0.8 );
	var logGeometry = new THREE.BoxGeometry( 2.5, 0.4, 0.4 );
	var turtleGeometry = new THREE.BoxGeometry( 1, 1, .5 );
	
	// mesh
	// background
	bg1 = new THREE.Mesh( bg135Geometry, bg135Material);
	bg1.position.set(0, -4, 0);

	bg1.receiveShadow = true;
	scene.add(bg1);
	bg2 = new THREE.Mesh( bg24Geometry, bg2Material);
	bg2.position.set(0, -2, 0);
	
	bg2.receiveShadow = true;
	scene.add(bg2);
	bg3 = new THREE.Mesh( bg135Geometry, bg135Material);

	bg3.receiveShadow = true;
	scene.add(bg3);
	bg4 = new THREE.Mesh( bg24Geometry, bg4Material);
	bg4.position.set(0, 2, 0);

	bg4.receiveShadow = true;
	scene.add(bg4);
	bg5 = new THREE.Mesh( bg135Geometry, bg135Material);
	bg5.position.set(0, 4, 0);

	bg5.receiveShadow = true;
	scene.add(bg5);
	
	// frog
	frog = new THREE.Mesh( frogGeometry, frogMaterial );
	frog.position.set(0, -4, frog.geometry.parameters.depth);
	scene.add(frog);
	
	car1a = new THREE.Mesh( car13Geometry, car13Material);
	car1b = new THREE.Mesh( car13Geometry, car13Material);
	car1c = new THREE.Mesh( car13Geometry, car13Material);
	car2a = new THREE.Mesh( car2Geometry, car2Material);
	car2b = new THREE.Mesh( car2Geometry, car2Material);
	car3a = new THREE.Mesh( car13Geometry, car13Material);
	car3b = new THREE.Mesh( car13Geometry, car13Material);
	car3c = new THREE.Mesh( car13Geometry, car13Material);	
	log1a = new THREE.Mesh( logGeometry, logMaterial);
	log1b = new THREE.Mesh( logGeometry, logMaterial);
	turtle1 = new THREE.Mesh( turtleGeometry, turtleMaterial);
	turtle2 = new THREE.Mesh( turtleGeometry, turtleMaterial);
	turtle3 = new THREE.Mesh( turtleGeometry, turtleMaterial);
	log2a = new THREE.Mesh( logGeometry, logMaterial);
	log2b = new THREE.Mesh( logGeometry, logMaterial);
	
	// moving objects
	objects.push(car1a);
	objects.push(car1b);
	objects.push(car1c);
	objects.push(car2a);
	objects.push(car2b);
	objects.push(car3a);
	objects.push(car3b);
	objects.push(car3c);
	objects.push(log1a);
	objects.push(log1b);
	objects.push(turtle1);
	objects.push(turtle2);
	objects.push(turtle3);
	objects.push(log2a);
	objects.push(log2b);
	
	// car row 1, y = -3
	var columnOrig = -4;
	for (var i = 0; i < 3; i++){
		objSpeeds[i] = objSpeed/10;;
		objects[i].position.set(columnOrig + i*3.5, -3, objects[i].geometry.parameters.depth/2);
		objects[i].castShadow = true;
		scene.add(objects[i]);
	}
	
	// car row 2, y = -2
	columnOrig = 3.5;
	for (var i = 0; i < 2; i++){
		objSpeeds[i+3] = -objSpeed/20;
		objects[i+3].position.set(columnOrig - i*4, -2, objects[i].geometry.parameters.depth/2);
		objects[i+3].castShadow = true;
		scene.add(objects[i+3]);
	}
	
	// car row 3, y = -1
	columnOrig = -3;
	for (var i = 0; i < 3; i++){
		objSpeeds[i+5] = objSpeed/5;
		objects[i+5].position.set(columnOrig + i*2.5, -1, objects[i].geometry.parameters.depth/2);
		objects[i+5].castShadow = true;
		scene.add(objects[i+5]);
	}
	
	// log row 1, y = 1
	columnOrig = 3.5;
	for (var i = 0; i < 2; i++){
		objSpeeds[i+8] = -objSpeed/25;
		objects[i+8].position.set(columnOrig - i*4, 1, 0);
		objects[i+8].castShadow = true;
		scene.add(objects[i+8]);
	}
	
	// turtle , y = 2
	columnOrig = -3.5;
	for (var i = 0; i < 3; i++){
		objSpeeds[i+10] = objSpeed/25;
		objects[i+10].position.set(columnOrig + i*2, 2, 0);
		objects[i+10].castShadow = true;
		scene.add(objects[i+10]);
	}
	
	// log row 2, y =3
	columnOrig = 1;
	for (var i = 0; i < 2; i++){
		objSpeeds[i+13] = -objSpeed/15;
		objects[i+13].position.set(columnOrig - i*6, 3, 0);
		objects[i+13].castShadow = true;
		scene.add(objects[i+13]);
	}
	
	// renderer
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( 512, 512 );
	container.appendChild( renderer.domElement );
	
}

function moveObjects(){
	for(var i = 0; i < objects.length; i++){
		
		if(objects[i].position.x - objects[i].geometry.parameters.width/2 > 4.5  && objSpeeds[i] > 0){
			objects[i].position.x = -4.5 - objects[i].geometry.parameters.width/2
		}else if (objects[i].position.x + objects[i].geometry.parameters.width/2 < -4.5 && objSpeeds[i] < 0){
			objects[i].position.x = 4.5 + objects[i].geometry.parameters.width/2;
		}else{
			objects[i].position.x += objSpeeds[i];
		}
		//turtles bobbing
		if(i > 9 && i < 13){
			objects[i].position.z = -objects[i].geometry.parameters.depth/4 + objects[i].geometry.parameters.depth/4 * Math.sin(t);
			t+=0.005;
		}
	}
	if(objStandingOnIdx != -1){
		frog.position.x += objSpeeds[objStandingOnIdx];
	}
}

document.onkeydown = handleKeyDown; 

function handleKeyDown(event) {
	objStandingOnIdx = -1;
	if(lives != 0){
		
	    switch (event.code) {
	        case "KeyW": //  left
	        		frog.position.y+=1;
	            break;
	        case "KeyA": //  right
	        		frog.position.x-=1;
	            break;
	        case "KeyS": // forward 		
	        		frog.position.y-=1;
	            break;
	        case "KeyD": // backward
	        		frog.position.x+=1; 
	    } 
		if(frog.position.y > currMaxDist){
			currMaxDist = frog.position.y;
			points += 100;
		}
		pointsElement.innerHTML = "Score: " + points;	
	}
} 

function checkCollisions(){
	
	var collided = false;
	var vtxs = [];
	for(var vertNum = 0; vertNum < frog.geometry.vertices.length; vertNum++){
		
		vtxs[vertNum] = frog.geometry.vertices[vertNum].clone();
		vtxs[vertNum].applyMatrix4(frog.matrixWorld);
	}
	for(var i = 0; i < objects.length; i++){
		
		//check if player vertex is between corners of this object's box
		var topRight = objects[i].geometry.vertices[0].clone();
		topRight.applyMatrix4(objects[i].matrixWorld);
		var bottomLeft = objects[i].geometry.vertices[6].clone();
		bottomLeft.applyMatrix4(objects[i].matrixWorld);
		for(var j = 0; j < vtxs.length; j++){
			
			//case player's vertex is within the bounding box of an object (collision occurs)
			if(vtxs[j].x < topRight.x 
				&& vtxs[j].y < topRight.y
				&& vtxs[j].z < topRight.z
				&& vtxs[j].x > bottomLeft.x 
				&& vtxs[j].y > bottomLeft.y
				&& vtxs[j].z > bottomLeft.z
				){
					
				if(frog.position.y > 0){
					objStandingOnIdx = i;
				}
				collided = true;
				break;
			}
		}
	}
	//frog dies
	if(frog.position.y < 0 && collided || frog.position.y > 0 && frog.position.y < 4 && !collided || frog.position.x < -4.5 || frog.position.x > 4.5
		|| frog.position.y < -4){
			
		objStandingOnIdx = -1;
		if(lives > 0)
        {
        	frog.position.set(0, -4, frog.geometry.parameters.depth);
            lives--;
            if(lives == 0)
            {
            	
            	
            	livesElement.innerHTML = "Game Over!";
            	frog.position.z = -100;
            }
            else
            	livesElement.innerHTML = "Lives: " + lives;            
        }		
	}
	
	//level complete
	if(frog.position.y > 3){

		objStandingOnIdx = -1;
		frog.position.set(0, -4, frog.geometry.parameters.depth);
		lives = 3;            
		points+=1000;
		livesElement.innerHTML = "Lives: " + lives;
		pointsElement.innerHTML = "Score: " + points;	

		for (var i = 0; i < objects.length ; i++){
			objSpeeds[i] *= 1.5;
		}
		
		if(level == 5){
			levelElement.innerHTML = "You Win!";
			frog.position.z = -100;
		}else{
			level++;
			levelElement.innerHTML = "Level: " + level;
		}
		
	}
}

function firstPerson(){
	camera.position.x += 0.05 * (frog.position.x - camera.position.x);
	camera.position.y += (-.1 + (0.05 * (frog.position.y - camera.position.y)));

}

function animate(){
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	moveObjects();
	checkCollisions();
	firstPerson();
}