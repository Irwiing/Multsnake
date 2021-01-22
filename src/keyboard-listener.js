export default function createKeyboardListenner(document) {
    const state = {
        observers: [],
        snakeId: null
    }

    function registerSnakeId(snakeId){
        state.snakeId = snakeId
    }

    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }

    function notifyAll(command){
        for(const observerFunction of state.observers){
            observerFunction(command)
        }
    }
    
    document.addEventListener('keydown', handleKeydown)

    function handleKeydown(event) {
        const keyPressed = event.key
        
        const command = {
            type: 'move-snake',
            snakeId: state.snakeId,
            keyPressed
        }

        notifyAll(command)
    }
    return { 
        subscribe,
        registerSnakeId,
    }
}