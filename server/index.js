"use strict";

var uuid = require('node-uuid');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('../client'));

function requestMap() {
  return [
    {x: 0, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 0, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0, type: "spawner"},
    {x: 1, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 1, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0, type: "spawner"},
    {x: 2, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 2, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 0, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 1, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 2, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 3, seH: 0, swH: 0, neH: 0, nwH: 0},
    {x: 3, z: 4, seH: 0, swH: 0, neH: 0, nwH: 0, type: "spawner"},
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

var games = {};

function createGame(game) {
  if (!games.hasOwnProperty(game)) {
    var newGame = games[game] = {
      id: game,
      winner: null,
      map: requestMap(),
      players: [],
      units: {},
      unitDefinitions: {}
    }

    // Define some units
    newGame.unitDefinitions["Death Stalker"] = {
      name: "Death Stalker",
      cost: 10,
      health: 200,
      hitPower: 5,
      blockingPower: 5,
      attacks: 7,
      movement: 1
    };
    newGame.unitDefinitions["Magician"] = {
      name: "Magician",
      cost: 20,
      health: 45,
      hitPower: 33,
      blockingPower: 7,
      attacks: 1,
      movement: 10
    };
    newGame.unitDefinitions["Green Cube"] = {
      name: "Green Cube",
      cost: 7,
      health: 65,
      hitPower: 1,
      blockingPower: 15,
      attacks: 100,
      movement: 10
    };

    console.log('New game created: ' + game + '.');

    return newGame;
  }
  return games[game];
}

function addPlayer(game, player) {
  game.players.push(player);
}

function createPlayer(playerName) {
  return {
    id: playerName,
    funds: 100
  };
}

function checkGame(game) {
  if (games.hasOwnProperty(game.id)) {
    if (game.players.length === 0) {
      delete games[game.id];
      console.log('Game destroyed: ' + game.id + '.');
      return false;
    }
  }
  return true;
}

function getTurnOwner(game) {
  return game.players[0];
}

function changeTurn(game) {
  var old = game.players.shift();
  game.players.push(old);
  return getTurnOwner(game);
}

function findWinner(game) {
  if (game.winner !== null) {
    return game.winner;
  }

  var playerSet = new Set();
  for (var unitIndex in game.units) {
    var unit = game.units[unitIndex];
    playerSet.add(unit.owner);
  }

  if (playerSet.size === 1) {
    game.winner = playerSet[Symbol.iterator]().next().value;
  }

  return game.winner;
}

function canMove(game, player) {
  if (game.winner !== null) {
    return false;
  }
  if (game.players[0] !== player) {
    return false;
  }
  return true;
}

function getNewFunds(game, player, unitType) {
  return player.funds - game.unitDefinitions[unitType].cost;
}

function updateFunds(player, newFunds) {
  player.funds = newFunds;
}

function addUnit(game, posX, posZ, unitType, owner, replinished) {
  var unitDefinition = game.unitDefinitions[unitType];
  var unitID = uuid.v1();
  return game.units[unitID] = {
    id: unitID,
    type: unitType,
    x: posX,
    z: posZ,
    owner: owner,
    health: unitDefinition.health,
    maxHealth: unitDefinition.health,
    hitPower: unitDefinition.hitPower,
    blockingPower: unitDefinition.blockingPower,
    attacks: replinished ? unitDefinition.attacks : 0,
    maxAttacks: unitDefinition.attacks,
    remainingMovement: replinished ? unitDefinition.movement : 0,
    maxMovement: unitDefinition.movement
  }
}

io.on('connection', function(socket) {
  console.log('User connected!');
  var player;
  var game;
  socket.on('join game', function(data) {
    player = createPlayer(data.player);
    game = createGame(data.game);

    socket.join(game.id);
    addPlayer(game, player);
    console.log(player.id + ' has joined game ' + game.id + '.');

    // Initial game setup

    socket.emit('map change', {
      map: game.map
    });

    socket.emit('turn change', {
      turnOwner: getTurnOwner(game)
    });

    socket.emit('funds change', {
      newFunds: player.funds
    });

    for (var unitIndex in game.units) {
      var unit = game.units[unitIndex];
      socket.emit('spawn unit', {
        unit: unit.id,
        x: unit.x,
        z: unit.z
      });
    }

    var initialUnit = addUnit(game, 0, 1, "Green Cube", player, true);

    io.to(game.id).emit('spawn unit', {
      unit: initialUnit.id,
      x: initialUnit.x,
      z: initialUnit.z
    });

    // Game listeners

    socket.on('spawner populate', function(data) {
      if (!canMove(game, player)) {
        return;
      }

      socket.emit('spawner activate', {
        x: data.x, z: data.z
      });
      socket.emit('spawner populate', {
        unitDefinitions: game.unitDefinitions
      });
    });

    socket.on('spawn unit', function(data) {
      if (!canMove(game, player)) {
        return;
      }

      var newFunds = getNewFunds(game, player, data.unitType);

      if (newFunds < 0) {
        return;
      }

      updateFunds(player, newFunds);
      socket.emit('funds change', {
        newFunds: player.funds
      });

      var newUnit = addUnit(game, data.x, data.z, data.unitType, player, false);
      io.to(game.id).emit('spawn unit', {
        unit: newUnit.id,
        x: newUnit.x,
        z: newUnit.z
      });
    });

    socket.on('get unit details', function(data) {
      socket.emit('active unit update', {
        unitProfile: game.units[data.unit]
      });
    });

    socket.on('attack unit', function(data) {
      if (!canMove(game, player)) {
        return;
      }

      var attacker = game.units[data.attacker];
      var defender = game.units[data.defender];

      if (attacker.owner === defender.owner) {
        return;
      }

      if (attacker.attacks <= 0) {
        return;
      }

      --attacker.attacks;

      var damageAmt = Math.max(0, attacker.hitPower - defender.blockingPower);
      damageAmt = Math.min(defender.health, damageAmt);
      defender.health -= damageAmt;
      io.to(game.id).emit('hitsplat', {
        unit: defender.id,
        damage: damageAmt
      });

      if (defender.health === 0) {
        io.to(game.id).emit('kill unit', {
          unit: defender.id
        });
        delete game.units[data.defender];
        return;
      }

      damageAmt = Math.max(0, defender.hitPower - attacker.blockingPower);
      damageAmt = Math.min(attacker.health, damageAmt);
      attacker.health -= damageAmt;
      io.to(game.id).emit('hitsplat', {
        unit: attacker.id,
        damage: damageAmt
      });

      if (attacker.health === 0) {
        io.to(game.id).emit('kill unit', {
          unit: attacker.id
        });
        delete game.units[data.attacker];
      }
    });

    socket.on('move unit', function(data) {
      if (!canMove(game, player)) {
        return;
      }

      var unit = game.units[data.unit];

      if (unit.remainingMovement <= 0) {
        return;
      }

      var xDiff = Math.abs(unit.x - data.newX);
      var zDiff = Math.abs(unit.z - data.newZ)
      if ((xDiff === 1 && zDiff === 0) || (zDiff === 1 && xDiff === 0)) {
        --unit.remainingMovement;

        unit.x = data.newX;
        unit.z = data.newZ;

        io.to(game.id).emit('move unit', {
          unit: data.unit,
          newX: data.newX,
          newZ: data.newZ
        });
      }
    });

    socket.on('end turn', function(data) {
      if (!canMove(game, player)) {
        return;
      }

      for (var unitIndex in game.units) {
        var unit = game.units[unitIndex];
        unit.attacks = unit.maxAttacks;
        unit.remainingMovement = unit.maxMovement;
      }

      var winningPlayer = findWinner(game);
      if (winningPlayer !== null) {
        io.to(game.id).emit('game end', {
          winner: winningPlayer
        });
        return;
      }

      changeTurn(game);
      io.to(game.id).emit('turn change', {
        turnOwner: getTurnOwner(game)
      });
    });
  });
  socket.on('disconnect', function() {
    if (player != undefined) {
      console.log(player.id + ' disconnected.');
    } else {
      console.log('User disconnected.');
    }

    if (game != undefined && player != undefined) {
      for (var unitIndex in game.units) {
        var unit = game.units[unitIndex];
        var condition = unit.owner === player;
        if (condition) {
          io.to(game.id).emit('kill unit', {
            unit: unit.id
          });
          delete game.units[unitIndex];
        }
      }

      var wasUsersTurn = getTurnOwner(game) === player;
      if (wasUsersTurn) {
        changeTurn(game);
        io.to(game.id).emit('turn change', {
          turnOwner: getTurnOwner(game)
        });
      }

      game.players = game.players.filter(function(el) {
        return el.id !== player.id;
      });

      checkGame(game);
    }
  });
});


http.listen(80, function(){
  console.log('listening on *:80');
});
