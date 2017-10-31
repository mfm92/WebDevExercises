let totalAttempts = 0;
let imageOrdering = [];
let clock;
let flipGoingOn = false;
let firstClick = true;

/**
* Adding shuffle functionality to Array.prototype
*/
Array.prototype.shuffle = function() {
  for (let i = 0; i < this.length; i++) {
    const randomIndex = Math.floor(Math.random() * this.length);
    const elementAtIndex = this[randomIndex];

    this[randomIndex] = this[i];
    this[i] = elementAtIndex;
  }
};

/**
* @description Card pseudo class
* @param {object} nr:
*   Number between 1 and 8 depending on the associated image
*/
var Card = function(nr) {
  this.classNumber = "card" + nr;
  this.flipped = false;
  this.success = false;
};

Card.prototype.flip = function() {
  this.flipped = !this.flipped;
};

$(document).ready(function() {
  setUpImageOrdering();
  setUpEvtListeners();
  setUpButtons();
  setUpClock();
});

/**
* @description This will be run when the user hits 'Restart'
*/
const restart = function() {
  // reset global values
  totalAttempts = 0;
  imageOrdering = [];
  flipGoingOn = false;
  firstClick = true;

  // reset star rating
  const attemptsParagraph = $("#starRating");
  attemptsParagraph.text(starRating());

  const movesCounter = $("#movesCounter");
  movesCounter.text("Moves: 0");

  // re-shuffle cards
  setUpImageOrdering();

  // re-start timer
  setUpClock();

  let divBoxes = $(".mainGrid div");
  for (divBox of divBoxes) {
    const box = $(divBox);
    box.removeAttr("class");
    box.removeAttr("style");
  };
};

/**
* @description This will be run when the user hits 'Play again'.
*/
const playAgain = function() {
  const successPage = $(".successPage");
  const container = $(".flex-container");
  const fadeDuration = 1000;

  // Hide success page modal
  successPage.slideUp("slow", function() {
    $("#neededAttempts, #neededTime, #finalStarRating, #playAgainButton").css({
      visibility: "hidden"
    });
    // Run restart to re-initialize the game context
    restart();

    // Show the HTML elements associated with the game
    container.children().show("fade", null, fadeDuration, undefined);
  });
}

/**
* @description Set up the timer used in the interface.
*/
const setUpClock = function() {
  clock = $("#clock").FlipClock({
    autoStart: false,
    clockFace: "MinuteCounter"
  });
};

const startClock = function() {
  clock.start();
};

/**
* @description Set up all necessary event listeners on the buttons.
*/
const setUpButtons = function() {
  const restartButton = $("#restartButton");
  const playAgainButton = $("#playAgainButton");
  restartButton.click(() => restart());
  playAgainButton.click(() => playAgain());
};

/**
* @description Push card objects into global array and shuffle.
*/
const setUpImageOrdering = function() {
  const distinctCards = 8;
  const appearancesByCard = 2;

  for (let i = 1; i <= distinctCards; i++) {
    for (let j = 0; j < appearancesByCard; j++) {
      imageOrdering.push(new Card(i));
    }
  }

  imageOrdering.shuffle();
};

/**
* @description Set up event listeners for the cards.
*/
const setUpEvtListeners = function() {
  let counter = 0;
  const divBoxes = $(".mainGrid div");
  const idValuePrefix = "value";
  const idAttribute = "id";

  for (divBox of divBoxes) {
    const box = $(divBox);
    box.attr(idAttribute, idValuePrefix + counter++);
    box.click(() => handleClick.call(box, idAttribute, idValuePrefix));
  }
};

/**
* @description What happens if the user clicks on a box.
* @param {object} idAttribute: "id"
* @param {object} idValuePrefix: the value of the "id" attribute
*   without the incremental value at the end
*/
const handleClick = function(idAttribute, idValuePrefix) {
  const flipAnimationDuration = 350;
  const selfBox = $(this);
  const card = getCard(selfBox, idAttribute, idValuePrefix);
  const secondTryImpending = totalAttempts%2 === 0;

  // Do nothing if the clicked card is either currently flipped,
  // has already been matched successfully
  if (card.flipped || card.success || flipGoingOn) {
    return;
  }

  if (secondTryImpending) {
    flipBackNonMatching(retrieveFlippedCards());
  }
  card.flip();
  updateGame();

  if (firstClick) {
    firstClick = false;
    startClock();
  }

  const flipped = retrieveFlippedCards();
  console.log(flipped.length + " <--- size");
  const successMatch = checkMatch(flipped);

  selfBox.hide("fade", null, flipAnimationDuration/2, function() {
    selfBox.toggleClass(card.classNumber);
    selfBox.show("clip", null, flipAnimationDuration/2, function() {
      if (!secondTryImpending) {
        animateCheck(flipped, successMatch);
        if (checkWin()) {
          displayWin();
        }
      }
    });
  });
};

const getCard = function(selfBox, idAttribute, idValuePrefix) {
  const elemId = selfBox.attr(idAttribute);
  const id = elemId.substring(idValuePrefix.length, elemId.length);
  let card = imageOrdering[id];
  return card;
};

