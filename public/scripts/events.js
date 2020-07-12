function setUpEvents() {
  // event mouseMoveHandle function
  function mouseMoveHandle(e) {
    e = e || window.event;

    var pageX = e.pageX;
    var pageY = e.pageY;

    // IE 8
    if (pageX === undefined) {
      pageX =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      pageY =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    if (SERVER) {
      if (SERVER.myUser) {
        SERVER.myUser.oScreenPosition.x = SERVER.myUser.screenPosition.x;
        SERVER.myUser.oScreenPosition.y = SERVER.myUser.screenPosition.y;

        SERVER.myUser.screenPosition.x = pageX;
        SERVER.myUser.screenPosition.y = pageY;
      }
    }
  }

  // event mouseMoveHandle function
  function touchMoveHandle(e) {
    e = e || window.event;

    var pageX = e.touches[0].pageX;
    var pageY = e.touches[0].pageY;

    console.log(e);

    // IE 8
    if (pageX === undefined) {
      pageX =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      pageY =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    if (SERVER) {
      if (SERVER.myUser) {
        SERVER.myUser.oScreenPosition.x = SERVER.myUser.screenPosition.x;
        SERVER.myUser.oScreenPosition.y = SERVER.myUser.screenPosition.y;

        SERVER.myUser.screenPosition.x = pageX;
        SERVER.myUser.screenPosition.y = pageY;
      }
    }

    console.log("hii");
  }

  // attach handler to the click event of the document
  if (document.attachEvent) document.attachEvent("mousemove", mouseMoveHandle);
  else document.addEventListener("mousemove", mouseMoveHandle);

  // attach handler to the click event of the document
  if (document.attachEvent) document.attachEvent("touchmove", touchMoveHandle);
  else document.addEventListener("touchmove", touchMoveHandle);

  window.addEventListener("resize", onWindowResize, false);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("deviceorientation", handleOrientation, true);
  function handleOrientation() {
    var absolute = event.absolute;
    console.log("hi");
  }



  if (mobile) {
    // Update mesh rotation using quaternion.
    const sensorAbs = new AbsoluteOrientationSensor();
    sensorAbs.onreading = deviceMotionListener1;
    sensorAbs.start();

    function deviceMotionListener1(e) {
      currentOrientation.x = e.alpha;
      currentOrientation.y = e.beta
      console.log(currentOrientation);
    }
  } else {
    console.log("not mobile");
  }
}
