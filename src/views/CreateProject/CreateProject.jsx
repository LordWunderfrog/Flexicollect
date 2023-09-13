/**
 * CreateProject Component.
 * 
 * This component is used to manage the creation of projects.
 *
 * 
 */

import React from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

//Material UI.
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

//Custom Components.
import Loading from "components/Loading/Loading.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";


import ProjectPageTwo from "./ProjectPageTwo";
import ProjectPageOne from "./ProjectPageOne";
import ProjectPageThree from "./ProjectPageThree";
import PreviewPage from "./PreviewPage";

//Scroll.
import PerfectScrollbar from "react-perfect-scrollbar";

//Date Picker.
import moment from "moment";

//Api.
import api2 from "../../helpers/api2";

//css.
import "./CreateProject.css";

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

const styles = theme => ({
  root: {
    width: "100%"
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  card: {
    minWidth: "90%"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  stepIcon: {
    color: "#d15c17"
  },
  checked: {}
});

//Handles the navigation of page.
function getSteps() {
  return [
    "Project Details",
    "Create Mission",
    "Recruit Consumers",
    "Preview & Publish"
  ];
}

class CreateProject extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      /* Stepper props. */
      activeStep: 0,
      redirect: false,

      /* Project id. */
      project_id: "",

      /* Page one props - Mandatory. */
      projectName: "",
      country: "",
      location: "",

      category: "",

      brand: "",
      packType: "",
      variant: "",
      size: "",

      ageFrom: "",
      ageTo: "",
      gender: "",

      categoriesPurchased: "",
      productsPurchased: "",

      projectOwner: "",
      projectOwnerEmail: "",
      projectOwnerContact: "",
      mission_list: [],
      refcode: "",

      /* Optional. */
      income: "",
      clientOwner: "",
      clientOwnerEmail: "",
      notes: "",

      /* Project image. */
      projectImage: "",
      projectImageName: "",
      projectImageType: "",

      /* Selected mission. */
      selectedMissionIndex: 0,

      /* Page two props- Mandatory. */
      mission_id: "",
      missionName: "",
      survey: "",

      /* Optional. */
      onboard: "",
      screener: "",
      missionPoints: "",
      status: false,
      description: "",
      endDate: "",
      startDate: "",

      /* Linked missions. */
      linkedMissions: [],

      /* Mission image. */
      missionImage: "",
      missionImageName: "",
      missionImageType: "",

      /* Page three props. */
      consumer_ids: [],

      /* View. */
      mode: "create",

      /* Snackbar props. */
      msgColor: "info",
      message: "",
      br: false,

      /* Loading. */
      loading: false,

      /* Mission field update. */
      updateMissFields: true,

      /* Country list. */
      countries: props.countries,
      mainSurveyId: "",
      multiplesubmission: "",
      radioGroup: "",
      paymentEnabled: false,
      paymentAmount: "",
      paymentCurrency: ""
    };

    this.childPageOne = React.createRef();
    this.childPageTwo = React.createRef();
  }


  /* Handles the api to fetch the id of the project. */
  componentDidMount() {
    let id = this.props.match.params.id;
    if (id) {
      this.getProject(id)
    } else {
      this.generaterefcode('create');
    }
  }

  /* Handles the api to fetch the details of the project. */
  getProject(id) {
    this.openLoading();

    api2
      .get("projects?id=" + id)
      .then(resp => {
        let project = resp.data;
        project.mission_list.reverse();
        let formattedMissionList = [];
        if (project.mission_list && project.mission_list.length > 0) {
          project.mission_list.forEach(mission => {
            formattedMissionList.push(this.formatMissionData(mission));
          });
        }
        if (String(project.id) === String(id)) {
          if (project.refcode && (project.refcode === "" || !project.refcode)) {
            this.generaterefcode('generate');
          }
          this.setState({
            project_id: project.id,
            projectName: project.project_name,
            category: project.category,
            brand: project.brand,
            packType: project.packtype,
            variant: project.variant,
            size: project.size,

            ageFrom: project.age1,
            ageTo: project.age2,
            gender: project.gender,
            country: project.country,
            location: project.location,

            categoriesPurchased: project.categories_purchased,
            productsPurchased: project.products_purchased,

            projectOwner: project.project_owner,
            projectOwnerEmail: project.project_owner_email_address,
            projectOwnerContact: project.project_owner_contact_address,

            income: project.income,
            refcode: project.refcode ? project.refcode : "",

            projectImage: project.project_image,

            clientOwner: project.client_owner,
            clientOwnerEmail: project.client_owner_email_address,
            notes: project.notes,

            mission_list: formattedMissionList,

            tags: project.tags,
            mode: "view"
          });
        }
        this.stopLoading();
      })
      .catch(error => {
        console.error(error);
        this.stopLoading();
      });
  }

  /* Handles the api to generate the reference code. */
  generaterefcode(check) {
    let refcode = ""
    this.openLoading();
    api2
      .get("refcode/generate?type=P")
      .then(resp => {
        if (resp.status === 200) {
          refcode = resp.data.message;
          if (check === 'generate') {
            this.saverefcode(refcode, 'generate');
          } else {
            this.setState({
              refcode: refcode,
              loading: false
            })
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the api to save the reference code. */
  saverefcode(refcode, check) {
    api2
      .get("refcode/save?refcode=" + refcode)
      .then(resp => {
        if (resp.status === 200) {
          if (check === 'generate') {
            this.updateprojectrefcode(refcode)
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the api to update the refcode. */
  updateprojectrefcode(refcode) {
    let id = this.props.match.params.id;
    api2
      .get("refcode/update?refcode=" + refcode + "&project_id=" + id)
      .then(resp => {
        if (resp.status === 200) {
          this.setState({
            refcode: refcode,
            loading: false
          })
        }
      })
      .catch(error => {
        console.error(error);
      });
    this.stopLoading();
  }

  /* Handles the formation of mission data. */
  formatMissionData(mission) {
    return {
      id: mission.id,
      missionName: mission.mission_name,
      survey: mission.main_survey_id,
      onboard: mission.onboard_survey_id,
      screener: mission.screener_survey_id,
      missionPoints: mission.mission_points,
      status: mission.status === 1 ? true : false,
      description: mission.description,
      submission: mission.submission,
      endDate: mission.mission_end_date
        ? moment(mission.mission_end_date)
        : null,
      startDate: mission.mission_start_date
        ? moment(mission.mission_start_date)
        : null,
      missionImage: mission.mission_image,
      missionImageType: "",
      multiplesubmission: mission.no_submissions_per_user,
      radioGroup: mission.per_user_submission_type,
      paymentEnabled: mission.paymentEnabled === 1 ? true : false,
      paymentAmount: mission.paymentAmount,
      paymentCurrency: mission.paymentCurrency,
      refcode: mission.refcode,
      linkedMissions: mission.linked_missions,
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

  /* Handles the event during navigation to next page in projectpageone.jsx. */
  onClickChildPageOne = activeStep => {
    this.childPageOne.current.callPageOneFromParent(activeStep);
  };


  /* Handles the event during navigation to next page in projectpagetwo.jsx. */
  onClickChildPageTwo = activeStep => {
    this.childPageTwo.current.callPageTwoFromParent(activeStep);
  };


  /* Handles the event during submission of data in projectpageone.jsx.  */
  pageOneOnSubmit = submitformData => {
    let restData = this.preparePageOneRestData(submitformData);
    if (restData.id === "" || restData.id === undefined) {
      this.addProject(restData, submitformData, false);
    } else {
      this.updateProject(restData, submitformData, 0, false);
    }
  };

  /* Handles the submission of data in projectpagetwo.jsx.    */
  pageTwoOnSubmit = submitformData => {
    let restData = this.prepareMissionRestData(submitformData);
    if (restData.id === "" || restData.id === undefined) {
      this.addMission(restData, submitformData, false);
    } else {
      this.updateMission(restData, submitformData, 0, false);
    }
  };

  /* Handles the event when user clicks the save button. */
  savePage = () => {
    const { activeStep } = this.state;
    if (activeStep === 0) {
      this.onClickChildPageOne(0);
    } else if (activeStep === 1) {
      this.onClickChildPageTwo(1);
    } else if (activeStep === 2) {
      let data = this.prepareConsumerData();
      if (data) {
        this.addRecruitedConsumer(data, 2, true);
      }
    } else if (activeStep === 3) {
      this.showNotification("Project Saved", "success");
    }
  };

  /* Handles the event when user clicks the next button. */
  handleNext = () => {
    const { activeStep } = this.state;

    if (activeStep === 0) {
      this.onClickChildPageOne(1);
    } else if (activeStep === 1) {
      this.onClickChildPageTwo(2);
    } else if (activeStep === 2) {
      let data = this.prepareConsumerData();
      if (data) {
        this.addRecruitedConsumer(data, 3, false);
      }
    }
  };


  /* Handles the api to publish the project. */
  publishProject = () => {
    this.openLoading();

    if (this.state.project_id !== "" && this.state.mission_id !== "") {
      let data = {
        project_id: this.state.project_id,
        mission_id: this.state.mission_id
      };
      api2
        .patch("projects/publish", data)
        .then(resp => {
          this.stopLoading();
          if (resp.data.status === 1) {
            this.setState({ redirect: true });
            this.showNotification("Project Published", "success");
          } else {
            this.showNotification("Server Error", "danger");
          }
        })
        .catch(error => {
          this.stopLoading();
          this.showNotification("Someting went Wrong", "danger");
          console.error(error);
        });
    }
  };


  /* Handles the event when user clicks the back button. */
  handleBack = () => {
    const { activeStep } = this.state;
    activeStep === 0
      ? this.setState({ redirect: true })
      : this.setState({
        activeStep: activeStep - 1
      });
  };

  /* Handles the event when user clicks the reset button. */
  handleReset = () => {
    this.setState({
      activeStep: 0
    });
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


  /* Handles the event when the input value changes. */
  handleInput = (name, value) => {
    this.setState({
      [name]: value
    });
  };

  /* Handles the event when user clicks publish button. */
  handleOnClick = () => {
    this.publishProject();
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
      3000
    );
  };

  /* Handles the close event of loading symbol. */
  handleClose = () => {
    this.setState({ open: false });
  };

  /* Handles and return the formated data. */
  preparePageOneRestData(submitData) {
    return {
      id: submitData.id,
      project_name: submitData.projectName,
      category: submitData.category,
      brand: submitData.brand,
      packtype: submitData.packType,
      variant: submitData.variant,
      size: submitData.size,
      age1: submitData.ageFrom,
      age2: submitData.ageTo,
      gender: submitData.gender,
      country: submitData.country,
      location: submitData.location,
      income: submitData.income,
      refcode: submitData.refcode,
      categories_purchased: submitData.categoriesPurchased,
      products_purchased: submitData.productsPurchased,
      // project owner
      project_owner: submitData.projectOwner,
      project_owner_email_address: submitData.projectOwnerEmail,
      project_owner_contact_address: submitData.projectOwnerContact,

      //client owner
      client_owner: submitData.clientOwner,
      client_owner_email_address: submitData.clientOwnerEmail,

      // project image
      project_image: submitData.projectImage,
      project_image_type:
        submitData.projectImageType === "." ? "" : submitData.projectImageType,

      notes: submitData.notes,

      // empty fields
      client_signoff: 1,
      project_deadline: "",
      project_revenue: "",
      consumer_type: "",
      status: 1
    };
  }

  /* Handles the api to create a new project. */
  addProject(project, submitformData, notif) {
    this.openLoading();
    api2
      .post("projects", project)
      .then(resp => {
        this.stopLoading();
        if (resp.data.status === 1) {
          this.setState({
            project_id: resp.data.id,
            mission_list: [],
            ...submitformData
          });
          if (notif) {
            this.showNotification("Project Added Successfully", "success");
          }
        } else {
          this.showNotification("Server Error", "danger");
        }
      })
      .catch(error => {
        this.stopLoading();
        this.showNotification("Someting went Wrong", "danger");
        console.error(error);
      });
  }


  /* Handles the api to update the existing project. */
  updateProject(project, submitformData, next, notif) {
    this.openLoading();
    api2
      .patch("projects", project)
      .then(resp => {
        this.stopLoading();
        if (resp.data.status === 1) {
          this.setState({
            ...submitformData
          });
          if (notif) {
            this.showNotification("Project Updated Successfully", "success");
          }
        } else {
          this.showNotification("Server Error", "danger");
        }
      })
      .catch(error => {
        this.stopLoading();
        this.showNotification("Someting went Wrong", "danger");
        console.error(error);
      });
  }


  /* Validate and return the formated mission data. */
  prepareMissionRestData(submitData) {

    return {
      id: submitData.id ? submitData.id : "",

      project_id: this.state.project_id,

      mission_name: submitData.missionName,
      status: submitData.status ? 1 : 0,

      description: submitData.description,

      onboard_survey_id: submitData.onboard ? submitData.onboard : "",
      screener_survey_id: submitData.screener ? submitData.screener : "",
      main_survey_id: submitData.survey ? submitData.survey : "",

      mission_survey_type: "",
      submission: submitData.submission ? submitData.submission : 0,
      mission_end_date: submitData.endDate
        // ? submitData.endDate.format("YYYY-MM-DD h:mm A")
        ? moment.utc(submitData.endDate)
        : "",
      mission_start_date: submitData.startDate
        // ? submitData.endDate.format("YYYY-MM-DD h:mm A")
        ? moment.utc(submitData.startDate)
        : "",
      // mission image
      mission_image: submitData.missionImage ? submitData.missionImage : "",
      mission_image_type:
        submitData.missionImageType === "." ? "" : submitData.missionImageType,

      mission_timezone: "",
      is_onboard_mandatory: 0,
      is_screener_mandatory: 0,
      is_survey_mandatory: 1,

      mission_points: submitData.missionPoints,
      per_user_submission_type: submitData.radioGroup,
      no_submissions_per_user:
        submitData.radioGroup === "multiple" ? submitData.multiplesubmission : 0,
      paymentAmount: submitData.paymentAmount,
      paymentCurrency: submitData.paymentCurrency,
      paymentEnabled: submitData.paymentEnabled === true ? 1 : 0,
      refcode: submitData.refcode,
    };
  }

  /* Handles the api to create a new mission. */
  addMission(mission, formData, notif) {

    mission.no_submissions_per_user = mission.no_submissions_per_user && parseInt(mission.no_submissions_per_user) > 0 ? mission.no_submissions_per_user : 0;
    this.setState({
      selectedMissionIndex: formData.selectedMissionIndex,
      updateMissFields: false,
      loading: true
    });
    api2
      .post("mission", mission)
      .then(resp => {
        if (resp.data.status === 1) {
          let missList = this.state.mission_list;
          formData.id = resp.data.id;
          missList.push(formData);
          this.setState({
            selectedMissionIndex: formData.selectedMissionIndex,
            mission_id: resp.data.id,
            missionName: mission.mission_name,
            endDate: mission.mission_end_date,
            startDate: mission.mission_start_date,
            submission: mission.submission,
            mission_list: missList,
            activeStep: formData.activeStep,
            updateMissFields: true,
            loading: false,
            mainSurveyId: mission.main_survey_id,
            multiplesubmission: mission.no_submissions_per_user,
            radioGroup: mission.per_user_submission_type,
            paymentAmount: mission.paymentAmount,
            paymentCurrency: mission.paymentCurrency,
            paymentEnabled: mission.paymentEnabled
          });
          if (notif) {
            this.showNotification("Mission Added Successfully", "success");
          }
        } else {
          this.stopLoading();
          this.showNotification("Server Error", "danger");
        }
      })
      .catch(error => {
        this.stopLoading();
        this.showNotification("Someting went Wrong", "danger");
        console.error(error);
      });
  }


  /* Handles the api to update mission. */
  updateMission(mission, formData, next, notif) {
    mission.no_submissions_per_user = mission.no_submissions_per_user && parseInt(mission.no_submissions_per_user) > 0 ? mission.no_submissions_per_user : 0;
    this.setState({
      selectedMissionIndex: formData.selectedMissionIndex,
      updateMissFields: false,
      loading: true
    });
    api2
      .patch("mission", mission)
      .then(resp => {
        this.stopLoading();
        if (resp.data.status === 1) {
          let missList = this.state.mission_list;
          missList[formData.selectedMissionIndex] = formData;

          this.setState({
            selectedMissionIndex: formData.selectedMissionIndex,
            mission_id: mission.id,
            missionName: mission.mission_name,
            endDate: mission.mission_end_date,
            startDate: mission.mission_start_date,
            submission: mission.submission,
            mission_list: missList,
            activeStep: formData.activeStep,
            updateMissFields: true,
            loading: false,
            mainSurveyId: mission.main_survey_id,
            multiplesubmission: mission.no_submissions_per_user,
            refcode: mission.refcode,
            radioGroup: mission.per_user_submission_type,
            paymentAmount: mission.paymentAmount,
            paymentCurrency: mission.paymentCurrency,
            paymentEnabled: mission.paymentEnabled
          });
          if (notif) {
            this.showNotification("Mission Updated Successfully", "success");
          }
        } else {
          this.stopLoading();
          this.showNotification("Server Error", "danger");
        }
      })
      .catch(error => {
        this.stopLoading();
        this.showNotification("Someting went Wrong", "danger");
        console.error(error);
      });
  }


  /* Handles the api to delete the selected mission. */
  deleteSelectedMission = (id, index) => {
    this.setState({
      updateMissFields: false,
      loading: true
    });
    api2
      .delete("mission?id=" + id)
      .then(resp => {
        if (resp.data.status === 1) {
          let missList = [...this.state.mission_list];
          missList.splice(index, 1);
          this.setState({
            updateMissFields: true,
            mission_list: missList,
            loading: false
          });

          this.showNotification("Mission Deleted Successfully", "success");
        } else {
          this.showNotification("Server Error", "danger");
          this.stopLoading();
        }
      })
      .catch(error => {
        this.stopLoading();
        this.showNotification("Someting went Wrong", "danger");
        console.error(error);
      });
  };

  /* Returns the project id,mission id and consumer id. */
  prepareConsumerData() {
    return {
      project_id: this.state.project_id,
      mission_id: this.state.mission_id,
      consumer_ids: this.state.consumer_ids
    };
  }

  /* Handles the api to update the selected consumer. */
  addRecruitedConsumer(recCon, next, notif) {
    this.openLoading();

    // if (recCon.consumer_ids.length > 0) {
    api2
      .post("consumer1", recCon)
      .then(resp => {
        this.stopLoading();
        if (resp.data.status === 1) {
          this.setState({
            activeStep: next
          });
          if (notif) {
            this.showNotification("Consumers added Successfully", "success");
          }
        } else {
          this.showNotification("Server Error", "danger");
        }
      })
      .catch(error => {
        this.stopLoading();
        this.showNotification("Someting went Wrong", "danger");
        console.error(error);
      });
    /* } else {
       this.stopLoading();
       this.showNotification("Select atleast one consumer", "warning");
     }*/
  }

  render() {
    if (this.state.redirect) {
      return <Redirect push to="/home/projects" />;
    }

    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    const { msgColor, br, message } = this.state;

    function getStepContent(
      stepIndex,
      state,
      handleInputChange,
      handleInput,
      childPageOne,
      pageOneOnSubmit,
      childPageTwo,
      pageTwoOnSubmit,
      countries,
      deleteSelectedMission,
      saverefcode
    ) {
      switch (stepIndex) {
        case 0:
          return (
            <ProjectPageOne
              ref={childPageOne}
              state={state}
              handleInputChange={handleInputChange}
              pageOneOnSubmit={pageOneOnSubmit}
              countries={countries}
              saverefcode={saverefcode}
            />
          );
        case 1:
          return (
            <ProjectPageTwo
              ref={childPageTwo}
              state={state}
              pageTwoOnSubmit={pageTwoOnSubmit}
              deleteSelectedMission={deleteSelectedMission}
              saverefcode={saverefcode}
            />
          );
        case 2:
          return (
            <ProjectPageThree
              missionId={state.mission_id}
              missionName={state.missionName}
              handleInput={handleInput}
              mainSurveyId={state.mainSurveyId}
            />
          );
        case 3:
          return <PreviewPage state={state} />;
        default:
          return "Preview Page";
      }
    }

    let body_class = this.props.fullWidth
      ? "body-form body-form-expanded"
      : "body-form body-form-collapsed";
    return (
      <MuiThemeProvider theme={theme}>
        <div className={body_class}>
          <Card style={{ height: "100%" }} className={classes.card}>
            <CardContent style={{ height: "90%" }}>
              <PerfectScrollbar>
                <div
                  className={classes.root}
                  style={{ alignContent: "center" }}
                >
                  <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    style={{ width: "100%" }}
                  >
                    {steps.map(label => {
                      return (
                        <Step key={label}>
                          <StepLabel
                            StepIconProps={{
                              classes: { root: classes.stepIcon }
                            }}
                          >
                            {label}
                          </StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>
                  <div>
                    {this.state.activeStep === steps.length ? (
                      <div>
                        <Typography className={classes.instructions}>
                          All steps completed
                        </Typography>
                        <Button onClick={this.handleReset}>Reset</Button>
                      </div>
                    ) : (
                      <div>
                        <div
                          className={classes.instructions}
                          style={{ width: "90%", marginLeft: "5%" }}
                        >
                          {getStepContent(
                            activeStep,
                            this.state,
                            this.handleInputChange,
                            this.handleInput,
                            this.childPageOne,
                            this.pageOneOnSubmit,
                            this.childPageTwo,
                            this.pageTwoOnSubmit,
                            this.props.countries,
                            this.deleteSelectedMission,
                            this.saverefcode
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </PerfectScrollbar>
            </CardContent>
            <CardActions
              style={{
                bottom: 0,
                backgroundColor: "#f1f1f1",
                height: "10%"
              }}
            >
              <div style={{ width: "100%" }}>
                <Button
                  style={{ float: "left", left: 0 }}
                  onClick={this.handleBack}
                  variant="contained"
                  color="primary"
                  className={classes.backButton}
                >
                  Back
                </Button>

                <div style={{ float: "right", right: 0 }}>
                  {activeStep !== 3 &&
                    <Button
                      style={{ margin: "0px 10px" }}
                      variant="contained"
                      color="primary"
                      onClick={this.savePage}
                    >
                      Save
                    </Button>
                  }

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={
                      activeStep === steps.length - 1
                        ? this.handleOnClick
                        : this.handleNext
                    }
                  >
                    {activeStep === steps.length - 1 ? "Publish" : "Next"}
                  </Button>
                </div>
              </div>
            </CardActions>
          </Card>
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

CreateProject.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(CreateProject);