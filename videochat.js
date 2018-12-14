// カメラ／マイクにアクセスするためのメソッドを取得しておく
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var vrstream;
var localStream;
var connectedCall;
// SkyWayのシグナリングサーバーへ接続する (APIキーを置き換える必要あり）
var peer = new Peer({ key: '0415902d-3377-4e8b-af11-90a5426de9fb', debug: 3});
// シグナリングサーバへの接続が確立したときに、このopenイベントが呼ばれる
peer.on('open', function(){
    $('#my-id').text(peer.id);
});
// 相手からビデオ通話がかかってきた場合、このcallイベントが呼ばれる
// - 渡されるcallオブジェクトを操作することで、ビデオ映像を送受信できる
peer.on('call', function(call){
// 切断時に利用するため、コールオブジェクトを保存しておく
    connectedCall = call;
    // 相手のIDを表示する
       // - 相手のIDはCallオブジェクトのpeerプロパティに存在する
    $("#peer-id").text(call.peer);
    // 自分の映像ストリームを相手に渡す
        // - getUserMediaで取得したストリームオブジェクトを指定する
    call.answer(localStream);
    // 相手のストリームが渡された場合、このstreamイベントが呼ばれる
        // - 渡されるstreamオブジェクトは相手の映像についてのストリームオブジェクト
    call.on('stream', function(stream){
// - video要素に表示できる形にするため変換している
        $('#peer-video').get(0).srcObject = stream;
    });
});
// DOM要素の構築が終わった場合に呼ばれるイベント
// - DOM要素に結びつく設定はこの中で行なう
$(function() {
  // カメラ／マイクのストリームを取得する
      // - 取得が完了したら、第二引数のFunctionが呼ばれる。呼び出し時の引数は自身の映像ストリーム
      // - 取得に失敗した場合、第三引数のFunctionが呼ばれる
    navigator.getUserMedia({audio: true, video: true}, function(stream){
// このストリームを通話がかかってき場合と、通話をかける場合に利用するため、保存しておく
        localStream = stream;
// - video要素に表示できる形にするため変換している
          $('#my-video').get(0).srcObject = stream;
    }, function() { alert("Error!"); });
// Start Callボタンクリック時の動作
    $('#call-start').click(function(){
 // 接続先のIDをフォームから取得する
        var peer_id = $('#peer-id-input').val();
// 相手と通話を開始して、自分のストリームを渡す
        var call = peer.call(peer_id, localStream);
        // 相手のストリームが渡された場合、このstreamイベントが呼ばれる
       // - 渡されるstreamオブジェクトは相手の映像についてのストリームオブジェクト
        call.on('stream', function(stream){
          // 相手のIDを表示する
            $("#peer-id").text(call.peer);
// - video要素に表示できる形にするため変換している
            $('#peer-video').get(0).srcObject = stream;

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
            video.srcObject =stream;


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
        });
    });
 // End　Callボタンクリック時の動作
    $('#call-end').click(function(){
      // ビデオ通話を終了する
        connectedCall.close();
    });
});
