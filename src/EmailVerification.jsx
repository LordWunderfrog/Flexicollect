/*
* EmailVerification component. 
* This component will verify email link in the browser.
*  
*/

import React from "react";
import api2 from "./helpers/api2";
import { Row } from "react-bootstrap";
import logo from "./assets/img/white-logo.png";
import "./views/Login/Login.css";

var email = '';
var accessToken = '';
var accessSignature = '';
var values;

class EmailVerification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Verifying Email Address..."
    };
  }

  componentDidMount() {
    values = this.props.location.search;
    if (values !== '') {
      accessToken = this.getParameterByName('accessToken', values)
    }
    if (values !== '') {
      accessSignature = this.getParameterByName('accessSignature', values)
    }
    if (values !== '') {
      email = this.getParameterByName('email', values)
    }
    if (email !== '' && accessToken !== '' && accessSignature !== '') {
      this.verifyEmail();
    }
  }

  /**
    * Filter param from url
    */
  getParameterByName = (name, url) => {
    if (url && name) {
      name = name.replace(/[[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2]);
    }
    return null;
  }

  /**
     * Invoke api to verify email address
     */
  verifyEmail = () => {
    api2
      .get("/v2/auth/verify?email=" + encodeURIComponent(email) + "&accessSignature=" + encodeURIComponent(accessSignature) + "&accessToken=" + encodeURIComponent(accessToken))
      .then(resp => {

        if (resp.data.status === 200) {
          this.setState({ message: "Email Address is verified successfully. You could now login to the app with the registered credentials." });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };


  render() {
    return (
      <div style={{
        backgroundColor: "rgba(5, 28, 58, 0.6)",
        height: '100%',
        width: '100%'
      }}>
        <Row className="d-flex justify-content-center">
          <img src={logo} className="Login-logo" style={{ marginTop: "13%" }} alt="logo" />
        </Row>
        <br />
        <Row className="d-flex justify-content-center">
          <p style={{ color: "#fff" }}>
            {this.state.message}
          </p>
        </Row>
      </div>
    );
  }
}

export default EmailVerification;
