import Spinner from 'components/Spinner/Spinner';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

const Home = React.lazy(() => import('./Home/_Home'));
const Detail = React.lazy(() => import('./Detail/_Detail'));
const Library = React.lazy(() => import('./Library/Library'));
const TopUp = React.lazy(() => import('./TopUp/TopUp'));

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
        <Route exact path="/top-up" component={TopUp} />
        <Route path="/:id-:slug" component={Detail} />
        <Route path="/?page=:page" component={Home} />
        <Route path="/library" component={Library} />
        <Route exact path="/" component={Home} />
      </Switch>
    </React.Suspense>
  );
};

export default () => <Routes />;
