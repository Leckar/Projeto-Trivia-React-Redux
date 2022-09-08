import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Game from './pages/Game';
// import logo from './trivia.png';

import './App.css';

export default function App() {
  return (
    <Switch>
      <Route
        path="/"
        exact
        component={ Login }
      />
      <Route
        path="/settings"
        component={ Settings }
      />
      <Route
        path="/game"
        component={ Game }
      />
    </Switch>
  );
}
