/**
 * Snackbar component.
 * 
 * This component is used to manage the snackbar notifications.
 * 
 */
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Snack from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// core components
import snackbarContentStyle from "assets/jss/material-dashboard-react/components/snackbarContentStyle.jsx";
import Button from "@material-ui/core/Button";
let Topstyle = null;
function Snackbar({ ...props }) {
  const { classes, message, color, close, icon, place, open } = props;
  var action = [];
  function btnClick() {
    if (props.back) {
      props.back()
    }
    else {
      props.saveUpdate()
    }

  }
  const messageClasses = classNames({
    [classes.iconMessage]: icon !== undefined
  });
  if (close !== undefined) {
    if (props.update) {
      Topstyle = {
        top: '70px', bottom: 'unset', left: '50%',
        right: 'auto',
        transform: 'translateX(-50%)'
      }
      action = [
        <>
          <Button
            style={{ float: "right", right: 0, fontSize: '10px' }}
            variant="contained"
            color="primary"
            onClick={() => btnClick()}
          >
            Save & Continue
          </Button>
          &nbsp;
          <Button
            style={{ float: "right", right: 0, fontSize: '10px' }}
            variant="contained"
            color="primary"
            onClick={() => props.closeNotification()}
          >
            Continue Editing
          </Button>
        </>
      ];
    }
    else {
      Topstyle = null
      action = [
        <IconButton
          className={classes.iconButton}
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={() => props.closeNotification()}
        >
          <Close className={classes.close} />
        </IconButton>
      ];
    }
  }
  return (
    <div className={Topstyle !== null ? 'msgcolor' : ''}>
      <Snack
        style={Topstyle}
        anchorOrigin={{
          vertical: place.indexOf("t") === -1 ? "bottom" : "top",
          horizontal:
            place.indexOf("l") !== -1
              ? "left"
              : place.indexOf("c") !== -1 ? "center" : "right"
        }}
        open={open}
        message={
          <div>
            {icon !== undefined ? <props.icon className={classes.icon} /> : null}
            <span className={messageClasses}>{message}</span>
          </div>
        }
        action={action}
        ContentProps={{
          classes: {
            root: classes.root + " " + classes[color],
            message: classes.message
          }
        }}
      />
    </div>
  );
}

Snackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.node.isRequired,
  color: PropTypes.oneOf(["info", "success", "warning", "danger", "primary"]),
  close: PropTypes.bool,
  icon: PropTypes.func,
  place: PropTypes.oneOf(["tl", "tr", "tc", "br", "bl", "bc"]),
  open: PropTypes.bool
};

export default withStyles(snackbarContentStyle)(Snackbar);
