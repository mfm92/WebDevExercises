// Select color input
// Select size input

// When size is submitted by the user, call makeGrid()
var submitButton = $("input[type='submit']");
var pixelCanvas = $('#pixel_canvas');
var inputHeight = $('#input_height');
var inputWidth = $('#input_width');

var makeGrid = function(evt) {
  evt.preventDefault();
  discardGrid();

  const inputHeightVal = inputHeight.val();
  const inputWidthVal = inputWidth.val();

  for (let i = 0; i < inputWidthVal; i++) {
    const tableRowElement = $('<tr/>');
    pixelCanvas.append(tableRowElement);

    for (let j = 0; j < inputHeightVal; j++) {
      const tableCell = $('<td/>');
      tableRowElement.append(tableCell);
    }
  }
};

$(function() {
  submitButton.click(makeGrid);
});
