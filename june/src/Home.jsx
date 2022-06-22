
/*
* Home component. 
* This component is used to routing from home page to another page based on the user events.
* For routing imported react-router-dom library and imported all components here for navigation to other pages inside the app. */
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Dashboard from "./views/Dashboard/Dashboard";

import Surveylist from "./views/SurveyList/SurveyList";
import CreateSurvey from "./views/CreateSurvey/CreateSurvey";
import CreateGallery from "./views/CreateSurvey/gallery";

import DepartmentList from "./views/DepartmentList/DepartmentList";
import CreateDepartment from "./views/CreateDepartment/CreateDepartment";

import CreateClient from "./views/CreateClient/CreateClient";
import ClientList from "./views/ClientList/ClientList";

import CreateConsumer from "./views/CreateConsumer/CreateConsumer";
import ConsumerList from "./views/ConsumerList/ConsumerList";

import CreateProject from "./views/CreateProject/CreateProject";
import ProjectList from "./views/ProjectList/ProjectList";

import UserList from "./views/UserList/UserList";

import AgMissionResponse from "./views/MissionResponse/AgMissionResponse";

import ResponsesAndReport from "./views/ResponsesAndReporting/ResponsesAndReport";
import ClientResponsesAndReport from "./views/ResponsesAndReporting/ClientResponsesAndReport";

import CreateClientScreen from "./views/CreateClientScreen/CreateClientScreen";
import ViewClientScreen from "./views/ViewClientScreen/ViewClientScreen";

import Translation from "./views/Translations/Translation"

import ImageViewer from "./views/ImageViewer/ImageViewer"
// API
import api2 from "helpers/api2";

// Custom Components
import LeftNav from "components/LeftNav/LeftNav";

