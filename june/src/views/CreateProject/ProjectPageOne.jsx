/**
 * ProjectPageOne component.
 * 
 * This component is used to manage the project details.
 * 
 */

import React, { Component, Fragment } from "react";

/* bootstrap 1.0 */
import { Col, Row, Container, InputGroup, Form } from "react-bootstrap";

/* form schema and validation */
import * as formik from "formik";
import * as yup from "yup";

/* file drop zone */
import { StyledDropZone } from "react-drop-zone";
import "react-drop-zone/dist/styles.css";

/* type and select */
import Select from "react-select";

/* API */
import api2 from "../../helpers/api2";

/* css */
import "./CreateProject.css";

const { Formik } = formik;

/* Form schema and validation */
const schema = yup.object().shape({
  projectName: yup.string().required("Project Name is a required field"),

  country: yup.string().required("Country is a required field"),
  location: yup.string().required("Location is a required field"),

  category: yup.string().required("Category(s) is a required field"),
  refcode: yup.string().required("Project RefCode is a required field"),

  brand: yup.string().required("Brand(s) is a required field"),
  packType: yup.string().required("Pack Type(s) is a required field"),
  variant: yup.string().required("Variant(s) is a required field"),
  size: yup.string().required("Size(s) is a required field"),

  ageFrom: yup
    .number()
    .required("Age Range-From is required field")
    .min(18)
    .max(100),
  ageTo: yup
    .number()
    .required("Age Range-To is required field")
    .min(18)
    .max(100),
  gender: yup.string().required("Gender is a required field"),

  categoriesPurchased: yup.string().required("Categories Purchased is a required field"),
  productsPurchased: yup.string().required("Products Purchased is a required field"),

  income: yup.number(),

  projectOwner: yup.string().required("Name is a required field"),
  projectOwnerEmail: yup
    .string()
    .required("Email is a required field")
    .email(),
  projectOwnerContact: yup
    .string()
    .required("Contact Number is a required field")
    .matches(/^[0-9-+() _]*$/, { message: "Only Numers and -+() are allowed" }),

  clientOwner: yup.string(),
  clientOwnerEmail: yup.string().email(),

  notes: yup.string(),

  projectImageType: yup
    .string()
    .test("match", "Only Images are allowed", val => {
      switch (val) {
        case "":
        case ".":
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

class ProjectPageOne extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ...this.propsData(props.state),
      clientOptions: [],
      states: [],
      duplicateProjectName: false,
      duplicateProjectRefCode: false,
      countries: props.countries
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.propsData(nextProps.state),
      countries: nextProps.countries
    });
  }

  componentDidMount() {
    this.getClientList();
  }

  /* Handles the api to get the list of client. */

  getClientList() {
    var self = this;

    api2
      .get("client")
      .then(resp => {
        let clientOptions = [];
        resp.data.forEach((c, i) => {
          clientOptions.push({
            label: c.clientName,
            value: c.clientName + i,
            email: c.clientOwner.email,
            name: c.clientOwner.name,
            mobile: c.clientOwner.mobile
          });
        });
        self.setState({
          clientOptions: clientOptions
        });
      })
      .catch(error => {
        console.error(error);
      });
  }


  /* Handles and return the project details. */

  propsData(props) {
    return {
      id: props.project_id,
      projectName: props.projectName,
      country: props.country,
      location: props.location,
      category: props.category,
      brand: props.brand,
      packType: props.packType,
      variant: props.variant,
      size: props.size,
      ageFrom: props.ageFrom,
      ageTo: props.ageTo,
      gender: props.gender,
      categoriesPurchased: props.categoriesPurchased,
      productsPurchased: props.productsPurchased,
      projectOwner: props.projectOwner,
      projectOwnerEmail: props.projectOwnerEmail,
      projectOwnerContact: props.projectOwnerContact,
      income: props.income,
      refcode: props.refcode,
      clientOwner: props.clientOwner,
      clientOwnerEmail: props.clientOwnerEmail,
      notes: props.notes,
      projectImage: props.projectImage,
      projectImageName: props.projectImageName
    };
  }

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
        this.form.setFieldValue("projectImage", data);
      } else {
        this.form.setFieldValue("projectImage", null);
      }
      this.form.setFieldValue("projectImageType", fileTypeCut);
      this.form.setFieldValue("projectImageName", file.name);
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

  /* Handles the event during save/navigation to next page. */
  callPageOneFromParent(activeStep) {
    this.form.setFieldValue("activeStep", activeStep);
    this.form.submitForm();
  }

  /* Handles the event during submission of this page. */
  submitProject = values => {
    if (!this.state.duplicateProjectRefCode) {
      this.props.saverefcode(values.refcode);
      this.props.pageOneOnSubmit(values);
    }

  };

  /* Handles the event to update the client details. */
  handleClientChange = e => {
    this.form.setFieldValue("clientOwner", e.name);
    this.form.setFieldValue("clientOwnerEmail", e.email);
  };

  /* Handles the event to update field. */
  handleCountryChange = e => {
    this.form.setFieldValue("country", e.label);
  };

  /* Handles the event to update selected country. */
  getSelectedCountry = country => {
    return this.state.countries.filter(c => c.label === country);
  };


  /* Handles the api to validate the duplicates in the project name . */

  projectNameCheck = projectName => {
    if (projectName.length < 1) {
      this.form.setFieldValue("duplicateProjectName", false);
      return;
    }
    api2
      .post("projects/name_check", { project_name: projectName })
      .then(resp => {
        if (resp.data.status === 200) {
          this.form.setFieldValue("duplicateProjectName", false);
        } else {
          this.form.setFieldValue("duplicateProjectName", true);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  /* Handles the api to validate the duplicates in the ref code. */
  ValidateProjectRefCode = refcode => {
    if (refcode.length < 1 || refcode === this.props.state.refcode) {
      this.form.setFieldValue("duplicateProjectRefCode", false);
      return;
    }
    api2
      .get("refcode/validate?refcode=" + refcode)
      .then(resp => {
        if (resp.status === 200) {
          this.form.setFieldValue("duplicateProjectRefCode", false);
          this.setState({ duplicateProjectRefCode: false })
        } else {
          this.form.setFieldValue("duplicateProjectRefCode", true);
          this.setState({ duplicateProjectRefCode: true })
        }
      })
      .catch(error => {
        // if(error.status === 400){
        this.form.setFieldValue("duplicateProjectRefCode", true);
        this.setState({ duplicateProjectRefCode: true })
        // }
        console.error(error);
      });
  };

  render() {
    return (
      <Fragment>
        <Formik
          validationSchema={schema}
          onSubmit={values => this.submitProject(values)}
          enableReinitialize
          initialValues={{
            ...this.state,
            projectImageType: "."
          }}
          ref={node => (this.form = node)}
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
              <Container className="group-container">
                <Row className="group-header">
                  <Col md={12} style={{ width: "100%" }}>
                    Project Details
                  </Col>
                </Row>
                <Form.Row>
                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormikprojectName"
                  >
                    <Form.Label>Project Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="projectName"
                      value={values.projectName}
                      isInvalid={touched.projectName && !!errors.projectName}
                      onChange={handleChange}
                      onBlur={e => {
                        this.projectNameCheck(e.target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.projectName}
                    </Form.Control.Feedback>
                    {values.duplicateProjectName ? (
                      <div
                        className="invalid-feedback"
                        style={{ display: "contents" }}
                      >
                        Project Name Already Exists
                      </div>
                    ) : null}
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="3"
                    controlId="validationFormikcountry"
                  >
                    <Form.Label>Country*</Form.Label>

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
                    controlId="validationFormiklocation"
                  >
                    <Form.Label>Location*</Form.Label>
                    <Form.Control
                      name="location"
                      isInvalid={touched.location && !!errors.location}
                      onChange={handleChange}
                      value={values.location}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.location}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} controlId="validationFormik01" md="3">
                    <Form.Label>Category(s)*</Form.Label>
                    <Form.Control
                      name="category"
                      isInvalid={touched.category && !!errors.category}
                      onChange={handleChange}
                      value={values.category}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.category}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikincome"
                    md="3"
                  >
                    <Form.Label>Income</Form.Label>
                    <Form.Control
                      name="income"
                      isInvalid={touched.income && !!errors.income}
                      onChange={handleChange}
                      value={values.income}
                      type="number"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.income}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="validationFormikrefcode"
                    md="3"
                  >
                    <Form.Label>Project RefCode*</Form.Label>
                    <Form.Control
                      name="refcode"
                      isInvalid={touched.refcode && !!errors.refcode}
                      onChange={handleChange}
                      value={values.refcode}
                      onBlur={e => {
                        this.ValidateProjectRefCode(e.target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.refcode}
                    </Form.Control.Feedback>
                    {values.duplicateProjectRefCode ? (
                      <div
                        className="invalid-feedback"
                        style={{ display: "contents" }}
                      >
                        Project Ref Code Already Exists
                      </div>
                    ) : null}
                  </Form.Group>

                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} md="3" controlId="validationFormikbrand">
                    <Form.Label>Brand(s)*</Form.Label>
                    <Form.Control
                      name="brand"
                      isInvalid={touched.brand && !!errors.brand}
                      onChange={handleChange}
                      value={values.brand}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.brand}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikpackType"
                    md="3"
                  >
                    <Form.Label>Pack Type(s)*</Form.Label>
                    <Form.Control
                      name="packType"
                      isInvalid={touched.packType && !!errors.packType}
                      onChange={handleChange}
                      value={values.packType}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.packType}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikvariant"
                    md="3"
                  >
                    <Form.Label>Variant(s)*</Form.Label>
                    <Form.Control
                      name="variant"
                      isInvalid={touched.variant && !!errors.variant}
                      onChange={handleChange}
                      value={values.variant}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.variant}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationFormiksize" md="3">
                    <Form.Label>Size(s)*</Form.Label>
                    <Form.Control
                      name="size"
                      isInvalid={touched.size && !!errors.size}
                      onChange={handleChange}
                      value={values.size}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.size}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group as={Col} md="6">
                    <div style={{ padding: "2% 0% 0% 0%" }}>
                      <Form.Label>Upload Project Image </Form.Label>
                      {values.projectImageName === "" ? null : (
                        <Form.Label>: {values.projectImageName}</Form.Label>
                      )}
                      <StyledDropZone onDrop={this.onDrop.bind(this)} />
                    </div>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    md="6"
                    controlId="validationFormikimageType"
                  >
                    <div style={{ color: "red" }}>
                      {errors.projectImageType}
                    </div>
                    <div style={{ padding: "2% 0% 0% 0%" }}>
                      {values.projectImage ? (
                        <img height="125px" alt="" src={values.projectImage} />
                      ) : (
                        <img height="125px" alt="" src={values.projectImage} />
                      )}
                    </div>
                  </Form.Group>
                </Form.Row>

                <Form.Row>
                  <Form.Group
                    as={Col}
                    controlId="validationFormiknotes"
                    md="12"
                  >
                    <Form.Label>Notes</Form.Label>
                    <Form.Control
                      name="notes"
                      as="textarea"
                      rows="4"
                      onChange={handleChange}
                      value={values.notes}
                    />
                  </Form.Group>
                </Form.Row>
              </Container>

              <br />

              <Container className="group-container">
                <Row className="group-header">
                  <Col md={12} style={{ width: "100%" }}>
                    Requirement Details
                  </Col>
                </Row>

                <Form.Row>
                  <Form.Group
                    as={Col}
                    controlId="validationFormikageFrom"
                    md="2"
                  >
                    <Form.Label>Age Range*</Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrependFrom">
                          From
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        name="ageFrom"
                        isInvalid={touched.ageFrom && !!errors.ageFrom}
                        onChange={handleChange}
                        value={values.ageFrom}
                        type="number"
                        placeholder="From"
                        aria-describedby="inputGroupPrependFrom"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.ageFrom}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group as={Col} controlId="validationFormikageTo" md="2">
                    <Form.Label>&nbsp;</Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrependTo">
                          To
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        name="ageTo"
                        isInvalid={touched.ageTo && !!errors.ageTo}
                        onChange={handleChange}
                        value={values.ageTo}
                        type="number"
                        placeholder="To"
                        aria-describedby="inputGroupPrependTo"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.ageTo}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikgender"
                    md="2"
                  >
                    <Form.Label>Gender*</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      isInvalid={touched.gender && !!errors.gender}
                      onChange={handleChange}
                      value={values.gender}
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="both">Both</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.gender}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikcategoriesPurchased"
                    md="3"
                  >
                    <Form.Label>Categories Purchased*</Form.Label>
                    <Form.Control
                      name="categoriesPurchased"
                      isInvalid={
                        touched.categoriesPurchased &&
                        !!errors.categoriesPurchased
                      }
                      onChange={handleChange}
                      value={values.categoriesPurchased}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.categoriesPurchased}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikproductsPurchased"
                    md="3"
                  >
                    <Form.Label>Products Purchased*</Form.Label>
                    <Form.Control
                      name="productsPurchased"
                      isInvalid={
                        touched.productsPurchased && !!errors.productsPurchased
                      }
                      onChange={handleChange}
                      value={values.productsPurchased}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.productsPurchased}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
              </Container>
              <br />

              <Container className="group-container">
                <Row className="group-header">
                  <Col md={12} style={{ width: "100%" }}>
                    Project Owner
                  </Col>
                </Row>
                <Form.Row>
                  <Form.Group
                    as={Col}
                    controlId="validationFormikprojectOwner"
                    md={5}
                  >
                    <Form.Label>Name*</Form.Label>
                    <Form.Control
                      name="projectOwner"
                      isInvalid={touched.projectOwner && !!errors.projectOwner}
                      onChange={handleChange}
                      value={values.projectOwner}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.projectOwner}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikprojectOwnerEmail"
                    md="3"
                  >
                    <Form.Label>Email*</Form.Label>
                    <Form.Control
                      name="projectOwnerEmail"
                      isInvalid={
                        touched.projectOwnerEmail && !!errors.projectOwnerEmail
                      }
                      onChange={handleChange}
                      value={values.projectOwnerEmail}
                      type="email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.projectOwnerEmail}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikprojectOwnerContact"
                    md="3"
                  >
                    <Form.Label>Contact Number*</Form.Label>
                    <Form.Control
                      name="projectOwnerContact"
                      type="number"
                      isInvalid={
                        touched.projectOwnerContact &&
                        !!errors.projectOwnerContact
                      }
                      onChange={handleChange}
                      value={values.projectOwnerContact}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.projectOwnerContact}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
              </Container>
              <br />
              <Container className="group-container">
                <Row className="group-header">
                  <Col md={12} style={{ width: "100%" }}>
                    Client Contact
                  </Col>
                </Row>
                <Form.Row>
                  <Form.Group
                    as={Col}
                    controlId="validationFormikclientName"
                    md={3}
                  >
                    <Form.Label>Select Client</Form.Label>
                    <Select
                      options={this.state.clientOptions}
                      onChange={this.handleClientChange}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    controlId="validationFormikclientOwner"
                    md={5}
                  >
                    <Form.Label>Owner Name</Form.Label>
                    <Form.Control
                      name="clientOwner"
                      isInvalid={touched.clientOwner && !!errors.clientOwner}
                      onChange={handleChange}
                      value={values.clientOwner}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.clientOwner}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    controlId="validationFormikclientOwnerEmail"
                    md="3"
                  >
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="clientOwnerEmail"
                      isInvalid={
                        touched.clientOwnerEmail && !!errors.clientOwnerEmail
                      }
                      onChange={handleChange}
                      value={values.clientOwnerEmail}
                      type="email"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.clientOwnerEmail}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form.Row>
              </Container>
            </Form>
          )}
        </Formik>
      </Fragment>
    );
  }
}

export default ProjectPageOne;