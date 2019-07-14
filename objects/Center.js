function Center(id, x, y, size, color) {
    this.id = id
    this.x = x
    this.y = y
    this.color = color
    this.size = size

    this.sumDisX = 0
    this.sumDisY = 0
    this.numberOfPoints = 0

    this.trajectory = []
    this.areas = []
}

Center.prototype.draw = function(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI, false)
    ctx.fillStyle = this.color
    ctx.fill()
}

Center.prototype.drawTrajectory = function(ctx) {
    this.trajectory.forEach(center => {
        ctx.beginPath()
        ctx.arc(center.x + (this.size / 2), center.y + (this.size / 2), this.size / 2, 0, 2 * Math.PI, false)
        ctx.fillStyle = Utils.addAlpha(this.color, '0.6')
        ctx.fill()
    })
}