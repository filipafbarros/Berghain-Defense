class Base {
  constructor() {
    this.x = 800;
    this.y = 200;
    this.width = 100;
    this.height = 300;
    this.health = 900;
  }
  draw() {
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
