////////////////////////////////////////////////////////////////////////////////
// Server Interface
////////////////////////////////////////////////////////////////////////////////

function requestMap() {
  return [
    {x: 0, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 4, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 4, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 4, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 4, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 4, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 5, z: 0, seH: 0, swH: 0, neH: .25, nwH: .25},
    {x: 5, z: 1, seH: 0, swH: 0, neH: .25, nwH: .25},
    {x: 5, z: 2, seH: 0, swH: 0, neH: .25, nwH: .25},
    {x: 5, z: 3, seH: 0, swH: 0, neH: .25, nwH: .25},
    {x: 5, z: 4, seH: 0, swH: 0, neH: .25, nwH: .25},
    {x: 6, z: 0, seH: .25, swH: .25, neH: .5, nwH: .5},
    {x: 6, z: 1, seH: .25, swH: .25, neH: .5, nwH: .5},
    {x: 6, z: 2, seH: .25, swH: .25, neH: .5, nwH: .5},
    {x: 6, z: 3, seH: .25, swH: .25, neH: .5, nwH: .5},
    {x: 6, z: 4, seH: .25, swH: .25, neH: .5, nwH: .5},
    {x: 7, z: 0, seH: .5, swH: .5, neH: .75, nwH: .75},
    {x: 7, z: 1, seH: .5, swH: .5, neH: .75, nwH: .75},
    {x: 7, z: 2, seH: .5, swH: .5, neH: .75, nwH: .75},
    {x: 7, z: 3, seH: .5, swH: .5, neH: .75, nwH: .75},
    {x: 7, z: 4, seH: .5, swH: .5, neH: .75, nwH: .75},
    {x: 8, z: 0, seH: .75, swH: .75, neH: 1, nwH: 1},
    {x: 8, z: 1, seH: .75, swH: .75, neH: 1, nwH: 1},
    {x: 8, z: 2, seH: .75, swH: .75, neH: 1, nwH: 1},
    {x: 8, z: 3, seH: .75, swH: .75, neH: 1, nwH: 1},
    {x: 8, z: 4, seH: .75, swH: .75, neH: 1, nwH: 1},
    {x: 9, z: 0, seH: 1, swH: 1, neH: 1.25, nwH: 1.25},
    {x: 9, z: 1, seH: 1, swH: 1, neH: 1.25, nwH: 1.25},
    {x: 9, z: 2, seH: 1, swH: 1, neH: 1.25, nwH: 1.25},
    {x: 9, z: 3, seH: 1, swH: 1, neH: 1.25, nwH: 1.25},
    {x: 9, z: 4, seH: 1, swH: 1, neH: 1.25, nwH: 1.25},
    {x: 10, z: 0, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 10, z: 1, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 10, z: 2, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 10, z: 3, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 10, z: 4, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 11, z: 0, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 11, z: 1, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 11, z: 2, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 11, z: 3, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25},
    {x: 11, z: 4, seH: 1.25, swH: 1.25, neH: 1.25, nwH: 1.25}
  ];
}

function requestAttack(uuid) {
  hitSplat(uuid, requestHitPower(activeUnit));
}

function requestMove(x, z) {
  if (isActiveUnitSet()) {
    moveUnit(activeUnit.uuid, x, z);
  }
}

function pocessUnits() {
  addUnit("abc", 0, 0);
  addUnit("cba", 0, 2);
  addUnit("ars", 0, 4);

  moveUnit("abc", 3, 4);
  moveUnit("cba", 2, 2);
  moveUnit("ars", 4, 3);
}

function requestCurrentUserID() {
  return "test-player";
}

function requestUnitOwner(uuid) {
  return uuid == "abc" ? "test-player" : "bob";
}

function requestUnitOwnerName(uuid) {
  return uuid == "abc" ? "test-player" : "bob";
}

function requestTurnOwner() {
  return "test-player";
}

