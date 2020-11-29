import Spinner from 'components/Spinner/Spinner';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Home = React.lazy(() => import('./Home'));
const Detail = React.lazy(() => import('./Detail'));
const Library = React.lazy(() => import('./Library/Library'));

const SuspenseFallback = (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Spinner />
  </div>
);

const Routes = () => {
  return (
    <React.Suspense fallback={SuspenseFallback}>
      <Switch>
        <Route path="/:id-:slug">
          <Detail />
        </Route>
        <Route path="/?page=:page">
          <Home />
        </Route>
        <Route path="/library">
          <Library />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </Switch>
    </React.Suspense>
  );
};

export default () => <Routes />;
