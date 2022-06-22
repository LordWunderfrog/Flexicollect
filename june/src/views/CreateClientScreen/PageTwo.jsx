/**
 * PageTwo component.
 * 
 * This component is used to manage the clients under create client screen.
 *
 */

import React, { Component } from "react";

/* Material UI. */
// import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
// import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
// import { makeStyles } from '@material-ui/core/styles';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';

/* Custom Components */
import GridItem from "components/Grid/GridItem.jsx";


import AgGridTable from "../../components/AgGridTable/AgGridTable";
/* Bootstrap 1.0 */
import { Form } from "react-bootstrap";
/* Api. */
import api2 from "../../helpers/api2";


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
  }
};


let temp = [];

/* Handles the event to update the row data in the table */



class PageTwo extends Component {

  constructor(props, context) {
    super(props, context);
    this.child = React.createRef();

    this.state = {
      mode: "create",
      age: "",
      city: "",
      consumers: [],
      filteredClients: [],
      cityFilter: [],
      checkedClients: [],
      missionConsumers: [],
      missionConsumersId: [],
      selectAll: false,
      columnDefs: [],
      listItems: [],
      search: null,
      temp: [],
      /* loading */
      loading: false,
      client_ids: []
    };
  }
  updateRowData(index, checked) {
    if (this.gridApi) {
      var rowNode = this.gridApi.getRowNode(index);
      var rows = [];
      rows.push(rowNode.data.select = checked);
      this.gridApi.updateRowData({ rowNodes: rows });
    }
  }

  componentDidMount() {
    this.getClientList();

  }

  /* Style for popup screen. */
  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }

  /* Handles the api to fetch the client list. */
  getClientList() {
    var self = this;
    api2
      .get("v2/client_users")
      .then(response => {
        const clients = [];
        let client_ids = this.props.oldclient_ids;
        for (const item of response.data.user_list) {
          let client = {};
          client.name = item.Username;
          client.email = item.Email;
          client.ustatus = item.UserStatus;
          client.role = item.Group;
          if (client_ids && client_ids.includes(client.email)) {
            client.checked = true;
            client.select = true;
          } else {
            client.checked = false;
            client.select = false;
          }
          clients.push(client)
        }

        self.setState({
          clients: response.data.user_list,
          filteredClients: clients,
          response: true,
          client_ids: client_ids,
          listItems: clients
        }, () => { this.Tablehead() });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }


  /* Handles the events to define column header and its definition. */
  Tablehead() {
    let columnDefs =
      [
        {
          headerName: "select",
          field: "select",
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
          autoHeight: true,

        },
        {
          headerName: "Email",
          field: "email",
          width: 100,
          autoHeight: true,

        },
        {
          headerName: "Status",
          field: "ustatus",
          width: 100,
          autoHeight: true,

        },

        {
          headerName: "Group",
          field: "role",
          width: 100,
          autoHeight: true,
        },



      ]
    this.setState({
      columnDefs: columnDefs,
    }, () => {
      //this.Answerdata()

    });
  }

  /* Handles the event of cell click. */
  onCellClicked = (event) => {
    this.setState({
      event: event
    })
  }

  /* Handles the grid api to update the table. */
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
    this.gridApi = params.api;

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

  /* Handles the events to update the selected client. */
  handleChecked = (email, checked) => {

    temp = this.state.filteredClients

    let index = '';

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].email === email) {
        index = i;
      }
    }

    temp[index].checked = checked

    let client_ids = this.state.client_ids
    if (!client_ids) {
      client_ids = [];
    }
    if (!checked && client_ids.includes(email)) {
      for (var i = 0; i < client_ids.length; i++) {
        if (client_ids[i] === email) {
          client_ids.splice(i, 1);
          break;
        }
      }

    }
    else if (checked) {
      client_ids.push(email)
    }

    this.setState({ client_ids: client_ids });
    this.props.UpdateClientIds(client_ids)
  }

  /* Unused function. */
  onFilterChanged = (params) => {
  }

  /* Handles the events to update the selected clientid. */
  updateCheckedConsumers() {
    let resp = [];
    temp.forEach(con => {
      if (con.checked) {
        resp.push(con.id);
      }
    });

    this.setState({ selectAll: this.state.clients.length === resp.length });
  }

  render() {
    return (
      <div className="gridContainer" style={{ height: "100%" }}>
        <div className="gridHeader" style={{ width: "100%", marginLeft: "3%", marginBottom: "1%" }}>
          <Grid container alignItems="center">
            <GridItem sm={1}>
              <div>Quickfilter</div>
            </GridItem>
            <GridItem sm={3}>
              <Form.Control
                style={{ marginBottom: "5px" }}
                id="search"
                onChange={this.handleInputChange}
                placeholder="Search"
              />
            </GridItem>

          </Grid>
        </div>

        <div className="ag-table"
          style={{
            width: "100%",
            padding: "0% 3% 0% 3%",
            height: "calc(100% - 50px)"
          }}
        >
          <AgGridTable ref={this.child}
            columnDefs={this.state.columnDefs}
            rowdata={this.state.listItems}
            quickFilterText={this.state.search}
            handleChecked={this.handleChecked}
            onGridReady={this.onGridReady}
            onCellClicked={this.onCellClicked}
            onFilterChanged={this.onFilterChanged}
          />
        </div>

      </div>
    );
  }
}

export default withStyles(styles)(PageTwo);

export class CheckboxSelection extends React.Component {
  handleAssigned(email, e) {
    this.props.agGridReact.props.handleChecked(email, e.target.checked);
  }
  render() {
    return (
      <Checkbox
        defaultChecked={this.props.data.select}
        onChange={(e) => this.handleAssigned(this.props.data.email, e)}
        color="primary"
      />
    );
  }
}
