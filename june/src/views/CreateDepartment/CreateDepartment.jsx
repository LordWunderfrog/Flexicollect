/**
 * CreateDepartment component.
 *
 * This component is used to manage the department.
 * 
 */

import React, { Component } from "react";
import { Redirect } from "react-router-dom";

/* Material UI. */
import withStyles from "@material-ui/core/styles/withStyles";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

/* Custom components. */
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import Loading from "components/Loading/Loading.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";
/* Type and select. */
import Select from "react-select";

/* Drop zone. */
import { StyledDropZone } from "react-drop-zone";
import "react-drop-zone/dist/styles.css";

/* Bootstrap 1.0. */
import { Col, Form } from "react-bootstrap";

/* Form schema and validation. */
import * as formik from "formik";
import * as yup from "yup";

/* Api. */
import api2 from "../../helpers/api2";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#074e9e"
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

/* Form schema and validation. */
const { Formik } = formik;

const schema = yup.object().shape({
  departmentName: yup.string().required(),

  country: yup.string().required(),
  location: yup.string().required(),

  //tags: yup.string().required("category is a required field"),

  owner: yup.string().required(),
  email: yup
    .string()
    .required()
    .email(),
  mobile: yup
    .string()
    .required()
    .matches(/^[0-9-+() _]*$/, { message: "Only Numers and -+() are allowed" }),

  notes: yup.string(),
  departmentImageSize: yup
    .number()
    .max(500000, "Image size should be less then 500KB"),

  departmentImageType: yup
    .string()
    .test("match", "Only Images are allowed", val => {
      switch (val) {
        case "":
        case undefined:
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
    })
});

class CreateDepartment extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      /* Dept values. */
      id: "",
      departmentName: "",
      country: "",
      location: "",
      tags: "",
      notes: "",

      /* Dept owner details. */
      owner: "",
      email: "",
      mobile: "",

      /* Image. */
      departmentImage: "",
      departmentImageName: "",
      departmentImageType: "",
      departmentImageSize: 0,

      /* View. */
      mode: "create",
      modeValue: "Create",

      /* Snackbar props. */
      msgColor: "info",
      message: "",
      br: false,

      /* Loading. */
      loading: false
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

  componentDidMount() {
    let id = this.props.match.params.id;
    if (id) this.getDepartment(id);
    // api2.get("department/names").then(resp => {
    //   //console.log(resp);
    // });
  }

  /* Handles the api to fetch the form details. */
  getDepartment(id) {
    this.openLoading();
    api2
      .get("department?id=" + id)
      .then(resp => {
        this.stopLoading();
        let dept = resp.data;
        if (String(dept.id) === String(id)) {
          this.form.setFieldValue("id", dept.id);
          this.form.setFieldValue("departmentName", dept.departmentName);
          this.form.setFieldValue("departmentImage", dept.departmentImage);
          this.form.setFieldValue("departmentImageType", "");
          this.form.setFieldValue("country", dept.country);
          this.form.setFieldValue("owner", dept.departmentOwner.name);
          this.form.setFieldValue("email", dept.departmentOwner.email);
          this.form.setFieldValue("mobile", dept.departmentOwner.mobile);
          this.form.setFieldValue("location", dept.location);
          this.form.setFieldValue("tags", dept.tags);
          this.form.setFieldValue("notes", dept.notes);

          this.setState({
            id: dept.id,
            mode: "view",
            modeValue: "Edit"
          });
        }
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

  /* Handles the event to format the department data. */
  prepareRestData = values => {
    return {
      id: values.id,
      departmentName: values.departmentName,
      country: values.country,
      location: values.location,
      tags: values.tags,
      departmentOwner: {
        name: values.owner,
        email: values.email,
        mobile: values.mobile
      },
      departmentImage: values.departmentImage,
      departmentImageType: values.departmentImageType,
      notes: values.notes
    };
  };

  /* Handles the event during submission of data.  */
  submitForm = values => {
    let data = this.prepareRestData(values);
    if (data.id === "") {
      this.addDepartment(data);
    } else {
      this.updateDepartment(data);
    }
  };


  /* Handles the api to create a new department. */
  addDepartment(data) {
    this.openLoading();
    api2
      .post("department", data)
      .then(resp => {
        this.stopLoading();
        this.props.updateDepartmentList();
        this.setState({ isCreated: true });
      })
      .catch(error => {
        this.stopLoading();
        console.error(error);
      });
  }


  /* Handles the api to update a department. */

  updateDepartment(data) {
    this.openLoading();
    api2
      .patch("department", data)
      .then(resp => {
        this.stopLoading();
        this.setState({
          mode: "view",
          modeValue: "Edit"
        });
        if (resp.data.status === 1) {
          this.showNotification("Department Saved", "success");
        } else {
          this.showNotification("Error in " + resp.data.error, "danger");
        }
      })
      .catch(error => {
        this.stopLoading();
        console.error(error);
      });
  }

  /* Handles the event to update. */

  editItem = () => {
    if (this.state.modeValue === "Edit" && this.state.mode === "view") {
      this.setState({
        modeValue: "Update",
        mode: "update"
      });
    }
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
        this.form.setFieldValue("departmentImage", data);
      } else {
        this.form.setFieldValue("departmentImage", null);
      }
      this.form.setFieldValue("departmentImageType", fileTypeCut);
      this.form.setFieldValue("departmentImageSize", file.size);
      this.form.setFieldValue("departmentImageName", file.name);
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

  /* Handles the event to update field country. */
  handleCountryChange = e => {
    this.form.setFieldValue("country", e.label);
  };

  /* Handles the event to update the selected value. */
  getSelectedCountry = country => {
    return this.props.countries.filter(c => c.label === country);
  };

  render() {
    const { classes } = this.props;
    const { isCreated } = this.state;
    const { msgColor, br, message } = this.state;

    if (isCreated) {
      return <Redirect to="/home/departments" />;
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
                <h4 className={classes.cardTitleWhite}>{this.state.mode === "view" ? "View Department" : "Create Department"}</h4>
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
                          md="6"
                          controlId="validationFormik01"
                        >
                          <Form.Label>Department Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="departmentName"
                            value={values.departmentName}
                            onChange={handleChange}
                            isInvalid={
                              touched.departmentName && !!errors.departmentName
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.departmentName}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik02"
                        >
                          <Form.Label>Country</Form.Label>
                          <Select
                            as="select"
                            name="country"
                            value={this.getSelectedCountry(values.country)}
                            options={this.props.countries}
                            onChange={this.handleCountryChange}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.country}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="3"
                          controlId="validationFormik03"
                        >
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            name="location"
                            value={values.location}
                            onChange={handleChange}
                            isInvalid={touched.location && !!errors.location}
                          />

                          <Form.Control.Feedback type="invalid">
                            {errors.location}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row>

                      {/*  <Form.Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationFormikTags"
                        >
                          <Form.Label>Categories</Form.Label>
                          <Form.Control
                            type="text"
                            name="tags"
                            value={values.tags}
                            onChange={handleChange}
                            isInvalid={touched.tags && !!errors.tags}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.tags}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Form.Row> */}

                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationFormik04"
                        >
                          <Form.Label>Department Owner</Form.Label>

                          <Form.Control
                            type="text"
                            name="owner"
                            value={values.owner}
                            onChange={handleChange}
                            isInvalid={touched.owner && !!errors.owner}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.owner}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="4"
                          controlId="validationFormikEmail"
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
                          md="4"
                          controlId="validationFormikeContact"
                        >
                          <Form.Label>Contact Number</Form.Label>

                          <Form.Control
                            type="number"
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
                        <Form.Group as={Col} md="6">
                          <div style={{ padding: "2% 0% 0% 0%" }}>
                            <Form.Label>Upload Department Image </Form.Label>
                            {values.departmentImageName === "" ? null : (
                              <Form.Label>
                                : {values.departmentImageName}
                              </Form.Label>
                            )}
                            <StyledDropZone accept={"image/png, image/gif, image/jpeg, image/*"} onDrop={this.onDrop.bind(this)} />
                          </div>
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          md="6"
                          controlId="validationFormikimageType"
                        >
                          <div style={{ color: "red" }}>
                            {errors.departmentImageType}
                          </div>
                          <div style={{ color: "red" }}>
                            {errors.departmentImageSize}
                          </div>
                          <div style={{ padding: "2% 0% 0% 0%" }}>
                            {values.departmentImage ? (
                              <img
                                height="125px"
                                alt=""
                                src={values.departmentImage}
                              />
                            ) : (
                              <img
                                height="125px"
                                alt=""
                                src={values.departmentImage}
                              />
                            )}
                          </div>
                        </Form.Group>
                      </Form.Row>
                      <br />

                      <Form.Row>
                        <Form.Group
                          as={Col}
                          md="12"
                          controlId="ControlTextarea1"
                        >
                          <Form.Label>Notes</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="notes"
                            rows="4"
                            value={values.notes}
                            onChange={handleChange}
                          />
                        </Form.Group>
                      </Form.Row>
                    </CardBody>
                  </Form>
                )}
              </Formik>

              <CardFooter style={{ padding: "1rem 22px" }}>
                <Button onClick={this.handleBack} variant="contained"
                  color="primary">Cancel</Button>
                {this.state.mode === "view" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.callSubmit}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.callSubmit}
                  >
                    {this.state.modeValue}
                  </Button>
                )}
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

export default withStyles(styles)(CreateDepartment);
