#define PI 3.1415926538
precision mediump float;



varying vec3 pos3D;
varying vec3 N;

uniform vec3 lightPosition;
uniform vec3 camera;
uniform float metalness;
uniform float sigma;


float dFunc( vec3 normal, vec3 h )
{
    float alpha = sigma;
	float alpha2 = alpha * alpha;
	return alpha2 / ( PI * pow( pow( dot( normal, h ), 2.0 ) * ( alpha2 - 1.0 ) + 1.0, 2.0 ) );
}

float gFunc( float x ) { 
	float k = ( ( sigma + 1.0 ) * ( sigma + 1.0 ) ) / 8.0;
	return x / ( x * ( 1.0 - k ) + k ); 
}

vec3 fFunc( vec3 wO, vec3 h)  {
	vec3 F0 = vec3(0.8,0.4,0.4);
	return F0 + ( 1.0 - F0 ) * pow( 1.0 - max(dot( h, wO ), 0.0), 5.0 );
}

void main(void){


    vec3 pos =  -pos3D;
	vec3 light = -pos3D;
	vec3 wO = normalize(pos );
	vec3 wI = normalize(light);
	vec3 normal = normalize(N);
	vec3 h = normalize(wO + wI) ;
	
	// if(dot(normal, wO) > 0.0){
	// 	normal = -normal;
	// }
	float lightPower = 10.0;
	float dist    = length(wI);
    float attenuation = 1.0 / (dist * dist);
    vec3 radiance     = vec3(1.0,1.0,1.0) * attenuation * lightPower ;

	float G1wO = dot( normal, wO );
	float G1wI = dot( normal, wI );

	float D = dFunc( normal, h );
			
	float G = gFunc( G1wO ) * gFunc( G1wI );
			
	vec3 F = fFunc( wO, h );

	vec3 kd = vec3(0.8,0.4,0.4) * dot(N,normalize(vec3(wO))); // Lambert rendering, eye light source
	vec3 ks = vec3(( D * F * G ) / ( 4.0 * G1wO * G1wI ));


	vec3 color = vec3((1.0 - metalness) * kd + metalness * ks) * radiance *  max(dot(normal, wI), 0.0);

	gl_FragColor = vec4(color, 1.0);
}