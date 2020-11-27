import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Detail from './Detail';

const Routes = () => {
  return (
    <Switch>
      <Route path="/:id-:slug">
        <Detail />
      </Route>
      <Route path="/?page=:page">
        <Home />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
    </Switch>
  );
};

export default () => <Routes />;
