export default function createGame(){
    const state = {
        snakes: {            
        },
        fruits: {},
        totalFruits: 0,
        screen: {
            width: 50,
            height: 50
        }
    }

    function start() {
        const frequency = 2000

        setInterval(addFruit, frequency)
    }
    const observers = []

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }
    function notifyAll(command){
        
        for(const observerFunction of observers){
            observerFunction(command)
        }
    }

    function setState(newState){
        Object.assign(state, newState)
    }

    function addSnake(command){
        const snakeId = command.snakeId
        const snakeX = 'snakeX' in command ? command.snakeX : Math.floor(Math.random() * state.screen.width)
        const snakeY = 'snakeY' in command ? command.snakeY : Math.floor(Math.random() * state.screen.height)
        state.snakes[snakeId] = {
            size: [],
            score: 0,
        }
        state.snakes[snakeId].size.push({x: snakeX, y: snakeY})
        notifyAll({
            type: 'add-snake',
            snakeId,
            snakeX,
            snakeY
        })
    }

    function removeSnake(command){
        const snakeId = command.snakeId

        delete state.snakes[snakeId]
        notifyAll({
            type: 'remove-snake',
            snakeId,
        })
        
    }
    function addFruit(command){
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 10000)
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.screen.width)
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.screen.height)

        // for(fruitState in state.fuits){
        //     if(fruitX === fruitState.x){

        //     }
        // }

        if(state.totalFruits < 5 ){
            state.fruits[fruitId] = {
                x: fruitX,
                y: fruitY
            }

            state.totalFruits++

            notifyAll({
                type: 'add-fruit',
                fruitId,
                fruitX,
                fruitY
            })        
        }
    }

    function removeFruit(command){
        const fruitId = command.fruitId

        delete state.fruits[fruitId]

        state.totalFruits--

        notifyAll({
            type: 'remove-fruit',
            fruitId,
        })
    }
    function moveSnake(command) {
        notifyAll(command)
        
        const acceptedMoves = {
            ArrowUp(snake){
                snake.size[0].y = snake.size[0].y - 1                
            },
            ArrowRight(snake){
                snake.size[0].x = snake.size[0].x + 1                
            },
            ArrowDown(snake){
                snake.size[0].y = snake.size[0].y + 1                
            },
            ArrowLeft(snake){
                snake.size[0].x = snake.size[0].x - 1                
            },            
        }



        const keyPressed = command.keyPressed
        const snakeId = command.snakeId
        const snake = state.snakes[command.snakeId]
        const moveFunction = acceptedMoves[keyPressed]

        if(snake && moveFunction){
            MoveTail(snakeId)
            moveFunction(snake)
            checkForFruitCollision(snakeId)
        }
    }
    
    function MoveTail(snakeId){
        const snake = state.snakes[snakeId]
        
        if(snake.size.length >= 1){
            for(let i = snake.size.length -1; i > 0; i--){
                snake.size[i].x = snake.size[i - 1].x 
                snake.size[i].y = snake.size[i - 1].y
                
            }
        }
    }

    function checkForFruitCollision(snakeId){        
        const snake = state.snakes[snakeId]

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId]

            if (snake.size[0].x === fruit.x && snake.size[0].y === fruit.y){
                snake.score++
                snake.size.push({x: snake.size[0].x, y: snake.size[0].y})
                console.log("> collision size", snake.size)
                removeFruit({ fruitId })
            }
        }
    }

    return {
        addSnake,
        removeSnake,
        addFruit,
        removeFruit,
        moveSnake,
        state,
        setState,
        subscribe,
        start
    }
}