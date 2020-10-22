import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
// import TopBar from './module/top-bar/topBar.jsx';
// import WinContent from './module/win/windows.jsx';
import TopBar from './commponent/btnBox/leftTopBtn.jsx'
// import mineWin from ''
import MainWindow from './commponent/mainWindow/mainWindow.jsx'
import store from './store'

function App() {
    return < >
        <
        Provider store = { store } >
        <
        div className = "App" > { /* {new topBar({wintitle:'test'}).render()} */ } {
            /* <TopBar wintitle='music'></TopBar>
                    <WinContent></WinContent> */
        } <
        TopBar / >
        <
        MainWindow / >
        <
        /div> <
        /Provider> <
        />;
}

export default App;