import React from 'react';
import Routes from 'routes';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from 'components/Layout/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes />
      </Layout>
    </Router>
  );
}

export default App;
