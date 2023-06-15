class Base {
  constructor() {
    this.x = 800;
    this.y = 200;
    this.width = 100;
    this.height = 300;
    this.health = 1000;
  }
  draw() {
    const berghain = new Image();
    berghain.src = "./imgs/berghainpng.png";
    ctx.drawImage(berghain, this.x, 100, this.width, 500);
  }
}
