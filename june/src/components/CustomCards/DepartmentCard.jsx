/**
 * 
 * DepartmentCard component.
 * 
 * This component displays department name,location,deartment owner,email,phone,clients,projects and surveys.
 * 
 * 
 */
import React from "react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import InfoIcon from "@material-ui/icons/Info";
import Popover from "@material-ui/core/Popover";
import Tooltip from "@material-ui/core/Tooltip";

import dd from "assets/img/dd.jpg";
import { Link } from "react-router-dom";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  lightTooltip: {
    background: "#fff",
    color: "#000",
    fontSize: 11
  },
  palette: {
    primary: {
      main: "#304ffe"
    },
    secondary: {
      main: "#64dd17"
    }
  },
  overrides: {
    Typography: {
      root: {
        color: "white"
      }
    },
    MuiTypography: {
      root: {
        color: "white"
      }
    }
  }
});

const styles = {
  card: {
    flexBasis: "32.333%",
    margin: "0.5%",
    borderRadius: "10px",
    minHeight: 200
  },
  media: {
    height: 200,
    minHeight: 200,
    backgroundColor: "rgba(0,0,0,0.5)",
    backgroundBlendMode: "color"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 12
  },
  pos: {
    marginTop: 10,
    fontSize: 12
  },
  white: {
    color: "#fff"
  },
  cardAction: {
    padding: "0px 5px 0px 14px;",
    borderTop: "2px solid #eee"
  },
  pop: {
    padding: 10,
    width: "300px"
  }
};

class DepartmentCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { classes } = this.props;
    const { department } = this.props;
    const { anchorEl } = this.state;
    const { index } = this.props;
    const open = Boolean(anchorEl);

    const canDelete = this.props.canDelete;

    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={department.departmentImage ? department.departmentImage : dd}
            title={department.departmentName}
          >
            <CardContent style={{ height: "140px" }}>
              <Grid container alignItems="center" spacing={8}>
                <Grid item md={10}>
                  <Typography variant="h6" className={classes.white}
                    style={{
                      padding: "5px 0px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}>
                    <Tooltip
                      title={department.departmentName}
                      placement={"bottom-start"}
                      enterDelay={300}
                      classes={{ tooltip: classes.tooltipText }}
                    >
                      <Link
                        to={"/home/view-department/" + department.id}
                        className={("link", classes.white)}
                      >
                        {department.departmentName}
                      </Link>
                    </Tooltip>
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <IconButton
                    aria-label="Delete"
                    className={(classes.buttons, classes.white)}
                    aria-owns={open ? "simple-popper" : null}
                    aria-haspopup="true"
                    variant="contained"
                    onClick={this.handleClick}
                  >
                    <InfoIcon />
                  </IconButton>

                  <Popover
                    id="simple-popper"
                    open={open}
                    anchorEl={anchorEl}
                    onClose={this.handleClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                    transformOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <div className={classes.pop}>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                      >
                        Country/Location :
                        {department.country + "/" + department.location}
                      </Typography>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                      >
                        Department Owner :
                        {department.departmentOwner
                          ? department.departmentOwner.name
                          : ""}
                      </Typography>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                      >
                        Email :
                        {department.departmentOwner
                          ? department.departmentOwner.email
                          : ""}
                      </Typography>
                      <Typography
                        className={classes.title}
                        color="textSecondary"
                      >
                        Phone :
                        {department.departmentOwner
                          ? department.departmentOwner.mobile
                          : ""}
                      </Typography>

                      <Typography className={classes.pos} color="textSecondary">
                        Categories: {department.tags}
                      </Typography>
                    </div>
                  </Popover>
                </Grid>
              </Grid>
            </CardContent>

            <CardActions className={classes.cardAction}>
              <Grid container alignItems="center" spacing={8}>
                <Grid item md={3}>
                  <Typography variant="body2" className={classes.white}>
                    Clients {department.clients}
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="body2" className={classes.white}>
                    Projects {department.projects}
                  </Typography>
                </Grid>
                <Grid item md={3}>
                  <Typography variant="body2" className={classes.white}>
                    Surveys {department.surveys}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item md={3}>
                {canDelete ? (
                  <IconButton
                    aria-label="Delete"
                    className={(classes.buttons, classes.white)}
                    onClick={this.props.deleteItem(
                      department.id,
                      department.departmentName,
                      index
                    )}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                ) : null}
              </Grid>
            </CardActions>
          </CardMedia>
        </Card>
      </MuiThemeProvider>
    );
  }
}

DepartmentCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DepartmentCard);
