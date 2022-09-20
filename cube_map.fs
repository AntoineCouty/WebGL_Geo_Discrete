
precision mediump float;

varying vec2 texCoords;
uniform samplerCube uSampler;

void main(void)
{
	gl_FragColor = textureCube(uSampler, vec2(tCoords.s, tCoords.t));
}



