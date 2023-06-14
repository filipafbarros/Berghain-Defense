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
let score = 0;
let frame = 0;
let chosenBouncer = 1;

// mouse
const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
  clicked: false,
};
canvas.addEventListener("mousedown", function () {
  mouse.clicked = true;
});

canvas.addEventListener("mouseup", function () {
  mouse.clicked = false;
});

// Images

const imgHorizontal = new Image();
imgHorizontal.src = "./imgs/horizontal.png";

const imgVertical = new Image();
imgVertical.src = "./imgs/vertical.png";

const imgSide1 = new Image();
imgSide1.src = "./imgs/side1.png";

const imgSide2 = new Image();
imgSide2.src = "./imgs/side2.png";

const imgSide3 = new Image();
imgSide3.src = "./imgs/side3.png";

const imgSide4 = new Image();
imgSide4.src = "./imgs/side4.png";

const backgroundImg = new Image();
backgroundImg.src = "./imgs/pixil-frame-0 (7).png";

// const imgHorizontal =

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
    gameGrid[i].fill(backgroundImg);
    for (let i = 0; i < path.length; i++) {
      if (i === 0 || i === 10) {
        path[i].fill(imgSide3);
      } else if (i === 2 || i === 14) {
        path[i].fill(imgSide2);
      } else if (i === 8 || i === 18) {
        path[i].fill(imgSide1);
      } else if ((i === 4) | (i === 16)) {
        path[i].fill(imgSide4);
      } else if (i === 3 || i === 9 || i === 15 || i === 19) {
        path[i].fill(imgHorizontal);
      } else {
        path[i].fill(imgVertical);
      }
    }
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

const bouncer1 = {
  x: 500,
  y: 20,
  width: 70,
  height: 70,
};

const bouncer2 = {
  x: 600,
  y: 20,
  width: 70,
  height: 70,
};

const imgSven2 = new Image();
imgSven2.src = "./imgs/sven.png";

function chooseBouncer() {
  let bouncer1Stroke = "black";
  if (collision(mouse, bouncer1) && mouse.clicked === true) {
    chosenBouncer = 1;
  }

  if (chosenBouncer === 1) {
    bouncer1Stroke = "gold";
  } else {
    bouncer1Stroke = "black";
  }

  ctx.lineWidth = 1;
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(bouncer1.x, bouncer1.y, bouncer1.width, bouncer1.height);
  ctx.strokeStyle = bouncer1Stroke;
  ctx.strokeRect(bouncer1.x, bouncer1.y, bouncer1.width, bouncer1.height);
  ctx.drawImage(
    imgSven2,
    bouncer1.x,
    bouncer1.y,
    bouncer1.width,
    bouncer1.height
  );
  // ctx.fillRect(bouncer2.x, bouncer2.y, bouncer2.width, bouncer2.height);
}

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
          money += 20;
          score += 50;
        }

        // console.log(projectile.enemy.health);
        bouncer.projectiles.splice(i, 1);
      }
    }
  });
}
///////////// enemies ///////////////
//
//
//
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = "./enemies/enemy1.png";
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = "./enemies/enemy2.png";
enemyTypes.push(enemy2);

const enemy3 = new Image();
enemy3.src = "./enemies/enemy3.png";
enemyTypes.push(enemy3);

const enemy4 = new Image();
enemy4.src = "./enemies/enemy4.png";
enemyTypes.push(enemy4);
//
const enemies = [];
let enemyCount = 5;
let wave = 1;

function spawnEnemies(spawnCount) {
  let offset = 100;
  for (let i = 1; i < spawnCount; i++) {
    // setInterval(
    enemies.push(
      new Enemy(path[0].getXWaypoint() - offset * i, path[0].getYWaypoint())
    );
    // 1000
    // );
  }
}
spawnEnemies(enemyCount);

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

    if (health === 0) {
      console.log("game over");
    }
  });

  // tracking total amount of enemies
  if (enemies.length === 0) {
    enemyCount += 4;
    spawnEnemies(enemyCount);
    wave++;
  }
}

// resources
function handleGameStatus() {
  // Money
  ctx.fillStyle = "gold";
  ctx.font = "15px Petch";
  ctx.fillText("Money: " + money, 30, 55);

  // Base Health
  ctx.fillStyle = "gold";
  ctx.font = "15px Petch";
  ctx.fillText("Coolness Level: " + health, 720, 55);

  // Wave counter
  ctx.fillStyle = "gold";
  ctx.font = "15px Petch";
  ctx.fillText("Wave: " + wave, 170, 55);

  // Score
  ctx.fillStyle = "gold";
  ctx.font = "15px Petch";
  ctx.fillText("Score: " + score, 300, 55);
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
  chooseBouncer();
  handleEnemies();

  frame++;

  const animationId = requestAnimationFrame(animate); // creates animation loop

  if (health === 0) {
    cancelAnimationFrame(animationId);
    document.querySelector("#game-over").style.display = "flex";
  }
}
// console.log(path);

animate();
