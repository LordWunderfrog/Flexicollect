/**
 * PaymentPage component.
 * 
 * This component is used to manage the payment of users for the survey responses.
 *
 */

import React, { Component } from "react";
/* @material-ui. */
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
/* Form schema and validation */
import * as formik from "formik";
import * as yup from "yup";

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

import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

/* Api */
import api2 from "../../helpers/api2";

// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
/* css */
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

const schema = yup.object().shape({
  EmailSubject: yup.string().required(),
  EmailBody: yup.string().required(),
  Amount: yup.number().required(),
  Currency: yup.string().required()
});

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  gridHeader: {
    width: "100%",
    marginLeft: "3%",
    marginBottom: 10,
    zIndex: 3
  },
  tableToolbar: {
    width: "100%",
    marginLeft: "3%",
    zIndex: 2,
    marginTop: 5
  },
  loadingDiv: {
    width: "100%",
    textAlign: "center"
  },
  tooltipText: {
    fontSize: "0.9rem"
  },
  tabTitl: {
    color: "#fff",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  paper: {
    position: "absolute",
    minWidth: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  }
};
class PaymentPage extends Component {
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
      editAmount: true
    };
    this.addpayment = this.addpayment.bind(this);
  }

  componentDidMount() {
    this.setFormFields();
  }

  /* Handles the function to submit the form. */
  callSubmit = () => {
    this.form.submitForm();
  };

  /* Style for payment popup. */
  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  /* Formation of payment data. */
  prepareRestData = values => {
    return {
      email: this.props.selectedPaymentDetails.data.payment.paypalEmail,
      subject: values.EmailSubject,
      note: values.EmailBody,
      amount: values.Amount,
      currency: values.Currency,
      survey_tag_id: this.props.selectedPaymentDetails.data.survey_tag_id,
      customer_id: this.props.selectedPaymentDetails.data.customer_id,
      mission: this.props.paymentMissionName
    };
  };

  submitForm = values => {
    let data = this.prepareRestData(values);
    this.data = data;
    if (
      values.Amount === this.props.paymentAmount &&
      values.Currency === this.props.paymentCurrency
    ) {
      this.addpayment(data);
    } else if (
      values.Amount !== this.props.paymentAmount ||
      values.Currency !== this.props.paymentCurrency
    ) {
      this.setState({
        warning: true
      });
    }
  };

  /* Handles the open event of loading symbol. */
  openLoading = () => {
    this.setState({ loading: true });
  };

  /* Handles the close event of loading symbol. */
  stopLoading = () => {
    this.setState({ loading: false });
  };

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

  getPaymentStatus() {
    return this.state.success;
  }

  /* Handles the api to post the payment data and
  * updates the status in the message notification if the payment gets failed. */

  addpayment = () => {
    let data = this.data;
    this.openLoading();
    this.setState({
      warning: false
    });

    api2
      .post("v1/payment", data)
      .then(resp => {
        this.stopLoading();
        if (resp.data.status === 200) {
          this.setState({
            success: true
          });
        } else {
          this.showNotification(
            resp.data.error
              ? resp.data.error
              : "Error in processing the payment",
            "danger"
          );
        }
      })

      .catch(error => {
        this.stopLoading();
        console.error(error);
        this.showNotification("Error in processing the payment", "danger");
      });
  };

  /* Handles the function to set the value for form fields. */
  setFormFields = () => {
    this.form.setFieldValue("Amount", this.props.paymentAmount);
    this.form.setFieldValue("Currency", this.props.paymentCurrency);
    this.form.setFieldValue("EmailSubject", "");
    this.form.setFieldValue("EmailBody", "");
  };

  /* Handles the function to close the popup in the payment page. */
  closePay = () => {
    this.props.finaldata();
  }

  /* Handles the function to close the popup when user changes the amount or currency. */
  closeWarning = () => {
    this.setState({
      warning: false
    });
  };

  /* Handles the events to update payment amount. */
  editAmountDetails = () => {
    this.setState({ editAmount: false });
  };

  /* Handles the function to close the payment popup. */
  closeSucessWarning = () => {
    let updatedstatus = this.props.selectedPaymentDetails.data;
    updatedstatus.payment.paymentStatus = "PENDING";
    updatedstatus.payment.paymentEnabled = 1;
    this.props.PaymentStatusUpdate(
      this.props.selectedPaymentDetails.data.survey_tag_id,
      updatedstatus
    );
    this.setState({
      success: false
    });
    this.closePay();
  };
  render() {
    // const { Formik } = formik;

    const { classes } = this.props;
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
                    // fontSize: "16px"
                  }}
                >
                  {/* {this.props.paymentProjName} -{this.props.paymentMissionName} */}
                  {/* <br /> */}
                  Pay User
                  {/* {this.props.selectedPaymentDetails.data.payment.paypalEmail} */}
                </h4>
              </CardHeader>
              <Formik
                validationSchema={schema}
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
                  <Form noValidate onSubmit={handleSubmit}>
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
                                {" " + this.props.paymentMissionName}
                              </span>
                            </div>

                            <div style={{ paddingTop: "10px" }}>
                              Pay To User :
                              <span style={{ fontSize: "0.8rem" }}>
                                {
                                  " " + this.props.selectedPaymentDetails.data.payment
                                    .paypalEmail
                                }
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
                            value={values.Amount}
                            onChange={handleChange}
                            isInvalid={touched.Amount && !!errors.Amount}
                            disabled={this.state.editAmount}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.Amount}
                          </Form.Control.Feedback>
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
                            value={values.Currency}
                            onChange={handleChange}
                            isInvalid={touched.Currency && !!errors.Currency}
                            disabled={this.state.editAmount}
                          >
                            <option value="ARS">ARS</option>
                            <option value="AUD">AUD</option>
                            <option value="BRL">BRL</option>
                            <option value="CAD">CAD</option>
                            <option value="CZK">CZK</option>
                            <option value="DKK">DKK</option>
                            <option selected value="EUR">
                              EUR
                            </option>
                            <option value="HKD">HKD</option>
                            <option value="HUF">HUF</option>
                            <option value="ILS">ILS</option>
                            <option value="JPY">JPY</option>
                            <option value="MYR">MYR</option>
                            <option value="MXN">MXN</option>
                            <option value="TWD">TWD</option>
                            <option value="NZD">NZD</option>
                            <option value="NOK">NOK</option>
                            <option value="PHP">PHP</option>
                            <option value="PLN">PLN</option>
                            <option value="GBP">GBP</option>
                            <option value="RUB">RUB</option>
                            <option value="SGD">SGD</option>
                            <option value="SEK">SEK</option>
                            <option value="CHF">CHF</option>
                            <option value="THB">THB</option>
                            <option value="USD">USD</option>
                          </Form.Control>

                          <Form.Control.Feedback type="invalid">
                            {errors.Currency}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{

                            padding: "5px 16px",
                            fontSize: "12px",
                            textAlign: "center",
                            marginTop: "10px",
                            height: "30px",
                            alignSelf: "center",
                            marginLeft: "5px"
                          }}

                          onClick={this.editAmountDetails}

                        >
                          Edit
                        </Button>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          //   md="8"
                          controlId="validationFormik1"
                        >
                          <Form.Label style={{ display: "flex!important" }}>
                            Email Subject
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="EmailSubject"
                            value={values.EmailSubject}
                            onChange={handleChange}
                            isInvalid={
                              touched.EmailSubject && !!errors.EmailSubject
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.EmailSubject}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          //   md="4"
                          controlId="validationFormik2"
                        >
                          <Form.Label style={{ textAlign: "left" }}>
                            Note
                          </Form.Label>
                          <Form.Control
                            as="textarea"
                            name="EmailBody"
                            id="textarea"
                            value={values.EmailBody}
                            rows="4"
                            onChange={handleChange}
                            isInvalid={touched.EmailBody && !!errors.EmailBody}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.EmailBody}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                    </CardBody>
                  </Form>
                )}
              </Formik>

              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.warning}
                onClose={this.closeWarning}
              >
                <div style={this.getModalStyle()} className={classes.paper}>
                  <Typography
                    variant="h6"
                    id="modal-title"
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ fontSize: "14px" }}>
                      Value of Amount/Currency has been changed. <br />
                      Are you sure you want to continue?
                    </div>
                    <br />

                    <div>
                      <Button
                        variant="contained"
                        style={{
                          color: "#fff",
                          backgroundColor: "#074e9e",
                          margin: "10px 0 0px 10px",
                          padding: "5px 16px",
                          fontSize: "12px"
                        }}
                        onClick={this.addpayment}
                      >
                        Ok
                      </Button>

                      <Button
                        variant="contain  ed"
                        style={{
                          color: "#fff",
                          backgroundColor: "#074e9e",
                          margin: "10px 0 0px 10px",
                          padding: "5px 16px",
                          fontSize: "12px"
                        }}
                        onClick={this.closeWarning}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Typography>
                </div>
              </Modal>

              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.success}
                onClose={this.closeSucessWarning}
              >
                <div style={this.getModalStyle()} className={classes.paper}>
                  <Typography
                    variant="h6"
                    id="modal-title"
                    style={{ textAlign: "center" }}
                  >
                    <div style={{ fontSize: "14px" }}>
                      Payment initiated successfully <br />
                    </div>
                    <br />

                    <div>
                      <Button
                        variant="contained"
                        style={{
                          color: "#fff",
                          backgroundColor: "#074e9e",
                          margin: "10px 0 0px 10px",
                          padding: "5px 16px",
                          fontSize: "12px"
                        }}
                        onClick={this.closeSucessWarning}
                      >
                        Ok
                      </Button>
                    </div>
                  </Typography>
                </div>
              </Modal>

              <CardFooter
                className="model-footer"
                style={{
                  paddingTop: "5px"
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    // margin: "10px 0px 0px 75px",
                    padding: "5px 16px",
                    fontSize: "12px",
                    textAlign: "center"
                  }}
                  disabled={
                    this.props.selectedPaymentDetails.data.payment
                      .paypalEmail === ""
                  }
                  onClick={this.callSubmit}
                >
                  Pay
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    color: "#fff",
                    //margin: "10px 60px 0px 0px",
                    padding: "5px 16px",
                    fontSize: "12px",
                    textAlign: "center"
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

export default withStyles(styles)(PaymentPage);