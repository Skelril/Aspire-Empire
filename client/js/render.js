////////////////////////////////////////////////////////////////////////////////
// Server Interface
////////////////////////////////////////////////////////////////////////////////

function requestMap(gameID) {
  return [
    {x: 0, z: 0, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 0, z: 1, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 0, z: 2, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 0, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 0, z: 4, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 1, z: 0, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 1, z: 1, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 1, z: 2, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 1, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 1, z: 4, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 2, z: 0, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 2, z: 1, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 2, z: 2, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 2, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 2, z: 4, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 3, z: 0, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 3, z: 1, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 3, z: 2, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 3, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 3, z: 4, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 4, z: 0, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 4, z: 1, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 4, z: 2, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 4, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
    {x: 4, z: 4, seH: 1, swH: 1, neH: 1, nwH: 1}
  ];
}

function pocessUnits(gameID) {
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
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Tile/map Management

var tiles = {};

function addTile(tileDef) {
  var tile = _addTile(
    tileDef.x + 0, tileDef.z + 0, // a
    tileDef.x + 0, tileDef.z + 1, // b
    tileDef.x + 1, tileDef.z + 0, // c
    tileDef.x + 1, tileDef.z + 1, // d
    tileDef.seH + 1,
    tileDef.swH + 1,
    tileDef.neH + 1,
    tileDef.nwH + 1
  );
  scene.add(tile);

  tile.def = tileDef;
  if (!(tileDef.x in tiles)) {
    tiles[tileDef.x] = {}
  }
  tiles[tileDef.x][tileDef.z] = tile;
}

function _addTile(ax, az, bx, bz, cx, cz, dx, dz, ha, hb, hc, hd) {
  var geometry = new THREE.PlaneGeometry( 5, 5, 1, 1 );
  geometry.vertices[0] = new THREE.Vector3(ax, ha, az);
  geometry.vertices[1] = new THREE.Vector3(bx, hb, bz);
  geometry.vertices[2] = new THREE.Vector3(cx, hc, cz);
  geometry.vertices[3] = new THREE.Vector3(dx, hd, dz);

  var material = new THREE.MeshPhongMaterial( { color: 0x6F6CC5, specular: 0x555555, shininess: 30, side: THREE.DoubleSide} );
  return new THREE.Mesh(geometry, material);
}

function loadMap(tileMap) {
  for (var tile in tileMap) {
    addTile(tileMap[tile]);
  }
}

// Unit Management

var units = {}

function addUnit(uuid, x, z) {
  var geometry = new THREE.BoxGeometry( .5, .5, .5 );
  var material = new THREE.MeshPhongMaterial( { color: 0x00FF00, specular: 0x555555, shininess: 30, side: THREE.DoubleSide} );

  var unit = new THREE.Mesh( geometry, material );
  unit.position.set(x + 0.5, 2.25, z + 0.5);
  unit.targPos = new THREE.Vector3(x + 0.5, 2.25, z + 0.5);
  units[uuid] = unit;

  scene.add(unit);

  return unit;
}

function remUnit(uuid) {
  scene.remove(units[uuid]);
  delete units[uuid];
}

function moveUnit(uuid, newX, newZ) {
  units[uuid].targPos.set(newX, 2.25, newZ);
}

// Camera Controls
camera.position.x = -2;
camera.position.y = 5;
camera.position.z = 7;

camera.lookAt(new THREE.Vector3(0, 1, 0));

// Lighting
var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 0, 1, 0 );
scene.add( directionalLight );

// Load game data
loadMap(requestMap(""));
pocessUnits("");

// Rendering & Movement constants
var MOVEMENT_PRECISION = 1;
var MOVEMENT_UNIT = 0.1;

function render() {
  requestAnimationFrame(render);

  for (unit in units) {
    var aUnit = units[unit];
    if (aUnit.position.x.toFixed(MOVEMENT_PRECISION) !== aUnit.targPos.x.toFixed(MOVEMENT_PRECISION)) {
      if (aUnit.position.x < aUnit.targPos.x) {
        aUnit.position.x += MOVEMENT_UNIT;
      } else {
        aUnit.position.x -= MOVEMENT_UNIT;
      }
    }
    if (aUnit.position.y.toFixed(MOVEMENT_PRECISION) !== aUnit.targPos.y.toFixed(MOVEMENT_PRECISION)) {
      if (aUnit.position.y < aUnit.targPos.y) {
        aUnit.position.y += MOVEMENT_UNIT;
      } else {
        aUnit.position.y -= MOVEMENT_UNIT;
      }
    }
    if (aUnit.position.z.toFixed(MOVEMENT_PRECISION) !== aUnit.targPos.z.toFixed(MOVEMENT_PRECISION)) {
      if (aUnit.position.z < aUnit.targPos.z) {
        aUnit.position.z += MOVEMENT_UNIT;
      } else {
        aUnit.position.z -= MOVEMENT_UNIT;
      }
    }
  }

  renderer.render( scene, camera );
}
render();
