/**
 * 
 * ConsumerCard component.
 * 
 * This component displays Consumer name,email,phone,projects and delete button.
 * 
 */
import React from "react";
import { Link } from "react-router-dom";

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
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  }
})

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

class ConsumerCard extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { classes } = this.props;
    const { consumer } = this.props;
    const { index } = this.props;

    const defaultImg = "";

    let consumerImg =
      consumer.consumerImage != null ? consumer.consumerImage : defaultImg;

    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.card}>
          <CardContent style={{ padding: "16px 16px 0px 16px" }}>
            <Grid container>
              <Grid item xs={12}>
                <Typography variant="h5">
                  <Tooltip
                    title={consumer.firstname + " " + consumer.lastname}
                    placement={"bottom-start"}
                    enterDelay={300}
                    classes={{ tooltip: classes.tooltipText }}
                  >
                    <Link
                      to={"/home/view-consumer/" + consumer.id}
                      className={("link", classes.linkText)}
                    >
                      {consumer.firstname + " " + consumer.lastname}
                    </Link>
                  </Tooltip>
                </Typography>
              </Grid>
            </Grid>

            <Typography variant="body2" className={(classes.title, classes.gray)}>
              Email : {consumer.email}
            </Typography>

            <Typography variant="body2" className={(classes.title, classes.gray)}>
              Phone : {consumer.mobile}
            </Typography>
          </CardContent>

          <CardActions className={classes.cardAction}>
            <Grid container alignItems="center">
              <Grid item md={5} />
              <Grid item md={5} />
              <Grid item md={2}>
                <IconButton
                  aria-label="Delete"
                  className={classes.buttons}
                  onClick={this.props.deleteItem(consumer.id, index)}
                >
                  <DeleteForeverIcon color="action" />
                </IconButton>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </MuiThemeProvider>
    );
  }
}

ConsumerCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ConsumerCard);
