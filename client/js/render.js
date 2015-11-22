////////////////////////////////////////////////////////////////////////////////
// Server Interface
////////////////////////////////////////////////////////////////////////////////

var turnOwner;
var gameName;
var cliPlayer;

function requestJoinGame() {
  socket.emit('join game', {game: gameName, player: cliPlayer});
}

function requestAttack(uuid) {
  socket.emit('attack unit', {attacker: activeUnit.uuid, defender: uuid});
}

function requestMove(x, z) {
  if (isActiveUnitSet()) {
    socket.emit('move unit', {unit: activeUnit.uuid, newX: x, newZ: z});
  }
}

function resquestSpawnerFocus(xPos, zPos) {
  socket.emit('spawner populate', {x: xPos, z: zPos});
}

function requestUnitSpawn(unitTypeName) {
  if (isSpawnerActive()) {
    socket.emit('spawn unit', {unitType: unitTypeName, x: activeSpawner.x, z: activeSpawner.z});
    deactiveSpawner();
  }
}

function requestActiveUnitUpdate() {
  if (isActiveUnitSet()) {
    socket.emit('get unit details', {unit: activeUnit.uuid});
  } else {
    updateActiveUnit();
  }
}

socket.on('hitsplat', function(data) {
  hitSplat(data.unit, data.damage);
})

socket.on('funds change', function(data) {
  updateFunds(data.newFunds);
});

socket.on('map change', function(data) {
  loadMap(data.map);
})

socket.on('spawn unit', function(data) {
  addUnit(data.unit, data.x, data.z);
});

socket.on('kill unit', function(data) {
  remUnit(data.unit);
})

socket.on('spawner activate', function(data) {
  activateSpawner(data.x, data.z);
})

socket.on('spawner populate', function(data) {
  populateSpawnerList(data.unitDefinitions);
});

socket.on('turn change', function(data) {
  turnOwner = data.turnOwner;
})

socket.on('move unit', function(data) {
  moveUnit(data.unit, data.newX, data.newZ);
});

socket.on('active unit update', function(data) {
  updateActiveUnit(data.unitProfile);
});

function isPlayersTurn() {
  return turnOwner === cliPlayer;
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
  var tileType = "default";
  if (tileDef.hasOwnProperty("type")) {
    tileType = tileDef.type;
  }

  var tile = _addTile(
    tileType,
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
  tile.tile_type = tileType;
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

function _addTile(type, ax, az, bx, bz, cx, cz, dx, dz, ha, hb, hc, hd) {
  var geometry = new THREE.PlaneGeometry(5, 5, 1, 1);
  geometry.vertices[0] = new THREE.Vector3(ax, ha, az);
  geometry.vertices[1] = new THREE.Vector3(bx, hb, bz);
  geometry.vertices[2] = new THREE.Vector3(cx, hc, cz);
  geometry.vertices[3] = new THREE.Vector3(dx, hd, dz);

  if (type === "default") {
    var material = new THREE.MeshPhongMaterial({ color: 0x6F6CC5, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  } else if (type == "spawner") {
    var material = new THREE.MeshPhongMaterial({ color: 0x00FF00, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  }
  return new THREE.Mesh(geometry, material);
}

function loadMap(tileMap) {
  for (var tile in tileMap) {
    addTile(tileMap[tile]);
  }
}

// Empire details

function updateFunds(newVal) {
  var coins = document.getElementById('coins');
  coins.innerHTML = newVal;
}

// Unit Management

var units = {}
var activeSpawner = null;
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

function activateSpawner(x, z) {
  activeSpawner = map.tiles[x][z];
  updateSpawnList();
}

function isSpawnerActive() {
  return activeSpawner != null;
}

function deactiveSpawner() {
  activeSpawner = null;
  updateSpawnList();
}

function updateSpawnList() {
  var spawnerControl = document.getElementById("spawner-control");
  if (!isSpawnerActive()) {
    spawnerControl.style.display = "none";
  } else {
    spawnerControl.style.display = "initial";
  }
}

function populateSpawnerList(unitDefinitions) {
  var unitList = document.getElementById("unit-list");
  unitList.innerHTML = "";

  for (var def in unitDefinitions) {
    var unitDef = unitDefinitions[def];
    var node = document.createElement("DIV");
    node.className = "control-panel-element control-panel-unit-description";
    node.unitType = unitDef.name;
    var unitName = document.createTextNode(unitDef.name);
    var unitHealth = document.createTextNode("Health: " + unitDef.health);
    var unitHitPower = document.createTextNode("Strength: " + unitDef.hitPower);
    var unitBlockingPower = document.createTextNode("Defense: " + unitDef.blockingPower);
    var movement = document.createTextNode("Movement: " + unitDef.movement);

    node.appendChild(unitName);
    node.appendChild(document.createElement("BR"));
    node.appendChild(unitHealth);
    node.appendChild(document.createElement("BR"));
    node.appendChild(unitHitPower);
    node.appendChild(document.createElement("BR"));
    node.appendChild(unitBlockingPower);
    node.appendChild(document.createElement("BR"));
    node.appendChild(movement);

    unitList.appendChild(node);
  }
}

function isActiveUnit(uuid) {
  return isActiveUnitSet() && uuid === activeUnit.uuid;
}

function isActiveUnitSet() {
  return activeUnit != null;
}

function isActiveUnitOwned() {
  return isActiveUnitSet() && activeUnit.owner === cliPlayer;
}

function setActiveUnit(uuid) {
  if (uuid == null) {
    activeUnit = null;
  } else if (!isActiveUnit(uuid)) {
    activeUnit = units[uuid];
    cameraLookAt(activeUnit);
    deactiveSpawner();
  } else {
    return;
  }
  requestActiveUnitUpdate();
}

function updateActiveUnit(unitProfile) {
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
    var maxMovement = document.getElementById("max-movement");
    var ownerName = document.getElementById("owner-name");

    health.innerHTML = unitProfile.health;
    maxHealth.innerHTML = unitProfile.maxHealth;
    hitPower.innerHTML = unitProfile.hitPower;
    blockingPower.innerHTML = unitProfile.blockingPower;
    remainingMovement.innerHTML = unitProfile.remainingMovement;
    maxMovement.innerHTML = unitProfile.maxMovement;
    activeUnit.owner = unitProfile.owner;
    ownerName.innerHTML = unitProfile.owner;
    if (isActiveUnitOwned()) {
      ownerName.innerHTML += " (You)";
    }
  }
}

function moveUnit(uuid, x, z) {
  var unit = units[uuid];
  unit.targPos.set(x + 0.5, map.tiles[x][z].height + (unit.height / 2), z + 0.5);
  if (isActiveUnit(uuid)) {
    requestActiveUnitUpdate();
  }
}

function remUnit(uuid) {
  var unit = units[uuid];
  scene.remove(unit);
  clickable = clickable.filter(function (el) {
    return el.uuid !== uuid;
  });
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
    requestActiveUnitUpdate();
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
