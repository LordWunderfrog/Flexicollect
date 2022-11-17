
/**
 * 
 * SurveyList component.
 * 
 * This component is used to manage the survey list.
 *
 *
 */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";

/* MUI components. */
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";

/* Icons. */
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

/* Custom components. */
import SurveyCard from "components/CustomCards/SurveyCard";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import SortedTable from "components/SortedTable/SortedTable.jsx";
import Card from "components/Card/Card.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

/* Bootstrap 1.0. */
import { Button, Form } from "react-bootstrap";

/* Scroll. */
import PerfectScrollbar from "react-perfect-scrollbar";
import InfiniteScroll from 'react-infinite-scroll-component';

/* API. */
import api2 from "../../helpers/api2";

/* CSS. */
import "./SurveyList.css";

import AlertDialog from "components/AlertDialog/AlertDialog";

import { createMuiTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import CloneModal from "./CloneModal"

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
    marginBottom: "1%"
  },
  loadingDiv: {
    width: "100%",
    textAlign: "center"
  },
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  }
};


const pageSize = 100
class SurveyList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      view: "grid",
      search: "",
      surveys: [],
      filteredSurveys: [],
      response: false,
      message: "",
      dialogOpen: false,
      deleteSurveyName: "",
      deleteSurveyId: "",
      deleteSurveyIndex: "",
      cloneOpen: false,
      cloneSurveyName: "",
      cloneSurveyIndex: "",
      cloneSurveyId: "",
      /* Snackbar props */
      msgColor: "info",
      br: false,
      hasMoreData: true
    };
  }

  componentDidMount() {
    this.getSurveyList();
  }

  /* Handles the api to fetch the survey list. */
  getSurveyList() {
    var self = this;
    api2
      .get("survey")
      .then(resp => {

        self.setState({
          surveys: resp.data,
          filteredSurveys: resp.data.slice(0, pageSize),
          hasMoreData: true,
          response: true
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the event to update the view. */
  switchView(view) {
    if (view === "grid") {
      this.setState({
        view: "grid"
      });
    } else if (view === "list") {
      this.setState({
        view: "list"
      });
    }
  }

  /* Handles the event to filter the survey. */
  filterSurvey = surveyFilter => {
    let filteredSurveys = this.state.surveys;
    filteredSurveys = filteredSurveys.filter(survey => {
      let title = survey.title.toLowerCase();
      let tags = survey.tags.toLowerCase();
      return (
        title.indexOf(surveyFilter.toLowerCase()) !== -1 ||
        tags.indexOf(surveyFilter.toLowerCase()) !== -1
      );
    });
    this.setState({
      filteredSurveys
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

    this.filterSurvey(value);
  };

  /* Handles the event when the user deletes an item. */
  deleteItem = (id, index, name) => event => {
    event.preventDefault();
    this.setState({
      dialogOpen: true,
      deleteSurveyId: id,
      deleteSurveyIndex: index,
      deleteSurveyName: name
    });
  };

  /* Handles the open event of popup. */
  cloneItem = (id, index, name) => event => {
    event.preventDefault();
    this.setState({
      cloneOpen: true,
      cloneSurveyId: id,
      cloneSurveyIndex: index,
      cloneSurveyName: "Copy of " + name
    });
  };

  /* Handles the api to clone an item. */
  handleClone = () => {

    if (this.state.cloneSurveyId) {
      let data = {
        id: this.state.cloneSurveyId,
        name: this.refs.cloneRef.getSurveyname()
      };

      api2.post("clone_survey", data)
        .then((resp) => {
          this.setState({
            cloneOpen: false,
            response: false
          }, () => {
            this.getSurveyList();
            if (resp.data && resp.data.status && resp.data.status === 201) {
              this.showNotification(
                "Survey cloned successfully",
                "success"
              )
            }
            else if (resp.data && resp.data.status && resp.data.status === 200) {
              if (resp.data && resp.data.error) {
                this.showNotification(
                  resp.data.error,
                  "danger"
                )
              } else {
                this.showNotification(
                  "Failed to clone the survey",
                  "danger"
                )
              }

            }
            else {
              this.showNotification(
                "Failed to clone the survey",
                "danger"
              )
            }
          });
        })
        .catch((error) => {
          if (error.response.data && error.response.data.error) {
            this.showNotification(
              error.response.data.error,
              "danger"
            )
          } else {
            this.showNotification(
              "Failed to clone the survey",
              "danger"
            )
          }
        });
    }
  }

  /* Handles the close event of popup. */
  handleCloseModal = () => {
    this.setState({ cloneOpen: false });

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
  }

  /* Style for popup screen. */
  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  /* Handles the api to update the deleted item. */
  handleDialogClose = deleteSurvey => event => {
    if (deleteSurvey) {
      api2.delete("survey?id=" + this.state.deleteSurveyId).then(resp => {
        this.setState({
          surveys: this.state.surveys.filter(
            (x, i) => i !== this.state.deleteSurveyIndex
          ),
          filteredSurveys: this.state.filteredSurveys.filter(
            (x, i) => i !== this.state.deleteSurveyIndex
          )
        });
      });
    }
    this.setState({ dialogOpen: false });
  };

  /** pagination of data */
  fetchMoreData = () => {
    if (this.state.filteredSurveys.length == this.state.surveys.length) {
      this.setState({ hasMoreData: false });
      return;
    }
    setTimeout(() => {
      let start = this.state.filteredSurveys.length
      let end = this.state.filteredSurveys.length + pageSize
      let spliceArray = this.state.surveys.slice(start, end)
      let concatedArray = this.state.filteredSurveys.concat(spliceArray)
      this.setState({
        filteredSurveys: concatedArray
      });
    }, 500);
  };

  render() {
    const { classes } = this.props;
    const { msgColor, br, message } = this.state;

    function Actions(props) {
      return (
        <CardActions>
          <IconButton
            onClick={props.deleteItem(props.id, props.index, props.name)}
            aria-label="Delete"
            className={classes.buttons}
          >
            <DeleteForeverIcon color="action" />
          </IconButton>
        </CardActions>
      );
    }

    const listItems = this.state.filteredSurveys.map((survey, index) => [
      survey.title,
      survey.project,
      survey.tags,
      survey.active,
      survey.createdDate,
      survey.updatedDate,
      <Actions id={survey.id} index={index} name={survey.title} deleteItem={this.deleteItem} />
    ]);

    const listIds = this.state.filteredSurveys.map(survey => [survey.id]);

    let body_class = this.props.fullWidth
      ? "body-full-expanded"
      : "body-full-collapsed";
    return (
      <div style={{ height: "90%" }} className={body_class}>

        <div className={classes.gridHeader}>
          <Grid
            container
            alignItems="center"
            id="gridHeader"
            style={{ padding: "0%", margin: "0 !important" }}
          >
            <GridItem xs={6} sm={4} md={2}>
              <Typography variant="h6">
                Surveys ({this.state.surveys.length})
              </Typography>
            </GridItem>

            <GridItem xs={6} sm={4} md={2}>
              <Form.Control
                type="text"
                name="search"
                value={this.state.search}
                onChange={this.handleInputChange}
                style={{ height: 33, borderRadius: "2rem" }}
                placeholder="Search"
              />
            </GridItem>

            <GridItem id="filler" xs={4} sm={4} md={4} />

            <GridItem
              gridCss={{ padding: "0px !important" }}
              xs={6}
              sm={4}
              md={2}
            >
              <Button
                onClick={() => this.switchView("grid")}
                variant={this.state.view === "grid" ? "light" : ""}
                className={"view-switch-button"}
              >
                <i className="fa fa-th" aria-hidden="true" />
              </Button>
              <Button
                onClick={() => this.switchView("list")}
                variant={this.state.view === "list" ? "light" : ""}
                className={"view-switch-button"}
              >
                <i className="fa fa-list" aria-hidden="true" />
              </Button>
            </GridItem>

            <GridItem xs={6} sm={4} md={2}>
              <Link to="/home/create-survey">
                <Button
                  variant="primary"
                  style={{
                    borderRadius: "30px",
                    fontSize: "0.8rem",
                    background: "#0069d9"
                  }}
                >
                  Create Survey
                </Button>
              </Link>
            </GridItem>
          </Grid>
        </div>

        {!this.state.response ? (
          <div className={classes.loadingDiv}>
            <CircularProgress className={classes.progress} color="primary" />
          </div>
        ) : (
          <Fragment>
            {this.state.surveys.length === 0 && this.state.response ? (
              <div className={classes.loadingDiv}>
                <Typography variant="h5">No Surveys!</Typography>
              </div>
            ) : (
              <Fragment>
                {this.state.view === "grid" ? (
                  // <PerfectScrollbar id="scrollableDiv">
                  <div id="scrollableDiv" style={{ height: "calc(100vh - 80px)", overflow: "auto" }}>
                    <InfiniteScroll
                      dataLength={this.state.filteredSurveys.length}
                      next={this.fetchMoreData}
                      hasMore={this.state.hasMoreData}
                      // height={800}
                      loader={
                        <h5 className="pt-4 text-center">Loading...</h5>
                      }
                      endMessage={<div></div>}
                      scrollableTarget="scrollableDiv"
                    >
                      <div className="list-box float-none">
                        <Grid container spacing={8}>
                          {this.state.filteredSurveys.map((survey, i) => (
                            <Grid
                              item
                              md={4}
                              key={i}
                              style={{
                                width: this.props.isMobile ? "100%" : "auto",
                                marginLeft: this.props.isMobile ? "-1%" : "0"
                              }}
                            >
                              <SurveyCard
                                key={i}
                                survey={survey}
                                index={i}
                                deleteItem={this.deleteItem}
                                cloneItem={this.cloneItem}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </InfiniteScroll>
                  </div>
                  // </PerfectScrollbar>
                ) : (
                  <PerfectScrollbar>
                    <div className="list-box">
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <Card>
                            <SortedTable
                              linkTo="/home/view-survey/"
                              listIds={listIds}
                              tableHead={[
                                "Name",
                                "Project",
                                "Tags",
                                "Active",
                                "Created",
                                "Modified",
                                "Actions"
                              ]}
                              tableData={listItems}
                            />
                          </Card>
                        </GridItem>
                      </GridContainer>
                    </div>
                  </PerfectScrollbar>
                )}
              </Fragment>
            )}
          </Fragment>
        )}

        <AlertDialog
          title={"Delete " + this.state.deleteSurveyName}
          description="Are you sure you want to delete this survey? Once deleted it cannot be retrieved"
          open={this.state.dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />
        <Snackbar
          place="br"
          color={msgColor}
          open={br}
          message={message}
          closeNotification={() => this.setState({ br: false })}
          close
        />

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.cloneOpen}
        // onClose={this.handleCloseModal}
        >
          <PerfectScrollbar>
            <div style={this.getModalStyle()} className={classes.paper}>
              <Typography
                variant="h6"
                id="modal-title "
                style={{ textAlign: "center" }}
              >
                <div>
                  <h5>Enter Survey Name:</h5>

                  <CloneModal ref="cloneRef"
                    cloneSurveyName={this.state.cloneSurveyName}
                  />

                </div>



                <div className="model-footer"
                  style={{
                    paddingTop: "5px"
                  }}
                >
                  <Button
                    variant="contained"
                    style={{
                      color: "#fff",
                      backgroundColor: "#074e9e",
                      margin: "10px 0 0px 10px",
                      padding: "5px 16px",
                      fontSize: "12px"
                    }}
                    onClick={this.handleClone}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      color: "#fff",
                      backgroundColor: "#074e9e",
                      margin: "10px 0 0px 10px",
                      padding: "5px 16px",
                      fontSize: "12px"
                    }}

                    onClick={this.handleCloseModal}


                  >
                    Cancel
                  </Button>
                </div>
              </Typography>
            </div>
          </PerfectScrollbar>
        </Modal>

      </div>
    );
  }
}

export default withStyles(styles)(SurveyList);
