attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uNMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 pos3D;
varying vec3 N;

void main(void) {
	pos3D = uMVMatrix * vec4(aVertexPosition,1.0);
	N = vec3(uNMatrix * vec4(aVertexNormal,1.0));
	gl_Position = uPMatrix * pos3D;
}
