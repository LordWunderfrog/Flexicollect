/**
 * CreateClientScreen component
 * 
 * This component is used to manage the missions associated with clients.
 *
 */

import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import PageOne from "./PageOne";
import PageTwo from "./PageTwo";
/*Snackbar. */
import Snackbar from "components/Snackbar/Snackbar.jsx";
/* Material UI. */
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "components/Card/CardHeader.jsx";
/* Api. */
import api2 from "../../helpers/api2";


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#074e9e"
    }
  },
  overrides: {
    MuiCard: {
      root: {
        overflow: "unset"
      }
    }
  }
});

const styles = theme => ({
  root: {
    width: "100%"
  },
  backButton: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  card: {
    minWidth: "90%",
    //backgroundColor:"#f1f1f1"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  stepIcon: {
    color: "#d15c17"
  },
  checked: {}
});

/* Handles and return the stepper function name. */
function getSteps() {
  return [
    "PageOne",
    "PageTwo",
  ];
}




class ClientScreen extends Component {
  constructor(props, context) {
    super(props, context);

    super(props);
    this.state = {
      /* Snackbar props. */
      msgColor: "info",
      message: "",
      br: false,
      seletectdetail: this.props.location.state.data,
      activeStep: 1,
      column_def: {
        column_order: [],
        hidden_column: []
      },
      oldcolumn_def: {
        column_order: [],
        hidden_column: []
      },
      client_ids: [],
      oldclient_ids: [],
      redirect: false

    }
    this.childPageOne = React.createRef();
    this.childPageTwo = React.createRef();
    this.UpdateClientIds = this.UpdateClientIds.bind(this);
  }

  componentDidMount() {

    if (this.props.location.state.detail !== false) {
      this.setState({
        oldcolumn_def: {
          column_order: this.props.location.state.detail.response_config.column_def.column_order,
          hidden_column: this.props.location.state.detail.response_config.column_def.hidden_column
        },
        oldclient_ids: this.props.location.state.detail.client_ids,
        client_ids: this.props.location.state.detail.client_ids,
        column_def: {
          column_order: this.props.location.state.detail.response_config.column_def.column_order,
          hidden_column: this.props.location.state.detail.response_config.column_def.hidden_column
        }
      })
    }
    if (this.props.location.state.data) {
      this.setState({
        seletectdetail: this.props.location.state.data
      })
    }
  }

  /* Handles the snackbar message notification. */
  showNotification(msg, color) {
    this.setState({
      message: msg,
      msgColor: color
    });

    let place = "br";
    var x = [];
    x[place] = true;
    this.setState(x);
    this.alertTimeout = setTimeout(
      function () {
        x[place] = false;
        this.setState(x);
      }.bind(this),
      3000
    );
  }

  /* Handles the events to update columndef in pageOne.jsx. */
  onClickChildPageOne = () => {
    this.childPageOne.current.UpdateColumnDef()
  };

  /* Handles the events to update clientid in pageTwo.jsx. */
  onClickChildPageTwo = () => {
    this.childPageOne.current.UpdateClientIds()
  };

  /* Handles the events to update column definition. */
  UpdateColumnDef = (column_def) => {
    this.setState({ column_def: column_def })
  }

  /* Handles the events to update clientid. */
  UpdateClientIds = (value) => {
    this.setState({ client_ids: value })
  }

  /* Handles the events to navigate to next page. */
  handlenext = () => {
    this.setState({
      activeStep: 2
    })
  }

  /* Handles the events to navigate to previous page. */
  handlback = () => {
    this.setState({
      activeStep: 1
    })
  }

  /* Handles the events to cancel the actions. */
  handlecancel = () => {
    this.setState({ redirect: true })
  }

