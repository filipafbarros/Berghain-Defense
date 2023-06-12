const canvas = document.getElementById("canvas");
// console.log(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

// Global Variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
let money = 300;

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

// WAYPOINTS FOR MOVEMENT
const pathIndexes = [
  18, 27, 36, 37, 38, 29, 20, 11, 2, 3, 4, 13, 22, 31, 40, 41, 42, 33, 24, 25,
];

const waypoints = [0, 2, 4, 8, 10, 14, 16, 18, 19];

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

function createGrid() {
  for (let y = cellSize; y < canvas.height; y += cellSize) {
    for (let x = 0; x < canvas.width; x += cellSize) {
      let cell = new Cell(x, y);
      gameGrid.push(cell);
      let gameGridIndex = gameGrid.length - 1;
      if (pathIndexes.includes(gameGridIndex)) {
        path[pathIndexes.indexOf(gameGridIndex)] = cell;
      }
    }
  }
}

createGrid();
// console.log(gameGrid);
function handleGameGrid() {
  for (let i = 0; i < gameGrid.length; i++) {
    gameGrid[i].draw();
  }
  for (let i = 0; i < path.length; i++) {
    path[i].fill();
  }
}

// console.log(path);

// projectiles
// BOUNCERS (defenders)
const bouncers = [];
// ADD BOUNCER FUNCTION
canvas.addEventListener("click", function () {
  let bouncerCost = 100;

  const gridPositionX = mouse.x - (mouse.x % cellSize);
  const gridPositionY = mouse.y - (mouse.y % cellSize);
  let isClashed;

  // not allowing to place multiple bouncers in the same place
  for (let i = 0; i < bouncers.length; i++) {
    if (bouncers[i].x === gridPositionX && bouncers[i].y === gridPositionY) {
      return;
    }
  }

  // Check if click is in the path
  for (let i = 0; i < path.length; i++) {
    const element = path[i];
    isClashed = element.x === gridPositionX && element.y === gridPositionY;
    if (isClashed) {
      return true;
    }
  }
  if (isClashed === false && money >= bouncerCost) {
    bouncers.push(new Bouncer(gridPositionX, gridPositionY));
    money -= bouncerCost;
  }
});
function handleBouncers() {
  bouncers.forEach((bouncer) => {
    bouncer.draw();
    // console.log(bouncers);
    bouncer.projectiles.forEach((projectile) => {
      projectile.update();
    });
  });

  // for (let i = 0; i < bouncers.length; i++) {
  //   bouncers[i].draw();

  //     for (let j = 0; j < bouncers.projectiles.length; j++) {

  //     }
  //   // bouncers.projectiles.forEach((projectile) => {
  //   //   projectile.draw();
  //   // });
  // }
}

///////////// enemies ///////////////

const enemies = [];

let offset = 100;
for (let i = 1; i < 10; i++) {
  // setInterval(
  enemies.push(
    new Enemy(path[0].getXWaypoint() - offset * i, path[0].getYWaypoint())
  );
  // 1000
  // );
}
// const enemy = new Enemy(path[0].x + cellSize / 4, path[0].y);

class Base {
  constructor() {
    this.health = 10;
  }
}

// resources
function handleGameStatus() {
  ctx.fillStyle = "gold";
  ctx.font = "20px Arial";
  ctx.fillText("Money: " + money, 20, 55);
}

// utilities

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(56,56,56)";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleBouncers();
  handleGameStatus();

  // Add enemy
  enemies.forEach((enemy) => enemy.update());
  // enemy.update();
  requestAnimationFrame(animate); // creates animation loop
}

animate();
