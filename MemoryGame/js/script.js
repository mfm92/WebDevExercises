let secondTryImpending = false;
let totalAttempts = 0;
let imageOrdering = [];
let clock;

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
  secondTryImpending = false;
  imageOrdering = [];

  // reset star rating
  const attemptsParagraph = $("#starRating");
  attemptsParagraph.text(starRating());

  // hide all previously revealed images
  let divBoxes = $(".mainGrid div");
  for (divBox of divBoxes) {
    const box = $(divBox);
    box.attr("class", "");
  }

  // re-shuffle cards
  setUpImageOrdering();

  // re-start timer
  clock.setTime(0);
  clock.start();
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
  clock.start();
}

/**
* @description Set up all necessary event listeners on the buttons.
*/
const setUpButtons = function() {
  const restartButton = $("#restartButton");
  const playAgainButton = $("#playAgainButton");
  restartButton.click(function() {
    restart();
  });
  playAgainButton.click(function() {
    playAgain();
  });
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
    box.click(function() {
      handleClick.call(this, idAttribute, idValuePrefix);
    });
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
  const elemId = selfBox.attr(idAttribute);
  const id = elemId.substring(idValuePrefix.length, elemId.length);
  let card = imageOrdering[id];

  // Do nothing if the clicked card is either currently flipped,
  // has already been matched successfully
  if (card.flipped || card.success) {
    return;
  }

  card.flip();
  selfBox.hide("fade", null, flipAnimationDuration/2, function() {
    selfBox.toggleClass(card.classNumber);
    selfBox.show("clip", null, flipAnimationDuration/2, function() {
      updateGame();
      if (!secondTryImpending) {
        animateCheck();
        if (checkWin()) {
          displayWin();
        }
      }
    });
  });
};

/**
* @description Calculate the star rating to display in the interface.
*/
const starRating = function() {
  // star rating depends on number of clicks performed thus far.
  const borders = {
    good: 26,
    ok: 41,
  };

  if (totalAttempts < borders.good) {
    return "⭐⭐⭐";
  }
  if (totalAttempts < borders.ok) {
    return "⭐⭐";
  }

  return "⭐";
}

/**
* @description Update global variables, star rating
*/
const updateGame = function() {
  totalAttempts++;
  secondTryImpending = !secondTryImpending;
  const attemptsParagraph = $("#starRating");
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
  return flipped[0].classNumber === flipped[1].classNumber;
};

/**
* @description Show animations in the event of a match
* @param {object} flipped: Array of flipped card objects
*/
const displayMatch = function(flipped) {
  for (flip of flipped) {
    flip.success = true;
  }
  const matchFadeColor = 800;
  const flippedMatchClass = flipped[0].classNumber;
  const flippedLeftElement = $("." + flippedMatchClass);
  flippedLeftElement.toggleClass("success" + flippedMatchClass, matchFadeColor);
};

/**
* @description Show animations in the event of a mismatch
* @param {object} flipped: Array of flipped card objects
*/
const flipBackNonMatching = function(flipped) {
  for (flip of flipped) {
    flip.flip();
  }
  const flippedOverLeft = flipped[0].classNumber;
  const flippedOverRight = flipped[1].classNumber;
  const flipBackAnimationDuration = 700;
  const showMismatchDuration = 100;
  const flippedElements = $("." + flippedOverLeft + ", ." + flippedOverRight);

  flippedElements.each(function() {
    const flippedElement = $(this);
    flippedElement.effect("shake", null, flipBackAnimationDuration * 0.4, function() {
      setTimeout(function() {
        flippedElement.hide("fade", null, flipBackAnimationDuration * 0.3, function() {
          if (flippedElement.hasClass(flippedOverLeft)) {
            flippedElement.toggleClass(flippedOverLeft);
          }
          if (flippedElement.hasClass(flippedOverRight)) {
            flippedElement.toggleClass(flippedOverRight);
          }
          flippedElement.show("clip", null, flipBackAnimationDuration * 0.3, undefined);
        });
      }, showMismatchDuration);
    });
  });
};

/**
* @description Check if currently exposed two cards match.
*/
const animateCheck = function() {
  let flipped = retrieveFlippedCards();

  if (checkMatch(flipped)) {
    displayMatch(flipped);
  } else {
    flipBackNonMatching(flipped);
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
