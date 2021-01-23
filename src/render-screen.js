export default function renderScreen(canvas, game, requestAnimationFrame, currentSnakeId) {
    canvas.width = game.state.screen.width
    canvas.height = game.state.screen.height
    const ctx = canvas.getContext("2d");    
    ctx.fillStyle = 'white'
    ctx.clearRect(0, 0, canvas.width,  canvas.height)

    for (const snakeId in game.state.snakes){
        const snake = game.state.snakes[snakeId]
        ctx.fillStyle = 'black'
        ctx.globalAlpha = 1
        ctx.fillRect(snake.size[0].x, snake.size[0].y, 1, 1)
        if(snake.size.length > 0){
            for(let i = 0; i < snake.size.length ; i++){
                ctx.globalAlpha = 0.60
                ctx.fillRect(snake.size[i].x, snake.size[i].y, 1, 1)
            }
        }
    }
    for (const fruitId in game.state.fruits){
        const fruit = game.state.fruits[fruitId]
        ctx.fillStyle = 'red'
        ctx.globalAlpha = 1
        ctx.fillRect(fruit.x, fruit.y, 1, 1)
        // console.log(`> renderizando ${fruitId}`)
    }

    const currentSnake = game.state.snakes[currentSnakeId]

    if(currentSnake) {
        ctx.fillStyle = 'yellow'
        ctx.globalAlpha = 1
        ctx.fillRect(currentSnake.size[0].x, currentSnake.size[0].y, 1, 1)
        if(currentSnake.size.length > 0){
            for(let i = 0; i < currentSnake.size.length ; i++){
                ctx.globalAlpha = 0.60
                ctx.fillRect(currentSnake.size[i].x, currentSnake.size[i].y, 1, 1)
            }
        }
    }
    
    requestAnimationFrame(() => {
        renderScreen(canvas, game, requestAnimationFrame, currentSnakeId)
    })
}