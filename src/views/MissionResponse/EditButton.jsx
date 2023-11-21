/**
 * EditButton component.
 * 
 * This component is used to design the Edit button.
 * 
 * This button is imported in aggrid table.Used to Edit the mission response.
 *
 */

import React, { Component } from "react";
import Button from "@material-ui/core/Button";

export default class EditButton extends Component {
  /* Function is used to call the methodFromParent method in AgMissionResponse component. */
  invokeParentMethod = () => {
    this.props.context.componentParent.methodFromParentEdit(this.props);
  };

  render() {
    return (
      <span>
        <Button
          variant="contained"
          style={{ height: 20, lineHeight: 0.5, fontSize: 10, marginTop: 15, marginBottom: 15 }}
          onClick={this.invokeParentMethod}
          color="primary"
        >
          Edit
        </Button>
      </span>
    );
  }
}
