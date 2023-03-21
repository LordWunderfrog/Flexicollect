/**
 * ProjectPageThree component
 * 
 * This component is used to manage the consumers.
 *
 */

import React, { Component } from "react";


// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
// import { makeStyles } from '@material-ui/core/styles';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import TablePagination from "@material-ui/core/TablePagination";

/* Custom Components */
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import AgGridTable from "../../components/AgGridTable/AgGridTable";

/* bootstrat 1.0 */
import { Form } from "react-bootstrap";

/* api */
import api2 from "../../helpers/api2";

import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as Constants from "../../helpers/constants";

import Select from "react-select";
import PerfectScrollbar from "react-perfect-scrollbar";

/* css */
import "./CreateProject.css";


const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#304ffe"
    },
    secondary: {
      main: "#074e9e"
    }
  }
});



const styles = {
  paper: {
    position: "absolute",
    minWidth: theme.spacing.unit * 50,
    maxWidth: "65%",
    overflowX: "auto",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
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


let consumerCheck = [];
let temp = [];
let loadedlistItems = [];
const defaultApiPage = 100;
const defaultApirecordId = 0;


class ProjectPageThree extends Component {

  constructor(props, context) {
    super(props, context);
    this.child = React.createRef();

    this.state = {
      mode: "create",
      age: "",
      city: "",
      consumers: [],
      filteredConsumers: [],
      cityFilter: [],
      checkedConsumers: [],
      missionConsumers: [],
      missionConsumersId: [],
      selectAll: false,
      columnDefs: [],
      listItems: [],
      search: null,
      temp: [],
      missionConsumersArray: [],
      page: 0,
      loadpage: [0],
      pagecount: 0,
      datapagecount: 0,
      rowsPerPage: 50,
      filteredConsumerspage: [],
      temp_filteredConsumers: [],
      /* loading */
      loading: false,
      grid: false,
      openModal: false,
      platformType: "",
      consumerType: null
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.getMissionConsumers(this.props.missionId);
    this.platformType();

  }

  /* Handles the updation of platform type. */
  platformType() {

    api2
      .get("survey?id=" + this.props.mainSurveyId)
      .then(resp => {
        this.setState({
          platformType: resp.data.platform_type
        });
      })
      .catch(error => {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });

  }


  /* Handles the open event of popup. */
  weblinkClicked = () => {

    this.setState({
      openModal: true
    });
  };

  /* Handles the close event of popup. */
  handleCloseModal = () => {
    this.setState({ openModal: false });

  };

  /* Styles for popup */
  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  /* Handles the api to update the consumer details. */
  getMissionConsumers(missionId) {
    api2
      .get("consumer1?missionid=" + missionId)
      .then(resp => {
        const array = resp.data;
        const missionConsumers = [];
        const missionConsumersId = [];
        for (const item of array) {
          missionConsumersId.push(item.id);
        }
        this.props.handleInput("consumer_ids", missionConsumersId);

        this.setState({
          missionConsumers: missionConsumers,
          missionConsumersId: missionConsumersId,
          missionConsumersArray: array
        });
        this.getConsumers(array, defaultApirecordId, defaultApiPage);
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the api to fetch the consumer list. */
  getConsumers(missionConsumers, record, pagesize, page, changerow) {
    api2
      .get("allconsumers")
      .then(resp => {
        const array = resp.data.list;

        const result = [{ name: "City" }];
        let consumers = this.state.consumers;
        if (changerow !== undefined && changerow !== null && changerow === 'changerow') {
          consumers = []
        }
        const map = new Map();

        for (const item of array) {
          let consumer = item;
          if (this.state.missionConsumersId.includes(consumer.id)) {
            consumer.checked = true;
          } else {
            consumer.checked = false;
          }
          consumer.index = consumers.length;
          consumer.name = consumer.firstname + " " + consumer.lastname;
          consumer.fraudulentState = consumer.fraudulent === 1 ? "Fraudulent" : "";
          if (missionConsumers && missionConsumers.length > 0) {
            for (let i = 0; i < missionConsumers.length; i++) {
              if (missionConsumers[i].id === consumer.id) {
                consumer.submissions = missionConsumers[i].submissions;
                consumer.assigned_on = missionConsumers[i].assignedOn ? missionConsumers[i].assignedOn : "";
                break
              }
            }
          }

          consumers.push(consumer);
          if (!map.has(item.cityName) && item.cityName) {
            map.set(item.cityName, true); // set any value to Map
            result.push({
              name: item.cityName
            });
          }
          if (!item.cityName && !map.has(item.city) && item.city) {
            map.set(item.city, true); // set any value to Map
            result.push({
              name: item.city
            });
          }
        }


        this.setState({
          consumers: consumers,
          filteredConsumers: consumers,
          cityFilter: result,
          pagecount: resp.data.total,
          datapagecount: resp.data.total,
          loading: false
        }, () => {
          consumerCheck = consumers
          this.Tablehead(page)



        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  /* Handles the api to fetch the consumer list based on the pagesize. */
  getConsumerspage(missionConsumers, record, pagesize) {
    api2
      .get("allconsumers?record=" + record + "&pagesize=" + pagesize)
      .then(resp => {
        const array = resp.data.list;

        const result = [{ name: "City" }];
        let consumers = [];
        const map = new Map();

        for (const item of array) {
          let consumer = item;
          if (this.state.missionConsumersId.includes(consumer.id)) {
            consumer.checked = true;
          } else {
            consumer.checked = false;
          }
          consumer.index = this.state.consumers.length + consumers.length;
          consumer.name = consumer.firstname + " " + consumer.lastname;
          consumer.fraudulentState = consumer.fraudulent === 1 ? "Fraudulent" : "";
          if (missionConsumers && missionConsumers.length > 0) {
            for (let i = 0; i < missionConsumers.length; i++) {
              if (missionConsumers[i].id === consumer.id) {
                consumer.submissions = missionConsumers[i].submissions;
                consumer.assigned_on = missionConsumers[i].assignedOn ? missionConsumers[i].assignedOn : "";
                break
              }
            }
          }

          consumers.push(consumer);
          if (!map.has(item.cityName) && item.cityName) {
            map.set(item.cityName, true); // set any value to Map
            result.push({
              name: item.cityName
            });
          }
          if (!item.cityName && !map.has(item.city) && item.city) {
            map.set(item.city, true); // set any value to Map
            result.push({
              name: item.city
            });
          }
        }


        this.setState({
          consumers: this.state.consumers.concat(consumers),
          temp_filteredConsumers: consumers,
          filteredConsumers: this.state.filteredConsumers.concat(consumers),
          cityFilter: result,
          pagecount: resp.data.total,
          datapagecount: resp.data.total,
        }, () => {
          consumerCheck = this.state.consumers.concat(consumers)
          this.Answerdatapage()



        });
      })
      .catch(error => {
        console.error(error);
      });
  }



  /* Handles the api to update the selected consumers. */
  updateRowData = (index, checked) => {

    var rowNode = this.gridApi.getRowNode(index);
    var rows = [];
    rows.push(rowNode.data.select = checked);
    this.gridApi.updateRowData({ rowNodes: rows });
  }

  /* Define the table header in the consumer table. */
  Tablehead(page) {
    let columnDefs =
      [
        {
          headerName: "select",
          field: "select",
          id: "id",
          index: "index",
          width: 100,
          autoHeight: true,
          cellRendererFramework: CheckboxSelection,
          cellRendererParams: { platformType: this.state.platformType },
          sort: "desc",
          // sortable: false,
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: [
              "empty",
              {
                displayKey: "assigned",
                displayName: 'Assigned',
                test: function (filterValue, cellValue) {
                  return cellValue !== null && cellValue.indexOf('true') === 0;
                },
                hideFilterInput: true
              },
              {
                displayKey: "unassigned",
                displayName: 'UnAssigned',
                test: function (filterValue, cellValue) {
                  return cellValue !== null && cellValue.indexOf('false') === 0;
                },
                hideFilterInput: true
              }
            ],
            suppressAndOrCondition: true
          }

        },
        {
          headerName: "Name",
          field: "name",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,

        },
        {
          headerName: "Gender",
          field: "gender",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Email",
          field: "email",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Phone",
          field: "mobile",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Fraudulent",
          field: "fraudulent",
          width: 100,
          id: "id",
          index: "index",
          filter: "agTextColumnFilter",
          autoHeight: true,
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
          field: "countryName",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "City",
          field: "city",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Age",
          field: "age",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Consumer Type",
          field: "consumerType",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "XP Points",
          field: "xp_points",
          width: 100,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Assigned On",
          field: "assigned_on",
          width: 150,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Number of Submissions",
          field: "submissions",
          width: 150,
          id: "id",
          index: "index",
          autoHeight: true,
        },
        {
          headerName: "Last Accessed Time",
          field: "updated_on",
          width: 150,
          id: "id",
          index: "index",
          autoHeight: true,
        }
      ]
    this.setState({
      columnDefs: columnDefs,
    }, () => {
      this.Answerdata(page)

    });
  }


  /* Handles the updation of consumer table. */
  Answerdata(page) {
    let answer = [];


    this.state.filteredConsumers.forEach(consumer => {

      answer.push({
        name: consumer.name,
        gender: consumer.gender && consumer.gender === '1' ? "Male" : consumer.gender === '2' ? "Female" : consumer.gender === '3' ? "Prefer not to answer" : consumer.gender,
        email: consumer.email,
        mobile: consumer.mobile,
        fraudulent: consumer.fraudulent === 1 ? "Fraudulent" : null,
        countryName: consumer.countryName,
        city: consumer.cityName ? consumer.cityName : consumer.city ? consumer.city : '',
        age: consumer.age,
        consumerType: consumer.consumerType,
        select: consumer.checked,
        id: consumer.id,
        index: consumer.index,
        updated_on: new Date(consumer.updated_on).toLocaleString(),
        assigned_on: consumer.assigned_on && consumer.assigned_on !== "" ? new Date(consumer.assigned_on).toLocaleString() : "",
        submissions: consumer.submissions,
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
      this.getConsumerspage(this.state.missionConsumersArray, id, defaultApiPage)
    }
  }

  /* Handles the updation of consumer table based on the pagesize. */

  Answerdatapage(pge) {
    let answer = [];
    this.state.temp_filteredConsumers.forEach(consumer => {
      answer.push({
        name: consumer.name,
        gender: consumer.gender && consumer.gender === '1' ? "Male" : consumer.gender === '2' ? "Female" : consumer.gender === '3' ? "Prefer not to answer" : consumer.gender,
        email: consumer.email,
        mobile: consumer.mobile,
        fraudulent: consumer.fraudulent === 1 ? "Fraudulent" : null,
        countryName: consumer.countryName,
        city: consumer.cityName ? consumer.cityName : consumer.city ? consumer.city : '',
        age: consumer.age,
        consumerType: consumer.consumerType,
        select: consumer.checked,
        id: consumer.id,
        index: consumer.index,
        updated_on: new Date(consumer.updated_on).toLocaleString(),
        assigned_on: consumer.assigned_on && consumer.assigned_on !== "" ? new Date(consumer.assigned_on).toLocaleString() : "",
        submissions: consumer.submissions,
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
    //   listItems: listItems
    // })

    if (this.state.datapagecount > loadedlistItems.length && answer.length > 0) {
      let id = answer[answer.length - 1].id
      this.getConsumerspage(this.state.missionConsumersArray, id, defaultApiPage)
    } else {
      this.setState({
        listItems: loadedlistItems,
        datapagecount: loadedlistItems.length
      }, () => { if (this.api) { this.api.resetRowHeights() } })

    }
  }


  /* Manages and format the column data */
  Formatansw = (answ) => {

    let arr = {};
    this.state.columnDefs.forEach(ans => {
      arr[ans.field] = answ[ans.field]
      arr[ans.id] = answ[ans.id]
      arr[ans.index] = answ[ans.index]
    })
    return arr

  }

  /* Handles the event to manage the cell click. */
  onCellClicked = (event) => {
    this.setState({
      event: event
    })
  }

  /* Handles the event to update the table. */
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;
    this.api = params.api;

  }

  /* Handles the event when the input value changes. */
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = "search";
    this.setState({
      [name]: value
    });
  };


  /* Handles the event to manage the selection of checkbox. */
  handleChecked = (index, checked) => {
    temp = consumerCheck
    temp[index].checked = checked
    if (temp[index].checked === true) {
      if (!this.state.missionConsumersId.includes(temp[index].id)) {
        this.state.missionConsumersId.push(temp[index].id)
      }
    }
    else {

      let arr = this.state.missionConsumersId.filter(function (item) {
        return item !== temp[index].id
      })
      //this.setState({ missionConsumersId: arr })
      this.state.missionConsumersId = arr
      this.setState({})
    }
    this.props.handleInput("consumer_ids", this.state.missionConsumersId);
  }

  /* Handles the event to copy the selection of data. */
  copyToClipboardText = e => {
    this.textArea.select();
    document.execCommand("copy");
  };

  /* Handles the event to filter the data. */
  onFilterChangedGrid = (params) => {
    let isAnyFilterPresent = this.api.isAnyFilterPresent();
    let currentpage = this.api.paginationGetCurrentPage();
    let RowCount = this.api.paginationGetRowCount()
    if (isAnyFilterPresent) {
      if (this.state.listItems.length < loadedlistItems.length) {
        this.api.setRowData(loadedlistItems)
        this.setState({
          listItems: loadedlistItems,
          page: currentpage,
          pagecount: RowCount
        }, () => {
          // if(this.state.listItems.length < loadedlistItems.length){this.api.resetRowHeights()  
          // this.api.resetRowHeights()             
          this.api.resetRowHeights()
        })
      }
      else {
        this.setState({
          page: currentpage,
          pagecount: RowCount
        })
      }
    } else {
      this.api.paginationGoToPage(0)
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
          this.api.setRowData(loadedlistItems)
          this.state.loadpage.push(page)
          // this.api.resetRowHeights()    
          this.setState({
            listItems: loadedlistItems,
            page: page,
          }, () => {
            // if(this.state.listItems.length < loadedlistItems.length){this.api.resetRowHeights()  
            // this.api.resetRowHeights()      
            this.api.paginationGoToPage(page)
            // this.api.resetRowHeights()
          })
        }
        else {
          this.api.paginationGoToPage(page)
          this.setState({
            datapagecount: this.state.listItems.length,
            page: page,
          })
        }
      }
      else {
        this.api.paginationGoToPage(page)
        this.setState({
          datapagecount: this.state.listItems.length,
          page: page,
        })
      }
    }
  };

  /* Manages the table based on the number of rows per page. */
  handleChangeRowsPerPage = event => {
    // let rowsPerPage = event.target.value;
    let rowsPerPage = event;
    if (rowsPerPage !== this.state.rowsPerPage) {
      this.api.paginationSetPageSize(rowsPerPage)
      this.api.paginationGoToPage(0)

      this.setState({
        page: 0,
        pagecount: this.state.datapagecount,
        rowsPerPage: rowsPerPage,
      })
    }
  };

  handleConsumerChange = (e) => {
    if (e.value === "all") {
      this.setState({ consumerType: null });
    }
    else {
      let consumerType = [];
      consumerType = this.state.listItems.filter(f => f.consumerType === e.value);
      this.setState({ consumerType: consumerType });
    }
  }

  render() {
    const { classes } = this.props;
    const { page, pagecount, rowsPerPage } = this.state;
    let missionName = encodeURIComponent(this.props.missionName);
    let uri_link = Constants.SURVEYLINK_URI + '?mission=' + this.props.missionId + "&name=" + missionName;

    if (this.state.platformType === "App Only") {
      uri_link = Constants.DYNAMIC_LINK_URI + encodeURIComponent(Constants.APPLINK_URI + this.props.missionId + "&name=" + this.props.missionName) + Constants.APPLINK_URI_SUFFIX;
    }
    if (this.state.platformType === "Browser Only") {
      uri_link = Constants.WEBLINK_URI + '?mission=' + this.props.missionId + "&name=" + missionName;
    }

    return (

      <div className="gridContainer" style={{ textAlign: (this.state.platformType === "Browser Only") ? "center" : "left" }}>
        {this.state.platformType !== "" && this.state.platformType !== "Browser Only" &&
          <GridContainer>

            <GridItem sm={1.1}>
              <div>Quickfilter</div>
            </GridItem>

            <GridItem sm={3}>
              <Form.Control
                style={{ marginBottom: "5px" }}
                id="search"
                onChange={this.handleInputChange}
                // value={this.state.search}
                disabled={!(this.state.listItems && this.state.listItems.length > 0)}
                placeholder="Search"
              />
            </GridItem>


            <GridItem sm={2.5}>
              <Button
                style={{
                  backgroundColor: "#074e9e",
                  textTransform: "initial",
                  color: "#fff",
                  padding: "5px 16px",
                  fontSize: "12px"
                }}
                variant="contained"
                onClick={this.weblinkClicked}
              >
                Create Web Link
              </Button>
            </GridItem>
            {this.state.loading === false ?
              <GridItem sm={3}>
                <Select
                  as="select"
                  name="country"
                  // value={this.getSelectedCountry(values.country)}
                  options={[{ value: 'consumer', label: 'consumer' },
                  { value: 'business', label: 'business' },
                  { value: 'all', label: 'all' }]}
                  onChange={e => this.handleConsumerChange(e)}
                />
              </GridItem> : ""}
          </GridContainer>
        }
        {this.state.platformType !== "" && this.state.platformType === "Browser Only" &&
          <Button
            style={{
              backgroundColor: "#074e9e",
              textTransform: "initial",
              color: "#fff",
              padding: "5px 16px",
              fontSize: "12px"
            }}
            variant="contained"
            onClick={this.weblinkClicked}
          >
            Create Web Link
          </Button>

        }

        <div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openModal}
            onClose={this.handleCloseModal}
          >
            <PerfectScrollbar>
              <div style={this.getModalStyle()} className={classes.paper}>
                <Typography variant="h6" id="modal-title ">
                  <div style={{ textAlign: "center" }}>
                    <p>Web Link</p>
                    <textarea
                      className="weblinktext"
                      rows="6"
                      style={{
                        border: "none",
                        height: "auto",
                        width: "100%",
                        marginTop: "10px",
                        textAlign: "center",
                        resize: "none"
                      }}
                      ref={textarea => (this.textArea = textarea)}
                      value={uri_link}
                    />
                  </div>

                  <div
                    className="model-footer"
                    style={{
                      paddingTop: "5px",
                      textAlign: "center"
                    }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        color: "#fff",
                        backgroundColor: "#074e9e",
                        margin: "10px 0 0px 10px",
                        padding: "5px 16px",
                        fontSize: "12px"
                      }}
                      onClick={this.copyToClipboardText}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        color: "#fff",
                        backgroundColor: "#074e9e",
                        margin: "10px 0 0px 10px",
                        padding: "5px 16px",
                        fontSize: "12px"
                      }}
                      onClick={this.handleCloseModal}
                    >
                      Close
                    </Button>
                  </div>
                </Typography>
              </div>
            </PerfectScrollbar>




          </Modal>
        </div>
        {this.state.platformType !== "" && this.state.platformType !== "Browser Only" &&
          <div>
            <div className="AgGrid"
              style={{
                marginTop: "1px",
                height: "56vh"
              }}
            >
              <AgGridTable ref={this.child}
                columnDefs={this.state.columnDefs}
                rowdata={this.state.consumerType === null ? this.state.listItems : this.state.consumerType}
                quickFilterText={this.state.search}
                // rowdata={this.state.listItems}
                handleChecked={this.handleChecked}
                updateRowData={this.updateRowData}
                onGridReady={this.onGridReady}
                paginationPageSize={rowsPerPage}
                pagination={true}
                onFilterChanged={this.onFilterChangedGrid}
                suppressPaginationPanel={true}
              />
            </div>
            <div style={{ display: 'flex', float: 'right', }}>
              <div style={{ alignSelf: "center" }}>
                <b>
                  <label style={{ fontSize: 11, }}>Show Rows</label>
                  <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                  <label onClick={() => this.handleChangeRowsPerPage(50)} style={{ pointerEvents: this.state.listItems && this.state.listItems.length > 0 ? 'all' : 'none', marginLeft: 5, fontSize: 11, borderBottom: rowsPerPage === 50 ? '1.5px solid grey' : 'none', cursor: 'pointer' }}>50</label>
                  <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                  <label onClick={() => this.handleChangeRowsPerPage(100)} style={{ pointerEvents: this.state.listItems && this.state.listItems.length > 0 ? 'all' : 'none', marginLeft: 5, fontSize: 11, borderBottom: rowsPerPage === 100 ? '1.5px solid grey' : "none", cursor: 'pointer' }}>100</label>
                  <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                  <label onClick={() => this.handleChangeRowsPerPage(500)} style={{ pointerEvents: this.state.listItems && this.state.listItems.length > 0 ? 'all' : 'none', marginLeft: 5, fontSize: 11, borderBottom: rowsPerPage === 500 ? '1.5px solid grey' : 'none', cursor: 'pointer' }}>500</label>
                  <label style={{ marginLeft: 5, fontSize: 11 }}>|</label>
                </b>
              </div>
              <div>
                <TablePagination
                  component="div"
                  style={{ pointerEvents: this.state.listItems && this.state.listItems.length > 0 ? 'all' : 'none', padding: 0 }}
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
        }
      </div>
    );
  }
}

export default withStyles(styles)(ProjectPageThree);

export class CheckboxSelection extends React.Component {
  handleAssigned(index, e) {
    // this.props.data.select = e.target.checked ? "Assigned" : "UnAssigned"
    this.props.agGridReact.props.handleChecked(index, e.target.checked);
    this.props.agGridReact.props.updateRowData(index, e.target.checked);

  }
  render() {
    return (
      <Checkbox
        defaultChecked={this.props.data.select}
        onChange={(e) => this.handleAssigned(this.props.data.index, e)}
        disabled={this.props.platformType === "Browser Only" ? true : false}
        color="primary"
      />
    );
  }
}