/**
 * Preview Page component.
 *
 * This component is used to preview the project and mission details.
 */

import React, { Component } from "react";

/* Material UI. */
import withStyles from "@material-ui/core/styles/withStyles";

/* Custom Components */
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

/* bootstrat 1.0 */
import { Col, Row, Container, Form } from "react-bootstrap";

/* css */
import "./CreateProject.css";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  },
  preview: {
    marginTop: "10%",
    fontSize: "larger"
  },
  card: {
    padding: "50px 0px"
  }
};

class PreviewPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    const classes = this.props.classes;

    return (
      <div id="preview" className={classes.preview}>
        <Container className="group-container">
          <Row className="group-header">
            <Col md={12} style={{ width: "100%", textAlign: "center" }}>
              Project Details
            </Col>
          </Row>
          <GridContainer>
            <GridItem xs={1} sm={1} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>Project Name</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <Form.Label>: {this.props.state.projectName}</Form.Label>
            </GridItem>

            <GridItem xs={2} sm={2} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>Categories</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>: {this.props.state.category}</Form.Label>
            </GridItem>

            <GridItem xs={1} sm={1} md={1} />
          </GridContainer>
          <GridContainer>
            <GridItem xs={1} sm={1} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>Country</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <Form.Label>: {this.props.state.country}</Form.Label>
            </GridItem>

            <GridItem xs={12} sm={12} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>Project Revenue</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>: {this.props.state.income}</Form.Label>
            </GridItem>

            <GridItem xs={1} sm={1} md={1} />
          </GridContainer>
          <GridContainer>
            <GridItem xs={1} sm={1} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>Survey Type</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <Form.Label>: {this.props.state.mission_survey_type}</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>No. Consumers</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>: {this.props.state.consumer_ids.length}</Form.Label>
            </GridItem>
          </GridContainer>
          <GridContainer>
            <GridItem xs={1} sm={1} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>Mission Name</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={3}>
              <Form.Label>: {this.props.state.missionName}</Form.Label>
            </GridItem>

            <GridItem xs={12} sm={12} md={1} />

            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>End Date</Form.Label>
            </GridItem>
            <GridItem xs={12} sm={12} md={2}>
              <Form.Label>
                : {this.props.state.endDate ? this.props.state.endDate.local().format("DD/MM/YYYY h:mm A") : ""}
              </Form.Label>
            </GridItem>

            <GridItem xs={1} sm={1} md={1} />
          </GridContainer>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(PreviewPage);
