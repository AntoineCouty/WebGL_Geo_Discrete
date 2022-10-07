#define PI 3.1415926538
precision mediump float;



varying vec3 pos3D;
varying vec3 N;
varying mat4 MVMatrix;

uniform vec3 camPos;
uniform float sigma;

float dFunc( vec3 normal, vec3 h )
{
    float alpha = sigma;
	float alpha2 = _alpha * _alpha;
	return alpha2 / ( PI * pow( pow( dot( normal, h ), 2 ) * ( alpha2 - 1.f ) + 1.f, 2 ) );
}

float gFunc( float x ) { 
	float k = ( ( sigma + 1 ) * ( sigma + 1 ) ) / 8.f;
	return x / ( x * ( 1.f - k ) + k ); 
}

vec3 fFunc( const vec3 wO, vec3 h) const {
	return _F0 + ( 1.f - _F0 ) * pow( 1.f - dot( h, wO ), 5.f );
}

void main(void){
    vec3 wO =  pos3D;
	vec3 wI = wi ;
	vec3 normal = N;
	vec3 h = normalize(wO + wI) ;
			
	float G1wO = dot( normal, wO );
	float G1wI = dot( normal, wI );

	float D = dFunc( normal, h );
			
	float G = gFunc( G1wO ) * gFunc( G1wI );
			
	 vec3 F = fFunc( wO, h );
	
	gl_FragColor = vec4(( D * F * G ) / ( 4.f * G1wO * G1wI ), 1.0);
}