function requestIsPlayersTurn() {
  return requestTurnOwner() == requestCurrentUserID();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function requestHealth(uuid) {
  return getRandomInt(0, 200);
}

function requestMaxHealth(uuid) {
  return 200;
}

function requestHitPower(uuid) {
  return getRandomInt(3, 20);
}

function requestBlockingPower(uuid) {
  return getRandomInt(0, 20);
}

function requestRemainingMovement(uuid) {
  return getRandomInt(0, 7);
}

////////////////////////////////////////////////////////////////////////////////
// Renderer
////////////////////////////////////////////////////////////////////////////////

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var clickable = [];

// Tile/map Management

var map = {
  tiles: {},
  minX: NaN,
  maxX: NaN,
  minY: NaN,
  maxY: NaN,
  minZ: NaN,
  maxZ: NaN
};

function _getMax(existingVal, newVal) {
  if (isNaN(existingVal)) {
    return newVal;
  }
  return Math.max(existingVal, newVal);
}

function _getMin(existingVal, newVal) {
  if (isNaN(existingVal)) {
    return newVal;
  }
  return Math.min(existingVal, newVal);
}


function addTile(tileDef) {
  var tile = _addTile(
    tileDef.x + 0, tileDef.z + 0, // a
    tileDef.x + 0, tileDef.z + 1, // b
    tileDef.x + 1, tileDef.z + 0, // c
    tileDef.x + 1, tileDef.z + 1, // d
    tileDef.seH,
    tileDef.swH,
    tileDef.neH,
    tileDef.nwH
  );

  scene.add(tile);

  tile.x = tileDef.x;
  tile.z = tileDef.z;
  tile.height = (tileDef.seH + tileDef.swH + tileDef.neH + tileDef.nwH) / 4;
  tile.def = tileDef;
  tile.aspire_type = "tile";

  map.minX = _getMin(map.minX, tile.x);
  map.minZ = _getMin(map.minZ, tile.z);
  map.minY = _getMin(map.minY, tile.height);
  map.maxX = _getMax(map.maxX, tile.x + 1);
  map.maxZ = _getMax(map.maxZ, tile.z + 1);
  map.maxY = _getMin(map.maxY, tile.height);

  if (!(tile.x in map.tiles)) {
    map.tiles[tile.x] = {}
  }
  map.tiles[tile.x][tile.z] = tile;

  clickable.push(tile);
}

function _addTile(ax, az, bx, bz, cx, cz, dx, dz, ha, hb, hc, hd) {
  var geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
  geometry.vertices[0] = new THREE.Vector3(ax, ha, az);
  geometry.vertices[1] = new THREE.Vector3(bx, hb, bz);
  geometry.vertices[2] = new THREE.Vector3(cx, hc, cz);
  geometry.vertices[3] = new THREE.Vector3(dx, hd, dz);

  var material = new THREE.MeshPhongMaterial({ color: 0x6F6CC5, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  return new THREE.Mesh(geometry, material);
}

function loadMap(tileMap) {
  for (var tile in tileMap) {
    addTile(tileMap[tile]);
  }
}

// Unit Management

var units = {}
var activeUnit = null;

function _initUnitAt(unit, x, z) {
  var y = map.tiles[x][z].height + (unit.height / 2);
  unit.position.set(x + 0.5, y, z + 0.5);
  unit.targPos = new THREE.Vector3(x + 0.5, y, z + 0.5);
}

function addUnit(uuid, x, z) {
  var geometry = new THREE.BoxGeometry(.5, .5, .5);
  var material = new THREE.MeshPhongMaterial({ color: 0x00FF00, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});

  var unit = new THREE.Mesh( geometry, material );
  unit.aspire_type = "unit";
  unit.uuid = uuid;
  unit.height = geometry.parameters.height;
  _initUnitAt(unit, x, z);

  units[uuid] = unit;

  scene.add(unit);

  clickable.push(unit);

  return unit;
}

function isActiveUnit(uuid) {
  return isActiveUnitSet() && uuid === activeUnit.uuid;
}

function isActiveUnitSet() {
  return activeUnit != null;
}

function isActiveUnitOwned() {
  return isActiveUnitSet() && requestUnitOwner(activeUnit.uuid) === requestCurrentUserID();
}

function setActiveUnit(uuid) {
  if (uuid == null) {
    activeUnit = null;
  } else if (!isActiveUnit(uuid)) {
    activeUnit = units[uuid];
    cameraLookAt(activeUnit);
  } else {
    return;
  }
  updateActiveUnitDescription();
}

function updateActiveUnitDescription() {
  var description = document.getElementById("unit-description");
  if (!isActiveUnitSet()) {
    description.style.display = "none";
  } else {
    description.style.display = "initial";

    var health = document.getElementById("health");
    var maxHealth = document.getElementById("max-health");
    var hitPower = document.getElementById("hit-power");
    var blockingPower = document.getElementById("blocking-power");
    var remainingMovement = document.getElementById("remaining-movement");
    var ownerName = document.getElementById("owner-name");

    health.innerHTML = requestHealth(activeUnit.uuid);
    maxHealth.innerHTML = requestMaxHealth(activeUnit.uuid);
    hitPower.innerHTML = requestHitPower(activeUnit.uuid);
    blockingPower.innerHTML = requestBlockingPower(activeUnit.uuid);
    remainingMovement.innerHTML = requestRemainingMovement(activeUnit.uuid);
    ownerName.innerHTML = requestUnitOwnerName(activeUnit.uuid);
    if (isActiveUnitOwned()) {
      ownerName.innerHTML += " (You)";
    }
  }
}

function moveUnit(uuid, x, z) {
  var unit = units[uuid];
  unit.targPos.set(x + 0.5, map.tiles[x][z].height + (unit.height / 2), z + 0.5);
  if (isActiveUnit(uuid)) {
    updateActiveUnitDescription();
  }
}

function remUnit(uuid) {
  var unit = units[uuid];
  scene.remove(unit);
  clickable.remove(unit);
  delete units[uuid];
  if (isActiveUnit(uuid)) {
    setActiveUnit(null);
  }
}

// Camera Controls
function cameraLookAt(unit) {
  if (unit != null) {
    camera.lookAt(unit.position);
  }
}

function adjustCamera(x, y, z) {
  camera.targPos.x = Math.min(map.maxX + 5, Math.max(map.minX - 5, camera.targPos.x + x));
  camera.targPos.y = Math.min(map.maxY + 5, Math.max(map.minY + 2, camera.targPos.y + y));
  camera.targPos.z = Math.min(map.maxZ + 5, Math.max(map.minZ - 5, camera.targPos.z + z));
}

camera.position.x = -2;
camera.position.y = 3;
camera.position.z = 7;
camera.targPos = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);

camera.lookAt(new THREE.Vector3(0, 1, 0));

// Hit splats

var hitSplats = [];

function hitSplat(uuid, amt) {
  var unit = units[uuid];
  if (unit == null) {
    return;
  }

  if (isActiveUnit(uuid)) {
    updateActiveUnitDescription();
  }

  var canvas = document.createElement('canvas');
  var size = 256;
  canvas.width = size;
  canvas.height = size;
  var context = canvas.getContext('2d');

  context.fillStyle = '#FF0000';
  context.strokeStyle = context.fillStyle;
  context.lineJoin = "round";
  context.lineWidth = 50;
  context.strokeRect(50 / 2, 50 / 2, size - 50, ((size * 2) / 3) - 50);
  context.fillRect(50 / 2, 50 / 2, size - 50, ((size * 2) / 3) - 50);

  context.fillStyle = '#FFFFFF';
  context.textAlign = 'center';
  context.font = '124px Arial';
  context.fillText(String(amt), size / 2, size / 2);

  var textMap = new THREE.Texture(canvas);
  textMap.needsUpdate = true;

  var material = new THREE.SpriteMaterial({
      map: textMap,
      transparent: true,
      depthTest: false
  });

  var hitSplat = new THREE.Sprite(material);
  hitSplat.position.set(unit.position.x, unit.position.y, unit.position.z);

  hitSplats.push(hitSplat);

  scene.add(hitSplat);
}

// Lighting
var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add( directionalLight );

// Load game data
loadMap(requestMap(""));
pocessUnits("");

// Rendering & Movement constants
var MOVEMENT_PRECISION = 1;
var MOVEMENT_UNIT = 0.1;

function processMovement(moveable) {
  if (moveable.position.x.toFixed(MOVEMENT_PRECISION) !== moveable.targPos.x.toFixed(MOVEMENT_PRECISION)) {
    if (moveable.position.x < moveable.targPos.x) {
      moveable.position.x += MOVEMENT_UNIT;
    } else {
      moveable.position.x -= MOVEMENT_UNIT;
    }
  }
  if (moveable.position.y.toFixed(MOVEMENT_PRECISION) !== moveable.targPos.y.toFixed(MOVEMENT_PRECISION)) {
    if (moveable.position.y < moveable.targPos.y) {
      moveable.position.y += MOVEMENT_UNIT;
    } else {
      moveable.position.y -= MOVEMENT_UNIT;
    }
  }
  if (moveable.position.z.toFixed(MOVEMENT_PRECISION) !== moveable.targPos.z.toFixed(MOVEMENT_PRECISION)) {
    if (moveable.position.z < moveable.targPos.z) {
      moveable.position.z += MOVEMENT_UNIT;
    } else {
      moveable.position.z -= MOVEMENT_UNIT;
    }
  }
}

var focusRings = [];

function _updateFocusRings() {
  var unitOfChange = 1.0 / focusRings.length;
  for (var ring in focusRings) {
    var focusRing = focusRings[ring];
    focusRing.position.set(activeUnit.position.x, activeUnit.position.y, activeUnit.position.z);
    if ((Number(ring) + 1) % 2 === 0) {
      focusRing.rotateX(.1);
    } else {
      focusRing.rotateY(.1);
    }
  }
}

function drawFocusRing() {
  if (focusRings.length === 0) {
    if (activeUnit != null) {
      var geometry = new THREE.RingGeometry(0.5, 0.6, 32);
      var material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
      focusRings = [
        new THREE.Mesh(geometry, material),
        new THREE.Mesh(geometry, material)
      ];
      _updateFocusRings();
      for (var ring in focusRings) {
        scene.add(focusRings[ring]);
      }
    }
  } else {
    if (!isActiveUnitSet()) {
      for (var ring in focusRings) {
        scene.remove(focusRings[ring]);
      }
      focusRings = []
    } else {
      _updateFocusRings();
    }
  }
}

function fadeHitSplats() {
  for (splat in hitSplats) {
    var hitSplat = hitSplats[splat];
    hitSplat.scale.set(hitSplat.scale.x * 0.9, hitSplat.scale.y * 0.9, hitSplat.scale.z * 0.9);
    if (hitSplat.scale.x < .34) {
      scene.remove(hitSplat);
      delete hitSplats[splat];
    }
  }
}

function render() {
  setTimeout(function() {
    requestAnimationFrame(render);

    scene.traverse(function(moveable) {
        if (!moveable.hasOwnProperty("targPos")) {
          return;
        }
        processMovement(moveable);
      }
    );

    processMovement(camera);
    cameraLookAt(activeUnit);
    drawFocusRing();
    fadeHitSplats();
  }, 1000 / 60);

  renderer.render(scene, camera);
}
render();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
