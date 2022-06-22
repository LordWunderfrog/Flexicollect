/**
 * 
 * SurveyCard component.
 * 
 * This component displays survey name,created time,modified time,tags,associated projects and responses.
 * 
 */

import React from "react";
import { Link } from "react-router-dom";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Tooltip from "@material-ui/core/Tooltip";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#304ffe"
    },
    secondary: {
      main: "#64dd17"
    }
  }
});

const styles = {
  card: {
    flexBasis: "32.333%",
    margin: "0.5%",
    borderRadius: "10px"
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
  gray: {
    color: "#666"
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

class SurveyCard extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { isDraft: this.props.survey.isDraft };
  }

  handleDraft = event => {
    event.preventDefault();
    this.setState({ isDraft: !this.state.isDraft });
    console.log(this.state.isDraft);
  };

  render() {
    const { classes } = this.props;
    const { survey } = this.props;
    const { index } = this.props;

    if (survey.createdDate) {
      survey.createdDate = survey.createdDate.split("T")[0];
    }

    if (survey.updatedDate) {
      survey.updatedDate = survey.updatedDate.split("T")[0];
    }
    survey.questions = 0;
    survey.responses = 0;

    return (
      <Card className={classes.card}>
        <CardContent style={{ padding: "16px 16px 0px 16px" }}>
          <Grid container>
            <Grid item xs={10}>
              <Typography variant="h5">
                <Tooltip
                  title={survey.title}
                  placement={"bottom-start"}
                  enterDelay={300}
                  classes={{ tooltip: classes.tooltipText }}
                >
                  <Link
                    to={"/home/view-survey/" + survey.id}
                    className={("link", classes.linkText)}
                  >
                    {survey.title}
                  </Link>
                </Tooltip>
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <MuiThemeProvider theme={theme}>
                <Switch
                  checked={this.state.isDraft}
                  className={classes.buttons}
                  onChange={this.handleDraft}
                />
              </MuiThemeProvider>
            </Grid>
          </Grid>
          <Typography className={(classes.title, classes.gray)}>
            Project: {survey.project}
          </Typography>
          <Grid container alignItems="center">
            <Grid item xs={6}>
              <Typography className={(classes.pos, classes.gray)}>
                Created: {survey.published}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={(classes.pos, classes.gray)}>
                Modified: {survey.modified}
              </Typography>
            </Grid>
          </Grid>
          <Typography className={classes.pos} color="textSecondary">
            Tags: {survey.tags}
          </Typography>
        </CardContent>
        <CardActions className={classes.cardAction}>
          <Grid container alignItems="center">
            <Grid item md={4}>
              <Typography variant="body2">
                {survey.content} Elements
              </Typography>
            </Grid>
            <Grid item md={4}>
              <Typography variant="body2">
                {survey.responses} Responses
              </Typography>
            </Grid>
            <Grid item md={2}>
              <Tooltip
                title={"Clone"}
                placement={"bottom-start"}
                enterDelay={300}
                classes={{ tooltip: classes.tooltipText }}
              >
                <IconButton
                  aria-label="Clone"
                  className={classes.buttons}
                  onClick={this.props.cloneItem(survey.id, index, survey.title)}
                >
                  <i className="far fa-clone" color="action" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item md={2}>
              <Tooltip
                title={"Delete"}
                placement={"bottom-start"}
                enterDelay={300}
                classes={{ tooltip: classes.tooltipText }}
              >
                <IconButton
                  aria-label="Delete"
                  className={classes.buttons}
                  onClick={this.props.deleteItem(survey.id, index, survey.title)}
                >
                  <DeleteForeverIcon color="action" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    );
  }
}

SurveyCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SurveyCard);
