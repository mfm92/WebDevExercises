const randomNumberBetween = function(start, end) {
  return Math.floor((end-start) * Math.random() + start);
};

const WIDTH_OF_CELL = 101;
const HEIGHT_OF_CELL = 83;
const START_LIVES = 3;

const CELL_ROWS = 6;
const CELL_COLUMNS = 5;
let collisionLock = false;
let rounds = 1;
let factorMin = 1, factorMax = 1;
const pointsBonusSurvival = 100;
let timeNewRound = new Date();

const checkCollisions = function() {
  if (collisionLock) {
    return;
  }
  allEnemies.forEach(function(enemy) {
    if (doCheckCollision(player, enemy)) {
      collisionLock = true;
      fadeInPoints(":X", player.x, player.y, 204, 0, 0);
      setTimeout(function() {
        player.reset();
        if (player.lives > 0) {
          player.lives--;
        }
        updateLives.call(player);
        handleFail.call(player);
        collisionLock = false;
      }, 1000);
    }
  });
  allGems.forEach(function(gem) {
    if (doCheckCollision(player, gem)) {
      player.points += gem.points;
      fadeInPoints('+' + Math.round(gem.points), player.x, player.y, 0, 204, 102);

      if (gem.life) {
        player.lives++;
        updateLives.call(player);
        fadeInPoints("+1 Life", player.x + WIDTH_OF_CELL, player.y, 0, 153, 153);
      }

      gem.x = undefined;
      gem.y = undefined;
    }
  });
};

const updateLives = function() {
  const livesText = $("#livesNr");
  livesText.text(this.lives);
};

const updateRounds = function() {
  const roundsText = $("#rounds");
  roundsText.text(++rounds);
};

const doCheckCollision = function(obj1, obj2) {
  return Math.abs(obj1.x - obj2.x) < WIDTH_OF_CELL/2 && Math.abs(obj1.y - obj2.y) < WIDTH_OF_CELL/2;
};

const handleFail = function() {
  if (this.lives > 0) {
    return;
  }
  $("canvas").remove();
  $("#finalText").text("Game over :(");
  $("#finalText").css({display: 'block'});
};

const handleWin = function() {
  const heightPlayer = player.y;
  const winHeight = 23;

  if (heightPlayer < winHeight) {
    fadeInPoints('+' + Math.round(pointsBonusSurvival*factorMin*allEnemies.length), player.x, player.y, 0, 204, 0);
    player.reset();
    player.points += (pointsBonusSurvival*factorMin*allEnemies.length);
    factorMin *= 1.14;
    factorMax *= 1.24;
    placeRocksRandomly();
    placeGemsRandomly();
    placeEnemiesRandomly();
    updateRounds();
  }
};

const penaltiesForTime = function() {
  const timeDiff = new Date() - timeNewRound;
  if (timeDiff > 4000*factorMin && timeDiff % 600 < 10) {
    $("#points").css({color: '#c0392b'})
    player.points = Math.max(0, player.points-(7*factorMin));
  }
};

const fadeInPoints = function(points, x, y, r, g, b) {
  let opacity = 1.0;
  let interval = setInterval(function() {
    ctx.fillStyle = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
    ctx.font = 'bold 32px Oswald, sans-serif';
    ctx.fillText(points, x, y + HEIGHT_OF_CELL);
    opacity -= 0.01;
    if (opacity === 0) {
      clearInterval(interval);
    }
  }, 10);
};

const placeGemsRandomly = function() {
  const blueGem = 'images/Gem Blue.png';
  const greenGem = 'images/Gem Green.png';
  const orangeGem = 'images/Gem Orange.png';
  const lifeGem = 'images/Heart.png';

  allGems = [];

  if (randomNumberBetween(1, 100) < 40) {
    allGems.push(new Gem(blueGem, 20*factorMin, false));
  }
  if (randomNumberBetween(1, 100) < 25) {
    allGems.push(new Gem(greenGem, 50*factorMin, false));
  }
  if (randomNumberBetween(1, 100) < (5+rounds*2)) {
    allGems.push(new Gem(lifeGem, 50*factorMin, true));
  }
  if (randomNumberBetween(1, 100) < 10) {
    allGems.push(new Gem(orangeGem, 100*factorMin, false));
  }
};

const isThereRock = function(x, y) {
  for (rock of allRocks) {
    if (rock.x === x && rock.y === y) {
      return true;
    }
  }

  return false;
};

const placeEnemiesRandomly = function() {
  allEnemies = [];
  const rndNr = randomNumberBetween(1, 100);
  let pushCount = 0;

  if (rndNr < 20) {
    pushCount = 1;
  } else if (rndNr < 50) {
    pushCount = 2;
  } else if (rndNr < 95) {
    pushCount = 3;
  } else {
    pushCount = 4;
  }

  for (let i = 0; i < pushCount; i++) {
    allEnemies.push(new Enemy(randomNumberBetween(100*factorMin, 100*factorMax)/100));
  }
};

