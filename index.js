const canvas = document.getElementById("k-means")
const ctx = canvas.getContext('2d')
const settings = document.getElementById("settings")
const results = document.getElementById("results")
const start = document.getElementById("start")
let inputPointers = document.getElementById("pointers")
let inputCenters = document.getElementById("centers")
let inputCycles = document.getElementById("cycles")
let inputAnimationSpeed = document.getElementById("animationSpeed")
canvas.width = window.innerWidth - (window.innerWidth / 50)
canvas.height = window.innerHeight - (window.innerWidth / 50)
ctx.shadowOffsetX = 0          
ctx.shadowOffsetY = 0       
ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
ctx.shadowBlur = 0

// Parameters
const pointerSize = 6
const centerSize = 16
let animationSpeed = 100
let numberOfPointers = 50
let numberOfCenters = 3
let numberOfCycles = 10

inputPointers.value = numberOfPointers
inputCenters.value = numberOfCenters
inputCycles.value = numberOfCycles
inputAnimationSpeed.value = animationSpeed

let points = []
let centers = []
let areas = []
let interval = null
let stats = []

init()

start.addEventListener('click', () => {
    settings.style.display = "none"
    results.style.display = "block"
    interval = setInterval(() => {
        clear()
        draw()
    }, animationSpeed)
}, true)

inputPointers.addEventListener('change', (e) => {
    numberOfPointers = e.target.value
    init()
})
inputCenters.addEventListener('change', (e) => {
    numberOfCenters = e.target.value
    init()
})
inputCycles.addEventListener('change', (e) => {
    numberOfCycles = e.target.value
})
inputAnimationSpeed.addEventListener('change', (e) => {
    animationSpeed = e.target.value
})

