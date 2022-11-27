//PONS Yuri MORIN Claire COUTY Antoine
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var nMatrix = mat4.create();
var invMvMatrix = mat4.create();


var distCENTER;
// =====================================================

var BUNNY = null;
var PORSHE = null;
var PLANE = null;
var SPHERE = null;
var CUBEMAP = null;
var CUBE = null;

//======================================================
var objet_gui
var shader_gui
var cubeMap_gui

//======================================================
//default values
var current_shader = "obj_transparent";
var current_texture = "city";
var sigma = 0.3;
var n_ior = 1.0;
var kd = vec3.create([255.0, 255.0, 255.0]);
var TIME = 0;

// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================

function initTexture(folder){
	const face = [
		"cubeMap/" + folder + "/right.jpg",
		"cubeMap/" + folder + "/left.jpg",
		"cubeMap/" + folder + "/top.jpg",
		"cubeMap/" + folder + "/bottom.jpg",
		"cubeMap/" + folder + "/front.jpg",//top
		"cubeMap/" + folder + "/back.jpg"
	];


	
	var texImage = [];
	var count = 0;
	for(var i = 0; i < 6; i++){
		texImage[i] = new Image();
		texImage[i].src = face[i];
		texImage[i].onload = function () {
			count++;
			if(count == 6){
				var texture = gl.createTexture();
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				for(var j =0 ; j < 6; j++){			
					gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X +j , 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texImage[j] );
				}
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);			
			}
		}
		
	}	
}	

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.7, 0.7, 0.7, 1.0);
		gl.enable(gl.DEPTH_TEST);
		//gl.enable(gl.CULL_FACE);
		//gl.cullFace(gl.BACK); 
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}

// =====================================================



// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl,tmpMesh);
			OBJ3D.mesh=tmpMesh;
		}
	}

	xhttp.open("GET", OBJ3D.objName, true);
	xhttp.send();
}



// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(Obj3D.loaded==2) {
			Obj3D.loaded ++;
			compileShaders(Obj3D);
			Obj3D.loaded ++;
		}
	}
  }
  
  Obj3D.loaded = 0;
  xhttp.open("GET", "shader/"+Obj3D.shaderName+ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.shaderName+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.shaderName+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(Obj3D.shader));
	}
}


// =====================================================
function webGLStart() {
	
	
	var canvas = document.getElementById("WebGL-test");

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;

	initGL(canvas);
	initUi();
	initTexture("skybox");

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	distCENTER = vec3.create([0,-0.2,-3]);
	
	CUBEMAP = new cubeMap('cube_map', 50);
	PLANE = new plane();
	BUNNY = new objmesh('obj/bunny.obj');
	PORSHE = new objmesh('obj/porsche.obj');
	SPHERE = new objmesh('obj/sphere.obj');
	CUBE = new objmesh('obj/untitled.obj');
	
	tick();
}

// =====================================================
function drawScene() {
	TIME++;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	CUBEMAP.draw();
	updateUI();
}





