class Button {
  constructor(x, y, width, height, text, onClick) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.text = text;
    this.onClick = onClick;
  }

  draw() {
    const buttonColor = "#333131";
    const textColor = "white";
    const buttonPadding = 10;
    const strokeWidth = 2;
    const strokeColor = "#262525";

    ctx.fillStyle = buttonColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = textColor;
    ctx.font = "22px Rubik";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.text,
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width - buttonPadding * 2
    );
  }

  isClicked(x, y) {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    );
  }
}
