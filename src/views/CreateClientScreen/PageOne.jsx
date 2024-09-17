/**
 * PageOne component.
 * 
 * This component is used to manage the missions associated with clients.
 *
 */
import React, { Component, Fragment } from 'react';
import './PageOne.css'

/* Material UI. */
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";

/* Bootstrat 1.0. */
import { Form } from "react-bootstrap";

/* Type and select. */
import cloneDeep from 'lodash/cloneDeep';

/* Custom components. */
import GridItem from "components/Grid/GridItem.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

/* Table image gallery. */
import Gallery from "react-grid-gallery";

/* AgGridReact. */
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import CustomHeader from "../../components/CustomHeader/CustomHeader";
import CustomFilter from "../../components/CustomFilter/CustomFilter"
import ImageCellRenderer from '../../components/ImageCellRenderer/ImageCellRenderer';
import PhotoEditor from "../../components/PhotoEditor/Imageeditor"
/* API. */
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
    marginBottom: 10,
    zIndex: 3
  },
  tableToolbar: {
    width: "100%",
    marginLeft: "3%",
    zIndex: 2,
    marginTop: 5
  },
  loadingDiv: {
    width: "100%",
    textAlign: "center"
  },
  tooltipText: {
    fontSize: "0.9rem"
  },
  tabTitl: {
    color: "#fff",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  paper: {
    position: "absolute",
    minWidth: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: "none"
  },

};


