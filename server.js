import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

import createGame from './src/game.js'

const app = express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(express.static('src'))

const game = createGame()
game.start()

game.subscribe((command) => {
    sockets.emit(command.type, command)
})


sockets.on('connection', (socket) => {
    const snakeId = socket.id    

    game.addSnake({ snakeId })
    console.log(`> Player has connected as ${snakeId}`)

    socket.emit('setup', game.state)
    console.log(`> The game already is`, game.state)

    socket.on('disconnect', () => {
        game.removeSnake({ snakeId })
        console.log(`> Player ${snakeId} has disconnected`)

    })
    
    socket.on('move-snake', (command) => {
        command.snakeId = snakeId
        command.type = 'move-snake'

        game.moveSnake(command)
    })
})

server.listen(process.env.PORT || 3000, () => {
    console.log('> server listening on port: 3000')
})