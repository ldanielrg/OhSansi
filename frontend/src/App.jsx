// App.jsx
import React from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Layout>
      <Home />
    </Layout>
  );
}

export default App;
