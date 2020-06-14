import React from 'react';
import './App.css';
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css';
import { Header } from './features/header/Header';
import  SideBar from './features/sidebar/SideBar';

import { Player, PlayerCard } from './features/replay/PlayerCard';

const samplePlayer0: Player = {
  displayName: 'Jobama',
  gameId: 0
}

const samplePlayer1: Player = {
  displayName: 'lllllllllll',
  gameId: 1
}

const App = () => {
  return (
    <div>
      <Header />
      <div className='s2-grid'>
        <div className='s2-grid-left-menu bp3-dark'>
          <SideBar />
        </div>
        <div className='s2-grid-body'>
          {PlayerCard(samplePlayer0)}
          {PlayerCard(samplePlayer1)}
        </div>
      </div>
    </div>
  )
}

export default App;
