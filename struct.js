//PONS Yuri MORIN Claire COUTY Antoine
// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class objmesh {

	// --------------------------------------------
	constructor(objFname) {
		this.objName = objFname;
		this.mesh = null;
		this.loaded = -1;
		this.shader = null;
		loadObjFile(this);
		this.reload();
	}

	reload(){
		this.shaderName = current_shader;
		loadShaders(this);
	}

	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.nMatrixUniform = gl.getUniformLocation(this.shader, "uNMatrix");
        this.shader.invMVMatrixUniform = gl.getUniformLocation(this.shader, "invViewMat");
		this.shader.kdUniform = gl.getUniformLocation(this.shader, "uKd");
		gl.uniform3fv(this.shader.kdUniform, kd);

		this.shader.texSampler = gl.getUniformLocation(this.shader, "skyBox");
		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(this.shader.texSampler, 0);
	}

	setShadersPbrParams(){

		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.nMatrixUniform = gl.getUniformLocation(this.shader, "uNMatrix");

		this.shader.sigmaUniform = gl.getUniformLocation(this.shader, "sigma");
		this.shader.nIorUniform = gl.getUniformLocation(this.shader, "u_n");
		this.shader.kdUniform = gl.getUniformLocation(this.shader, "uKd");
		this.shader.timeUniform = gl.getUniformLocation(this.shader, "time");
		
		this.shader.invMVMatrixUniform = gl.getUniformLocation(this.shader, "invViewMat");
		this.shader.texSampler = gl.getUniformLocation(this.shader, "skyBox");
		gl.activeTexture(gl.TEXTURE0);
		
		gl.uniform1i(this.shader.texSampler, 0);
		gl.uniform1f(this.shader.sigmaUniform, sigma);
		gl.uniform1f(this.shader.nIorUniform, n_ior);
		gl.uniform3fv(this.shader.kdUniform, kd);
		gl.uniform1f(this.shader.timeUniform, TIME);

	}
	
	// --------------------------------------------
	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		mat4.set(mvMatrix, nMatrix);
		mat4.set(mvMatrix, invMvMatrix);

        mat4.transpose(mat4.inverse(nMatrix));
		mat4.inverse(invMvMatrix);

		gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader.nMatrixUniform, false, nMatrix);
        gl.uniformMatrix4fv( this.shader.invMVMatrixUniform, false, invMvMatrix);
	}
	
	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4 && this.mesh != null) {
			updateShader();
			if(this.shaderName == "cook_t"){
				this.setShadersPbrParams();
			}else{
				this.setShadersParams();
			}
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
}



// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

class plane {
	
	// --------------------------------------------
	constructor() {
		this.shaderName='plane';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}
		
	// --------------------------------------------
	initAll() {
		var size=1.0;
		var vertices = [
			-size, -size, 0.0,
			 size, -size, 0.0,
			 size, size, 0.0,
			-size, size, 0.0
		];

		var texcoords = [
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		//Vertex
		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 4;

		//Texture
		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 4;

		loadShaders(this);
	}
	
	
	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
		gl.enableVertexAttribArray(this.shader.tAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
		}
	}

}


// =====================================================
// Class cube map 
// =====================================================

class cubeMap{

	constructor(shader, sizeBox){
		this.shaderName= "cube_map";
		this.loaded=-1;
		this.shader=null;
		this.size = sizeBox;
		this.initAll();
	}

	initAll(){
		var sizeBox =this.size;

		var cube_pos = [
			//right
			sizeBox,  -sizeBox, -sizeBox,
			sizeBox,   sizeBox, -sizeBox,
			sizeBox,  -sizeBox,  sizeBox,
			sizeBox,  -sizeBox,  sizeBox,
			sizeBox,   sizeBox, -sizeBox,
			sizeBox,   sizeBox,  sizeBox,

			//left
			-sizeBox,  -sizeBox, -sizeBox,
			-sizeBox,  -sizeBox,  sizeBox,
			-sizeBox,   sizeBox, -sizeBox,
			-sizeBox,  -sizeBox,  sizeBox,
			-sizeBox,   sizeBox,  sizeBox,
			-sizeBox,   sizeBox, -sizeBox,
			
			//top
			-sizeBox,   sizeBox, -sizeBox,
			-sizeBox,   sizeBox,  sizeBox,
			 sizeBox,   sizeBox, -sizeBox,
			-sizeBox,   sizeBox,  sizeBox,
			 sizeBox,   sizeBox,  sizeBox,
			 sizeBox,   sizeBox, -sizeBox,

			//bottom
			-sizeBox,  -sizeBox, -sizeBox,
			 sizeBox,  -sizeBox, -sizeBox,
		    -sizeBox,  -sizeBox,  sizeBox,
		    -sizeBox,  -sizeBox,  sizeBox,
			 sizeBox,  -sizeBox, -sizeBox,
			 sizeBox,  -sizeBox,  sizeBox,	

			//front
			-sizeBox, -sizeBox,   sizeBox,
			 sizeBox, -sizeBox,   sizeBox,
		    -sizeBox,  sizeBox,   sizeBox,
		    -sizeBox,  sizeBox,   sizeBox,
			 sizeBox, -sizeBox,   sizeBox,
			 sizeBox,  sizeBox,   sizeBox,

			//back
			-sizeBox, -sizeBox,  -sizeBox,
			-sizeBox,  sizeBox,  -sizeBox,
			 sizeBox, -sizeBox,  -sizeBox,
			-sizeBox,  sizeBox,  -sizeBox,
			 sizeBox,  sizeBox,  -sizeBox,
			 sizeBox, -sizeBox,  -sizeBox,
		];

		
		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cube_pos), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = cube_pos.length/3;

		loadShaders(this);
		
	}

	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);



		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");


		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);	

		
		this.shader.texSampler = gl.getUniformLocation(this.shader, "uSampler");
		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(this.shader.texSampler, 0);
	}

	

	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();

			gl.drawArrays(gl.TRIANGLES, 0, this.vBuffer.numItems);
			
		}
	}
}

