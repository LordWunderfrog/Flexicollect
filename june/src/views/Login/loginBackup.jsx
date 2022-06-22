/**
 * Login component.
 * 
 * 
 * This component is used to validate the user to login into the application.
 *
 *
 */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";

/* Resources. */
import logo from "assets/img/white-logo.png";
import "./Login.css";
import jwt from 'jwt-decode';

/* Material UI. */
import {
    withStyles
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

/* Custom components. */
import Loading from "components/Loading/Loading.jsx";

/* Bootstrap 1.0. */
import { Alert, Row } from "react-bootstrap";

/* API */
import api2 from "../../helpers/api2";
import * as Constants from "../../helpers/constants";
import queryString from 'query-string';
import axios from 'axios';

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
})

class Login extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            username: "",
            password: "",
            isAuthenticated: null,
            error: false,
            errorMsg: "",
            toggle: true,
            ismedia: null,
            // loading
            loading: false
        };
    }

    /* Validates the access token to retrieve the user attributes and group information */
    componentDidMount() {
        //console.log(this.props)
        //console.log(this.context)
        this.ismedia = window.location.search;
        //console.log(window.location.search)
        console.log(queryString)
        const values = queryString.parse(this.props.location.hash);
        console.log(values)
        if (values && values.access_token) {
            let token = values.access_token
            axios.get(Constants.COGNITO_USER_INFO_URL, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(resp => {
                let user = jwt(token);
                if (user['cognito:groups'] && user['cognito:groups'].length > 0) {
                    let groups = user['cognito:groups'];
                    localStorage.setItem("role", groups[0].toUpperCase());
                    localStorage.setItem("api_key", token);
                    localStorage.setItem("username", resp.data.username);
                    localStorage.setItem("email", resp.data.email);
                    localStorage.setItem("test", "test");
                    this.setState({ isAuthenticated: groups[0].toUpperCase() });
                }
                else {
                    this.setState({ error: true, errorMsg: "Role is not yet assigned!" });
                }
            })
                .catch(error => {
                    localStorage.clear();
                });
        }
    }

    /* Handles the open event of loading symbol. */
    openLoading = () => {
        this.setState({ loading: true });
    };

    /* Handles the close event of loading symbol. */
    stopLoading = () => {
        this.setState({ loading: false });
    };

    /* Handles the event of toggle. */
    toggleMode = () => {
        this.setState({ toggle: !this.state.toggle, errorMsg: "" });
    };

    /* Handles the api to reset password. */
    handleReset = e => {
        const { username } = this.state;
        this.openLoading();
        api2
            .post("auth/admin/forgotPassword", { email: username })
            .then(resp => {
                this.stopLoading();
                return this.setState({ error: true, errorMsg: "Password reset link has been sent to your registered email address." });
            })
            .catch(error => {
                this.stopLoading();
                console.error(error);
                return this.setState({ error: true, errorMsg: "Invalid Credentials. Try again!" });
            });
    };

    /* Handles the event to submit. */
    handleSubmit = event => {
        event.preventDefault();
        localStorage.clear();

        window.location.href = Constants.COGNITO_LOGIN_URL;
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

    /* Function is not in use */
    forgotPassword = () => {
        console.log("object");
    };

    render() {
        const { error } = this.state;

        const { isAuthenticated } = this.state;
        /* Based on logged in user's group, redirect to respective page */
        if (isAuthenticated === "ADMIN" && this.ismedia == 1) {
            return <Redirect to="/home/image-viewer/"{...this.state.ismedia} />;
        }
        else if (isAuthenticated === "ADMIN" || isAuthenticated === "EMPLOYEE") {
            return <Redirect to="/home/dashboard" />;
        }
        else if (isAuthenticated === "CLIENT") {
            return <Redirect to="/home/client-responses-report" />;
        }

        return (
            <div className="login-page">
                <video autoPlay muted loop
                    style={{
                        position: "fixed",
                        right: "0",
                        bottom: "0",
                        minWidth: "100%",
                        minHeight: "100%",
                        height: "auto"
                    }}
                >
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

                    <Row className="d-flex justify-content-center">
                        <Button
                            className="button login-button"
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={this.handleSubmit}
                        >
                            Login
                        </Button>
                    </Row>

                </div>
                <Loading open={this.state.loading} onClose={this.handleClose} />
            </div>
        );
    }
}

export default withStyles(styles)(Login);