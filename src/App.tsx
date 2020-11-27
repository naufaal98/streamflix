import React from 'react';
import Routes from 'routes';
import { BrowserRouter as Router } from 'react-router-dom';
import Layout from 'components/Layout/Layout';
import { UserProvider } from 'context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <Layout>
          <Routes />
        </Layout>
      </UserProvider>
    </Router>
  );
}

export default App;
