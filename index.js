const canvas = document.getElementById("canvas");
// console.log(canvas);
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 600;

const imgBackground = new Image();
imgBackground.src = "./imgs/lead_article.jpg";

canvas.addEventListener("click", startGame);

//button config
const buttons = [];
const startButton = new Button(350, 300, 200, 55, "Start Game", startGame);
buttons.push(startButton);

canvas.addEventListener("click", handleButtonClick);

function handleButtonClick(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Check each button for a click
  buttons.forEach((button) => {
    if (button.isClicked(mouseX, mouseY)) {
      button.onClick();
    }
  });
}

///
///
// Audio
const gameAudio = new Audio();
gameAudio.src = "./audios/soundtrack.mp3";

// // Mute Button
// let isMuted = false;
// const muteImage = new Image();
// muteImage.src = "./imgs/icons8-no-audio-50.png";

// const unmuteImage = new Image();
// unmuteImage.src = "./imgs/icons8-sound-50.png";

// function toggleMute() {
//   isMuted = !isMuted;
// }

//
//

// StartScreen
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background
  ctx.fillStyle = "rgba(20, 20, 20, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(imgBackground, 0, 0, canvas.width, canvas.height);

  // Title
  ctx.fillStyle = "#d9809e";
  ctx.font = "72px Rowdies";
  ctx.textAlign = "center";

  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.strokeText("BERGHAIN DEFENSE", canvas.width / 2, 250);

  ctx.fillText("BERGHAIN DEFENSE", canvas.width / 2, 250);

  // Add buttons
  buttons.forEach((button) => {
    button.draw();
  });

  //and instructions
  const instructionsColor = "white";
  const instructionsFont = "18px Rubik";
  const instructionsX = canvas.width / 2;
  const instructionsY = canvas.height / 2 + 100;
  const instructionLines = [
    "Instructions:",
    `You are Sven, and your mission is to keep all the people with the wrong look and wrong vibe`,
    `from entering Berghain, Berlin's most inclusive club. You're Berghain's only hope. `,
    `Build Svens to throw pills at the incoming crowd to keep them from entering and ruining Berghain.`,
  ];

  const rectWidth = 850;
  const rectHeight = instructionLines.length * 30 + 20; // Adjust the height based on line spacing and number of lines
  const rectX = instructionsX - rectWidth / 2;
  const rectY = instructionsY - 20;

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Adjust the color and transparency as needed
  ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

  ctx.fillStyle = instructionsColor;
  ctx.font = instructionsFont;
  for (let i = 0; i < instructionLines.length; i++) {
    const lineY = instructionsY + i * 30;
    ctx.fillText(instructionLines[i], instructionsX, lineY);
  }

  // playIntro();
}
//
//
imgBackground.onload = function () {
  // playIntro();
  drawStartScreen();
};
//////
///
///
///
// Global Variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];
let money = 300;
let score = 0;
let frame = 0;
let chosenBouncer = 1;

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

const imgSven2 = new Image();
imgSven2.src = "./imgs/centered-sven.png";

// mouse
const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
  clicked: false,
};

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

// Base - Berghain
const base = new Base();

function handleBase() {
  return base.draw();
}

/// Bouncers

const bouncers = [];

const bouncer1 = {
  x: 520,
  y: 15,
  width: 70,
  height: 70,
};
//
/// ENEMIES
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

////////////////////////////////////////////////////

function startGame() {
  canvas.removeEventListener("click", startGame);
  canvas.removeEventListener("click", handleButtonClick);

  canvas.addEventListener("mousedown", function () {
    mouse.clicked = true;
  });

  canvas.addEventListener("mouseup", function () {
    mouse.clicked = false;
  });

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

  // console.log("asdadsasd");

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
  //
  //
  // BOUNCERS (defenders)

  // const bouncer2 = {
  //   x: 600,
  //   y: 20,
  //   width: 70,
  //   height: 70,
  // };

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
  let bouncerCost = 100;
  // ADD BOUNCER FUNCTION
  canvas.addEventListener("click", function () {
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
      // const element2 = base;
      // isClashed = element.x === gridPositionX && element.y === gridPositionY;
      if (element.x === gridPositionX && element.y === gridPositionY) {
        return (isClashed = true);
      } else if (
        base.x === gridPositionX &&
        (gridPositionY === 0 ||
          gridPositionY === 100 ||
          gridPositionY === 200 ||
          gridPositionY === 300 ||
          gridPositionY === 400 ||
          gridPositionY === 500)
      ) {
        return (isClashed = true);
      } else if (gridPositionY === 0) {
        return (isClashed = true);
      } else isClashed = false;
    }

    // Check if click is in top bar or last row
    // for (let j = 0; j < gameGrid.length; j++) {
    //   const element = gameGrid[i];
    // }
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
    // console.log(enemies.health);
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
      enemyCount += 5;
      spawnEnemies(enemyCount);
      wave++;
      bouncerCost += 50;
      enemies.forEach((enemy) => {
        enemy.health += 20;
        enemy.increase += 20;
      });
    }
  }

  // Top Bar Management
  function handleGameStatus() {
    // Money
    ctx.fillStyle = "gold";
    ctx.font = "20px Rubik";
    ctx.fillText("Money: " + money, 415, 55);

    // Base Health
    ctx.fillStyle = "gold";
    ctx.font = "20px Rubik";
    ctx.fillText("Coolness Level: " + health, 720, 55);

    // Wave counter
    ctx.fillStyle = "gold";
    ctx.font = "20px Rubik";
    ctx.fillText("Wave: " + wave, 170, 55);

    // Score
    ctx.fillStyle = "gold";
    ctx.font = "20px Rubik";
    ctx.fillText("Score: " + score, 280, 55);
  }

  // add bergain logo
  const logo = new Image();
  logo.src = "./imgs/berghain-logo.png";

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(56,56,56)";
    ctx.fillRect(0, 0, canvas.width, controlsBar.height);
    ctx.drawImage(logo, 30, 20, 70, 70);
    handleGameStatus();
    handleGameGrid();
    handleBouncers();
    gameAudio.play();
    handleBase();
    chooseBouncer();
    handleEnemies();
    frame++;

    const animationId = requestAnimationFrame(animate); // creates animation loop

    if (health === 0) {
      cancelAnimationFrame(animationId);
      document.querySelector("#game-over").style.display = "flex";
      gameAudio.pause();
    }
    if (wave === 6) {
      cancelAnimationFrame(animationId);
      document.querySelector(".win").style.display = "flex";
      gameAudio.pause();
    }
  }
  // console.log(path);

  animate();
}
