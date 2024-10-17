
/**
 * ViewClientScreen component
 * 
 * This component is used to manage the missions associated with clients.
 *
 */
import React, { Component, Fragment } from 'react';
/* Material UI */
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";

/* Type and select. */
import Select from "react-select";


import Loading from "components/Loading/Loading.jsx";

/* Custom components. */
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

/* Table image gallery. */
import Gallery from "react-grid-gallery";

/* AgGridReact. */
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import TablePagination from "@material-ui/core/TablePagination";

import CustomHeader from "../../components/CustomHeader/CustomHeader";
import PreviewButton from "../MissionResponse/PreviewButton";
import CustomFilter from "../../components/CustomFilter/CustomFilter"
import PhotoEditor from "../../components/PhotoEditor/Imageeditor"
import ImageCellRenderer from '../../components/ImageCellRenderer/ImageCellRenderer';
import cloneDeep from 'lodash/cloneDeep';

/* API */
import api2 from "../../helpers/api2";

import * as Constants from "../../helpers/constants.jsx";

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

const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

let loadedlistItems = [];
const defaultApiPage = 2000;
const defaultApirecordId = 0;

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


class ViewClientScreen extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      metrics_data: [],
      column_def: {
        column_order: [],
        hidden_column: []
      },
      Updatecolumndef: [],
      openPopup: false,
      imageEdit: [],
      clientscreenconfig: true,
      addColName: "",
      missionId: null,
      selectedMission: "",
      missionResponses: [],
      response: false,
      message: "",
      projectSource: [],
      projects: [],
      missions: [],
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
      column_order: [],

      sideBar: false,
      // params.node.data.status

      rowData: [],
      context: { componentParent: this },
      page: 0,
      pagecount: 0,
      datapagecount: 0,
      rowsPerPage: 50,
      listItems: [],
      missionResponses_temp: [],

      frameworkComponents: {
        previewButton: PreviewButton,
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
      loading: false,
      previewMission: {},
      preview: false,
      clienthidden: [],
      filteredMetricList: [],
      filteredconsumertype: [],
      FilterRowData: [],
      selectedlanguage: { label: "Select a Language", value: '' },
      activefiltermenu: [],
      languagecode: [],
      /* snackbar props */
    }
  }

  componentDidMount() {
    this.getProjectList();
    this.getlanguagelist();
  }

  /* Handles the api to fetch the project list. */
  getProjectList() {
    var self = this;
    let username = localStorage.getItem("email");
    api2
      .get("client_projects?id=" + username)
      .then(resp => {
        let proj = [];
        resp.data.forEach((x, i) => {
          proj.push({ value: i, label: x.project_name });
        });
        self.setState({
          projectSource: resp.data,
          projects: proj
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the grid api to update the table. */
  getAllRows = () => {
    let rowData = [];
    this.api.forEachNodeAfterFilter(node => rowData.push(node.data));
    this.setState({
      FilterRowData: rowData
    })
  }

  /* Handles the event to update the project. */
  handleProjectChange = e => {
    let miss = [];
    if (e.value >= 0 && e.value <= this.state.projectSource.length) {
      this.state.projectSource[e.value].mission_list.forEach((x, i) => {
        miss.push({ value: x.id, label: x.mission_name });
      });
    }
    this.setState({
      missions: miss,
      selectedMission: ""
    });
  };

  /* Handles the event to update the mission. */
  handleMissionChange = e => {

    this.setState(
      {
        selectedMission: e,
        missionId: e.value,
        selectedlanguage: { label: "Select a Language", value: '' },
        clienthidden: [],

      },
      () => {
        this.getClientresponseconfig()
        // this.getMissionResponse()
      }

    );

  };

  /* Handles the event to restore the data. */

  Restore = () => {
    this.getClientresponseconfig()
    this.Updatehiddendata("restore")
  }

  /* Handles the snackbar message notification. */
  ShowNotification = (msg, color) => {
    this.setState({
      message: msg,
      msgColor: color,
      //   br:true
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

  /* Handles the api to fetch the client response. */
  getClientresponseconfig = () => {
    var self = this;
    api2
      .get("v1/client_response_config?id=" + this.state.missionId)
      .then(resp => {
        if (resp.data.status === 200) {
          let columns = resp.data.response_config.column_def.column_order
          let hidden_column = resp.data.response_config.column_def.hidden_column
          columns.forEach((c, index) => {
            if (hidden_column.includes(c)) {
              columns.splice(index, 1)
            }
          })
          self.setState({
            column_order: columns,
            column_def: { hidden_column: hidden_column, column_order: columns }
          })

          this.getClienthidden()
        }

      })
      .catch(error => {
        console.error(error);

        self.setState({
          response: true
        });
      });
  }

  /* Handles the event of cell click. */
  onCellClicked = (event) => {
    if (event.colDef.queType === "upload") {

      if (event.value.length === 0 || event.value[event.value.length - 1] === undefined) {
        this.setState({ openPopup: false })
      }
      else if (event.colDef.mediaType && (event.colDef.mediaType === 'video' || event.colDef.mediaType === 'audio')) {
        // skip audio video clicks		
      }
      else {
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
          selectedQuestion['loop_triggered_qid'] = ev.colDef.loop_triggered_qid;
        }
      }
    });

    colDef.forEach((c, index) => {
      if (ev.colDef.field === c.field) {
        // currentdetails = c
        currentdetails.row_index = index
        currentdetails.survey_tag_id = ev.data.survey_tag_id
        currentdetails.column_index = ev.data.column_index
        //currentdetails.column_index = ev.rowIndex
        currentdetails.field = c.field
        currentdetails.question_id = ev.colDef.id
        currentdetails.queType = ev.colDef.queType
        currentdetails.type = ev.colDef.type
        currentdetails.headerName = c.headerName
        if (c.loop_set && c.loop_set != null && c.loop_set > 0) {
          currentdetails.loop_triggered_qid = c.loop_triggered_qid;
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

  /* Handles the api to fetch client details. */
  getClienthidden = () => {
    let username = localStorage.getItem("email");
    var self = this;
    api2
      .get("v1/client_config?mission_id=" + this.state.missionId + "&client_id=" + username)
      .then(resp => {

        if (resp.data.response_config && resp.data.response_config.column_def && resp.data.response_config.column_def.column_order) {
          let data = resp.data.response_config.column_def
          let chidden_column = data.hidden_column
          // let hidden_column = this.state.column_def.hidden_column
          let column = data.column_order

          // this.state.clienthidden = chidden_column
          // if (chidden_column != "") {
          //   chidden_column.forEach(h => {
          //     hidden_column.push(h)
          //   })
          //   column.forEach((c, index) => {
          //     if (chidden_column.includes(c))
          //       column.splice(index, 1)
          //   })

          // }

          self.setState({
            column_order: column,
            clienthidden: chidden_column,
            // column_def: { hidden_column: hidden_column, column_order: column }
          })


        }
        this.getMissionResponse('', defaultApirecordId, defaultApiPage)

      })
      .catch(error => {
        this.getMissionResponse('', defaultApirecordId, defaultApiPage)
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the event to update the hidden data. */
  Updatehiddendata = (c, id) => {
    let username = localStorage.getItem("email");
    let data = {}
    data.mission_id = this.state.missionId
    data.client_id = username
    let hidden_column = this.state.clienthidden
    if (c === "update") {
      data.column_def = { hidden_column: [] }
      data.column_def = { column_order: [] }
      data.column_def.hidden_column = id !== "false" ? id : hidden_column
      data.column_def.column_order = this.state.column_order;

    }
    else {
      data.column_def = {};
      this.setState({ clienthidden: [] })

    }

    api2
      .post("v1/client_config", data)
      .then(resp => {
        if (resp.data.status === 200) {
        }
      })
      .catch(error => {
        console.error(error);
      });
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

      this.setState({ columnDefs: updatedColumnDefs })

      this.setState({
        columnDefs: updatedColumnDefs,
      });
    });
    // this.props.UpdateColumnDef(column_def);

  };

  /* Handles the event to update the hidden column. */
  hideColumn = (colId) => {
    let id = colId.replace("_1", "");
    let column_def = this.state.column_def;

    let clienthidden = this.state.clienthidden
    let column_order = this.state.column_order
    column_order.forEach((c, index) => {
      if (c === id) {
        column_order.splice(index, 1);
      }
    })
    this.setState({ column_order: column_order })
    // hidden_column.push(id)
    if (clienthidden.includes(id)) {
      // clienthidden.pop(id)
      for (var i = 0; i < clienthidden.length; i++) {
        if (clienthidden[i] === id) {
          clienthidden.splice(i, 1);
          break;
        }
      }
    } else {
      clienthidden.push(id)
    }

    // column_def.hidden_column = hidden_column;

    this.setState(
      {
        column_def: column_def,
        // clienthidden:clienthidden
      }, () => { this.doTheThing() });


    this.Updatehiddendata("update", clienthidden)

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

  /* Handles the api to fetch the mission response. */
  getMissionResponse = (Language, record, pagesize) => {
    this.openLoading();
    let id = this.state.missionId
    loadedlistItems = [];
    var self = this;
    let language = ''
    if (Language !== '' && Language !== null && Language !== undefined) {
      language = Language
    }
    let url = "v2/client_survey_report?id=" + this.state.missionId + '&language=' + language + '&record=' + record + '&pagesize=' + pagesize;
    api2
      .get(url)
      .then(resp => {
        this.metricFilter(id);
        this.ConsumerTypeFilter(id);
        // this.getlanguagelist()
        let statusOptions = [];
        let survey_languages = [];
        survey_languages.push({ value: '', label: 'Select a Language' });
        resp.data.survey_languages.forEach((x, i) => {
          survey_languages.push({ value: x, label: x });
        });
        resp.data.status_data.forEach(s => {
          statusOptions.push({ label: s.name, value: s.id });
        });

        self.setState({
          missionResponses: resp.data && resp.data.list ? resp.data.list.filter(x => {
            return x.responses.length > 0;
          }) : [],
          response: true,

          questions: resp.data.questions,
          metrics_row: resp.data.metrics_row,
          // metrics_data: resp.data.metrics_data,
          statusOptions: statusOptions,
          // column_order:resp.data.column_order,
          column_order: this.state.column_def.column_order,
          estimatedTime: resp.data.estimatedTime,
          points: resp.data.points,
          languagelist: survey_languages,
          datapagecount: resp.data.total,
          pagecount: resp.data.total,
          page: 0,
          listItems: []

        }, () => {
          if (Language !== '' && Language !== null && Language !== undefined) {
            this.convert_language_code(Language)
          }
          // else {
          //   this.doTheThing();
          //   this.stopLoading();
          // }
        });
        if (Language === '' || Language === null || Language === undefined) {
          this.doTheThing();
          this.stopLoading();
          this.setState({ selectedlanguage: { label: "Select a Language", value: '' } });
        }


      })
      .catch(error => {
        console.error(error);
        this.stopLoading();

        self.setState({
          response: true
        });
      });
  };

  /* Handles the api to fetch the mission response based on pagesize. */
  getMissionResponsepage = (Language, record, pagesize) => {
    console.log(pagesize)
    console.log('pagesize')
    // this.openLoading();
    // loadedlistItems = [];
    var self = this;
    let language = ''
    if (Language !== '' && Language !== null && Language !== undefined) {
      language = Language
    }
    let url = "v2/client_survey_report?id=" + this.state.missionId + '&language=' + language + '&record=' + record + '&pagesize=' + pagesize;
    api2
      .get(url)
      .then(resp => {
        let temp_missionResponses = resp.data.list.filter(x => {
          return x.responses.length >= 0;
        })

        let missionResponses = this.state.missionResponses.concat(temp_missionResponses)

        self.setState({
          missionResponses: missionResponses,
          missionResponses_temp: resp.data && resp.data.list ? resp.data.list.filter(x => {
            return x.responses.length > 0;
          }) : [],
          datapagecount: resp.data.total,
          response: true,

        }, () => {
          if (Language !== '' && Language !== null && Language !== undefined) {
            this.convert_language_code_page(Language)
          }
        });
        if (Language === '' || Language === null || Language === undefined) {
          this.sepmissonFormatpage();
          this.stopLoading();
          this.setState({ selectedlanguage: { label: "Select a Language", value: '' } });
        }


      })
      .catch(error => {
        console.error(error);
        this.setState({
          listItems: loadedlistItems,
          datapagecount: loadedlistItems.length,
          pagecount: loadedlistItems.length,
          response: true
        }, () => { this.api.resetRowHeights() })
      });
  };

  /* Handles the grid api to update the table. */

  onGridReady = (params) => {
    this.params = params
    this.gridApi = params.api;
    this.api = params.api;
    this.api.resetRowHeights();
    this.columnApi = params.columnApi;

  }

  /* Handles the api to fetch the language list. */
  getlanguagelist() {
    api2
      .get("v2/languages")
      .then(resp => {
        this.setState({ languagecode: resp.data.data });
      })
      .catch((error) => {
        //console.log(error)
      });
  }

  /* Handles the event to update the language. */
  handleLanguageChange = e => {
    if (this.state.languagecode.length > 0) {
      if (e.label !== this.state.selectedlanguage.value) {
        this.getMissionResponse(e.label, defaultApirecordId, defaultApiPage)
      }
      this.setState({
        selectedlanguage: { label: e.label, value: e.value },
        page: 0,
        pagecount: this.state.datapagecount,
        rowsPerPage: this.state.rowsPerPage,
      })
    } else {
      this.getlanguagelist();
      this.ShowNotification("Somthing Went To Wrong , Try Again", "danger");
    }
  };

  /*  Handles the event to validate the language code.*/
  convert_language_code = (Language) => {
    let language_code;
    this.state.languagecode.forEach(c => {
      if (c.name === Language) {
        language_code = c.code;
      }
    })
    // let source = this.state.selectedlanguage.label !== 'English' ? 'en' : ''
    this.translate_mission(language_code)
  }

  /*  Handles the event to validate the language code.*/
  convert_language_code_page = (Language) => {
    let language_code;
    this.state.languagecode.forEach(c => {
      if (c.name === Language) {
        language_code = c.code;
      }
    })
    // let source = this.state.selectedlanguage.label !== 'English' ? 'en' : ''
    this.translate_mission_page(language_code)
  }

  /* Unused function.*/
  decodeStr(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  }

  /*  Handles the event to fetch the initial missions.*/
  translate_mission = async (language_code) => {
    let missionResponses = this.state.missionResponses
    for (let i = 0; i < missionResponses.length; i++) {
      let r = missionResponses[i];
      if (r.responses && r.responses.length > 0) {
        for (let b = 0; b < r.responses.length; b++) {
          let a = r.responses[b];
          if (a.type === 'input' && a.answers && a.answers !== null && a.answers !== ""
            && a.answers != {} && a.answers.text && a.answers.text !== "") {
            let text = a.answers.text;
            let tran_req = await fetch(Constants.google_translate_content_URI
              + "&q=" + text + "&target=" + language_code,

              {
                method: "POST"
              });
            let tran_res = await tran_req.json();
            if (tran_res.data && tran_res.data.translations && tran_res.data.translations[0]) {
              let answ = tran_res.data.translations[0].translatedText;
              let missionResponses = this.state.missionResponses
              missionResponses = missionResponses[i].responses[b].answers.text = entities.decode(answ);
              this.setState({ missionResponses: missionResponses })
            }
          }
          else if (a.type === "barcode" && a.answers && a.answers !== null && a.answers !== ""
            && a.answers != {} && a.answers.product_name && a.answers.product_name !== "") {
            let text = a.answers.product_name;
            // console.log(text)
            let tran_req = await fetch(Constants.google_translate_content_URI
              + "&q=" + text + "&target=" + language_code,

              {
                method: "POST"
              });
            let tran_res = await tran_req.json();
            if (tran_res.data && tran_res.data.translations && tran_res.data.translations[0]) {
              let answ = tran_res.data.translations[0].translatedText;
              // console.log(answ)
              let missionResponses = this.state.missionResponses
              missionResponses[i].responses[b].answers.product_name = entities.decode(answ);
              this.setState({ missionResponses: missionResponses })
            }

          }
        }
      }
      if (this.state.missionResponses.length > 0 && i === (this.state.missionResponses.length - 1)) {
        this.doTheThing();
        this.stopLoading();
      }
    }
  }

  /*  Handles the event to fetch all the missions.*/
  translate_mission_page = async (language_code) => {
    let missionResponses = this.state.missionResponses_temp
    for (let i = 0; i < missionResponses.length; i++) {
      let r = missionResponses[i];
      if (r.responses && r.responses.length > 0) {
        for (let b = 0; b < r.responses.length; b++) {
          let a = r.responses[b];
          if (a.type === 'input' && a.answers && a.answers !== null && a.answers !== ""
            && a.answers != {} && a.answers.text && a.answers.text !== "") {
            let text = a.answers.text;
            let tran_req = await fetch(Constants.google_translate_content_URI
              + "&q=" + text + "&target=" + language_code,

              {
                method: "POST"
              });
            let tran_res = await tran_req.json();
            if (tran_res.data && tran_res.data.translations && tran_res.data.translations[0]) {
              let answ = tran_res.data.translations[0].translatedText;
              let missionResponses_temp = this.state.missionResponses_temp
              missionResponses_temp[i].responses[b].answers.text = entities.decode(answ);
              this.setState({ missionResponses_temp: missionResponses_temp })
            }
          }
          else if (a.type === "barcode" && a.answers && a.answers !== null && a.answers !== ""
            && a.answers != {} && a.answers.product_name && a.answers.product_name !== "") {
            let text = a.answers.product_name;
            // console.log(text)
            let tran_req = await fetch(Constants.google_translate_content_URI
              + "&q=" + text + "&target=" + language_code,

              {
                method: "POST"
              });
            let tran_res = await tran_req.json();
            if (tran_res.data && tran_res.data.translations && tran_res.data.translations[0]) {
              let answ = tran_res.data.translations[0].translatedText;
              let missionResponses_temp = this.state.missionResponses_temp
              missionResponses_temp[i].responses[b].answers.product_name = entities.decode(answ)
              // console.log(answ)
              this.setState({
                missionResponses_temp: missionResponses_temp
              })
            }

          }
        }
      }
      if (this.state.missionResponses_temp.length > 0 && i === (this.state.missionResponses_temp.length - 1)) {
        this.sepmissonFormatpage();
        // this.stopLoading();
      }
    }
  }

  /*  Handles the event to design the column header and column definition.*/
  doTheThing = () => {

    let column = [

      {
        headerName: "Action",
        field: "preview",
        lockPosition: true,
        type: "preview",
        //width: 120,
        autoHeight: true,
        cellRenderer: "previewButton",
        hidecolumn: "none",
        headerTooltip: "Action",
      },
      {
        headerName: "Customer ID",
        field: "customer_id",
        type: "g",
        editable: false,
        //width: 120,
        lockPosition: true,
        hidecolumn: "none",
        headerTooltip: "Customer ID",
      },
      {
        headerName: "Consumer Type",
        field: "consumerType",
        type: "g",
        editable: false,
        //width: 120,
        lockPosition: true,
        filter: "customFilter",
        hidecolumn: "none",
        headerTooltip: "Consumer Type",
      }

    ];

    let columns = [];

    column.forEach((c, index) => {
      if (!this.state.column_def.hidden_column.includes(c.field)) {
        if (this.state.clienthidden.includes(c.field)) {
          c.hidecolumn = 'active'
          columns.push(c);
        }
        else {
          columns.push(c);
        }
      }
    })

    this.state.questions.forEach(q => {
      let qe = {};
      let headerName = q.title;
      let field = "q" + q.question_id;
      qe.hidecolumn = "none"
      if (q.loop_set && q.loop_set != null && q.loop_set > 0) {
        headerName = q.title + '_' + q.loop_set.toString() + '_' + q.loop_number.toString();
        field = q.loop_set.toString() + '-' + q.loop_number.toString() + "-q" + q.question_id;
        qe.loop_set = q.loop_set;
        qe.loop_number = q.loop_number;
        qe.loop_triggered_qid = q.loop_triggered_qid;
      }
      qe.headerTooltip = headerName;
      if (q.type === 'barcode') {
        if (!this.state.column_def.hidden_column.includes(field + '-B_oimage')) {
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"
          let barcode = cloneDeep(qe);
          barcode.field = qe.field + '-B_oimage';
          barcode.cellRenderer = "barcoderenderer";
          barcode.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(barcode.field)) {
            barcode.hidecolumn = "active"
          }
          columns.push(barcode);
        }
        if (!this.state.column_def.hidden_column.includes(field + '-B_image')) {
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"

          let barcode = cloneDeep(qe);
          barcode.field = qe.field + '-B_image';
          barcode.cellRenderer = "barcoderenderer";
          barcode.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(barcode.field)) {
            barcode.hidecolumn = "active"
          }
          columns.push(barcode);
        }
        if (!this.state.column_def.hidden_column.includes(field + '-B_number')) {
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"
          let barcode = cloneDeep(qe);
          barcode.field = qe.field + '-B_number';
          barcode.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(barcode.field)) {
            barcode.hidecolumn = "active"
          }
          columns.push(barcode);

        }

        if (!this.state.column_def.hidden_column.includes(field + '-B_details')) {

          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"

          qe.field = qe.field + '-B_details'
          qe.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(qe.field)) {
            qe.hidecolumn = "active"
          }
          columns.push(qe);
        }

      }
      else if (q.type === 'capture') {
        if (!this.state.column_def.hidden_column.includes(field + '-C_oimage')) {
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"
          let img = cloneDeep(qe);
          img.field = qe.field + '-C_oimage';
          img.cellRenderer = "barcoderenderer";
          img.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(img.field)) {
            img.hidecolumn = "active"
          }
          columns.push(img);
        }
        if (!this.state.column_def.hidden_column.includes(field)) {
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"
          let img = cloneDeep(qe);
          img.cellRenderer = "barcoderenderer";
          img.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(img.field)) {
            img.hidecolumn = "active"
          }
          columns.push(img);
        }
        if (q.question.properties.instruction_enabled && q.question.properties.instruction_enabled === 1) {
          if (!this.state.column_def.hidden_column.includes(field + '-C_instext')) {
            qe.headerName = headerName;
            qe.field = field;
            qe.type = "q";
            qe.id = q.question_id;
            qe.autoHeight = true;
            qe.queType = q.type;
            qe.survey_tag_id = "survey_tag"
            let img = cloneDeep(qe);
            img.field = qe.field + '-C_instext';
            img.cellStyle = {
              'white-space': 'normal'
            }
            if (this.state.clienthidden.includes(img.field)) {
              img.hidecolumn = "active"
            }
            columns.push(img);
          }
        }
        if (q.question.properties.scale_enabled && q.question.properties.scale_enabled === 1) {
          if (!this.state.column_def.hidden_column.includes(field + '-C_scale')) {
            qe.headerName = headerName;
            qe.field = field;
            qe.type = "q";
            qe.id = q.question_id;
            qe.autoHeight = true;
            qe.queType = q.type;
            qe.survey_tag_id = "survey_tag"
            let img = cloneDeep(qe);
            img.field = qe.field + '-C_scale';
            img.cellRenderer = "createImageSpan";
            img.cellStyle = {
              'white-space': 'normal'
            }
            if (this.state.clienthidden.includes(img.field)) {
              img.hidecolumn = "active"
            }
            columns.push(img);
          }
        }
      }
      else if (q.type === 'upload' && q.question.properties.media_type === 'image') {
        if (!this.state.column_def.hidden_column.includes(field + '-U_oimage')) {
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"
          let img = cloneDeep(qe);
          img.field = qe.field + '-U_oimage';
          img.cellRenderer = "barcoderenderer";
          img.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(img.field)) {
            img.hidecolumn = "active"
          }
          columns.push(img);
        }
        if (!this.state.column_def.hidden_column.includes(field)) {
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"
          qe.cellRenderer = "barcoderenderer";
          qe.cellStyle = {
            'white-space': 'normal'
          }
          if (this.state.clienthidden.includes(qe.field)) {
            qe.hidecolumn = "active"
          }
          columns.push(qe);
        }

      }
      else {
        if (!this.state.column_def.hidden_column.includes(field)) {
          if (this.state.clienthidden.includes(field)) {
            qe.hidecolumn = "active"
          }
          qe.headerName = headerName;
          qe.field = field;
          qe.type = "q";
          qe.id = q.question_id;
          qe.autoHeight = true;
          qe.queType = q.type;
          qe.survey_tag_id = "survey_tag"

          if (q.type === 'scale' || q.type === 'choice') {
            qe.cellRenderer = "createImageSpan";
            qe.filter = "customFilter";
          }
          else if (q.question.properties.media_type === 'video' || q.question.properties.media_type === 'audio') {
            qe.cellRenderer = "createVideoSpan";
            qe.mediaType = q.question.properties.media_type;
            qe.width = 300;
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
          columns.push(qe);

        }
      }

    });

    // Add Metrics to the Table Header 
    this.state.metrics_row.forEach(m => {
      let qe = {};
      qe.hidecolumn = "none"
      if (this.state.column_def.hidden_column.includes("m" + m.id)) {
        //leave the column
      }
      else {
        qe.headerName = m.row_name;
        qe.headerTooltip = m.row_name;
        qe.field = "m" + m.id;
        qe.type = "m";
        qe.id = m.id;
        qe.autoHeight = true;
        //qe.editable = true;
        qe.cellStyle = {
          'white-space': 'normal'
        }
        qe.filter = "customFilter";
        if (this.state.clienthidden.includes(qe.field)) {
          qe.hidecolumn = "active"
        }
      }

      if (Object.keys(qe).length > 0) {
        columns.push(qe);
      }
    });


    let newdef = [

      {
        headerName: "Estimated Time in Minutes",
        field: "estimatedTime",
        type: "g",
        editable: false,
        hidecolumn: "none",
        headerTooltip: "Estimated Time in Minutes",
        //width: 100
      },
      {
        headerName: "Actual Time in Minutes",
        field: "actualTime",
        type: "g",
        editable: false,
        hidecolumn: "none",
        headerTooltip: "Actual Time in Minutes",
        //width: 100
      },
      {
        headerName: "Email", field: "email", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        },
        hidecolumn: "none",
        headerTooltip: "Email"
      },
      {
        headerName: "Contact", field: "mobile", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        },
        hidecolumn: "none",
        headerTooltip: "Contact"
      },
      {
        headerName: "Address", field: "address", type: "g", editable: false, autoHeight: true, cellStyle: {
          'white-space': 'normal'
        },
        hidecolumn: "none",
        headerTooltip: "Address"
      },
      {
        headerName: "Mobile Details", field: "device", type: "g", editable: false, autoHeight: true, cellStyle: {
          'white-space': 'normal'
        },
        hidecolumn: "none",
        headerTooltip: "Mobile Details",
      },
      {
        headerName: "Points",
        field: "points",
        type: "g",
        editable: false,
        hidecolumn: "none",
        headerTooltip: "Points"
        //width: 100
      },
      {
        headerName: "Last Accessed Time",
        field: "surveyTagUpdated",
        type: "g",
        editable: false,
        hidecolumn: "none",
        headerTooltip: "Last Accessed Time",
      }


    ]
    let columnDe = [];

    newdef.forEach((c, index) => {

      if (!this.state.column_def.hidden_column.includes(c.field)) {
        if (this.state.clienthidden.includes(c.field)) {
          c.hidecolumn = 'active'
          columnDe.push(c);
        }
        else {
          columnDe.push(c);
        }
      }

    })
    let columnDefs = columns.concat(columnDe)

    this.setState({ Updatecolumndef: columnDefs })

    this.UpdateColumnDef(columnDefs);

  }

  /* Handles the event to update the column definition of table. */
  UpdateColumnDef = (coldef) => {
    let columnDefs = coldef
    let updatedColumnDefs = [];
    if (this.state.column_order) {

      for (let j = 0; j < this.state.column_order.length; j++) {
        for (let i = 0; i < columnDefs.length; i++) {
          if (columnDefs[i].field === this.state.column_order[j]) {
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

  /*  Handles the event to form initial missions data.*/
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

  /*  Handles the event to match initial mission data with column definition.*/
  doTableData = sepMission => {
    let listItems = [];

    sepMission.forEach((missionResponse, index) => {
      let temp = (this.formatData(missionResponse));
      temp.column_index = index;
      listItems.push(temp);
    });

    loadedlistItems = listItems;
    this.setState({
      listItems: listItems,
      sepMission: sepMission
    })
    if (this.state.datapagecount > listItems.length && sepMission.length > 0) {
      let id = sepMission[0].survey_tag_id
      this.getMissionResponsepage(this.state.selectedlanguage.value, id, defaultApiPage)
    }


  };

  /*  Handles the event to form missions data.*/
  sepmissonFormatpage = () => {
    let sepMission = [];
    let survey_tag_id = Number;
    let metrics_data = []

    this.state.missionResponses_temp.forEach(missResp => {
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
    // this.state.metrics_data = metrics_data
    this.doTableDatapage(sepMission);
  };

  /*  Handles the event to match mission data with column definition.*/
  doTableDatapage = sepMission => {
    let listItems = [];

    sepMission.forEach((missionResponse, index) => {
      let temp = (this.formatData(missionResponse));
      temp.column_index = index;
      listItems.push(temp);
    });

    let loadlistItems = loadedlistItems.concat(listItems);
    loadedlistItems = loadlistItems;
    if (this.state.datapagecount > loadedlistItems.length && sepMission.length > 0) {
      let id = sepMission[0].survey_tag_id
      this.getMissionResponsepage(this.state.selectedlanguage.value, id, defaultApiPage, null)
    } else {
      this.setState({
        listItems: loadedlistItems,
        datapagecount: loadedlistItems.length
      }, () => { this.api.resetRowHeights() })

    }

  };

  /*  Handles the event to form missions data based on question type.*/
  formatData = missionResponse => {
    let arr = {};

    this.state.columnDefs.forEach(c => {
      if (this.state.clienthidden.includes(c.field)) {
        arr[c.field] = ""
      }
      else {
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
              arr[c.field] = [0, ans.answers.image_orig ? ans.answers.image_orig + '?thumbnail=yes' : ans.answers.image + '?thumbnail=yes', ans.answers.image_orig ? ans.answers.image_orig : ans.answers.image]
            }
            else if (c.field.includes('-B_image')) {
              if (ans.answers.hide === 1) {
                arr[c.field] = []
              } else {
                arr[c.field] = [0, ans.answers.image + '?thumbnail=yes', ans.answers.image]
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
              arr[c.field] = [0, ans.answers.image_orig ? (ans.answers.image_orig + '?thumbnail=yes') : (ans.answers.media + '?thumbnail=yes'), ans.answers.image_orig ? ans.answers.image_orig : ans.answers.media]
            }
            else {
              if (ans.answers.hide === 1) {
                arr[c.field] = []
              } else {
                arr[c.field] = [0, ans.answers.media + '?thumbnail=yes', ans.answers.media]
              }
            }
          }
          else if (ans != {} && ans.type && ans.type === 'capture' && ans.answers && ans.answers.image) {
            if (c.field.includes('-C_oimage')) {
              arr[c.field] = [0, ans.answers.image_orig ? (ans.answers.image_orig + '?thumbnail=yes') : (ans.answers.image + '?thumbnail=yes'), ans.answers.image_orig ? ans.answers.image_orig : ans.answers.image];
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
                arr[c.field] = [0, ans.answers.image + '?thumbnail=yes', ans.answers.image];
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
        } else if (c.type === "m") {
          arr[c.field] = this.getMissionMetric(
            missionResponse.survey_tag_id,
            c.id
          );
        }
      };
    })

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

        a.answers.selected_option.forEach(as => q.options.forEach(o => {
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

        a.answers.selected_option.forEach(as => q.options.forEach(o => {
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
      if (prop[prop.length - 1] && prop[prop.length - 1] !== undefined && (prop[prop.length - 1] === "audio" || prop[prop.length - 1] === "video")) {


        if (prop[prop.length - 1] && prop[prop.length - 1] !== undefined && prop[prop.length - 1] === "audio") {
          return (

            <audio controls preload='none' controlsList={"nodownload"} src={prop[prop.length - 2]} />
          )
        } else {
          return (
            <video height="150" width="200" controls disablePictureInPicture="true" preload='metadata' controlslist={"nodownload"} src={prop[prop.length - 2] + '#t=0.2'} />
          )
        }
      }

      else if (prop[prop.length - 1] !== "audio" || prop[prop.length - 1] !== "video") {

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
            <div style={textImages.length > 0 ? { width: "50px", height: "50px" } : {}}>
              <Gallery
                style={{ width: "100%" }}
                enableImageSelection={false}
                images={textImages}
                rowHeight={50}
                maxRows={2}
                enableLightbox={true}
              />
            </div>
          </div>
        );
      }
    }
    else {
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
    let hidden_column = this.state.clienthidden;
    let colDef = this.state.columnDefs
    params.processCellCallback = function (params) {
      if (params.column.colDef.queType && (params.column.colDef.queType === "scale" || params.column.colDef.queType === "choice")) {
        if (params.value && params.value.length > 0) {
          return params.value[0];
        }
        else {
          return params.value;
        }
      }
      else if (params.column.colDef.queType && (params.column.colDef.queType === "barcode" || params.column.colDef.queType === "upload"
        || params.column.colDef.queType === "capture")) {
        if (params.value && params.value.length > 0 && Array.isArray(params.value)) {
          if (params.column.colDef.mediaType && (params.column.colDef.mediaType === 'video' || params.column.colDef.mediaType === 'audio')) {
            return params.value[0];
          }
          else {
            // params.value[params.value.length - 1] = params.value[params.value.length - 1].replace('?thumbnail=yes', '');
            // return params.value;
            params.value[params.value.length - 1] = params.value[params.value.length - 1].replace('?thumbnail=yes', '');
            let linkData = params.value[params.value.length - 1]
            let linkPart = linkData.split("/");
            if (linkPart && linkPart.length > 0) {
              let tempPath = linkPart[linkPart.length - 1]
              let finalPath = `https://reporting.flexicollect.com/flexicollect/Flexiviewer.php?Photo=${tempPath}&src=Flex`
              return finalPath;
            }
          }
        }
        else {
          return params.value;
        }
      }
      else {
        return params.value;
      }
    };
    let columnKeys = [];
    colDef.forEach(c => {
      if ((c.field !== "preview") && (!hidden_column.includes(c.field))) {
        columnKeys.push(c.field)
      }
    })
    params.columnKeys = columnKeys;

    let missionName = this.state.selectedMission ? this.state.selectedMission.label : ""
    params.fileName = missionName;
    this.api.exportDataAsCsv(params);
  };

  /* Handles the open event of loading symbol. */
  openLoading = () => {
    this.setState({ loading: true });
  };

  /* Handles the close event of loading symbol. */
  stopLoading = () => {
    this.setState({ loading: false });
  };

  /* Handles the close event of loading symbol. */
  handleClose = () => {
    this.setState({ loading: false });
  };

  /* Handles the open event of preview mission. */
  previewMission = index => event => {
    let previewMission = Object.values(this.state.data[index]);
    this.setState({ preview: true, previewMission: previewMission });
  };

  /* Handles the close event of preview mission. */
  closePreview = () => {
    this.setState({
      preview: false,
      page: 0,
      pagecount: this.state.datapagecount,
      rowsPerPage: this.state.rowsPerPage,
    });
  };

  /* Handles the format of data for preview mission. */
  buildPreview = () => {
    let previewMissionvalues = Object.values(this.state.previewMission)
    let previewMissionkeys = Object.keys(this.state.previewMission)
    let list = [];
    this.state.columnDefs.forEach(c => {
      previewMissionkeys.forEach((k, index) => {
        if (c.headerName !== 'Action' && c.field === k) {
          list.push(
            <Fragment key={index}>
              <Grid container alignItems="center">
                <Typography gutterBottom variant="h6" style={{ marginLeft: 20, fontSize: 12, fontWeight: 600 }}>
                  &bull; {c.headerName}
                </Typography>
              </Grid>
              <Grid container alignItems="center" style={{ paddingLeft: 40, fontSize: 12 }}>
                {this.renderText(previewMissionvalues[index])}
              </Grid>
              <Divider variant="middle" />
            </Fragment>
          );
        }
      })
    })
    return list;
  };

  /* Function hook from parent component. */
  methodFromParent(cell) {
    this.setState({
      preview: true,
      previewMission: cell.data,
      page: 0,
      pagecount: this.state.datapagecount,
      rowsPerPage: this.state.rowsPerPage,
    });
  }

  /* Handles the event to filter the data. */
  onFilterChangedGrid = (params) => {
    let getFilterModel = params.api.getFilterModel();
    let isAnyFilterPresent = this.api.isAnyFilterPresent();
    let currentpage = this.api.paginationGetCurrentPage();
    let RowCount = this.api.paginationGetRowCount()
    let colDef = this.state.columnDefs;
    let activemenu = [];
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
    /*colDef.forEach(c => {
          if ((getFilterModel[c.field] !== undefined && getFilterModel[c.field].value && getFilterModel[c.field].value.length > 0)
            || (getFilterModel[c.field].filter && getFilterModel[c.field].filter !== undefined)) {
            activemenu.push(c.field)
          }
          else {
            if ((getFilterModel[c.field + "_1"] !== undefined && (getFilterModel[c.field + "_1"].value && getFilterModel[c.field + "_1"].value.length > 0))
              || (getFilterModel[c.field + "_1"].filter && getFilterModel[c.field + "_1"].filter !== undefined)) {
              activemenu.push(c.field + "_1")
            }
          }
        })*/

    //Changing the above to the below to match the format of same code block in the Admin Mission Response screen
    //This is due to an error that occurs when filtering on a client view
    //Hopefully replacing the forEach with map will resolve the issue

    colDef.map(c => {
      if (getFilterModel[c.field] !== undefined) {
        if ((getFilterModel[c.field].value && getFilterModel[c.field].value.length > 0)
          || (getFilterModel[c.field].filter && getFilterModel[c.field].filter !== undefined)) {
          activemenu.push(c.field)
        }
      }
      return 0;
    })
    this.setState({
      activefiltermenu: activemenu
    }, () => { this.api.refreshHeader(); })


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
            this.api.resetRowHeights()
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

  render() {

    let body_class = this.props.fullWidth
      ? "body-form body-form-expanded"
      : "body-form body-form-collapsed";
    const { classes } = this.props;
    const { msgColor, br, message, page, pagecount, rowsPerPage } = this.state;
    return (
      <div className={body_class} >
        <div className={classes.gridHeader} style={{ width: "100%", marginLeft: "10%" }}>
          <Grid container alignItems="center">


            <div style={{ width: "20%" }}>

              <GridItem style={{ textAlign: "end" }}>
                <Typography variant="h6"

                  style={{
                    fontSize: "16px",
                    float: "left",
                    minWidth: "85px",
                    marginRight: "15px",
                    lineHeight: "42px"
                  }}
                >Project</Typography>
              </GridItem>

              <GridItem
                style={{
                  minWidth: 150
                }}>
                <Select style={{ fontSize: "12px" }}
                  options={this.state.projects}
                  onChange={this.handleProjectChange}
                />
              </GridItem>
            </div>

            <div style={{ width: "20%" }}>
              <GridItem style={{ textAlign: "end" }}>
                <Typography variant="h6"
                  style={{
                    fontSize: "16px",
                    float: "left",
                    minWidth: "85px",
                    marginRight: "15px",
                    lineHeight: "42px"
                  }}
                >Mission</Typography>
              </GridItem>

              <GridItem style={{
                minWidth: 150
              }}>
                <Select style={{ fontSize: "12px" }}
                  value={this.state.selectedMission}
                  options={this.state.missions}
                  onChange={this.handleMissionChange}
                />
              </GridItem>
            </div>
            <div style={{ width: "11%", marginLeft: "3%" }}>
              <GridItem>
                <Select
                  isDisabled={this.state.missionResponses.length < 1}
                  style={{ fontSize: "12px" }}
                  options={this.state.languagelist}
                  value={this.state.selectedlanguage}
                  defaultValue={{ label: "Select a Language", value: '' }}
                  onChange={this.handleLanguageChange}
                />

              </GridItem>
            </div>
            <div style={{
              width: "20%",
              textAlign: "right"
            }}>
              <GridItem>
                <Button
                  style={{
                    // margin: "0px 10px",
                    marginRight: "50px",
                    fontSize: "12px"
                  }}
                  variant="contained"
                  color="primary"
                  onClick={this.Restore}
                  disabled={this.state.missionResponses.length === 0}
                >
                  Restore Columns
                </Button>
              </GridItem>
            </div>
            {this.state.missionResponses.length > 0 ? (
              <div style={{
                width: "20%",
                textAlign: "right"
              }}>
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
                    disabled={this.state.missionResponses.length === 0 || this.state.listItems.length < loadedlistItems.length}
                  >
                    Export
                  </Button>
                </GridItem>
              </div>) : ("")
            }

          </Grid>
        </div>
        {
          this.state.missionResponses.length > 0 ? (
            <Fragment>
              <MuiThemeProvider theme={theme}>

                <div className="listbox" style={{ height: "calc(100% - 56px)", width: "100%" }}>
                  {this.state.preview ? (
                    <Fragment style={{ height: "100%" }}>
                      <GridContainer style={{ height: "100%" }}>
                        <GridItem xs={6} sm={6} md={6} style={{ height: "100%" }}>
                          <Card style={{ height: "100%", marginBottom: "0px", marginTop: "0px" }}>
                            <h1 style={{ padding: "10px 20px", fontSize: 14, fontWeight: 600 }}>
                              PREVIEW
                              <Button
                                style={{
                                  margin: "0px 0px",
                                  float: "right",
                                  padding: "4px 8px",
                                  fontSize: 10
                                }}
                                variant="contained"
                                color="primary"
                                onClick={this.closePreview}
                              >
                                Close
                              </Button>
                            </h1>

                            <List component="nav" style={{ overflowY: "auto" }}>{this.buildPreview()}</List>
                          </Card>
                        </GridItem>
                        <GridItem xs={6} sm={6} md={6} style={{ height: "100%" }}>
                          <div style={{
                            height: "93%",
                            width: "100%",
                          }}
                          >
                            <div className="ag-theme-balham"
                              style={{
                                height: "100%"
                              }}>
                              <AgGridReact
                                // listening for events
                                // onFirstDataRendered={this.onGridReady}
                                onGridReady={this.onGridReady}
                                onRowSelected={this.onRowSelected}
                                onCellClicked={this.onCellClicked}
                                onModelUpdated={this.calculateRowCount}
                                onColumnMoved={this.columnMoved}
                                rowHeight={50}
                                onColumnResized={this.onColumnResized}
                                rowData={this.state.listItems}
                                onRowDataChanged={this.onGridReady}
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
                                pagination={true}
                                paginationPageSize={rowsPerPage}
                                onFilterChanged={this.onFilterChangedGrid}
                                suppressPaginationPanel={true}
                                onColumnDelete={this.deleteColumn}
                                onColumnHide={this.hideColumn}
                                filteredMetricList={this.state.filteredMetricList}
                                filteredconsumertype={this.state.filteredconsumertype}
                                questions={this.state.questions}
                                activefiltermenu={this.state.activefiltermenu}
                                enableBrowserTooltips={true}
                                gridOptions={{ suppressHorizontalScroll: false}}
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
                                </b> </div>
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
                                  // onChangeRowsPerPage={this.handleChangeRowsPerPage}
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
                        </GridItem>
                      </GridContainer>
                    </Fragment>
                  ) : (
                    <div style={{
                      height: "93%",
                      width: "100%",
                    }}
                    >
                      <div className="ag-theme-balham"
                        style={{
                          height: "100%"
                        }}>

                        <AgGridReact
                          // listening for events
                          onGridReady={this.onGridReady}
                          // onFirstDataRendered={this.onGridReady}
                          onRowSelected={this.onRowSelected}
                          onCellClicked={this.onCellClicked}
                          onModelUpdated={this.calculateRowCount}
                          onColumnMoved={this.columnMoved}
                          rowHeight={50}
                          onColumnResized={this.onColumnResized}
                          rowData={this.state.listItems}
                          onRowDataChanged={this.onGridReady}
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
                          activefiltermenu={this.state.activefiltermenu}
                          pagination={true}
                          paginationPageSize={rowsPerPage}
                          onFilterChanged={this.onFilterChangedGrid}
                          suppressPaginationPanel={true}
                          enableBrowserTooltips={true}
                          gridOptions={{ suppressHorizontalScroll: false}}
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
                          </b> </div>
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
                  )}
                </div>
              </MuiThemeProvider>
            </Fragment>
          ) : (<Typography variant="h5">No Responses!</Typography>)
        }
        <Loading open={this.state.loading} onClose={this.handleClose} />
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
        <Snackbar
          place="br"
          color={msgColor}
          open={br}
          message={message}
          closeNotification={() => this.setState({ br: false })}
          close
        />
      </div>
    )
  }
}
export default withStyles(styles)(ViewClientScreen)


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
              height="25"
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
      value: props.value && props.value[0] ? props.value[0] : "",
      type: props.value && props.value[1] ? props.value[1] : ""
    };

  }
  render() {

    return (
      <div>
        {this.state.value !== "" && (this.state.type === 'video' || this.state.type === 'audio') ? <a href={this.state.value} download
          style={{
            float: "left", width: "20px", marginTop: 5, marginBottom: 5
          }}
        ><p><i className="fas fa-download"></i></p></a> : ""}

        {this.state.value !== "" && this.state.type === 'video' ?
          (<video width="250" height="150" controls preload='metadata' controlslist="nodownload" disablePictureInPicture='true'
            style={{
              minHeight: "150px",
              minWidth: "250px",
              marginTop: 5,
              marginBottom: 5,
              justifyContent: 'center',
              alignSelf: 'center',
              float: "right"
            }}>
            <source src={this.state.value + '#t=0.2'} />
          </video>
          )
          :
          (this.state.value !== "" && this.state.type === 'audio' ?
            <audio
              style={{
                width: "-webkit-fill-available",
                marginTop: 5,
                marginBottom: 5,
                justifyContent: 'center',
                alignSelf: 'center',
                float: "right"
              }}
              controls preload='none' controlslist="nodownload" src={this.state.value} />
            : "")
        }

      </div>
    );
  }
}