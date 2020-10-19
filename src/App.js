import React from 'react';
import './App.css';
// import TopBar from './module/top-bar/topBar.jsx';
// import WinContent from './module/win/windows.jsx';
import TopBar from './commponent/btnBox/leftTopBtn.jsx'
// import mineWin from ''
import MainWindow from './commponent/mainWindow/mainWindow.jsx'
function App() {
  return (
    <div className="App">
      {/* {new topBar({wintitle:'test'}).render()} */}
      {/* <TopBar wintitle='music'></TopBar>
      <WinContent></WinContent> */}
      <TopBar/>
      <MainWindow/>
    </div>
  );
}

export default App;
