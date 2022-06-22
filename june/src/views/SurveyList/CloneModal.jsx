/**
 * 
 * CloneModal component.
 * 
 * This component is used to manage the clone details.
 *
 */

import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";

class CloneModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cloneSurveyName: this.props.cloneSurveyName
    }
  }

  /* Handles the event to return the cloned survey name. */
  getSurveyname() {
    return this.state.cloneSurveyName
  }

  render() {
    return <TextField style={{
      display: "flex",
      minWidth: "300px"
    }}

      value={this.state.cloneSurveyName}
      onChange={event => {
        this.setState({ cloneSurveyName: event.target.value });
      }}
    />
  }
}
export default CloneModal