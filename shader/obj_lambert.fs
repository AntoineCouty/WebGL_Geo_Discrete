#define PI 3.1415926538

precision mediump float;

varying vec4 pos3D;
varying vec3 N;

uniform samplerCube skyBox;

// ==============================================


void main(void)
{
	vec3 col = vec3(0.8,0.4,0.4) * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
	gl_FragColor = vec4(col,1.0);
}




