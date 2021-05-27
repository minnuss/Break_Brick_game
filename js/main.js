// SHOW RULES MENU
// *******************************************
const btnRules = document.getElementById('rules-btn')
const btnClose = document.getElementById('close-btn')
const rulesCont = document.getElementById('rules')

btnRules.addEventListener('click', () => rulesCont.classList.add('show'))
btnClose.addEventListener('click', () => rulesCont.classList.remove('show'))


// GAME CODE 
// *******************************************
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let score = 0
const brickRowCount = 9
const brickColumnCount = 5


// CREATE BALL PROPERTIES
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4, //moving on x axis
    dy: -4 //moving on y axis
}

// CREATE PADDLE PROPERTIES
const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80, //width
    h: 10, //height
    speed: 8,
    dx: 0 //moving on x axis
}

// CREATE BRICK PROPERTIES
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true //if ball hits it, goes false
}

// DRAW PADDLE ON CANVAS
function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = '#227093'
    ctx.fill()
    ctx.closePath()
}

// DRAW BALL ON CANVAS
function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
    ctx.fillStyle = '#227093'
    ctx.fill()
    ctx.closePath()
}

// CREATE BRICKS
const bricks = []
for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = []

    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY

        bricks[i][j] = { x, y, ...brickInfo }
    }
}
// console.log(bricks)

// DRAW BRICKS ON CANVAS
function drawBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath()
            ctx.rect(brick.x, brick.y, brick.w, brick.h)
            ctx.fillStyle = brick.visible ? '#227093' : 'transparent'
            ctx.fill()
            ctx.closePath()
        })
    })
}

// DRAW SCORE ON CANVAS
function drawScore() {
    ctx.font = '20px Poppins'
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30)
}

// MOVE PADDLE ON CANVAS
function movePaddle() {
    paddle.x += paddle.dx

    // Wall detection
    // right wall
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w
    }
    // left wall
    if (paddle.x < 0) {
        paddle.x = 0
    }
}

// KEYDOWN - MOVE THE PADDLE
function keyDown(e) {
    // console.log(1)
    if (e.key === "Right" || e.key === "ArrowRight") {
        paddle.dx = paddle.speed
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed
    }
}

// KEYUP - STOP THE PADDLE MOVING
function keyUp(e) {
    // console.log(2)
    if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = 0
    }
}

// MOVE BALL ON CANVAS
function moveBall() {
    ball.x += ball.dx
    ball.y += ball.dy

    // Wall collision (x-axis)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        // reverse value to negative, so if value its plus, hits the wall and its negative, if its negative, hits the wall and its positive
        ball.dx *= -1
    }

    // Wall collision (y-axis)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        // reverse value to negative, so if value its plus, hits the wall and its negative, if its negative, hits the wall and its positive
        ball.dy *= -1
    }

    // Paddle collision
    if (
        ball.x - ball.size > paddle.x &&
        ball.x + ball.size < paddle.x + paddle.w &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed
    }

    // Bricks collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check   
                ) {
                    ball.dy *= -1
                    brick.visible = false

                    // Increase Score
                    increaseScore()
                }
            }
        })
    })

    // Hit bottom wall => Lose !
    if (ball.y + ball.size > canvas.height) {
        showAllBricks()
        score = 0
    }
}

// INCREASE SCORE
function increaseScore() {
    score++

    // Check for bricks
    if (score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks()
    }
}

// MAKE ALL BRICKS AGAIN
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true)
    })
}


// DRAW EVERYTHING
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawPaddle()
    drawBall()
    drawScore()
    drawBricks()
}

// UPDATE CANVAS DRAWING AND ANIMATION
function update() {
    // move paddle
    movePaddle()
    // move ball
    moveBall()

    // draw all
    draw()

    requestAnimationFrame(update)
}
update()


// KEYBOARD EVENTS
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

