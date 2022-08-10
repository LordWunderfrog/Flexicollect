/*
* ResponsesAndReport component. 
* This component will render Responses and Reporting menu for Admin / Employee User.
*  
*/
import React, { Component } from 'react';

// Material UI
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

//images
import headlinesfeed from "assets/img/headlinesfeed.png"
import missionresponses from "assets/img/missionresponses.png"
import missionanalytics from "assets/img/missionanalytics.png"

// Custom Components
import GridItem from "components/Grid/GridItem.jsx";
import { Link } from 'react-router-dom'

// API
import * as Constants from "../../helpers/constants.jsx";

const styles = {
  gridHeader: {
    width: "100%",
    marginLeft: "3%",
    marginBottom: 10,
    zIndex: 3
  },
}

export class ResponsesAndReport extends Component {
  openReportApp = e => {
    window.open(Constants.REPORTING_APP_URL)
  }
  render() {
    const { classes } = this.props;
    let body_class = this.props.fullWidth
      ? "body-full body-full-expanded"
      : "body-full body-full-collapsed";
    return (
      <div className={body_class}>
        <div className={classes.gridHeader}>
          <Grid
            container alignItems="center"
            justify="center"
            style={{
              height: '100%',
              display: 'flex',
              justifyContent: 'space-evenly',
              top: "50%",
              position: "relative",
              transform: "translateY(-50%)"
            }}>
            <div className="report-thumbs" style={{ width: "18%", background: "#fff", margin: "0 1%" }}>
              <GridItem>
                <Link
                  to="/home/mission-response">
                  <img src={missionresponses}
                    style={{
                      height: "auto",
                      width: "100%",
                      padding: "20px"
                    }}
                    alt="mission response"
                  />
                </Link>
              </GridItem>
              <GridItem style={{ textAlign: "end", padding: "0" }}>
                <Typography variant="h6"

                  style={{
                    fontSize: "16px",
                    float: "left",
                    minWidth: "85px",
                    marginRight: "15px",
                    lineHeight: "42px",
                    width: "100%",
                    textAlign: "center",
                    borderTop: "1px solid rgba(0,0,0,0.15)"
                  }}
                >Mission Responses</Typography>
              </GridItem>
            </div>
            <div className="report-thumbs" style={{ width: "18%", background: "#fff", margin: "0 1%" }}>
              <GridItem>
                <img src={headlinesfeed}
                  style={{
                    height: "auto",
                    width: "100%",
                    padding: "20px"
                    // background:'white'
                  }}
                  alt="headlines"
                />

              </GridItem>
              <GridItem style={{ textAlign: "end", padding: "0" }}>
                <Typography variant="h6"

                  style={{
                    fontSize: "16px",
                    float: "left",
                    minWidth: "85px",
                    marginRight: "15px",
                    lineHeight: "42px",
                    width: "100%",
                    textAlign: "center",
                    borderTop: "1px solid rgba(0,0,0,0.15)"
                  }}
                >Headlines</Typography>
              </GridItem>
            </div>
            <div className="report-thumbs" style={{ width: "18%", background: "#fff", margin: "0 1%" }}>
              <GridItem>
                <img src={missionanalytics}
                  alt="mission analytics"
                  style={{
                    height: "auto",
                    width: "100%",
                    padding: "20px",
                    cursor: 'pointer'

                  }}
                  onClick={this.openReportApp}
                />

              </GridItem>
              <GridItem style={{ textAlign: "end", padding: "0" }}>
                <Typography variant="h6"
                  style={{
                    fontSize: "16px",
                    float: "left",
                    minWidth: "85px",
                    marginRight: "15px",
                    lineHeight: "42px",
                    width: "100%",
                    textAlign: "center",
                    borderTop: "1px solid rgba(0,0,0,0.15)",
                    cursor: 'pointer'
                  }}
                  onClick={this.openReportApp}
                >Mission Analytics</Typography>
              </GridItem>
            </div>
          </Grid>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(ResponsesAndReport);