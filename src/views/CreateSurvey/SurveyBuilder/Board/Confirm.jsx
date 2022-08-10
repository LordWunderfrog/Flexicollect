
/**
 * Confirm component.
 * 
 * This component is used to manage the popup during delete conditions.
 *
 */

import * as React from "react"
import { Dialog } from "@reach/dialog"
import "react-drop-zone/dist/styles.css";


class ConfirmStatusChange extends React.Component {
  state = {
    open: false,
    callback: null
  };

  /* Handles the events to show popup during delete. */
  show = callback => event => {
    event.preventDefault();

    event = {
      ...event,
      target: { ...event.target, value: event.target.value }
    };

    this.setState({
      open: true,
      callback: () => callback(event)
    })
  };

  /* Handles the events to hide popup. */

  hide = () => this.setState({ open: false, callback: null });

  /* Handles the events to confirm the actions. */
  confirm = () => {

    this.state.callback();
    this.hide()
  };

  render() {
    return (
      <React.Fragment>
        {this.props.children(this.show)}
        {this.state.open && (
          <Dialog className="dialogpcls">
            <h1 className="h1popupcls">{this.props.title}</h1>
            <p>{this.props.description}</p>

            <div className="dialogboxfooter">
              <button className=" MuiButton-contained-160 MuiButton-root-149 MuiButtonBase-root-144 di_btn_cancel" onClick={this.hide}>Cancel</button>
              <button className="di_btn_ok MuiButton-containedPrimary-161 MuiButton-contained-160 MuiButton-root-149 MuiButtonBase-root-144" onClick={this.confirm}>OK</button>
            </div>
          </Dialog>
        )}
      </React.Fragment>
    )
  }
}

export default ConfirmStatusChange;