const placeRocksRandomly = function() {
  for (rock of allRocks) {
    rock.x = undefined;
    rock.y = undefined;
  }

  allRocks = [];
  if (rounds > 1) {
    const rndNr = randomNumberBetween(1, 100);
    let pushCount = 0;

    if (rndNr < 50) {
      pushCount = 1;
    } else if (rndNr < 55) {
      pushCount = 2;
    } else if (rndNr < 70) {
      pushCount = 3;
    } else if (rndNr < 75) {
      pushCount = 4;
    } else if (rndNr < 90) {
      pushCount = 6;
    } else {
      pushCount = 8;
    }

    if (pushCount < 5) {
      for (let i = 0; i < pushCount; i++) {
        allRocks.push(new Rock(randomNumberBetween(0, 5), randomNumberBetween(1, 4)));
      }
    } else {
      for (let i = 0; i < pushCount/2; i++) {
        const x = randomNumberBetween(0, 5);
        const y = randomNumberBetween(1, 3);
        for (let j = 0; j < 2; j++) {
          allRocks.push(new Rock(x, j+y));
        }
      }
    }
  }
};

var Gem = function(sprite, points, life) {
  this.sprite = sprite;
  this.points = points;
  this.life = life;

  this.x = randomNumberBetween(0, 5) * WIDTH_OF_CELL;
  this.y = randomNumberBetween(1, 4) * HEIGHT_OF_CELL;

  while (isThereRock(this.x, this.y)) {
    this.x = randomNumberBetween(0, 5) * WIDTH_OF_CELL;
    this.y = randomNumberBetween(1, 4) * HEIGHT_OF_CELL;
  }
};

var Rock = function(x, y) {
  this.sprite = 'images/Rock.png';
  this.x = x * WIDTH_OF_CELL;
  this.y = y * HEIGHT_OF_CELL;
}

// Enemies our player must avoid
var Enemy = function(factor) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.factor = factor;

    this.x = randomNumberBetween(0, 5) * WIDTH_OF_CELL;
    this.y = randomNumberBetween(1, 4) * HEIGHT_OF_CELL;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (collisionLock) {
      return;
    }
    this.x = (this.x + WIDTH_OF_CELL*(dt*this.factor)) % (WIDTH_OF_CELL * CELL_COLUMNS);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  drawSprite.call(this);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.lives = START_LIVES;
  this.points = 0;

  resetPlayer.call(this);
};

Player.prototype.reset = function() {
  timeNewRound = new Date();
  resetPlayer.call(this);
  $("#points").css({color: 'black'})
};

const resetPlayer = function() {
  this.x = 2 * WIDTH_OF_CELL;
  this.y = 5 * HEIGHT_OF_CELL;
};

const drawSprite = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyCode) {
  let newX, newY;

  if (collisionLock) {
    return;
  }

  switch(keyCode) {
    case 'left': {
      if (this.x - WIDTH_OF_CELL < 0) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newX = this.x - WIDTH_OF_CELL;
      newY = this.y;
      break;
    }
    case 'right': {
      if (this.x + WIDTH_OF_CELL >= WIDTH_OF_CELL * CELL_COLUMNS) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newX = this.x + WIDTH_OF_CELL;
      newY = this.y;
      break;
    }
    case 'up': {
      if (this.y - HEIGHT_OF_CELL < 0) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newY = this.y - HEIGHT_OF_CELL;
      newX = this.x;
      break;
    }
    case 'down': {
      if (this.y + HEIGHT_OF_CELL >= HEIGHT_OF_CELL * CELL_ROWS) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newY = this.y + HEIGHT_OF_CELL;
      newX = this.x;
      if (!isThereRock(newX, newY)) {
        this.points = Math.max(0, this.points-(25*factorMax)); // penalty for moving down!
        fadeInPoints('-' + Math.round(25*factorMax), newX, newY, 204, 0, 0);
      }
      break;
    }
    default: {
      newX = this.x;
      newY = this.y;
      break;
    };
  }

  if (!isThereRock(newX, newY)) {
    this.x = newX;
    this.y = newY;
  }
};

Player.prototype.update = function() {
  if (collisionLock) {
    return;
  }
  handleWin();
  updatePts.call(this);
  penaltiesForTime();
};

const updatePts = function() {
  const pointsText = $("#points");
  pointsText.text(Math.round(this.points));
}

Player.prototype.render = function() {
  drawSprite.call(this);

  for (gem of allGems) {
    drawSprite.call(gem);
  }
  for (rock of allRocks) {
    drawSprite.call(rock);
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(),
  allEnemies = [new Enemy(factorMin)],
  allGems = [],
  allRocks = [];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
