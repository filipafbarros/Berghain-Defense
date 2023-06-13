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
  26,
];

const waypoints = [0, 2, 4, 8, 10, 14, 16, 18, 20];

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

// GRID

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

////
///
// console.log(path);

//
// Base - Berghain
const base = new Base();

function handleBase() {
  // base.push(new Base());
  return base.draw();
}

//
//
//
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
    bouncer.update();
    bouncer.target = null;

    const validEnemies = enemies.filter((enemy) => {
      const xDistance = enemy.x - bouncer.x; // adjust to be in center
      const yDistance = enemy.y - bouncer.y;
      const distance = Math.hypot(xDistance, yDistance);
      return distance < enemy.radius + bouncer.radius;
    });

    bouncer.target = validEnemies[0];

    for (let i = bouncer.projectiles.length - 1; i >= 0; i--) {
      const projectile = bouncer.projectiles[i];

      projectile.update();

      const xDistance = projectile.enemy.x - projectile.x; // adjust to be in center
      const yDistance = projectile.enemy.y - projectile.y;
      const distance = Math.hypot(xDistance, yDistance);

      // when projectile hits enemy
      if (distance < projectile.enemy.radius + projectile.radius) {
        projectile.enemy.health -= 20;
        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });
          if (enemyIndex > -1) enemies.splice(enemyIndex, 1); // avoid bugs with removal from array
        }
        console.log(projectile.enemy.health);
        bouncer.projectiles.splice(i, 1);
      }
    }
  });
}
///////////// enemies ///////////////
//
//
//
//
const enemies = [];

function spawnEnemies() {
  let offset = 100;
  for (let i = 1; i < 10; i++) {
    // setInterval(
    enemies.push(
      new Enemy(path[0].getXWaypoint() - offset * i, path[0].getYWaypoint())
    );
    // 1000
    // );
  }
}
spawnEnemies();

let health = base.health;

function handleEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    enemy.update();
  }

  enemies.forEach((enemy) => {
    if (enemy.x + enemy.radius === base.x) {
      health -= enemy.damage;
      enemies.splice(0, 1);
    }
  });
}

// resources
function handleGameStatus() {
  // Money
  ctx.fillStyle = "gold";
  ctx.font = "15px Arial";
  ctx.fillText("Money: " + money, 20, 55);

  // Base Health
  ctx.fillStyle = "gold";
  ctx.font = "15px Arial";
  ctx.fillText("Coolness Level: " + health, 720, 55);
}

// utilities

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(56,56,56)";
  ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
  handleGameGrid();
  handleBouncers();
  handleGameStatus();
  handleBase();
  handleEnemies();

  // Add base

  // Add enemy
  // for (let i = enemies.length - 1; i >= 0; i--) {
  //   const enemy = enemies[i];
  //   enemy.update();
  // }

  // enemy.update();
  requestAnimationFrame(animate); // creates animation loop
}
console.log(path);

animate();
