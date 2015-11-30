////////////////////////////////////////////////////////////////////////////////
// Server Interface
////////////////////////////////////////////////////////////////////////////////

var funds;
var turnOwner;
var winner = null;
var gameName;
var cliPlayer;

function requestJoinGame() {
  socket.emit('join game', {game: gameName, player: cliPlayer});
}

function requestEndTurn() {
  socket.emit('end turn', {});
}

function requestAttack(uuid) {
  socket.emit('attack unit', {attacker: activeUnit.uuid, defender: uuid});
}

function requestMove(x, z) {
  if (isActiveUnitSet()) {
    socket.emit('move unit', {unit: activeUnit.uuid, newX: x, newZ: z});
  }
}

function requestFundsUpdate() {
  socket.emit('funds update', {});
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
});

socket.on('attack unit', function(data) {
  _displayAttack(data.attacker, data.defender);
});

socket.on('funds change', function(data) {
  updateFunds(data.newFunds);
});

socket.on('income change', function(data) {
  updateIncome(data.newIncome);
});

socket.on('map change', function(data) {
  loadMap(data.map);
});

socket.on('spawn unit', function(data) {
  addUnit(data.unit, data.x, data.z);
});

socket.on('kill unit', function(data) {
  remUnit(data.unit);
});

socket.on('spawner activate', function(data) {
  activateSpawner(data.x, data.z);
});

socket.on('spawner populate', function(data) {
  populateSpawnerList(data.unitDefinitions);
});

socket.on('turn change', function(data) {
  turnOwner = data.turnOwner.id;
  if (isPlayersTurn()) {
    requestFundsUpdate();
  }

  updateTurnButton();
  deactiveSpawner();
  requestActiveUnitUpdate();
});

socket.on('game end', function(data) {
  winner = data.winner.id;
  displayWinner(data.winner.id);
  updateTurnButton();
});

socket.on('move unit', function(data) {
  moveUnit(data.unit, data.newX, data.newZ);
});

socket.on('active unit update', function(data) {
  updateActiveUnit(data.unitProfile);
});

function isPlayersTurn() {
  return winner === null && turnOwner === cliPlayer;
}

////////////////////////////////////////////////////////////////////////////////
// Renderer
////////////////////////////////////////////////////////////////////////////////

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var loader = new THREE.TextureLoader();

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

  var material;
  if (type === "default") {
    var texture = loader.load("textures/halfdrygrass.jpg");

    material = new THREE.MeshPhongMaterial({
      color: 0x00FF00,
      specular: 0x555555,
      shininess: 30,
      map: texture,
      side: THREE.DoubleSide
    });
  } else if (type === "spawner") {
    var texture = loader.load("textures/greystone003x500.png");
    material = new THREE.MeshPhongMaterial({
      color: 0x8C8C8C,
      specular: 0x555555,
      shininess: 30,
      map: texture,
      side: THREE.DoubleSide
    });
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
  var coins = document.getElementById("coins");
  funds = newVal;
  coins.innerHTML = newVal;
}

function updateIncome(newVal) {
  var income = document.getElementById("income");
  if (newVal > 0) {
    income.innerHTML = "+" + newVal;
  } else {
    income.innerHTML = newVal;
  }
}

function updateTurnButton() {
  var description = document.getElementById("end-turn");
  if (!isPlayersTurn()) {
    description.style.display = "none";
  } else {
    description.style.display = "initial";
  }
}

// Unit Management

var units = {}
var activeSpawner = null;
var activeUnit = null;

// Rendering & Movement constants

var MOVEMENT_PRECISION = 1;
var MOVEMENT_UNIT = 0.1;

