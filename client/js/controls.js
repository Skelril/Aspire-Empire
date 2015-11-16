document.addEventListener( 'mousedown', onDocumentMouseDown, false );
window.addEventListener( 'keyup', onKeyPress, false );

function onDocumentMouseDown(e) {
  e.preventDefault();

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  mouse.x = ( e.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / renderer.domElement.clientHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects(clickable);
  if (intersects.length > 0) {
    setActiveUnit(intersects[0].object.uuid);
  }
}

function onKeyPress(e) {
  var key = e.keyCode ? e.keyCode : e.which;

  switch (key) {
    case 38:
      if (e.shiftKey) {
        adjustCamera(0, 1, 0);
      } else {
        adjustCamera(1, 0, 0);
      }
      break;
    case 40:
      if (e.shiftKey) {
        adjustCamera(0, -1, 0);
      } else {
        adjustCamera(-1, 0, 0);
      }
      break;
    case 39:
      adjustCamera(0, 0, 1);
      break;
    case 37:
      adjustCamera(0, 0, -1);
      break;
  }
}
