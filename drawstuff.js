/* classes */ 

// Point constructor
class Point {
	constructor(x,y,z) {
		try {
			this.x = x, this.y = y, this.z = z;
		}
		catch (e) {
			console.log(e);
		}
	}
	change(x,y,z){
		this.x = x, this.y = y, this.z = z;
	}
}

class Vector {
	constructor(x,y,z) {
		try {
			this.x = x, this.y = y, this.z = z;
		}
		catch (e) {
			console.log(e);
		}
	}
	change(x,y,z){
		this.x = x, this.y = y, this.z = z;
	}
}

// Vector constructor
class UnitVector {
	constructor(x,y,z) {
		try {
			var l = Math.sqrt(x*x + y*y + z*z);
			this.x = x/l, this.y = y/l, this.z = z/l;
		}
		catch (e) {
			console.log(e);
		}
	}
	change(x,y,z){
			var l = Math.sqrt(x*x + y*y + z*z);
			this.x = x/l, this.y = y/l, this.z = z/l;
	}
}

// Color constructor
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class


/* utility functions */

function get(id) { return document.getElementById(id); }

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    
// get the input spheres from the standard class URL
function getInputSpheres() {
    const INPUT_SPHERES_URL = 
        "https://ncsucgclass.github.io/prog1/spheres.json";
        
    // load the spheres file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_SPHERES_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input spheres file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input spheres

// solve a quadratic equation, return the smallest positive t value that greater or equal to 1,
// or -1, which means no intersect
function solveQuadra(a,b,c) {
		
	var ret = -1;
	t1=-b/2/a+Math.sqrt(Math.pow(b,2)-4*a*c)/2/a;
	t2=-b/2/a-Math.sqrt(Math.pow(b,2)-4*a*c)/2/a;
	
	// t less than 1 means the intersection is between eye and the window
	if (isNaN(t1) && isNaN(t2)) {
	} else if (isNaN(t1)) {
		if (t2 >= 1){
			ret =  t2;
		}
	} else if (isNaN(t2)) {
		if (t1 >= 1){
			ret = t1;
		}
	} else {
		if (t1 < t2){
			if (t2 < 1){
			} else if (t1 < 1) {
				ret = t2;
			} else {
				ret = t1;
			}
		} else {
			if (t1 < 1){
				
			} else if (t2 < 1) {
				ret = t1;
			} else {
				ret = t2;
			}
		}
	}
	
	return ret;
}

// compute dot product
function dotProduct(a,b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;	
}

// determine if the intersect is in shadow
function isInShadow(inputSpheres, index, intersect, light) {
	// define a ray through this pixel and eye, which represented by x = a*t + b
	a1 = light.x - intersect.x; 
	b1 = intersect.x;
	a2 = light.y - intersect.y; 
	b2 = intersect.y;
	a3 = light.z - intersect.z;
	b3 = intersect.z;
	var n = inputSpheres.length; 
	var c1,c2,c3 = 0;
	var a,b,cc = 0;
	var shadow = 1;
	
	// Loop over the spheres
	// sphere equation (x-x1)^2+(y-y1)^2+(z-z1)^2=R^2
	for (var s=0; s<n; s++) {			
					
		c1 = b1 - inputSpheres[s].x; 
		c2 = b2 - inputSpheres[s].y;
		c3 = b3 - inputSpheres[s].z;
					
		a = (a1*a1 + a2*a2 + a3*a3);
		b = 2*(a1*c1 + a2*c2 + a3*c3);
		cc = c1*c1 + c2*c2 + c3*c3 - inputSpheres[s].r * inputSpheres[s].r;
		
		// solve quadratic equation
		t1=-b/2/a+Math.sqrt(Math.pow(b,2)-4*a*cc)/2/a;
		t2=-b/2/a-Math.sqrt(Math.pow(b,2)-4*a*cc)/2/a;
		
		// due to the loss of significant of float number, 
		// intersect if 1 > root > 1e-10 
		var tol = 1e-10;
		if (isNaN(t1) && isNaN(t2)) {
		} else if (isNaN(t1)){
			if (t2 > tol && t2 < 1){
				shadow =  0; // In shadow
				return shadow;
			}
		} else if (isNaN(t2)){
			if (t1 > tol && t1 < 1){
				shadow = 0; // In shadow
				return shadow;
			}
		} else {
			if ((t2 > tol && t2 < 1)|| (t1 > tol && t1 < 1)){
				shadow = 0; // In shadow
				return shadow;
			}
		}
	}
	return shadow;
}

// draw 
function draw(context, eye, look_at, view_up, win) {
	var inputSpheres = getInputSpheres();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
	var light = new Point(2,4,-0.5);
	//var upperLeft = new Point(0,1,0);
	//var lowerRight = new Point(1,0,0);
	var m = 10;
	var a1, b1, a2, b2, a3, b3 = 0;
	
	// cneter of window located 0.5 from eye
	var center = new Point(eye.x+0.5*look_at.x, eye.y+0.5*look_at.y, eye.z+0.5*look_at.z);
	
	// use the cross product of view up and look at vector to determine horizontial coordinate
	var right = new UnitVector(view_up.y*look_at.z-view_up.z*look_at.y,view_up.z*look_at.x-view_up.x*look_at.z,view_up.x*look_at.y-view_up.y*look_at.x);
	//console.log("Right direction = "+ right.x + "," + right.y + "," + right.z);
	
	
	// check if sphere file found
	if (inputSpheres == String.null) { 
		alert("NO INPUT SPHERE");
	}
	
	//loop over every pixel
	for (var i=0; i< w; i++) {
		for (var j=0; j < h; j++) {
			
			var c = new Color(0,0,0,255); // the color at the pixel: black
			var t = 0;// t used to store the close intersect
			var intersected = -1;// store the sequence number of the intersected sphere, -1 means no intersect
			
			//location of pixel			
			//var x = center.x + (i/w - 0.5)*right.x + (0.5 - j/h)*view_up.x;
			//var y = center.y + (i/w - 0.5)*right.y + (0.5 - j/h)*view_up.y;
			//var z = center.z + (i/w - 0.5)*right.z + (0.5 - j/h)*view_up.z;
			
			
			var x = center.x - win[0]*right.x + i/w*(win[0]+win[1])*right.x + win[2]*view_up.x - j/h*(win[2]+win[3])*view_up.x;
			var y = center.y - win[0]*right.y + i/w*(win[0]+win[1])*right.y + win[2]*view_up.y - j/h*(win[2]+win[3])*view_up.y;
			var z = center.z - win[0]*right.z + i/w*(win[0]+win[1])*right.z + win[2]*view_up.z - j/h*(win[2]+win[3])*view_up.z;
			
			
			
			// define a ray through this pixel and eye, which represented by x = a*t + b
			a1 = x - eye.x; 
			b1 = eye.x;
			a2 = y - eye.y; 
			b2 = eye.y;
			a3 = z - eye.z;
			b3 = eye.z;
			
			var n = inputSpheres.length; 
			var c1,c2,c3 = 0;
			var a,b,cc = 0;
			// Loop over the spheres
			// sphere equation (x-x1)^2+(y-y1)^2+(z-z1)^2=R^2
			for (var s=0; s<n; s++) {
					
				c1 = b1 - inputSpheres[s].x; 
				c2 = b2 - inputSpheres[s].y;
				c3 = b3 - inputSpheres[s].z;
					
				a = (a1*a1 + a2*a2 + a3*a3);
				b = 2*(a1*c1 + a2*c2 + a3*c3);
				cc = c1*c1 + c2*c2 + c3*c3 - inputSpheres[s].r * inputSpheres[s].r;
				var root = solveQuadra(a,b,cc);
					
				// ray - sphere interesect
				if (root != -1){
					if (intersected == -1 || root < t){
						intersected = s; 
						t = root; // rember the intersect
						
						// compute the point of intersection
						var intersect = new Point(a1*t+b1, a2*t+b2, a3*t+b3);
						//compute the light, view, and normal vector
						var v_l = new UnitVector(light.x - intersect.x,
												light.y - intersect.y,
												light.z - intersect.z
												); 
						var v_v = new UnitVector(eye.x - intersect.x,
												eye.y - intersect.y,
												eye.z - intersect.z
												); 
						var v_n = new UnitVector(intersect.x - inputSpheres[intersected].x,
												intersect.y - inputSpheres[intersected].y,
												intersect.z -inputSpheres[intersected].z
												); 
						var v_h = new UnitVector((v_l.x + v_v.x)/2,
												(v_l.y + v_v.y)/2,
												(v_l.z + v_v.z)/2
												);
							
						var k_d = dotProduct(v_n,v_l);
						var k_s = Math.pow(dotProduct(v_n,v_h), m);
						
						if (k_d < 0) {
							k_d = 0;
						}
						
						if (k_s < 0) {
							k_s = 0;
						}
						
						// shadow indicator
						var shadow = isInShadow(inputSpheres, intersected, intersect, light);
							
						c.change(
							inputSpheres[intersected].ambient[0]*255 + shadow * (inputSpheres[intersected].diffuse[0]*255*k_d + inputSpheres[intersected].specular[0]*255*k_s),
							inputSpheres[intersected].ambient[1]*255 + shadow * (inputSpheres[intersected].diffuse[1]*255*k_d + inputSpheres[intersected].specular[1]*255*k_s),
							inputSpheres[intersected].ambient[2]*255 + shadow * (inputSpheres[intersected].diffuse[2]*255*k_d + inputSpheres[intersected].specular[2]*255*k_s),
								255); 
						
					}
				}
			} 
			
			
			//draw pixel
			drawPixel(imagedata,i,j,c);
			c.change(0,0,0,255);
		}
	}	
	context.putImageData(imagedata, 0, 0);
}

function main() {
	
	var width = 512;
	var height = 512;
	var eye = new Point(0.5,0.5,-0.5);
	var look = new UnitVector(0,0,1);
	var view = new UnitVector(0,1,0);
	var win = [0.5,0.5,0.5,0.5];//l,r,t,b
		
	// canvas
	if (get("width").value!="") width = parseInt(get("width").value);
	if (get("height").value!="") height = parseInt(get("height").value);
	
	// eye
	var eye_x,eye_y,eye_z = 0;
	if (get("eye_x").value!="") eye_x = parseFloat(get("eye_x").value);
	if (get("eye_y").value!="") eye_y = parseFloat(get("eye_y").value);
	if (get("eye_z").value!="") eye_z = parseFloat(get("eye_z").value);
	if (isNaN(eye_x) || isNaN(eye_y) || isNaN(eye_z)) {
		alert("invalid eye location");
	} else {
		eye.change(eye_x,eye_y,eye_z);
	}
	
	
	var look_x,look_y,look_z = 0
	var l_t = new UnitVector(0,0,0);
	// look at
	if (get("look_x").value!="") look_x = parseFloat(get("look_x").value);
	if (get("look_y").value!="") look_y = parseFloat(get("look_y").value);
	if (get("look_z").value!="") look_z = parseFloat(get("look_z").value);
	if (isNaN(look_x) || isNaN(look_y) || isNaN(look_z)){
		alert("invalid look at vector");
	} else {
		l_t.change(look_x,look_y,look_z);
	}
	
	var view_x,view_y,view_z = 0;
	var v_t = new UnitVector(0,0,0);
	// view up
	if (get("view_x").value!="") view_x = parseFloat(get("view_x").value);
	if (get("view_y").value!="") view_y = parseFloat(get("view_y").value);
	if (get("view_z").value!="") view_z = parseFloat(get("view_z").value);
	if(isNaN(view_x) || isNaN(view_y) || isNaN(view_z)){
		alert("invalid view up vector");
	}else{
		v_t.change(view_x,view_y,view_z);
	}
	
	if (dotProduct(v_t,l_t) > 1e-16 ){
		alert("view up and look at vector must be orthnormal");
	} else{
		view.change(v_t.x,v_t.y,v_t.z);
		look.change(l_t.x,l_t.y,l_t.z);
	}
	
	
	// window
	var l,r,t,b = 0;
	if (get("left").value!="") l = parseFloat(get("left").value);
	if (get("right").value!="") r = parseFloat(get("right").value);
	if (get("top").value!="") t = parseFloat(get("top").value);
	if (get("bottom").value!="") b = parseFloat(get("bottom").value);
	if (isNaN(l) || isNaN(r) || isNaN(t) || isNaN(b) || l < 0 || r < 0 || t < 0 || b < 0 ){
		alert("invalid window setup");
	} else {
		win = [l,r,t,b];
	}
	
	
	if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0){
		alert("width and height must be positive number");
	} else {
		// Get the canvas and context
		var canvas = document.getElementById("viewport"); 
		canvas.width = width;
		canvas.height = height;
	
		var context = canvas.getContext("2d");
		
		draw(context,eye,look,view,win);
	}
    
}