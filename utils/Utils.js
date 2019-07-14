const Utils = {
    randomPosition: (canvas, size) => {
        return {
            x: Utils.randNumber(canvas.width - (size * 2)),
            y: Utils.randNumber(canvas.height - (size * 2))
        }
    },

    pointsDistance: (point1, point2) => {
        const xDis = point1.x - point2.x
        const yDis = point1.y - point2.y
        return Math.sqrt(Math.pow(xDis, 2) + Math.pow(yDis, 2))
    },

    randNumber: max => {
        return Math.random() * max
    },

    addAlpha: (color, alpha) => {
        return color.replace(/[^,]+(?=\))/, alpha)
    },

    canvasRatio: (canvas) => {
        return canvas.height / canvas.width
    }
}