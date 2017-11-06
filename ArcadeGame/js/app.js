const randomNumberBetween = function(start, end) {
  return Math.floor((end-start) * Math.random() + start);
};

const WIDTH_OF_CELL = 101;
const HEIGHT_OF_CELL = 83;

const CELL_ROWS = 6;
const CELL_COLUMNS = 5;

const checkCollisions = function() {
  let collision = false;
  allEnemies.forEach(function(enemy) {
    if (Math.abs(player.x - enemy.x) < 1 && Math.abs(player.y - enemy.y) < 1) {
      collision = true;
      player.reset();
    }
  });
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
    this.x = (this.x + WIDTH_OF_CELL*dt) % (WIDTH_OF_CELL * CELL_COLUMNS);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  resetPlayer.call(this);
};

Player.prototype.reset = function() {
  resetPlayer.call(this);
};

const resetPlayer = function() {
  this.x = 2 * WIDTH_OF_CELL;
  this.y = 5 * HEIGHT_OF_CELL;
};

Player.prototype.handleInput = function(keyCode) {
  let newX, newY;

  switch(keyCode) {
    case 'left': {
      newX = (this.x - WIDTH_OF_CELL) % (WIDTH_OF_CELL * CELL_COLUMNS);
      newY = this.y;
      break;
    }
    case 'right': {
      newX = (this.x + WIDTH_OF_CELL) % (WIDTH_OF_CELL * CELL_COLUMNS);
      newY = this.y;
      break;
    }
    case 'up': {
      newY = (this.y - HEIGHT_OF_CELL) % (HEIGHT_OF_CELL * CELL_ROWS);
      newX = this.x;
      break;
    }
    case 'down': {
      newY = (this.y + HEIGHT_OF_CELL) % (HEIGHT_OF_CELL * CELL_ROWS);
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
  //this.y = (this.y + HEIGHT_OF_CELL) % (HEIGHT_OF_CELL * CELL_ROWS);
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(),
  allEnemies = [new Enemy()];

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
