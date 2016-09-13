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

// draw 
function draw(context) {
	var inputSpheres = getInputSpheres();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
	var eye = new Point(0.5,0.5,-0.5);
	var light = new Point(1,1,-0.5);
	var upperLeft = new Point(0,1,0);
	var lowerRight = new Point(1,0,0);
	var m = 10;
	var a1, b1, a2, b2, a3, b3 = 0;
	
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
			var x = i / w;// map each pixel to window , z coord is 0
			var y = 1 - j / h;
			var z = 0;
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
							
						c.change(
							inputSpheres[intersected].ambient[0]*255 + inputSpheres[intersected].diffuse[0]*255*k_d + inputSpheres[intersected].specular[0]*255*k_s,
							inputSpheres[intersected].ambient[1]*255 + inputSpheres[intersected].diffuse[1]*255*k_d + inputSpheres[intersected].specular[1]*255*k_s,
							inputSpheres[intersected].ambient[2]*255 + inputSpheres[intersected].diffuse[2]*255*k_d + inputSpheres[intersected].specular[2]*255*k_s,
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
	
    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
 
	draw(context);
}