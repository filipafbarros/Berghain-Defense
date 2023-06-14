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
    this.image = new Image();
    this.image.src = "./imgs/newpill.png";
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y);
    // ctx.beginPath();
    // ctx.arc();
  }

  update() {
    this.draw();

    const angle = Math.atan2(
      this.enemy.y - 25 - this.y,
      this.enemy.x - 25 - this.x // -25 to get the projectiles to move towards the center of the enemy
    );
    // console.log(enemies[0]);

    this.velocity.x = Math.cos(angle) * 5;
    this.velocity.y = Math.sin(angle) * 5;

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
