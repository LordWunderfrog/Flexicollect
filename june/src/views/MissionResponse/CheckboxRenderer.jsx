/**
 * Checkbox Renderer component.
 * 
 * This component is used to render the checkbox in mission response page.
 * 
 * This component is imported in aggrid table.Based on the selection of checkbox it will update the reviewed status.
 *
 */

import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
/* API */
import api2 from "../../helpers/api2";

export default class CheckboxRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.data.reviewed === 1 ? true : false,
      disabled: (this.props.data.status === 'In Progress' || this.props.data.status === 'Hold' || this.props.data.status === 'Re-Publish') ? true : false
    };
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  /* Handles the event to update the changes in selection of checkbox and calls the api to update the reviewed status. */
  handleCheckboxChange(event) {
    this.setState({ value: event.target.checked });
    this.updateResponseReviewed(this.props.data.status, this.props.data.survey_tag_id, event.target.checked ? "1" : "0", this.props.data.customer_id);
  }

  /* Handles the api to update the reviewed status and update the response to the server. */
  updateResponseReviewed = (status, survey_tag_id, reviewed, customer_id) => {
    let data = { survey_tag_id: survey_tag_id, reviewed: reviewed, customer_id: customer_id };
    api2
      .patch("v1/survey_report/update_reviewed", data)
      .then(resp => {
        if (resp.status === 200) {
          this.props.agGridReact.props.showNotification("Reviewed Status Updated Successfully", "success");
          this.props.data.reviewed = parseInt(reviewed);
          if (status === 'New' && reviewed === "1") {
            this.props.data.status = 'Accepted';
          }

          this.props.agGridReact.props.updateRowData(survey_tag_id, this.props.data);
          //redrawRowData(survey_tag_id, this.props.data);
        }
        else {
          this.props.agGridReact.props.showNotification("Error in updating the reviewed status", "danger");
        }

      })
      .catch(error => {
        this.props.agGridReact.props.showNotification("Error in updating the reviewed status " + error.message, "danger");
      });
  };


  render() {
    return (
      <Checkbox
        checked={this.state.value}
        disabled={this.state.disabled}
        onChange={this.handleCheckboxChange}
        color="default"
      ></Checkbox>);
  }
}
