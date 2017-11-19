"use strict;"

const WIDTH_OF_CELL = 101;
const HEIGHT_OF_CELL = 83;
const START_LIVES = 3;
const CELL_ROWS = 6;
const CELL_COLUMNS = 5;

let collisionLock = false;
let rounds = 1;
let speedMin = 100, speedMax = 100;
const POINTS_BONUS_SURVIVAL = 100;
let timeNewRound = new Date();

/**
 * Return random number in specified range.
 *
 * @param {start} start Lower border of the range.
 * @param {end} end Upper border of the range.
 * @return See above.
 */
const randomNumberBetween = function(start, end) {
  return Math.floor((end-start) * Math.random() + start);
};

/**
 * Logic to calculate whether two objects collided.
 * @param {obj1} obj1 Object 1
 * @param {obj2} obj2 Object 2
 */
const doCheckCollision = function(obj1, obj2) {
  return Math.abs(obj1.x - obj2.x) < WIDTH_OF_CELL/2 && Math.abs(obj1.y - obj2.y) < WIDTH_OF_CELL/2;
};

/**
 * Check if the player collides with an enemy or successfully picked
 * up a gem. If he collided with an enemy reset the player and deduct
 * 1 from the life count.
 * Also check if the player ran out of lives and end the game if so.
 * If a gem was picked up, add a number of points and display a text.
 */
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
      fadeInPoints("+" + Math.round(gem.points), player.x, player.y, 0, 204, 102);

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

/**
 * Show the updated number of player lives in the UI.
 */
const updateLives = function() {
  const livesText = $(".livesNr");
  livesText.text(this.lives);
};

/**
 * Show the updated number of rounds that the player
 * survived in the UI.
 */
const updateRounds = function() {
  const roundsText = $(".rounds");
  roundsText.text(++rounds);
};

/**
 * Show the updated number of points that the player
 * collected in the UI.
 */
const updatePts = function() {
  const pointsText = $(".points");
  pointsText.text(Math.round(this.points));
};

/**
 * Display a "Game Over" message to the UI if the player
 * ran out of lives.
 */
const handleFail = function() {
  if (this.lives > 0) {
    return;
  }
  $("canvas").remove();
  $(".finalText").text("Game over :(");
  $(".finalText").css({display: "block"});
};

/**
 * Carry out all necessary updates if the player makes it to the
 * safe shore.
 * - Update speed of enemies for the next round
 * - Add an amount of points as reward for making it to the safe side,
 *   which depends on the number of enemies in that round and their speed
 * - Add rocks and gems randomly for the next round.
 */
const handleRoundOver = function() {
  const heightPlayer = player.y;
  const winHeight = 23;

  if (heightPlayer < winHeight) {
    fadeInPoints("+" + Math.round(POINTS_BONUS_SURVIVAL*(speedMin/100)*allEnemies.length), player.x, player.y, 0, 204, 0);
    player.reset();
    player.points += (POINTS_BONUS_SURVIVAL*(speedMin/100)*allEnemies.length);
    speedMin *= 1.14;
    speedMax *= 1.24;
    placeRocksRandomly();
    placeGemsRandomly();
    placeEnemiesRandomly();
    updateRounds();
  }
};

/**
 * If the player takes too long, points will be deducted.
 * The amount of time after which penalties will be imposed
 * depends on the round (the further the player has made it the longer
 * it takes for penalties to start taking effect)
 */
const penaltiesForTime = function() {
  if (player.lives <= 0) {
    return;
  }
  const timeDiff = new Date() - timeNewRound;
  if (timeDiff > 4000*(speedMin/100) && timeDiff % 600 < 10) {
    $(".points").css({color: "#c0392b"});
    player.points = Math.max(0, player.points-(7*(speedMin/100)));
  }
};

/**
 * Show some text if a player wins or loses points, then fade it out.
 * @param {points} points Number of points that the player won.
 * @param {x} x X-value where the text shows up.
 * @param {y} y Y-value where the text shows up.
 * @param {r} r R-value of the color of the text.
 * @param {g} g G-value of the color of the text.
 * @param {b} b B-value of the color of the text.
 *
 * NOTE: The implementation of this method was partially taken over from
 * the first reply of this thread:
 * {@link https://stackoverflow.com/questions/9932898/fade-out-effect-for-text-in-html5-canvas}
 */
const fadeInPoints = function(points, x, y, r, g, b) {
  let opacity = 1.0;
  let interval = setInterval(function() {
    ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
    ctx.font = "bold 32px Oswald, sans-serif";
    ctx.fillText(points, x, y + HEIGHT_OF_CELL);
    opacity -= 0.01;
    if (opacity === 0) {
      clearInterval(interval);
    }
  }, 10);
};

/**
 * Add gems to the board. If the player picks them up
 * he wins a bonus in the shape of points or additional
 * lives. The possibility for gems that win extra lives
 * is increasing the further the player makes it.
 */
const placeGemsRandomly = function() {
  const blueGem = "images/Gem Blue.png";
  const greenGem = "images/Gem Green.png";
  const orangeGem = "images/Gem Orange.png";
  const lifeGem = "images/Heart.png";

  allGems = [];

  if (randomNumberBetween(1, 100) < 40) {
    allGems.push(new Gem(blueGem, 20*speedMin/100, false));
  }
  if (randomNumberBetween(1, 100) < 25) {
    allGems.push(new Gem(greenGem, 50*speedMin/100, false));
  }
  if (randomNumberBetween(1, 100) < (5+rounds*2)) {
    allGems.push(new Gem(lifeGem, 50*speedMin/100, true));
  }
  if (randomNumberBetween(1, 100) < 10) {
    allGems.push(new Gem(orangeGem, speedMin, false));
  }
};

