var secondTryImpending = false;
var totalAttempts = 0;
var imageOrdering = [];

Array.prototype.shuffle = function() {
  for (var i = 0; i < this.length; i++) {
    const randomIndex = Math.floor(Math.random() * this.length);
    const elementAtIndex = this[randomIndex];

    this[randomIndex] = this[i];
    this[i] = elementAtIndex;
  }
}

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
}

Card.prototype.flip = function() {
  this.flipped = !this.flipped;
}

var setUpImageOrdering = function() {
  for (let i = 1; i <= 8; i++) {
    for (let j = 0; j < 2; j++) {
      imageOrdering.push(new Card(i));
    }
  }

  imageOrdering.shuffle();
};

var setUpEvtListeners = function() {
  let counter = 0;
  let divBoxes = $('.mainGrid div');
  for (divBox of divBoxes) {
    const box = $(divBox);
    box.attr('id', 'field' + counter++);
    box.click(function() {
      const elemId = $(this).attr('id');
      const id = elemId.substring('field'.length, elemId.length);
      let card = imageOrdering[id];
      console.log('Flipped: ' + card.flipped);
      console.log('Success: ' + card.success);

      if (card.flipped || card.success) {
        return;
      }
      console.log('ID: ' + id);
      $(this).toggleClass(card.classNumber);
      card.flip();
      console.log('Flipped after: ' + card.flipped);
      console.log('Success after: ' + card.success);
      updateGame();
    });
  }
}

var updateGame = function() {
  totalAttempts++;
  secondTryImpending = !secondTryImpending;

  console.log('Total Attempts: ' + totalAttempts);
  console.log('Second Try Impending: ' + secondTryImpending);

  if (!secondTryImpending) {
    getFlippedCardsEqual();
  }

  if (checkWin()) {
    alert('yay!');
  }
}

var getFlippedCardsEqual = function() {
  let flipped = [];
  for (imageOrder of imageOrdering) {
    if (imageOrder.flipped && !imageOrder.success) {
      flipped.push(imageOrder);
    }
  }

  console.log('Flipped: ' + flipped);
  console.log('Class Numbers: ' + flipped[0].classNumber + ", " + flipped[1].classNumber);

  let successPair = flipped[0].classNumber === flipped[1].classNumber;
  console.log('Success?: ' + successPair);

  if (successPair) {
    for (flip of flipped) {
      flip.success = true;
    }
  } else {
    for (flip of flipped) {
      flip.flip();
    }

    setTimeout(function() {
      console.log('No success...');
      console.log('Class Numbers: ' + flipped[0].classNumber + ", " + flipped[1].classNumber);
      let divBoxes = $('.mainGrid div');
      for (divBox of divBoxes) {
        const box = $(divBox);
        if (box.is("." + flipped[0].classNumber)) {
          console.log('Get rid of class for box ID: ' + box.attr('id'));
          box.toggleClass(flipped[0].classNumber);
        }
        if (box.is("." + flipped[1].classNumber)) {
          console.log('Get rid of class for box ID: ' + box.attr('id'));
          box.toggleClass(flipped[1].classNumber);
        }
      }
    }, 3000);
  }
}

var checkWin = function() {
  let victory = true;

  for (image of imageOrdering) {
    if (!image.success) {
      victory = false;
    }
  }

  return victory;
}