function _constructMoveTo(x, y, z) {
  return function(moveable) {
    var updatedX = false;
    var updatedY = false;
    var updatedZ = false;

    if (moveable.position.x.toFixed(MOVEMENT_PRECISION) !== x.toFixed(MOVEMENT_PRECISION)) {
      if (moveable.position.x < x) {
        moveable.position.x += MOVEMENT_UNIT;
      } else {
        moveable.position.x -= MOVEMENT_UNIT;
      }
      updatedX = true;
    }
    if (moveable.position.y.toFixed(MOVEMENT_PRECISION) !== y.toFixed(MOVEMENT_PRECISION)) {
      if (moveable.position.y < y) {
        moveable.position.y += MOVEMENT_UNIT;
      } else {
        moveable.position.y -= MOVEMENT_UNIT;
      }
      updatedY = true;
    }
    if (moveable.position.z.toFixed(MOVEMENT_PRECISION) !== z.toFixed(MOVEMENT_PRECISION)) {
      if (moveable.position.z < z) {
        moveable.position.z += MOVEMENT_UNIT;
      } else {
        moveable.position.z -= MOVEMENT_UNIT;
      }
      updatedZ = true;
    }

    // Handle
    var nothingUpdated = !(updatedX || updatedY || updatedZ);

    if (moveable.hasOwnProperty("legClicks")) {
      var movementAxis = updatedX ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);

      // Reset robot
      if (nothingUpdated) {
          moveable.leftLeg.rotation.x = 0;
          moveable.rightLeg.rotation.x = 0;
      } else {
        if (moveable.legClicks < 10) {
          moveable.leftLeg.rotation.x = moveable.legClicks * -Math.PI / 360;
          moveable.rightLeg.rotation.x = moveable.legClicks * Math.PI / 360;
        } else {
          moveable.leftLeg.rotation.x = moveable.legClicks * Math.PI / 360;
          moveable.rightLeg.rotation.x = moveable.legClicks * -Math.PI / 360;
        }
        moveable.legClicks = moveable.legClicks + 10 % 20;
      }
    }

    return nothingUpdated;
  };
}

function _constructRotateToFace(x, z) {
  return function(moveable) {
    var updated = false;

    var angle;
    var curAngle = moveable.rotation.y;

    if (x.toFixed(0) > moveable.position.x.toFixed(0)) {
      angle = -90 * Math.PI / 180;
    } else if (x.toFixed(0) < moveable.position.x.toFixed(0)) {
      angle = 90 * Math.PI / 180;
    }

    if (z.toFixed(0) > moveable.position.z.toFixed(0)) {
      angle = 180 * Math.PI / 180;
    } else if (z.toFixed(0) < moveable.position.z.toFixed(0)) {
      angle = -180 * Math.PI / 180;
    }

    if (angle !== undefined && curAngle !== angle) {
      if (moveable.rotation.y > angle) {
        moveable.rotation.y -= 20 * Math.PI / 180;
        if (moveable.rotation.y < angle) {
          moveable.rotation.y = angle;
        }
      } else {
        moveable.rotation.y += 20 * Math.PI / 180;
        if (moveable.rotation.y > angle) {
          moveable.rotation.y = angle;
        }
      }
      updated = true;
    }
    return !updated;
  };
}

function _constructAttackAnimation() {
  return function(unit) {
    var updated = false;
    if (hitSplats.length > 0) {
      updated = true;
      unit.leftArm.rotation.x -= 10 * Math.PI / 180;
      unit.rightArm.rotation.x += 10 * Math.PI / 180;
    } else {
      unit.leftArm.rotation.x = 0;
      unit.rightArm.rotation.x = 0;
    }
    return !updated;
  };
}

function _queueAnimation(animatable, funct) {
  if (!animatable.hasOwnProperty("animationQueue")) {
    animatable.animationQueue = [];
  }
  animatable.animationQueue.push(funct);
}

function _initUnitAt(unit, x, z) {
  var y = map.tiles[x][z].height + unit.offSet;
  unit.position.set(x + 0.5, y + 1, z + 0.5);
  _queueAnimation(unit, _constructMoveTo(x + 0.5, y, z + .5));
}

function _handleModelChildren(unit) {
  for (var child of unit.children) {
    child.aspire_type = "unit_piece";
    clickable.push(child);
  }
}

