document.addEventListener('mousedown', onDocumentMouseDown, false);
window.addEventListener('keydown', onKeyDown, false);

function onDocumentMouseDown(e) {
  var targ = e.target;
  if (!targ) {
    return;
  }

  if (targ.tagName === "CANVAS") {
    handleGameContent(e);
  } else if (targ.id === "control-panel-toggle") {
    toggleControlPanel(e);
  } else if (targ.id === "start-game") {
    handleGameStart();
  } else if (targ.id === "end-turn") {
    handleEndTurn(e);
  } else if (targ.className === "control-panel-element control-panel-unit-description") {
    requestUnitSpawn(targ.unitType);
  }
}

function handleGameContent(e) {
  e.preventDefault();

  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();
  mouse.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(clickable);
  if (intersects.length > 0) {
    var discoveredObject = intersects[0].object;
    if (discoveredObject.hasOwnProperty("aspire_type")) {
      var aspire_type = discoveredObject["aspire_type"];
      switch (aspire_type) {
        case "tile":
          if (isPlayersTurn()) {
            if (isActiveUnitOwned()) {
              requestMove(discoveredObject.x, discoveredObject.z);
              break;
            }
            if (discoveredObject.tile_type === "spawner") {
              resquestSpawnerFocus(discoveredObject.x, discoveredObject.z);
            }
          }
          setActiveUnit(null);
          break;
        case "unit_piece":
          discoveredObject = discoveredObject.parent;
        case "unit":
          if (isActiveUnitOwned() && isPlayersTurn()) {
            requestAttack(discoveredObject.uuid);
          } else {
            setActiveUnit(discoveredObject.uuid);
          }
          break;
      }
    }
  }
}

function toggleControlPanel(e) {
  e.preventDefault();

  // Show/Hide the control panel
  var controlPanel = document.getElementById("control-panel");
  if (controlPanel.style.display === "none") {
    controlPanel.style.display = "initial";
  } else {
    controlPanel.style.display = "none";
  }

  // Move the toggle
  var controlPanelToggle = document.getElementById("control-panel-toggle");
  if (controlPanelToggle.style.right === "0px") {
    controlPanelToggle.style.right = "250px";
  } else {
    controlPanelToggle.style.right = "0px";
  }
}

function handleGameStart() {
  gameName = document.getElementById("input-game-id").value;
  cliPlayer = document.getElementById("input-player-id").value;

  document.getElementById('start-screen').style.display = "none";
  document.getElementById('active-game-id').innerHTML = gameName;

  requestJoinGame();
}

function handleEndTurn(e) {
  e.preventDefault();

  requestEndTurn();
}

function onKeyDown(e) {
  if (document.getElementById('start-screen').style.display !== "none") {
    return;
  }

  e.preventDefault();
  var key = e.keyCode ? e.keyCode : e.which;

  switch (key) {
    case 27:
      deactiveSpawner();
      setActiveUnit(null);
      break;
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
