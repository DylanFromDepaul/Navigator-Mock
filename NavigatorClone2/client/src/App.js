import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrderPage from './pages/OrderPage.jsx';
import JobPage from './pages/JobPage';
import JobsPage from './pages/JobsPage';
import OrderPageNew from './pages/OrderPageNew';
import TestAI from './pages/TestAI';
import './App.css';

console.log('Loading OrderPage component from OrderPage.jsx');

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/orders/:orderId/jobs" component={JobsPage} />
        <Route path="/orders/:orderId" component={OrderPage} />
        <Route path="/jobs/:jobId" component={JobPage} />
        <Route path="/test-ai" component={TestAI} />
        <Route component={() => <div>Page not found</div>} />
      </Switch>
    </Router>
  );
};

export default App; 