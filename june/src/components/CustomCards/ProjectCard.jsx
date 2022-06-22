/**
 * 
 * ProjectCard component.
 * 
 * This component displays Project name,location,income,products purchased,categories and mission.
 * 
 */
import React from "react";
import { Link } from "react-router-dom";

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
import Tooltip from "@material-ui/core/Tooltip";
import dd from "assets/img/dd.jpg";

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
    borderRadius: "10px"
  },
  media: {
    height: 210,
    minHeight: 200,
    backgroundColor: "rgba(0,0,0,0.5)",
    backgroundBlendMode: "color"
  },
  linkText: {
    color: "#000",
    textOverflow: "ellipsis",
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  title: {
    marginBottom: 14,
    fontSize: 12
  },
  pos: {
    marginBottom: 10
  },
  white: {
    color: "#fff"
  },
  cardAction: {
    margin: "0px 5px 0px 14px;",
    borderTop: "2px solid #eee",
    padding: "0px 0px 0px 0px"
  },
  tooltipText: {
    fontSize: "0.8rem"
  }
};

class ProjectCard extends React.Component {
  render() {
    const { classes } = this.props;
    const { project } = this.props;
    const { index } = this.props;

    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={project.project_image ? project.project_image : dd}
          //title={project.project_name}
          >
            <CardContent style={{ padding: "16px 16px 0px 16px" }}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h5" className={classes.white}
                    style={{
                      padding: "5px 0px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}>
                    <Tooltip
                      title={project.project_name}
                      placement={"bottom-start"}
                      enterDelay={300}
                      classes={{ tooltip: classes.tooltipText }}
                    >
                      <Link
                        to={"/home/view-project/" + project.id}
                        className={("link", classes.linkText, classes.white)}
                      >
                        {project.project_name}
                      </Link>
                    </Tooltip>
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                variant="body2"
                className={(classes.title, classes.white)}
                style={{ padding: "5px 0px" }}
              >
                Country/Location: {project.country}/ {project.location}
              </Typography>

              <Typography
                variant="body2"
                className={(classes.title, classes.white)}
              >
                Income: {project.income}
              </Typography>

              <Typography
                variant="body2"
                className={(classes.title, classes.white)}
              >
                Products Purchased: {project.products_purchased}
              </Typography>

              <Tooltip
                title={project.category}
                placement={"bottom-start"}
                enterDelay={300}
                classes={{ tooltip: classes.tooltipText }}
              >
                <Typography
                  variant="body2"
                  className={(classes.pos, classes.white)}
                  style={{
                    padding: "5px 0px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis"
                  }}
                >
                  Categories: {project.category}
                </Typography>
              </Tooltip>
            </CardContent>

            <CardActions className={classes.cardAction}>
              <Grid container alignItems="center">
                <Grid item md={10}>
                  <Typography variant="body2" className={classes.white} style={{ fontWeight: 900 }}>
                    Missions : {project.mission_list.length}
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <IconButton
                    aria-label="Delete"
                    className={classes.buttons}
                    onClick={this.props.deleteItem(project.id, index, project.project_name)}
                  >
                    <DeleteForeverIcon color="action" />
                  </IconButton>
                </Grid>
              </Grid>
            </CardActions>
          </CardMedia>
        </Card>
      </MuiThemeProvider>
    );
  }
}

ProjectCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ProjectCard);
