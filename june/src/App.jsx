/*
* App component. 
* This component is used to routing from one page to another page based on the user events.
* For routing imported react-router-dom library and imported all components here for navigation. */

import React from "react";
import { Route, Switch } from "react-router-dom";

import Home from "./Home";
import Login from "./views/Login/Login";
import WebLink from "./WebLink";
import AppLink from "./AppLink";
import EmailVerification from "./EmailVerification";
import ConsumerResetPassword from "./ConsumerResetPassword";

import "react-perfect-scrollbar/dist/css/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact={true} component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/verifyemail" component={EmailVerification} />
          <Route path="/resetpassword" component={ConsumerResetPassword} />
          <Route path="/websurvey/" component={WebLink} />
          <Route path="/appsurvey/" component={AppLink} />
          <Route path="/survey/" component={WebLink} />
        </Switch>
      </div>
    );
  }
}

export default App;
