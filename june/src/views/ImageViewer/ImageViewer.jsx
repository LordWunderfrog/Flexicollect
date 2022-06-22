/**
 * 
 * Dashboard component.
 * 
 * This component is used to view the summary of projects,missions,departments,surveys and clients.
 * 
 */

import React, { Component } from "react";
import { Link } from "react-router-dom";
//import "./Dashboard.css";
import api2 from "../../helpers/api2";
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
import { useState, useEffect } from "react";
library.add(faUserTie);

class ImageViewer extends Component {
  constructor(props) {
    console.log("consturctor imageviewer")
    super(props);
    //this.path = localStorage.getItem("path")
    this.apikey = 1;
    this.name = ''
    this.url = ''
    this.currentUrl = ''
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
    this.url = localStorage.getItem("path");
    localStorage.removeItem("path")
    //this.props.handleCollapseScreen(true);

  }

  render() {

    this.url = window.location.search;
    this.currentUrl = window.location.href;
    if (this.currentUrl.includes("sur__")) {
      //this.url = localStorage.getItem("path")
      this.url = this.currentUrl
    }
    else {
      //this.url = localStorage.getItem("path")
    }
    this.apikey = localStorage.getItem("api_key")

    var n = this.url.lastIndexOf('/');
    if (n != null) {
      //localStorage.removeItem("path")
    }
    console.log('n')
    console.log(n)
    var result = this.url.substring(n + 1);
    //var result = this.path.substring(n + 1);
    console.log(result);
    //this.name = localStorage.getItem("username")
    //console.log("this test");
    //console.log(this.test);
    console.log("this.url");
    console.log(this.url)
    console.log("this.currentUrl");
    console.log(this.currentUrl)
    console.log("this api");
    console.log(this.apikey);
    //this.url = null;
    //console.log("this.namne");
    //console.log(this.name)


    //this.apikey = JSON.stringify(this.apikey)
    //var access = [this.name, this.apikey]
    //var sendAccess = JSON.stringify(access)
    //console.log(localStorage.getItem("path"));




    //var n = this.path.lastIndexOf('/');
    //var n = str.lastIndexOf('/');
    //var result = str.substring(n + 1);
    //var result = this.path.substring(n + 1);
    //console.log(result);

    //localStorage.removeItem("path");
    //const values = queryString.parse(this.props.location.hash);
    let body_class = this.props.fullWidth
      ? "body-full body-full-expanded"
      : "body-full body-full-collapsed";
    if (result.includes(".mp4")) {
      return (
        <div className={body_class}>
          <div className="head-adjust">
            <div className="row">
              <div className="col-md-2">
                <h5 style={{ margin: "0.5rem", marginLeft: "30px" }}>
                  Image Viewer
                </h5>
              </div>


            </div>
            <div onContextMenu={e => e.preventDefault()} style={{ width: "100%" }}>
              {

                //this.apikey = localStorage.getItem("api_key"),
                //localStorage.removeItem("path")
              }

              <video width="500" height="250" controls preload='metadata' controlsList="nodownload" disablePictureInPicture={true}
                style={{
                  minHeight: "150px",
                  minWidth: "250px",
                  marginTop: 5,
                  marginBottom: 5,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  float: "center"
                }}>
                <source src={"https://devapi.flexicollect.com/v1/gallery/survey_uploads/" + result + "?token=" + this.apikey} />
              </video>
            </div>
          </div>

        </div>
      );
    }
    else {
      return (
        <div className={body_class}>
          <div className="head-adjust">
            <div className="row">
              <div className="col-md-2">
                <h5 style={{ margin: "0.5rem", marginLeft: "30px" }}>
                  Image Viewer
                </h5>
              </div>


            </div>
            <div onContextMenu={e => e.preventDefault()} style={{ width: "100%" }}>
              {

                //this.apikey = localStorage.getItem("api_key"),
                //localStorage.removeItem("path")
              }

              <img
                src={"https://devapi.flexicollect.com/v1/gallery/survey_uploads/" + result + "?token=" + this.apikey}
                alt={"https://devapi.flexicollect.com/v1/gallery/survey_uploads/" + result + "?thumbnail=no&token=" + this.apikey}
                height="250"
                style={{
                  objectFit: "contain",
                  margin: "200px 200px 200px 0px"
                }}
              />
            </div>
          </div>


        </div>
      );
    }
  }
  //result = null;
}

export default ImageViewer;
