import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import CardBody from "components/Card/CardBody.jsx";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

class SortedTableHead extends React.Component {
  constructor(props) {
    super(props);
    this.rows = this.props.tableHead;
  }

  componentWillReceiveProps(nextProps) {
    this.rows = nextProps.tableHead;
  }

  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead>
        <TableRow style={{ background: "#074e9e" }}>
          {this.rows.map((row, key) => {
            return (
              <TableCell
                style={{
                  color: "#fff",
                  fontSize: "1.2rem",
                  textOverflow: "ellipsis",
                  overflow: "hidden"
                }}
                key={key}
                padding={"default"}
                sortDirection={orderBy === key ? order : false}
              >
                <Tooltip
                  title={row ? row : " "}
                  placement={"bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === key}
                    direction={order}
                    onClick={this.createSortHandler(key)}
                  >
                    {row.split(" ", 2).map(x => {
                      return x + " ";
                    })}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

SortedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.number.isRequired,
  tableHead: PropTypes.arrayOf(PropTypes.string)
};

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto",
    borderRadius: "6px"
  },
  tooltipText: {
    fontSize: "0.8rem"
  },
  tablecellText: {
    maxWidth: "100px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  },
  linkText: {
    color: "#000",
    textOverflow: "ellipsis",
    display: "block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "150px"
  }
});

class SortedTable extends React.Component {
  state = {
    order: "asc",
    orderBy: 0,
    data: this.props.tableData,
    page: 0,
    rowsPerPage: this.props.rowsPerPage ? this.props.rowsPerPage : 5
  };

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.rowsPerPage);
    this.setState({
      data: nextProps.tableData,
      rowsPerPage: nextProps.rowsPerPage
        ? nextProps.rowsPerPage
        : this.state.rowsPerPage
    });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = 0;
    // rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <CardBody style={{ margin: "-0.9375rem -20px" }}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <SortedTableHead
              tableHead={this.props.tableHead}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, key) => {
                  return (
                    <TableRow hover tabIndex={-1} key={key}>
                      {n.map((n, key) => {
                        var text;
                        if (key === 0) {
                          text = (
                            <Link
                              to={this.props.linkTo + this.props.listIds[key]}
                              className={("link", classes.linkText)}
                            >
                              {n}
                            </Link>
                          );
                        } else {
                          text = n;
                        }
                        return (
                          <Tooltip
                            key={key}
                            title={n ? n : " "}
                            placement={"bottom"}
                            enterDelay={300}
                            classes={{ tooltip: classes.tooltipText }}
                          >
                            <TableCell
                              className={
                                (classes.tableCell, classes.tablecellText)
                              }
                            >
                              {text}
                            </TableCell>
                          </Tooltip>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </CardBody>
    );
  }
}

SortedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SortedTable);
