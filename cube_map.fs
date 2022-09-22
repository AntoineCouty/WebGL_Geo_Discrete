
precision mediump float;

varying vec3 texCoords;
uniform samplerCube uSampler;

void main(void)
{
	gl_FragColor = textureCube(uSampler,texCoords);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

}



