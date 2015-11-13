var scene = new THREE.Scene();
var clock = new THREE.Clock();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var material = new THREE.MeshPhongMaterial( { color: 0x6F6CC5, specular: 0x555555, shininess: 30, side: THREE.DoubleSide} );
function createGeom(ax, az, bx, bz, cx, cz, ha, hb, hc) {

  return geometry;
}

var tileMap = [
  {x: 0, z: 1, seH: 1, swH: 1, neH: 1, nwH: 1},
  {x: 1, z: 1, seH: 1, swH: 1, neH: 2.5, nwH: 2},
  {x: 2, z: 1, seH: 2.5, swH: 2, neH: 2.5, nwH: 2.5},
  {x: 2, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
  {x: 0, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
  {x: 1, z: 3, seH: 1, swH: 1, neH: 1, nwH: 1},
  {x: 1, z: 2, seH: 1, swH: 1, neH: 2, nwH: 1},
  {x: 1, z: 5, seH: 1, swH: 1, neH: 1, nwH: 1},
  {x: 3, z: 5, seH: 1, swH: 1, neH: 1, nwH: 1}
];

var tiles = [];

function addTile(ax, az, bx, bz, cx, cz, dx, dz, ha, hb, hc, hd) {
  var geometry = new THREE.PlaneGeometry( 5, 5, 1, 1 );
  geometry.vertices[0] = new THREE.Vector3(ax, ha, az);
  geometry.vertices[1] = new THREE.Vector3(bx, hb, bz);
  geometry.vertices[2] = new THREE.Vector3(cx, hc, cz);
  geometry.vertices[3] = new THREE.Vector3(dx, hd, dz);

  tile = new THREE.Mesh(geometry, material);
  tiles.push(tile);

  scene.add(tile);
}

for (var tile in tileMap) {
  var tileDef = tileMap[tile];
  addTile(
    tileDef.x + 0, tileDef.z + 0, // a
    tileDef.x + 0, tileDef.z + 1, // b
    tileDef.x + 1, tileDef.z + 0, // c
    tileDef.x + 1, tileDef.z + 1, // d
    tileDef.seH + 1,
    tileDef.swH + 1,
    tileDef.neH + 1,
    tileDef.nwH + 1
  );
}

camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 5;

var light = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( light );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 0, 1, 0 );
scene.add( directionalLight );

function render() {
  requestAnimationFrame( render );

  for (var tile in tiles) {
    tiles[tile].rotation.x += 0.01;
    tiles[tile].rotation.y += 0.01;
    tiles[tile].rotation.z += 0.01;
  }

  renderer.render( scene, camera );
}
render();
