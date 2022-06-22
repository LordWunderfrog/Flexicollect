/**
 * 
 * Dashboard component.
 * 
 * This component is used to view the summary of projects,missions,departments,surveys and clients.
 * 
 */

import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

/* Bootstrap 1.0. */
import {
  Col,
  Row,
  ButtonToolbar,
  DropdownButton,
  Dropdown
} from "react-bootstrap";

/* Material UI. */
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

/* Custom charts. */
import "chartjs-plugin-datalabels";
import Piechart from "components/Charts/Piechart";
import HorizontalBarchart from "components/Charts/HorizontalBarchart";
import StackedBarchart from "components/Charts/StackedBarchart";
import GroupedHorizontalBarchart from "components/Charts/GroupedHorizontalBarchart";

/* Font awesome icons. */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
library.add(faUserTie);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.piedata = [1, 2, 3, 5];
    this.bardata = [9, 7, 6, 5, 4, 3];
    this.horizontalbardata = [5, 3, 7, 4];
    this.stackedbardata = {
      datasetOne: [4, 6, 8, 6],
      datasetTwo: [6, 9, 3, 7],
      datasetThree: [7, 3, 9, 2]
    };
    this.groupedhorizontalbardata = {
      datasetOne: [5, 3, 8, 2],
      datasetTwo: [3, 5, 6, 7]
    };
    //this.props.handleCollapseScreen(true);
  }

  render() {
    let body_class = this.props.fullWidth
      ? "body-full body-full-expanded"
      : "body-full body-full-collapsed";
    return (
      <div className={body_class}>
        <div className="head-adjust">
          <div className="row">
            <div className="col-md-2">
              <h5 style={{ margin: "0.5rem", marginLeft: "30px" }}>
                Dashboard
              </h5>
            </div>
            <div className="col-md-3">
              <ButtonToolbar>
                <DropdownButton
                  disabled
                  variant="light"
                  title="All Projects"
                  key="1"
                  //noCaret
                  id="dropdown-basic-1"
                  style={{
                    borderRadius: "100px",
                    fontSize: "0.8rem",
                    height: "30px",
                    padding: "2px 10px",
                    marginLeft: "25px"
                  }}
                >
                  <Dropdown.Item href="#">All Projects</Dropdown.Item>
                </DropdownButton>
              </ButtonToolbar>
            </div>
            <div
              className="col-md-3 offset-md-4"
              style={{ textAlign: "right" }}
            >
              <i className="head-icon fa fa-search" aria-hidden="true" />
              <i className="head-icon fa fa-bell" aria-hidden="true" />
              <i className="head-icon fa fa-user" aria-hidden="true" />
              <i className="head-icon fa fa-ellipsis-v" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="row" style={{ height: "90%", margin: "0px" }}>
          <div
            className="col-md-8"
            style={{ justifyContent: "center", borderRight: "4px solid #fff" }}
          >
            <GridList cols={2} style={{ height: "100%" }} spacing={16}>
              <GridListTile
                style={{
                  height: this.props.isMobile ? "300px" : "50%",
                  width: this.props.isMobile ? "100%" : "50%"
                }}
              >
                <Piechart title={"Overall Project State"} data={this.piedata} />
              </GridListTile>
              <GridListTile
                style={{
                  height: this.props.isMobile ? "300px" : "50%",
                  width: this.props.isMobile ? "100%" : "50%"
                }}
              >
                <StackedBarchart
                  title={"Project Performance"}
                  data={this.stackedbardata}
                />
              </GridListTile>
              <GridListTile
                style={{
                  height: this.props.isMobile ? "300px" : "50%",
                  width: this.props.isMobile ? "100%" : "50%"
                }}
              >
                <HorizontalBarchart
                  title={"Missions Nearing Deadline"}
                  data={this.horizontalbardata}
                />
              </GridListTile>
              <GridListTile
                style={{
                  height: this.props.isMobile ? "300px" : "50%",
                  width: this.props.isMobile ? "100%" : "50%"
                }}
              >
                <GroupedHorizontalBarchart
                  title={"Low Response Projects"}
                  data={this.groupedhorizontalbardata}
                />
              </GridListTile>
            </GridList>
          </div>
          <div className="col-md-4 body-right-nav">
            <div
              className="row"
              style={{
                alignItems: "center",
                marginBottom: "-5.5%"
              }}
            >
              <div
                className="col"
                style={{ paddingRight: "0px", marginLeft: "5px" }}
              >
                <div className="statusbox sq" style={{ minWidth: "44%" }}>
                  <i className="fa-icon fa-icon-top fa fa-building" />
                  <div>
                    <p>Departments</p>
                    <p>
                      <Link to="/home/create-department" className="link">
                        Add New Department
                      </Link>
                    </p>
                  </div>
                  <hr />
                  <p className="count">12</p>
                  <p className="count-label" style={{ marginBottom: "0.3rem" }}>
                    In Total
                  </p>
                </div>
              </div>
              <div
                className="col"
                style={{ paddingLeft: "0px", marginRight: "5px" }}
              >
                <div className="statusbox sq" style={{ minWidth: "44%" }}>
                  <FontAwesomeIcon
                    className="fa-icon fa-icon-top-client"
                    icon="user-tie"
                  />
                  <div>
                    <p>Clients</p>
                    <p>
                      <Link to="/home/create-client" className="link">
                        Add New Client
                      </Link>
                    </p>
                  </div>
                  <hr />
                  <p className="count">180</p>
                  <p className="count-label" style={{ marginBottom: "0.3rem" }}>
                    In Total
                  </p>
                </div>
              </div>
            </div>

            <div className="row" style={{ alignItems: "center" }}>
              <div className="col">
                <div className="statusbox rect" style={{ minWidth: "90%" }}>
                  <i className="fa-icon fa fa-users" />
                  <div>
                    <p>Consumers</p>
                    <p>
                      <Link to="/home/create-consumer" className="link">
                        Add New Consumer
                      </Link>
                    </p>
                  </div>
                  <hr />
                  <Row className="show-grid">
                    <Col xs={6} md={6}>
                      <p className="count">24</p>
                      <p className="count-label">Active</p>
                    </Col>
                    <Col xs={6} md={6}>
                      <p className="count">70</p>
                      <p className="count-label">In Total</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            <div className="row" style={{ alignItems: "center" }}>
              <div className="col">
                <div className="statusbox rect" style={{ minWidth: "90%" }}>
                  <i className="fa-icon fa fa-server" />
                  <div>
                    <p>Surveys</p>
                    <p>
                      <Link to="/home/create-survey" className="link">
                        Add New Survey
                      </Link>
                    </p>
                  </div>
                  <hr />
                  <Row className="show-grid">
                    <Col xs={6} md={6}>
                      <p className="count">24</p>
                      <p className="count-label">Active</p>
                    </Col>
                    <Col xs={6} md={6}>
                      <p className="count">70</p>
                      <p className="count-label">In Total</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>

            <div className="row" style={{ alignItems: "center" }}>
              <div className="col">
                <div
                  className="statusbox rect"
                  style={{ minWidth: "90%", marginTop: "4%" }}
                >
                  <i className="fa-icon fa fa-file-powerpoint-o" />
                  <div>
                    <p>Project Summary</p>
                    <p>
                      <Link to="/home/create-project" className="link">
                        Add New Project
                      </Link>
                    </p>
                  </div>
                  <hr />
                  <Row className="show-grid">
                    <Col xs={6} md={6}>
                      <p className="count">24</p>
                      <p className="count-label">Active</p>
                    </Col>
                    <Col xs={6} md={6}>
                      <p className="count">11</p>
                      <p className="count-label">Draft</p>
                    </Col>
                  </Row>
                  <Row className="show-grid">
                    <Col xs={6} md={6}>
                      <p className="count">12</p>
                      <p className="count-label">On Hold</p>
                    </Col>
                    <Col xs={6} md={6}>
                      <p className="count">80</p>
                      <p className="count-label">Completed</p>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
