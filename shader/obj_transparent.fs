//PONS Yuri MORIN Claire COUTY Antoine
#define PI 3.1415926538
precision mediump float;



varying vec3 pos3D;
varying vec3 N;

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


float getFresnelCoefficient( float n1, float n2, vec3 wi, vec3 normal, vec3 refract_dir) 
{
	float cos_theta_i = dot( wi, normal );


	float cos_theta_t = dot( refract_dir, normal );

	// Reflectance total
	if ( n1 > n2 )
	{
		float critical_angle = asin( n2 / n1 );
		if ( acos( cos_theta_i ) > critical_angle ) { return 1.0; }
	}

	if ( cos_theta_i == 1.0 ) { return ( ( n1 - n2 ) / ( n1 + n2 ) ) * ( ( n1 - n2 ) / ( n1 + n2 ) ); }

	float n1CosThetaI = n1 * cos_theta_i;
	float n1CosThetaT = n1 * cos_theta_t;

	float n2CosThetaI = n2 * cos_theta_i;
	float n2CosThetaT = n2 * cos_theta_t;

	float Rs = ( n1CosThetaI - n2CosThetaT ) / ( n1CosThetaI + n2CosThetaT );

	float Rp = ( n1CosThetaT - n2CosThetaI ) / ( n1CosThetaT + n2CosThetaI );

	return ( Rs * Rs + Rp * Rp ) * 0.5;
}


void main(void)
{
    float coeff = 1.0/1.31;
	vec3 I = normalize(pos3D);

	vec3 Refract = refract(I, normalize(N), coeff);
	float A = getFresnelCoefficient(1.0, 1.31, I,normalize(N), Refract);

	vec3 Reflect = reflect(I, normalize(N));	

	vec3 Treflect = vec3(invViewMat *  vec4(Reflect, 0.0));
	vec3 Trefract = vec3(invViewMat *  vec4(Refract, 0.0));

	gl_FragColor = vec4(A * textureCube(skyBox, RotX(Treflect))) + vec4((1.0-A) * textureCube(skyBox, RotX(Trefract)));
}
	


