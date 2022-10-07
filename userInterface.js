function initUi()
{
	const gui = new dat.GUI();
	const objFolder = gui.addFolder("Objet");
	const shaderFolder = gui.addFolder("Shader");
	const cubeMapFolder = gui.addFolder("Cubemap");
	
	objet_gui=
	{
		sphere: false,
		voiture: false,
		bunny: false,
		cube: true,
	};
	
	objFolder.add(objet_gui, "sphere");
	objFolder.add(objet_gui, "voiture");
	objFolder.add(objet_gui, "bunny");
	objFolder.add(objet_gui, "cube");

	objFolder.open();

	shader_gui=
	{
		lambert: false,
		mirror: true,
		transparent: false,
		cookTorrence: false,
	};


	shaderFolder.add(shader_gui, "lambert");
	shaderFolder.add(shader_gui, "mirror");
	shaderFolder.add(shader_gui, "transparent");
	shaderFolder.add(shader_gui, "cookTorrence");

	shaderFolder.open();

	cubeMap_gui=
	{
		sky: false,
		city: false,
		snow: false,
	};


	cubeMapFolder.add(cubeMap_gui, "sky");
	cubeMapFolder.add(cubeMap_gui, "city");
	cubeMapFolder.add(cubeMap_gui, "snow");

	cubeMapFolder.open();

}

function updateUI(){
    //pour les objets
	if( objet_gui.sphere)
	{
		objet_gui.voiture=false;
		objet_gui.bunny=false;
		objet_gui.cube=false;
		SPHERE.draw()
	}

	if( objet_gui.voiture)
	{
		objet_gui.sphere=false;
		objet_gui.bunny=false;
		objet_gui.cube=false;
		PORSHE.draw();
	}

	if( objet_gui.bunny)
	{
		objet_gui.sphere=false;
		objet_gui.voiture=false;
		objet_gui.cube=false;
		BUNNY.draw();
	}

	
	if( objet_gui.cube)
	{
		objet_gui.sphere=false;
		objet_gui.voiture=false;
		objet_gui.bunny=false;
		CUBE.draw();
	}

	//pour les cubes maps

	if( cubeMap_gui.sky)
	{
		initTexture("skybox");
		cubeMap_gui.sky=false;
		cubeMap_gui.city=false;
		cubeMap_gui.snow=false;
	}

	if( cubeMap_gui.snow)
	{
		initTexture("snow");
		cubeMap_gui.snow=false;
		cubeMap_gui.city=false;
		cubeMap_gui.sky=false;
	}

	if( cubeMap_gui.city)
	{
		initTexture("ville");
		cubeMap_gui.sky=false;
		cubeMap_gui.city=false;
		cubeMap_gui.snow=false;
	}


}

function updateShader(obj){
	
    if( shader_gui.lambert)
		{
			obj.shaderName = "obj_lambert"
			shader_gui.mirror=false;
			shader_gui.lambert=false;
			shader_gui.transparent=false;
			shader_gui.cookTorrence=false;
			loadShaders(obj);
		}

		if( shader_gui.mirror){
			obj.shaderName = "obj_mirror"
			shader_gui.mirror=false;
			shader_gui.lambert=false;
			shader_gui.transparent=false;
			shader_gui.cookTorrence=false;
			loadShaders(obj);
		}

		if( shader_gui.transparent){
			obj.shaderName = "obj_transparent"
			shader_gui.mirror=false;
			shader_gui.lambert=false;
			shader_gui.transparent=false;
			shader_gui.cookTorrence=false;
			loadShaders(obj);
		}

		if( shader_gui.cookTorrence){
			shader_gui.lambert=false;
			shader_gui.transparent=false;
			shader_gui.mirror=false;
		}
}