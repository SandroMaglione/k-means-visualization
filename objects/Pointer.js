function Pointer(id, x, y, size, color) {
    this.id = id
    this.x = x
    this.y = y
    this.color = color
    this.size = size

    this.nearest = -1
}

Pointer.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - (this.size / 2), this.y - (this.size / 2), this.size, this.size)
}