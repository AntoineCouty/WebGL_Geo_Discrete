#define PI 3.1415926538
precision mediump float;



varying vec3 pos3D;
varying vec3 N;

uniform vec3 camPos;
uniform mat4 invViewMat;
uniform samplerCube skyBox;

// ==============================================

vec3 RotX(vec3 pos){

	float angle = -PI*0.5;
	mat3 rot = mat3(1.0,    0.0,      0.0, 
					0.0, cos(angle), -sin(angle), 
					0.0, sin(angle), cos(angle));
	return vec3(pos * rot);
}


void main(void)
{
	vec3 I = normalize(pos3D);
	vec3 R = reflect(I, normalize(N));
	vec3 T = vec3(invViewMat *  vec4(R, 0.0));
	gl_FragColor = textureCube(skyBox, RotX(T));
}


