class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    ctx.beginPath();
    // ctx.rect(this.x, this.y, 10, 10);
    ctx.arc(this.x + cellSize / 2, this.y + cellSize / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    // console.log(estou);
  }

  update() {
    this.draw();

    const angle = Math.atan2(enemies[0].y - this.y, enemies[0].x - this.x);

    this.velocity.x = Math.cos(angle);
    this.velocity.y = Math.sin(angle);

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
