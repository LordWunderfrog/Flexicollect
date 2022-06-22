/**
 * PaymentViewPage component.
 * 
 * This component is used to view the payment details for each mission response.
 *
 */
import React, { Component } from "react";
/* @material-ui */
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
/* Form schema and validation */
import * as formik from "formik";

/* Custom components */
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Loading from "components/Loading/Loading.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
/* Bootstrap 1.0 */
import { Col, Form } from "react-bootstrap";


/* Api */
import api2 from "../../helpers/api2";
/* Material UI */
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
/* Css */
import "./AgMissionResponse.css";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#074e9e"
    },
    secondary: {
      main: "#ffffff"
    }
  }
});

const { Formik } = formik;



const styles = {


  paper: {
    position: "absolute",
    minWidth: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  }
};
class PaymentViewPage extends Component {
  constructor(props) {
    super(props);


    this.state = {
      pay: this.props.pay,
      payment: false,
      updatedEmailBody: "",
      updatedEmailSub: "",
      paypalAmount: "",
      currencyCode: "",
      email: this.props.email,
      loading: false,
      warning: false,
      success: false,
      editAmount: true,
      paymentDetails: ""
    };

  }

  /* Handles the snackbar message notification. */
  showNotification = (msg, color) => {
    this.setState({
      message: msg,
      msgColor: color
    });

    let place = "br";
    var x = [];
    x[place] = true;
    this.setState(x);
    this.alertTimeout = setTimeout(
      function () {
        x[place] = false;
        this.setState(x);
      }.bind(this),
      5000
    );
  };

  componentDidMount() {
    this.getPaymentViewDetails()
  }

  /* Handles the api to fetch the payment status.
  * Used the params survey tag id and apikey to fetch the payment details.
  * Update the payment details. */
  getPaymentViewDetails() {
    let apiKey = localStorage.getItem("api_key");
    api2
      .get("v1/payment_status?survey_tag_id=" + this.props.selectedPaymentDetails.data.survey_tag_id, {
        headers: {

          "Content-Type": "application/json",
          Auth: apiKey

        }
      })
      .then(resp => {
        this.stopLoading();

        if (resp.data.status === 200) {
          this.setState({
            paymentDetails: resp.data.data[0],
            success: true
          });
        } else {
          this.showNotification(
            resp.data.error
              ? resp.data.error
              : "Error in fetching the payment details",
            "danger"
          );
        }
      })

      .catch(error => {
        this.stopLoading();
        console.error(error);
        this.showNotification("Error in fetching the payment details", "danger");
      });
  }

  callSubmit = () => {
    this.form.submitForm();
  };

