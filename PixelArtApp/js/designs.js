var submitButton = $("input[type='submit']");
var pixelCanvas = $('#pixel_canvas');
var inputHeight = $('#input_height');
var inputWidth = $('#input_width');

var makeGrid = function(evt) {
  evt.preventDefault();

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

var colorTheCell = function(evt) {
  const clickedCell = $(evt.target);
  const colourPicker = $('#colorPicker');
  const selectedColour = colourPicker.val();
  clickedCell.css('background-color', selectedColour);
};

$(function() {
  inputWidth.val(20);
  inputHeight.val(20);
  submitButton.click(makeGrid);
  pixelCanvas.click('td', colorTheCell);
});
