import React from 'react';
import './App.css';
import 'normalize.css'
import '@blueprintjs/core/lib/css/blueprint.css';
import { Header } from './features/header/Header';
import  SideBar from './features/sidebar/SideBar';
import Meta from './features/replay/Meta';

const App = () => {
  return (
    <div>
      <Header />
      <div className='s2-grid'>
        <div className='s2-grid-left-menu bp3-dark'>
          <SideBar />
        </div>
        <div className='s2-grid-body'>
          <Meta />
        </div>
      </div>
    </div>
  )
}

export default App;
