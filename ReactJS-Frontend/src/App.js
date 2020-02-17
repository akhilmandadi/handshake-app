import React from 'react';
import './App.css';
import Routes from './routes/Routes';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* App Component Has a Child Component called Main*/}
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
