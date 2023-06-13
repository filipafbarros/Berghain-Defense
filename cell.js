class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = cellSize;
    this.height = cellSize;
  }

  draw() {
    if (mouse.x && mouse.y && collision(this, mouse)) {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }

  fill() {
    // add img
    const img = new Image();
    img.src = "./imgs/horizontal.png";

    ctx.drawImage(img, this.x, this.y, this.width, this.height);
    //   ctx.fillStyle = "yellow";
    //   ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  getXWaypoint() {
    return this.x + cellSize / 4;
  }

  getYWaypoint() {
    return this.y + cellSize / 4;
  }
}
