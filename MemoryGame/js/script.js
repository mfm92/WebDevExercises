let secondTryImpending = false;
let totalAttempts = 0;
let imageOrdering = [];
let locked = false;
let startDate, endDate;
let clock;

Array.prototype.shuffle = function() {
  for (let i = 0; i < this.length; i++) {
    const randomIndex = Math.floor(Math.random() * this.length);
    const elementAtIndex = this[randomIndex];

    this[randomIndex] = this[i];
    this[i] = elementAtIndex;
  }
};

$(document).ready(function() {
  setUpImageOrdering();
  setUpEvtListeners();
  setUpButtons();
  setUpClock();
  startDate = new Date();
});

var Card = function(nr) {
  this.classNumber = 'card' + nr;
  this.flipped = false;
  this.success = false;
};

Card.prototype.flip = function() {
  this.flipped = !this.flipped;
};

const restart = function() {
  totalAttempts = 0;
  locked = false;
  secondTryImpending = false;
  imageOrdering = [];

  const attemptsParagraph = $("#starRating");
  attemptsParagraph.text(starRating());

  let divBoxes = $('.mainGrid div');
  for (divBox of divBoxes) {
    const box = $(divBox);
    box.attr('class', '');
  }

  setUpImageOrdering();
  setUpEvtListeners();
  setUpClock();

  startDate = new Date();
  clock.setTime(0);
  clock.start();
};

const playAgain = function() {
  const successPage = $(".successPage");
  const container = $(".flex-container");
  const fadeDuration = 1000;

  successPage.slideUp('slow', function() {
    $("#neededAttempts, #neededTime, #finalStarRating, #playAgainButton").css({
      visibility: 'hidden'
    });
    restart();
    container.children().show('fade', null, fadeDuration, undefined);
  });
}

const setUpClock = function() {
  clock = $('#clock').FlipClock({
    autoStart: false,
    clockFace: 'MinuteCounter'
  });
  clock.start();
}

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

const setUpEvtListeners = function() {
  let counter = 0;
  let divBoxes = $('.mainGrid div');
  const idAttribute = 'id';
  const idValuePrefix = 'value';
  const flipAnimationDuration = 350;

  for (divBox of divBoxes) {
    const box = $(divBox);
    box.attr(idAttribute, idValuePrefix + counter++);
    box.click(function() {
      const selfBox = $(this);
      const elemId = selfBox.attr(idAttribute);
      const id = elemId.substring(idValuePrefix.length, elemId.length);
      let card = imageOrdering[id];

      if (card.flipped || card.success || locked) {
        return;
      }

      card.flip();
      selfBox.hide('fade', null, flipAnimationDuration/2, function() {
        selfBox.toggleClass(card.classNumber);
        selfBox.show('clip', null, flipAnimationDuration/2, function() {
          updateGame();
          checkPair();
          if (checkWin()) {
            displayWin();
          };
        });
      });
    });
  }
};

const starRating = function() {
  const borders = {
    good: 26,
    ok: 41,
  };

  if (totalAttempts < borders.good) {
    return '⭐⭐⭐';
  }
  if (totalAttempts < borders.ok) {
    return '⭐⭐';
  }

  return '⭐';
}

const updateGame = function() {
  totalAttempts++;
  secondTryImpending = !secondTryImpending;
  const attemptsParagraph = $("#starRating");
  attemptsParagraph.text(starRating());
};

const checkPair = function() {
  if (secondTryImpending) {
    return;
  }
  let flipped = [];
  for (imageOrder of imageOrdering) {
    if (imageOrder.flipped && !imageOrder.success) {
      flipped.push(imageOrder);
    }
  }

  const flippedOverLeft = flipped[0].classNumber;
  const flippedOverRight = flipped[1].classNumber;
  let successPair = flippedOverRight === flippedOverLeft;

  if (successPair) {
    for (flip of flipped) {
      flip.success = true;
    }
    const matchFadeColor = 800;
    const flippedLeftElement = $('.' + flippedOverLeft);
    flippedLeftElement.toggleClass('success' + flipped[0].classNumber, matchFadeColor);
  } else {
    for (flip of flipped) {
      flip.flip();
    }

    locked = true;
    const flipBackAnimationDuration = 500;
    const flippedElements = $('.' + flippedOverLeft + ', .' + flippedOverRight);
    flippedElements.each(function() {
      const flippedElement = $(this);
      flippedElement.effect('shake', null, flipBackAnimationDuration * 0.4, function() {
        flippedElement.hide('fade', null, flipBackAnimationDuration * 0.3, function() {
          if (flippedElement.hasClass(flippedOverLeft)) {
            flippedElement.toggleClass(flippedOverLeft);
          }
          if (flippedElement.hasClass(flippedOverRight)) {
            flippedElement.toggleClass(flippedOverRight);
          }
          flippedElement.show('clip', null, flipBackAnimationDuration * 0.3, function() {
            if (locked) {
              locked = false;
            }
          });
        });
      });
    });
  }
};

const checkWin = function() {
  let victory = true;

  for (image of imageOrdering) {
    if (!image.success) {
      victory = false;
    }
  }

  return victory;
};

const displayWin = function() {
  endDate = new Date();
  clock.stop();
  const flexContainer = $(".flex-container");
  const successPage = $(".successPage");
  const timeDelayShowPage = 2500;

  setTimeout(function() {
    flexContainer.children().fadeOut('slow', function() {
      successPage.slideDown('slow', fadeInStats);
    });
  }, timeDelayShowPage);
};

const fadeInStats = function() {
  const textDelayDuration = 1000;
  const neededAttempts = $("#neededAttempts");
  const neededTime = $("#neededTime");
  const finalStarRating = $("#finalStarRating");
  const playAgainButton = $("#playAgainButton");
  const timeDiff = (endDate-startDate) / 1000;

  $("#neededAttempts, #neededTime, #finalStarRating, #playAgainButton").css({
    visibility: 'visible',
    opacity: 0.0
  });

  neededAttempts.text(totalAttempts);
  neededTime.text(timeDiff);
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
