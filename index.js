// Canvas Variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

// Global Variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];

// Game Board

// Control Bar
const controlsBar = {
  width: canvas.width,
  height: cellSize,
};

// projectiles
// towers
// enemies
// resources
// utilities
function animate() {
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  requestAnimationFrame(animate); // creates animation loop
}

animate();
