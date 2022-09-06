let ball
let bars = []
let edge = {}

let startBtn, resetBtn

let score = {points: 0.0, highScore: 0.0}
let restarts = 0
let edgeLength = 20

let cvsFactor = 0.95

function setup() {
  // put setup code here.
  frameRate(60)
  createCanvas(window.innerWidth*cvsFactor, window.innerHeight*cvsFactor)
  matter.init(true)

  startBtn = createButton('start')
  startBtn.position(10, 10)
  startBtn.mousePressed(start)

  resetBtn = createButton('reset')
  resetBtn.position(60, 10)
  resetBtn.mousePressed(reset)

}

function draw() {
  background(200)
  
  
  fill(0)
  text(`score: ${Math.floor(score.points)}`, width-200, 20)
  text(`Highscore: ${Math.floor(score.highScore)}`, width-200, 40)
  
  noStroke()
  fill(127)
  bars.forEach(bar => {
    bar.show()
  })

  if (ball){
    fill(0)
    ball.show()
    getPoints()

    if(ball.getPositionY() > height){
      matter.forget(ball)
      ball = null
    }
  }
  matter.manualTick()
}

function makeBar(x, y){
  let p = createVector(x, y)
  if (edge.pos) {
    // distance between new point and old should be 20px min (or so)
    let d = edge.pos.dist(p)
    if(abs(d) > edgeLength){
      // if so, calculate midpoint, lenght and angle
      let midX = (edge.pos.x + p.x)/2
      let midY = (edge.pos.y + p.y)/2

      let lng = abs(d)

      let theta = atan2(edge.pos.y - p.y, edge.pos.x - p.x)

      // add a bar with these params to bars
      bars.push(matter.makeBarrier(midX, midY, lng, 5, { angle: theta, friction: 0, frictionAir: 0 }))

      edge.pos = p.copy()
    }

  }
  else{
    edge.pos = p.copy()
  }
}

//add handlers for mouse and touch events
function touchMoved(){
  makeBar(mouseX, mouseY)
}

function touchEnded(){
  edge = {}
}

// add gameplay buttons
function start(){
  if(restarts > 0){
    matter.forget(ball)
  }
  ball = matter.makeBall(40, 0, 20, {friction: 0, frictionAir: 0})
  score.points = 0.0
  score.lastPos = null
  restarts ++
}

function reset(){
  bars.forEach(bar => {
    matter.forget(bar)
  })
  matter.forget(ball)

  ball = null
  bars = []
  edge = {}
  score.points = 0.0
  score.lastPos = null
}


// highscore functionality
function getPoints(){
  let ballPos = createVector(ball.getPositionX(), ball.getPositionY())

  if(score.lastPos){
    score.points += score.lastPos.dist(ballPos)
    score.highScore = score.points > score.highScore ? score.points : score.highScore
    score.lastPos = ballPos
  }
  else {
    score.lastPos = ballPos
  }
}

// responsivity
function windowResized(){
  resizeCanvas(window.innerWidth*cvsFactor, window.innerHeight*cvsFactor)
}

document.body.style.overflow = "hidden"