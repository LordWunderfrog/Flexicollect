/**
 * ResetPassword component.
 * 
 * This component is used to reset the password.
 *
 * 
 */

import React from "react";
import { Redirect, Link } from "react-router-dom";

/* Resources. */
import logo from "assets/img/white-logo.png";
import "./ResetPassword.css";

/* Material UI */
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

/* Custom components. */
import Loading from "components/Loading/Loading.jsx";

/* Bootstrap 1.0 */
import { Alert, Row } from "react-bootstrap";

/* MUI Icons */
import LockOpen from "@material-ui/icons/LockOpen";

/* API */
import api2 from "../../helpers/api2";
import * as Constants from "../../helpers/constants";

/* Query params. */
import queryString from "query-string";

const styles = theme => ({
  icon: {
    color: "#fff"
  },
  cssUnderline: {
    color: "#fff",
    borderBottom: "#fff",
    borderBottomColor: "#fff",

    "&:after": {
      borderBottomColor: "#fff",
      borderBottom: "#fff"
    },
    "&:before": {
      borderBottomColor: "#fff",
      borderBottom: "#fff"
    }
  }
});

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: { main: "#fff" }
  }
});

class ResetPassword extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      email: "",
      accessToken: "",
      accessSignature: "",
      password: "",
      confirmPassword: "",

      // loading
      loading: false,
      error: false,
      errorMsg: ""
    };
  }
  componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    this.setState({
      email: values.email,
      accessToken: values.accessToken,
      accessSignature: values.accessSignature
    });
  }
  /* Handles the open event of loading symbol. */
  openLoading = () => {
    this.setState({ loading: true });
  };

  /* Handles the close event of loading symbol. */
  stopLoading = () => {
    this.setState({ loading: false });
  };

  /* Handles the event when the input value changes. */
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };

  /* Handles the event when user submit the button. */
  handleSubmit = e => {
    if (this.state.password === this.state.confirmPassword) {
      this.resetPassword(this.state.password);
    } else {
      this.setState({ error: true, errorMsg: "Password and Confirm Password do not match." });
    }
  };

  /* Handles the api to reset the password. */
  resetPassword(password) {
    let details = {
      email: this.state.email,
      accessSignature: this.state.accessSignature,
      accessToken: this.state.accessToken,
      newPassword: password
    };

    this.openLoading();
    api2
      .post("auth/admin/resetPassword", details)
      .then(resp => {
        this.stopLoading();
        this.setState({ error: true, errorMsg: "Password has been changed successfully. Please login using changed password." });
      })
      .catch(error => {
        this.stopLoading();
        if (error && error.response.data && error.response.data.status == 401) {
          this.setState({ error: true, errorMsg: "Reset password link has expired!" });
        }
        else {
          this.setState({ error: true, errorMsg: "Error occurred in resetting the password. Please try again!" });
        }

      });
  }

  render() {
    const { error } = this.state;

    const { isAuthenticated } = this.state;

    const { classes } = this.props;

    if (isAuthenticated) {
      return <Redirect to="/home/dashboard" />;
    }

    return (
      <div className="login-page">
        <video autoPlay muted loop id="myVideo">
          <source
            src={Constants.BANNER_URI}
            type="video/mp4"
          />
        </video>

        <div className="videoOver" />
        <div className="midl">
          <Row className="d-flex justify-content-center">
            <img src={logo} className="Login-logo" alt="logo" />
          </Row>
          <br />
          <Row className="d-flex justify-content-center">
            {error && (
              <Alert style={{ color: "#fff" }}>
                {this.state.errorMsg}
              </Alert>
            )}
          </Row>
          <MuiThemeProvider theme={theme}>
            <Row className="d-flex justify-content-center">
              <TextField
                id="password"
                name="password"
                type="password"
                label="New Password"
                value={this.state.password}
                onChange={this.handleInputChange}
                InputProps={{
                  className: classes.icon,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpen className={classes.icon} />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{
                  style: { color: '#fff', fontSize: "20px", paddingLeft: "50px" },
                }}
              />
            </Row>

            <br />

            <Row className="d-flex justify-content-center">
              <TextField
                id="cnfm-password"
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                value={this.state.confirmPassword}
                onChange={this.handleInputChange}
                className={classes.cssUnderline}
                InputProps={{
                  className: classes.icon,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOpen className={classes.icon} />
                    </InputAdornment>
                  )
                }}
                InputLabelProps={{
                  style: { color: '#fff', fontSize: "20px", paddingLeft: "50px", whiteSpace: "nowrap" },
                }}
              />
            </Row>
          </MuiThemeProvider>
          <br />

          <Row className="d-flex justify-content-center">
            <Button
              className="button login-button"
              type="submit"
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
            >
              Change Password
            </Button>
          </Row>
          <Row className="d-flex justify-content-center">
            <p onClick={this.toggleMode} className="text-link">
              <Link to="/" className="text-link">
                Return to Login Page
              </Link>
            </p>
          </Row>
        </div>
        <Loading open={this.state.loading} onClose={this.handleClose} />
      </div>
    );
  }
}

export default withStyles(styles)(ResetPassword);
