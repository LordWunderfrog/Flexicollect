/**
 * 
 * ProjectList component.
 * 
 * This component is used to manage the project list.
 *
 *
 */

import React, { Fragment } from "react";
import { Link } from "react-router-dom";

/* MUI components. */
import Card from "components/Card/Card.jsx";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";

/* Icons. */
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

/* Custom components. */
import ProjectCard from "components/CustomCards/ProjectCard";
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import SortedTable from "components/SortedTable/SortedTable.jsx";

/* Bootstrap. */
import { Button, Form } from "react-bootstrap";

/* Scroll. */
import PerfectScrollbar from "react-perfect-scrollbar";
import InfiniteScroll from 'react-infinite-scroll-component';

/* CSS. */
import "./ProjectList.css";

/* API. */
import api2 from "../../helpers/api2";

import AlertDialog from "components/AlertDialog/AlertDialog";

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
    paddingLeft: "3%",
    paddingRight: "4%",
    marginTop: "15px",
    marginBottom: "10px"
  },
  loadingDiv: {
    width: "100%",
    textAlign: "center"
  }
};

const pageSize = 50
class ProjectList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      view: "grid",
      search: "",
      projects: [],
      filteredProjects: [],
      response: false,
      message: "",
      dialogOpen: false,
      deleteProjectName: "",
      deleteProjectId: "",
      deleteProjectIndex: "",
      hasMoreProjectData: true,
      projectPageNumber: 1,  //pagination
      totalRecords: 0
    };
  }

  componentDidMount() {
    this.getProjectList();
  }

  /* Handles the api to fetch the project list. */
  // getProjectList() {
  //   var self = this;
  //   api2
  //     .get("projects")
  //     .then(resp => {
  //       console.log('Project List is', resp)
  //       self.setState({
  //         projects: resp.data,
  //         filteredProjects: resp.data.slice(0, pageSize),
  //         hasMoreProjectData: resp.data && resp.data.length >= pageSize ? true : false,
  //         response: true
  //       });
  //     })
  //     .catch(error => {
  //       console.error(error);
  //       self.setState({
  //         response: true
  //       });
  //     });
  // }

  /** pagination of data */
  // fetchMoreProjectData = () => {
  //   if (this.state.filteredProjects.length == this.state.projects.length) {
  //     this.setState({ hasMoreProjectData: false });
  //     return;
  //   }
  //   setTimeout(() => {
  //     let start = this.state.filteredProjects.length
  //     let end = this.state.filteredProjects.length + pageSize
  //     let spliceArray = this.state.projects.slice(start, end)
  //     let concatedArray = this.state.filteredProjects.concat(spliceArray)
  //     this.setState({
  //       filteredProjects: concatedArray
  //     });
  //   }, 500);
  // };

  getProjectList() {
    var self = this;
    api2
      .get("projects?page=" + this.state.projectPageNumber)
      .then(resp => {

        self.setState({
          projects: resp.data.projects,
          filteredProjects: resp.data.projects,
          totalRecords: resp.data.total_count,
          hasMoreProjectData: this.state.filteredProjects.length <= resp.data.total_count ? true : false,
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

  /** pagination of data */
  fetchMoreProjectData = () => {
    if ((this.state.filteredProjects.length >= this.state.totalRecords) && this.state.totalRecords !== 0) {
      this.setState({ hasMoreProjectData: false });
      return;
    }
    else {
      var self = this;
      let pagenumber = this.state.projectPageNumber + 1
      api2
        .get("projects?page=" + pagenumber)
        .then(resp => {
          self.setState({
            projects: [...this.state.filteredProjects, ...resp.data.projects],
            filteredProjects: [...this.state.filteredProjects, ...resp.data.projects],
            totalRecords: resp.data.total_count,
            hasMoreProjectData: this.state.filteredProjects.length <= resp.data.total_count ? true : false,
            response: true,
            projectPageNumber: pagenumber
          });
        })
        .catch(error => {
          self.setState({
            response: true
          });
        });
    }
  };

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

  /* Handles the event to filter the project. */
  filterProject = projectFilter => {
    let filteredProjects = this.state.projects;
    filteredProjects = filteredProjects.filter(project => {
      let project_name = project.project_name.toLowerCase();
      let category = project.category.toLowerCase();
      let brand = project.brand.toLowerCase();
      let country = project.country.toLowerCase();
      let location = project.location.toLowerCase();

      return (
        project_name.indexOf(projectFilter.toLowerCase()) !== -1 ||
        category.indexOf(projectFilter.toLowerCase()) !== -1 ||
        brand.indexOf(projectFilter.toLowerCase()) !== -1 ||
        country.indexOf(projectFilter.toLowerCase()) !== -1 ||
        location.indexOf(projectFilter.toLowerCase()) !== -1
      );
    });
    this.setState({
      filteredProjects
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

    // this.filterProject(value); // unused after added pagination

    /** Handle blank serch text */
    if (!value) {
      this.setState({
        projects: [],
        filteredProjects: [],
        hasMoreProjectData: true,
        projectPageNumber: 1,
        response: false
      }, () => {
        setTimeout(() => {
          this.getProjectList()
        }, 1000);
      })
    }
  };

  /** Handle search button and enter event for search */
  searchButtonAction = () => {
    this.handleProjectSerch(this.state.search)
  }
  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleProjectSerch(this.state.search)
    }
  };

  /** handle search api call */
  handleProjectSerch = (value) => {
    console.log('Search value', value)
    var self = this;
    api2
      .get("filter-projects?filter=" + value)
      .then(resp => {
        console.log('search api resp', resp)
        self.setState({
          projects: resp.data,
          filteredProjects: resp.data,
          hasMoreProjectData: false,
          projectPageNumber: 1,
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

  /* Handles the event when the user deletes an item. */
  deleteItem = (id, index, project_name) => event => {
    event.preventDefault();
    this.setState({
      dialogOpen: true,
      deleteProjectId: id,
      deleteProjectIndex: index,
      deleteProjectName: project_name
    });
  };

  /* Handles the api to delete an item and update close event of popup. */
  handleDialogClose = deleteProject => event => {
    if (deleteProject) {
      api2.delete("projects?id=" + this.state.deleteProjectId).then(resp => {
        // this.setState({
        //   projects: this.state.projects.filter(
        //     (x, i) => i !== this.state.deleteProjectIndex
        //   ),
        //   filteredProjects: this.state.filteredProjects.filter(
        //     (x, i) => i !== this.state.deleteProjectIndex
        //   )
        // });
        this.setState({
          projects: [],
          filteredProjects: [],
          hasMoreProjectData: true,
          projectPageNumber: 1,
          response: false
        }, () => {
          setTimeout(() => {
            this.getProjectList()
          }, 1000);
        })
      });
    }
    this.setState({ dialogOpen: false });
  };

  render() {
    const { classes } = this.props;
    function Actions(props) {
      return (
        <CardActions>
          <IconButton
            onClick={props.deleteItem(props.id, props.index, props.project_name)}
            aria-label="Delete"
            className={classes.buttons}
          >
            <DeleteForeverIcon color="action" />
          </IconButton>
        </CardActions>
      );
    }
    const listItems = this.state.filteredProjects.map((project, index) => [
      project.project_name,
      project.country,
      project.location,
      project.category,
      project.brand,
      project.packtype,
      project.products_purchased,
      <Actions id={project.id} index={index} project_name={project.project_name} deleteItem={this.deleteItem} />
    ]);

    const listIds = this.state.filteredProjects.map(project => [project.id]);

    let body_class = this.props.fullWidth
      ? "body-full-expanded"
      : "body-full-collapsed";
    return (
      <div style={{ height: "90%" }} className={body_class}>
        <div className={classes.gridHeader}>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            id="gridHeader"
            style={{ padding: "0%", margin: "0 !important" }}
          >
            <div className="d-md-flex">
              <Typography variant="h6" className="mr-5">
                Projects ({this.state.totalRecords})
              </Typography>

              <div className="d-flex">
                <input
                  type="search"
                  name="search"
                  id="search-form"
                  value={this.state.search}
                  className="search-input"
                  onChange={this.handleInputChange}
                  placeholder="Search"
                  onKeyDown={this.handleKeyPress}
                />
                <Button
                  variant="primary"
                  style={{
                    borderRadius: "30px",
                    fontSize: "0.8rem",
                    background: "#0069d9"
                  }}
                  onClick={e => this.searchButtonAction()}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="d-flex align-items-center">
              {/** Hide Swipe between greed and list */}
              {/* <Button
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
              </Button> */}
              <Link to="/home/create-project">
                <Button
                  variant="primary"
                  style={{
                    borderRadius: "30px",
                    fontSize: "0.8rem",
                    background: "#0069d9",
                    whiteSpace: "nowrap"
                  }}
                >
                  Create Project
                </Button>
              </Link>
            </div>

          </Grid>
        </div>

        {this.state.projects.length === 0 && !this.state.response ? (
          <div className={classes.loadingDiv}>
            <CircularProgress className={classes.progress} color="primary" />
          </div>
        ) : (
          <Fragment>
            {this.state.projects.length === 0 && this.state.response ? (
              <div className={classes.loadingDiv}>
                <Typography variant="h5">No Projects!</Typography>
              </div>
            ) : (
              <Fragment>
                {this.state.view === "grid" ? (
                  // <PerfectScrollbar>
                  <div id="scrollableDiv" style={{ height: "calc(100vh - 80px)", overflow: "auto" }}>
                    <InfiniteScroll
                      dataLength={this.state.filteredProjects.length}
                      next={this.fetchMoreProjectData}
                      hasMore={this.state.hasMoreProjectData}
                      // height={800}
                      loader={
                        this.state.hasMoreProjectData ? <h5 className="pt-4 text-center">Loading...</h5> : null
                      }
                      endMessage={<div></div>}
                      scrollableTarget="scrollableDiv"
                    >
                      <div className="list-box float-none">
                        <Grid container spacing={8}>
                          {this.state.filteredProjects.map((project, i) => (
                            <Grid
                              item
                              md={4}
                              key={i}
                              style={{
                                width: this.props.isMobile ? "100%" : "auto",
                                marginLeft: this.props.isMobile ? "-1%" : "0"
                              }}
                            >
                              <ProjectCard
                                key={i}
                                project={project}
                                index={i}
                                deleteItem={this.deleteItem}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </InfiniteScroll>
                  </div>
                  //</PerfectScrollbar>
                ) : (
                  <PerfectScrollbar>
                    <div className="list-box">
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <Card>
                            <SortedTable
                              linkTo="/home/view-project/"
                              listIds={listIds}
                              tableHead={[
                                "Name",
                                "Country",
                                "Location",
                                "Categories",
                                "Brand",
                                "Packtype",
                                "Products",
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
          title={"Delete " + this.state.deleteProjectName}
          description="Are you sure you want to delete this project? Once deleted it cannot be retrieved"
          open={this.state.dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ProjectList);
