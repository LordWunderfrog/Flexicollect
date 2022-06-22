/**
 * 
 * LeftNav component.
 * 
 * This component is used to manage the display of menu based on the credentails we are login.
 * 
 */
import React from "react";
import { Redirect } from "react-router-dom";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faTachometerAlt } from "@fortawesome/free-solid-svg-icons";
import { faSitemap } from "@fortawesome/free-solid-svg-icons";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { faProjectDiagram } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

import MetisMenu from "react-metismenu";
import RouterLink from "react-metismenu-router-link";

import logo from "assets/img/white-logo.png";
import api2 from "../../helpers/api2";
import * as Constants from "../../helpers/constants.jsx";

import { admContent, admContentCollapsed, admMobileContent } from "./adminView";
import {
  empContent,
  empContentCollapsed,
  empMobileContent
} from "./employeeView";

import "./LeftNav.css";

import { clnContent, clnContentCollapsed, clnMobileContent } from "./clientView"

library.add(
  faChevronLeft,
  faTachometerAlt,
  faSitemap,
  faBuilding,
  faProjectDiagram,
  faChartLine,
  faUsers,
  faNewspaper
);
export default class LeftNav extends React.Component {
  constructor() {
    super();
    let role = localStorage.getItem("role");

    this.state = {
      navContent: [],
      call: false,
      loggedOut: false,
      role: role,
      // content: role === "ADMIN" ? admContent : empContent,
      // contentCollapsed:
      //   role === "ADMIN" ? admContentCollapsed : empContentCollapsed,
      // mobileContent: role === "ADMIN" ? admMobileContent : empMobileContent
      content: [],
      contentCollapsed: [],
      mobileContent: []
    };
  }

  componentDidMount() {
    this.Role();
    /*if (!this.props.isMobile) {
      this.updateDepartmentList();
    }*/
  }

  updateDepartmentList() {
    api2
      .get("department")
      .then(response => {
        let newContent = [];

        for (let i = 0; i < this.state.content.length; i++) {
          let item = this.state.content[i];
          newContent.push(item);
        }
        let allDepts = {
          id: newContent.length + 1,
          parentId: 2,
          label: "All Departments",
          to: "/home/departments/"
        };
        newContent.push(allDepts);
        for (let i = 0; i < response.data.length; i++) {
          let dept = response.data[i];
          let inCont = {
            id: newContent.length + 1,
            parentId: 2,
            label: dept.departmentName,
            to: "/home/view-department/" + dept.id
          };
          newContent.push(inCont);
        }

        this.setState({ navContent: newContent, call: true });
      })
      .catch(error => {
        console.error(error);
      });
  }

  logOut = () => {
    localStorage.removeItem("api_key");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    this.setState({ loggedOut: true });
    window.location.href = Constants.COGNITO_LOGOUT_URL;

  };

  Role = () => {
    if (this.state.role === "ADMIN") {
      this.setState({
        content: admContent,
        contentCollapsed: admContentCollapsed,
        mobileContent: admMobileContent
      })

    }
    else if (this.state.role === "EMPLOYEE") {
      this.setState({
        content: empContent,
        contentCollapsed: empContentCollapsed,
        mobileContent: empMobileContent
      })
    }
    else if (this.state.role === "CLIENT") {
      this.setState({
        content: clnContent,
        contentCollapsed: clnContentCollapsed,
        mobileContent: clnMobileContent
      })
    }

  }

  render() {
    if (this.state.loggedOut) {
      return <Redirect to="/" />;
    }

    let { fullWidth } = this.props;
    let btn_class = fullWidth ? "body-left" : "body-left-collapsed";
    let sidebar_footer = fullWidth ? "sidebar-footer" : "sidebar-footer-shrink";
    let arrow_container = fullWidth
      ? "floating-arrow floating-arrow-expanded"
      : "floating-arrow floating-arrow-collapsed";

    let arrowClass = fullWidth ? "fa fa-angle-left" : "fa fa-angle-right";

    if (!this.props.isMobile) {
      if (this.state.navContent.length > 0) {
        let metisContent = fullWidth
          ? this.state.navContent
          : this.state.contentCollapsed;

        return (
          <div className={btn_class}>
            <div className="left-nav">
              <div className="menu-logo-wrapper">
                <img src={logo} className="menu-logo" alt="logo" />
              </div>
              <div
                className={arrow_container}
                onClick={this.props.handleFullscreen}
              >
                <i
                  style={{ height: "3%", padding: "3% 6.5%", color: "#fff" }}
                  className={arrowClass}
                />
              </div>
              <MetisMenu
                className="metis-menu-parent"
                classNameLink="metis-menu"
                iconNameStateVisible="angle-down"
                iconNameStateHidden="angle-left"
                content={metisContent}
                LinkComponent={RouterLink}
                activeLinkFromLocation
                activeLinkId={1}
              />
              <div className={sidebar_footer}>
                <ul className="metismenu-container">
                  <li className="metismenu-item">
                    <div
                      className="metismenu-link metis-menu"
                      onClick={this.logOut}
                    >
                      <i className="metismenu-icon fa fa-sign-out" />
                      {fullWidth ? "Logout" : null}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        );
      } else {
        let metisContent = fullWidth
          ? this.state.content
          : this.state.contentCollapsed;
        return (
          <div className={btn_class}>
            <div className="left-nav">
              <div className="menu-logo-wrapper">
                <img src={logo} className="menu-logo" alt="logo" />
              </div>
              <div
                className={arrow_container}
                onClick={this.props.handleFullscreen}
              >
                <i
                  style={{ height: "3%", padding: "3% 6.5%", color: "#fff" }}
                  className={arrowClass}
                />
              </div>
              <MetisMenu
                className="metis-menu-parent"
                classNameLink="metis-menu"
                iconNameStateVisible="angle-down"
                iconNameStateHidden="angle-left"
                content={metisContent}
                LinkComponent={RouterLink}
                activeLinkFromLocation
              />
            </div>
            <div className={sidebar_footer}>
              <ul className="metismenu-container">
                <li className="metismenu-item">
                  <div
                    className="metismenu-link metis-menu"
                    onClick={this.logOut}
                  >
                    <i className="metismenu-icon fa fa-sign-out" />
                    {fullWidth ? "Logout" : null}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        );
      }
    } else {
      return (
        <MetisMenu
          className="metis-menu-parent"
          classNameLink="metis-menu"
          iconNameStateVisible="angle-down"
          iconNameStateHidden="angle-left"
          content={this.state.mobileContent}
          LinkComponent={RouterLink}
          activeLinkFromLocation
        />
      );
    }
  }
}
