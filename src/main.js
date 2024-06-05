import '/styles/style.css';

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
const scale = window.devicePixelRatio;
const primaryColor = '#22223f';
const secondaryColor = '#37946e';

const canvas = document.querySelector('canvas#app');
canvas.width = screenWidth * scale;
canvas.height = screenHeight * scale;
const ctx = canvas.getContext("2d");
ctx.scale(scale, scale);

drawPlayer(50, 100, 100, 100, primaryColor, '#fff');
drawSquare(canvas.width * .7, canvas.height * .4, 150, 150, secondaryColor);
drawPlayer(canvas.width * .4, canvas.height * .8, 50, 50, '#fff', '#000', -1);
drawCircle(500, 500, 50, 'maroon');
drawLogo(500, 50, "/assets/favicon.svg");

drawBoundaries();
doSomeVirtualCanvasLayering();

function doSomeVirtualCanvasLayering() {
  // virtual canvas for layer
  const virtualCanvas = document.createElement("canvas");
  virtualCanvas.width = screenWidth * scale;
  virtualCanvas.height = screenHeight * scale;
  const virtualCtx = virtualCanvas.getContext("2d");
  drawText(screenWidth / 2, screenHeight / 2, `This text is drawn on a virtual canvas for layering.`, null, null, primaryColor, virtualCtx);
  drawVirtualCanvasOnAnotherCanvas(virtualCanvas, 0, 0, canvas.width, canvas.height);
}

function drawBoundaries() {
  const labelRectHeight = 50;
  const labelRectWidth = 200;
  drawSquare(0, 0, labelRectWidth, labelRectHeight, 'white');
  drawSquare(screenWidth - labelRectWidth, 0, labelRectWidth, labelRectHeight, 'pink');
  drawSquare(0, screenHeight - labelRectHeight, labelRectWidth, labelRectHeight, 'lime');
  drawSquare(screenWidth - labelRectWidth, screenHeight - labelRectHeight, labelRectWidth, labelRectHeight, 'yellow');
  drawText(0, 0, `Corner 1: {0,0}`, null, null, primaryColor);
  drawText(screenWidth - 175, 0, `Corner 2: {${canvas.width}, 0}`, null, null, primaryColor);
  drawText(0, screenHeight - 25, `Corner 3: {0,${canvas.height}}`, null, null, primaryColor);
  drawText(screenWidth - 175, screenHeight - 25, `Corner 3: {${canvas.width},${canvas.height}}`, null, null, primaryColor);
}

function drawLogo(x, y, src) {
  var myImg = new Image();
  myImg.onload = function () {
    ctx.drawImage(myImg, x, y);
  };
  myImg.src = src;
}

function drawVirtualCanvasOnAnotherCanvas(virtualCanvas, x, y, width, height, context) {
  if (!context) context = ctx;
  context.drawImage(virtualCanvas, 0, 0, virtualCanvas.width, virtualCanvas.height, x, y, width, height);
}

function drawText(x, y, text, fontSize, fontFamily, color, context) {
  if (!fontSize) fontSize = '14';
  if (!fontFamily) fontFamily = 'monospace';
  if (!text) text = 'hell wrld';
  if (!color) color = '#fff';
  if (!context) context = ctx;

  context.fillStyle = color;
  context.font = `${fontSize}px ${fontFamily}`;
  context.fillText(text, x, y + +fontSize);
}

function drawCircle(x, y, radius, color, context) {
  if (!context) context = ctx;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSquare(x, y, width, height, color, context) {
  if (!context) context = ctx;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawPlayer(x, y, width, height, color, faceColor, direction, context) {
  if (!context) context = ctx;
  if (!direction) direction = 1;

  drawSquare(x, y, width, height, color);
  ctx.fillStyle = faceColor;
  ctx.fillRect(direction === 1 ? x + (width / 2) : x, y + (height / 8), width / 2, height / 4);
}