var numbers = [];
var secondTryImpending = false;

$(function() {
  let counter = 0;
  generateRandomNumbers();

  secondTryImpending ^= secondTryImpending;

  for (element of $('.mainGrid div')) {
    $(element).text(numbers[counter++]);
  }

  $('.mainGrid', 'div').click(function(evt) {
    if ($(evt.target).is('div')) {
      $(evt.target).css('background-color', 'white');
      $(evt.target).toggleClass('card4');
    }
  });
});

var generateRandomNumbers = function(){
  for (let i = 0; i < 16; i++) {
    numbers.push(Math.random());
  }
};
