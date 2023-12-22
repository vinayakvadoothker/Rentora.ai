import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

// Use createRoot instead of ReactDOM.render
const root = document.getElementById('root');
const createRoot = ReactDOM.createRoot(root);

// Wrap your app component in createRoot().render()
createRoot.render(
  <React.StrictMode>
    <Router>
      <App clerkPubKey={clerkPubKey} />
    </Router>
  </React.StrictMode>
);
