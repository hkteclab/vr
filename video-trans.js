
  var width = window.innerWidth/2,
      height = window.innerHeight/2;

  var button;

  //scene

  var scene = new THREE.Scene();

  //mesh

  var geometry = new THREE.SphereGeometry( 5, 60, 40 );
	geometry.scale( - 1, 1, 1 );

  var video = document.createElement( 'video' );
  video.autoplay = true;
  video.srcObject =vrstream;


  var texture = new THREE.VideoTexture( video );
  texture.minFilter = THREE.LinearFilter;

  var material   = new THREE.MeshBasicMaterial( { map : texture } );

    //�Î~��

	/*var material = new THREE.MeshBasicMaterial( {
	   map: THREE.ImageUtils.loadTexture( 'test.jpg' )
	} );*/

	sphere = new THREE.Mesh( geometry, material );

	scene.add( sphere );

  //camera

  var camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
  camera.position.set(0,0,0.1);
  camera.lookAt(sphere.position);

  //helper

  var axis = new THREE.AxisHelper(1000);
  axis.position.set(0,0,0);
  scene.add(axis);

  //render

  var renderer = new THREE.WebGLRenderer();
  	effect = new THREE.StereoEffect(renderer);
  renderer.setSize(width,height);
  renderer.setClearColor({color: 0x000000});
  effect.setSize(width, height);
  document.getElementById('stage').appendChild(renderer.domElement);
  renderer.render(scene,camera);

  var controls = new THREE.OrbitControls(camera, renderer.domElement);

  function render(){
    requestAnimationFrame(render);
    window.addEventListener( 'resize', onWindowResize, false );
    //renderer.render(scene,camera);
    effect.render(scene, camera);


    controls.update();
  }
  render();
  function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
