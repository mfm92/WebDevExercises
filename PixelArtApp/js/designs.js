var submitButton = $("input[type='submit']");
var pixelCanvas = $('#pixel_canvas');
var inputHeight = $('#input_height');
var inputWidth = $('#input_width');

/**
* @description Discards the grid by removing the entire subtree
*   of the pixel canvas in the HTML
*/
var discardGrid = function() {
  pixelCanvas.empty();
}

/**
* @description Creates a grid of arbitrary dimensions
*   Also discards the existing one
* @param {object} evt: The event object
*/
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

/**
* @description Applies the background-color CSS property
*   with the colour of the event object to the cell
*   that the user clicked on.
* @param {object} evt: The event object
*/
var colorTheCell = function(evt) {
  const clickedCell = $(evt.target);
  const colourPicker = $('#colorPicker');
  const selectedColour = colourPicker.val();
  clickedCell.css('background-color', selectedColour);
};

$(function() {
  /* setting the number input fields to 20x20 initially
     makes more sense to me than a default of 1x1 */
  inputWidth.val(20);
  inputHeight.val(20);

  /* apply callbacks */
  submitButton.click(makeGrid);
  pixelCanvas.click('td', colorTheCell);
});
