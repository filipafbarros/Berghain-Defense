class Projectile {
  constructor(x, y, enemy) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.enemy = enemy;
    this.radius = 7.5;
  }

  draw() {
    ctx.beginPath();
    // ctx.rect(this.x, this.y, 10, 10);
    ctx.arc(
      this.x + cellSize / 2,
      this.y + cellSize / 2,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "orange";
    ctx.fill();
    // console.log(estou);
  }

  update() {
    this.draw();

    const angle = Math.atan2(
      this.enemy.y - 25 - this.y,
      this.enemy.x - 25 - this.x // -25 to get the projectiles to move towards the center of the enemy
    );
    // console.log(enemies[0]);

    this.velocity.x = Math.cos(angle) * 4;
    this.velocity.y = Math.sin(angle) * 4;

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
