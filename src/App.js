import React from 'react';

import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPalce'
import MainNavigation from './shared/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';

const App = () => {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Users/>
          </Route>
          <Route path="/:userId/places" exact> 
            <UserPlaces />
          </Route>
          <Route path="/places/new" exact>
            <NewPlace/>
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
    
  )
}

export default App;