function addUnit(unit, x, z) {
  var uuid = unit.id;
  var type = unit.type;

  var texture = loader.load("textures/brushed_metal.jpg");

  var bodyMat = new THREE.MeshPhongMaterial({ color: 0x00FF00, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  var headMat = new THREE.MeshPhongMaterial({ color: 0x00FF00, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  var legMat = new THREE.MeshPhongMaterial({ color: 0x00FF00, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  var armMat = new THREE.MeshPhongMaterial({ color: 0x00FF00, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});

  if (type === "Death Stalker") {
    var bodyMat = new THREE.MeshPhongMaterial({ color: 0xFF0000, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
    var headMat = new THREE.MeshPhongMaterial({ color: 0xFF0000, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
    var legMat = new THREE.MeshPhongMaterial({ color: 0xFF0000, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
    var armMat = new THREE.MeshPhongMaterial({ color: 0xFF0000, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  } else if (type === "Magician") {
    var bodyMat = new THREE.MeshPhongMaterial({ color: 0x0000FF, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
    var headMat = new THREE.MeshPhongMaterial({ color: 0x0000FF, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
    var legMat = new THREE.MeshPhongMaterial({ color: 0x0000FF, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
    var armMat = new THREE.MeshPhongMaterial({ color: 0x0000FF, map: texture, specular: 0x555555, shininess: 30, side: THREE.DoubleSide});
  }

  var unit = new THREE.Object3D();

  var body = new THREE.Mesh(new THREE.BoxGeometry(.2, .2, .1), bodyMat);
  body.position.set(0, .27, 0);
  unit.add(body);

  var head = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, .1), headMat);
  head.position.set(0, .41, 0);
  unit.add(head);

  var leftArm = new THREE.Mesh(new THREE.BoxGeometry(.1, .17, .1), armMat);
  leftArm.position.set(.15, .28, 0);
  unit.leftArm = leftArm;
  unit.add(leftArm);

  var rightArm = new THREE.Mesh(new THREE.BoxGeometry(.1, .17, .1), armMat);
  rightArm.position.set(-.15, .28, 0);
  unit.rightArm = rightArm;
  unit.add(rightArm);

  var leftLeg = new THREE.Mesh(new THREE.BoxGeometry(.1, .17, .1), legMat);
  leftLeg.position.set(-.05, .085, 0);
  unit.leftLeg = leftLeg;
  unit.add(leftLeg);

  var rightLeg = new THREE.Mesh(new THREE.BoxGeometry(.1, .17, .1), legMat);
  rightLeg.position.set(.05, .085, 0);
  unit.rightLeg = rightLeg;
  unit.add(rightLeg);

  unit.legClicks = 0;

  unit.aspire_type = "unit";
  unit.uuid = uuid;
  unit.offSet = 0;
  unit.height = 1;
  _initUnitAt(unit, x, z);

  units[uuid] = unit;

  _handleModelChildren(unit);
  scene.add(unit);

  return unit;
}

function _displayAttack(serverAttacker, serverDefender) {
  var attacker = units[serverAttacker.id];
  var defender = units[serverDefender.id];

  _queueAnimation(attacker, _constructRotateToFace(defender.position.x, defender.position.z));
  _queueAnimation(attacker, _constructAttackAnimation());
  _queueAnimation(defender, _constructRotateToFace(attacker.position.x, attacker.position.z));
  _queueAnimation(defender, _constructAttackAnimation());
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
    if (unitDef.cost <= funds) {
      node.className = "control-panel-element control-panel-unit-description";
    } else {
      node.className = "control-panel-element control-panel-unit-unspawnable-description";
    }
    node.unitType = unitDef.name;
    var unitName = document.createTextNode(unitDef.name);
    var unitCost = document.createTextNode("Cost: " + unitDef.cost);
    var unitHealth = document.createTextNode("Health: " + unitDef.health);
    var unitHitPower = document.createTextNode("Strength: " + unitDef.hitPower);
    var unitAttacks = document.createTextNode("Attakcs: " + unitDef.attacks);
    var unitBlockingPower = document.createTextNode("Defense: " + unitDef.blockingPower);
    var movement = document.createTextNode("Movement: " + unitDef.movement);

    node.appendChild(unitName);
    node.appendChild(document.createElement("BR"));
    node.appendChild(unitCost);
    node.appendChild(document.createElement("BR"));
    node.appendChild(unitHealth);
    node.appendChild(document.createElement("BR"));
    node.appendChild(unitHitPower);
    node.appendChild(document.createElement("BR"));
    node.appendChild(unitAttacks);
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
  return isActiveUnitSet() && activeUnit.owner.id === cliPlayer;
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
    var attacks = document.getElementById("attacks");
    var maxAttacks = document.getElementById("max-attacks");
    var remainingMovement = document.getElementById("remaining-movement");
    var maxMovement = document.getElementById("max-movement");
    var ownerName = document.getElementById("owner-name");

    health.innerHTML = unitProfile.health;
    maxHealth.innerHTML = unitProfile.maxHealth;
    hitPower.innerHTML = unitProfile.hitPower;
    blockingPower.innerHTML = unitProfile.blockingPower;
    attacks.innerHTML = unitProfile.attacks;
    maxAttacks.innerHTML = unitProfile.maxAttacks;
    remainingMovement.innerHTML = unitProfile.remainingMovement;
    maxMovement.innerHTML = unitProfile.maxMovement;
    ownerName.innerHTML = unitProfile.owner.id;

    activeUnit.owner = unitProfile.owner;

    if (isActiveUnitOwned()) {
      ownerName.innerHTML += " (You)";
    }
  }
}

function moveUnit(uuid, x, z) {
  var unit = units[uuid];
  _queueAnimation(unit, _constructRotateToFace(x + .5, z + .5));
  _queueAnimation(unit, _constructMoveTo(x + 0.5, map.tiles[x][z].height + unit.offSet, z + 0.5));
  if (isActiveUnit(uuid)) {
    requestActiveUnitUpdate();
  }
}

function remUnit(uuid) {
  var unit = units[uuid];
  scene.remove(unit);
  clickable = clickable.filter(function(el) {
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

  var yPos = unit.position.y + ((unit.height - unit.offSet) / 2);
  var updated;
  do {
    updated = false;

    hitSplat.position.set(unit.position.x, yPos, unit.position.z);

    for (var hitSplatIndex in hitSplats) {
      var aHitSplat = hitSplats[hitSplatIndex];
      if (aHitSplat.position.x === unit.position.x && aHitSplat.position.z === unit.position.z) {
        if (aHitSplat.position.y === yPos) {
          yPos += .5;
          updated = true;
          break;
        }
      }
    }
  } while (updated);

  hitSplats.push(hitSplat);

  scene.add(hitSplat);
}

function displayWinner(winner) {
  document.getElementById("winner-notice").style.display = "initial";
  document.getElementById("winner-name").innerHTML = winner;
}

// Lighting
var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add( directionalLight );

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
    focusRing.position.set(activeUnit.position.x, activeUnit.position.y + ((activeUnit.height - activeUnit.offSet) / 2), activeUnit.position.z);
    if ((Number(ring) + 1) % 2 === 0) {
      focusRing.rotateX(.1);
    } else {
      focusRing.rotateY(.1);
    }
    focusRing.rotateZ(.1);
  }
}

function drawFocusRing() {
  if (focusRings.length === 0) {
    if (isActiveUnitSet()) {
      var geometry = new THREE.RingGeometry(0.5, 0.6, 32);
      var texture = loader.load("textures/blue_left.png");
      // sdfsdfsdfsd
      var material = new THREE.MeshBasicMaterial({color: 0x0000FF, map: texture, side: THREE.DoubleSide});
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
  var toRemove = [];
  for (var hitSplat of hitSplats) {
    hitSplat.scale.set(hitSplat.scale.x * 0.9, hitSplat.scale.y * 0.9, hitSplat.scale.z * 0.9);
    if (hitSplat.scale.x < .34) {
      scene.remove(hitSplat);
      toRemove.push(hitSplat);
    }
  }

  for (var splat of toRemove) {
    hitSplats.splice(hitSplats.indexOf(splat), 1);
  }
}

function render() {
  setTimeout(function() {
    requestAnimationFrame(render);

    scene.traverse(function(sceneEntry) {
        // Unit movement/combat
        if (sceneEntry.hasOwnProperty("animationQueue")) {
          while (sceneEntry.animationQueue.length > 0) {
            var endOfAnimation = sceneEntry.animationQueue[0](sceneEntry);
            if (!endOfAnimation) {
              break;
            }
            sceneEntry.animationQueue.shift();
          }
        }

        // Camera Support
        if (sceneEntry.hasOwnProperty("targPos")) {
          processMovement(sceneEntry);
        }
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
