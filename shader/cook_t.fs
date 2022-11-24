#define PI 3.1415926538
#define NB_RAY 10.0
precision mediump float;



varying vec3 pos3D;
varying vec3 N;

uniform float u_n;
uniform float sigma;
uniform float time;
uniform vec3 uKd;
uniform samplerCube skyBox;
uniform mat4 invViewMat;

float random (vec2 st) 
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec3 RotX(vec3 pos){

	float angle = -PI*0.5;
	mat3 rot = mat3(1.0,    0.0,      0.0, 
					0.0, cos(angle), -sin(angle), 
					0.0, sin(angle), cos(angle));
	return vec3(pos * rot);
}

//Distribution
float dFunc( vec3 normal, vec3 h )
{
	float alpha = sigma*sigma;
	float dnh =  dot( normal, h );

	float cos2 = dnh * dnh;
	float sin2 = 1.0 - cos2;
	float tan2 = sin2 / cos2;
	float cos4 = cos2 * cos2;

	return (1.0 / (PI * (alpha) * cos4)) * (exp((-tan2)/(2.0*(alpha))));
}

//Attenuation

float gFuncGGX( float dns, float dno, float dso, float dnref, float dsref){
	return min(min((2.0*dns*dno)/dso, (2.0*dns*dnref) / dsref), 1.0);
}


//Fresnel
vec3 fFunc( vec3 wO, vec3 h, float ior, vec3 ad)  {
	vec3 F0 = vec3((1.0-ior) / (1.0+ior));
	F0 = (F0 + ad)*0.5;
	float theta = 1.0 - max(dot( h, wO ), 0.0);
	return F0 + ( 1.0 - F0 ) * theta*theta*theta*theta*theta;
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


vec3 ImportanceSample(vec2 rand, vec3 N){
	float phi = rand.x * 2.0 * PI;
	float theta = atan( sqrt(-(sigma * sigma) * log(1.0 - rand.y)));

	// from spherical coordinates to cartesian coordinates
	float x = cos(phi) * sin(theta);
	float y = sin(phi) * sin(theta);
	float z = cos(theta);

	float epsi = 0.1;

	vec3 majorAxis = vec3(0.0, 1.0, 0.0);
	 if (dot(N, majorAxis) > 1.0 - epsi) {
        majorAxis = vec3(0.0, 0.0, 1.0);
    } 

	vec3 vx = normalize(cross(majorAxis, N));
	vec3 vy = normalize(cross(N, vx));

	return vx * x + vy *y + N * z;
}


void main(void){


    vec3 pos =  -pos3D;
	vec3 wO = normalize(pos );
	vec3 normal = normalize(N);

	vec3 color = vec3(0.0);

	float e1 = random(pos3D.xy*time);
	float e2 = random(pos3D.yz*time);
	vec3 ad = uKd;
	float ESPILON = 0.001;

	for(float i =0.0; i < NB_RAY; i++){
		e1 = random(vec2(e1, i));
		e2 = random(vec2(e2, i*0.8));
		vec3 sample = ImportanceSample(vec2(e1, e2), normal);
		vec3 ref = reflect(-wO, sample);

		float dno = dot( normal, wO );
		float dns = dot( normal, sample );
		float dnref = dot(normal, ref);
		float dso = dot(sample, wO);
		float dsref = dot(sample, ref);

		float D = dFunc( normal, ref );
			
		float G = gFuncGGX(dns, dno, dso, dnref, dsref);
			
		float F = getFresnelCoefficient( u_n, 1.0, sample, normal, ref);

		vec3 kd = ad/PI; // Lambert rendering, eye light source
		vec3 ks =vec3(( D * F * G ) / ( 4.0 * dno * dnref ));

		
		vec3 ModelSample = vec3(invViewMat * vec4(ref, 0.0));
		vec3 tex = vec3(textureCube(skyBox, RotX(ModelSample)));

		//critcal angle
		if(dnref*dno < ESPILON || dsref*dso < ESPILON || dno < ESPILON){
			color += vec3(0.0);	
		}
		//cook-torrance BRDF
		else{
			color += tex * vec3((1.0 - F) * kd + ks) * dnref;
		}
		//ambiant light
		color += kd;
	}
	
	//lerp
	color = color / float(NB_RAY);

	gl_FragColor = vec4(color, 1.0);
}