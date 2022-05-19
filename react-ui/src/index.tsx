import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import SignIn from './components/Login/SignIn';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './components/Layout';

ReactDOM.render(
  <React.StrictMode>
    <Router basename={process.env.REACT_APP_ROOT_PATH}>
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
