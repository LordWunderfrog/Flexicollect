/**
 * 
 * UserList component.
 * 
 * This component is used to manage the user list.
 *
 *
 */

import React, { Fragment } from "react";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import AgGridTable from "../../components/AgGridTable/AgGridTable";

/* Custom components. */
import GridItem from "components/Grid/GridItem.jsx";

// Bootstrap 1.0. */
import { Form } from "react-bootstrap";

/* API */
import api2 from "../../helpers/api2";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#074e9e"
    },
    secondary: {
      main: "#ffffff"
    }
  }
});

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
  },
  tableToolbar: {
    width: "100%",
    marginLeft: "3%",
    zIndex: 2,
    marginTop: 5
  }
};

class UserList extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      view: "list",
      search: "",
      users: [],
      filteredUsers: [],
      response: false,
      message: "",
      selectedRole: null,
      roleOptions: [
        { value: "ADMIN", label: "Admin" },
        { value: "EMPLOYEE", label: "Employee" },
        { value: "CLIENT", label: "Client" }
      ],
      listItems: [],
      columnDefs: [],
      open: false,
      event: []
    };
  }

  componentDidMount() {
    this.getUserList();
    this.Tablehead()
  }

  /* Handles the api to fetch the user list. */
  getUserList() {
    var self = this;

    api2
      .get("v2/users")
      .then(resp => {
        let users = [];
        if (resp.data.user_list.length > 0) {
          resp.data.user_list.forEach(u => {
            let obj = {};
            obj.username = u.Username;
            obj.email = u.Attributes[0] && u.Attributes[0].Value ? u.Attributes[0].Value : '';
            obj.ustatus = u.UserStatus;
            obj.role = u.groups[0] && u.groups[0].GroupName ? u.groups[0].GroupName : '';
            users.push(obj);
          });
        }
        self.setState({
          users: users,
          filteredUsers: users,
          response: true,
          listItems: users
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the event to filter the user. */
  onFilterChanged = (params) => {
  }

  /* Handles the event to manage the cell click. */
  onCellClicked = event => {
  };

  /* Handles the event to update the table. */
  onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  }


  /* Handles the definition of table header in the user table. */
  Tablehead() {
    let columnDefs =
      [

        {
          headerName: "Username",
          field: "username",
          width: 100,
        },
        {
          headerName: "Email",
          field: "email",
          width: 100
        },
        {
          headerName: "Status",
          field: "ustatus",
          width: 100
        },
        {
          headerName: "Group",
          field: "role",
          width: 100,
          filter: "agTextColumnFilter",
          filterParams: {
            filterOptions: [
              "empty",
              {
                displayKey: "admin",
                displayName: 'Admin',
                test: function (filterValue, cellValue) {
                  return cellValue !== null && cellValue.indexOf('admin') === 0;
                },
                hideFilterInput: true
              },
              {
                displayKey: "employee",
                displayName: 'Employee',
                test: function (filterValue, cellValue) {
                  return cellValue !== null && cellValue.indexOf('employee') === 0;
                },
                hideFilterInput: true
              },
              {
                displayKey: "client",
                displayName: 'Client',
                test: function (filterValue, cellValue) {
                  return cellValue !== null && cellValue.indexOf('client') === 0;
                },
                hideFilterInput: true
              }
            ],
            suppressAndOrCondition: true
          }
        }
      ]
    this.setState({
      columnDefs: columnDefs,
    });
  }

  /* Handles the event to filter the user. */
  filterUser = userFilter => {
    let filteredUsers = this.state.users;
    filteredUsers = filteredUsers.filter(user => {
      let name = user.username.toLowerCase();
      let email = user.email.toLowerCase();
      let role = user.role.toLowerCase();

      let username = user.username.toLowerCase();

      return (
        name.indexOf(userFilter.toLowerCase()) !== -1 ||
        role.indexOf(userFilter.toLowerCase()) !== -1 ||
        username.indexOf(userFilter.toLowerCase()) !== -1 ||
        email.indexOf(userFilter.toLowerCase()) !== -1
      );
    });
    this.setState({
      filteredUsers
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

    //this.filterUser(value);
  };



  render() {

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
                Users ({this.state.users.length})
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

          </Grid>
        </div>

        {!this.state.response ? (
          <div className={classes.loadingDiv}>
            <CircularProgress className={classes.progress} color="primary" />
          </div>
        ) : (
          <Fragment>
            {this.state.users.length === 0 && this.state.response ? (
              <div className={classes.loadingDiv}>
                <Typography variant="h5">No Users!</Typography>
              </div>
            ) : (
              <Fragment>
                <MuiThemeProvider theme={theme}>



                  <div className="list-box"
                    style={{
                      height: "87%"
                    }}>
                    <div className="AGGrid"
                      style={{
                        height: "100%",
                        width: "100%",
                        marginRight: "15px"
                      }}>
                      <AgGridTable
                        columnDefs={this.state.columnDefs}
                        rowdata={this.state.listItems}
                        onCellClicked={this.onCellClicked}
                        quickFilterText={this.state.search}
                        onGridReady={this.onGridReady}
                        onFilterChanged={this.onFilterChanged}
                      />
                    </div>
                  </div>

                </MuiThemeProvider>
              </Fragment>
            )}
          </Fragment>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
