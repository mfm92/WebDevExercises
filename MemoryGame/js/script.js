let secondTryImpending = false;
let totalAttempts = 0;
let imageOrdering = [];
let locked = false;
let startDate;
let clock;

Array.prototype.shuffle = function() {
  for (let i = 0; i < this.length; i++) {
    const randomIndex = Math.floor(Math.random() * this.length);
    const elementAtIndex = this[randomIndex];

    this[randomIndex] = this[i];
    this[i] = elementAtIndex;
  }
};

$(function() {
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

  const attemptsParagraph = $("#attempts");
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

const setUpClock = function() {
  clock = $('#clock').FlipClock({
    autoStart: false,
    clockFace: 'MinuteCounter'
  });
  clock.start();
}

const setUpButtons = function() {
  const button = $("button");
  button.click(function() {
    restart();
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
          checkWin();
        });
      });
    });
  }
};

const starRating = function() {
  const borders = {
    excellent: 21,
    veryGood: 27,
    good: 33,
    ok: 39,
    stillAcceptable: 45,
    bad: 51,
    veryBad: 57
  };

  if (totalAttempts < borders.excellent) {
    return '⭐⭐⭐⭐⭐';
  }
  if (totalAttempts < borders.veryGood) {
    return '⭐⭐⭐⭐';
  }
  if (totalAttempts < borders.good) {
    return '⭐⭐⭐';
  }
  if (totalAttempts < borders.ok) {
    return '⭐⭐';
  }
  if (totalAttempts < borders.stillAcceptable) {
    return '⭐';
  }
  if (totalAttempts < borders.bad) {
    return '💀';
  }
  if (totalAttempts < borders.veryBad) {
    return '💀💀';
  }

  else return '💀💀💀';
}

const updateGame = function() {
  totalAttempts++;
  secondTryImpending = !secondTryImpending;
  const attemptsParagraph = $("#attempts");
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

  if (victory) {
    const timeDiff = (new Date() - startDate) / 1000; // divide by ms
    clock.stop();
    const flexContainer = $(".flex-container");
    const timeDelayShowPage = 2500;
    const innerHTMLWin = "<div class='successPage'><p>Congratulations! You finished the memory game in " +
        totalAttempts + " clicks.</p><p>Rating: " + starRating() + "</p><p>Time needed (seconds): " + timeDiff + "</p></div>";
    setTimeout(function() {
      flexContainer.children().fadeOut('slow', function() {
        flexContainer.children().empty();
        flexContainer.append(innerHTMLWin);
        flexContainer.children().slideDown('slow');
      });
    }, timeDelayShowPage);
  }
};
