import '/styles/style.css'

let screenHeight = window.innerHeight;
let screenWidth = window.innerWidth;
const canvas = document.querySelector('#app');
const ctx = canvas.getContext("2d");
// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // <--- Change to 1 on retina screens to see blurry canvas.
canvas.width = screenWidth * scale;
canvas.height = screenHeight * scale;
// Normalize coordinate system to use css pixels.
ctx.scale(scale, scale);

drawSquare();
drawCircle();

function drawCircle() {
  const circleX = 500;
  const circleY = 500;
  const circleRadius = 50;
  const circleBorderColor = 'black';
  const circleFillColor = 'red';

  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
  ctx.fillStyle = circleFillColor;
  ctx.fill();
  ctx.strokeStyle = circleBorderColor;
  ctx.stroke();
}

function drawSquare() {
  const x = 50;
  const y = 100;
  const size = 100;
  const rectColor = '#22223f';
  const rectFaceColor = 'lime';

  ctx.fillStyle = rectColor;
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = rectFaceColor;
  ctx.fillRect(x + (size / 2), y + (size / 8), size / 2, size / 4);
}