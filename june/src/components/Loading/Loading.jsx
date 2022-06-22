/**
 * 
 * Loading component.
 * 
 * This component is used to display the loading symbol.
 * 
 */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  progress: {
    margin: "10%"
  },
  dialog: {},
  paper: {
    boxShadow: "none",
    background: "transparent"
  }
});
class Loading extends React.Component {
  handleClose = () => {
    this.props.onClose(this.props.selectedValue);
  };

  handleListItemClick = value => {
    this.props.onClose(value);
  };

  render() {
    const { classes, onClose, selectedValue, ...other } = this.props;

    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        {...other}
        classes={{ paper: classes.paper }}
        style={{ background: "transparent !important" }}
      >
        <div style={{ margin: "0px 60px 25px", textAlign: "center" }}>
          <CircularProgress size={60} className={classes.progress} />
        </div>
      </Dialog>
    );
  }
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  selectedValue: PropTypes.string
};

export default withStyles(styles)(Loading);
