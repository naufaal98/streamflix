import React from 'react';
import Routes from 'routes';
import { BrowserRouter as Router } from 'react-router-dom';
import { AddInitialUserData } from 'data/user/localData';

function App() {
  React.useEffect(() => {
    AddInitialUserData();
  }, []);

  return (
    <Router>
      <Routes />
    </Router>
  );
}

export default App;
