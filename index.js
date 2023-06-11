const canvas = document.getElementById("canvas");
console.log(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

// Global Variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
const bouncers = [];

let bouncerCost = 100; // change later

console.log("kek");

// mouse
const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
};

let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener("mouseleave", function (e) {
  mouse.x = undefined;
  mouse.y = undefined;
});

// Game Board

// Control Bar
const controlsBar = {
  width: canvas.width,
  height: cellSize,
};

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }

  draw() {
    if (mouse.x && mouse.y && collision(this, mouse)) {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  fill() {
    ctx.fillStyle = "blue";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  getXWaypoint() {
    return this.x + cellSize/4
  }

  getYWaypoint() {
    return this.y + cellSize/4
  }
}

const idx = [
  18, 27, 36, 37, 38, 29, 20, 11, 2, 3, 4, 13, 22, 31, 40, 41, 42, 33, 24, 25,
];

const waypoints = [0, 2,4,8,10,14,16,18,19]

// console.log(gameGrid);
const path = [];

// console.log("asdadsasd");
// Collision
function collision(first, second) {
  if (
    first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y
  ) {
    return true; // Collision detected
  }
  return false; // No collision
}

// const idx = [
//   2, 3, 4, 11, 13, 18, 20, 22, 24, 25, 27, 29, 31, 33, 36, 37, 38, 40, 41, 42,
// ];

function createGrid() {
  for (let y = cellSize; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      let cell = new Cell(x, y);
      gameGrid.push(cell);
      let pos = gameGrid.length - 1;
      if (idx.includes(pos)) {
        path[idx.indexOf(pos)] = cell;
      }
    }
  }
}

createGrid();
console.log(gameGrid);
function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
  for (let i = 0; i < path.length; i++) {
    path[i].fill();
  }
}

console.log(path);

// handleGameGrid();
// projectiles
// towers
class Bouncer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
// enemies
let waypointIndex = 1
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    // this.speed = 1;
    // this.pathIndex = 0; // DEFINE PATH ARRAY FIRST
  }
  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.draw();

    const waypoint = path[waypoints[waypointIndex]]
    const yDistance = waypoint.getYWaypoint() - this.y
    const xDistance = waypoint.getXWaypoint() - this.x
    const angle = Math.atan2(yDistance, xDistance)
    this.x += Math.cos(angle)
    this.y += Math.sin(angle)

    if(this.x === waypoint.getXWaypoint() && this.y === waypoint.getYWaypoint()){
      waypointIndex++
    }

  }
}

const enemy = new Enemy(path[0].x + cellSize / 4, path[0].y);

class Base {
  constructor() {
    this.health = 10;
  }
}

// resources
// utilities
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(56,56,56)";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();

  // Add enemy
  enemy.update();
  requestAnimationFrame(animate); // creates animation loop
}

animate();
