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
    {x: 4, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0}
  ];
}

function requestMove(x, z) {
  if (activeUnit != null) {
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

function setActiveUnit(uuid) {
  activeUnit = units[uuid];
  cameraLookAt(activeUnit);
}

function moveUnit(uuid, x, z) {
  var unit = units[uuid];
  unit.targPos.set(x + 0.5, map.tiles[x][z].height + (unit.height / 2), z + 0.5);
}

function remUnit(uuid) {
  var unit = units[uuid];
  scene.remove(unit);
  clickable.remove(unit);
  delete units[uuid];
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
    if (activeUnit == null) {
      for (var ring in focusRings) {
        scene.remove(focusRings[ring]);
      }
    } else {
      _updateFocusRings();
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
        cameraLookAt(activeUnit);
      }
    );

    processMovement(camera);
    drawFocusRing();
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
