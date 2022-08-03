/**
 * ConsumerList component.
 * 
 *  This component is used to manage the consumer list.
 * 
 */

import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';

/* MUI Components */
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import TablePagination from "@material-ui/core/TablePagination";

import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";

/* Icons. */
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";

/* Custom components. */
import GridItem from "components/Grid/GridItem.jsx";
import AgGridTable from "../../components/AgGridTable/AgGridTable";

import Snackbar from "components/Snackbar/Snackbar.jsx";


/* Bootstrap 1.0 */
import { Form } from "react-bootstrap";

/* API */
import api2 from "../../helpers/api2";

/* Handles the snackbar message notification. */
function showNotification(msg, color) {
  this.setState({
    message: msg,
    msgColor: color,

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
    marginBottom: "1%"
  },
  loadingDiv: {
    width: "100%",
    textAlign: "center"
  },
  root: {
    padding: 0
  },

  selectRoot: {
    marginLeft: "5px",
    marginRight: "5px"
  },
  select: {
    paddingLeft: 0,
    paddingRight: "25px",
  },
  actions: {
    marginLeft: 0,
  },

};

let loadedlistItems = [];
const defaultApiPage = 100;
const defaultApirecordId = 0;

class ConsumerList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      view: "list",
      search: "",
      consumers: [],
      filteredConsumers: [],
      response: false,
      message: "",
      columnDefs: [],
      listItems: [],
      open: false,
      event: [],
      redirect: null,

      // snackbar props
      msgColor: "info",
      br: false,
      page: 0,
      pagecount: 0,
      datapagecount: 0,
      rowsPerPage: 50,
      temp_filteredConsumers: [],
    };
  }

  componentDidMount() {
    this.getConsumerList(defaultApirecordId, defaultApiPage);
    // this.Tablehead()

  }

  /* Handles the api to fetch the consumer list. */
  getConsumerList(record, pagesize) {
    var self = this;

    api2
      .get("allconsumers")
      .then(response => {


        self.setState({
          consumers: response.data.list,
          filteredConsumers: response.data.list,
          pagecount: response.data.total,
          datapagecount: response.data.total,
          response: true
        }, () => {
          this.Tablehead()
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the api to fetch the consumer list based on pagesize. */
  getConsumerspage(record, pagesize) {
    var self = this;

    api2
      .get("allconsumers?record=" + record + "&pagesize=" + pagesize)
      .then(response => {


        self.setState({
          consumers: this.state.consumers.concat(response.data.list),
          filteredConsumers: this.state.filteredConsumers.concat(response.data.list),
          temp_filteredConsumers: response.data.list,
          pagecount: response.data.total,
          datapagecount: response.data.total,
          response: true
        }, () => {
          this.AnswerdataPage()
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the event to form the consumer data based on page size. */
  AnswerdataPage() {
    let answer = []

    this.state.temp_filteredConsumers.forEach((consumer, index) => {
      answer.push({
        consumerid: consumer.id,
        firstname: consumer.firstname,
        lastname: consumer.lastname,
        gender: consumer.gender && consumer.gender === '1' ? "Male" : consumer.gender === '2' ? "Female" : consumer.gender === '3' ? "Prefer not to answer" : consumer.gender,
        email: consumer.email,
        phone: consumer.mobile,
        fraudulent: consumer.fraudulent === 1 ? "Fraudulent" : null,
        country: consumer.countryName,
        state: consumer.stateName ? consumer.stateName : consumer.state ? consumer.state : '',
        city: consumer.cityName ? consumer.cityName : consumer.city ? consumer.city : '',
        zipcode: consumer.zipcode,
        address: consumer.address,
        DateOfBirth: consumer.DateOfBirth,
        age: consumer.age,
        education: consumer.education,
        consumerType: consumer.consumerType,
        personalPurchaseOption: consumer.personalPurchaseOption,
        sizeOfHouseHold: consumer.sizeOfHouseHold,
        presenceOfKids: consumer.presenceOfKids,
        job: consumer.job,
        id: consumer.id,
        updated_on: new Date(consumer.updated_on).toLocaleString(),
        created_on: new Date(consumer.created_on).toLocaleString(),
        index: index,
        xp_points: consumer.xp_points
      })
    })
    let listItems = []
    answer.forEach(answ => {
      listItems.push(this.Formatansw(answ))
    })
    let loadlistItems = loadedlistItems.concat(listItems);
    loadedlistItems = loadlistItems;
    // this.setState({
    //   listItems:listItems
    // })
    if (this.state.datapagecount > loadedlistItems.length && answer.length > 0) {
      let id = answer[answer.length - 1].id
      this.getConsumerspage(id, defaultApiPage)
    } else {
      this.setState({
        listItems: loadedlistItems,
        datapagecount: loadedlistItems.length
      }, () => { this.gridApi.resetRowHeights() })

    }
  }

  /* Handles the event to form the consumer data. */
  Answerdata() {
    let answer = []

    this.state.filteredConsumers.forEach((consumer, index) => {
      answer.push({
        consumerid: consumer.id,
        firstname: consumer.firstname,
        lastname: consumer.lastname,
        gender: consumer.gender && consumer.gender === '1' ? "Male" : consumer.gender === '2' ? "Female" : consumer.gender === '3' ? "Prefer not to answer" : consumer.gender,
        email: consumer.email,
        phone: consumer.mobile,
        fraudulent: consumer.fraudulent === 1 ? "Fraudulent" : null,
        country: consumer.countryName,
        state: consumer.stateName ? consumer.stateName : consumer.state ? consumer.state : '',
        city: consumer.cityName ? consumer.cityName : consumer.city ? consumer.city : '',
        zipcode: consumer.zipcode,
        address: consumer.address,
        DateOfBirth: consumer.DateOfBirth,
        age: consumer.age,
        education: consumer.education,
        consumerType: consumer.consumerType,
        personalPurchaseOption: consumer.personalPurchaseOption,
        sizeOfHouseHold: consumer.sizeOfHouseHold,
        presenceOfKids: consumer.presenceOfKids,
        job: consumer.job,
        id: consumer.id,
        updated_on: new Date(consumer.updated_on).toLocaleString(),
        created_on: new Date(consumer.created_on).toLocaleString(),
        index: index,
        xp_points: consumer.xp_points
      })
    })
    let listItems = []
    answer.forEach(answ => {
      listItems.push(this.Formatansw(answ))
    })
    loadedlistItems = listItems;
    this.setState({
      listItems: listItems
    })
    if (this.state.datapagecount > listItems.length && answer.length > 0) {
      let id = answer[answer.length - 1].id
      this.getConsumerspage(id, defaultApiPage)
    }
  }

  /* Handles the event to form the data. */
  Formatansw = answ => {
    let arr = {};
    this.state.columnDefs.forEach(ans => {
      arr[ans.field] = answ[ans.field]
      arr[ans.id] = answ[ans.id]
      arr[ans.index] = answ[ans.index]
    })
    return arr

  }

  /* Define the table header in the consumer table. */
  Tablehead() {
    let columnDefs =
      [
        {
          headerName: "Edit",
          field: "edit",
          cellRendererFramework: EditAction,
          width: 100,
          Height: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Delete",
          field: "delete",
          cellRendererFramework: DeleteAction,
          width: 100,
          Height: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Consumer ID",
          field: "consumerid",
          id: "id",
          width: 100,
          height: 100,
          index: "index",

        },
        {
          headerName: "First Name",
          field: "firstname",
          id: "id",
          width: 100,
          height: 100,
          index: "index",

        },
        {
          headerName: "Last Name",
          field: "lastname",
          width: 100,
          id: "id",
          index: "index",
          editable: true,
        },
        {
          headerName: "Gender",
          field: "gender",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Email",
          field: "email",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Phone",
          field: "phone",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Fraudulent",
          field: "fraudulent",
          width: 100,
          id: "id",
          index: "index",
          filterParams: {
            filterOptions: [
              "empty",
              {
                displayKey: "fraudulent",
                displayName: 'Fraudulent',
                test: function (filterValue, cellValue) {
                  return cellValue !== null && cellValue.indexOf('fraudulent') === 0;
                },
                hideFilterInput: true
              },
              {
                displayKey: "unfraudulent",
                displayName: 'Non Fraudulent',
                test: function (filterValue, cellValue) {
                  return cellValue == null
                },
                hideFilterInput: true
              }
            ],
            suppressAndOrCondition: true
          }
        },
        {
          headerName: "Country",
          field: "country",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "State",
          field: "state",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "City",
          field: "city",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "ZipCode",
          field: "zipcode",
          width: 100,
          id: "id",
          index: "index"

        },
        {
          headerName: "Address",
          field: "address",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Date Of Birth",
          field: "DateOfBirth",
          width: 100,
          id: "id",
          index: "index"

        },
        {
          headerName: "Age",
          field: "age",
          width: 100,
          id: "id",
          index: "index"
        },

        {
          headerName: "Consumer Type",
          field: "consumerType",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "XP Points",
          field: "xp_points",
          width: 100,
          id: "id",
          index: "index"
        },

        {
          headerName: "Job",
          field: "job",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Created On",
          field: "created_on",
          width: 100,
          id: "id",
          index: "index"
        },
        {
          headerName: "Last Accessed Time",
          field: "updated_on",
          width: 100,
          id: "id",
          index: "index"
        }
      ]
    this.setState({
      columnDefs: columnDefs,
    }, () => { this.Answerdata() });
  }


  /* Handles the event to update the table. */
  onGridReady = params => {

    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.resetRowHeights();

    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);


  }

  /* Handles the event to manage the cell click. */
  onCellClicked = (event) => {
    this.setState({
      event: event
    }, () => {
      if (event.colDef.field === "edit") {
        this.setState({ redirect: true });
      }
      else if (event.colDef.field === "delete") {
        this.setState({ open: true });
      }
    })

  }

  /* Handles the event to update the column. */
  updateColumns = event => {
    this.columnApi = event.columnApi;
    this.gridApi = event.api;
    this.gridApi.resetRowHeights();
  }

  /* Handles the open event of loading symbol. */
  openLoading = () => {
    this.setState({
      response: false,
    })
  }

  /* Handles the close event of loading symbol. */
  stopLoading = () => {
    this.setState({
      response: true,
    })
  }

  /* Handles the api to delete the consumer. */
  handleDelete = (id, index) => {
    this.openLoading();
    api2.delete("web_consumer?id=" + id).then(resp => {
      if (resp.status === 200) {
        // this.setState({
        //   consumers: this.state.consumers.filter((x, i) => i !== index),
        //   filteredConsumers: this.state.filteredConsumers.filter(
        //     (x, i) => i !== index
        //   )
        // });
        showNotification("Consumer Deleted Successfully", "success");
        loadedlistItems = [];
        this.setState({
          page: 0,
        }, () => { this.componentDidMount() })


      }
      else {
        this.stopLoading();
        showNotification("Error in Deleting Consumer", "danger");
      }

    })
      .catch(error => {
        this.stopLoading();
        showNotification("Error in Deleting Consumer" + error.message, "danger");
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

    // this.filterConsumer(value);
  };

  /* Handles the event to filter the data. */
  onFilterChangedGrid = (params) => {
    let isAnyFilterPresent = this.gridApi.isAnyFilterPresent();
    let currentpage = this.gridApi.paginationGetCurrentPage();
    let RowCount = this.gridApi.paginationGetRowCount()
    if (isAnyFilterPresent) {
      if (this.state.listItems.length < loadedlistItems.length) {
        this.gridApi.setRowData(loadedlistItems)
        this.setState({
          listItems: loadedlistItems,
          page: currentpage,
          pagecount: RowCount
        }, () => {
          // if(this.state.listItems.length < loadedlistItems.length){this.gridApi.resetRowHeights()  
          // this.gridApi.resetRowHeights()             
          this.gridApi.resetRowHeights()
        })
      }
      else {
        this.setState({
          page: currentpage,
          pagecount: RowCount
        })
      }
    } else {
      this.gridApi.paginationGoToPage(0)
      this.setState({
        page: 0,
        pagecount: this.state.datapagecount,
        // rowsPerPage: rowsPerPage,
      })
    }

  }

  /* Handles the navigation of page. */
  handleChangePage = (event, page) => {
    let listItems = this.state.listItems;
    if (listItems.length > 0) {
      if (this.state.listItems.length < this.state.datapagecount) {
        if (this.state.listItems.length < loadedlistItems.length) {
          this.gridApi.setRowData(loadedlistItems)
          this.setState({
            listItems: loadedlistItems,
            page: page,
          }, () => {
            this.gridApi.paginationGoToPage(page)
          })
        }
        else {
          this.gridApi.paginationGoToPage(page)
          this.setState({
            datapagecount: this.state.listItems.length,
            page: page,
          })
        }
      }
      else {
        this.gridApi.paginationGoToPage(page)
        this.setState({
          datapagecount: this.state.listItems.length,
          page: page,
        })
      }
    }
  };

  /* Manages the table based on the number of rows per page. */
  handleChangeRowsPerPage = event => {
    //let rowsPerPage = event.target.value;
    let rowsPerPage = event;
    if (rowsPerPage !== this.state.rowsPerPage) {
      this.gridApi.paginationSetPageSize(rowsPerPage)
      this.gridApi.paginationGoToPage(0)

      this.setState({
        page: 0,
        pagecount: this.state.datapagecount,
        rowsPerPage: rowsPerPage,
      })
    }
  };

  render() {
    if (this.state.redirect === true) {
      return <Redirect to={"/home/view-consumer/" + this.state.event.data.id} />;


    }


    const { msgColor, br, message, page, pagecount, rowsPerPage } = this.state;
    const { classes } = this.props;

    let body_class = this.props.fullWidth
      ? "body-full body-full-expanded"
      : "body-full body-full-collapsed";
    return (
      <div className={body_class}>
        <div className={classes.gridHeader}>
          <Grid
            container
            alignItems="center"
            id="gridHeader"
            style={{ padding: "0%", margin: "0 !important" }}
          >
            <GridItem xs={6} sm={4} md={2}>
              <Typography variant="h6">
                Consumers ({this.state.datapagecount})
              </Typography>
            </GridItem>

            <GridItem xs={6} sm={4} md={2}>
              <Form.Control
                type="text"
                name="search"
                value={this.state.search}
                onChange={this.handleInputChange}
                disabled={!(this.state.listItems && this.state.listItems.length > 0)}
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

            </GridItem>

            <GridItem xs={6} sm={4} md={2}>
              <Link to="/home/create-consumer">
                <Button
                  variant="contained"
                  color="primary" autoFocus
                  style={{
                    borderRadius: "30px",
                    fontSize: "0.8rem",
                    background: "#0069d9",
                    color: "#fff",

                  }}
                >
                  Create Consumer
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
            {this.state.consumers.length === 0 && this.state.response ? (
              <div className={classes.loadingDiv}>
                <Typography variant="h5">No Consumers!</Typography>
              </div>
            ) : (
              <Fragment>

                <div className="AGGrid"
                  style={{
                    height: "91%",
                    width: "100%",
                    marginRight: "15px"
                  }}>
                  <div style={{ height: "90%", width: "100%", }}>
                    <AgGridTable
                      columnDefs={this.state.columnDefs}
                      rowdata={this.state.listItems}
                      onCellClicked={this.onCellClicked}
                      quickFilterText={this.state.search}
                      onGridReady={this.onGridReady}
                      onFilterChanged={this.onFilterChangedGrid}
                      pagination={true}
                      suppressPaginationPanel={true}
                      paginationPageSize={rowsPerPage}
                    />
                  </div>
                  <div style={{ display: 'flex', float: 'right', }}>
                    <div style={{ alignSelf: "center" }}>
                      <b>
                        <label style={{ fontSize: 11, }}>Show Rows</label>
                        <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                        <label onClick={() => this.handleChangeRowsPerPage(50)} style={rowsPerPage === 50 ? { marginLeft: 5, fontSize: 11, borderBottom: '1.5px solid grey', cursor: 'pointer' } : { marginLeft: 5, fontSize: 11, cursor: 'pointer' }}>50</label>
                        <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                        <label onClick={() => this.handleChangeRowsPerPage(100)} style={rowsPerPage === 100 ? { marginLeft: 5, fontSize: 11, borderBottom: '1.5px solid grey', cursor: 'pointer' } : { marginLeft: 5, fontSize: 11, cursor: 'pointer' }}>100</label>
                        <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                        <label onClick={() => this.handleChangeRowsPerPage(500)} style={rowsPerPage === 500 ? { marginLeft: 5, fontSize: 11, borderBottom: '1.5px solid grey', cursor: 'pointer' } : { marginLeft: 5, fontSize: 11, cursor: 'pointer' }}>500</label>
                        <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                      </b>
                    </div>
                    <div>
                      <TablePagination
                        component="div"
                        style={{ padding: 0 }}
                        count={pagecount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        rowsPerPageOptions={[]}
                        backIconButtonProps={{
                          "aria-label": "Previous Page",
                          classes: {
                            root: classes.root,
                          }
                        }}
                        nextIconButtonProps={{
                          "aria-label": "Next Page",
                          classes: {
                            root: classes.root,
                          }
                        }}
                        onChangePage={this.handleChangePage}
                        //onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        classes={{

                          toolbar: classes.toolbar,
                          caption: classes.caption,
                          selectIcon: classes.selectIcon,
                          select: classes.select,
                          selectRoot: classes.selectRoot,
                          input: classes.input,
                          actions: classes.actions,
                        }}
                      />
                    </div>

                  </div>
                </div>

              </Fragment>
            )}
          </Fragment>
        )}
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {/* <DialogTitle id="alert-dialog-title">{this.props.displayName}</DialogTitle> */}
          <DialogContent
            style={{
              padding: "25px 40px 16px"
            }}
          >
            <DialogContentText id="alert-dialog-description"
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "initial"
              }}
            >
              Are you sure you want to delete ?
            </DialogContentText>
            <DialogActions
              style={{
                justifyContent: "center"
              }}>
              <Button onClick={() => {
                this.setState({ open: false })
                this.handleDelete(this.state.event.data.id, this.state.event.data.index)
              }} color="primary" autoFocus
                style={{
                  color: "#fff",
                  backgroundColor: "#074e9e",
                  margin: "10px 0 0px 10px",
                  padding: "5px 16px",
                  fontSize: "12px"
                }}>
                Yes
              </Button>
              <Button onClick={() => this.setState({ open: false })} color="primary"
                style={{
                  color: "#fff",
                  backgroundColor: "#074e9e",
                  margin: "10px 0 0px 10px",
                  padding: "5px 16px",
                  fontSize: "12px"
                }}>
                No
              </Button>
            </DialogActions>

          </DialogContent>
        </Dialog>

        <Snackbar
          place="br"
          color={msgColor}
          open={br}
          message={message}
          closeNotification={() => this.setState({ br: false })}
          close
        />

      </div>
    );
  }
}

export default withStyles(styles)(ConsumerList);

export class DeleteAction extends React.Component {
  render() {
    return (
      <IconButton
        aria-label="Delete"
      // onClick={DialogAction}
      >
        <DeleteForeverIcon color="action" />
      </IconButton>
    );
  }
}

export class EditAction extends React.Component {
  render() {
    return (
      <IconButton
        aria-label="Edit"
      // onClick={DialogAction}
      >
        <EditIcon color="action" />
      </IconButton>
    );
  }
}