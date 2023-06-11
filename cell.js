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
      ctx.fillStyle = "blue";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  
    getXWaypoint() {
      return this.x + cellSize / 4;
    }
  
    getYWaypoint() {
      return this.y + cellSize / 4;
    }
  }
  