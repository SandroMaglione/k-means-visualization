const Generator = {
    variance: 400,

    pointsGenerator: (size, points) => {
        for (let p = 0; p < size; ++p) {
            const pos = Generator.randomGeneration()
            points.push(new Pointer(p, pos.x, pos.y, pointerSize, 'rgba(0, 0, 0, 1)'))
        }
    },

    centerGenerator: (size, centers) => {
        for (let c = 0; c < size; ++c) {
            const color = 'rgba(' + Utils.randNumber(255) + ',' + Utils.randNumber(255) + ',' + Utils.randNumber(255) + ', 1)'
            const pos = Generator.randomGeneration()
            centers.push(new Center(c, pos.x, pos.y, centerSize, color))
        }
    },

    linearGeneration: () => {
        const ratio = Utils.canvasRatio(canvas)
        const xPos = Utils.randNumber(canvas.width - centerSize) + centerSize
        const yPos = ratio * (Utils.randNumber(2) > 1 ? 
                        xPos + Utils.randNumber(Generator.variance) :
                        xPos - Utils.randNumber(Generator.variance))
        return {
            x: Generator.fixPosition(xPos, canvas.width),
            y: Generator.fixPosition(yPos, canvas.height)
        }
    },

    randomGeneration: () => Utils.randomPosition(canvas, centerSize),

    fixPosition: (pos, max) => pos < pointerSize ? pos + Generator.variance : pos > max - pointerSize ? pos - Generator.variance : pos
}