import queryString from "query-string";
class Home extends React.Component {
  constructor() {
    super();

    this.state = {
      fullWidth: true,
      isMobile: false,
      apiKey: localStorage.getItem("api_key"),
      path: localStorage.getItem("path"),
      //username: localStorage.getItem("username"),
      countries: [],

    };
    this.childLeftNav = React.createRef();
  }
  componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    this.setState({
      email: values.email,
      accessToken: values.accessToken,
      accessSignature: values.accessSignature
    });
    console.log("access token")
    console.log(this.accessToken);
    //this.setState({ apiKey: localStorage.getItem("api_key") });
    //this.setState({ test: localStorage.getItem("test") });
    this.getCountryList();
    if (window.innerWidth < 769) {
      this.setState({
        isMobile: true
      });
    } else {
      this.setState({ isMobile: false });
    }
  }

  getCountryList() {
    api2
      .get("v1/customer/countries")
      .then(resp => {

        let countries = resp.data.list.map(c => ({
          label: c.name,
          value: c.id
        }));
        this.setState({
          countries: countries
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => {
    return {
      [newProp]: old,
      ...others
    };
  };

  handleFullscreen = () => {
    this.setState({ fullWidth: !this.state.fullWidth });
  };

  handleCollapseScreen = fullWidth => {
    this.setState({ fullWidth });
  };

  updateDepartmentList = () => {
    //this.childLeftNav.current.updateDepartmentList();
  };

  render() {

    console.log(this.state);
    //if (this.state.test == "test") {
    //  return < Redirect to="/home/image-viewer/asdasd" />;
    //}
    if (
      this.state.apiKey === null ||
      this.state.apiKey === undefined ||
      this.state.apiKey.length === 0
    ) {
      console.log("home first");
      this.url = window.location.search;
      console.log("this test");
      console.log(this.test);
      console.log("this.url");
      console.log(this.props.location.pathname)
      localStorage.setItem("path", this.props.location.pathname);//get url before log in
      console.log(this.props.match)
      console.log(this.props)
      console.log(localStorage.getItem("test"));
      console.log("this test");
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        <div className="App-body">
          <LeftNav
            fullWidth={this.state.fullWidth}
            handleFullscreen={this.handleFullscreen}
            isMobile={this.state.isMobile}
            ref={this.childLeftNav}
          />
          <Switch>
            <Route
              path="/home/dashboard"
              render={props => (
                <Dashboard
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  isMobile={this.state.isMobile}
                />
              )}
            />

            <Route
              path="/home/surveys"
              exact={true}
              render={props => (
                <Surveylist
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  isMobile={this.state.isMobile}
                />
              )}
            />
            <Route
              path="/home/create-survey"
              exact={true}
              render={props => (
                <CreateSurvey
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />
            <Route
              path="/home/gallery"
              exact={true}
              render={props => (
                <CreateGallery
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />
            <Route
              path="/home/view-survey/:id"
              exact={true}
              render={props => (
                <CreateSurvey
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />

            <Route
              path="/home/departments"
              exact={true}
              render={props => (
                <DepartmentList
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  isMobile={this.state.isMobile}
                  updateDepartmentList={this.updateDepartmentList}
                />
              )}
            />
            <Route
              path="/home/create-department"
              exact={true}
              render={props => (
                <CreateDepartment
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  updateDepartmentList={this.updateDepartmentList}
                  countries={this.state.countries}
                />
              )}
            />
            <Route
              path="/home/view-department/:id"
              exact={true}
              render={props => (
                <CreateDepartment
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  countries={this.state.countries}
                />
              )}
            />

            <Route
              path="/home/projects"
              exact={true}
              render={props => (
                <ProjectList
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  isMobile={this.state.isMobile}
                />
              )}
            />
            <Route
              path="/home/create-project"
              exact={true}
              render={props => (
                <CreateProject
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  countries={this.state.countries}
                />
              )}
            />
            <Route
              path="/home/view-project/:id"
              exact={true}
              render={props => (
                <CreateProject
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  countries={this.state.countries}
                />
              )}
            />

            <Route
              path="/home/clients"
              exact={true}
              render={props => (
                <ClientList
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  isMobile={this.state.isMobile}
                />
              )}
            />
            <Route
              path="/home/create-client"
              exact={true}
              render={props => (
                <CreateClient
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  countries={this.state.countries}
                />
              )}
            />
            <Route
              path="/home/view-client/:id"
              exact={true}
              render={props => (
                <CreateClient
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  countries={this.state.countries}
                />
              )}
            />

            <Route
              path="/home/consumers"
              exact={true}
              render={props => (
                <ConsumerList
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  isMobile={this.state.isMobile}
                />
              )}
            />
            <Route
              path="/home/create-consumer"
              exact={true}
              render={props => (
                <CreateConsumer
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  countries={this.state.countries}
                />
              )}
            />
            <Route
              path="/home/view-consumer/:id"
              exact={true}
              render={props => (
                <CreateConsumer
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  countries={this.state.countries}
                />
              )}
            />

            <Route
              path="/home/users"
              exact={true}
              render={props => (
                <UserList
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                  isMobile={this.state.isMobile}
                />
              )}
            />

            <Route
              path="/home/mission-response"
              exact={true}
              render={props => (
                <AgMissionResponse
                  {...props}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />

            <Route
              path="/home/responses-report"
              exact={true}
              render={props => (
                <ResponsesAndReport
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />

            <Route
              path="/home/client-responses-report"
              exact={true}
              render={props => (
                <ClientResponsesAndReport
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />


            <Route
              path="/home/create-client-screen"
              exact={true}
              render={props => (
                <CreateClientScreen
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />
            <Route
              path="/home/view-client-screen"
              exact={true}
              render={props => (
                <ViewClientScreen
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />
            <Route
              path="/home/translations"
              exact={true}
              render={props => (
                <Translation
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                />
              )}
            />
            <Route
              path="/home/image-viewer/"
              exact={true}
              render={props => (
                <ImageViewer
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                //image url in the props
                />
              )}
            />
            <Route
              path="/home/image-viewer/:url"
              exact={true}
              render={props => (
                <ImageViewer
                  {...props}
                  handleCollapseScreen={this.handleCollapseScreen}
                  fullWidth={this.state.fullWidth}
                //image url in the props
                />
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;