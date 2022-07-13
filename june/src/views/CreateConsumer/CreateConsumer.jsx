/**
 * CreateConsumer component.
 * 
 * This component is used to manage the consumers.
 *
 */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";

/* Material-ui */
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

/* Custom components */
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Loading from "components/Loading/Loading.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

/* Drop zone. */
import { StyledDropZone } from "react-drop-zone";
import "react-drop-zone/dist/styles.css";

/* Bootstrap 1.0. */
import { Col, Form } from "react-bootstrap";

/* Form schema and validation. */
import * as formik from "formik";
import * as yup from "yup";

/* Type and select. */
import Select from "react-select";

/* Date picker. */
import Datetime from 'react-datetime';
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

/* Api */
import api2 from "../../helpers/api2";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#074e9e"
    },
    secondary: {
      main: "#3da441"
    }
  }
});

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const { Formik } = formik;

/* Form schema and validation */

const schema = yup.object().shape({
  firstname: yup.string().required(),
  lastname: yup.string().required(),

  DateOfBirth: yup.date(),
  age: yup.number(),

  gender: yup.string().required(),
  email: yup
    .string()
    .required()
    .email(),
  mobile: yup
    .string()
    .required()
    .matches(/^[0-9-+() _]*$/, { message: "Only Numers and -+() are allowed" }),
  countryCode: yup
    .string()
    .required()
    .matches(/^[0-9-+() _]*$/, { message: "Only Numers and -+() are allowed" }),

  imageType: yup.string().test("match", "Only Images are allowed", val => {
    switch (val) {
      case "":
      case undefined:
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
      case "png":
        return true;
      default:
        return false;
    }
  })
});

class CreateConsumer extends Component {
  state = {
    // consumer values
    id: "",
    firstname: "",
    lastname: "",

    DateOfBirth: null,
    age: 0,

    country: "",
    selectedCountry: null,
    city: "",
    state: "",
    selectedState: null,
    selectedCity: null,
    countryCode: "",

    gender: "",
    email: "",
    mobile: "",

    // image
    image: "",
    consumerImageName: "",
    imageType: "",

    // view
    mode: "create",
    modeValue: "Create",

    // snackbar props
    msgColor: "info",
    message: "",
    br: false,

    // loading
    loading: false,

    countries: this.props.countries,
    states: [],
    cities: [],
    active: 1,
    fraudulent: 0,
    pass: "",
    showPassword: false,

    deSelectedMissions: [],
    selectedMissions: []
  };

  /* Handles the open event of loading symbol. */

  openLoading = () => {
    this.setState({ loading: true });
  };

  /* Handles the close event of loading symbol. */

  stopLoading = () => {
    this.setState({ loading: false });
  };

  componentDidMount() {
    let id = this.props.match.params.id;
    if (id) {
      this.setState({ mode: "view", modeValue: "Update" })
      this.getConsumer(id);
      this.getAllmissions(id)
    }
  }

  componentWillReceiveProps(props) {

    const selectedCountry = props.countries.filter(
      c => c.value === parseInt(this.state.country)
    );

    this.setState({
      countries: props.countries,
      selectedCountry: selectedCountry
    });
  }

  /* Handles the event to update field country. */

  handleCountryChange = e => {
    this.setState({ selectedCountry: e, country: e.value });
    //this.form.setFieldValue("country", e.label);
    this.getStateList(e.value);
  };

  /* Handles the event to update field state. */

  handleStateChange = e => {
    this.setState({ selectedState: e, state: e.value });
    //this.form.setFieldValue("state", e.label);
    this.getCityList(e.value);
  };

  /* Handles the event to update field city. */

  handleCityChange = e => {
    this.setState({ selectedCity: e, city: e.value });
    // this.form.setFieldValue("city", e.label);
  };

  /* Handles the event to show password. */

  showPassword = () => {
    this.setState({ showPassword: true });
  };

  /* Handles the event to hide password. */

  hidePassword = () => {
    this.setState({ showPassword: false });
  };

  /* Handles the api to fetch the country list. */

