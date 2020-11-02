const { promises } = require("fs");

let { ipcRenderer } = window.electron;


function createCom(address, state) {
    ipcRenderer.send('createCalclatorCom', {
        state: state,
        address: address
    })
    return new Promise((resolve, reject) => {
        ipcRenderer.on('createCalclatorCom-reply', (e, value) => {
            resolve(value);
        })
    })
}

function createClose(address, state) {
    ipcRenderer.send('createCalclatorClose', {
        state: state,
        address: address
    })
    return new Promise((resolve, reject) => {
        ipcRenderer.on('createCalclatorClose-reply', (e, value) => {
            resolve(value);
        })
    })
}

function createOpen(address, state) {
    ipcRenderer.send('createCalclatorOpen', {
        state: state,
        address: address
    })
    return new Promise((resolve, reject) => {
        ipcRenderer.on('createCalclatorOpen-reply', (e, value) => {
            resolve(value);
        })
    })
}


export default {
    createOpen,
    createClose,
    createCom
};