  /* Style for modal popup. */
  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }


  /* Handles the open event of loading symbol. */
  openLoading = () => {
    this.setState({ loading: true });
  };

  /* Handles the close event of loading symbol. */
  stopLoading = () => {
    this.setState({ loading: false });
  };



  /* Handles the close event of view payment details popup. */
  closePay = () => {
    this.props.paymentViewDetails();
  }


  render() {


    const { msgColor, br, message } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <GridContainer style={{ width: "100%", height: "auto" }}>
            <Card style={{ height: "auto" }}>

              <CardHeader color="primary">
                <h4
                  style={{
                    color: "#FFFFFF",
                    marginTop: "0px",
                    minHeight: "auto",
                    fontWeight: "300",
                    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                    marginBottom: "3px",
                    textDecoration: "none",
                    textAlign: "center"

                  }}
                >

                  Pay User

                </h4>
              </CardHeader>
              <div style={{ maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden' }}>
                <Formik

                  onSubmit={values => this.submitForm(values)}
                  ref={node => (this.form = node)}
                  initialValues={{ ...this.state }}
                >
                  {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    touched,
                    isValid,
                    errors
                  }) => (
                    <Form noValidate >
                      <CardBody style={{ padding: "1rem 37px" }}>
                        <Form.Row>
                          <Form.Group
                            as={Col}
                            //   md="4"
                            controlId="validationFormiknames"
                          >
                            <Form.Label
                              style={{ textAlign: "left", paddingTop: "10px" }}
                            >
                              <div
                                style={{
                                  paddingTop: "10px",
                                  wordBreak: "break-all"
                                }}
                              >
                                Project Name :
                                <span style={{ fontSize: "0.8rem" }}>
                                  {" " + this.props.paymentProjName}

                                </span>
                              </div>

                              <div style={{ paddingTop: "10px" }}>
                                Mission Name :
                                <span style={{ fontSize: "0.8rem" }}>

                                  {" " + this.state.paymentDetails.paymentMission}
                                </span>
                              </div>

                              <div style={{ paddingTop: "10px" }}>
                                Pay To User :
                                <span style={{ fontSize: "0.8rem" }}>

                                  {" " + this.state.paymentDetails.paymentEmail}
                                </span>
                              </div>
                              <div style={{ paddingTop: "10px" }}>
                                Payment Date :
                                <span style={{ fontSize: "0.8rem" }}>

                                  {" " + new Date(this.state.paymentDetails.paymentDate).toLocaleString()}
                                </span>
                              </div>
                              <div style={{ paddingTop: "10px" }}>
                                Payment Completed Date :
                                <span style={{ fontSize: "0.8rem" }}>

                                  {" " + new Date(this.state.paymentDetails.paymentCompletedDate).toLocaleString()}
                                </span>
                              </div>
                            </Form.Label>
                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="validationFormi3"
                          >
                            <Form.Label style={{ textAlign: "left" }}>
                              Amount
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="Amount"
                              value={this.state.paymentDetails.paymentAmount}

                              onChange={handleChange}
                              isInvalid={touched.Amount && !!errors.Amount}
                              // disabled={true}
                              disabled={this.state.editAmount}

                            />

                          </Form.Group>

                          <Form.Group
                            as={Col}
                            md="1"
                            controlId="validationFormikspace"
                          ></Form.Group>
                          <Form.Group
                            as={Col}
                            md="4"
                            controlId="validationFormik5"
                          >
                            <Form.Label style={{ textAlign: "left" }}>
                              Currency
                            </Form.Label>
                            <Form.Control
                              as="select"
                              name="Currency"

                              onChange={handleChange}
                              isInvalid={touched.Currency && !!errors.Currency}
                              disabled={this.state.editAmount}


                            >
                              <option selected >
                                {this.state.paymentDetails.paymentCurrency}
                              </option>

                            </Form.Control>

                          </Form.Group>


                        </Form.Row>

                        <Form.Row>
                          <Form.Group
                            as={Col}
                            controlId="validationFormik1"
                          >
                            <Form.Label style={{ display: "flex!important" }}>
                              Email Subject
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="EmailSubject"
                              value={this.state.paymentDetails.paymentSubject}
                              onChange={handleChange}
                              isInvalid={
                                touched.EmailSubject && !!errors.EmailSubject
                              }
                              disabled={true}
                            />

                          </Form.Group>
                        </Form.Row>
                        <Form.Row>
                          <Form.Group
                            as={Col}
                            controlId="validationFormik2"
                          >
                            <Form.Label style={{ textAlign: "left" }}>
                              Note
                            </Form.Label>
                            <Form.Control
                              as="textarea"
                              name="EmailBody"
                              id="textarea"
                              value={this.state.paymentDetails.paymentNote}
                              rows="4"
                              onChange={handleChange}
                              isInvalid={touched.EmailBody && !!errors.EmailBody}
                              disabled={true}
                            />

                          </Form.Group>
                        </Form.Row>
                      </CardBody>
                    </Form>
                  )}
                </Formik>

              </div>



              <CardFooter
                className="model-footer"
                style={{
                  paddingTop: "5px",
                  alignSelf: 'center'
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    color: "#fff",
                    padding: "5px 16px",
                    fontSize: "12px",
                    textAlign: "center",

                  }}
                  onClick={this.closePay}
                >
                  Cancel
                </Button>
              </CardFooter>

            </Card>
          </GridContainer>

          <Snackbar
            place="br"
            color={msgColor}
            open={br}
            message={message}
            closeNotification={() => this.setState({ br: false })}
            close
          />
          <Loading open={this.state.loading} onClose={this.handleClose} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(PaymentViewPage);