function init() {
    points = []
    centers = []
    interval = null
    Generator.pointsGenerator(numberOfPointers, points)
    Generator.centerGenerator(numberOfCenters, centers)
    clear()
    draw()
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function draw() {
    findNearest()
    drawDistance()
    points.forEach(point => point.draw(ctx))
    centers.forEach(center => {
        center.drawTrajectory(ctx)
        center.draw(ctx)
    })
    //voronoi()
    totalStats()
    if (setNewCenter()) {
        clearInterval(interval)
        endStats()
        if (--numberOfCycles !== 0) { 
            setTimeout(() => {
                init()
                start.click()
            }, 300)
        } else {
            totalStats()
        }
    }
}

function findNearest() {
    points.forEach(point => {
        //drawText(point)
        let nearest = -1
        let minDis = Infinity
        
        centers.forEach(center => {
            //drawText(center)
            const distance = Utils.pointsDistance(point, center)
        
            if (distance < minDis) {
                nearest = center.id
                minDis = distance
            }
        })

        point.nearest = nearest
        point.color = Utils.addAlpha(centers[nearest].color, 0.35)
    })
}

function setNewCenter() {
    let ended = true

    points.forEach(point => {
        let center = centers[point.nearest]
        center.sumDisX += point.x
        center.sumDisY += point.y
        center.numberOfPoints += 1

        point.nearest = -1
    })

    centers.forEach(center => {
        if (center.numberOfPoints !== 0) {
            let newCenter = {
                x: center.sumDisX / center.numberOfPoints,
                y: center.sumDisY / center.numberOfPoints
            }

            if (!(newCenter.x === center.x && center.y === newCenter.y)) {
                center.trajectory.push({ x: center.x, y: center.y })
                center.x = newCenter.x
                center.y = newCenter.y
                ended = false
            }
        }

        center.numberOfPoints = 0
        center.sumDisX = 0
        center.sumDisY = 0
    })

    return ended
}

function endStats() {
    stats.push([])
    centers.forEach((center, idx) => {
        stats[stats.length - 1].push({
            "center": idx, 
            "distance": center.trajectory.length !== 0 ? Utils.pointsDistance(center.trajectory[0], center.trajectory[center.trajectory.length - 1]) : 0,
            "steps": center.trajectory.length
        })
    })
}

function totalStats() {
    let totalDistance = 0
    let totalSteps = 0
    stats.forEach(cycle => {
        cycle.forEach(session => {
            totalDistance += session.distance
            totalSteps += session.steps
        })
    })

    document.getElementById("totDis").textContent = Math.floor(totalDistance)
    document.getElementById("totDisVar").textContent = Math.floor(totalDistance / (stats.length * numberOfCenters))
    document.getElementById("totStp").textContent = totalSteps
    document.getElementById("totDisStp").textContent = Math.floor(totalDistance / totalSteps)
    if (numberOfCycles === 0) {
        document.getElementById("curCycle").style.display = "none"
        Output.download(JSON.stringify(stats), 'kmeans-' + numberOfPointers + 'p-' + numberOfCenters + 'c')
    } else {
        document.getElementById("curCycle").textContent = numberOfCycles
    }
}

function drawDistance() {
    points.forEach(point => drawLineDistance(centers[point.nearest], point))
}

function drawLineDistance(center, point) {
    ctx.strokeStyle = Utils.addAlpha(center.color, 0.15)
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    ctx.lineTo(center.x, center.y)
    ctx.stroke()
}

function drawText(point) {
    ctx.font = "9px Verdana"
    ctx.fillStyle = "rgba(0, 0, 0, 1)"
    ctx.textBaseline = "bottom"
    ctx.textAlign = "center"

    ctx.fillText(point.id, point.x + (point.size / 2), point.y + point.size)
}

function voronoi() {
    centers.forEach((center, idx1) => {
        centers.forEach((otherCenter, idx2) => {
            if (idx1 < idx2) {
                const pos = getMidPoint(otherCenter, center)
                const m = getM(otherCenter, center)
                const pp = equationFactory(m, pos)
                const q = getQ(pp[0], pp[1])

                center.areas.push({ m: m, q: q, p1: pp[0], p2: pp[1], above: isAboveLine(center, m, q) })
                otherCenter.areas.push({ m: m, q: q, p1: pp[0], p2: pp[1], above: isAboveLine(otherCenter, m, q) })

                ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
                ctx.beginPath()
                ctx.moveTo(pp[0].x, pp[0].y)
                ctx.lineTo(pp[1].x, pp[1].y)
                ctx.stroke()
                ctx.closePath()
            }
        })
    })
    
    centers.forEach(center => {
        center.areas.forEach((area, idx1) => {
            console.log(area)
            center.areas.forEach((otherArea, idx2) => {
                if (idx1 < idx2) {
                    let inter = intersection(area.m, area.q, otherArea.m, otherArea.q)
                    let cc = new Pointer(0, inter.x, inter.y, centerSize / 3, 'rgba(255, 255, 0, 1)')
                    cc.draw(ctx)
        
                    const start = {
                        x: inter.x > center.x ? 0 : canvas.width,
                        y: inter.y > center.y ? 0 : canvas.height
                    }
                    const end = {
                        x: start.x,
                        y: start.y === 0 ? canvas.height : 0
                    }
                }
            })
        })
    })
}

function getM(p1, p2) {
    return - 1 / ((p1.y - p2.y) / (p1.x - p2.x))
} 

function getMidPoint(p1, p2) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
    }
}

/*
y = mx + q
m okay
p1 okay

p1.y = m * p1.x + q
p2.y = m * X + q

p1.y = m * p1.x + p2.y - m * X
X = (- p1.y + m * p1.x + p2.y) / m
*/
function equationFactory(m, p) {
    return [
        {
            x: (m * p.x - p.y) / m,
            y: 0
        },
        {
            x: (-p.y + (m * p.x) + canvas.height) / m,
            y: canvas.height
        }
    ]
}

/*
y1 = m * x1 + q
y2 = m * x2 + q

m = (y1 - q) / x1

y2 = (x2 * (y1 - q)) / x1 + q
y2 * x1 = x2 * y1 - x2 * q + x1 * q
q = (y2 * x1 - x2 * y1) / (x1 - x2)
*/

function getQ(p1, p2) {
    return ((p2.y * p1.x) - (p2.x * p1.y)) / (p1.x - p2.x)
}

/*
y1 = m1 * x1 + q1
y2 = m2 * x2 + q2
m1, m2, q1, q2 okay

y1 = y2
x1 = x2

m1 * x + q1 = m2 * x + q2
x = (q2 - q1) / (m1 - m2)
y = m1 * x + q1
*/

function intersection(m1, q1, m2, q2) {
    let x = (q2 - q1) / (m1 - m2)
    return {
        x: x,
        y: m1 * x + q1
    }
}

function isAboveLine(p, m, q) {
    return p.y > m * p.x + q
}