  getCountryList() {
    api2
      .get("v1/customer/countries")
      .then(resp => {

        let countries = resp.data.list.map(c => ({
          label: c.name,
          value: c.id
        }));
        const selectedCountry = countries.filter(c => c.value === parseInt(this.state.country));
        this.setState({
          countries: countries,
          selectedCountry: selectedCountry
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the api to fetch the state list. */

  getStateList = countryId => {
    api2
      .get("v1/customer/states/" + countryId)
      .then(resp => {
        let states = resp.data.list.map(c => ({
          label: c.name,
          value: c.id
        }));
        const selectedState = states.filter(c => c.value === parseInt(this.state.state));
        this.setState({
          states: states,
          selectedState: selectedState
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  /* Handles the api to fetch the city list. */

  getCityList = stateId => {
    api2
      .get("v1/customer/cities/" + stateId)
      .then(resp => {
        let cities = resp.data.list.map(c => ({
          label: c.name,
          value: c.id
        }));
        const selectedCity = cities.filter(c => c.value === parseInt(this.state.city));
        this.setState({
          cities: cities,
          selectedCity: selectedCity
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  /* Handles the api to fetch the mission list. */

  getAllmissions(id) {
    api2
      .get("allassigned?userid=" + id)
      .then(response => {
        this.setState({ selectedMissions: response.data.list.map(l => ({ ...l, value: l.mission_name, label: l.mission_name })) });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          response: true
        });
      });
  }
  /* Removes access to mission based on user id and mission id - unassignList is a list of mision ids */
  unassignMission(id) {
    const missionIds = this.state.deSelectedMissions.map(mission => mission.linked_id)
    const unassignListencode = encodeURIComponent(JSON.stringify(missionIds));
    api2
      .patch("unassignmissions?userid=" + id + "&missionid=" + unassignListencode)
      .then(response => {
        if (response.data.status === 200) {
        } else {
          this.showNotification("Error in " + response.data.message, "danger");
        }
      })
      .catch(error => {
        console.error(error);
        if (error.response && error.response.data && error.response.data.hasOwnProperty("message")) {
          this.showNotification(error.response.data.message, "danger");
        }
        else {
          this.showNotification("Customer update failed due to Server Error", "danger");
        }
      });
  }

  /* Handles the api to fetch the form details. */
  getConsumer(id) {
    this.openLoading();
    api2
      .get("web_consumer?id=" + id)
      .then(resp => {
        this.stopLoading();
        let consumer = resp.data.user_info;

        this.form.setFieldValue("id", id);
        this.form.setFieldValue("firstname", consumer.firstname);
        this.form.setFieldValue("lastname", consumer.lastname);

        this.form.setFieldValue("DateOfBirth", consumer.DateOfBirth ? moment(consumer.DateOfBirth) : "");
        this.form.setFieldValue(
          "age",
          moment().diff(consumer.DateOfBirth, "years")
        );

        this.form.setFieldValue("address", consumer.address);
        //this.form.setFieldValue("country", consumer.country);
        this.form.setFieldValue("city", consumer.cityName ? consumer.cityName : consumer.city ? consumer.city : '');
        this.form.setFieldValue("state", consumer.stateName ? consumer.stateName : consumer.state ? consumer.state : '');
        this.form.setFieldValue("zipcode", consumer.zipcode);
        this.form.setFieldValue("countryCode", consumer.countryCode);

        this.form.setFieldValue("gender", consumer.gender);
        this.form.setFieldValue("email", consumer.email);
        this.form.setFieldValue("mobile", consumer.mobile);

        this.form.setFieldValue(
          "consumerType",
          consumer.consumerType ? consumer.consumerType : ""
        );
        this.form.setFieldValue("education", consumer.education);
        this.form.setFieldValue("job", consumer.job);
        this.form.setFieldValue(
          "personalPurchaseOption",
          consumer.personalPurchaseOption
        );
        this.form.setFieldValue("presenceOfKids", consumer.presenceOfKids);
        this.form.setFieldValue("sizeOfHouseHold", consumer.sizeOfHouseHold);

        this.form.setFieldValue("image", consumer.photo);
        this.form.setFieldValue("imageType", "");

        this.setState({
          id: consumer.id,
          mode: "view",
          modeValue: "Update",
          country: consumer.country,
          state: consumer.stateName ? consumer.stateName : consumer.state ? consumer.state : '',
          city: consumer.cityName ? consumer.cityName : consumer.city ? consumer.city : '',
          active: consumer.is_active,
          fraudulent: consumer.fraudulent,
          countryCode: consumer.countryCode
        });

        this.getCountryList();
        if (consumer.country) {
          this.getStateList(this.state.country);
        }
        //this.getCityList(this.state.state);	
      })
      .catch(error => {
        this.stopLoading();
        console.error(error);
      });
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
      3000
    );
  };

  /* Handles the event to format the consumer data. */

  prepareRestData = values => {
    let obj = {
      id: values.id,
      firstname: values.firstname,
      lastname: values.lastname,

      DateOfBirth: values.DateOfBirth
        ? moment(values.DateOfBirth).format("YYYY-MM-DD")
        : "",
      age: values.age,

      country: this.state.selectedCountry && this.state.selectedCountry.value ? this.state.selectedCountry.value.toString() : "",
      city: values.city,
      state: values.state,

      gender: values.gender,
      email: values.email,
      mobile: values.mobile,
      countryCode: values.countryCode,

      is_active: this.state.active,
      fraudulent: this.state.fraudulent,

      // image: values.image,
      image: values.image ? values.image : "",
      imageType: values.imageType
    };

    if (this.state.mode === "create") {
      obj['password'] = values.pass;
    }


    return obj;
  };

  /* Handles the event during submission of data.  */

  submitForm = values => {
    let data = this.prepareRestData(values);

    if (data.id === "") {
      this.addConsumer(data);
    } else {
      this.updateConsumer(data);
    }
  };

  /* Handles the api to create a new consumer. */

  addConsumer(data) {
    this.openLoading();
    api2
      .post("web_consumer", data)
      .then(resp => {

        this.stopLoading();
        this.setState({ isCreated: true });
      })
      .catch(error => {
        this.stopLoading();
        if (error.response.data.hasOwnProperty("message")) {
          this.showNotification(error.response.data.message, "danger");
        }
      });
  }

  /* Handles the api to update a consumer. */

  updateConsumer(data) {
    this.openLoading();
    if (this.state.deSelectedMissions && this.state.deSelectedMissions.length > 0) {
      this.unassignMission(data.id)
    }
    api2
      .patch("web_consumer", data)
      .then(resp => {

        this.stopLoading();
        this.setState({
          mode: "view",
          modeValue: "Update"
        });

        if (resp.data.status === 200) {
          this.showNotification("Consumer Updated", "success");
        } else {
          this.showNotification("Error in " + resp.data.message, "danger");
        }
      })
      .catch(error => {
        this.stopLoading();
        if (error.response && error.response.data && error.response.data.hasOwnProperty("message")) {
          this.showNotification(error.response.data.message, "danger");
        }
        else {
          this.showNotification("Customer update failed due to Server Error", "danger");
        }
      });
  }

  /* Handles the event to update field state. */

  editActive = () => {
    this.setState({
      active: this.state.active === 1 ? 0 : 1
    });
  };

  /* Handles the event to update field state. */
  editFraudulent = () => {
    this.setState({
      fraudulent: this.state.fraudulent === 1 ? 0 : 1
    });
  };

  /* Handles the event to submit form. */

  callSubmit = () => {
    this.form.submitForm();
  };

  /* Formation of data in base64 format. */

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /* Handles the drop of an image in the drop zone. */
  onDrop(file) {
    this.getBase64(file).then(data => {
      const fileTypeCut = file.type.split("/")[1];

      if (this.isImage(fileTypeCut)) {
        this.form.setFieldValue("image", data);
      } else {
        this.form.setFieldValue("image", null);
      }
      this.form.setFieldValue("imageType", fileTypeCut);
      this.form.setFieldValue("consumerImageName", file.name);
    });
  }

  /* Validates the format of image type. */

  isImage(filename) {
    switch (filename) {
      case "jpg":
      case "jpeg":
      case "gif":
      case "bmp":
      case "png":
        //etc
        return true;
      default:
        return false;
    }
  }

  /* Handles the close event of loading symbol. */
  handleClose = () => {
    this.setState({ open: false });
  };

  /* Handles the event when user clicks cancel button. */
  handleBack = () => {
    this.setState({ isCreated: true });
  };

  missionChangeHandler = (values, option) => {
    if (option.action === 'remove-value') {
      this.setState({ selectedMissions: [...values], deSelectedMissions: [...this.state.deSelectedMissions, option.removedValue] })
    } else if (option.action === "select-option") {
      this.setState({ selectedMissions: [...values, option.option], deSelectedMissions: [...this.state.deSelectedMissions.filter(dOption => (dOption.linked_id !== option.option.linked_id))] })
    }
  }

  render() {
    const { classes } = this.props;
    const { isCreated, selectedCountry, mode } = this.state;
    const { msgColor, br, message } = this.state;

    if (isCreated) {
      return <Redirect to="/home/consumers" />;
    }

    let body_class = this.props.fullWidth
      ? "body-form body-form-expanded"
      : "body-form body-form-collapsed";
    return (
      <MuiThemeProvider theme={theme}>
        <div className={body_class}>
          <GridContainer style={{ width: "95%", height: "auto" }}>
            <Card style={{ height: "auto" }}>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>{mode === 'view' ? 'View Consumer' : 'Create Consumer'}</h4>

              </CardHeader>
              <Formik
                validationSchema={schema}
                onSubmit={values => {
                  this.submitForm(values);
                }}
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
                        <Form.Group as={Col} md="3">
                          <Form.Row>
                            <Form.Group className="mb-0 consumer-dropzone" as={Col} md="12">
                              <Form.Label>Upload Consumer Image </Form.Label>
                              {values.consumerImageName === "" ? null : (
                                <Form.Label>
                                  : {values.consumerImageName}
                                </Form.Label>
                              )}
                              <StyledDropZone onDrop={this.onDrop.bind(this)} />
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="12"
                              controlId="validationFormikimageType"
                            >
                              <div style={{ color: "red" }}>{errors.imageType}</div>
                              <div style={{ padding: "2% 0% 0% 0%" }}>
                                {values.image ? (
                                  <img height="125px" alt="" src={values.image} />
                                ) : (
                                  <img height="125px" alt="" src={values.image} />
                                )}
                              </div>
                            </Form.Group>
                          </Form.Row>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Row>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId="validationFormik11"
                            >
                              <Form.Label>First Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="firstname"
                                value={values.firstname}
                                onChange={handleChange}
                                isInvalid={touched.firstname && !!errors.firstname}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.firstname}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId="validationFormik12"
                            >
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="lastname"
                                value={values.lastname}
                                onChange={handleChange}
                                isInvalid={touched.lastname && !!errors.lastname}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.lastname}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Row>
                          <Form.Row>
                            <Form.Group
                              as={Col}
                              md="6"
                              controlId="validationFormik41"
                            >
                              <Form.Label>Gender</Form.Label>
                              <Form.Control
                                as="select"
                                name="gender"
                                value={values.gender}
                                onChange={handleChange}
                                isInvalid={touched.gender && !!errors.gender}
                              >
                                <option value="select">Select Gender</option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                                <option value="3">Prefer not to answer</option>
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                {errors.gender}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="4"
                              controlId="validationFormik13"
                            >
                              <Form.Label>Date of Birth</Form.Label> <br />
                              <Datetime
                                name="endDate"
                                dateFormat="DD/MM/YYYY"
                                value={values.DateOfBirth}
                                timeFormat={false}
                                onChange={e => {
                                  this.form.setFieldValue("DateOfBirth", e ? e : "");
                                  this.form.setFieldValue(
                                    "age",
                                    moment().diff(e, "years")
                                  );
                                }}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.DateOfBirth}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="2"
                              controlId="validationFormik14"
                            >
                              <Form.Label>Age</Form.Label>
                              <Form.Control
                                disabled
                                type="number"
                                name="age"
                                value={values.age}
                                onChange={handleChange}
                                isInvalid={touched.age && !!errors.age}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.age}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Form.Row>
                          <Form.Row>
                            <Form.Group
                              as={Col}
                              md="3"
                              controlId="validationFormik15"
                            >
                              <Button
                                variant="contained"
                                color={
                                  this.state.active === 1 ? "secondary" : "default"
                                }
                                onClick={this.editActive}
                              >
                                {this.state.active === 1 ? "Active" : "InActive"}
                              </Button>

                            </Form.Group>
                            <Form.Group
                              as={Col}
                              md="3"
                              controlId="validationFormik16"
                            >
                              <Button
                                variant="contained"
                                color={
                                  this.state.fraudulent === 1 ? "secondary" : "default"
                                }
                                onClick={this.editFraudulent}
                              >
                                {this.state.fraudulent === 1 ? "Fraudulent" : "Fraudulent"}
                              </Button>
                            </Form.Group>
                          </Form.Row>
                        </Form.Group>
                        <Form.Group as={Col} md="3">
                          {
                            this.state.selectedMissions && this.state.selectedMissions.length > 0
                              ?
                              <Form.Group className="mb-0 consumer-dropzone" as={Col} md="12">
                                <Form.Label>Assigned Missions</Form.Label>
                                <Select
                                  defaultValue={[]}
                                  menuIsOpen
                                  isMulti
                                  name="missions"
                                  options={this.state.deSelectedMissions}
                                  value={this.state.selectedMissions}
                                  onChange={this.missionChangeHandler}
                                  className="basic-multi-select mission-multi-select"
                                  classNamePrefix="mission-select"
                                  maxMenuHeight={300}
                                />
                              </Form.Group>
                              :
                              null
                          }
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik32"
                        >
                          <Form.Label>Country</Form.Label>

                          <Select
                            as="select"
                            name="country"
                            value={selectedCountry}
                            options={this.state.countries}
                            onChange={this.handleCountryChange}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.country}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik22"
                        >
                          <Form.Label>State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            value={values.state}
                            onChange={handleChange}
                            isInvalid={touched.state && !!errors.state}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik22"
                        >
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={values.city}
                            onChange={handleChange}
                            isInvalid={touched.city && !!errors.city}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationFormik42"
                        >
                          <Form.Label>Email Id</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={touched.email && !!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="2"
                          controlId="validationFormik31"
                        >
                          <Form.Label>Country Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="countryCode"
                            value={values.countryCode}
                            onChange={handleChange}
                            isInvalid={touched.countryCode && !!errors.countryCode}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.countryCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormike43"
                        >
                          <Form.Label>Contact</Form.Label>
                          <Form.Control
                            type="text"
                            name="mobile"
                            value={values.mobile}
                            onChange={handleChange}
                            isInvalid={touched.mobile && !!errors.mobile}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.mobile}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>
                      <Form.Row>

                      </Form.Row>


                      {this.state.mode === "create" &&
                        <Form.Row>
                          <Form.Group
                            as={Col}
                            md="3"
                            controlId="validationFormik61"
                          >
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                              // type="text"
                              type={
                                this.state.showPassword === true
                                  ? "text"
                                  : "password"
                              }
                              name="pass"
                              value={values.pass}
                              onChange={handleChange}
                              isInvalid={
                                touched.pass &&
                                !!errors.pass
                              }
                            />
                            <div
                              className="password"
                              style={{
                                float: "right",
                                marginTop: "-30px",
                                marginRight: "5px"
                              }}
                            >
                              {this.state.showPassword === true ? (
                                <i
                                  className="fas fa-eye"
                                  onClick={this.hidePassword}
                                />
                              ) : (
                                <i
                                  className="far fa-eye-slash"
                                  onClick={this.showPassword}
                                />
                              )}
                            </div>

                            <Form.Control.Feedback type="invalid">
                              {errors.pass}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form.Row>
                      }

                      <br />
                    </CardBody>
                  </Form>
                )
                }
              </Formik>

              <CardFooter style={{ padding: "1rem 22px" }}>
                <Button onClick={this.handleBack} variant="contained"
                  color="primary">Cancel</Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.callSubmit}
                >
                  {this.state.modeValue}
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

export default withStyles(styles)(CreateConsumer);
