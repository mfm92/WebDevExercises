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

Card.prototype.alert = function() {
  alert(this.classNumber);
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

      console.log('Flipped: ' + card.flipped);
      console.log('Success: ' + card.success);
      console.log('Locked: ' + locked);

      if (card.flipped || card.success || locked) {
        return;
      }
      console.log('ID: ' + id);
      selfBox.toggleClass(card.classNumber);
      card.flip();
      console.log('Flipped after: ' + card.flipped);
      console.log('Success after: ' + card.success);
      updateGame();
      checkPair();
      checkWin();
    });
  }
};

const starRating = function() {
  if (totalAttempts < 23) {
    return '⭐⭐⭐⭐⭐';
  }
  if (totalAttempts < 27) {
    return '⭐⭐⭐⭐';
  }
  if (totalAttempts < 31) {
    return '⭐⭐⭐';
  }
  if (totalAttempts < 35) {
    return '⭐⭐';
  }
  if (totalAttempts < 39) {
    return '⭐';
  }
  if (totalAttempts < 43) {
    return '💀';
  }

  else return '💀💀💀';
}

var updateGame = function() {
  totalAttempts++;
  secondTryImpending = !secondTryImpending;

  console.log('#Turns: ' + totalAttempts);
  console.log('Second Try Impending: ' + secondTryImpending);

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

  console.log('Flipped: ' + flipped);
  console.log('Class Numbers: ' + flipped[0].classNumber + ", " + flipped[1].classNumber);

  const timeOut = 3000;
  const flippedOverLeft = flipped[0].classNumber;
  const flippedOverRight = flipped[1].classNumber;
  let successPair = flippedOverRight === flippedOverLeft;
  console.log('Success?: ' + successPair);

  if (successPair) {
    for (flip of flipped) {
      flip.success = true;
    }
  } else {
    for (flip of flipped) {
      flip.flip();
    }

    locked = true;
    setTimeout(function() {
      console.log('No success...');
      console.log('Class Numbers: ' + flipped[0].classNumber + ", " + flipped[1].classNumber);
      let divBoxes = $('.mainGrid div');
      for (divBox of divBoxes) {
        const box = $(divBox);
        if (box.is("." + flippedOverLeft)) {
          console.log('Get rid of class for box ID: ' + box.attr('id'));
          box.toggleClass(flippedOverLeft);
        }
        if (box.is("." + flippedOverRight)) {
          console.log('Get rid of class for box ID: ' + box.attr('id'));
          box.toggleClass(flippedOverRight);
        }
      }
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
