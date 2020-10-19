//封装ipc进程通信
let {ipcMain, BrowserWindow} = require('electron');


console.log('test');
let windows = {
  main:'null'
}
ipcMain.on('winControl-message',(event,arg)=>{
  // console.log('窗口控制函数')
  // console.log(event)
  console.log(arg)
  let targetWin = windows[arg.win];
  console.log(arg.hevent)
  if(!targetWin){
    return console.log('出现错误，尝试操作一个未注册的窗口')
  }
  // 检测是否为窗口对象
  if(targetWin instanceof BrowserWindow){
    // console.log('abc')
    winActive(targetWin,arg.hevent);
  }
})
function winActive(win,fn){
  console.log(fn)
  switch (fn) {
    case 'fullWindow':
      //窗口最大化
      win.resizable=true;
      win.maximize();
      console.log('最大化窗口')
      break;
    case 'normalWindow':
      // 取消最大化
      win.unmaximize();
      // setTimeout(()=>{
      //   win.resizable=false;
      // },1)
      
      break;
    case 'minWindow':
      win.minimize()
      break;
    case 'closeWindow':
      win.close();
      break;
    default:
      break;
  }
}

module.exports = {
  windows,
  ipcMain};