class PageOne extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      addColName: "",
      missionId: null,
      selectedMission: "",
      missionResponses: [],
      response: false,
      message: "",
      projectSource: [],
      projects: [],
      missions: [],
      tableFields: [],
      questions: [],
      sepMission: [],
      data: [],
      tablePrepend: 2,
      statusOptions: [],
      selectedStatus: null,
      defaultStatus: "",
      csvdata: [],

      /* Snackbar props. */
      msgColor: "info",
      br: false,

      /* Ag grid values. */
      columnDefs: [],
      quickFilterText: null,
      column_order: {},

      sideBar: false,
      // params.node.data.status

      rowData: [],
      context: { componentParent: this },

      frameworkComponents: {
        createImageSpan: CreateImageSpan,
        createVideoSpan: CreateVideoSpan,
        agColumnHeader: CustomHeader,
        customFilter: CustomFilter,
        barcoderenderer: ImageCellRenderer,
      },
      customer_id: "",
      answer_id: "",
      selectedQuestion: {},
      selectedAnswer: {},
      updatedAnswer: {},
      survey_tag_id: "",
      filteredMissions: [],
      departments: [],
      filteredDepartments: [],
      clients: [],
      filteredClients: [],
      seletectdetail: this.props.seletectdetail,
      metrics_data: [],
      column_def: {
        column_order: [],
        hidden_column: []
      },
      Updatecolumndef: [],
      openPopup: false,
      imageEdit: [],
      clientscreenconfig: true,
      filteredMetricList: [],
      filteredconsumertype: [],
      FilterRowData: []


    };
    this.deleteColumn = this.deleteColumn.bind(this);
    this.hideColumn = this.hideColumn.bind(this);

  }

  componentDidMount() {
    this.getMissionResponse()

  }

  /* Handles the snackbar message notification. */
  showNotification(msg, color) {
    this.setState({
      message: msg,
      msgColor: color
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

  /* Handles the api to filter the metric data. */
  metricFilter = (missionId) => {
    api2.get("v1/survey_report/metric_filter?mission_id=" + missionId)
      .then(resp => {
        this.setState({ filteredMetricList: resp && resp.data && resp.data.result ? resp.data.result : [] })
      })
  }

  /* Handles the api to filter the data. */
  ConsumerTypeFilter = (missionId) => {
    api2.get("v1/survey_report/consumertype_filter?mission_id=" + missionId)
      .then(resp => {
        this.setState({ filteredconsumertype: resp && resp.data && resp.data.result ? resp.data.result : [] })
      })
  }

  /* Handles the gridapi to update the row data. */
  getAllRows = () => {
    let rowData = [];
    this.api.forEachNodeAfterFilter(node => rowData.push(node.data));
    this.setState({
      FilterRowData: rowData
    })
  }

  /* Handles the api to fetch the mission details. */
  getMissionResponse = () => {
    let id = this.state.seletectdetail.mission_id

    var self = this;
    api2
      .get("v2/client_survey_report?id=" + id)
      .then(resp => {
        this.metricFilter(id);
        this.ConsumerTypeFilter(id);
        let statusOptions = [];
        let list = [];

        if (resp.data.list) {
          list = resp.data.list;
        }

        resp.data.status_data.forEach(s => {
          statusOptions.push({ label: s.name, value: s.id });
        });

        self.setState({
          column_def: {
            column_order: this.props.oldcolumn_def.column_order,
            hidden_column: this.props.oldcolumn_def.hidden_column
          },

          missionResponses: list.filter(x => {
            return x.responses.length > 0;
          }),
          response: true,

          questions: resp.data.questions,
          metrics_row: resp.data.metrics_row,
          // metrics_data: resp.data.metrics_data,
          statusOptions: statusOptions,
          column_order: this.props.oldcolumn_def.column_order.length > 0 ? { order: "modified", columns: this.props.oldcolumn_def.column_order } : resp.data.column_order,
          estimatedTime: resp.data.estimatedTime,
          points: resp.data.points
        });

        this.doTheThing();

      })
      .catch(error => {
        console.error(error);

        self.setState({
          response: true
        });
      });
  };

  /* Handles the events to update table. */
  onGridReady = params => {
    this.params = params
    this.gridApi = params.api;
    this.api = params.api;
    this.api.resetRowHeights();
    this.columnApi = params.columnApi;

  };

  /* Handles the events to update selected question. */
  getSelectedQuestion = ev => {

    let colDef = this.state.columnDefs;
    let currentdetails = {}
    let selectedQuestion = ''
    this.state.questions.forEach(m => {
      if ((ev.colDef.loop_set && ev.colDef.loop_set != null && ev.colDef.loop_set > 0) ?
        (ev.colDef.loop_set === m.loop_set &&
          ev.colDef.loop_number === m.loop_number && ev.colDef.queType === m.type && ev.colDef.id === m.question_id)
        : ev.colDef.queType === m.type && ev.colDef.id === m.question_id) {
        selectedQuestion = m.question;
        selectedQuestion['field'] = ev.colDef.field;
        if (ev.colDef.loop_set && ev.colDef.loop_set != null && ev.colDef.loop_set > 0) {
          selectedQuestion['loop_number'] = ev.colDef.loop_number;
          selectedQuestion['loop_set'] = ev.colDef.loop_set;
          // selectedQuestion['loop_triggered_qid'] = ev.colDef.loop_triggered_qid;
        }
      }
    });

    colDef.forEach((c, index) => {
      if (ev.colDef.field === c.field) {
        // currentdetails = c
        currentdetails.row_index = index
        currentdetails.survey_tag_id = ev.data.survey_tag_id
        currentdetails.column_index = ev.data.column_index
        // currentdetails.column_index = ev.rowIndex
        currentdetails.field = c.field
        currentdetails.question_id = ev.colDef.id
        currentdetails.queType = ev.colDef.queType
        currentdetails.type = ev.colDef.type
        currentdetails.headerName = c.headerName
        if (c.loop_set && c.loop_set != null && c.loop_set > 0) {
          // currentdetails.loop_triggered_qid = c.loop_triggered_qid;
          currentdetails.loop_set = c.loop_set;
          currentdetails.loop_number = c.loop_number;
        }
      }

    })
    this.setState({
      imageEdit: currentdetails,
      selectedQuestion: selectedQuestion,
    }, () => {
      if (this.state.selectedQuestion.type === "capture" || this.state.selectedQuestion.type === "barcode") {
        this.openLightbox();
      } else if (this.state.selectedQuestion.type === "upload" && this.state.selectedQuestion.properties.media_type === "image") {
        this.openLightbox();
      }
    })

  };

  /* Handles the open event of popup. */
  openLightbox() {
    this.setState({
      openPopup: true
    });
  }

  /* Handles the close event of popup. */
  closeLightbox = () => {
    this.setState({ openPopup: false });
  };

  /* Handles the event of cell click. */
  onCellClicked = (event) => {
    if (event.colDef.queType === "upload") {

      if (event.value.length === 0 || event.value[event.value.length - 1] === undefined) {
        this.setState({ openPopup: false })
      } else {
        this.getAllRows()
        this.getSelectedQuestion(event);
      }
    }
    else if (event.colDef.queType === "barcode" && (event.colDef.field.includes("-B_image") || event.colDef.field.includes("-B_oimage"))) {
      if (event.value === "" || event.value === undefined) {
        this.setState({ openPopup: false })
      } else {
        this.getAllRows()
        this.getSelectedQuestion(event);
      }
    }
    else if (event.colDef.queType === "capture" && !event.colDef.field.includes("-C_instext") && !event.colDef.field.includes("-C_scale")) {
      if (event.value === "" || event.value === undefined) {
        this.setState({ openPopup: false })
      } else {
        this.getAllRows()
        this.getSelectedQuestion(event);
      }
    }

  }

  /* Handles the event to update the column order. */
  columnMoved = event => {

    let columnState = event.columnApi.getColumnState();
    let updatedColumns = [];

    for (var i = 0; i < columnState.length; i++) {
      updatedColumns.push(columnState[i].colId.replace("_1", ""));
    }

    let column_def = this.state.column_def;
    column_def.column_order = updatedColumns;

    this.setState({
      column_order: { order: "modified", columns: updatedColumns },
      column_def: column_def
    }, () => {
      let updatedColumnDefs = [];
      let columnDefs = this.state.columnDefs;
      if (this.state.column_order && this.state.column_order.columns) {

        for (let j = 0; j < this.state.column_order.columns.length; j++) {
          for (let i = 0; i < columnDefs.length; i++) {
            if (columnDefs[i].field === this.state.column_order.columns[j]) {
              updatedColumnDefs.push(columnDefs[i]);
            }
          }
        }

        for (let j = 0; j < columnDefs.length; j++) {
          let matched = false;
          for (let i = 0; i < updatedColumnDefs.length; i++) {
            if (columnDefs[j].field === updatedColumnDefs[i].field) {
              matched = true;
            }
          }
          if (matched === false) {
            updatedColumnDefs.push(columnDefs[j]);
          }
        }

      }
      else {
        updatedColumnDefs = columnDefs;
      }

      this.setState({
        columnDefs: updatedColumnDefs,
      });
    });
    this.props.UpdateColumnDef(column_def);

  };

  /* Unused function. */
  onColumnResized = event => {
    //this.api.resetRowHeights();
  };

  /* Handles the event to update the column data. */
  updateColumns = event => {
    this.columnApi1 = event.columnApi;
    this.api = event.api;
    this.api.resetRowHeights();
  };


  /* Handles the event to calculate the row count. */
  calculateRowCount = () => {
    if (this.api && this.state.rowData) {
      const model = this.api.getModel();
      const totalRows = this.state.rowData.length;
      const processedRows = model.getRowCount();
      this.setState({
        rowCount:
          processedRows.toLocaleString() + " / " + totalRows.toLocaleString()
      });
    }
  };

  /*  Handles the event to design the column header and column definition.*/
  doTheThing = () => {

    let column = [

      {
        headerName: "Customer ID",
        field: "customer_id",
        type: "g",
        editable: false,
        //width: 120,
        lockPosition: true
      },
      {
        headerName: "Consumer Type",
        field: "consumerType",
        type: "g",
        filter: "customFilter",
        editable: false,
        // width: 120,
        lockPosition: true
      }

    ];


    let columns = column
    columns.forEach((c, index) => {

      if (this.state.column_def.hidden_column.includes(c.field)) {
        columns[index].cellClass = 'header-color'
        columns[index].headerClass = 'header-color'

      }

    })

    this.state.questions.forEach(q => {
      let qe = {};
      if (q.loop_set && q.loop_set != null && q.loop_set > 0) {
        qe.headerName = q.title + '_' + q.loop_set.toString() + '_' + q.loop_number.toString();
        qe.field = q.loop_set.toString() + '-' + q.loop_number.toString() + "-q" + q.question_id;
        qe.loop_set = q.loop_set;
        qe.loop_number = q.loop_number;
        qe.loop_triggered_qid = q.loop_triggered_qid;
        qe.headerTooltip = q.title + '_' + q.loop_set.toString() + '_' + q.loop_number.toString();

      } else {
        qe.headerName = q.title;
        qe.headerTooltip = q.title;
        qe.field = "q" + q.question_id;
      }

      qe.type = "q";
      qe.id = q.question_id;
      qe.autoHeight = true;
      qe.queType = q.type;
      qe.survey_tag_id = "survey_tag"

      if (q.type === 'barcode') {
        let barcode = cloneDeep(qe);
        barcode.field = qe.field + '-B_oimage';
        barcode.cellRenderer = "barcoderenderer";
        if (this.state.column_def.hidden_column.includes(barcode.field)) {
          barcode.cellClass = 'header-color'
          barcode.headerClass = 'header-color'
        }
        barcode.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(barcode);


        barcode = cloneDeep(qe);
        barcode.field = qe.field + '-B_image';
        barcode.cellRenderer = "barcoderenderer";
        if (this.state.column_def.hidden_column.includes(barcode.field)) {
          barcode.cellClass = 'header-color'
          barcode.headerClass = 'header-color'
        }
        barcode.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(barcode);


        barcode = cloneDeep(qe);
        barcode.field = qe.field + '-B_number';
        if (this.state.column_def.hidden_column.includes(barcode.field)) {
          barcode.cellClass = 'header-color'
          barcode.headerClass = 'header-color'
        }
        barcode.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(barcode);

        qe.field = qe.field + '-B_details'
        if (this.state.column_def.hidden_column.includes(qe.field)) {
          qe.cellClass = 'header-color'
          qe.headerClass = 'header-color'
        }
        qe.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(qe);

      }
      else if (q.type === 'capture') {
        let capture = cloneDeep(qe);
        capture.field = qe.field + '-C_oimage';
        capture.cellRenderer = "barcoderenderer";
        if (this.state.column_def.hidden_column.includes(capture.field)) {
          capture.cellClass = 'header-color'
          capture.headerClass = 'header-color'
        }
        capture.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(capture);

        capture = cloneDeep(qe);
        capture.cellRenderer = "barcoderenderer";
        if (this.state.column_def.hidden_column.includes(capture.field)) {
          capture.cellClass = 'header-color'
          capture.headerClass = 'header-color'
        }
        capture.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(capture);

        if (q.question.properties.instruction_enabled && q.question.properties.instruction_enabled === 1) {
          capture = cloneDeep(qe);
          capture.field = qe.field + '-C_instext';
          if (this.state.column_def.hidden_column.includes(capture.field)) {
            capture.cellClass = 'header-color'
            capture.headerClass = 'header-color'
          }
          capture.cellStyle = {
            'white-space': 'normal'
          }
          columns.push(capture);
        }

        if (q.question.properties.scale_enabled && q.question.properties.scale_enabled === 1) {
          capture = cloneDeep(qe);
          capture.field = qe.field + '-C_scale';
          capture.cellRenderer = "createImageSpan";
          if (this.state.column_def.hidden_column.includes(capture.field)) {
            capture.cellClass = 'header-color'
            capture.headerClass = 'header-color'
          }
          capture.cellStyle = {
            'white-space': 'normal'
          }
          columns.push(capture);
        }

      }
      else if (q.type === 'upload' && q.question.properties.media_type === 'image') {
        let img = cloneDeep(qe);
        img.field = qe.field + '-U_oimage';
        img.cellRenderer = "barcoderenderer";
        if (this.state.column_def.hidden_column.includes(img.field)) {
          img.cellClass = 'header-color'
          img.headerClass = 'header-color'
        }
        img.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(img);


        qe.cellRenderer = "barcoderenderer";
        if (this.state.column_def.hidden_column.includes(qe.field)) {
          qe.cellClass = 'header-color'
          qe.headerClass = 'header-color'
        }
        qe.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(qe);

      }
      else {
        if (this.state.column_def.hidden_column.includes((q.loop_set && q.loop_set != null && q.loop_set > 0) ?
          (q.loop_set.toString() + '-' + q.loop_number.toString() + "-q" + q.question_id) : ("q" + q.question_id))) {

          if (q.type === 'scale' || q.type === 'choice') {
            qe.cellRenderer = "createImageSpan";
            qe.filter = "customFilter";
          }
          else if (q.question.properties.media_type === 'video' || q.question.properties.media_type === 'audio') {
            qe.cellRenderer = "createVideoSpan";
          }

          qe.cellClass = 'header-color'
          qe.headerClass = 'header-color'
          qe.cellStyle = {
            'white-space': 'normal'
          }

        }
        else {
          if (q.type === 'scale' || q.type === 'choice') {
            qe.cellRenderer = "createImageSpan";
            qe.filter = "customFilter";
          }
          else if (q.question.properties.media_type === 'video' || q.question.properties.media_type === 'audio') {
            qe.cellRenderer = "createVideoSpan";
          }

          qe.cellStyle = {
            'white-space': 'normal'
          }
          /** Commented code for info text not want to  display anymore in report and response screen */
          // if (q.type != 'info') {
          //   qe.cellStyle = {
          //     'white-space': 'normal'
          //   }
          // }
        }
        columns.push(qe);
      }

    });




    // Add Metrics to the Table Header (tableFields)
    this.state.metrics_row.forEach(m => {

      let qe = {};
      if (this.state.column_def.hidden_column.includes("m" + m.id)) {
        qe.headerName = m.row_name;
        qe.field = "m" + m.id;
        qe.type = "m";
        qe.id = m.id;
        qe.autoHeight = true;
        //qe.editable = true;
        qe.cellClass = 'header-color'
        qe.headerClass = 'header-color'
        qe.filter = "customFilter";
      }
      else {
        qe.headerName = m.row_name;
        qe.field = "m" + m.id;
        qe.type = "m";
        qe.id = m.id;
        qe.autoHeight = true;
        //qe.editable = true;
        qe.cellStyle = {
          'white-space': 'normal'
        }
        qe.filter = "customFilter";
      }


      columns.push(qe);

    });


    let newdef = [

      {
        headerName: "Estimated Time in Minutes",
        field: "estimatedTime",
        type: "g",
        editable: false,
        //width: 100
      },
      {
        headerName: "Actual Time in Minutes",
        field: "actualTime",
        type: "g",
        editable: false,
        //width: 100
      },
      {
        headerName: "Email", field: "email", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: "Contact", field: "mobile", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: "Address", field: "address", type: "g", editable: false, autoHeight: true, cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: "Mobile Details", field: "device", type: "g", editable: false, autoHeight: true, cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: "Points",
        field: "points",
        type: "g",
        editable: false,
        // width: 100
      },
      {
        headerName: "Last Accessed Time",
        field: "surveyTagUpdated",
        type: "g",
        editable: false
      }


    ]
    let columnDe = newdef
    columnDe.forEach((c, index) => {

      if (this.state.column_def.hidden_column.includes(c.field)) {
        columnDe[index].cellClass = 'header-color'
        columnDe[index].headerClass = 'header-color'

      }

    })
    let columnDefs = column.concat(columnDe)

    this.setState({ Updatecolumndef: columnDefs })

    this.UpdateColumnDef(columnDefs);


  }

  /*  Handles the event to update the color for column.*/
  UpdateColumnDefColor = (a, i) => {
    let columnDefs = this.state.Updatecolumndef
    if (a === "first") {
      this.UpdateColumnDef(this.state.Updatecolumndef)
    }
    else {
      if (a === "add") {
        let column = columnDefs
        column.forEach((d, index) => {
          if (d.field === i) {
            column[index].cellStyle = { color: 'white', 'background-color': '#808080' }
          }
        })

        this.UpdateColumnDef(column)

      }
      else if (a === "remove") {
        let column = columnDefs
        column.forEach((d, index) => {
          if (d.field === i) {
            column[index].cellStyle = { 'white-space': 'normal' }
          }
        })
        this.UpdateColumnDef(column)

      }
    }
  }

  /* Handles the event to update the column definition of table. */
  UpdateColumnDef = (coldef) => {

    let columnDefs = coldef
    let updatedColumnDefs = [];
    if (this.state.column_order && this.state.column_order.columns) {

      for (let j = 0; j < this.state.column_order.columns.length; j++) {
        for (let i = 0; i < columnDefs.length; i++) {
          if (columnDefs[i].field === this.state.column_order.columns[j]) {
            updatedColumnDefs.push(columnDefs[i]);
          }
        }
      }

      for (let j = 0; j < columnDefs.length; j++) {
        let matched = false;
        for (let i = 0; i < updatedColumnDefs.length; i++) {
          if (columnDefs[j].field === updatedColumnDefs[i].field) {
            matched = true;
          }
        }
        if (matched === false) {
          updatedColumnDefs.push(columnDefs[j]);
        }
      }

    }
    else {
      updatedColumnDefs = columnDefs;
    }

    this.setState({
      columnDefs: updatedColumnDefs,
    });
    this.sepmissonFormat()

  }

  /*  Handles the event to form missions data.*/
  sepmissonFormat = () => {
    let sepMission = [];
    let survey_tag_id = Number;
    let metrics_data = []

    this.state.missionResponses.forEach(missResp => {
      if (missResp.metrics_data.length > 0) {
        missResp.metrics_data.forEach(m => {
          metrics_data.push(m)
        })

      }

      if (missResp.responses.length > 0) {
        survey_tag_id = missResp.survey_tag_id
        let answs = [];
        let status = missResp.status;
        let address = "";
        let device = "";
        let surveyTagUpdated = "";
        let surveyTagCreated = "";
        let reviewed = missResp.reviewed;

        missResp.responses.forEach(x => {
          answs.push(x);
          address = x.answers.address && x.answers.address !== "" ? x.answers.address : address;
          device = x.answers.deviceId ? x.answers.deviceName ? x.answers.systemName ? x.answers.systemVersion
            ? (x.answers.deviceId + "\n" + x.answers.deviceName + "\n" + x.answers.systemName + "\n" + x.answers.systemVersion) :
            (x.answers.deviceId + "\n" + x.answers.deviceName + "\n" + x.answers.systemName) :
            (x.answers.deviceId + "\n" + x.answers.deviceName) :
            (x.answers.deviceId) : device;
          if (surveyTagUpdated.length === 0) {
            surveyTagUpdated = x.updated_on;
          }
          else {
            surveyTagUpdated = (new Date(x.updated_on) > new Date(surveyTagUpdated)) ? x.updated_on : surveyTagUpdated;
          }
          if (surveyTagCreated.length === 0) {
            surveyTagCreated = x.created_on;
          }
          else {
            surveyTagCreated = (new Date(x.created_on) > new Date(surveyTagCreated)) ? surveyTagCreated : x.created_on;
          }

        })




        sepMission.push({
          index: sepMission.length,
          survey_tag_id: survey_tag_id,
          checked: false,

          // innermost object
          answers: answs,
          address: address,
          device: device,
          status: this.getStatusName(status),
          surveyTagUpdated: new Date(surveyTagUpdated).toLocaleString(),

          // response fields
          actualTime: status >= 2 ? Math.floor(((Date.parse(surveyTagUpdated) - Date.parse(surveyTagCreated)) / 1000) / 60) : "",
          customer_id: missResp.customer_id,
          email: missResp.email,
          mobile: missResp.mobile,
          consumerType: missResp.consumerType != null ? missResp.consumerType : "",
          reviewed: reviewed,

          // outermost object
          estimatedTime: this.state.estimatedTime,
          points: this.state.points
        });
        survey_tag_id = Number;
      }


    });
    this.setState({ metrics_data: metrics_data })
    this.doTableData(sepMission);
  };

  /*  Handles the event to match mission data with column definition.*/
  doTableData = sepMission => {
    let listItems = [];

    sepMission.forEach((missionResponse, index) => {
      let temp = (this.formatData(missionResponse));
      temp.column_index = index;
      listItems.push(temp);
    });

    this.setState({
      listItems: listItems,
      sepMission: sepMission
    });

  };

  /*  Handles the event to form missions data based on question type.*/
  formatData = missionResponse => {
    let arr = {};

    this.state.columnDefs.forEach(c => {
      if (c.type === "g") {
        arr[c.field] = missionResponse[c.field];
      } else if (c.type === "q") {
        let ans = {};
        missionResponse.answers.forEach(answ => {
          if (c.id === answ.question_id && c.loop_set === answ.loop_set && c.loop_number === answ.loop_number) {
            ans = answ;
          }
        });
        if (ans != {} && ans.type && ans.type === 'barcode' && ans.answers && ans.answers.image) {
          if (c.field.includes('-B_oimage')) {
            arr[c.field] = [0, ans.answers.image_orig ? ans.answers.image_orig + '?thumbnail=yes' : ans.answers.image + '?thumbnail=yes']
          }
          else if (c.field.includes('-B_image')) {
            if (ans.answers.hide === 1) {
              arr[c.field] = []
            } else {
              arr[c.field] = [0, ans.answers.image + '?thumbnail=yes']
            }
          }
          else if (c.field.includes('-B_number') && ans.answers.barcode_id) {
            arr[c.field] = ans.answers.barcode_id
          }
          else if (c.field.includes('-B_details') && ans.answers.product_name) {
            arr[c.field] = ans.answers.product_name
          }
        }
        else if (ans != {} && ans.type && ans.type === 'upload' && ans.answers && ans.answers.media_type && ans.answers.media_type === 'image') {
          if (c.field.includes('-U_oimage')) {
            arr[c.field] = [0, ans.answers.image_orig ? (ans.answers.image_orig + '?thumbnail=yes') : (ans.answers.media + '?thumbnail=yes')]
          }
          else {
            if (ans.answers.hide === 1) {
              arr[c.field] = []
            } else {
              arr[c.field] = [0, ans.answers.media + '?thumbnail=yes']
            }
          }
        }
        else if (ans != {} && ans.type && ans.type === 'capture' && ans.answers && ans.answers.image) {
          if (c.field.includes('-C_oimage')) {
            arr[c.field] = [0, ans.answers.image_orig ? (ans.answers.image_orig + '?thumbnail=yes') : (ans.answers.image + '?thumbnail=yes')];
          }
          else if (c.field.includes('-C_instext')) {
            arr[c.field] = ans.answers.caption_text ? ans.answers.caption_text : ""
          }
          else if (c.field.includes('-C_scale')) {
            this.state.questions.forEach((q, i) => {
              if (ans.question_id === q.question_id && ans.type && q.type && ans.type === q.type) {
                arr[c.field] = this.formatAnswer(ans, q.question.properties);
              }
            })
          }
          else {
            if (ans.answers.hide === 1) {
              arr[c.field] = []
            } else {
              arr[c.field] = [0, ans.answers.image + '?thumbnail=yes'];
            }
          }
        }
        else if (ans != {} && ans.type && ans.type !== 'info' && ans.type !== 'input' && ans.type !== 'gps') {
          this.state.questions.forEach((q, i) => {
            if (ans.question_id === q.question_id && ans.type && q.type && ans.type === q.type) {
              arr[c.field] = this.formatAnswer(ans, q.question.properties);
            }
          })
        } else {
          arr[c.field] = this.formatAnswer(ans, false);
          /** Commented code for info text not want to  display anymore in report and response screen */
          // if (c.queType == 'info') {
          //   arr[c.field] = this.formatAnswer(ans, c);
          // }
          // else {
          //   arr[c.field] = this.formatAnswer(ans, false);
          // }
        }
        arr[c.survey_tag_id] = missionResponse.survey_tag_id
      } else if (c.type === "m") {
        arr[c.field] = this.getMissionMetric(
          missionResponse.survey_tag_id,
          c.id
        );
      }
    });

    return arr;
  };

  /*  Handles the event to form metric data.*/
  getMissionMetric = (survey_tag_id, metrics_id) => {
    let data = " ";
    this.state.metrics_data.forEach(m => {
      if (survey_tag_id === m.survey_tag_id && metrics_id === m.metrics_id)
        data = m.metrics_data;
    });
    return data;
  };

  /*  Handles the event to format answer data.*/
  formatAnswer(a, q) {
    let ans = "";
    let anstext = "";
    let ans_img = "";

    switch (true) {
      case a.type === "choice" &&
        a.answers.choice_type === "single" &&
        a.answers.multilevel === 0:
        if (a.answers.id === 'other' && a.answers.other_value) {
          q.options.forEach(o => {
            if (a.answers.id === o.id) {
              ans = [o.label + '-' + a.answers.other_value, a.answers.label_image,]
            }
          })
          return ans
        }
        if (q.options) {
          q.options.forEach(o => {
            if (a.answers.id === o.id) {
              ans = [o.label, a.answers.label_image]
            }
          })
        } else {
          ans = [a.answers, a.answers.label_image]
        }
        return ans
      case a.type === "choice" &&
        a.answers.choice_type === "single" &&
        a.answers.multilevel === 1 &&
        a.answers.selected_option.length > 0:
        ans = [];

        a.answers.selected_option
          .map(
            as =>
              q.options.forEach(o => {

                if (as.id === o.id) {
                  o.sublabel.forEach(x => {
                    if (as.sub_id === x.id) {
                      anstext = as.id === 'other' ? a.answers.other_value ?
                        o.label + '-' + a.answers.other_value :
                        (o.label ? o.label : "") +
                        "-" +
                        (x.sublabel ? x.sublabel : "")
                        :
                        (o.label ? o.label : "") +
                        "-" +
                        (x.sublabel ? x.sublabel : "")
                    }
                  })
                }

              })
          )

        a.answers.selected_option
          .map(
            as =>
              ans_img = ans_img + "," + (as.label_image && as.label_image.length > 0 ? as.label_image : "") + "," +
              (as.sub_label_image && as.sub_label_image.length > 0 ? as.sub_label_image : "")
          )

        ans.push(anstext)
        ans.push(ans_img)

        return ans

      case a.type === "choice" &&
        a.answers.choice_type === "multiple" &&
        a.answers.multilevel === 0 &&
        a.answers.selected_option.length > 0:
        q.options.forEach(o => {
          a.answers.selected_option.forEach(aa => {
            if (aa.id === o.id) {
              ans = o.id === 'other' ? a.answers.other_value ?
                ans === "" ?
                  o.label + '-' + a.answers.other_value :
                  ans + ',' + o.label + '-' + a.answers.other_value :
                ans === "" ? o.label :
                  ans + ',' + o.label :
                ans === "" ? o.label : ans + ',' + o.label
            }
          }
          )
        })
        return [ans,
          a.answers.selected_option.map(as => as.label_image).join()
        ];
      case a.type === "choice" &&
        a.answers.choice_type === "multiple" &&
        a.answers.multilevel === 1 &&
        a.answers.selected_option.length > 0:
        ans = [];
        anstext = "";
        ans_img = "";

        a.answers.selected_option
          .map(
            as =>
              q.options.forEach(o => {

                if (as.id === o.id) {
                  o.sublabel.forEach(x => {
                    if (as.sublabel_id === x.id) {
                      anstext = anstext !== "" ? (anstext + ", " + (as.id === 'other' ? a.answers.other_value ?
                        o.label + '-' + a.answers.other_value :
                        (o.label ? o.label : "") +
                        "-" +
                        (x.sublabel ? x.sublabel : "")
                        :
                        (o.label ? o.label : "") +
                        "-" +
                        (x.sublabel ? x.sublabel : ""))) :

                        (as.id === 'other' ? a.answers.other_value ?
                          o.label + '-' + a.answers.other_value :
                          (o.label ? o.label : "") +
                          "-" +
                          (x.sublabel ? x.sublabel : "")
                          :
                          (o.label ? o.label : "") +
                          "-" +
                          (x.sublabel ? x.sublabel : ""))

                    }
                  })
                }

              })
          )

        a.answers.selected_option
          .map(
            as =>
              ans_img = ans_img + "," + (as.label_image && as.label_image.length > 0 ? as.label_image : "") + "," +
              (as.sub_label_image && as.sub_label_image.length > 0 ? as.sub_label_image : "")
          )

        ans.push(anstext)
        ans.push(ans_img)

        return ans

      case a && a.type === "input":
        return a.answers.text ? a.answers.text : " ";
      case a && a.type === "scale" && a.answers.scale_type === "scale":
        let value = a.answers && a.answers.selected_option && a.answers.selected_option.length > 0 ?
          a.answers.selected_option[a.answers.selected_option.length - 1].value : "";
        return [value, a.answers.selected_option && a.answers.selected_option.length > 0
          ? a.answers.selected_option.map(as => as.image_id).join() + ""
          : ""]
      case a && a.type === "scale" && a.answers.scale_type === "table":
        return [
          a.answers.selected_option.length > 0
            ? a.answers.selected_option
              .map(
                as =>
                  " " +
                  this.getScaleTableLabel(a.question_id, as.id) +
                  ":" +
                  this.getScaleTableOption(a.question_id, as.image.id)
              )
              .join() + ""
            : "",
          a.answers.selected_option.length > 0
            ? a.answers.selected_option.map(as => as.image.image_id).join() +
            ","
            : ""
        ];

      case a && a.type === "gps":
        return a.answers.address;
      case a && a.type === "info":
        return "";
      case a && a.type === "upload" && (a.answers.media_type === "video" || a.answers.media_type === "audio"):
        return [a.answers.media, a.answers.media_type];
      case a.type === "capture":
        let match_scale = false;
        q.scale_images.forEach(o => {
          if ((a.answers.scale_image_id - 1) === o.id && o.image && o.image !== "") {
            ans = [a.answers.scale_image_id, o.image];
            match_scale = true;
          }
        })
        if (match_scale === false) {
          ans = [a.answers.scale_image_id.toString(), ""];
        }
        return ans

      default:
        return "";
      /** Commented code for info text not want to  display anymore in report and response screen */
      // if (q.queType == 'info') {
      //   /** Display information text in response and report screen */
      //   return q.headerName
      // }
      // else {
      //   return "";
      // }
    }
  }

  /*  Handles the event to return label. */
  getScaleTableLabel = (question_id, id) => {
    let quest = this.state.questions.filter(q => q.question_id === question_id);
    let label = "";

    if (quest.length === 1) {
      let q = quest[0];
      if (q.question.properties.table_content && q.question.properties.table_content.table_value) {
        q.question.properties.table_content.table_value.forEach(tv => {
          if (tv.id === id) {
            label = tv.value;
          }
        });
      }
    }

    return label;
  };

  /*  Handles the event to return scaletable option. */
  getScaleTableOption = (question_id, id) => {
    let quest = this.state.questions.filter(q => q.question_id === question_id);
    let label = "";

    if (quest.length === 1) {
      let q = quest[0];
      if (q.question.properties.table_content && q.question.properties.table_content.table_options) {
        q.question.properties.table_content.table_options.forEach(tc => {
          if (tc.id === id) {
            label = tc.value;
          }
        });
      }
    }

    return label;
  };

  /*  Handles the event to format the data for preview. */
  renderText = prop => {

    const { classes } = this.props;

    if (prop && typeof prop === "object") {

      let textImages = [];
      let text = prop[0] ? prop[0] : "";
      if (Number.isInteger(text)) {
        text = text.toString();
      }
      if (prop[prop.length - 1] && prop[prop.length - 1] !== undefined) {
        prop[prop.length - 1].split(",").forEach(img => {
          if (img) {
            textImages.push({
              src: img,
              thumbnail: img,
              thumbnailWidth: 5,
              thumbnailHeight: 5
            });
          }
        });

      }

      return (
        <div>
          <Tooltip
            title={text}
            placement={"bottom"}
            enterDelay={300}
            classes={{ tooltip: classes.tooltipText }}
          >
            <span>{text}</span>
          </Tooltip>
          <Gallery
            style={{ width: "100%" }}
            enableImageSelection={false}
            images={textImages}
            rowHeight={50}
            maxRows={2}
            enableLightbox={true}
          />
        </div>
      );
    } else {
      return (
        <div>
          <Tooltip
            title={prop ? prop + " " : " "}
            placement={"bottom"}
            enterDelay={300}
            classes={{ tooltip: classes.tooltipText }}
          >
            <span>{prop}</span>
          </Tooltip>

        </div>
      );
    }
  };



  /*  Handles the event to add new column. */
  addColumn = () => {
    if (this.state.tableFields.indexOf(this.state.addColName.toLowerCase()) >= 0) {
      this.showNotification("Duplicate Column Name", "danger");
    } else {
      api2
        .post("v1/survey_report/metrics", {
          mission_id: this.state.seletectdetail.mission_id,
          metrics_name: this.state.addColName
        })
        .then(resp => {

          if (resp.status === 200) {
            this.state.tableFields.push(this.state.addColName);
            this.showNotification("New Column Added", "success");

            let metrics_row = [...this.state.metrics_row];

            metrics_row.push({
              id: resp.data.id,
              row_name: this.state.addColName
            });


            this.setState(
              {
                metrics_row: metrics_row,
                column_order: {}
              },
              () => {
                this.doTheThing();
              }
            );
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  /*  Handles the event to delete column. */
  deleteColumn = (id) => {
    api2
      .delete("v1/survey_report/metrics", { data: { id: id } })
      .then(resp => {

        if (resp.status === 200) {
          let metrics_row = [...this.state.metrics_row];
          let metrics_data = [...this.state.metrics_data];
          let column_order = this.columnApi.getColumnState();
          let columnDefs = [...this.state.columnDefs];

          metrics_row.forEach((m, index) => {
            if (m.id === id) {
              metrics_row.splice(index, 1);
            }
          });

          metrics_data.forEach((m, index) => {
            if (m.metrics_id === id) {
              metrics_data.splice(index, 1);
            }
          });

          column_order.forEach((m, index) => {
            if (m.colId === id) {
              column_order.splice(index, 1);
            }
          });

          columnDefs.forEach((m, index) => {
            if (m.id === id) {
              columnDefs.splice(index, 1);
            }
          });

          this.columnApi.setColumnState(column_order);
          let set_column_order = {};

          if (this.state.column_order && this.state.column_order.columns) {
            let updatedColumns = [];


            for (var i = 0; i < column_order.length; i++) {
              updatedColumns.push(column_order[i].colId.replace("_1", ""));
            }

            set_column_order = { order: "modified", columns: updatedColumns };

          }



          this.setState(
            {
              metrics_row: metrics_row,
              metrics_data: metrics_data,
              columnDefs: columnDefs,
              column_order: set_column_order
            });

          this.showNotification("Column Deleted Successfully", "success");
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  /*  Handles the event to hide column. */
  hideColumn = (colId) => {
    // let id =colId;
    let id = colId.replace("_1", "");
    let column_def = this.state.column_def;
    let hidden_column = column_def.hidden_column

    if (hidden_column.includes(id)) {
      for (var i = 0; i < hidden_column.length; i++) {
        if (hidden_column[i] === id) {
          hidden_column.splice(i, 1);
          break;
        }
      }
    }
    else {
      hidden_column.push(id)
    }

    column_def.hidden_column = hidden_column;

    this.setState(
      {
        column_def: column_def
      });

    this.doTheThing();
    this.props.UpdateColumnDef(column_def);

  }

  /*  Handles the event to return status of mission. */
  getStatusName = id => {
    let statName = " ";
    this.state.statusOptions.forEach(s => {
      if (s.value === id) statName = s.label;
    });
    return statName;
  };

  /*  Handles the event to export the missions in Excel. */
  exportCsv = () => {
    var params = {};
    params.processCellCallback = function (params) {
      if (params.column.colDef.queType && (params.column.colDef.queType === "scale" || params.column.colDef.queType === "choice")) {
        if (params.value && params.value.length > 0) {
          return params.value[0];
        }
        else {
          return params.value;
        }
      }
      else {
        return params.value;
      }
    };
    let missionName = this.props.seletectdetail ? this.props.seletectdetail.mission_name : ""
    params.fileName = missionName;
    this.api.exportDataAsCsv(params);
  };


  render() {

    const { msgColor, br, message } = this.state;

    return (
      <div className="pageonefull" style={{ height: "100%" }}>
        <div className="gridHeader" style={{ width: "100%", marginLeft: "3%", marginBottom: "1%" }}>
          <Grid container alignItems="center">
            <Form.Label
              style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}
            >
              Project Name :
            </Form.Label>
            <Form.Label
              style={{ marginTop: 10, marginLeft: 10, marginRight: 10, fontWeight: "600" }}
            >
              {this.props.seletectdetail.project_name}
            </Form.Label>
            <Form.Label
              style={{ marginTop: 10, marginLeft: 10, marginRight: 10 }}
            >
              Mission Name :
            </Form.Label>
            <Form.Label
              style={{ marginTop: 10, marginLeft: 10, marginRight: 10, fontWeight: "600" }}
            >
              {this.props.seletectdetail.mission_name}
            </Form.Label>




            <GridItem>
              <Button
                style={{
                  // margin: "0px 10px",
                  marginRight: "50px",
                  fontSize: "12px"
                }}
                variant="contained"
                color="primary"
                onClick={this.exportCsv}
              // disabled={this.state.missionResponses.length === 0}
              >
                Export
              </Button>
            </GridItem>
          </Grid>

          {/* </Grid> */}
        </div>

        {/* </div> */}


        <Fragment>
          <MuiThemeProvider theme={theme}>

            <div className="ag_list-box"
              style={{
                width: "100%",
                float: "left",
                flexWrap: "wrap",
                justifyContent: " left",
                padding: "0% 3% 0% 3%",
                /* height: 80%; */
                height: "calc(100% - 50px)"
              }}
            >
              <div
                className="ag-theme-balham"
                style={{
                  height: "100%",
                  width: "100%",
                  // marginTop: 20
                }}
              >
                <AgGridReact
                  // listening for events
                  onGridReady={this.onGridReady}
                  onRowSelected={this.onRowSelected}
                  onCellClicked={this.onCellClicked}
                  onModelUpdated={this.calculateRowCount}
                  onColumnMoved={this.columnMoved}

                  onColumnResized={this.onColumnResized}
                  rowData={this.state.listItems}
                  onRowDataChanged={this.updateColumns}
                  getRowNodeId={function (data) { return data.survey_tag_id; }}
                  // binding to simple properties
                  sideBar={this.state.sideBar}
                  quickFilterText={this.state.quickFilterText}
                  // no binding, just providing hard coded strings for the properties
                  // boolean properties will default to true if provided (ie suppressRowClickSelection => suppressRowClickSelection="true")
                  suppressRowClickSelection
                  rowSelection="multiple"
                  groupHeaders
                  columnDefs={this.state.columnDefs}
                  context={this.state.context}
                  //pagination={true}
                  frameworkComponents={this.state.frameworkComponents}
                  // setting default column properties
                  sortingOrder={["desc", "asc", null]}
                  defaultColDef={{
                    resizable: true,
                    sortable: true,
                    filter: true,
                    lockVisible: true,
                    headerComponentParams: {
                      menuIcon: "fa-bars",
                      //deleteIcon: "fa-trash",
                      hideIcon: "fa-eye-slash"
                    }
                  }}
                  onColumnDelete={this.deleteColumn}
                  onColumnHide={this.hideColumn}
                  filteredMetricList={this.state.filteredMetricList}
                  filteredconsumertype={this.state.filteredconsumertype}
                  questions={this.state.questions}
                />
              </div>

            </div>
          </MuiThemeProvider>
        </Fragment>

        <Snackbar
          place="br"
          color={msgColor}
          open={br}
          message={message}
          closeNotification={() => this.setState({ br: false })}
          close
        />

        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.openPopup}
          onClose={this.closeLightbox}
        >

          <div
            className="ImageEditor"
            style={{
              left: "283px"
            }}>
            <PhotoEditor
              ref={this.Editor}
              FilterRowData={this.state.FilterRowData}
              clientscreenconfig={this.state.clientscreenconfig}
              colDef={this.state.columnDefs}
              selectedAnswer={this.state.imageEdit}
              questions={this.state.questions}
              filteredMissions={this.state.missionResponses}
              openPopup={this.state.openPopup}
              closeLightbox={this.closeLightbox}
            />
          </div>

        </Modal>

      </div>


    )
  }

}

export default withStyles(styles)(PageOne);


export class CreateImageSpan extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };

  }

  render() {

    let prop = this.state.value;
    let images = [];
    let text = prop && prop[0] ? prop[0] : "";
    if (prop && prop[1]) {
      images = prop[1].split(",")
    }

    if (!(typeof text === 'string' || text instanceof String)) {
      text = ""
    }

    return (
      <span><p style={{
        marginTop: 0,
        marginBottom: 0
      }}>{text}</p>
        {images.length > 0 &&
          images.map((image) => (
            <img
              src={image}
              alt={image}
              height="50"
              style={{
                objectFit: "contain",
                margin: "5px 5px 5px 0px"
              }}
            />
          ))
        }
        {images.length > 0 &&
          <br></br>
        }
      </span>
    );
  }
}



export class CreateVideoSpan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };

  }

  render() {

    return (
      <span>
        <a href={this.state.value} download ><p>{this.state.value}</p></a>

      </span>
    );
  }
}