/**
 * 
 * ClientCard component.
 * 
 * This component is used to display the following content client name,location,client owner,email,phone,projects and surveys in the card.
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
import CardMedia from "@material-ui/core/CardMedia";
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
  media: {
    backgroundColor: "rgba(0,0,0,0.5)",
    backgroundBlendMode: "color"
  },
  linkText: {
    color: "#fff",
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

class ClientCard extends React.Component {
  render() {
    const { classes } = this.props;
    const { client } = this.props;
    const { index } = this.props;

    const defaultImg = "http://dummyimage";

    let clientImg =
      client.clientImage != null ? client.clientImage : defaultImg;

    return (
      <MuiThemeProvider theme={theme}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={clientImg ? clientImg : ""}
          >
            <CardContent style={{ padding: "16px 16px 0px 16px" }}>
              <Grid container>
                <Grid item xs={12}>
                  <img src={clientImg} height="50px" alt={client.id} />
                  <Typography variant="h5"
                    style={{
                      padding: "5px 0px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}>
                    <Tooltip
                      title={client.clientName}
                      placement={"bottom-start"}
                      enterDelay={300}
                      classes={{ tooltip: classes.tooltipText }}
                    >
                      <Link
                        to={"/home/view-client/" + client.id}
                        className={("link", classes.linkText)}
                      >
                        {client.clientName}
                      </Link>
                    </Tooltip>
                  </Typography>
                </Grid>
              </Grid>

              <Typography
                variant="body2"
                className={(classes.title, classes.gray)}
                style={{ padding: "5px 0px" }}
              >
                Country/Location: {client.country}, {client.location}
              </Typography>

              <Typography variant="body2" className={(classes.title, classes.gray)}>
                Client Owner: {client.clientOwner ? client.clientOwner.name : " "}
              </Typography>

              <Typography variant="body2" className={(classes.title, classes.gray)}>
                Email {client.clientOwner ? client.clientOwner.email : " "}
              </Typography>

              <Typography variant="body2" className={(classes.title, classes.gray)}>
                Phone {client.clientOwner ? client.clientOwner.mobile : " "}
              </Typography>

              <Tooltip
                title={client.tags ? client.tags : ""}
                placement={"bottom-start"}
                enterDelay={300}
                classes={{ tooltip: classes.tooltipText }}
              >

                <Typography
                  variant="body2"
                  className={(classes.pos, classes.gray)}
                  style={{
                    padding: "5px 0px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  Categories: {client.tags ? client.tags : ""}
                </Typography>
              </Tooltip>
            </CardContent>

            <CardActions className={classes.cardAction}>
              <Grid container alignItems="center">
                <Grid item md={5}>
                  <Typography variant="body2" className={(classes.title, classes.gray)}>
                    {client.questions} Projects
                  </Typography>
                </Grid>
                <Grid item md={5}>
                  <Typography variant="body2" className={(classes.title, classes.gray)}>
                    {client.responses} Surveys
                  </Typography>
                </Grid>
                <Grid item md={2}>
                  <IconButton
                    aria-label="Delete"
                    className={classes.buttons}
                    onClick={this.props.deleteItem(client.id, index, client.clientName)}
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

ClientCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ClientCard);
