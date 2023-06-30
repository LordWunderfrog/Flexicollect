/**
 * ProjectPageTwo component.
 * 
 * This component is used to manage the missions under project.
 * 
 */

import React, { Component, Fragment } from "react";

/* Material UI. */
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";

/* File drop zone */
import { StyledDropZone } from "react-drop-zone";
import "react-drop-zone/dist/styles.css";

/* Type and select */
import Select from "react-select";

/* Date picker */
// import DatePicker from "react-datepicker";
import Datetime from 'react-datetime';
import "./ReactDateTime.css"


/* Bootstrap 1.0 */
import { Col, Row, Container, Form } from "react-bootstrap";

/* Form schema and validation */
import * as formik from "formik";
import * as yup from "yup"; // for everything

/* API */
import api2 from "../../helpers/api2";

/* Custom Component */
import AlertDialog from "components/AlertDialog/AlertDialog";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#304ffe"
    },
    secondary: {
      main: "#074e9e"
    }
  }
});

/* Handles the validation of fields. */
const { Formik } = formik;
const schema = yup.object().shape({
  missionName: yup.string().required(),
  refcode: yup.string().required(),

  description: yup.string(),
  submission: yup
    .string()
    .matches(/^[0-9 _]*$/, { message: "Only Numers allowed" }),

  multiplesubmission: yup
    .string()
    .matches(/^[0-9 _]*$/, { message: "Only Numers allowed" }),

  missionPoints: yup.number().min(0),

  onboard: yup.string(),
  screener: yup.string(),
  survey: yup.string().required(),
  status: yup.boolean(),

  endDate: yup.date(),
  startDate: yup.date(),
  paymentAmount: yup
    .string()
    .matches(/^[0-9]*\.?[0-9]*$/, { message: "Only Numers allowed" }),
  paymentEnabled: yup.boolean(),
  paymentCurrency: yup.string(),

  missionImageType: yup
    .string()
    .test("match", "Only Images are allowed", val => {
      switch (val) {
        case "":
        case undefined:
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

class ProjectPageTwo extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      options: [],
      missionOptions: [],
      mission_list: [],
      selectedMission: null,
      dialogOpen: false,
      deleteMissionName: "",
      deleteMissionId: "",
      deleteMissionIndex: "",
      duplicateMissionRefCode: false,
      selectedmissionid: null,
      refcode: ""
    };
  }

  /* Handles the survey update. */
  getSelectObj = id => {
    let opt = this.state.options.find(x => x.value == id);
    return opt ? opt : { value: "0", points: 0, label: "Select" };
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.state.updateMissFields) this.onPropsReceived(nextProps.state);
  }

  componentDidMount() {
    this.getSurveyList();
    //this.createNewMission();
    if (this.props.state.updateMissFields)
      this.onPropsReceived(this.props.state);
  }

  /* Handles the api to get the list of surveys. */
  getSurveyList() {
    api2
      .get("lite_survey")
      .then(resp => {
        this.setState({ options: resp.data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the update of mission list. */
  onPropsReceived(props) {
    let i = 0;
    let missionOptions = [];
    props.mission_list.forEach((x, index) => {
      if (x.status) i++;
      missionOptions.push({ label: x.missionName, value: index, id: x.id });
    });

    let newProp = {};
    newProp.mission_list = props.mission_list;
    newProp.activeMissions = i;
    newProp.missionOptions = missionOptions;

    if (props.mission_list && props.mission_list.length === 0) {

      this.createNewMission('createref');
    }

    // default selected mission
    if (
      missionOptions.length > 0 &&
      props.selectedMissionIndex < missionOptions.length
    ) {
      const selectMissIndex = props.selectedMissionIndex;
      if (props.mission_list[selectMissIndex].refcode && props.mission_list[selectMissIndex].refcode === ""
      ) {
        this.setState({ selectedmissionid: props.mission_list[selectMissIndex].id })
        this.generaterefcode('generate');

      }
      newProp.selectedMission = missionOptions[selectMissIndex];
      // newProp.selectedMission.refcode = this.state.refcode
      this.setFormFields(
        this.formatFormMissionData(props.mission_list[selectMissIndex])
      );
    } else {
      newProp.selectedMission = null;
    }

    this.setState({
      ...newProp
    });
  }

  /* Handles the api to generate the ref code. */
  generaterefcode(check) {
    let refcode = ""
    api2
      .get("refcode/generate?type=M")
      .then(resp => {
        if (resp.status === 200) {
          refcode = resp.data.message;
          if (check === 'generate') {
            this.saverefcode(check, refcode);
          } else {
            if ((this.state.mission_list.length > 0 && this.state.mission_list[this.props.state.selectedMissionIndex].refcode &&
              this.state.mission_list[this.props.state.selectedMissionIndex].refcode === "") ||
              (this.state.mission_list.length > 0 && !this.state.mission_list[this.props.state.selectedMissionIndex].refcode) ||
              check === 'createref') {
              this.form.setFieldValue("refcode", refcode);
            }
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the api to save the ref code. */
  saverefcode(check, refcode) {
    api2
      .get("refcode/save?refcode=" + refcode)
      .then(resp => {
        if (resp.status === 200) {
          this.updatemissionrefcode(refcode)
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the api to update the ref code. */
  updatemissionrefcode(refcode) {
    let id = this.state.selectedmissionid;
    api2
      .get("refcode/update?refcode=" + refcode + "&mission_id=" + id)
      .then(resp => {
        if (resp.status === 200) {
          this.setState({
            refcode: refcode
          }, () => {
            let mission_list = this.state.mission_list
            mission_list[this.props.state.selectedMissionIndex].refcode = refcode
            this.setState({ mission_list: mission_list })
            this.setFormFields(
              this.formatFormMissionData(this.state.mission_list[[this.props.state.selectedMissionIndex]])
            );
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the formation of mission data. */
  setFormFields = mission => {
    this.form.setFieldValue("id", mission.id);
    this.form.setFieldValue("missionName", mission.missionName);
    this.form.setFieldValue("submission", mission.submission);
    this.form.setFieldValue("description", mission.description);
    this.form.setFieldValue("missionPoints", mission.missionPoints);
    this.form.setFieldValue("onboard", mission.onboard);
    this.form.setFieldValue("screener", mission.screener);
    this.form.setFieldValue("survey", mission.survey);
    this.form.setFieldValue("status", mission.status);
    this.form.setFieldValue("endDate", mission.endDate);
    this.form.setFieldValue("startDate", mission.startDate);
    this.form.setFieldValue("missionImage", mission.missionImage);
    this.form.setFieldValue("missionImageType", ".");
    this.form.setFieldValue("missionImageName", "");
    this.form.setFieldValue("radioGroup", mission.radioGroup);
    this.form.setFieldValue("multiplesubmission", mission.multiplesubmission);
    this.form.setFieldValue("paymentEnabled", mission.paymentEnabled);
    this.form.setFieldValue("paymentAmount", mission.paymentAmount);
    this.form.setFieldValue("paymentCurrency", mission.paymentCurrency);
    this.form.setFieldValue("refcode", mission.refcode);
    this.form.setFieldValue("linkedMissions", mission.linkedMissions);

  };

  /* Validate and return the formated mission data. */
  formatFormMissionData(props) {
    return {
      id: props ? props.id : "",
      missionName: props ? props.missionName : "",
      description: props ? props.description : "",
      submission: props && props.submission && props.submission > 0 ? props.submission : "",
      missionPoints: props ? props.missionPoints : "",
      status: props ? props.status : "",
      endDate: props.endDate ? props.endDate : undefined,
      startDate: props.startDate ? props.startDate : undefined,
      onboard: props ? props.onboard : "",
      survey: props ? props.survey : "",
      screener: props ? props.screener : "",
      missionImage: props ? props.missionImage : "",
      radioGroup: props ? props.radioGroup : "",
      multiplesubmission: props && props.multiplesubmission && props.multiplesubmission > 0
        ? props.multiplesubmission : "",
      paymentAmount:
        props && props.paymentAmount && props.paymentAmount > 0
          ? props.paymentAmount
          : 0,
      paymentEnabled: props ? props.paymentEnabled : "",
      paymentCurrency: props ? props.paymentCurrency : "",
      refcode: props ? props.refcode : "",
      linkedMissions: props ? props.linkedMissions : [],
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
        this.form.setFieldValue("missionImage", data);
      } else {
        this.form.setFieldValue("missionImage", null);
      }
      this.form.setFieldValue("missionImageType", fileTypeCut);
      this.form.setFieldValue("missionImageName", file.name);
    });
  }

  /* Validate the format of image type. */
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

  /* Handles the update of selected mission. */
  handleChange = selectedMission => {
    this.setState({ selectedMission });
    let selectedmissiondetail = this.state.mission_list[selectedMission.value];
    if (selectedmissiondetail && !selectedmissiondetail.refcode
    ) {
      this.setState({ selectedmissionid: selectedmissiondetail.id })
      this.props.state.selectedMissionIndex = selectedMission.value
      this.generaterefcode('generate');

    }

    this.setFormFields(
      this.formatFormMissionData(this.state.mission_list[selectedMission.value])
    );
  };

  /* Validate the form to clear the fields. */
  createNewMission = (check) => {
    this.form.resetForm({});
    this.form.setFieldValue("missionName", "");
    this.form.setFieldValue("description", "");
    this.form.setFieldValue("submission")
    this.form.setFieldValue("missionImageType", ".");
    this.form.setFieldValue("missionImageName", "");
    this.form.setFieldValue("missionImage", "");
    this.form.setFieldValue("missionPoints", 0);
    this.form.setFieldValue("survey", "");
    this.form.setFieldValue("radioGroup", "multiple");
    this.form.setFieldValue("multiplesubmission", 0);
    this.form.setFieldValue("paymentAmount", 0);
    this.form.setFieldValue("paymentEnabled", 0);
    this.form.setFieldValue("paymentCurrency", "EUR");
    this.form.setFieldValue("linkedMissions", '');
    this.generaterefcode(check)
    this.setState({ selectedMission: null });
  };

  /* Handles mission deletion in CreateProject.jsx. */
  deleteSelectedMission = () => {
    this.props.deleteSelectedMission(
      this.state.selectedMission.id,
      this.state.selectedMission.value
    );
  };

  /* Handles the delete and update of mission. */
  deleteItem = () => {
    this.setState({
      dialogOpen: true,
      deleteMissionId: this.state.selectedMission.id,
      deleteMissionName: this.state.selectedMission.label
    });
  };


  /* Handles the close event of popup. */
  handleDialogClose = deleteMission => event => {
    if (deleteMission) {
      this.props.deleteSelectedMission(
        this.state.selectedMission.id,
        this.state.selectedMission.value
      );
    }
    this.setState({ dialogOpen: false });
  };


  /* Handles the event during save/navigation to next page. */
  callPageTwoFromParent(activeStep) {
    this.form.setFieldValue("activeStep", activeStep);
    this.form.submitForm();
  }


  /* Handles the event during submission of this page. */
  submitMission = values => {
    values.selectedMissionIndex = this.state.selectedMission
      ? this.state.selectedMission.value
      : this.state.missionOptions.length;
    // call function at parent component
    //this.missionRefCode(values.refcode)
    if (!this.state.duplicateMissionRefCode) {
      this.props.saverefcode(values.refcode);
      let paymentAmount = parseFloat(values.paymentAmount).toFixed(2)
      values.paymentAmount = paymentAmount
      this.props.pageTwoOnSubmit(values);

    }

    // // call function at parent component
    // this.props.pageTwoOnSubmit(values);
  };

  /* Handles the validation of reference code. */
  missionRefCode = refcode => {
    if (refcode.length < 1 || (this.state.mission_list.length > 0 &&
      this.state.mission_list[this.props.state.selectedMissionIndex].refcode)) {
      this.form.setFieldValue("duplicateMissionRefCode", false);
      return;
    }
    api2
      .get("refcode/validate?refcode=" + refcode)
      .then(resp => {
        if (resp.status === 200) {
          this.form.setFieldValue("duplicateMissionRefCode", false);
          this.setState({ duplicateMissionRefCode: false })
        } else {
          this.form.setFieldValue("duplicateMissionRefCode", true);
          this.setState({ duplicateMissionRefCode: true })
        }
      })
      .catch(error => {
        // if(error.status === 400){
        this.form.setFieldValue("duplicateMissionRefCode", true);
        this.setState({ duplicateMissionRefCode: true })
        // }
        console.error(error);
      });
  };


  render() {
    return (
      <Fragment>
        <Formik
          validationSchema={schema}
          onSubmit={values => this.submitMission(values)}
          ref={node => (this.form = node)}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
            submitCount
          }) => (

            <Form noValidate onSubmit={handleSubmit}>
              <Container className="group-container">
                <Row className="group-header">
                  <Col md={4}>
                    <Select
                      name="selectedMission"
                      value={this.state.selectedMission}
                      onChange={this.handleChange}
                      options={this.state.missionOptions}
                    />
                  </Col>
                  <Col md={"auto"}>
                    <Button
                      onClick={() => this.createNewMission('createref')}
                      variant="contained"
                      color="primary"
                      disabled={this.state.selectedMission === null}
                    >
                      Create New Mission
                    </Button>
                  </Col>
                  <Col md={"auto"}>
                    <Button
                      onClick={this.deleteItem}
                      variant="contained"
                      color="primary"
                      disabled={this.state.selectedMission === null}
                    >
                      Delete Mission
                    </Button>
                  </Col>
                  <Col md={"auto"}>
                    All Missions ({this.state.mission_list.length})
                  </Col>
                  <Col md={"auto"} style={{ textAlign: "right" }}>
                    Active ({this.state.activeMissions})
                  </Col>
                </Row>
                <Form.Row>
                  <Form.Group
                    controlId="validationFormikmissionName"
                    as={Col}
                    md="5"
                  >
                    <Form.Label>Mission Name*</Form.Label>
                    <Form.Control
                      type="text"
                      name="missionName"
                      onChange={handleChange}
                      isInvalid={touched.missionName && !!errors.missionName}
                      value={values.missionName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.missionName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  {values.id ? (
                    <Form.Group
                      controlId="validationFormikactive"
                      as={Col}
                      md="1"
                    >
                      <Form.Label>Active</Form.Label>
                      <br />
                      <MuiThemeProvider theme={theme}>
                        <Switch
                          name="status"
                          value={values.status}
                          checked={values.status}
                          onChange={(e, c) => {
                            this.form.setFieldValue("status", c);
                          }}
                        />
                      </MuiThemeProvider>
                    </Form.Group>
                  ) : null}
                  <Form.Group
                    controlId="validationFormikstartDate"
                    as={Col}
                    md="3"
                  >
                    <Form.Label>Start Date</Form.Label> <br />
                    <Datetime
                      name="startDate"
                      dateFormat="DD/MM/YYYY"
                      value={values.startDate}
                      onChange={e => {
                        this.form.setFieldValue("startDate", e ? e : "")
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {/* {errors.startDate} */}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group
                    controlId="validationFormikendDate"
                    as={Col}
                    md="3"
                  >
                    <Form.Label>End Date</Form.Label> <br />
                    <Datetime
                      name="endDate"
                      dateFormat="DD/MM/YYYY"
                      value={values.endDate}
                      onChange={e => {
                        this.form.setFieldValue("endDate", e ? e : "")
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endDate}
                    </Form.Control.Feedback>
                  </Form.Group>


                </Form.Row>


                {/* 2nd row start */}
                <Form.Row>
                  <Form.Group
                    as={Col}
                    md="4"
                    controlId="validationFormiksubmission"
                  >
                    <Form.Label>Maximum Number Of submission</Form.Label>

                    <Form.Control
                      name="submission"
                      style={{
                        display: "block",
                        width: "90%"
                      }}
                      isInvalid={
                        touched.submission &&
                        !!errors.submission
                      }
                      value={values.submission}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.submission}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md="8" controlId="validationFormiksubmission">
                    <Form.Label component="legend">
                      Number of submission per User
                    </Form.Label>
                    <Form.Row>

                      <RadioGroup
                        style={{
                          display: "block",
                          // width: "80%"
                        }}
                        id="radioGroup"
                        name="radioGroup"
                        value={values.radioGroup}

                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="single"
                          control={
                            <Radio
                              color="primary"
                              checked={
                                values.radioGroup === "single" ? true : false
                              }
                            />
                          }
                          label="Single Submission per User"
                        />

                        <FormControlLabel

                          value="multiple"
                          control={
                            <Radio
                              color="primary"
                              checked={
                                values.radioGroup === "multiple" ? true : false
                              }
                            />
                          }
                          label="Multiple Submission per User"
                        />
                      </RadioGroup>
                      <Form.Control
                        name="multiplesubmission"
                        style={{
                          display: "block",
                          width: "20%"
                        }}
                        isInvalid={
                          touched.multiplesubmission &&
                          !!errors.multiplesubmission
                        }
                        onChange={handleChange}
                        value={
                          values.radioGroup === "multiple" && values.multiplesubmission && values.multiplesubmission !== 0
                            ? values.multiplesubmission
                            : ""
                        }
                        disabled={
                          values.radioGroup === "multiple" ? false : true
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.multiplesubmission}
                      </Form.Control.Feedback>

                    </Form.Row>

                  </Form.Group>


                </Form.Row>

                {/* 2nd row end */}

                {/* 3rd row start */}
                <Form.Row>

                  <Form.Group
                    controlId="validationFormiksurvey"
                    as={Col}
                    md="6"
                  >
                    <Form.Group
                      controlId="validationFormiksurvey"
                      as={Row}

                    >
                      <div style={{ flexDirection: 'column', width: '80%', marginLeft: '15px' }}>
                        <Form.Label >Survey *</Form.Label>
                        <Select
                          name="survey"
                          value={this.getSelectObj(values.survey)}
                          onChange={e => {
                            this.form.setFieldValue("survey", e.value);
                            let a =
                              this.getSelectObj(values.onboard).points +
                              this.getSelectObj(values.screener).points +
                              e.points;
                            this.form.setFieldValue("missionPoints", a);
                          }}
                          options={this.state.options}
                        />
                        {submitCount > 0 ? (
                          <div
                            className="invalid-feedback"
                            style={{ display: "contents" }}
                          >
                            {errors.survey}
                          </div>
                        ) : null}
                      </div>
                    </Form.Group>


                    <Form.Group as={Row}>
                      <div style={{ padding: "0% 0% 0% 0%", marginLeft: '15px', width: '80%' }}>
                        <Form.Label>Upload Mission Image </Form.Label>
                        {/* {values.missionImageName === "" ? null : (
                          <Form.Label>: {values.missionImageName}</Form.Label>
                        )} */}
                        <StyledDropZone accept={"image/png, image/gif, image/jpeg, image/*"} onDrop={this.onDrop.bind(this)} />
                      </div>
                    </Form.Group>
                  </Form.Group>
                  <Form.Group
                    controlId="validationFormiksurvey"
                    as={Col}
                    md="4"
                  >
                    <div style={{ color: "red" }}>
                      {errors.missionImageType}
                    </div>
                    <div style={{ padding: "4% 0% 0% 0%" }}>
                      {values.missionImage ? (
                        <img height="150px" alt="" src={values.missionImage} />
                      ) : (
                        <img height="150px" alt="" src={values.missionImage} />
                      )}
                    </div>
                  </Form.Group>
                </Form.Row>
                {/* 3rd row end */}

                {/* 4th row start */}
                <Form.Row>
                  <Form.Group
                    controlId="validationFormikactive"
                    as={Col}
                    md="10"
                  >
                    <Form.Label>Linked Missions</Form.Label>
                    <Form.Row style={{ border: '1.5px solid #CED4DA', borderRadius: '5px' }}>

                      <Form.Group
                        controlId="validationFormikactive"
                        as={Col}
                        md="4"

                      >
                        <div style={{ marginTop: '5px' }}>
                          {values.linkedMissions && values.linkedMissions !== "" && values.linkedMissions.prevLink.map(m => (
                            <div style={{ flexDirection: 'column' }}>
                              <label style={{ fontSize: 14 }}>{m}</label>
                            </div>

                          ))}
                        </div>
                      </Form.Group>
                      <Form.Group
                        controlId="validationFormikactive"
                        as={Col}
                        md="4"
                      >
                        <div style={{ marginTop: '5px' }}>
                          {<label style={{ fontSize: 14 }}>{values.missionName}</label>}
                        </div>
                      </Form.Group>
                      <Form.Group
                        controlId="validationFormikactive"
                        as={Col}
                        md="4"
                      >
                        <div style={{ marginTop: '5px' }}>
                          {values.linkedMissions && values.linkedMissions !== "" && values.linkedMissions.nextLink.map(m => (
                            <div style={{ flexDirection: 'column' }}>
                              <label style={{ fontSize: 14 }}>{m}</label>
                            </div>
                          ))}
                        </div>
                      </Form.Group>
                      {/* <Form.Control
                        name="linkedMissions"
                        as="textarea"
                        rows="2"
                        disabled
                        // onChange={handleChange}
                        value={values.linkedMissions}
                      /> */}
                    </Form.Row>
                  </Form.Group>
                </Form.Row>
                {/* 4th row end */}

                {/* 5th row start */}
                <Form.Row>
                  <Form.Group
                    controlId="validationFormikactive"
                    as={Col}
                    md="1"
                  >
                    <Form.Label>Payment</Form.Label>
                    <br />
                    <MuiThemeProvider theme={theme}>
                      <Switch
                        name="paymentEnabled"
                        value={values.paymentEnabled}
                        checked={values.paymentEnabled === true ? true : false}
                        onChange={(e, c) => {
                          this.form.setFieldValue("paymentEnabled", c);
                        }}
                      />
                    </MuiThemeProvider>
                  </Form.Group>

                  <Form.Group
                    as={Col}
                    sm="3"
                    controlId="validationFormiksubmission"
                  >
                    <Form.Label>Amount</Form.Label>
                    <br />
                    <Form.Control
                      name="paymentAmount"
                      disabled={values.paymentEnabled === true ? false : true}
                      isInvalid={
                        touched.paymentAmount && !!errors.paymentAmount
                      }
                      value={values.paymentAmount}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.paymentAmount}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationFormik5">
                    <Form.Label style={{ textAlign: "left" }}>
                      Currency
                    </Form.Label>
                    <Form.Control
                      as="select"
                      disabled={values.paymentEnabled === true ? false : true}
                      name="paymentCurrency"
                      value={values.paymentCurrency}
                      onChange={handleChange}
                      isInvalid={
                        touched.paymentCurrency && !!errors.paymentCurrency
                      }
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
                      {errors.paymentCurrency}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="3" controlId="validationFormikrefcode">
                    <Form.Label>Mission RefCode*</Form.Label>
                    <Form.Control
                      name="refcode"
                      isInvalid={touched.refcode && !!errors.refcode}
                      onChange={handleChange}
                      value={values.refcode}
                      onBlur={e => {
                        this.missionRefCode(e.target.value);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.refcode}
                    </Form.Control.Feedback>
                    {values.duplicateMissionRefCode ? (
                      <div
                        className="invalid-feedback"
                        style={{ display: "contents" }}
                      >
                        Mission Ref Code Already Exists
                      </div>
                    ) : null}
                  </Form.Group>

                </Form.Row>
                {/* 5th row end */}




                {/* <Form.Row>
                    <Form.Group
                      controlId="validationFormikdescription"
                      as={Col}
                      md="9"
                    >
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        name="description"
                        as="textarea"
                        rows="3"
                        onChange={handleChange}
                        value={values.description}
                      />
                    </Form.Group>
                  </Form.Row> */}

                {/* <Form.Row>
                    <Form.Group
                      controlId="validationFormikOnboard"
                      as={Col}
                      md="3"
                    >
                      <Form.Label>Onboard</Form.Label>
                      <Select
                        name="onboard"
                        value={this.getSelectObj(values.onboard)}
                        onChange={e => {
                          this.form.setFieldValue("onboard", e.value);
                          let a =
                            e.points +
                            this.getSelectObj(values.screener).points +
                            this.getSelectObj(values.survey).points;
                          this.form.setFieldValue("missionPoints", a);
                        }}
                        options={this.state.options}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="validationFormikscreener"
                      as={Col}
                      md="3"
                    >
                      <Form.Label>Screener</Form.Label>
                      <Select
                        name="screener"
                        value={this.getSelectObj(values.screener)}
                        onChange={e => {
                          this.form.setFieldValue("screener", e.value);
                          let a =
                            this.getSelectObj(values.onboard).points +
                            e.points +
                            this.getSelectObj(values.survey).points;
                          this.form.setFieldValue("missionPoints", a);
                        }}
                        options={this.state.options}
                      />
                    </Form.Group>

                   
                  </Form.Row> */}

                <Form.Row>



                </Form.Row>
              </Container>
            </Form>
          )}
        </Formik>
        <AlertDialog
          title={"Delete " + this.state.deleteMissionName}
          description="Are you sure you want to delete this mission? Once deleted it cannot be retrieved"
          open={this.state.dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />
      </Fragment>
    );
  }
}

export default ProjectPageTwo;