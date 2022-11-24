var depart; 
var palette;
function initUi()
{
	const gui = new dat.GUI();
	const objFolder = gui.addFolder("Objet");
	const shaderFolder = gui.addFolder("Shader");
	const cubeMapFolder = gui.addFolder("Cubemap");
	const sliderFolder = gui.addFolder( 'Paramètres Cook-Torrance' );
	
	//Pour la couleur des objets
	palette = {
		color : [ kd[0], kd[1], kd[2], 1 ]
	};
	
	var couleur = gui.addColor(palette, 'color').name("Couleur de l'objet").listen();
	couleur.onChange(function(){
	kd[0] = palette.color[0]/255;
	kd[1] = palette.color[1]/255;
	kd[2] = palette.color[2]/255;
	});

	//Pour les objets

	objet_gui=
	{
		sphere: false,
		voiture: false,
		bunny: false,
		cube: true,
	};
	
	objFolder.add(objet_gui, "sphere").listen().onChange(function(){setChecked("sphere", objet_gui)});
	objFolder.add(objet_gui, "voiture").listen().onChange(function(){setChecked("voiture", objet_gui)});
	objFolder.add(objet_gui, "bunny").listen().onChange(function(){setChecked("bunny", objet_gui)});
	objFolder.add(objet_gui, "cube").listen().onChange(function(){setChecked("cube", objet_gui)});

	objFolder.open();

	//Pour les shaders
	shader_gui=
	{
		lambert: false,
		mirror: true,
		transparent: false,
		cookTorrance: false,
	};


	shaderFolder.add(shader_gui, "lambert").listen().onChange(function(){setChecked("lambert", shader_gui)});
	shaderFolder.add(shader_gui, "mirror").listen().onChange(function(){setChecked("mirror", shader_gui)});
	shaderFolder.add(shader_gui, "transparent").listen().onChange(function(){setChecked("transparent", shader_gui)});
	shaderFolder.add(shader_gui, "cookTorrance").listen().onChange(function(){setChecked("cookTorrance", shader_gui)});

	shaderFolder.open();

	//Pour les cubes maps
	cubeMap_gui=
	{
		sky: true,
		city: false,
		snow: false,
	};


	cubeMapFolder.add(cubeMap_gui, "sky").listen().onChange(function(){setChecked("sky", cubeMap_gui)});
	cubeMapFolder.add(cubeMap_gui, "city").listen().onChange(function(){setChecked("city", cubeMap_gui)});
	cubeMapFolder.add(cubeMap_gui, "snow").listen().onChange(function(){setChecked("snow", cubeMap_gui)});

	cubeMapFolder.open();

	//Pour les sliders
	depart = { Sigma : sigma, Metalness : metalness};	//le step 
	sliderFolder.add( depart, 'Sigma', 0.001, 0.3 ).step(0.001);
	sliderFolder.add( depart, 'Metalness', 0.0, 1.0 ).step(0.1);
	
	
}

function setChecked( select, liste ){
	for (let param in liste){
		  liste[param] = false;
		}
		liste[select] = true;
}

var changeShader = false;
function updateUI(){
	var change = false;
	
    //pour les objets
	if( objet_gui.sphere)
	{
		SPHERE.draw();
	}

	if( objet_gui.voiture)
	{
		PORSHE.draw();
	}

	if( objet_gui.bunny)
	{
		BUNNY.draw();
	}

	
	if( objet_gui.cube)
	{
		CUBE.draw();
	}

	//si changement de shader
	if(changeShader){
		SPHERE.reload();
		PORSHE.reload();
		BUNNY.reload();
		CUBE.reload();
	}
	changeShader=false;
	//pour les cubes maps

	if( cubeMap_gui.sky)
	{
		if(current_texture != "skybox")
			change = true;
		current_texture = "skybox";

	}

	if( cubeMap_gui.snow)
	{
		if(current_texture != "snow")
			change = true;
		current_texture = "snow";
	}

	if( cubeMap_gui.city)
	{
		if(current_texture != "ville")
			change = true;
		current_texture = "ville";
	}

	if(change){
		initTexture(current_texture);
	}
	
	
	//Pour la couleur des objets
	kd[0] = palette.color[0]/255;
	kd[1] = palette.color[1]/255;
	kd[2] = palette.color[2]/255;
	
	
	sigma = depart.Sigma;
	metalness = depart.Metalness;

}

function updateShader(){
	

    if( shader_gui.lambert)
	{
		if (current_shader!="obj_lambert")
		{
			current_shader = "obj_lambert";
			changeShader = true;
		}
	}

	if( shader_gui.mirror)
	{
		if (current_shader!="obj_mirror")
		{
			current_shader = "obj_mirror";
			changeShader = true;
		}
	}

	if( shader_gui.transparent)
	{
		if (current_shader!="obj_transparent")
		{
			current_shader = "obj_transparent";
			changeShader = true;
		}
	}

	if( shader_gui.cookTorrance)
	{
		if (current_shader!="cook_t")
		{	
			current_shader = "cook_t";	
			changeShader = true;
		}
	}
}