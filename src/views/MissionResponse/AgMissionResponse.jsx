
/**
 * AgMissionResponse component.
 * 
 * This component is used to manage the mission responses.
 *
 */

import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";

/* Material UI. */
import { Dialog, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import PerfectScrollbar from 'react-perfect-scrollbar';
import Modal from "@material-ui/core/Modal";


/* Bootstrap 1.0 */
import { Form } from "react-bootstrap";

/* Type and select. */
import Select from "react-select";

/* Custom components. */
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Snackbar from "components/Snackbar/Snackbar.jsx";

/* API. */
import api2 from "../../helpers/api2";

/* Table image gallery. */
import Gallery from "react-grid-gallery";

/* CSS */
import "./AgMissionResponse.css";

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import PreviewButton from "./PreviewButton";
import PhotoEditor from "./Imageeditor.jsx";
import CustomHeader from "../../components/CustomHeader/CustomHeader";


import ModalPopUp from "../../components/EditAnswer/ModalPopUp";

import Loading from "components/Loading/Loading.jsx";

import CreateStatusSpan from "./StatusSpan";
import CheckboxRenderer from "./CheckboxRenderer";
import CustomFilter from "./CustomFilter";

import ImageCellRenderer from '../../components/ImageCellRenderer/ImageCellRenderer';
import PaymentPage from "./PaymentPage";
import PayButton from "./PayButton";
import PaymentViewPage from "./PaymentViewPage";
import * as Constants from "../../helpers/constants.jsx";
import cloneDeep from 'lodash/cloneDeep';

import TablePagination from "@material-ui/core/TablePagination";

import noun_DuplicateImage from "../../../src/assets/img/noun_DuplicateImage.png";


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
  paymentpaper: {
    position: "absolute",
    maxWidth: theme.spacing.unit * 75,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing.unit * 4,
    padding: "15px 25px 0px 25px",
    borderRadius: "15px",
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

const customComparator = (valueA, valueB) => {
  if (valueA || valueB) {
    if (typeof valueA !== "object" && typeof valueB !== "object") {
      if (typeof valueA !== "number" && typeof valueB !== "number") {
        return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      }
      else {
        return valueA - valueB;
      }
    }
    else {
      return valueA[0] - valueB[0];
    }
  }
};
class AgMissionResponse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.Editor = React.createRef();
    this.state = {
      view: "grid",
      addColName: "",
      missionId: null,
      project_id: null,
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
      preview: false,
      previewMission: {},
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
      quickFilterText: '',
      column_order: {},

      sideBar: false,
      // params.node.data.status

      rowData: [],
      rowClassRules: {},

      context: { componentParent: this },

      frameworkComponents: {
        previewButton: PreviewButton,
        createImageSpan: CreateImageSpan,
        createVideoSpan: CreateVideoSpan,
        agColumnHeader: CustomHeader,
        customFilter: CustomFilter,
        barcoderenderer: ImageCellRenderer,
        payButton: PayButton
      },

      openModal: false,
      openPopup: false,
      openrestore: false,

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

      imageColumn: [],
      imageRow: [],
      imageEdit: {},
      imageData: {},

      Createclientscreen: false,
      clientscreendata: {},
      client_response: false,
      clientscreenconfig: false,
      selectedproj: '',
      filteredMetricList: [],
      pay: false,
      paymentEnableDetails: "",
      paymentEnabled: "",
      paymentCurrency: "",
      paymentAmount: "",
      selectedPaymentDetails: "",
      paymentMissionName: "",
      paymentProjName: "",
      viewPaydetails: false,
      FilterRowData: [],
      selectedlanguage: '',
      page: 0,
      loadpage: [0],
      pagecount: 0,
      datapagecount: 0,
      rowsPerPage: 50,
      record: 0,
      metrics_data: [],
      listItems: [],
      missionResponses_temp: [],
      activefiltermenu: [],
      languagecode: [],
      isAddColumnPopupOpen: false,
      backupphotos: null,
      backupphotosupdate: false,
      apikey: 1
    };
    this.ShowNotification = this.ShowNotification.bind(this);
    this.updateRowData = this.updateRowData.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    this.finaldata = this.finaldata.bind(this);
    this.paymentViewDetails = this.paymentViewDetails.bind(this);
  }

  componentDidMount() {
    this.getProjectList();
    this.getDepartmentList();
    this.getClientList();
    this.getlanguagelist();
  }

  /* Handle the close event of payment popup. */
  finaldata = () => {
    this.setState({ pay: false });
  }

  /* Handle the open event of payment popup from PayButton component. */
  methodFromParentPay(cell) {
    this.setState({
      pay: true,
      selectedPaymentDetails: cell
    });
  }

  /* Handle the grid api to update the row data when changes occur in mission table. */
  getAllRows = () => {
    let rowData = [];
    this.api.forEachNodeAfterFilter(node => rowData.push(node.data));
    this.setState({
      FilterRowData: rowData
    })
  }

  /* Handles the api to fetch and update the client list. */
  getClientList() {
    var self = this;
    api2
      .get("client")
      .then(resp => {
        let client = [];
        resp.data.forEach((x, i) => {
          client.push({ value: i, label: x.clientName });
        });

        self.setState({
          clients: client,
          filteredClients: resp.data,
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

  /* Handles the api to fetch and update the department list. */
  getDepartmentList() {
    var self = this;

    api2
      .get("department")
      .then(resp => {
        let dept = [];
        resp.data.forEach((x, i) => {
          dept.push({ value: i, label: x.departmentName });
        });
        self.setState({
          departments: dept,
          filteredDepartments: resp.data,
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

  /* Handles the api to fetch and update the project list. */
  getProjectList() {
    var self = this;
    // var self = this;
    api2
      .get("projects/projectList")
      .then(resp => {
        let proj = [];
        resp.data.forEach((x, i) => {
          proj.push({ value: x.id, label: x.project_name });
        });
        self.setState({
          projects: proj
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
    // api2
    //   .get("projects")
    //   .then(resp => {
    //     let proj = [];
    //     resp.data.forEach((x, i) => {
    //       proj.push({ value: i, label: x.project_name });
    //     });
    //     self.setState({
    //       projectSource: resp.data,
    //       projects: proj
    //     }, () => this.SelectedProject());
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     self.setState({
    //       response: true
    //     });
    //   });
  }

  /* Handles the event when the input value changes. */
  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  };


  /* Handles this function to update the selected project. */
  SelectedProject = () => {
    if (this.props.location.state && this.props.location.state.detail) {
      let selectedproject = {};
      let selectedMission = {};
      let miss = [];
      selectedproject.value = this.props.location.state.detail.project_id;
      selectedproject.label = this.props.location.state.detail.project_name;
      selectedMission.value = this.props.location.state.detail.mission_id;
      selectedMission.label = this.props.location.state.detail.mission_name;
      this.setState({ selectedproj: selectedproject, selectedMission: selectedMission, missionId: this.props.location.state.detail.mission_id })
      for (let j = 0; j < this.state.projectSource.length; j++) {
        if (this.state.projectSource[j].id === this.props.location.state.detail.project_id) {
          this.state.projectSource[j].mission_list.forEach((x, i) => {
            miss.push({ value: x.id, label: x.mission_name });
          });
          break;
        }
      }

      this.setState({
        clientscreendata: {
          ...this.state.clientscreendata,
          project_id: this.props.location.state.detail.project_id,
          project_name: this.props.location.state.detail.project_name,
          mission_id: this.props.location.state.detail.mission_id,
          mission_name: this.props.location.state.detail.mission_name,
        },
        missions: miss
      })

      this.getMissionResponse('', defaultApirecordId, defaultApiPage);
      this.getClientresponseconfig();
    }
  }


  /* Handles the project selection from dropdown and to update the mission list from the selected project. */
  handleProjectChange = e => {
    let miss = [];
    var self = this;
    api2
      .get("projects/missionList?projectId=" + e.value)
      .then(resp => {
        resp.data.forEach((x, i) => {
          miss.push({ value: x.id, label: x.mission_name });
        })
        self.setState({
          project_id: e.value,
          project_name: e.label,
          missions: miss,
          selectedMission: "",
          selectedproj: e,
          paymentEnableDetails: e.value,
          paymentProjName: e.label
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
    // if (e.value >= 0 && e.value <= this.state.projectSource.length) {
    //   this.state.projectSource[e.value].mission_list.forEach((x, i) => {
    //     miss.push({ value: x.id, label: x.mission_name });
    //   });

    //   this.setState({
    //     clientscreendata: {
    //       ...this.state.clientscreendata,
    //       project_id: this.state.projectSource[e.value].id,
    //       project_name: this.state.projectSource[e.value].project_name,
    //       mission_name: "",
    //       mission_id: ""
    //     }
    //   })
    // }
    // this.setState({
    //   project_id:e.value,
    //   project_name:e.label,
    //   missions: miss,
    //   selectedMission: "",
    //   selectedproj: e,
    //   paymentEnableDetails: e.value,
    //   paymentProjName: e.label
    // });

  };

  /* Handle mission selection from dropdown. */
  handleMissionChange = e => {
    this.setState({ clientscreendata: { ...this.state.clientscreendata, mission_name: e.label, mission_id: e.value, project_id: this.state.project_id } })
    let paymentDetails = this.state.paymentEnableDetails;
    let paymentEnabled = ''
    let paymentCurrency = ''
    let paymentAmount = ''
    if (paymentDetails && paymentDetails.mission_list) {
      paymentDetails.mission_list.forEach(payDetails => {
        if (payDetails.id === e.value) {
          paymentEnabled = payDetails.paymentEnabled;
          paymentCurrency = payDetails.paymentCurrency;
          paymentAmount = payDetails.paymentAmount;
        }
      })
    }
    this.setState(
      {
        selectedMission: e,
        missionId: e.value,
        paymentEnabled: paymentEnabled,
        paymentCurrency: paymentCurrency,
        paymentAmount: paymentAmount,
        paymentMissionName: e.label,
        selectedlanguage: { label: "Select a Language", value: '' },
        page: 0,
        pagecount: this.state.datapagecount,
      },
      () => {
        loadedlistItems = [];
        this.getMissionResponse('', defaultApirecordId, defaultApiPage);
        this.getClientresponseconfig()
      }
    );
  };


  /* Handle the close event of payment popup. */
  closePay = () => {
    this.setState({ pay: false });
  }

  /* Handle the open event of view payment details popup from PayButton component. */
  methodFromParentPaydetails(cell) {

    this.setState({
      viewPaydetails: true,
      selectedPaymentDetails: cell
    });
  }

  /* Handle the close event of view payment details popup. */
  paymentViewDetails = () => {

    this.setState({ viewPaydetails: false });

  }

  /* Grid Events we're listening to update the mission response table. */
  onGridReady = params => {
    this.api = params.api;
    this.api.resetRowHeights();
    this.columnApi = params.columnApi;
  };



  /* Handles the export ag grid data to excel. */
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
      else if (params.column.colDef.queType && (params.column.colDef.queType === "barcode" || params.column.colDef.queType === "upload"
        || params.column.colDef.queType === "capture")) {
        if (params.value && params.value.length > 0 && Array.isArray(params.value)) {
          if (params.column.colDef.mediaType && (params.column.colDef.mediaType === 'video' || params.column.colDef.mediaType === 'audio')) {
            return params.value[0];
          }
          else {
            params.value[params.value.length - 1] = params.value[params.value.length - 1].replace('?thumbnail=yes', '');
            return params.value;
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

    this.api.exportDataAsCsv(params);
  };

  /* Restore column to default order. */
  restoreColumns = () => {
    this.saveColumnOrder({
      mission_id: this.state.missionId,
      column_order: {}
    });

    this.columnApi.resetColumnState();

    this.setState(
      {
        column_order: {},
        openrestore: false
      },
      () => {
        this.doTheThing();
      }
    );
  };

  /*  Handles the grid api to clear the filter. */
  clearFilter = () => {
    this.api.setFilterModel(null);
    this.api.onFilterChanged();
    this.setState(
      {
        quickFilterText: ""
      });
  }

  /*  Handles the event to apply the filter in the mission response table. */
  onFilterChanged = (e) => {
    var agGridFilter = this.api.getFilterInstance(e);
    if (agGridFilter !== undefined) {
      var reactFilterInstance = agGridFilter.getFrameworkComponentInstance();
      reactFilterInstance.componentMethod(this.state.filteredMetricList);
    }
  }

  /*  Handles the api to filter the metric data. */
  metricFilterUpdate = (missionId, field) => {

    api2.get("v1/survey_report/metric_filter?mission_id=" + missionId)
      .then(resp => {
        this.setState({
          filteredMetricList: resp.data.result
        }, () => {
          this.onFilterChanged(field)
        })

      })
  }


  /*  Handles the event to validate the column type and calls the api to update the answer. */
  onCellValueChanged = event => {
    const column = event.colDef;

    if (event.oldValue !== event.newValue) {
      if (column.type === "m") {
        this.addMetricDataService(
          event.data.survey_tag_id,
          this.state.missionId,
          event.value,
          column.id
        );
      } else if (column.type === "q") {
        let thisMissResp = this.state.sepMission[event.rowIndex];

        let questId = column.id;
        let ans = {};

        thisMissResp.answers.forEach(a => {
          if (a.question_id === questId) {
            ans = a;
          }
        });

        if (ans.type === "input") {
          this.editSurveyAnswerService(
            ans.answer_id,
            ans.customer_id,
            ans.question_id,
            ans.type,
            event.value,
            ans.survey_tag_id
          );
        } else {
          this.ShowNotification(
            "Only Input Fields are Editable, Changes will not be persisted",
            "warning"
          );
        }
      } else if (column.type === "g" && (column.field === "status" || column.field === "reviewed")) {
        //skip notification
      } else {
        this.ShowNotification(
          "Only customer response data is editable, Changes will not be persisted",
          "warning"
        );
      }
    }
  };
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
  /* Listening the grid events to update the rowdata using gridApi. */
  updateRowData = (rowId, updatedData) => {
    var rowNode = this.api.getRowNode(rowId);
    rowNode.setData(updatedData);
    this.api.redrawRows({ rowNode })

  }
  /* Style for popup layout. */
  getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  }
  /*  Handles the close event of modal popup. */
  handleCloseModal = () => {
    this.setState({ openModal: false });
    this.setState({
      selectedAnswer: {},
      answer_id: "",
      selectedQuestion: {},
      updatedAnswer: {}
    });
  };
  /* Unused function. */
  handleShow() {
    this.setState({ show: true });
  }
  /* Handles the event to validate the column type and update the value. */
  getSelectedAnswer = s => {
    if (s.colDef.type === 'm') {
      let selectedAnswer = {};
      selectedAnswer['text'] = s.data[s.colDef.field]
      this.setState({
        selectedAnswer: selectedAnswer
      });
    }
    else {
      this.state.filteredMissions.forEach(mrep => {
        mrep.responses.forEach(n => {
          if (
            ((n.loop_set && n.loop_set !== null && n.loop_set > 0) || (s.colDef.loop_set && s.colDef.loop_set !== null && s.colDef.loop_set > 0)) ?
              s.colDef.loop_set === n.loop_set &&
              s.colDef.loop_number === n.loop_number &&
              s.colDef.loop_triggered_qid === n.loop_triggered_qid &&
              s.colDef.id === n.question_id &&
              s.colDef.queType === n.type &&
              s.data.survey_tag_id === mrep.survey_tag_id
              :
              s.colDef.id === n.question_id &&
              s.colDef.queType === n.type &&
              s.data.survey_tag_id === mrep.survey_tag_id
          ) {
            this.setState({
              selectedAnswer: n.answers,
              imageEdit: n,
              answer_id: n.answer_id
            });
          }
        });
      });
    }
  };
  /*  Unused function. */
  getImagesArrayList = (event) => {
    let Row = [];
    let Column = []
    this.state.filteredMissions.forEach(a => {
      a.responses.forEach(r => {

        if (r.survey_tag_id === event.data.survey_tag_id) {
          this.state.questions.forEach(q => {
            if (r.question_id === q.question_id) {
              if (r.answers.image || r.answers.media) {
                Row.push({
                  image: r.answers.image ? r.answers.image : r.answers.media,
                  question_id: q.question_id,
                  survey_tag_id: r.survey_tag_id,
                  type: q.type,
                  title: q.title,
                  answers: r.answers
                })

              }
            }
          })
        }

        if (r.question_id === event.colDef.id) {

          this.state.questions.forEach(q => {
            if (r.question_id === q.question_id) {
              if (r.answers.image || r.answers.media) {
                Column.push({
                  image: r.answers.image ? r.answers.image : r.answers.media,
                  question_id: q.question_id,
                  survey_tag_id: r.survey_tag_id,
                  type: q.type,
                  title: q.title,
                  answers: r.answers
                })

              }
            }
          })

        }


      })

    })
    this.setState({
      imageRow: Row,
      imageColumn: Column
    })
  }
  setSelectedAnswer() {
    let filteredMissions = this.state.filteredMissions;
    let matched = false;
    let newValue = {};
    filteredMissions.forEach(mrep => {
      mrep.responses.forEach(n => {
        if (n.answer_id === this.state.answer_id) {
          if (n.type === "scale" || n.type === "choice") {
            n.answers.selected_option = this.state.updatedAnswer.selected_option;
          } else if (n.type === "input") {
            n.answers.text = this.state.updatedAnswer.text;
          } else {
            // extended for other types
          }
          matched = true;
          newValue = n;
        }
      });
    });

    if (matched === true) {
      var rowNode = this.api.getRowNode(this.state.survey_tag_id);

      let newData = this.formatAnswer(newValue);
      rowNode.setDataValue(this.state.selectedQuestion.field, newData);

      var rows = [];
      rows.push(rowNode);
      this.api.redrawRows({ rowNodes: rows });

      this.setState({
        filteredMissions: filteredMissions
      });
      //this.api.resetRowHeights();
      //this.updateTableData();
      this.setState({
        answer_id: "",
        selectedQuestion: {},
        updatedAnswer: {},
        selectedAnswer: {}
      });
    }
    else {
      console.log('no match for answers found');
    }
  }
  getSelectedQuestion = ev => {
    if (ev.colDef.type === 'm') {
      let selectedQuestion = {};
      selectedQuestion['type'] = ev.colDef.type;
      selectedQuestion['headerName'] = ev.colDef.headerName;
      selectedQuestion['field'] = ev.colDef.field;
      selectedQuestion['id'] = ev.colDef.id;

      this.setState({
        selectedQuestion: selectedQuestion
      });
    }
    else {
      this.state.questions.forEach(m => {
        if (ev.colDef.queType === m.type && ev.colDef.id === m.question_id) {
          let selectedQuestion = m.question;
          selectedQuestion['field'] = ev.colDef.field;
          if (ev.colDef.loop_number) {
            selectedQuestion['loop_number'] = ev.colDef.loop_number;
            selectedQuestion['loop_set'] = ev.colDef.loop_set;
            selectedQuestion['loop_triggered_qid'] = ev.colDef.loop_triggered_qid;
          }
          this.setState({
            selectedQuestion: selectedQuestion
          });
        }
      });
    }
  };
  /* 
  * Handles the cell click event.
  *
  *  Validate the question type.
  * 
  * If question type is scale or input or choice, it will pass the event to respective function to display selected question and its answer.
  * 
  * If question type is barcode or upload or capture, it will pass the event to getphotoeditorquestion 
  * function to display the image in tui editor if image exists in the cell.
  * 
  * If question type is metric it will pass the event to respective function to display the metric data.
  * 
  * */
  onCellClicked = event => {
    if (event.colDef.field === 'reviewed' || event.colDef.field === 'status') {
      /*this.updateResponseReviewed(event.data.survey_tag_id, event.data.reviewed);
      rowNode = this.api.getRowNode(event.data.survey_tag_id); */

    }
    else {

      if (
        event.colDef.queType === "scale" ||
        event.colDef.queType === "input" ||
        event.colDef.queType === "choice"


      ) {
        this.getSelectedQuestion(event);
        this.getSelectedAnswer(event);

        this.setState({
          customer_id: event.data.customer_id,
          survey_tag_id: event.data.survey_tag_id,
          openModal: true
        });
      }

      else if (event.colDef.queType === "upload") {

        if (event.value.length === 0 || event.value[event.value.length - 1] === undefined) {
          this.setState({ openPopup: false })
        } else if (event.colDef.mediaType && (event.colDef.mediaType === 'video' || event.colDef.mediaType === 'audio')) {
          // skip audio video clicks		
        } else {
          this.getAllRows()
          this.getPhotoEditorQuestion(event)

          this.setState({
            customer_id: event.data.customer_id,
            survey_tag_id: event.data.survey_tag_id
          });

        }
      }
      else if (event.colDef.queType === "barcode" && (event.colDef.field.includes("-B_image") || event.colDef.field.includes("-B_oimage"))) {
        if (event.value === "" || event.value === undefined) {
          this.setState({ openPopup: false })
        } else {
          this.getAllRows()
          this.getPhotoEditorQuestion(event)

          this.setState({
            customer_id: event.data.customer_id,
            survey_tag_id: event.data.survey_tag_id
          });

        }
      }
      else if (event.colDef.queType === "capture" && !event.colDef.field.includes("-C_instext") && !event.colDef.field.includes("-C_scale")) {
        if (event.value === "" || event.value === undefined) {
          this.setState({ openPopup: false })
        } else {
          this.getAllRows()
          this.getPhotoEditorQuestion(event)

          this.setState({
            customer_id: event.data.customer_id,
            survey_tag_id: event.data.survey_tag_id
          });

        }
      }
      else if (event.colDef.type === "m") {
        this.getSelectedQuestion(event);
        this.getSelectedAnswer(event);

        this.setState({
          customer_id: event.data.customer_id,
          survey_tag_id: event.data.survey_tag_id,
          openModal: true,

        });
      } else {
        this.setState({
          customer_id: event.data.customer_id,
          survey_tag_id: event.data.survey_tag_id
        });
      }

    }


  }
  /*  If question type is barcode or upload or capture it will form the answer data.
  * Image editor gets popup to render the image. */
  getPhotoEditorQuestion = (ev) => {
    let colDef = this.state.columnDefs;
    let currentdetails = {}
    let selectedQuestion = ''
    this.state.questions.forEach(m => {
      if ((ev.colDef.loop_set && ev.colDef.loop_set != null && ev.colDef.loop_set > 0) ?
        (ev.colDef.loop_triggered_qid === m.loop_triggered_qid && ev.colDef.loop_set === m.loop_set &&
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

  }
  /* Handles the event to close the image editor. */
  closePELightbox = () => {
    let status = this.state.openPopup === true ? this.Editor.current.getStatus() : false
    if (status === true) {
      this.editSurveyAnswer('hide_close')
    } else {
      this.setState({ openPopup: false });
    }
  };
  /* Formation of answer data for all the question type except capture,upload and barcode.*/

  // updateAnswerData  = () => {
  //   if (this.state.selectedQuestion.type === "input" || this.state.selectedQuestion.type === "m") {
  //     if (this.state.selectedAnswer) {
  //       this.setState({ updatedAnswer: this.state.selectedAnswer });
  //       // this.state.updatedAnswer = this.state.selectedAnswer;
  //     }
  //     let items = this.state.updatedAnswer;
  //     items.text=this.refs.modalPopUp.getUpdatedText()
  //     // this.state.updatedAnswer["text"] = this.refs.modalPopUp.getUpdatedText();
  //     this.setState({updatedAnswer:items})
  //   }
  //   else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "scale") {
  //     let selectedScaleOptions = this.refs.modalPopUp.getSelectedScaleOptions();
  //     if (
  //       this.state.selectedAnswer &&
  //       this.state.selectedAnswer.selected_option
  //     ) {
  //       this.setState({ updatedAnswer: this.state.selectedAnswer });
  //       // this.state.updatedAnswer = this.state.selectedAnswer;
  //       let items = this.state.updatedAnswer;
  //     items.selected_option=selectedScaleOptions;
  //     // this.state.updatedAnswer["text"] = this.refs.modalPopUp.getUpdatedText();
  //     this.setState({updatedAnswer:items})
  //       // this.state.updatedAnswer["selected_option"] = selectedScaleOptions;
  //     } else {
  //       let items = this.state.updatedAnswer;
  //       items.selected_option=selectedScaleOptions;
  //       items.icon_type=this.state.selectedQuestion.properties.icon_type;
  //       items.scale_type=this.state.selectedQuestion.properties.scale_type;
  //       // this.state.updatedAnswer["selected_option"] = selectedScaleOptions;
  //       // this.state.updatedAnswer["icon_type"] = this.state.selectedQuestion.properties.icon_type;
  //       // this.state.updatedAnswer["scale_type"] = this.state.selectedQuestion.properties.scale_type;
  //       this.setState({updatedAnswer:items})
  //     }
  //   }
  //   else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "table") {
  //     let selectedTableOptions = this.refs.modalPopUp.getSelectedTableOptions();
  //     if (
  //       this.state.selectedAnswer &&
  //       this.state.selectedAnswer.selected_option
  //     ) {
  //       this.setState({ updatedAnswer: this.state.selectedAnswer });
  //       // this.state.updatedAnswer = this.state.selectedAnswer;
  //       let items = this.state.updatedAnswer;
  //       items.selected_option=selectedTableOptions;
  //       this.setState({updatedAnswer:items})
  //       // this.state.updatedAnswer["selected_option"] = selectedTableOptions;
  //     } else {
  //       let items = this.state.updatedAnswer;
  //       items.selected_option=selectedTableOptions;
  //       items.scale_type=this.state.selectedQuestion.properties.scale_type;
  //       this.setState({updatedAnswer:items})
  //       // this.state.updatedAnswer["selected_option"] = selectedTableOptions;
  //       // this.state.updatedAnswer["scale_type"] = this.state.selectedQuestion.properties.scale_type;
  //     }
  //   }
  //   else if (this.state.selectedQuestion.type === "choice") {
  //     let selectedChoiceOptions = this.refs.modalPopUp.getSelectedChoiceOptions();
  //     if (this.refs.modalPopUp.getOtherOptionValue !== "") {
  //       let items = this.state.updatedAnswer;
  //       items.other_value=this.refs.modalPopUp.getOtherOptionValue();
  //       this.setState({updatedAnswer:items})
  //       // this.state.updatedAnswer["other_value"] = this.refs.modalPopUp.getOtherOptionValue();
  //     }
  //     if (this.state.selectedQuestion.properties.multilevel == 0) {
  //       if (this.state.selectedQuestion.properties.choice_type === "single" && this.state.selectedAnswer &&
  //         this.state.selectedAnswer.id
  //       ) {
  //         if (selectedChoiceOptions && selectedChoiceOptions.length > 0) {
  //           this.setState({ updatedAnswer: this.state.selectedAnswer });
  //           // this.state.updatedAnswer = this.state.selectedAnswer;
  //           let items = this.state.updatedAnswer;
  //       items.id=selectedChoiceOptions[0].id;
  //       items.label=selectedChoiceOptions[0].label;
  //       items.label_image=selectedChoiceOptions[0].label_image;
  //       this.setState({updatedAnswer:items})
  //           // this.state.updatedAnswer["id"] = selectedChoiceOptions[0].id;
  //           // this.state.updatedAnswer["label"] = selectedChoiceOptions[0].label;
  //           // this.state.updatedAnswer["label_image"] = selectedChoiceOptions[0].label_image;
  //         }
  //       }
  //       else if (this.state.selectedQuestion.properties.choice_type === "single") {
  //         if (selectedChoiceOptions && selectedChoiceOptions.length > 0) {
  //           let items = this.state.updatedAnswer;
  //           items.id=selectedChoiceOptions[0].id;
  //           items.label=selectedChoiceOptions[0].label;
  //           items.label_image=selectedChoiceOptions[0].label_image;
  //           items.choice_type=this.state.selectedQuestion.properties.choice_type;
  //           items.multilevel=this.state.selectedQuestion.properties.multilevel;
  //           this.setState({updatedAnswer:items})
  //           // this.state.updatedAnswer["id"] = selectedChoiceOptions[0].id;
  //           // this.state.updatedAnswer["label"] = selectedChoiceOptions[0].label;
  //           // this.state.updatedAnswer["label_image"] = selectedChoiceOptions[0].label_image;
  //           // this.state.updatedAnswer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
  //           // this.state.updatedAnswer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
  //         }

  //       }
  //       else if (this.state.selectedQuestion.properties.choice_type === "multiple" && this.state.selectedAnswer &&
  //         this.state.selectedAnswer.selected_option) {
  //           this.setState({ updatedAnswer: this.state.selectedAnswer });
  //         // this.state.updatedAnswer = this.state.selectedAnswer;   
  //         let items = this.state.updatedAnswer;
  //         items.selected_option=selectedChoiceOptions;
  //         this.setState({updatedAnswer:items})
  //         // this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
  //       } else {
  //         let items = this.state.updatedAnswer;
  //         items.selected_option=selectedChoiceOptions;
  //         items.choice_type=this.state.selectedQuestion.properties.choice_type;
  //         items.multilevel=this.state.selectedQuestion.properties.multilevel;
  //         this.setState({updatedAnswer:items})
  //         // this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
  //         // this.state.updatedAnswer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
  //         // this.state.updatedAnswer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
  //       }
  //     }

  //     else {
  //       if (this.state.selectedAnswer && this.state.selectedAnswer.selected_option
  //       ) {
  //         this.setState({ updatedAnswer: this.state.selectedAnswer });
  //         // this.state.updatedAnswer = this.state.selectedAnswer;   
  //         let items = this.state.updatedAnswer;
  //         items.selected_option=selectedChoiceOptions;
  //         this.setState({updatedAnswer:items})
  //         // this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
  //       }
  //       else {
  //         let items = this.state.updatedAnswer;
  //         items.selected_option=selectedChoiceOptions;
  //         items.choice_type=this.state.selectedQuestion.properties.choice_type;
  //         items.multilevel=this.state.selectedQuestion.properties.multilevel;
  //         this.setState({updatedAnswer:items})
  //         // this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
  //         // this.state.updatedAnswer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
  //         // this.state.updatedAnswer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
  //       }
  //     }
  //   }




  // };

  updateAnswerData = async () => {

    if (this.state.selectedQuestion.type === "input" || this.state.selectedQuestion.type === "m") {
      if (this.state.selectedAnswer) {
        this.state.updatedAnswer = this.state.selectedAnswer;
      }
      this.state.updatedAnswer["text"] = this.refs.modalPopUp.getUpdatedText();
    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "scale") {
      let selectedScaleOptions = this.refs.modalPopUp.getSelectedScaleOptions();
      if (
        this.state.selectedAnswer &&
        this.state.selectedAnswer.selected_option
      ) {
        this.state.updatedAnswer = this.state.selectedAnswer;
        this.state.updatedAnswer["selected_option"] = selectedScaleOptions;
      } else {
        this.state.updatedAnswer["selected_option"] = selectedScaleOptions;
        this.state.updatedAnswer["icon_type"] = this.state.selectedQuestion.properties.icon_type;
        this.state.updatedAnswer["scale_type"] = this.state.selectedQuestion.properties.scale_type;
      }
    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "table") {
      let selectedTableOptions = this.refs.modalPopUp.getSelectedTableOptions();
      if (
        this.state.selectedAnswer &&
        this.state.selectedAnswer.selected_option
      ) {
        this.state.updatedAnswer = this.state.selectedAnswer;
        this.state.updatedAnswer["selected_option"] = selectedTableOptions;
      } else {
        this.state.updatedAnswer["selected_option"] = selectedTableOptions;
        this.state.updatedAnswer["scale_type"] = this.state.selectedQuestion.properties.scale_type;
      }
    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "maxdiff") {
      let selectedmaxdiffOptions = this.refs.modalPopUp.getSelectedMaxdiffOption();
      if (
        this.state.selectedAnswer &&
        this.state.selectedAnswer.selected_option
      ) {
        this.state.updatedAnswer = this.state.selectedAnswer;
        this.state.updatedAnswer["selected_option"] = selectedmaxdiffOptions;
      } else {
        this.state.updatedAnswer["selected_option"] = selectedmaxdiffOptions;
        this.state.updatedAnswer["scale_type"] = this.state.selectedQuestion.properties.scale_type;
      }
    }
    else if (this.state.selectedQuestion.type === "choice") {
      let selectedChoiceOptions = this.refs.modalPopUp.getSelectedChoiceOptions();
      if (this.refs.modalPopUp.getOtherOptionValue !== "") {
        this.state.updatedAnswer["other_value"] = this.refs.modalPopUp.getOtherOptionValue();
      }
      if (this.state.selectedQuestion.properties.multilevel === 0) {
        if (this.state.selectedQuestion.properties.choice_type === "single" && this.state.selectedAnswer &&
          this.state.selectedAnswer.id
        ) {
          if (selectedChoiceOptions && selectedChoiceOptions.length > 0) {
            this.state.updatedAnswer = this.state.selectedAnswer;
            this.state.updatedAnswer["id"] = selectedChoiceOptions[0].id;
            this.state.updatedAnswer["label"] = selectedChoiceOptions[0].label;
            this.state.updatedAnswer["label_image"] = selectedChoiceOptions[0].label_image;
          }
        }
        else if (this.state.selectedQuestion.properties.choice_type === "single") {
          if (selectedChoiceOptions && selectedChoiceOptions.length > 0) {
            this.state.updatedAnswer["id"] = selectedChoiceOptions[0].id;
            this.state.updatedAnswer["label"] = selectedChoiceOptions[0].label;
            this.state.updatedAnswer["label_image"] = selectedChoiceOptions[0].label_image;
            this.state.updatedAnswer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
            this.state.updatedAnswer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
          }

        }
        else if (this.state.selectedQuestion.properties.choice_type === "multiple" && this.state.selectedAnswer &&
          this.state.selectedAnswer.selected_option) {
          this.state.updatedAnswer = this.state.selectedAnswer;
          this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
        } else {
          this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
          this.state.updatedAnswer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
          this.state.updatedAnswer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
        }
      }

      else {
        if (this.state.selectedAnswer && this.state.selectedAnswer.selected_option
        ) {
          this.state.updatedAnswer = this.state.selectedAnswer;
          this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
        }
        else {
          this.state.updatedAnswer["selected_option"] = selectedChoiceOptions;
          this.state.updatedAnswer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
          this.state.updatedAnswer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
        }
      }
    }


  };


  // updateAnswerData = () => {

  //   if (this.state.selectedQuestion.type === "input" || this.state.selectedQuestion.type === "m") {
  //     if (this.state.selectedAnswer) {
  //       this.setState({ updatedAnswer: this.state.selectedAnswer })
  //     }
  //     this.setState({ PupdatedAnswer: { ...this.stae.PupdatedAnswer, text: this.refs.modalPopUp.getUpdatedText() } })
  //   }
  //   else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "scale") {
  //     let selectedScaleOptions = this.refs.modalPopUp.getSelectedScaleOptions();
  //     if (
  //       this.state.selectedAnswer &&
  //       this.state.selectedAnswer.selected_option
  //     ) {
  //       this.setState({
  //         updatedAnswer: {
  //           ...this.state.selectedAnswer,
  //           selected_option: selectedScaleOptions
  //         }
  //       })
  //     } else {
  //       this.setState({
  //         updatedAnswer: {
  //           ...this.state.updatedAnswer,
  //           selected_option: selectedScaleOptions,
  //           icon_type: this.state.selectedQuestion.properties.icon_type,
  //           scale_type: this.state.selectedQuestion.properties.scale_type
  //         }
  //       })
  //     }
  //   }
  //   else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "table") {
  //     let selectedTableOptions = this.refs.modalPopUp.getSelectedTableOptions();
  //     if (
  //       this.state.selectedAnswer &&
  //       this.state.selectedAnswer.selected_option
  //     ) {
  //       this.setState({
  //         updatedAnswer: {
  //           ...this.state.selectedAnswer,
  //           selected_option: selectedTableOptions
  //         }
  //       })
  //     } else {
  //       this.setState({
  //         updatedAnswer: {
  //           ...this.state.updatedAnswer,
  //           selected_option: selectedTableOptions,
  //           scale_type: this.state.selectedQuestion.properties.scale_type
  //         }
  //       })
  //     }
  //   }
  //   else if (this.state.selectedQuestion.type === "choice") {
  //     let selectedChoiceOptions = this.refs.modalPopUp.getSelectedChoiceOptions();
  //     if (this.refs.modalPopUp.getOtherOptionValue !== "") {
  //       this.setState({ updatedAnswer: { ...this.state.updatedAnswer, other_value: this.refs.modalPopUp.getOtherOptionValue() } })
  //     }
  //     if (this.state.selectedQuestion.properties.multilevel === 0) {
  //       if (this.state.selectedQuestion.properties.choice_type === "single" && this.state.selectedAnswer &&
  //         this.state.selectedAnswer.id
  //       ) {
  //         if (selectedChoiceOptions && selectedChoiceOptions.length > 0) {
  //           this.setState({
  //             updatedAnswer: {
  //               ...this.state.selectedAnswer,
  //               id: selectedChoiceOptions[0].id,
  //               label: selectedChoiceOptions[0].label,
  //               label_image: selectedChoiceOptions[0].label_image
  //             }
  //           })
  //         }
  //       }
  //       else if (this.state.selectedQuestion.properties.choice_type === "single") {
  //         if (selectedChoiceOptions && selectedChoiceOptions.length > 0) {
  //           this.setState({
  //             updatedAnswer: {
  //               ...this.state.updatedAnswer,
  //               id: selectedChoiceOptions[0].id,
  //               label: selectedChoiceOptions[0].label,
  //               label_image: selectedChoiceOptions[0].label_image,
  //               choice_type: this.state.selectedQuestion.properties.choice_type,
  //               multilevel: this.state.selectedQuestion.properties.multilevel
  //             }
  //           })
  //         }

  //       }
  //       else if (this.state.selectedQuestion.properties.choice_type === "multiple" && this.state.selectedAnswer &&
  //         this.state.selectedAnswer.selected_option) {
  //         this.setState({
  //           updatedAnswer: {
  //             ...this.state.selectedAnswer,
  //             selected_option: selectedChoiceOptions
  //           }
  //         })
  //       } else {
  //         this.setState({
  //           updatedAnswer: {
  //             ...this.state.updatedAnswer,
  //             selected_option: selectedChoiceOptions,
  //             choice_type: this.state.selectedQuestion.properties.choice_type,
  //             multilevel: this.state.selectedQuestion.properties.multilevel
  //           }
  //         })
  //       }
  //     }

  //     else {
  //       if (this.state.selectedAnswer && this.state.selectedAnswer.selected_option
  //       ) {
  //         this.setState({
  //           updatedAnswer: {
  //             ...this.state.selectedAnswer,
  //             selected_option: selectedChoiceOptions
  //           }
  //         })
  //       }
  //       else {
  //         this.setState({
  //           updatedAnswer: {
  //             ...this.state.updatedAnswer,
  //             selected_option: selectedChoiceOptions,
  //             choice_type: this.state.selectedQuestion.properties.choice_type,
  //             multilevel: this.state.selectedQuestion.properties.multilevel
  //           }
  //         })
  //       }
  //     }
  //   }


  // };


  /* Formation of answer data for capture,upload and barcode question type.*/
  // updateImageAnswerData = (imageData, dataURL, background_update) => {

  //   if (imageData.type === "barcode" || imageData.type === "capture") {

  //     this.setState({ imageData: imageData, updatedAnswer: imageData.answers })
  //     if (!imageData.answers.image_orig) {
  //       this.setState({ updatedAnswer: { ...this.state.updatedAnswer, image_orig: imageData.answers.image } })
  //     }
  //     //this.state.updatedAnswer.image = dataURL;
  //     if (background_update === 'save') {
  //       this.setState({ loading: true, openPopup: false, updatedAnswer: { ...this.state.updatedAnswer, image: dataURL } });
  //     }
  //     else if (background_update === 'hide_close') {
  //       this.setState({ loading: true, openPopup: false });
  //     }
  //   }

  //   else if (imageData.type === "upload") {

  //     this.setState({ imageData: imageData, updatedAnswer: imageData.answers })
  //     if (!imageData.answers.image_orig) {
  //       this.setState({ updatedAnswer: { ...this.state.updatedAnswer, image_orig: imageData.answers.media } });
  //     }
  //     //this.state.updatedAnswer.media = dataURL.split(',')[1];
  //     //this.state.updatedAnswer.media_type = "image";
  //     //this.state.updatedAnswer.media_format = "png";

  //     if (background_update === 'save') {
  //       let updatedAnswer = {
  //         media: dataURL.split(',')[1],
  //         media_type: "image",
  //         media_format: "png"
  //       }
  //       this.setState({ loading: true, openPopup: false, updatedAnswer });
  //     }
  //     else if (background_update === 'hide_close') {
  //       this.setState({ loading: true, openPopup: false });
  //     }
  //   }

  // };

  updateImageAnswerData = async (imageData, dataURL, background_update) => {

    if (imageData.type === "barcode" || imageData.type === "capture") {
      this.state.updatedAnswer = imageData.answers;
      if (!imageData.answers.image_orig) {
        this.state.updatedAnswer.image_orig = imageData.answers.image;
      }
      //this.state.updatedAnswer.image = dataURL;
      this.state.imageData = imageData;
      if (background_update === 'save') {
        this.state.updatedAnswer.image = dataURL;
        this.setState({ loading: true, openPopup: false });
      }
      else if (background_update === 'hide_close') {
        this.setState({ loading: true, openPopup: false });
      }
    }

    else if (imageData.type === "upload") {
      // this.setState({backupphotosupdate:this.state.backupphotos});
      this.state.updatedAnswer = imageData.answers;
      if (!imageData.answers.image_orig) {
        this.state.updatedAnswer.image_orig = imageData.answers.media;
      }
      //this.state.updatedAnswer.media = dataURL.split(',')[1];
      //this.state.updatedAnswer.media_type = "image";
      //this.state.updatedAnswer.media_format = "png";
      this.state.imageData = imageData;

      if (background_update === 'save') {
        this.state.updatedAnswer.media = dataURL.split(',')[1];
        this.state.updatedAnswer.media_type = "image";
        this.state.updatedAnswer.media_format = "png";
        this.setState({ loading: true, openPopup: false });
      }
      else if (background_update === 'hide_close') {
        this.setState({ loading: true, openPopup: false });
      }
    }
  };

  /* Handles the api to submit the answer data to the server.*/
  editSurveyAnswer = (handleChange) => {
    let background_update = '';
    if (handleChange !== undefined && handleChange !== null) { background_update = handleChange }
    if (this.state.selectedQuestion.type === "barcode" || this.state.selectedQuestion.type === "capture" || this.state.selectedQuestion.type === "upload") {
      if (this.Editor.current.getdataURL() && this.Editor.current.getdataURL().length > 0) {
        this.updateImageAnswerData(this.Editor.current.getImageData(), this.Editor.current.getdataURL(), background_update);

        let newData = {
          consumer_id: this.state.imageData.customer_id,
          answer: this.state.updatedAnswer,
          mission_id: this.state.missionId,
          survey_id: this.state.survey_id,
          question_id: this.state.imageData.question_id,
          survey_answer_tag_id: this.state.imageData.survey_tag_id,
          question_type: this.state.imageData.type
        };
        if (this.state.imageData.loop_number) {
          newData.loop_number = this.state.imageData.loop_number
          newData.loop_set = this.state.imageData.loop_set
          newData.loop_triggered_qid = this.state.imageData.loop_triggered_qid
        }
        api2
          .post("/web_survey_answers", newData)
          .then(resp => {
            if (background_update === 'save' || background_update === 'hide_close') {
              this.setState({ openModal: false, openPopup: false });
              // this.closeLightbox();
              this.getMissionResponse(this.state.selectedlanguage.value, defaultApirecordId, defaultApiPage);
              this.setState({
                selectedAnswer: {},
                answer_id: "",
                selectedQuestion: {},
                updatedAnswer: {}
              });
            }
          })
          .catch(error => {
            if (!background_update) {
              this.setState({ openModal: false, openPopup: false });
              // this.closeLightbox();
            }
            console.error(error);
            this.setState({
              selectedAnswer: {},
              answer_id: "",
              selectedQuestion: {},
              updatedAnswer: {}
            });
          });

      }
    }
    else {
      this.updateAnswerData();

      if (Object.keys(this.state.updatedAnswer).length > 0) {

        this.updateAnswerData();
        if (this.state.selectedQuestion.type === 'm') {
          this.addMetricDataService(
            this.state.survey_tag_id,
            this.state.missionId,
            this.state.updatedAnswer['text'],
            this.state.selectedQuestion.id,
            this.state.selectedQuestion.field
          );
        }
        else {
          let data = {
            id: this.state.answer_id,
            consumer_id: this.state.customer_id,
            answer: this.state.updatedAnswer
          };

          if (this.state.selectedQuestion.loop_number) {
            data.loop_number = this.state.selectedQuestion.loop_number
            data.loop_set = this.state.selectedQuestion.loop_set
            data.loop_triggered_qid = this.state.selectedQuestion.loop_triggered_qid
          }

          let newData = {
            consumer_id: this.state.customer_id,
            answer: this.state.updatedAnswer,
            mission_id: this.state.missionId,
            survey_id: this.state.survey_id,
            question_id: this.state.selectedQuestion.question_id,
            survey_answer_tag_id: this.state.survey_tag_id,
            question_type: this.state.selectedQuestion.type
          };
          if (this.state.selectedQuestion.loop_number) {
            newData.loop_number = this.state.selectedQuestion.loop_number
            newData.loop_set = this.state.selectedQuestion.loop_set
            newData.loop_triggered_qid = this.state.selectedQuestion.loop_triggered_qid
          }

          if (this.state.answer_id && this.state.answer_id !== "") {
            api2
              .patch("web_survey_answers", data)
              .then(resp => {

                this.setState({ openModal: false });
                this.closeLightbox();
                //this.setSelectedAnswer();
                this.getMissionResponse(this.state.selectedlanguage.value, defaultApirecordId, defaultApiPage);
                this.setState({
                  selectedAnswer: {},
                  answer_id: "",
                  selectedQuestion: {},
                  updatedAnswer: {}
                });
              })
              .catch(error => {
                this.setState({ openModal: false });
                this.closeLightbox();
                this.setState({
                  selectedAnswer: {},
                  answer_id: "",
                  selectedQuestion: {},
                  updatedAnswer: {}
                });
                console.error(error);
              });
          } else {
            api2
              .post("web_survey_answers", newData)
              .then(resp => {

                this.setState({ openModal: false });
                this.closeLightbox();
                this.getMissionResponse(this.state.selectedlanguage.value, defaultApirecordId, defaultApiPage);
                this.setState({
                  selectedAnswer: {},
                  answer_id: "",
                  selectedQuestion: {},
                  updatedAnswer: {}
                });
              })
              .catch(error => {
                this.setState({ openModal: false });
                this.closeLightbox();
                console.error(error);
                this.setState({
                  selectedAnswer: {},
                  answer_id: "",
                  selectedQuestion: {},
                  updatedAnswer: {}
                });
              });
          }
        }
      }
      else {
        this.setState({ openModal: false });
        this.closeLightbox();
      }
    }
  };
  /* 
  * Get the column state from the event.
  * pass the mission id and updated columns to the save column oder function.
  * 
  * Save the updated columns in the respective state variable.
  * 
  * Update the column definition of aggrid table.
  * 
  * */
  columnMoved = event => {

    let columnState = event.columnApi.getColumnState();
    let updatedColumns = [];

    for (var i = 0; i < columnState.length; i++) {
      updatedColumns.push(columnState[i].colId.replace("_1", ""));
    }

    this.saveColumnOrder({
      mission_id: this.state.missionId,
      column_order: { order: "modified", columns: updatedColumns }
    });

    this.setState({
      column_order: { order: "modified", columns: updatedColumns }
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

  };
  /* Unused function. */
  onColumnResized = event => {
    //this.api.resetRowHeights();
  };


  /* Handles the grid api to update the events. */
  updateColumns = event => {
    this.columnApi = event.columnApi;
    this.api = event.api;
    this.api.resetRowHeights();

    // this.api.selectIndex(6, false, false);
    let cell = this.api.getFocusedCell();
    if (cell) {
      this.api.ensureIndexVisible(cell.rowIndex, 'top')

      //  this.api.setFocusedCell( cell.rowIndex, cell.column );
    }
  };
  /* Unused function. */
  onRowSelected = event => {
  };
  /* 
  * Used grid api to calculate the row count.
  * Set the total row length and find the processed rows using gridapi.
  * Update the row count as processed rows/total rows.
  */
  calculateRowCount = () => {
    if (this.api && this.state.rowData) {
      const model = this.api.getModel();
      const totalRows = this.state.rowData.length;
      const processedRows = model.getRowCount();
      this.setState({
        rowCount: processedRows.toLocaleString() + " / " + totalRows.toLocaleString()
      });
    }
  };
  /* Handles the api to save column order to server by using column data. */
  saveColumnOrder(data) {
    api2
      .post("v1/survey_report/order_data", data)
      .then(resp => {
      })
      .catch(error => {
        console.error(error);
      });
  }
  /* 
  * Params used in this function - mission id.
  * Mission id is passed in this api to fetch survey report when the filter is applied in the mission response.
  *
  * */
  ConsumerTypeFilter = (missionId) => {
    api2.get("v1/survey_report/consumertype_filter?mission_id=" + missionId)
      .then(resp => {
        if (resp && resp.data && resp.data.result) {
          this.setState({
            filteredconsumertype: resp.data.result
          })
        }

      })
  }
  /* 
  * Params used in this function - language,record and page size.
  * Handles the api to fetch the mission response by using above params.
  * Updates the language list,status options,mission response,column order,metrics data, and page count respectively.
  * */
  getMissionResponse = (Language, record, pagesize) => {
    this.openLoading();
    loadedlistItems = [];
    var self = this;
    let language = ''
    if (Language !== '' && Language !== null && Language !== undefined) {
      language = Language
    }
    let url = "v2/survey_report?id=" + this.state.missionId + '&language=' + language + '&record=' + record + '&pagesize=' + pagesize;

    api2
      .get(url)
      .then(resp => {
        this.metricFilter(this.state.missionId);
        this.ConsumerTypeFilter(this.state.missionId);
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
          filteredMissions: resp.data.list,
          missionResponses: resp.data.list.filter(x => {
            return x.responses.length >= 0;
          }),
          response: true,

          questions: resp.data.questions,
          metrics_row: resp.data.metrics_row,
          //metrics_data: resp.data.metrics_data,
          statusOptions: statusOptions,
          column_order: resp.data.column_order,
          estimatedTime: resp.data.estimatedTime,
          points: resp.data.points,
          survey_id: resp.data.survey_id,
          languagelist: survey_languages,
          datapagecount: resp.data.total,
          pagecount: resp.data.total,
          page: 0,
          listItems: [],
          backupphotos: this.state.backupphotos ? true : false
          // backupphotos:this.state.backupphotosupdate?true:false

        }, () => {
          if (Language !== '' && Language !== null && Language !== undefined) {
            this.convert_language_code(Language)
          } else {
            this.doTheThing();
            this.stopLoading();
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.stopLoading();
        self.setState({
          response: true
        });
      });
  };
  /* Params used in this api's are missionid,language,record and pagesize.
  * Above param values are passed in the url to fetch survey report.
  * Update the mission response to the state variable.
  */
  getMissionResponsepage = (Language, record, pagesize, page, changerow, exportCsv) => {
    var self = this;
    let url = "v2/survey_report?id=" + this.state.missionId + '&language=""&record=' + record + '&pagesize=' + pagesize;
    if (Language !== '' && Language !== null && Language !== undefined) {
      url = "v2/survey_report?id=" + this.state.missionId + '&language=' + Language + '&record=' + record + '&pagesize=' + pagesize;
    }
    api2
      .get(url)
      .then(resp => {
        if (changerow !== undefined && changerow !== null && changerow === 'changerow') {
          this.setState({ filteredMissions: [], missionResponses: [], listItems: [] })
        }
        // let filteredMissions = this.state.filteredMissions.concat(resp.data.list);
        let filteredMissions = resp.data.list.concat(this.state.filteredMissions);
        let temp_missionResponses = resp.data.list.filter(x => {
          return x.responses.length >= 0;
        })
        // let missionResponses = this.state.missionResponses.concat(temp_missionResponses)
        let missionResponses = temp_missionResponses.concat(this.state.missionResponses)
        self.setState({
          filteredMissions: filteredMissions,
          missionResponses: missionResponses,
          missionResponses_temp: resp.data.list.filter(x => {
            return x.responses.length >= 0;
          }),
          response: true,
          datapagecount: resp.data.total,
          exportCsv: false
        }, () => {
          if (Language !== '' && Language !== null && Language !== undefined) {
            this.convert_language_code_page(Language, page, exportCsv)
          } else {
            this.doTheThingpage(page, exportCsv);
            this.stopLoading();
          }
        });

      })
      .catch(error => {
        console.error(error);
        this.setState({
          listItems: loadedlistItems,
          datapagecount: loadedlistItems.length,
          pagecount: loadedlistItems.length,
        }, () => { this.api.resetRowHeights() })
        // this.stopLoading();
        // self.setState({
        //   response: true
        // });
      });
  };
  /* Handles the api to fetch the config and update the response respectively. */
  getClientresponseconfig = () => {

    var self = this;
    api2
      .get("v1/client_response_config?id=" + this.state.missionId)
      .then(resp => {
        if (resp.data.response_config) {
          self.state.client_response = resp.data;
        }
        else {
          self.state.client_response = false;
        }
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }
  /* Handles the open event of loading symbol. */
  openLoading = () => {
    this.setState({ loading: true });
  };
  /* Handles the function to stop loading. */
  stopLoading = () => {
    this.setState({ loading: false });
  };
  /* Handles the close event of loading symbol. */
  handleClose = () => {
    this.setState({ open: false });
  };
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
      if (e.label !== this.state.selectedlanguage.label) {
        // loadedlistItems = [];
        this.getMissionResponse(e.value, defaultApirecordId, defaultApiPage)
      }
      this.setState({
        selectedlanguage: { label: e.label, value: e.value },
        page: 0,
        pagecount: this.state.datapagecount,
        rowsPerPage: this.state.rowsPerPage,
        loadpage: [0]
      })
    } else {
      this.getlanguagelist();
      this.ShowNotification("Somthing Went To Wrong , Try Again", "danger");
    }
  };
  /*  Handles the function to validate the language code.*/
  convert_language_code(Language, page, exportCsv) {
    let language_code;
    this.state.languagecode.forEach(c => {
      if (c.name === Language) {
        language_code = c.code;
      }
    })
    // let language_code = Constants.Language_Code[Language];
    // let source = this.state.selectedlanguage.label !== 'English' ? 'en' : ''
    this.translate_mission(language_code, page, exportCsv)
  }
  /*  Handles the function to validate the language code.*/
  convert_language_code_page(Language, page, exportCsv) {
    let language_code;
    this.state.languagecode.forEach(c => {
      if (c.name === Language) {
        language_code = c.code;
      }
    })
    // let language_code = Constants.Language_Code[Language]
    // let source = this.state.selectedlanguage.label !== 'English' ? 'en' : ''
    this.translate_mission_page(language_code, page, exportCsv)
  }
  /* Unused function.*/
  decodeStr(str) {
    return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    });
  }
  /*  Handles the function to fetch the initial missions.*/
  translate_mission = async (language_code, page, exportCsv) => {
    let missionResponses = this.state.missionResponses
    for (let i = 0; i < missionResponses.length; i++) {
      let r = missionResponses[i];
      if (r.responses && r.responses.length > 0) {
        for (let b = 0; b < r.responses.length; b++) {
          let a = r.responses[b];
          if (a.type === 'input' && a.answers && a.answers !== null && a.answers !== ""
            && a.answers !== {} && a.answers.text && a.answers.text !== "") {
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
              missionResponses[i].responses[b].answers.text = entities.decode(answ);
              this.setState({ missionResponses })
            }
          }
          else if (a.type === "barcode" && a.answers && a.answers !== null && a.answers !== ""
            && a.answers !== {} && a.answers.product_name && a.answers.product_name !== "") {
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
              this.setState({ missionResponses })
            }

          }
        }
      }
      if (this.state.missionResponses.length > 0 && i === (this.state.missionResponses.length - 1)) {
        if (page !== '' && page !== null && page !== undefined) {
          this.doTheThingpage(page, exportCsv);
        }
        else {
          this.doTheThing();
          this.stopLoading();
        }
      }
    }

  }
  /*  Handles the function to fetch all the missions.*/
  translate_mission_page = async (language_code, page, exportCsv) => {
    let missionResponses = this.state.missionResponses_temp
    for (let i = 0; i < missionResponses.length; i++) {
      let r = missionResponses[i];
      if (r.responses && r.responses.length > 0) {
        for (let b = 0; b < r.responses.length; b++) {
          let a = r.responses[b];
          if (a.type === 'input' && a.answers && a.answers !== null && a.answers !== ""
            && a.answers !== {} && a.answers.text && a.answers.text !== "") {
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
              this.setState({ missionResponses_temp })
            }
          }
          else if (a.type === "barcode" && a.answers && a.answers !== null && a.answers !== ""
            && a.answers !== {} && a.answers.product_name && a.answers.product_name !== "") {
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
              let missionResponses_temp = this.state.missionResponses_temp
              missionResponses_temp[i].responses[b].answers.product_name = entities.decode(answ);
              this.setState({ missionResponses_temp })
            }

          }
        }
      }
      if (this.state.missionResponses_temp.length > 0 && i === (this.state.missionResponses_temp.length - 1)) {
        this.doTheThingpage(page, exportCsv);
      }
    }

  }
  /*  Handles the function to design the column header and column definition for initial mission data.*/
  doTheThing = async (page) => {
    this.setState({
      rowClassRules: {
        'status-New': function (params) { return params.node.data.status === 'New' },
        'status-Hold': function (params) { return params.node.data.status === 'Hold' },
        'status-Inprogress': function (params) { return params.node.data.status === 'In Progress' },
        'status-Accepted': function (params) { return params.node.data.status === 'Accepted' },
        'status-Invalid': function (params) { return (params.node.data.status === 'Invalid' || params.node.data.status === 'Re-Publish') },
        'status-Fraudulent': function (params) { return params.node.data.status === 'Fraudulent' },
      }

    })
    let columns = [
      {
        headerName: "Customer ID",
        field: "customer_id",
        type: "g",
        editable: false,
        width: 120,
        lockPosition: true,
        headerTooltip: "Customer ID",
        cellStyle: {
          'margin-top': '10px'
        }
      },
      {
        headerName: "Consumer Type",
        field: "consumerType",
        headerTooltip: "Consumer Type",
        type: "g",
        editable: false,
        width: 120,
        lockPosition: true,
        cellStyle: {
          'margin-top': '10px'
        },
        filter: "customFilter"
      },

      {
        headerName: "Action",
        field: "preview",
        lockPosition: true,
        type: "g",
        width: 120,
        cellRenderer: "previewButton"
      },
      {
        headerName: "Payment",
        field: "payment",
        lockPosition: true,
        type: "g",
        width: 120,
        cellRenderer: "payButton",
        cellRendererParams: {
          paymentEnabledMission: this.state.paymentEnabled
        },

      },

      { headerName: "Reviewed", field: "reviewed", type: "g", filter: "customFilter", editable: false, width: 120, lockPosition: true, cellRendererFramework: CheckboxRenderer },
      {
        headerName: "Status", field: "status", type: "g", filter: "customFilter", editable: false, lockPosition: true, cellRendererFramework: CreateStatusSpan,
        cellRendererParams: {
          statusOptions: this.state.statusOptions         // Complementing the Cell Renderer parameters
        }
      }


    ];

    // add lower case names for comparision
    let tableFields = [
      "customer id"
    ];

    // Add Questions to the Table Header (tableFields)
    let backupphotos = this.state.backupphotos;
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
      if (q.type === 'barcode') {
        let barcode = cloneDeep(qe);
        barcode.field = qe.field + '-B_oimage';
        barcode.cellRenderer = "barcoderenderer";
        columns.push(barcode);
        barcode = cloneDeep(qe);
        barcode.field = qe.field + '-B_image';
        barcode.cellRenderer = "barcoderenderer";
        columns.push(barcode);
        barcode = cloneDeep(qe);
        barcode.field = qe.field + '-B_number';
        columns.push(barcode);
        qe.field = qe.field + '-B_details';
        columns.push(qe);

      }
      else if (q.type === 'scale' || q.type === 'choice') {
        qe.cellRenderer = "createImageSpan";
        qe.filter = "customFilter";
        columns.push(qe);
      }
      else if (q.question.properties.media_type === 'video' || q.question.properties.media_type === 'audio') {
        qe.cellRenderer = "createVideoSpan";
        qe.mediaType = q.question.properties.media_type;
        qe.width = 300;
        columns.push(qe);
      }
      else if (q.question.properties.media_type === 'image') {
        if (backupphotos === true) {
          let img = cloneDeep(qe);
          img.field = qe.field + '-U_oimage';
          img.cellRenderer = "barcoderenderer";
          columns.push(img);
        }
        qe.cellRenderer = "barcoderenderer";
        columns.push(qe);
      }
      else if (q.type === "capture") {
        let capture = cloneDeep(qe);
        // capture = cloneDeep(qe);
        capture.cellRenderer = "barcoderenderer";
        columns.push(capture);
        if (backupphotos === true) {
          capture.field = qe.field + '-C_oimage';
          capture.cellRenderer = "barcoderenderer";
          columns.push(capture);
          if (q.question.properties.instruction_enabled && q.question.properties.instruction_enabled === 1) {
            capture = cloneDeep(qe);
            capture.field = qe.field + '-C_instext';
            columns.push(capture);
          }
          if (q.question.properties.scale_enabled && q.question.properties.scale_enabled === 1) {
            capture = cloneDeep(qe);
            capture.field = qe.field + '-C_scale';
            capture.cellRenderer = "createImageSpan";
            columns.push(capture);
          }
        }
      }
      else {
        qe.cellStyle = {
          'white-space': 'normal'
        }
        columns.push(qe);
      }
      tableFields.push(qe.headerName.toLowerCase());
    });
    // Add Metrics to the Table Header (tableFields)
    this.state.metrics_row.forEach(m => {
      let qe = {};
      qe.headerName = m.row_name;
      qe.field = "m" + m.id;
      qe.type = "m";
      qe.id = m.id;
      qe.autoHeight = true;
      qe.filter = "customFilter";
      qe.headerTooltip = m.row_name;
      qe.cellStyle = {
        'white-space': 'normal'
      }
      columns.push(qe);
      tableFields.push(m.row_name.toLowerCase());
    });
    let columnDefs = columns.concat([
      {
        headerName: "Survey Tag Id",
        field: "survey_tag_id",
        type: "g",
        editable: false,
        width: 100,
        headerTooltip: "Survey Tag Id"
      },
      {
        headerName: "Estimated Time in Minutes",
        field: "estimatedTime",
        type: "g",
        editable: false,
        width: 100,
        headerTooltip: "Estimated Time in Minutes",
      },
      {
        headerName: "Actual Time in Minutes",
        field: "actualTime",
        type: "g",
        editable: false,
        width: 100,
        headerTooltip: "Actual Time in Minutes",
      },
      {
        headerName: "Email", field: "email", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        },
        headerTooltip: "Email",
      },
      {
        headerName: "Contact", field: "mobile", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        },
        headerTooltip: "Contact",
      },
      {
        headerName: "Address", field: "address", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        },
        headerTooltip: "Address",
      },
      {
        headerName: "Mobile Details", field: "device", type: "g", editable: false, cellStyle: {
          'white-space': 'normal'
        },
        headerTooltip: "Mobile Details",
      },
      {
        headerName: "Points",
        field: "points",
        type: "g",
        editable: false,
        width: 100,
        headerTooltip: "Points",
      },
      {
        headerName: "Last Accessed Time",
        field: "surveyTagUpdated",
        type: "g",
        editable: false,
        headerTooltip: "Last Accessed Time",
      }
    ]);
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
    await this.setState({
      columnDefs: updatedColumnDefs,
      tableFields: tableFields
    });
    let sepMission = [];
    let survey_tag_id = Number;
    let metrics_data = []
    this.state.missionResponses.forEach(missResp => {
      if (missResp.metrics_data.length > 0) {
        missResp.metrics_data.forEach(m => {
          metrics_data.push(m)
        })
      }
      if (missResp.responses.length >= 0) {
        let payment = missResp.payment_data.length > 0 ? missResp.payment_data[0] : { 'paymentEnabled': 0 };
        let paypalEmail = missResp.paypalEmail ? missResp.paypalEmail : "";
        payment.paypalEmail = paypalEmail;
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
          payment: payment,
          // innermost object
          answers: answs,
          address: address,
          device: device,
          status: this.getStatusName(status),
          surveyTagUpdated: new Date(surveyTagUpdated === "" ? missResp.updated_on : surveyTagUpdated).toLocaleString(),
          // response fields
          actualTime: status >= 2 ? Math.floor(((Date.parse(surveyTagUpdated === "" ? missResp.updated_on : surveyTagUpdated) - Date.parse(surveyTagCreated === "" ? missResp.created_on : surveyTagCreated)) / 1000) / 60) : "",
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
    this.doTableData(sepMission, page);
  };
  /*  Handles the function to match initial mission data with column definition.*/
  doTableData = (sepMission, page) => {
    let listItems = [];
    sepMission.forEach((missionResponse, index) => {
      let temp = this.formatData(missionResponse)
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
      this.getMissionResponsepage(this.state.selectedlanguage.value, id, defaultApiPage, page)
    }
  };
  /*  Handles the function to design the column header and column definition.*/
  doTheThingpage = (page, exportCsv) => {
    let sepMission = [];
    let survey_tag_id = Number;
    this.state.missionResponses_temp.forEach(missResp => {
      if (missResp.responses.length >= 0) {
        let payment = missResp.payment_data.length > 0 ? missResp.payment_data[0] : { 'paymentEnabled': 0 };
        let paypalEmail = missResp.paypalEmail ? missResp.paypalEmail : "";
        payment.paypalEmail = paypalEmail;
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
          //answs.loop_number = x.loop_number ? x.loop_number : null;
          // answs.loop_set = x.loop_set ? x.loop_set : null;
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
          payment: payment,
          // innermost object
          answers: answs,
          address: address,
          device: device,
          status: this.getStatusName(status),
          surveyTagUpdated: new Date(surveyTagUpdated === "" ? missResp.updated_on : surveyTagUpdated).toLocaleString(),
          // response fields
          actualTime: status >= 2 ? Math.floor(((Date.parse(surveyTagUpdated === "" ? missResp.updated_on : surveyTagUpdated) - Date.parse(surveyTagCreated === "" ? missResp.created_on : surveyTagCreated)) / 1000) / 60) : "",
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
    this.doTableDatapage(sepMission, page, exportCsv);
  }
  /*  Handles the function to match formated mission data with column definition and return the data in expected format of aggrid.*/
  doTableDatapage = (sepMission, page, exportCsv) => {
    let listItems = [];
    sepMission.forEach((missionResponse, index) => {
      let temp = this.formatData(missionResponse)
      temp.column_index = index;
      listItems.push(temp);
    });
    // let loadlistItems = loadedlistItems.concat(listItems);
    let loadlistItems = listItems.concat(loadedlistItems);
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
  /*  Handles the function to form missions data based on question type.*/
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
        if (ans !== {} && ans.type && ans.type === 'barcode' && ans.answers && ans.answers.image) {
          if (c.field.includes('-B_oimage')) {
            arr[c.field] = [0, ans.answers.image_orig ? (ans.answers.image_orig + '?thumbnail=yes') : (ans.answers.image + '?thumbnail=yes'), ans.answers.image_orig ? ans.answers.image_orig : ans.answers.image]
          }
          else if (c.field.includes('-B_image')) {
            arr[c.field] = [ans.answers.hide ? ans.answers.hide === 1 ? 1 : 0 : 0, ans.answers.image + '?thumbnail=yes', ans.answers.image]
          }
          else if (c.field.includes('-B_number') && (ans.answers && ans.answers.barcode_id)) {
            arr[c.field] = ans.answers.barcode_id
          }
          else if (c.field.includes('-B_details') && (ans.answers && ans.answers.product_name)) {
            arr[c.field] = ans.answers.product_name
          }
        }
        else if (ans !== {} && ans.type && ans.type === 'upload' && ans.answers && ans.answers.media_type && ans.answers.media_type === 'image' && ans.answers.media) {
          if (c.field.includes('-U_oimage')) {
            arr[c.field] = [0, ans.answers.image_orig ? (ans.answers.image_orig + '?thumbnail=yes') : (ans.answers.media + '?thumbnail=yes'), ans.answers.image_orig ? ans.answers.image_orig : ans.answers.media]
          }
          else {
            arr[c.field] = [ans.answers.hide ? ans.answers.hide === 1 ? 1 : 0 : 0, ans.answers.media + '?thumbnail=yes', ans.answers.media]
          }
        }
        else if (ans !== {} && ans.type && ans.type === 'capture' && ans.answers && ans.answers.image) {
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
            arr[c.field] = [ans.answers.hide ? ans.answers.hide === 1 ? 1 : 0 : 0, ans.answers.image + '?thumbnail=yes', ans.answers.image];
          }
        }
        else if (ans !== {} && ans.type && ans.type !== 'info' && ans.type !== 'input' && ans.type !== 'gps') {
          this.state.questions.forEach((q, i) => {
            if (ans.question_id === q.question_id && ans.type && q.type && ans.type === q.type) {
              arr[c.field] = this.formatAnswer(ans, q.question.properties);
            }
          })
        } else {
          arr[c.field] = this.formatAnswer(ans, false);
        }
      } else if (c.type === "m") {
        arr[c.field] = this.getMissionMetric(
          missionResponse.survey_tag_id,
          c.id
        );
      }
    });
    return arr;
  };
  /*  Handles the function to form metric data.*/
  getMissionMetric = (survey_tag_id, metrics_id) => {
    let data = "";
    this.state.metrics_data.forEach(m => {
      if (survey_tag_id === m.survey_tag_id && metrics_id === m.metrics_id)
        data = m.metrics_data;
    });
    return data;
  };
  /*  Handles the function to format answer data to extract user response.*/
  formatAnswer(a, q) {
    let ans = "";
    let anstext = "";
    let ans_img = "";
    switch (true) {
      case a.type === "choice" && a.answers.choice_type === "single" && a.answers.multilevel === 0:
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
      case a.type === "choice" && a.answers.choice_type === "single" && a.answers.multilevel === 1 && a.answers.selected_option.length > 0:
        ans = [];
        a.answers.selected_option
          .map(
            as =>
              q.options.forEach(o => {
                if (as.id === o.id && o.sublabel) {
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
                if (as.id === o.id && o.sublabel) {
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
      case a && a.type === "scale" && a.answers.scale_type === "maxdiff":
        return [
          a.answers.selected_option.length > 0
            ? a.answers.selected_option
              .map(
                as =>
                  " " +
                  as.label +
                  ":" +
                  (as.isLeastCheck === true ? "L" : "M")
              )
              .join() + ""
            : "",
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
          ans = [a.answers.scale_image_id, ""];
        }
        return ans
      default:
        return "";
    }
  }
  /*  Handles the function to return scaletable option. */
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
  /*  Handles the function to get scale label by using id. */
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
  /*  Handles the function to format the data for preview. */
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
            <video height="150" width="200" controls disablePictureInPicture={true} preload='metadata' controlslist={"nodownload"} src={prop[prop.length - 2] + '' + '#t=0.2'} />
          )
        }
      }

      else if (prop[prop.length - 1] !== "audio" || prop[prop.length - 1] !== "video") {
        let textImages = [];
        let text = prop[0] ? prop[0] : "";
        let opacity = prop[0] ? prop[0] === 1 ? 0.2 : 1 : 1;
        // hide property for image
        text = prop[0] === 1 ? "" : text;
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
            <div style={textImages.length > 0 ? { width: "50px", height: "50px", opacity: opacity } : {}}>
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
  /*  
   *  Params used - answer_id,consumer_id,question_id,question_type,answer,survey_answer_tag_id to form the data.
   *  used the api to update the edited response.
   */
  editSurveyAnswerService = (
    answer_id,
    consumer_id,
    question_id,
    question_type,
    answer,
    survey_answer_tag_id
  ) => {
    let data = {
      id: answer_id,
      consumer_id: consumer_id,
      question_id: question_id,
      question_type: question_type,
      answer: { text: answer },
      survey_answer_tag_id: survey_answer_tag_id
    };
    api2
      .patch("web_survey_answers", data)
      .then(resp => {

      })
      .catch(error => {
        console.error(error);
      });
  };
  /*  
   *  Params used - survey_tag_id,mission_id,metrics_data,metrics_id to form the data.
   *  used the api to add new metric column data to the server.
   */
  addMetricDataService = (
    survey_tag_id,
    mission_id,
    metrics_data,
    metrics_id,
    field
  ) => {
    let metricData = {
      survey_tag_id: survey_tag_id,
      mission_id: mission_id,
      metrics_data: metrics_data,
      metrics_id: metrics_id
    };
    api2
      .post("v1/survey_report/metrics_data", metricData)
      .then(resp => {
        if (resp.status === 200) {
          this.api.getFilterInstance(field);
          this.metricFilterUpdate(this.state.missionId, field)
          if (this.api) {
            var rowNode = this.api.getRowNode(survey_tag_id);
            let data = rowNode.data;
            data[field] = metrics_data
            rowNode.setData(data);
          }
          this.setState({
            openModal: false,
            selectedAnswer: {},
            selectedQuestion: {}
          });
          if (resp.id) {
            metricData.id = resp.id;
            let metrics_data = this.state.metrics_data;
            metrics_data.push(metricData);
            this.setState({
              metrics_data: metrics_data
            });
          }
          else {
            this.state.metrics_data.forEach(m => {
              if (survey_tag_id === m.survey_tag_id && metrics_id === m.metrics_id)
                m.metrics_data = metrics_data;
            });
          }
        }
        else {
          this.setState({
            openModal: false,
            selectedAnswer: {},
            selectedQuestion: {}
          });
        }
      })
      .catch(error => {
        console.error(error);
        this.setState({
          openModal: false,
          selectedAnswer: {},
          selectedQuestion: {}
        });
      });
  };
  /*  
   *  Params used - mission_id,column name.
   *  used the api to add new metric column to the server.
   */
  addColumn = () => {
    if (this.state.tableFields.indexOf(this.state.addColName.toLowerCase()) >= 0) {
      this.ShowNotification("Error Duplicate Column Name", "danger");
    } else {
      api2
        .post("v1/survey_report/metrics", {
          mission_id: this.state.missionId,
          metrics_name: this.state.addColName
        })
        .then(resp => {
          if (resp.status === 200) {
            this.state.tableFields.push(this.state.addColName);
            this.ShowNotification("New Column Added", "success");
            this.metricFilter(this.state.missionId);
            let metrics_row = [...this.state.metrics_row];
            metrics_row.push({
              id: resp.data.id,
              row_name: this.state.addColName
            });
            this.saveColumnOrder({
              mission_id: this.state.missionId,
              column_order: {}
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
  /*  
 *  Params used - mission_id.
 *  used the api to filter metric data.
 */
  metricFilter = (missionId) => {
    api2.get("v1/survey_report/metric_filter?mission_id=" + missionId)
      .then(resp => {

        this.setState({
          filteredMetricList: resp && resp.data && resp.data.result ? resp.data.result : []
        })
      })
  }
  /*  
   *  Params used - mission_id.
   *  used the api to delete the metric column.
   */
  deleteColumn = (id) => {
    api2
      .delete("v1/survey_report/metrics", { data: { id: id } })
      .then(resp => {
        if (resp.status === 200) {
          this.metricFilter(this.state.missionId);
          let metrics_row = [...this.state.metrics_row];
          let metrics_data = [...this.state.metrics_data];
          let column_order = this.columnApi.getColumnState();
          let columnDefs = [...this.state.columnDefs];
          let tableFields = [...this.state.tableFields];
          metrics_row.forEach((m, index) => {
            if (m.id === id) {
              let row_name = m.row_name.toLowerCase()
              tableFields.forEach((t, index1) => {
                if (t === row_name) {
                  tableFields.splice(index1, 1);
                }
              })
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
            this.saveColumnOrder({
              mission_id: this.state.missionId,
              column_order: { order: "modified", columns: updatedColumns }
            });
            set_column_order = { order: "modified", columns: updatedColumns };
          }
          this.setState(
            {
              metrics_row: metrics_row,
              metrics_data: metrics_data,
              columnDefs: columnDefs,
              column_order: set_column_order,
              tableFields: tableFields
            });

          this.ShowNotification("Column Deleted Successfully", "success");
        }
      })
      .catch(error => {
        console.error(error);
      });
  };
  /* Handles the function to get the status name using id*/
  getStatusName = id => {
    let statName = " ";
    this.state.statusOptions.forEach(s => {
      if (s.value === id) statName = s.label;
    });
    return statName;
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
        if (c.headerName !== 'Action' && c.headerName !== 'Payment' && c.field === k) {
          list.push(
            <Fragment key={index}>
              <Grid container alignItems="center">
                <Typography gutterBottom variant="h6" style={{ marginLeft: 20, fontSize: 12, fontWeight: 600 }}>
                  &bull; {c.id ? c.id + '_' + c.headerName : c.headerName}
                </Typography>
              </Grid>
              <Grid container alignItems="center" style={{ marginLeft: 40, fontSize: 12 }}>
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
  /* Unused function */
  getLightboxback() {
    return {
      //background: "rgba(0, 0, 0, 0.8)"
      background: "transparent",
      left: "58%",
      transform: "translateX(-50%)",
      boxShadow: "none",
      padding: 0,
      width: "unset"
    };
  }
  /* Handles the event to close the photoeditor popup. */
  closeLightbox = () => {
    this.setState({

      openPopup: false,
      titles: []
    });
  }
  /* Handles the event to open the photoeditor popup. */
  openLightbox() {
    this.setState({

      openPopup: true
    });
  }
  /* Function call from child component to update the cell data,pagecount and number of rows per page. */
  methodFromParent(cell) {
    this.setState({
      preview: true,
      previewMission: cell.data,
      page: 0,
      pagecount: this.state.datapagecount,
      rowsPerPage: this.state.rowsPerPage,
    });
  }
  /* Handles the params to filter the data. */
  // onFilterChangedGrid = (params) => {
  //   let getFilterModel = params.api.getFilterModel();
  //   let isAnyFilterPresent = this.api.isAnyFilterPresent();
  //   let currentpage = this.api.paginationGetCurrentPage();
  //   let RowCount = this.api.paginationGetRowCount()
  //   let colDef = this.state.columnDefs;
  //   let activemenu = [];
  //   if (isAnyFilterPresent) {
  //     if (this.state.listItems.length < loadedlistItems.length) {
  //       this.setState({ listItems: loadedlistItems })
  //       this.api.setRowData(loadedlistItems)
  //       this.setState({
  //         page: currentpage,
  //         pagecount: RowCount
  //       }, () => {
  //         this.api.resetRowHeights()
  //       })
  //     }
  //     else {
  //       this.setState({
  //         page: currentpage,
  //         pagecount: RowCount
  //       })
  //     }
  //   } else {
  //     this.api.paginationGoToPage(0)
  //     this.setState({
  //       page: 0,
  //       pagecount: this.state.datapagecount,
  //       // rowsPerPage: rowsPerPage,
  //     })
  //   }
  //   colDef.forEach(c => {
  //     if ((getFilterModel[c.field] !== undefined && getFilterModel[c.field].value && getFilterModel[c.field].value.length > 0)
  //       || (getFilterModel[c.field].filter && getFilterModel[c.field].filter !== undefined)) {
  //       activemenu.push(c.field)
  //     }
  //   })
  //   this.setState({
  //     activefiltermenu: activemenu
  //   }, () => { this.api.refreshHeader(); })

  // }

  onFilterChangedGrid = (params) => {
    let getFilterModel = params.api.getFilterModel();
    let isAnyFilterPresent = this.api.isAnyFilterPresent();
    let currentpage = this.api.paginationGetCurrentPage();
    let RowCount = this.api.paginationGetRowCount()
    // let totalpage = this.api.paginationGetTotalPages();
    let colDef = this.state.columnDefs;
    let activemenu = [];
    if (isAnyFilterPresent) {
      if (this.state.listItems.length < loadedlistItems.length) {
        // this.state.listItems = loadedlistItems;
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

    colDef.map(c => {
      // if (getFilterModel[c.field] !== undefined && (getFilterModel[c.field].value && getFilterModel[c.field].value.length > 0
      //   || getFilterModel[c.field].filter && getFilterModel[c.field].filter !== undefined)) {
      //   activemenu.push(c.field)
      // }
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
          this.setState({ listItems: loadedlistItems })
          this.api.setRowData(loadedlistItems)
          this.state.loadpage.push(page)
          this.setState({
            // listItems:loadedlistItems,
            page: page,
          }, () => {
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
  backupphotos = () => {
    this.setState({ backupphotos: !this.state.backupphotos }, () => { this.doTheThing() });
  }
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
    const { classes } = this.props;
    const { msgColor, br, message, page, pagecount, rowsPerPage } = this.state;
    this.apikey = localStorage.getItem("api_key")
    // console.log("agmissionResponse 3472 this.apikey")
    // console.log(this.apikey)
    var hideButton = true
    if (localStorage.getItem('role') !== null && localStorage.getItem('role') !== "CLIENT") {
      hideButton = false
    }
    if (this.state.Createclientscreen === true) {
      console.log(this.state.clientscreendata)
      return <Redirect
        to={{
          pathname: '/home/create-client-screen',
          state: { data: this.state.clientscreendata, detail: this.state.client_response }
        }}
      />;
    }
    let body_class = this.props.fullWidth
      ? "body-full body-full-expanded"
      : "body-full body-full-collapsed";
    return (
      <div className={body_class}>
        <MuiThemeProvider theme={theme}>
          <div className={classes.gridHeader}>
            <Grid container>
              <div style={{ width: "16%" }}>
                <GridItem>
                  <Select style={{ fontSize: "12px" }}
                    placeholder="Department"
                    options={this.state.departments}
                  />
                </GridItem>
              </div>
              <div style={{ width: "16%" }}>
                <GridItem>
                  <Select style={{ fontSize: "12px" }}
                    placeholder="Client"
                    options={this.state.clients}
                  />
                </GridItem>
              </div>
              <div style={{ width: "16%" }}>
                <GridItem>
                  <Select style={{ fontSize: "12px" }}
                    placeholder="Project"
                    value={this.state.selectedproj}
                    options={this.state.projects}
                    onChange={this.handleProjectChange}
                  />
                </GridItem>
              </div>
              <div style={{ width: "16%" }}>
                <GridItem>
                  <Select style={{ fontSize: "12px" }}
                    placeholder="Mission"
                    value={this.state.selectedMission}
                    options={this.state.missions}
                    onChange={this.handleMissionChange}
                  />
                </GridItem>
              </div>
              <div style={{ width: '36%', textAlign: 'right' }}>
                <div style={{ width: '150px', display: 'inline-block', textAlign: "left" }}>
                  <GridItem>
                    <Select
                      placeholder="Language"
                      isDisabled={this.state.missionResponses.length < 1}
                      style={{ fontSize: "12px" }}
                      options={this.state.languagelist}
                      value={this.state.selectedlanguage}
                      onChange={this.handleLanguageChange}
                    />
                  </GridItem>
                </div>
                <div style={{ display: 'inline-block' }}>
                  <GridItem>
                    <Button
                      style={{
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
                </div>
              </div>
            </Grid>
            <br />
            {
              hideButton === false
                ?
                <Grid container>
                  <Button
                    style={{
                      margin: "0px 8px",
                      fontSize: "12px",
                      textTransform: "capitalize",
                      backgroundColor: this.state.selectedMission === "" ? "rgba(0, 0, 0, 0.12)" : "#f39000",
                      color: this.state.selectedMission === "" ? "rgba(0, 0, 0, 0.26)" : "#fff",
                      width: "150px",
                      paddingLeft: 10,
                      paddingRight: 10
                    }}
                    variant="contained"
                    disabled={this.state.selectedMission === "" ? true : false}
                    onClick={() => { this.setState({ Createclientscreen: true }) }}
                  >
                    {this.state.client_response === false ? "Create Client View" : "View Client View"}
                  </Button>
                  <Button
                    style={{
                      margin: "0px 8px",
                      fontSize: "12px"
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => this.getMissionResponse(this.state.selectedlanguage.value, defaultApirecordId, defaultApiPage)}
                    disabled={this.state.missionResponses.length === 0}
                  >
                    Refresh
                  </Button>
                  <Button
                    style={{
                      minWidth: "120px",
                      margin: "0px 8px",
                      fontSize: "12px"
                    }}
                    variant="contained"
                    color="primary"
                    onClick={this.clearFilter}
                    disabled={this.state.missionResponses.length === 0}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    style={{
                      margin: "0px 8px",
                      fontSize: "12px"
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      this.setState({ openrestore: true });
                    }}
                    disabled={this.state.missionResponses.length === 0}
                  >
                    Reset Columns
                  </Button>
                  <Button
                    style={{
                      margin: "0px 8px",
                      fontSize: "12px"
                    }}
                    variant="contained"
                    color="primary"
                    onClick={() => this.setState({ isAddColumnPopupOpen: true })}
                    disabled={this.state.missionResponses.length === 0}
                  >Add Columns</Button>
                  <Button
                    style={{
                      margin: "0px 8px",
                      fontSize: "12px",
                      padding: '0px',
                      backgroundColor: this.state.backupphotos !== null ? this.state.backupphotos === false ? "#074e9e" : "#f39000" : ''
                      // color: this.state.backupphotos === false ? "rgba(0, 0, 0, 0.26)" : "#fff",
                    }}
                    variant="contained"
                    color="primary"
                    onClick={this.backupphotos.bind(this)}
                    disabled={this.state.missionResponses.length === 0}
                  ><img src={noun_DuplicateImage} style={{ width: '45px', height: '36px' }} alt="expandArrow" />
                  </Button>
                  <div style={{ width: '150px', margin: "0 55px 0 auto", display: "inline-block" }}>
                    <Form.Control
                      type="text"
                      name="quickFilterText"
                      value={this.state.quickFilterText}
                      onChange={this.handleInputChange}
                      style={{ height: 36, borderRadius: "2rem" }}
                      placeholder="Search"
                    />
                  </div>
                </Grid>
                :
                null
            }
            <br />
            <Typography
              variant="h6"
              style={{
                fontSize: 16,
                float: "left",
                marginRight: "15px",
                lineHeight: "42px"
              }}
            >Survey Responses ({this.state.sepMission.length})</Typography>
          </div>
          <Fragment>
            <div className="response-box"
              style={{ height: '75%', width: '100%' }}>
              {
                this.state.preview
                  ?
                  <GridContainer>
                    <GridItem xs={6} sm={6} md={6}>
                      <Card style={{ marginTop: 20 }}>
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
                        <List component="nav">{this.buildPreview()}</List>
                      </Card>
                    </GridItem>
                    <GridItem xs={6} sm={6} md={6}>
                      <div style={{
                        height: "100%",
                        width: "100%",
                        marginTop: 20,
                      }}
                      >
                        <div
                          className="ag-theme-balham"
                          style={{
                            height: "90%",
                            width: "100%",
                          }}
                        >
                          <AgGridReact
                            // listening for events
                            animateRows={true}
                            rowClassRules={this.state.rowClassRules}
                            onGridReady={this.onGridReady}
                            onRowSelected={this.onRowSelected}
                            onCellClicked={this.onCellClicked}
                            onModelUpdated={this.calculateRowCount}
                            onColumnMoved={this.columnMoved}
                            onColumnResized={this.onColumnResized}
                            // rowData={this.state.listItems}
                            //onCellValueChanged={this.onCellValueChanged}
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
                              // sortable: true,
                              filter: true,
                              lockVisible: true,
                              headerComponentParams: {
                                menuIcon: "fa-bars",
                                menuIconactive: "fa-bars",
                                deleteIcon: "fa-trash-alt"
                              },
                              autoHeight: true
                            }}
                            onColumnDelete={this.deleteColumn}
                            updateRowData={this.updateRowData}
                            showNotification={this.ShowNotification}
                            questions={this.state.questions}
                            filteredMetricList={this.state.filteredMetricList}
                            filteredconsumertype={this.state.filteredconsumertype}
                            activefiltermenu={this.state.activefiltermenu}
                            pagination={true}
                            paginationPageSize={rowsPerPage}
                            onFilterChanged={this.onFilterChangedGrid}
                            suppressPaginationPanel={true}
                            enableBrowserTooltips={true}
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
                            </b></div>
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

                    </GridItem>
                  </GridContainer>
                  :
                  <div style={{
                    height: "100%",
                    width: "100%",
                  }}
                  >
                    <div
                      className="ag-theme-balham"
                      style={{
                        height: "90%",
                        width: "100%",
                      }}
                    >
                      <AgGridReact
                        // listening for events
                        animateRows={true}
                        rowClassRules={this.state.rowClassRules}
                        onGridReady={this.onGridReady}
                        onRowSelected={this.onRowSelected}
                        onCellClicked={this.onCellClicked}
                        onModelUpdated={this.calculateRowCount}
                        onColumnMoved={this.columnMoved}
                        onColumnResized={this.onColumnResized}
                        rowData={this.state.listItems}
                        //onCellValueChanged={this.onCellValueChanged}
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
                          comparator: customComparator,
                          resizable: true,
                          // sortable: true,
                          filter: true,
                          lockVisible: true,
                          headerComponentParams: {
                            menuIcon: "fa-bars",
                            deleteIcon: "fa-trash"
                          },
                          autoHeight: true
                        }}
                        onColumnDelete={this.deleteColumn}
                        updateRowData={this.updateRowData}
                        showNotification={this.ShowNotification}
                        questions={this.state.questions}
                        filteredMetricList={this.state.filteredMetricList}
                        filteredconsumertype={this.state.filteredconsumertype}
                        activefiltermenu={this.state.activefiltermenu}
                        pagination={true}
                        paginationPageSize={rowsPerPage}
                        onFilterChanged={this.onFilterChangedGrid}
                        suppressPaginationPanel={true}
                        enableBrowserTooltips={true}
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
              }
            </div>
          </Fragment>
          <Snackbar
            place="br"
            color={msgColor}
            open={br}
            message={message}
            closeNotification={() => this.setState({ br: false })}
            close
          />
          <Loading open={this.state.loading} onClose={this.handleClose} />
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openModal}
            onClose={this.handleCloseModal}
          >
            <PerfectScrollbar>
              <div style={this.getModalStyle()} className={classes.paper}>
                <Typography
                  variant="h6"
                  id="modal-title"
                  style={{ textAlign: "center" }}
                >
                  <div>
                    <ModalPopUp ref="modalPopUp"
                      selectedQuestion={this.state.selectedQuestion}
                      selectedAnswer={this.state.selectedAnswer}
                    />
                  </div>
                  <div className="model-footer"
                    style={{
                      paddingTop: "5px"
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
                      onClick={this.editSurveyAnswer}
                    >
                      Submit
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
                      Cancel
                    </Button>
                  </div>
                </Typography>
              </div>
            </PerfectScrollbar>
          </Modal>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openPopup}
            onClose={this.closePELightbox}
          >
            <div
              className="ImageEditor"
              style={{
                left: "283px"
              }}>
              <PhotoEditor
                ref={this.Editor}
                FilterRowData={this.state.FilterRowData}

                selectedAnswer={this.state.imageEdit}
                questions={this.state.questions}
                colDef={this.state.columnDefs}
                filteredMissions={this.state.missionResponses}
                openPopup={this.state.openPopup}
                closeLightbox={this.closePELightbox}
                updateAnswer={this.editSurveyAnswer}
              />
            </div>
          </Modal>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.pay}
            onClose={this.closePay}
          >
            <div style={this.getModalStyle()} className={classes.paymentpaper}>
              <Typography
                variant="h6"
                id="modal-title"
              >
                <div>
                  <PaymentPage
                    ref="Paymentref"
                    email={this.state.email}
                    paymentCurrency={this.state.paymentCurrency}
                    paymentAmount={this.state.paymentAmount}
                    paymentMissionName={this.state.paymentMissionName}
                    paymentProjName={this.state.paymentProjName}
                    finaldata={this.finaldata}
                    pay={this.state.pay}
                    selectedPaymentDetails={this.state.selectedPaymentDetails}
                    PaymentStatusUpdate={this.updateRowData}
                  //PaymentStatusUpdate={this.getMissionResponse}
                  />
                </div>
              </Typography>
            </div>
          </Modal>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.viewPaydetails}
            onClose={this.paymentViewDetails}
          >
            <div style={this.getModalStyle()} className={classes.paymentpaper}>
              <Typography
                variant="h6"
                id="modal-title"
              >
                <div>
                  <PaymentViewPage
                    selectedPaymentDetails={this.state.selectedPaymentDetails}
                    paymentViewDetails={this.paymentViewDetails}
                    paymentProjName={this.state.paymentProjName}
                  />
                </div>
              </Typography>
            </div>
          </Modal>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.openrestore}
            onClose={() => { this.setState({ openrestore: false }) }}
          >
            <div style={this.getModalStyle()} className={classes.paper}>
              <Typography
                variant="h6"
                id="modal-title "
                style={{ textAlign: "center" }}
              >
                <div className="restore-font"
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "initial"
                  }}
                >
                  Are you sure you want to restore column order
                </div>
                <div className="model-footer"
                  style={{
                    paddingTop: "5px"
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
                    onClick={this.restoreColumns}
                  >
                    Yes
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
                    onClick={() => { this.setState({ openrestore: false }) }}
                  >
                    No
                  </Button>
                </div>
              </Typography>
            </div>
          </Modal>
          <Dialog
            open={this.state.isAddColumnPopupOpen}
            onClose={() => this.setState({ isAddColumnPopupOpen: false, addColName: "" })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent
              style={{
                padding: "15px 30px"
              }}
            >
              <DialogContentText id="alert-dialog-description"
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  textTransform: "initial"
                }}
              >
                Please Name Your Column:
                <Form.Control
                  style={{ width: '300px', margin: '10px 0 0' }}
                  type="text"
                  name="addColName"
                  value={this.state.addColName}
                  onChange={this.handleInputChange}
                  placeholder="Column Name"
                />
              </DialogContentText>
              <DialogActions
                style={{
                  justifyContent: "center"
                }}>
                <Button
                  disabled={this.state.addColName === ""}
                  onClick={() => {
                    this.setState({ isAddColumnPopupOpen: false })
                    this.addColumn()
                  }} color="primary" autoFocus
                  style={{
                    color: "#fff",
                    backgroundColor: "#074e9e",
                    margin: "10px 0 0px 10px",
                    padding: "5px 16px",
                    fontSize: "12px"
                  }}>
                  Submit
                </Button>
                <Button onClick={() => this.setState({ isAddColumnPopupOpen: false, addColName: "" })} color="primary"
                  style={{
                    color: "#fff",
                    backgroundColor: "#074e9e",
                    margin: "10px 0 0px 10px",
                    padding: "5px 16px",
                    fontSize: "12px"
                  }}>
                  Cancel
                </Button>
              </DialogActions>
            </DialogContent>
          </Dialog>
        </MuiThemeProvider>
      </div >
    );
  }
}

export default withStyles(styles)(AgMissionResponse);

export class CreateImageSpan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      apiKey: localStorage.getItem("api_key")
    };
  }
  render() {
    let prop = this.state.value;
    let images = [];
    let text = prop && prop[0] ? prop[0] : "";
    if (prop && prop[1]) {
      images = prop[1].split(",")
    }
    // if (!(typeof text === 'string') || !(text instanceof String)) {
    //   text = ""
    // }
    if (typeof text === 'string' || text instanceof String) {
      text = text
    } else {
      text = ""
    }
    return (
      <span><p style={{
        marginTop: 0,
        marginBottom: 0
      }}>{text}</p>
        {images.length > 0 &&
          images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={image}
              // src={image + '&apikey' + this.state.apiKey}
              // alt={image + '&apikey' + this.state.apiKey}
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
      type: props.value && props.value[1] ? props.value[1] : "",
      apiKey: localStorage.getItem("api_key")
    };
  }
  render() {
    return (
      <div>
        {
          // this.state.value = this.state.value + '?token=' + this.state.apiKey,
          this.state.value !== "" && (this.state.type === 'video' || this.state.type === 'audio')
            ?

            <a href={this.state.value} download
              style={{
                float: "left", width: "20px", marginTop: 5, marginBottom: 5
              }}
            ><p><i className="fas fa-download"></i></p></a>
            :
            ""
        }
        {
          this.state.value !== "" && this.state.type === 'video'
            ?
            <video width="250" height="150" controls preload='metadata' controlsList="nodownload" disablePictureInPicture={true}
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
            :
            this.state.value !== "" && this.state.type === 'audio'
              ?
              <audio
                style={{
                  width: "-webkit-fill-available",
                  marginTop: 5,
                  marginBottom: 5,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  float: "right"
                }}
                controls preload='none' controlsList="nodownload" src={this.state.value} />
              :
              ""
        }
      </div>
    );
  }
}