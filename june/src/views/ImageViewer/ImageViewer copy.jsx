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
    //this.props.handleCollapseScreen(true);

  }

  render() {

    this.url = window.location.search;
    this.apikey = localStorage.getItem("api_key")
    this.name = localStorage.getItem("username")
    console.log("this test");
    console.log(this.test);
    console.log("this.url");
    console.log(this.url)
    console.log("this apoi");
    console.log(this.apikey);
    console.log("this.namne");
    console.log(this.name)

    api2
      .post("/v1/gallery/survey_uploads/", this.url)
      .then(resp => {
        console.log('POsting')
        console.log(resp.data.posting)

      })
      .catch(error => {
        //this.stopLoading();
        console.error("uh oh");
      });
    //this.apikey = JSON.stringify(this.apikey)
    //var access = [this.name, this.apikey]
    //var sendAccess = JSON.stringify(access)
    //console.log(localStorage.getItem("path"));
    var str = localStorage.getItem("path")
    //localStorage.removeItem("path")
    //var n = this.path.lastIndexOf('/');
    var n = str.lastIndexOf('/');
    var result = str.substring(n + 1);
    //var result = this.path.substring(n + 1);
    console.log(result);

    //localStorage.removeItem("path");
    //const values = queryString.parse(this.props.location.hash);
    let body_class = this.props.fullWidth
      ? "body-full body-full-expanded"
      : "body-full body-full-collapsed";

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

              //this.apikey = localStorage.getItem("api_key")//,
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
              <source src={"https://devapi.flexicollect.com/v1/gallery/survey_uploads/" + result + "&apikey" + this.apikey} />
            </video>
          </div>
        </div>


      </div>
    );
  }
}

export default ImageViewer;
