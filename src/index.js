import createGame from './game.js'
import createKeyboardListenner from './keyboard-listener.js'
import renderScreen from './render-screen.js'

const game = createGame()
const keyboardListenner = createKeyboardListenner(document)


const socket = io()

socket.on('connect', () => {
    const snakeId = socket.id
    
    
    const canvas = document.getElementById('myCanvas')
    renderScreen(canvas, game, requestAnimationFrame, snakeId)
})

socket.on('setup', (state) => {
    const snakeId = socket.id    
    game.setState(state)

    keyboardListenner.registerSnakeId(snakeId)
    keyboardListenner.subscribe(game.moveSnake)
    keyboardListenner.subscribe((command) => {
        socket.emit('move-snake', command)
    })
})

socket.on('add-snake', (command) => {
    game.addSnake(command)
})

socket.on('remove-snake', (command) => {
    game.removeSnake(command)
})

socket.on('move-snake', (command) => {
    const snakeId = socket.id

    if(snakeId !== command.snakeId){
        game.moveSnake(command)
    }
})

socket.on('add-fruit', (command) => {
    game.addFruit(command)
})

socket.on('remove-fruit', (command) => {
    game.removeFruit(command)
})