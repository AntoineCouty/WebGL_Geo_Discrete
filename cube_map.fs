
precision mediump float;

varying vec2 texCoords;
uniform samplerCube uSampler;

void main(void)
{
	gl_FragColor = textureCube(uSampler,texCoords);
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 0.0);

}