/**
 * Check if the player is about to run into a rock.
 * @param {x} x X-value of the player.
 * @param {y} y Y-value of the player.
 */
const isThereRock = function(x, y) {
  for (let rock of allRocks) {
    if (rock.x === x && rock.y === y) {
      return true;
    }
  }

  return false;
};

/**
 * Place between one and four enemies randomly
 * onto the board. Their speed is increasing the further
 * the player makes it into the game.
 */
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
    allEnemies.push(new Enemy(randomNumberBetween(100*speedMin, 100*speedMax)/100));
  }
};

/**
 * Add rocks to the board. If six or more rocks (never more than eight)
 * are to be placed onto the board, make sure it"s always two rocks on top of each other
 * so there"s always a way for the player to make it to the other side.
 */
const placeRocksRandomly = function() {
  for (let rock of allRocks) {
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

var Item = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
};

Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Gem = function(sprite, points, life) {
  const startCoords = getStartXYGem();
  Item.call(this, startCoords[0], startCoords[1], sprite);
  this.points = points;
  this.life = life;
};

Gem.prototype = Object.create(Item.prototype);
Gem.prototype.constructor = Gem;

const getStartXYGem = function() {
  let x = randomNumberBetween(0, 5) * WIDTH_OF_CELL;
  let y = randomNumberBetween(1, 4) * HEIGHT_OF_CELL;

  while (isThereRock(x, y)) {
    x = randomNumberBetween(0, 5) * WIDTH_OF_CELL;
    y = randomNumberBetween(1, 4) * HEIGHT_OF_CELL;
  }

  return [x, y];
};

var Rock = function(x, y) {
  Item.call(this, x * WIDTH_OF_CELL, y * HEIGHT_OF_CELL, "images/Rock.png");
};

Rock.prototype = Object.create(Item.prototype);
Rock.prototype.constructor = Rock;

// Enemies our player must avoid
var Enemy = function(speed) {
    // Variables applied to each of our instances go here,
    // we"ve provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we"ve provided to easily load images
    Item.call(this, randomNumberBetween(0, 5) * WIDTH_OF_CELL,
      randomNumberBetween(1, 4) * HEIGHT_OF_CELL, "images/enemy-bug.png");
    this.speed = speed;
};

Enemy.prototype = Object.create(Item.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy"s position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (collisionLock) {
      return;
    }
    this.x += (dt*this.speed);
    this.x %= (WIDTH_OF_CELL * CELL_COLUMNS);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  Item.call(this, 2 * WIDTH_OF_CELL, 5 * HEIGHT_OF_CELL, "images/char-boy.png");
  this.lives = START_LIVES;
  this.points = 0;
};

Player.prototype = Object.create(Item.prototype);
Player.prototype.constructor = Player;

/**
* Reset the player to his starting position.
*/
Player.prototype.reset = function() {
  timeNewRound = new Date();
  this.x = 2 * WIDTH_OF_CELL;
  this.y = 5 * HEIGHT_OF_CELL;
  $(".points").css({color: "black"});
};

/**
* Handling user input.
* Making sure the player can"t move off the board.
* @param {keyCode} keyCode The user action
*/
Player.prototype.handleInput = function(keyCode) {
  let newX, newY;

  if (collisionLock) {
    return;
  }

  switch(keyCode) {
    case "left": {
      if (this.x - WIDTH_OF_CELL < 0) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newX = this.x - WIDTH_OF_CELL;
      newY = this.y;
      break;
    }
    case "right": {
      if (this.x + WIDTH_OF_CELL >= WIDTH_OF_CELL * CELL_COLUMNS) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newX = this.x + WIDTH_OF_CELL;
      newY = this.y;
      break;
    }
    case "up": {
      if (this.y - HEIGHT_OF_CELL < 0) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newY = this.y - HEIGHT_OF_CELL;
      newX = this.x;
      break;
    }
    case "down": {
      if (this.y + HEIGHT_OF_CELL >= HEIGHT_OF_CELL * CELL_ROWS) {
        newX = this.x;
        newY = this.y;
        break;
      }
      newY = this.y + HEIGHT_OF_CELL;
      newX = this.x;
      if (!isThereRock(newX, newY)) {
        this.points = Math.max(0, this.points-(25*speedMax/100)); // penalty for moving down!
        fadeInPoints("-" + Math.round(25*speedMax/100), newX, newY, 204, 0, 0);
      }
      break;
    }
    default: {
      newX = this.x;
      newY = this.y;
      break;
    }
  }

  if (!isThereRock(newX, newY)) {
    this.x = newX;
    this.y = newY;
  }
};

/**
* Taking all necessary actions after every move.
* - Check if the player made it to the other side.
* - Check if he is taking too long and deduct points if so.
* - Update UI.
*/
Player.prototype.update = function() {
  if (collisionLock) {
    return;
  }
  handleRoundOver();
  updatePts.call(this);
  penaltiesForTime();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(),
  allEnemies = [new Enemy(speedMin)],
  allGems = [],
  allRocks = [];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don"t need to modify this.
document.addEventListener("keyup", function(e) {
    var allowedKeys = {
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
