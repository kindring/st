import React from 'react';
import logo from './logo.svg';
import './App.css';
import TopBar from './module/top-bar/topBar.jsx';
import winContent from './module/win/windows.jsx';
function App() {
  return (
    <div className="App">
      {/* {new topBar({wintitle:'test'}).render()} */}
      <TopBar wintitle='music'></TopBar>
      
    </div>
  );
}

export default App;