/**
* @description Calculate the star rating to display in the interface.
*/
const starRating = function() {
  // star rating depends on number of clicks performed thus far.
  const borders = {
    good: 28,
    ok: 43,
  };

  if (totalAttempts < borders.good) {
    return "⭐⭐⭐";
  }
  if (totalAttempts < borders.ok) {
    return "⭐⭐";
  }

  return "⭐";
};

const lock = function() {
  if (totalAttempts%2!==1) {
    flipGoingOn = true;
  }
};

const unlock = function() {
  flipGoingOn = false;
};

/**
* @description Update global variables, star rating
*/
const updateGame = function() {
  totalAttempts++;
  lock();
  const movesCounter = $("#movesCounter");
  const attemptsParagraph = $("#starRating");
  movesCounter.text("Moves: " + totalAttempts);
  attemptsParagraph.text(starRating());
};

/**
* @description Return array with flipped card objects
*/
const retrieveFlippedCards = function() {
  let flipped = [];
  for (imageOrder of imageOrdering) {
    if (imageOrder.flipped && !imageOrder.success) {
      flipped.push(imageOrder);
    }
  }

  return flipped;
};

/**
* @description Do both flipped cards contain the same image?
* @param {object} flipped: Array of flipped card objects
*/
const checkMatch = function(flipped) {
  // flipped will always be an array of *two* card objects
  if (flipped.length < 2) {
    return false;
  }
  return flipped[0].classNumber === flipped[1].classNumber;
};

/**
* @description Show animations in the event of a match
* @param {object} flipped: Array of flipped card objects
*/
const displayMatch = function(flipped) {
  unlock();
  flipped.forEach(flip => {
    flip.success = true;
  });
  const matchFadeColor = 800;
  const flippedMatchClass = flipped[0].classNumber;
  const flippedLeftElement = $("." + flippedMatchClass);
  flippedLeftElement.toggleClass("success" + flippedMatchClass, matchFadeColor);
};

/**
* @description Show animations in the event of a mismatch
* @param {object} flipped: Array of flipped card objects
*/
const shakeMismatch = function(flipped) {
  const flippedOverLeft = flipped.length > 0 ? flipped[0].classNumber : "null1";
  const flippedOverRight = flipped.length > 1 ? flipped[1].classNumber : "null2";
  const shakeDuration = 200;
  const flippedElements = $("." + flippedOverLeft + ", ." + flippedOverRight);

  flippedElements.each(function() {
    const flippedElement = $(this);
    flippedElement.effect("shake", null, shakeDuration, () => unlock());
  });
};

const flipBackNonMatching = function(flipped) {
  flipped.forEach(flip => {
    flip.flip();
  });

  const flippedClasses = [];
  const flipBackAnimationDuration = 600;
  flippedClasses.push(flipped.length > 0 ? flipped[0].classNumber : "null1");
  flippedClasses.push(flipped.length > 1 ? flipped[1].classNumber : "null2");

  flippedClasses.forEach(function(flippedClass) {
    const flippedElement = $("." + flippedClass);
    flippedElement.hide("fade", null, flipBackAnimationDuration * 0.5, function() {
      flippedElement.toggleClass(flippedClass);
      flippedElement.show("clip", null, flipBackAnimationDuration * 0.5, undefined);
    });
  });
};

/**
* @description Check if currently exposed two cards match.
*/
const animateCheck = function(flipped, success) {
  if (success) {
    displayMatch(flipped);
  } else {
    shakeMismatch(flipped);
  }
};

/**
* @description Check if all matches have been detected.
*/
const checkWin = function() {
  let victory = true;

  for (image of imageOrdering) {
    if (!image.success) {
      victory = false;
    }
  }

  return victory;
};

/**
* @description Display page once all matches have been found
*/
const displayWin = function() {
  clock.stop();
  const flexContainer = $(".flex-container");
  const successPage = $(".successPage");
  const timeDelayShowPage = 2000;

  setTimeout(function() {
    flexContainer.children().fadeOut("slow", function() {
      successPage.slideDown("slow", fadeInStats);
    });
  }, timeDelayShowPage);
};

/**
* @description Blend in statistics about the previous game, such
*   as number of necessary clicks, needed time and the star rating
*   at the end.
*/
const fadeInStats = function() {
  const textDelayDuration = 500;
  const neededAttempts = $("#neededAttempts");
  const neededTime = $("#neededTime");
  const finalStarRating = $("#finalStarRating");
  const playAgainButton = $("#playAgainButton");

  $("#neededAttempts, #neededTime, #finalStarRating, #playAgainButton").css({
    visibility: "visible",
    opacity: 0.0
  });

  neededAttempts.text(totalAttempts);
  neededTime.text(clock.getTime());
  finalStarRating.text(starRating());

  const opacity = { opacity: 1.0 };
  neededAttempts.animate(opacity, textDelayDuration, function() {
    neededTime.animate(opacity, textDelayDuration, function() {
      finalStarRating.animate(opacity, textDelayDuration, function() {
        playAgainButton.animate(opacity, textDelayDuration, undefined);
      });
    });
  });
};
