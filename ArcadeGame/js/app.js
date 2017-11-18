const randomNumberBetween = function(start, end) {
  return Math.floor((end-start) * Math.random() + start);
};

const WIDTH_OF_CELL = 101;
const HEIGHT_OF_CELL = 83;
const START_LIVES = 3;

const CELL_ROWS = 6;
const CELL_COLUMNS = 5;
let factor = 1;
const pointsBonusSurvival = 100;

const checkCollisions = function() {
  allEnemies.forEach(function(enemy) {
    if (doCheckCollision(player, enemy)) {
      player.reset();
      player.lives--;
      updateLives.call(player);
      handleFail.call(player);
    }
  });
  allGems.forEach(function(gem) {
    if (doCheckCollision(player, gem)) {
      player.points += gem.points;

      if (gem.life) {
        player.lives++;
        updateLives.call(player);
      }

      gem.x = undefined;
      gem.y = undefined;
    }
  });
};

const updateLives = function() {
  const livesText = $("#livesNr");
  livesText.text(this.lives);
}

const doCheckCollision = function(obj1, obj2) {
  return Math.abs(obj1.x - obj2.x) < WIDTH_OF_CELL/2 && Math.abs(obj1.y - obj2.y) < WIDTH_OF_CELL/2;
};

const handleFail = function() {
  if (this.lives > 0) {
    return;
  }
  $("canvas").remove();
};

const handleWin = function() {
  const heightPlayer = player.y;
  const winHeight = 23;

  if (heightPlayer < winHeight) {
    player.reset();
    player.points += (pointsBonusSurvival*factor*allEnemies.length);
    factor *= 1.23;
    placeGemsRandomly();
    placeEnemiesRandomly();
  }
};

const placeGemsRandomly = function() {
  const blueGem = 'images/Gem Blue.png';
  const greenGem = 'images/Gem Green.png';
  const orangeGem = 'images/Gem Orange.png';
  const lifeGem = 'images/Heart.png';

  allGems = [];

  if (randomNumberBetween(1, 100) < 30) {
    allGems.push(new Gem(blueGem, 20*factor, false));
  }
  if (randomNumberBetween(1, 100) < 15) {
    allGems.push(new Gem(greenGem, 50*factor, false));
  }
  if (randomNumberBetween(1, 100) < 7) {
    allGems.push(new Gem(lifeGem, 50*factor, true));
  }
  if (randomNumberBetween(1, 100) < 3) {
    allGems.push(new Gem(orangeGem, 100*factor, false));
  }
};

const placeEnemiesRandomly = function() {
  allEnemies = [];
  const rndNr = randomNumberBetween(1, 100);
  let pushCount = 0;

  if (rndNr < 30) {
    pushCount = 1;
  } else if (rndNr < 90) {
    pushCount = 2;
  } else {
    pushCount = 3;
  }

  for (let i = 0; i < pushCount; i++) {
    allEnemies.push(new Enemy());
  }
};

var Gem = function(sprite, points, life) {
  this.sprite = sprite;
  this.points = points;
  this.life = life;

  this.x = randomNumberBetween(0, 5) * WIDTH_OF_CELL;
  this.y = randomNumberBetween(1, 4) * HEIGHT_OF_CELL;
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = randomNumberBetween(0, 5) * WIDTH_OF_CELL;
    this.y = randomNumberBetween(1, 4) * HEIGHT_OF_CELL;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = (this.x + WIDTH_OF_CELL*(dt*factor)) % (WIDTH_OF_CELL * CELL_COLUMNS);
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
  resetPlayer.call(this);
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
      break;
    }
    default: {
      newX = this.x;
      newY = this.y;
      break;
    };
  }

  this.x = newX;
  this.y = newY;
};

Player.prototype.update = function() {
  handleWin();
  updatePts.call(this)
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
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(),
  allEnemies = [new Enemy()],
  allGems = [];

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