  /* Handles the api to publish the data. */
  handlepublish = () => {
    let data = {}
    data.column_def = { hidden_column: [] }
    data.column_def = { column_order: [] }

    data.project_id = this.state.seletectdetail.project_id
    data.mission_id = this.state.seletectdetail.mission_id
    data.client_ids = this.state.client_ids ? this.state.client_ids : []
    data.column_def.hidden_column = this.state.column_def.hidden_column.length > 0 ? this.state.column_def.hidden_column : []
    data.column_def.column_order = this.state.column_def.column_order.length > 0 ? this.state.column_def.column_order : this.state.oldcolumn_def.column_order

    if (this.props.location.state.detail !== false) {
      api2
        .patch("v1/client_response_config", data)
        .then(resp => {

          if (resp.data.status === 200) {
            this.showNotification("Client Response Screen Updated Successfully", "success");
            setTimeout(() => {
              this.setState({ redirect: true });
            }, 1500);
          }
        })
        .catch(error => {
          //showNotification("Someting went Wrong", "danger");
          console.error(error);
        });
    }
    else {

      api2
        .post("v1/client_response_config", data)
        .then(resp => {
          if (resp.data.status === 200) {
            this.showNotification("Client Response Screen Created Successfully", "success");
            setTimeout(() => {
              this.setState({ redirect: true });
            }, 1500);
          }
        })
        .catch(error => {
          //showNotification("Someting went Wrong", "danger");
          console.error(error);
          console.log('here')
          console.log(data)
        });


    }
  }

  render() {

    if (this.state.redirect === true) {
      return <Redirect
        to={{
          pathname: '/home/mission-response',
          state: { detail: this.state.seletectdetail }
        }}
      />;
    }
    let body_class = this.props.fullWidth
      ? "body-form body-form-expanded"
      : "body-form body-form-collapsed";
    const { classes } = this.props;
    const { msgColor, br, message } = this.state;
    const { activeStep } = this.state;
    const steps = getSteps();


    function getStepContent(
      stepIndex,
      state,
      childPageOne,
      childPageTwo,
      UpdateColumnDef,
      UpdateClientIds,
      seletectdetail,
      oldcolumn_def,
      oldclient_ids
    ) {
      switch (stepIndex) {
        case 1:
          return (

            <PageOne
              ref={childPageOne}
              state={state}
              UpdateColumnDef={UpdateColumnDef}
              seletectdetail={seletectdetail}
              oldcolumn_def={oldcolumn_def}
            />
          );
        case 2:
          return (
            <PageTwo
              ref={childPageTwo}
              state={state}
              UpdateClientIds={UpdateClientIds}
              oldclient_ids={oldclient_ids}
            />
          );
        default:
          return null

      }
    }

    return (
      <MuiThemeProvider theme={theme}>
        <div className={body_class}>
          <Card className={classes.card}>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>{this.props.location.state.detail === false ? "Create Client Response Screen" : "View Client Response Screen"}</h4>
            </CardHeader>
            <div className="Content" style={{ height: "calc(100% - 50px)" }}>
              <CardContent style={{ height: "90%" }}>
                {getStepContent(
                  activeStep,
                  this.state,
                  this.childPageOne,
                  this.childPageTwo,
                  this.UpdateColumnDef,
                  this.UpdateClientIds,
                  this.state.seletectdetail,
                  this.state.oldcolumn_def,
                  this.state.oldclient_ids
                )}

              </CardContent>
              <CardActions
                style={{
                  bottom: 0,
                  backgroundColor: "#f1f1f1",
                  height: "10%"
                }}
              >
                <div style={{ width: "100%" }}>
                  <Button
                    style={{ float: "left", left: 0 }}
                    variant="contained"
                    color="primary"
                    className={classes.backButton}
                    onClick={
                      activeStep === steps.length - 1
                        ? this.handlecancel
                        : this.handlback

                    }

                  >
                    {"Back"}

                  </Button>

                  <div style={{ float: "right", right: 0 }}>

                    <Button
                      variant="contained"
                      color="primary"
                      onClick={
                        activeStep === steps.length - 1
                          ? this.handlenext
                          : this.handlepublish
                      }
                    >
                      {activeStep === steps.length - 1 ? "Next" : this.props.location.state.detail === false ? "Create" : "Update"}
                    </Button>
                  </div>
                </div>
              </CardActions>
            </div>
          </Card>

        </div>
        <Snackbar
          place="br"
          color={msgColor}
          open={br}
          message={message}
          closeNotification={() => this.setState({ br: false })}
          close
        />
      </MuiThemeProvider>
    )
  }
}
export default withStyles(styles)(ClientScreen);