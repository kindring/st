//用来通信
let electron = window.electron;

console.log(electron);
let ipc = electron.ipcRenderer
console.log(global.electron);
/**窗口控制 
 * 
*/
function control(win,event){
    console.log(win,event)
    ipc.send('winControl-message',{
        win:win,
        hevent:event
    });
}

export default control;