function animate() {
  // first move the player
  controls.update();

  tmpQuat = new Quaternion().copy(camera.quaternion);

  if (SERVER) {
    // makes it so our camera can look around
    if (SERVER.myUser) {
      camera.update();

      /* v1.set(0, 1, 0);
      camera.rotateOnAxis(v1, -camera.offsetX);

      v1.set(1, 0, 0);
      camera.rotateOnAxis(v1, camera.offsetY);

      camera.updateWorldMatrix();
    */

      //  SERVER.userNameDiv.focus();

      // then do all our updates for server
      // including sending the players position
      SERVER.update();

      objectControls.update();
      show.update();

      moveables.forEach(moveable => moveable.onEveryUpdate());
    }
  }

  G.dT = clock.getDelta();
  G.time += G.dT;

  G.uniforms.time.value = G.time; //time.value;
  G.uniforms.dT.value = G.dT; //time.value;


  // THEN render
 // renderer.render(scene, camera);
 // camera.quaternion.copy(tmpQuat);
 DoRender(); // in init



 /* if( grainPlayer ){
    var t = G.uniforms.time.value;
    grainPlayer.loopEnd = Math.sin(G.uniforms.time.value)+1;
    grainPlayer.loopStart =  Math.sin(G.uniforms.time.value+.1)+1;;
    
    grainPlayer.grainSize = (Math.sin(t * 2) + 1) * .3;
    grainPlayer.overlap = (Math.sin(t * 3 + 29) + 1) * .6;
    grainPlayer.playbackRate =  (Math.sin(t * 3 + 29) + 2) * .6;
  }

  G.fft.update();*/

  G.audio.update();

  // for now putting here just so it crashes nice and proper
  requestAnimationFrame(animate);
}
