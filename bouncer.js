class Bouncer {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
    this.shooting = false;
    this.health = 100;
    this.projectiles = [];
    this.radius = 150;
    this.target;
    this.frames = 0;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.beginPath();
    ctx.arc(this.x + 50, this.y + 50, this.radius, 0, Math.PI * 2); // spawning in the middle
    ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
    ctx.fill();
  }

  update() {
    this.draw();
    if (this.frames % 100 === 0 && this.target) {
      this.projectiles.push(new Projectile(this.x, this.y, this.target));
    }
    this.frames++;
  }
}
