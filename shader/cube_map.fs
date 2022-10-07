#define PI 3.1415926538
precision mediump float;

varying vec3 texCoords;
uniform samplerCube uSampler;

void main(void)
{
	float angle = -PI*0.5;
	mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0,
	 				cos(angle), -sin(angle), 0.0,
	  				sin(angle), cos(angle));
	vec3 texCoordsRot = texCoords * rotX;
	gl_FragColor = textureCube(uSampler, normalize(texCoordsRot) );
}


