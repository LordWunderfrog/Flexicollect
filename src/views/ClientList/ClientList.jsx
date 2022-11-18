/**
 * ClientList component.
 * 
 * This component is used to manage the client list.
 * 
 */

import React, { Fragment } from "react";
import { Link } from "react-router-dom";

/* MUI components. */
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";

/* Icons. */
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

/* Custom components. */
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import SortedTable from "components/SortedTable/SortedTable.jsx";
import ClientCard from "components/CustomCards/ClientCard";
import Card from "components/Card/Card.jsx";

/* Bootstrap 1.0. */
import { Button, Form } from "react-bootstrap";

/* Scrollbar. */
import PerfectScrollbar from "react-perfect-scrollbar";
import InfiniteScroll from 'react-infinite-scroll-component';

/* API. */
import api2 from "../../helpers/api2";

/* CSS. */
import "./ClientList.css";

import AlertDialog from "components/AlertDialog/AlertDialog";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  gridHeader: {
    width: "100%",
    marginLeft: "3%",
    marginBottom: "1%"
  },
  loadingDiv: {
    width: "100%",
    textAlign: "center"
  }
};

const pageSize = 50
class ClientList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      view: "grid",
      search: "",
      clients: [],
      filteredClients: [],
      response: false,
      message: "",
      dialogOpen: false,
      deleteClientName: "",
      deleteClientId: "",
      deleteClientIndex: "",
      hasMoreClientData: true
    };
  }

  componentDidMount() {
    this.getClientList();
  }

  /* Handles the api to fetch the client list. */
  getClientList() {
    var self = this;

    api2
      .get("client")
      .then(response => {
        self.setState({
          clients: response.data,
          filteredClients: response.data.slice(0, pageSize),
          hasMoreClientData: response.data && response.data.length >= pageSize ? true : false,
          response: true
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the event when the user deletes an item. */
  deleteItem = (id, index, name) => event => {
    event.preventDefault();
    this.setState({
      dialogOpen: true,
      deleteClientId: id,
      deleteClientIndex: index,
      deleteClientName: name
    });
  };

  /* Handles the api to close the event of popup. */
  handleDialogClose = deleteProject => event => {
    if (deleteProject) {
      api2.delete("client?id=" + this.state.deleteClientId).then(resp => {
        this.setState({
          clients: this.state.clients.filter(
            (x, i) => i !== this.state.deleteClientIndex
          ),
          filteredClients: this.state.filteredClients.filter(
            (x, i) => i !== this.state.deleteClientIndex
          )
        });
      });
    }
    this.setState({ dialogOpen: false });
  };

  /* Handles the event to update the view. */
  switchView(view) {
    if (view === "grid") {
      this.setState({
        view: "grid"
      });
    } else if (view === "list") {
      this.setState({
        view: "list"
      });
    }
  }

  /* Handles the event to filter the client. */
  filterClient = clientFilter => {
    let filteredClients = this.state.clients;
    filteredClients = filteredClients.filter(client => {
      let name = client.clientName.toLowerCase();
      let tags = client.tags.toLowerCase();
      return (
        name.indexOf(clientFilter.toLowerCase()) !== -1 ||
        tags.indexOf(clientFilter.toLowerCase()) !== -1
      );
    });
    this.setState({
      filteredClients
    });
  };

  /* Handles the event when the input value changes. */
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    this.filterClient(value);
  };

  /** pagination of data */
  fetchMoreClientData = () => {
    if (this.state.filteredClients.length == this.state.clients.length) {
      this.setState({ hasMoreClientData: false });
      return;
    }
    setTimeout(() => {
      let start = this.state.filteredClients.length
      let end = this.state.filteredClients.length + pageSize
      let spliceArray = this.state.clients.slice(start, end)
      let concatedArray = this.state.filteredClients.concat(spliceArray)
      this.setState({
        filteredClients: concatedArray
      });
    }, 500);
  };

  render() {
    const { classes } = this.props;
    function Actions(props) {
      return (
        <CardActions>
          <IconButton
            onClick={props.deleteItem(props.id, props.index, props.name)}
            aria-label="Delete"
            className={classes.buttons}
          >
            <DeleteForeverIcon color="action" />
          </IconButton>
        </CardActions>
      );
    }
    const listItems = this.state.filteredClients.map((client, index) => [
      client.clientName,
      client.country,
      client.location,
      client.clientOwner.name,
      client.clientOwner.email,
      client.clientOwner.mobile,
      client.tags,
      <Actions id={client.id} index={index} name={client.clientName} deleteItem={this.deleteItem} />
    ]);

    const listIds = this.state.filteredClients.map(client => [client.id]);

    let body_class = this.props.fullWidth
      ? "body-full-expanded"
      : "body-full-collapsed";
    return (
      <div style={{ height: "90%" }} className={body_class}>
        <div className={classes.gridHeader}>
          <Grid
            container
            alignItems="center"
            id="gridHeader"
            style={{ padding: "0%", margin: "0 !important" }}
          >
            <GridItem xs={6} sm={4} md={2}>
              <Typography variant="h6">
                Clients ({this.state.clients.length})
              </Typography>
            </GridItem>

            <GridItem xs={6} sm={4} md={2}>
              <Form.Control
                type="text"
                name="search"
                value={this.state.search}
                onChange={this.handleInputChange}
                style={{ height: 33, borderRadius: "2rem" }}
                placeholder="Search"
              />
            </GridItem>

            <GridItem id="filler" xs={4} sm={4} md={4} />

            <GridItem
              gridCss={{ padding: "0px !important" }}
              xs={6}
              sm={4}
              md={2}
            >
              <Button
                onClick={() => this.switchView("grid")}
                variant={this.state.view === "grid" ? "light" : ""}
                className={"view-switch-button"}
              >
                <i className="fa fa-th" aria-hidden="true" />
              </Button>
              <Button
                onClick={() => this.switchView("list")}
                variant={this.state.view === "list" ? "light" : ""}
                className={"view-switch-button"}
              >
                <i className="fa fa-list" aria-hidden="true" />
              </Button>
            </GridItem>

            <GridItem xs={6} sm={4} md={2}>
              <Link to="/home/create-client">
                <Button
                  variant="primary"
                  style={{
                    borderRadius: "30px",
                    fontSize: "0.8rem",
                    background: "#0069d9"
                  }}
                >
                  Create Client
                </Button>
              </Link>
            </GridItem>
          </Grid>
        </div>

        {!this.state.response ? (
          <div className={classes.loadingDiv}>
            <CircularProgress className={classes.progress} color="primary" />
          </div>
        ) : (
          <Fragment>
            {this.state.clients.length === 0 && this.state.response ? (
              <div className={classes.loadingDiv}>
                <Typography variant="h5">No Clients!</Typography>
              </div>
            ) : (
              <Fragment>
                {this.state.view === "grid" ? (
                  // <PerfectScrollbar>
                  <div id="scrollableDiv" style={{ height: "calc(100vh - 80px)", overflow: "auto" }}>
                    <InfiniteScroll
                      dataLength={this.state.filteredClients.length}
                      next={this.fetchMoreClientData}
                      hasMore={this.state.hasMoreClientData}
                      // height={800}
                      loader={
                        <h5 className="pt-4 text-center">Loading...</h5>
                      }
                      endMessage={<div></div>}
                      scrollableTarget="scrollableDiv"
                    >
                      <div className="list-box float-none">
                        <Grid container spacing={8}>
                          {this.state.filteredClients.map((client, i) => (
                            <Grid
                              item
                              md={4}
                              key={i}
                              style={{
                                width: this.props.isMobile ? "100%" : "auto",
                                marginLeft: this.props.isMobile ? "-1%" : "0"
                              }}
                            >
                              <ClientCard
                                key={client.clientName}
                                client={client}
                                index={i}
                                deleteItem={this.deleteItem}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    </InfiniteScroll>
                  </div>
                  //</PerfectScrollbar>
                ) : (
                  <PerfectScrollbar>
                    <div className="list-box">
                      <GridContainer>
                        <GridItem xs={12} sm={12} md={12}>
                          <Card>
                            <SortedTable
                              linkTo="/home/view-client/"
                              listIds={listIds}
                              tableHead={[
                                "Name",
                                "Country",
                                "Location",
                                "Owner",
                                "Email",
                                "Phone",
                                "Categories",
                                "Actions"
                              ]}
                              tableData={listItems}
                            />
                          </Card>
                        </GridItem>
                      </GridContainer>
                    </div>
                  </PerfectScrollbar>
                )}
              </Fragment>
            )}
          </Fragment>
        )}

        <AlertDialog
          title={"Delete " + this.state.deleteClientName}
          description="Are you sure you want to delete this client? Once deleted it cannot be retrieved"
          open={this.state.dialogOpen}
          handleDialogClose={this.handleDialogClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(ClientList);
