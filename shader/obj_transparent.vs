attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uRMatrix;
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec3 pos3D;
varying vec3 N;

void main(void) {

	N = (uNMatrix * vec4(aVertexNormal, 0.0)).xyz;				//Application de la NormalMatrix aux normales
	pos3D =  (uMVMatrix * vec4(aVertexPosition, 1.0)).xyz;					//Calcul de L0 avec les positions misent dans le View space
	gl_Position =  uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}

