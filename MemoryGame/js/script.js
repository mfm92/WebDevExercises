var secondTryImpending = false;
var totalAttempts = 0;
var imageOrdering = [];
var locked = false;

Array.prototype.shuffle = function() {
  for (var i = 0; i < this.length; i++) {
    const randomIndex = Math.floor(Math.random() * this.length);
    const elementAtIndex = this[randomIndex];

    this[randomIndex] = this[i];
    this[i] = elementAtIndex;
  }
};

$(function() {
  setUpImageOrdering();
  setUpEvtListeners();
});

var Card = function(nr) {
  this.classNumber = 'card' + nr;
  this.flipped = false;
  this.success = false;
};

Card.prototype.flip = function() {
  this.flipped = !this.flipped;
};

var setUpImageOrdering = function() {
  const distinctCards = 8;
  const appearancesByCard = 2;

  for (let i = 1; i <= distinctCards; i++) {
    for (let j = 0; j < appearancesByCard; j++) {
      imageOrdering.push(new Card(i));
    }
  }

  imageOrdering.shuffle();
};

var setUpEvtListeners = function() {
  let counter = 0;
  let divBoxes = $('.mainGrid div');
  const idAttribute = 'id';
  const idValuePrefix = 'value';

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
      selfBox.toggleClass(card.classNumber);
      card.flip();
      updateGame();
      checkPair();
      checkWin();
    });
  }
};

const starRating = function() {
  if (totalAttempts < 22) {
    return '⭐⭐⭐⭐⭐';
  }
  if (totalAttempts < 27) {
    return '⭐⭐⭐⭐';
  }
  if (totalAttempts < 32) {
    return '⭐⭐⭐';
  }
  if (totalAttempts < 37) {
    return '⭐⭐';
  }
  if (totalAttempts < 42) {
    return '⭐';
  }
  if (totalAttempts < 47) {
    return '💀';
  }

  else return '💀💀💀';
}

var updateGame = function() {
  totalAttempts++;
  secondTryImpending = !secondTryImpending;
  const attemptsParagraph = $("#attempts");
  attemptsParagraph.text(starRating());
};

var checkPair = function() {
  if (secondTryImpending) {
    return;
  }
  let flipped = [];
  for (imageOrder of imageOrdering) {
    if (imageOrder.flipped && !imageOrder.success) {
      flipped.push(imageOrder);
    }
  }

  const timeOut = 3000;
  const flippedOverLeft = flipped[0].classNumber;
  const flippedOverRight = flipped[1].classNumber;
  let successPair = flippedOverRight === flippedOverLeft;

  if (successPair) {
    for (flip of flipped) {
      flip.success = true;
    }
    $("." + flippedOverLeft).toggleClass('success' + flipped[0].classNumber);
  } else {
    for (flip of flipped) {
      flip.flip();
    }

    locked = true;
    $("." + flippedOverLeft).effect('shake');
    $("." + flippedOverRight).effect('shake');
    setTimeout(function() {
      $("." + flippedOverLeft).toggleClass(flippedOverLeft, 'slow');
      $("." + flippedOverRight).toggleClass(flippedOverRight, 'slow');
      locked = false;
    }, timeOut);
  }
};

var checkWin = function() {
  let victory = true;

  for (image of imageOrdering) {
    if (!image.success) {
      victory = false;
    }
  }

  if (victory) {
    alert('Well done! Total number of clicks: ' + totalAttempts + ', rating: ' + starRating());
  }
};
