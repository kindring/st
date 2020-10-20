import { createStore } from 'redux'

const state = store.getState();


const ADD_TODO = 'ADD_TODO'

function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    }
}

const action = addTodo

const reducer = function(state = 'null', action) {
    return {
        state,
        action
    }
}

const store = createStore(reducer(state, action));

export default store