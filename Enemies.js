// enemies
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.waypointIndex = 0;
    this.radius = 25;
    this.damage = 100;
    this.health = 100;
    this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    this.frameX = 0;
    this.frameY = 0;
    this.minFrame = 0;
    this.maxFrame = 5;
    this.spriteWidth = 288 / 6;
    this.spriteHeight = 48;

    // this.speed = 1;
    // this.pathIndex = 0; // DEFINE PATH ARRAY FIRST
  }
  draw() {
    // ctx.fillStyle = "red";
    // // ctx.fillRect(this.x, this.y, this.width, this.height);
    // ctx.beginPath();
    // ctx.arc(this.x + 25, this.y + 25, this.radius, 0, Math.PI * 2);
    // ctx.fill();

    // health bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 10, this.width, 5);

    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 10, this.width * (this.health / 100), 5);

    ctx.drawImage(
      this.enemyType,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.draw();
    if (frame % 10 === 0) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = this.minFrame;
    }

    const waypoint = path[waypoints[this.waypointIndex]];
    const yDistance = waypoint.getYWaypoint() - this.y;
    const xDistance = waypoint.getXWaypoint() - this.x;
    const angle = Math.atan2(yDistance, xDistance);
    this.x += Math.cos(angle);
    this.y += Math.sin(angle);

    if (
      this.x === waypoint.getXWaypoint() &&
      this.y === waypoint.getYWaypoint()
    ) {
      this.waypointIndex++;
    }
  }
}
