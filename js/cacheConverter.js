/*const $cacheCanvas = $("body").append($('<canvas id="cache-canvas" style="display: none;" />'));
const cacheContext = $cacheCanvas.getContext('2d');

function cacheImage() {
    var image = new Image();
    image.src = $(this).attr('src');

    $cacheCanvas[0].width = image.width;
    $cacheCanvas[0].height = image.height;

    image.onload = function() {
      cacheContext.drawImage(base_image, 0, 0);
    }

    const imageCode = canvas.toDataURL();

    $(this).attr('src', imageCode)
}

$('img').on('load', cacheImage);*/

const $cacheCanvasHTML = $('<canvas id="cache-canvas" style="display: none;" />');

$("body").append($cacheCanvasHTML);

const $cacheCanvas = $('#cache-canvas')

const cacheContext = $cacheCanvas.get(0).getContext('2d');

let base_image = null;

function cacheImage() {
  var image = new Image();
  image.src = $(this).attr('src');

  $cacheCanvas[0].width = image.width;
  $cacheCanvas[0].height = image.height;

  image.onload = function() {
    cacheContext.drawImage(image, 0, 0);

    const imageCode = $cacheCanvas.get(0).toDataURL();
    image.src = imageCode;
  };
}

$('img').each(cacheImage);

document.addEventListener('DOMContentLoaded', function() {
  $('img').each(cacheImage);
});