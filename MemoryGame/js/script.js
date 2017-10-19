var secondTryImpending = false;

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

});

var Card = function(nr) {
  this.classNumber = 'card' + nr;
};

Card.prototype.alert = function() {
  alert(this.classNumber);
}

var setUpImageOrdering = function() {
  let imageOrdering = [];
  for (let i = 1; i <= 8; i++) {
    for (let j = 0; j < 2; j++) {
      imageOrdering.push(new Card(i));
    }
  }

  imageOrdering.shuffle();

  let counter = 0;
  for (element of $('.mainGrid div')) {
    const elem = $(element);
    elem.attr('id', 'field' + counter++);
    elem.click(function() {
      const elemId = $(this).attr('id');
      const id = elemId.substring('field'.length, elemId.length);
      $(this).toggleClass(imageOrdering[id].classNumber);
    });
  }
};
