import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// import Login from './components/Login/index';
import SignIn from './components/Login/SignIn';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';

ReactDOM.render(
  <React.StrictMode>
    <Router basename={'react-ui'}>
      <Switch>
        <Route path="/login" component={SignIn} />
        <Route path="/" component={Layout} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
