/**
 * Weblink Component.
 * 
 * This component is used for web surveys.
 *
 * 
 */
import React from "react";
import TextField from "@material-ui/core/TextField";
import { StyledDropZone } from "react-drop-zone";
import api2 from "./helpers/api2";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Image from "material-ui-image";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import "./WebLink.css";

import { Alert, Row } from "react-bootstrap";

import * as Constants from "./helpers/constants";
import logo from "assets/img/white-logo.png";
import background from 'assets/img/survey.jpg';
import surveyWeb from 'assets/img/surveyWeb.png';
import defaultImage from 'assets/img/defaultImage.png';

import Snackbar from "components/Snackbar/Snackbar.jsx";
import MapContainer from "components/Map/MapContainer.jsx";
import queryString from 'query-string';

import Checkbox from "@material-ui/core/Checkbox";
import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';
import { Card } from "@material-ui/core";
import imageCompression from 'browser-image-compression';

const styles = {
  //style for font size
  resize: {
    fontSize: 50
  },
  tableScaleContainer: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-around",
    margin: 10
  },
  tableContainer: { paddingBottom: 18 },
  tableHeader: {
    height: 50,
    // backgroundColor: "#F6F6F6",
    flexDirection: "row",
    fontSize: 10
  },
  tableHeadText: {
    margin: 6,
    textAlign: "center",
    fontWeight: "100"
  },
  tableRowText: {
    margin: 6,
    textAlign: "center",
    fontWeight: "100"
  },
  tableRow: {
    flexDirection: "row",
    // backgroundColor: "#F6F6F6",
    backgroundColor: "#FFF",
    height: 40,
    fontSize: 10
  },
  tableCellFirstCol: {
    flex: 1,
    width: 100,
    alignItems: "center",
    // borderBottomWidth: 2,
    borderRightWidth: 2
  },
  tableCellCol: {
    flex: 1,
    alignItems: "center",
    // borderBottomWidth: 2,
    borderRightWidth: 0,
    borderLeftWidth: 0
  },
  tableDataWrapper: { marginTop: 1 },
  radioWhiteLeft: {
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    width: 20,
    height: 20,
    justifyContent: "center"
  }
};

const styleMedia = {
  opacity: "0.5",
  objectFit: "contain",
  paddingTop: "unset"
};

var latitude = "";
var longitude = "";
var values;
var idExists = false;
var mission_id = 0;

class WebLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],

      selectedAnswer: {},

      index: 0,
      selectedQuestion: {},

      updatedScaleOptions: [],
      updatedChoiceOptions: [],
      selectedChoiceOptions: [],
      selectedScaleOptions: [],
      tableHead: [],
      tableData: [],
      tableHeadRadio: [],
      tableDataRadio: [],
      answerRadio: [],
      answer: [],
      radioButtonname: [],
      selectedTableOptions: [],
      nextPage: false,
      Upload: {},
      updatedText: "",
      updatedAnswer: {},
      mobile: "",
      email: "",
      error: false,
      cust_id: 0,
      nextExists: false,
      msgColor: "info",
      message: "",
      br: false,
      alertMessage: 'Email / Mobile cannot be empty. Try again!',
      show: false,
      agree: true,
      enableTermsCond: false,
      otheroptionvalue: "",
      otheroptiontextbox: false


    };
    this.handleNext = this.handleNext.bind(this);
    this.WebLinkCredentialValidation = this.WebLinkCredentialValidation.bind(this);
  }

  componentDidMount() {
    values = queryString.parse(this.props.location.search);
    let keys = Object.keys(values);
    if (keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        if (values[keys[i]].length > 0) {
          if (keys[i] !== 'mission' & keys[i] !== 'name') {
            idExists = true;
            this.setState({ nextPage: true });
            this.getWebLinkID();
          }
          if (keys[i] === 'mission') {
            mission_id = values[keys[i]]
          }
        }
      }

    }

  }

  componentWillUnmount() {
    this.setState({
      questions: [],
      selectedAnswer: {},
      index: 0,
      selectedQuestion: {},
      updatedScaleOptions: [],
      updatedChoiceOptions: [],
      selectedChoiceOptions: [],
      selectedScaleOptions: [],
      tableHead: [],
      tableData: [],
      tableHeadRadio: [],
      tableDataRadio: [],
      answerRadio: [],
      answer: [],
      radioButtonname: [],
      selectedTableOptions: [],
      nextPage: false,
      Upload: {},
      updatedText: "",
      updatedAnswer: {},
      mobile: "",
      email: "",
      nextExists: false,
      cust_id: 0,
      msgColor: "info",
      message: "",
      br: false,
      show: false,
      agree: true,
      enableTermsCond: false,
      otheroptionvalue: "",
      otheroptiontextbox: false

    });
  }

  /* Used to empty the state variable. */
  ClearState() {
    this.setState({

      updatedScaleOptions: [],
      updatedChoiceOptions: [],
      selectedChoiceOptions: [],
      selectedScaleOptions: [],
      tableHead: [],
      tableData: [],
      tableHeadRadio: [],
      tableDataRadio: [],
      answerRadio: [],
      answer: [],
      radioButtonname: [],
      selectedTableOptions: [],
      Upload: {},
      updatedAnswer: {},
      updatedText: ""
    })
  }
  /* Handles the validation of question type and update the response based on question type. */
  setInitialState() {

    if (this.state.selectedQuestion.type === "input" && this.state.selectedAnswer && this.state.selectedAnswer.text) {
      this.setState({
        updatedText: this.state.selectedAnswer.text
      });
    }
    else if (
      this.state.selectedQuestion.type === "scale" &&
      this.state.selectedQuestion.properties.scale_type &&
      this.state.selectedQuestion.properties.scale_type === "scale"
    ) {
      this.setSelectedScaleOptions();
    } else if (
      this.state.selectedQuestion.type === "scale" &&
      this.state.selectedQuestion.properties.scale_type &&
      this.state.selectedQuestion.properties.scale_type === "table" &&
      this.state.selectedQuestion.properties.grid_type === "image"
    ) {
      this.setSelectedScaleTableImageOptions();
    } else if (
      this.state.selectedQuestion.type === "scale" &&
      this.state.selectedQuestion.properties.scale_type &&
      this.state.selectedQuestion.properties.scale_type === "table" &&
      this.state.selectedQuestion.properties.grid_type === "radio"
    ) {
      this.setSelectedScaleTableRadioOptions();
    } else if (this.state.selectedQuestion.type === "choice") {
      this.setSelectedChoiceOptions();
    } else if (this.state.selectedQuestion.type === "upload") {
      this.setUpload();
    }

  }

  /* Handles the google api to fetch the latitude and longitude. */
  async fetchLatitudeLongitude() {
    await navigator.geolocation.getCurrentPosition(position => {
      if (position.coords) {
        latitude = position.coords.latitude ? position.coords.latitude : ''
        longitude = position.coords.longitude ? position.coords.longitude : '';
      }
      else {
        this.fetchLatitudeLongitudeByAPI()
      }
    },
      err => {
        this.fetchLatitudeLongitudeByAPI()
      }
    )
  }
  fetchLatitudeLongitudeByAPI() {
    let myApiKey = Constants.GOOGLE_MAP;

    fetch(
      Constants.MAP_GEO_URI + myApiKey,
      {
        method: "POST"
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        let data = JSON.parse(JSON.stringify(responseJson));
        if (data) {
          latitude = data.location.lat ? data.location.lat : '';
          longitude = data.location.lng ? data.location.lng : '';
        }
      }).catch(async (error) => {
        console.log('Error', error)
      });

  }

  /* Used to format the question data for upload question and update the media to the state variable. */
  setUpload() {
    let upload = {};

    if (
      this.state.selectedAnswer &&
      this.state.selectedAnswer.media
    ) {
      upload["media"] = this.state.selectedAnswer.media;
      this.setState({
        Upload: upload
      });
    }


  }

  /* Used to format the question data for scale question and update the scale options. */

  setSelectedScaleOptions() {
    let updatedScaleOptions = [];

    this.state.selectedQuestion.properties.scale_content.forEach(qs => {
      let defaultSelection = false;
      if (
        this.state.selectedAnswer &&
        this.state.selectedAnswer.selected_option
      ) {
        this.state.selectedAnswer.selected_option.forEach(as => {
          if (as.id === qs.id) {
            defaultSelection = true;
          }
        });
      }
      updatedScaleOptions.push({
        id: qs.id,
        image_id: qs.image_id,
        value: qs.value,
        defaultValue: defaultSelection
      });
    });

    this.setState({
      updatedScaleOptions: updatedScaleOptions,
      selectedScaleOptions: this.state.selectedAnswer && this.state.selectedAnswer.selected_option ? this.state.selectedAnswer.selected_option : []
    });


  }

  /* Used to format the question data for choice question and update the choice options. */
  setSelectedChoiceOptions = () => {
    let updatedChoiceOptions = [];
    let selectedChoiceOptions = [];
    let otheroptiontextbox = false;

    // let defaultSelection = false;
    if (this.state.selectedQuestion.properties.multilevel === 0) {
      this.state.selectedQuestion.properties.options.forEach(question => {
        let defaultSelection = false;
        if (
          this.state.selectedQuestion.properties.choice_type === "multiple" &&
          this.state.selectedAnswer &&
          this.state.selectedAnswer.selected_option
        ) {
          this.state.selectedAnswer.selected_option.forEach(answer => {
            if (answer.id === question.id) {
              if (question.id === 'other') {
                otheroptiontextbox = true;
              }
              defaultSelection = true;
              selectedChoiceOptions.push({
                id: question.id,
                label: question.label,
                label_image: question.label_image
              });
            }
          });
        } else {
          if (
            this.state.selectedAnswer &&
            this.state.selectedAnswer.id === question.id
          ) {
            if (question.id === 'other') {
              otheroptiontextbox = true;
            }
            defaultSelection = true;
            selectedChoiceOptions.push({
              id: question.id,
              label: question.label,
              label_image: question.label_image
            });
          }
        }
        updatedChoiceOptions.push({
          id: question.id,
          label: question.label,
          label_image: question.label_image,
          defaultValue: defaultSelection
        });
        defaultSelection = false;
      });

    } else if (this.state.selectedQuestion.properties.multilevel === 1) {
      let subLabelItem = [];
      this.state.selectedQuestion.properties.options.forEach(question => {
        question.sublabel.forEach(questionsublabel => {
          let matched = false;
          if (
            this.state.selectedAnswer &&
            this.state.selectedAnswer.selected_option
          ) {
            this.state.selectedAnswer.selected_option.forEach(answer => {
              if (
                question.id === answer.id &&
                (questionsublabel.id === answer.sublabel_id ||
                  questionsublabel.id === answer.sub_id)
              ) {
                if (question.id === 'other') {
                  otheroptiontextbox = true;
                }
                selectedChoiceOptions.push({
                  id: question.id,
                  label: question.label,
                  label_image: question.label_image,
                  sublabel: questionsublabel.sublabel,
                  sub_label_image: questionsublabel.label_image,
                  sublabel_id: questionsublabel.id
                });
                subLabelItem.push({
                  id: questionsublabel.id,
                  label_image: questionsublabel.label_image,
                  sublabel: questionsublabel.sublabel,
                  defaultValue: true
                });
                matched = true;
              }
            });
          }
          if (matched === false) {
            subLabelItem.push({
              id: questionsublabel.id,
              label_image: questionsublabel.label_image,
              sublabel: questionsublabel.sublabel,
              defaultValue: false
            });
          }
        });

        updatedChoiceOptions.push({
          id: question.id,
          label: question.label,
          label_image: question.label_image,
          sublabel: subLabelItem
        });
        subLabelItem = [];
      });
    }
    let otheroptionvalue = ''
    if (this.state.selectedAnswer && this.state.selectedAnswer.other_value) {
      otheroptionvalue = this.state.selectedAnswer.other_value;
    }
    this.setState({
      updatedChoiceOptions: updatedChoiceOptions,
      selectedChoiceOptions: selectedChoiceOptions,
      otheroptionvalue: otheroptionvalue,
      otheroptiontextbox: otheroptiontextbox
    });

  };

  /* Handles the event to update the other option value to the state variable.*/
  setOtherValue(e) {
    let otheroptionvalue = e.target.value;
    if (!this.state.questions[this.state.index].answers) {
      let questions = this.state.questions
      questions[this.state.index].answers = {}
      this.setState({ questions })
    }
    let questions = this.state.questions
    questions[this.state.index].answers = e.target.value
    this.setState({ questions, otheroptionvalue: otheroptionvalue })
  }

  /* Handles the event to validate the choice type and renders the choice options in the modal popup. */
  onChoiceClick(value, e) {

    let selectedChoiceOptions = this.state.selectedChoiceOptions;
    let updatedChoiceOptions = this.state.updatedChoiceOptions;
    let otheroptiontextbox = false;

    if (value.id === 'other' && e.target.checked === true) {
      otheroptiontextbox = true;
    }

    if (this.state.selectedQuestion.properties.choice_type === "multiple") {
      if (value.defaultValue === false) {
        selectedChoiceOptions.push({
          id: value.id,
          label: value.label,
          label_image: value.label_image
        });
      } else {
        for (var i = 0; i < selectedChoiceOptions.length; i++) {
          if (selectedChoiceOptions[i].id === value.id) {
            selectedChoiceOptions.splice(i, 1);
            break;
          }
        }
      }
    } else {
      selectedChoiceOptions = [];
      selectedChoiceOptions.push({
        id: value.id,
        label: value.label,
        label_image: value.label_image
      });
    }

    for (let i = 0; i < updatedChoiceOptions.length; i++) {
      if (this.state.selectedQuestion.properties.choice_type === "multiple") {
        if (updatedChoiceOptions[i].id === value.id) {
          updatedChoiceOptions[i].defaultValue = !value.defaultValue;
          break;
        }
      } else {
        if (updatedChoiceOptions[i].id === value.id) {
          updatedChoiceOptions[i].defaultValue = !value.defaultValue;
          // break;
        } else {
          updatedChoiceOptions[i].defaultValue = false;
        }
      }
    }


    this.setState({
      selectedChoiceOptions: selectedChoiceOptions,
      updatedChoiceOptions: updatedChoiceOptions,
      otheroptiontextbox: otheroptiontextbox
    });
  }

  /* Handles the event to validate the sub choice type and renders the options based on sub choice type in the modal popup. */
  onSubChoiceClick(parent, subvalue, e) {
    let selectedChoiceOptions = this.state.selectedChoiceOptions;
    let updatedChoiceOptions = this.state.updatedChoiceOptions;
    let otheroptiontextbox = false;
    if (subvalue.id === 'other' && e.target.checked === true) {
      otheroptiontextbox = true;
    }
    if (this.state.selectedQuestion.properties.choice_type === "multiple") {
      if (subvalue.defaultValue === false) {
        selectedChoiceOptions.push({
          id: parent.id,
          label: parent.label,
          sublabel: subvalue.sublabel,
          sublabel_id: subvalue.id,
          label_image: parent.label_image,
          sub_label_image: subvalue.label_image
        });
      } else {
        for (let i = 0; i < selectedChoiceOptions.length; i++) {
          if (
            selectedChoiceOptions[i].id === parent.id &&
            selectedChoiceOptions[i].sublabel_id === subvalue.id
          ) {
            selectedChoiceOptions.splice(i, 1);
            break;
          }
        }
      }
    } else {
      selectedChoiceOptions = [];
      selectedChoiceOptions.push({
        id: parent.id,
        label: parent.label,
        sub_id: subvalue.id,
        sublabel: subvalue.sublabel,
        label_image: parent.label_image,
        sub_label_image: subvalue.label_image
      });
    }

    for (let i = 0; i < updatedChoiceOptions.length; i++) {
      for (let j = 0; j < updatedChoiceOptions[i].sublabel.length; j++) {
        if (updatedChoiceOptions[i].id === parent.id && updatedChoiceOptions[i].sublabel[j].id === subvalue.id) {
          updatedChoiceOptions[i].sublabel[j].defaultValue = !subvalue.defaultValue;
          break;
        }
      }
    }

    this.setState({
      selectedChoiceOptions: selectedChoiceOptions,
      updatedChoiceOptions: updatedChoiceOptions,
      otheroptiontextbox: otheroptiontextbox
    });
  }

  /* Handles the event to validate the scale type and renders the options in the modal popup. */
  onScaleClick = value => {
    let selectedScaleOptions = [];

    this.state.updatedScaleOptions.forEach(as => {
      let defaultSelection = false;
      if (this.state.selectedQuestion.properties.icon_type === "image") {
        if (as.id <= value.id) {
          defaultSelection = true;
          as.defaultValue = defaultSelection;
          selectedScaleOptions.push({
            id: as.id,
            image_id: as.image_id,
            value: as.value
          });
        } else {
          as.defaultValue = false;
        }
      } else if (this.state.selectedQuestion.properties.icon_type === "emoji") {
        if (as.id === value.id) {
          defaultSelection = true;
          as.defaultValue = defaultSelection;
          selectedScaleOptions.push({
            id: as.id,
            image_id: as.image_id,
            value: as.value
          });
        } else {
          as.defaultValue = false;
        }
      }
    });

    this.setState({
      updatedScaleOptions: this.state.updatedScaleOptions,
      selectedScaleOptions: selectedScaleOptions
    });
  };

  /* Validate the scale type and renders the options in the modal popup. */
  onScaleTableClickImage = (index, cellIndex, cellData) => {
    let tableData = this.state.tableData;

    tableData[index][cellIndex].opacity = 1;

    let selectedTableOptions = this.state.selectedTableOptions;

    for (var i = 1; i < tableData[index].length; i++) {
      if (i !== cellIndex) {
        tableData[index][i].opacity = 0.3;
      }
    }

    let obj = {};
    obj.image = {};
    obj.id = cellData.row_id;
    obj.image.id = cellData.id;
    if (cellData.image_id && cellData.image_id !== null) {
      obj.image.image_id = cellData.image_id;
    }

    if (selectedTableOptions.length > 0) {
      let matched = false;
      for (let i = 0; i < selectedTableOptions.length; i++) {
        if (cellData.row_id === selectedTableOptions[i].id) {
          selectedTableOptions[i] = obj;
          matched = true;
        }
      }
      if (matched === false) {
        this.state.selectedTableOptions.push(obj);
      }
    } else {
      this.state.selectedTableOptions.push(obj);
    }

    this.setState({
      tableData: tableData
    });
  };

  /* Validate the scale type and renders the options in the modal popup. */
  onScaleTableClickRadio = (index, cellIndex, cellData) => {
    let selectedTableOptions = this.state.selectedTableOptions;

    let obj = {};
    obj.image = {};
    obj.id = cellData.row_id;
    obj.image.id = cellData.id;
    obj.image.image_id = "";

    if (selectedTableOptions.length > 0) {
      let matched = false;
      for (let i = 0; i < selectedTableOptions.length; i++) {
        if (cellData.row_id === selectedTableOptions[i].id) {
          selectedTableOptions[i] = obj;
          matched = true;
        }
      }
      if (matched === false) {
        this.state.selectedTableOptions.push(obj);
      }
    } else {
      this.state.selectedTableOptions.push(obj);
    }
  };

  /* Used to format the answer data for scale table image type question and update the scale options. */

  setSelectedScaleTableImageOptions() {
    let question = this.state.selectedQuestion.properties.table_content;
    const { table_options, table_value } = question;

    let selectedAnswer = this.state.selectedAnswer;

    let tableHead = [];
    let tableData = [];
    let selectedTableOptions = [];

    tableHead.push("");
    let answer = [];

    if (selectedAnswer && selectedAnswer.selected_option) {
      answer = selectedAnswer.selected_option;
      for (let m = 0; m < answer.length; m++) {
        let obj = answer[m];
        selectedTableOptions.push(obj);
      }
    }

    for (let m = 0; m < table_options.length; m++) {
      tableHead.push(table_options[m].value);
    }
    for (let i = 0; i < table_value.length; i++) {
      let tempData = [];
      tempData.push(table_value[i].value);
      for (let j = 0; j < table_value[i].image.length; j++) {
        let tempObj = {};
        let lightDarkOpacity = 0.3;
        let fullOpacity = 1;
        tempObj.row_id = table_value[i].id;
        tempObj.id = table_value[i].image[j].id;
        tempObj.image_id = null;
        tempObj.value = table_value[i].image[j].value;
        tempObj.opacity = lightDarkOpacity;
        for (let k = 0; k < answer.length; k++) {
          if (answer[k].id === table_value[i].id) {
            if (answer[k].image.id === table_value[i].image[j].id) {
              tempObj.opacity = fullOpacity;
            } else {
              tempObj.opacity = lightDarkOpacity;
            }
          }
        }
        if (
          table_value[i].image[j].image_id &&
          table_value[i].image[j].image_id !== null &&
          table_value[i].image[j].image_id !== ""
        ) {
          tempObj.image_id = table_value[i].image[j].image_id;
        }
        if (
          table_value[i].value &&
          table_value[i].value !== null &&
          table_value[i].value !== ""
        ) {
          tempObj.value = table_value[i].value;
        }
        tempData.push(tempObj);
      }
      tableData.push(tempData);
    }

    this.setState({
      tableData: tableData,
      tableHead: tableHead,
      selectedTableOptions: selectedTableOptions
    });
  }

  /* Used to format the answer data for scale table radio type question and update the scale options. */
  setSelectedScaleTableRadioOptions() {
    let question = this.state.selectedQuestion.properties.table_content;
    const { table_options, table_value } = question;
    let selectedAnswer = this.state.selectedAnswer;

    let tableHeadRadio = [];
    let tableDataRadio = [];
    let selectedTableOptions = [];

    tableHeadRadio.push("");
    let answerRadio = [];
    if (selectedAnswer && selectedAnswer.selected_option) {
      answerRadio = selectedAnswer.selected_option;
      for (let m = 0; m < answerRadio.length; m++) {
        let obj = answerRadio[m];
        selectedTableOptions.push(obj);
      }
    }

    for (let i = 0; i < table_options.length; i++) {
      tableHeadRadio.push(table_options[i].value);
    }
    for (let i = 0; i < table_value.length; i++) {
      let tempData = [];
      tempData.push(table_value[i].value);
      for (let j = 0; j < table_value[i].image.length; j++) {
        let tempObj = {};
        tempObj.row_id = table_value[i].id;
        tempObj.id = table_value[i].image[j].id;
        tempObj.isChecked = false;
        tempObj.value = table_value[i].value;
        if (answerRadio.length > 0) {
          for (let k = 0; k < answerRadio.length; k++) {
            if (answerRadio[k].id === table_value[i].id) {
              if (answerRadio[k].image && answerRadio[k].image.id && answerRadio[k].image.id === table_value[i].image[j].id) {
                tempObj.isChecked = true;
              } else {
                tempObj.isChecked = false;
              }
            }
          }
        }
        tempData.push(tempObj);
      }
      tableDataRadio.push(tempData);
    }
    this.setState({
      tableDataRadio: tableDataRadio,
      tableHeadRadio: tableHeadRadio,
      selectedTableOptions: selectedTableOptions
    });
  }

  /* Handles the snackbar message notification. */
  showNotification = (msg, color) => {
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
  };

  /* Handles the snackbar message notification. */
  showSuccessNotification = (msg, color) => {
    this.setState({
      message: msg,
      msgColor: color
    });

    let place = "br";
    var x = [];
    x[place] = true;
    this.setState(x);
  };

  /* Handles the event to update the email. */
  handleChange = e => {
    this.setState({
      email: e.target.value
    });
  };

  /* Handles the event to update the mobile. */
  handleChangeMobile = e => {
    this.setState({
      mobile: e.target.value
    });
  };

  /* Handles this function to validate the mobile and email when user clicks submit using weblink url. */
  WebLinkCredentialValidation() {
    if (this.state.email === "" || this.state.mobile === "") {
      this.setState({ error: true });
    } else if (this.state.email !== "" && this.state.mobile !== "") {
      this.webLinkValidation();
    }
  }

  /* Handles the api to post the data when user clicks submit. */
  webLinkValidation = () => {
    let data = {
      email: this.state.email,
      mobile: this.state.mobile
    };


    api2
      .post("/weblink_consumer?id=" + mission_id, data)
      .then(resp => {
        if (resp.data.status === 200 && resp.data.id > 0) {
          localStorage.setItem("api_key", resp.data.api_key);
          this.setState({ cust_id: resp.data.id }, () => { this.getSurveyResponse() });
        }
        else {
          this.showNotification("There seems to be an issue with your email or phone number - Please contact support at flexicollect-support@eolasinternational.com", "info");
        }
      })
      .catch(error => {
        console.error(error);
        this.showNotification("There seems to be an issue with your email or phone number - Please contact support at flexicollect-support@eolasinternational.com", "info");
      });

  };

  /* Handles the api to fetch the weblink id when this component gets loaded. */
  getWebLinkID = () => {
    api2
      .get("/weblink_consumer_id?id=" + mission_id)

      .then(resp => {

        if (resp.data.status === 200 && resp.data.id > 0) {
          localStorage.setItem("api_key", resp.data.api_key);
          this.setState({ cust_id: resp.data.id }, () => { this.getSurveyResponse() });
        }
      })
      .catch(error => {
        console.error(error);
      });

  };

  /* Handles the api to fetch the mission response based on the customerid and mission id. */
  getSurveyResponse = () => {

    let uri = Constants.MISSION_URI + this.state.cust_id + "&id=" + mission_id;
    axios.get(uri, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem("api_key")
      }
    }).then(resp => {
      if (resp.data.status === 200) {
        this.setSurveyQuestions(resp.data);
        this.onWeblinkNext();
      } else {
        this.showNotification(resp.data.error ? resp.data.error : "Sorry this mission is no longer available", "info");
      }

    })
      .catch(error => {
        console.error(error);
        this.showNotification("Sorry this mission is no longer available", "info");
      });
  };

  /* Handles the function to validate the survey type and question type and form the answer data to post. */
  setSurveyQuestions(response) {
    let question = [];
    //let newQuestion =[];
    let MissionSurveyQues = response.mission_surveys;
    let gps = false;

    if (MissionSurveyQues.length > 0) {
      MissionSurveyQues.forEach(survey => {
        if (survey.survey_type === "onboard") {
          survey.questions.forEach(surveyfliterquestions => {
            if (
              surveyfliterquestions.question.type !== "capture" &&
              surveyfliterquestions.question.type !== "barcode"
            ) {
              if (surveyfliterquestions.question.type === "input" && Object.keys(values).length > 0 &&
                values[surveyfliterquestions.question.label] && values[surveyfliterquestions.question.label].length > 0
              ) {
                this.postID(surveyfliterquestions.question.type, surveyfliterquestions.question.question_id, surveyfliterquestions.survey_answer_tag_id,
                  surveyfliterquestions.answers, values[surveyfliterquestions.question.label], survey.survey_id);
              }
              else {
                surveyfliterquestions.survey_id = survey.survey_id;
                question.push(surveyfliterquestions);
              }
            }
            if (surveyfliterquestions.question.type === "gps") {
              gps = true;
            }
          });
        }
        if (survey.gps_hidden === 1) {
          gps = true;
        }
      });


      MissionSurveyQues.forEach(survey => {
        if (survey.survey_type === "screener") {
          survey.questions.forEach(surveyfliterquestions => {
            if (
              surveyfliterquestions.question.type !== "capture" &&
              surveyfliterquestions.question.type !== "barcode"
            ) {
              if (surveyfliterquestions.question.type === "input" && Object.keys(values).length > 0 &&
                values[surveyfliterquestions.question.label] && values[surveyfliterquestions.question.label].length > 0
              ) {
                this.postID(surveyfliterquestions.question.type, surveyfliterquestions.question.question_id, surveyfliterquestions.survey_answer_tag_id,
                  surveyfliterquestions.answers, values[surveyfliterquestions.question.label], survey.survey_id);
              }
              else {
                surveyfliterquestions.survey_id = survey.survey_id;
                question.push(surveyfliterquestions);
              }
            }
            if (surveyfliterquestions.question.type === "gps") {
              gps = true;
            }
          });
        }
        if (survey.gps_hidden === 1) {
          gps = true;
        }
      });



      MissionSurveyQues.forEach(survey => {
        if (survey.survey_type === "main") {
          survey.questions.forEach(surveyfliterquestions => {
            if (
              surveyfliterquestions.question.type !== "capture" &&
              surveyfliterquestions.question.type !== "barcode"
            ) {
              if (surveyfliterquestions.question.type === "input" && Object.keys(values).length > 0 &&
                values[surveyfliterquestions.question.label] && values[surveyfliterquestions.question.label].length > 0
              ) {
                this.postID(surveyfliterquestions.question.type, surveyfliterquestions.question.question_id, surveyfliterquestions.survey_answer_tag_id,
                  surveyfliterquestions.answers, values[surveyfliterquestions.question.label], survey.survey_id);
              }
              else {
                surveyfliterquestions.survey_id = survey.survey_id;
                question.push(surveyfliterquestions);
              }
            }
            if (surveyfliterquestions.question.type === "gps") {
              gps = true;
            }
          });
        }
        if (survey.gps_hidden === 1) {
          gps = true;
        }
      });
    }

    if (gps === true) {
      this.fetchLatitudeLongitude();
    }

    var newQuestion = [].concat.apply([], question);

    let target = [];
    let temp_questionsArr = newQuestion;
    for (let j = 0; j < newQuestion.length; j++) {
      if (newQuestion[j].question.conditions.length > 0) {
        for (let i = 0; i < newQuestion[j].question.conditions.length; i++) {
          for (let m = 0; m < newQuestion[j].question.conditions[i].source.length; m++) {
            if (newQuestion[j].question.conditions[i].source[m].state === "" && newQuestion[j].question.conditions[i].target.do === "loop_set") {
              newQuestion[j].question.conditions[i].target.condition = true
              target.push(newQuestion[j].question.conditions[i].target);
            }
          }
        }
      }


      if (target) {
        for (let k = 0; k < target.length; k++) {
          for (let j = 0; j < newQuestion.length; j++) {
            for (let n = 0; n < target[k].multifield.length; n++) {
              if (newQuestion[j].question.handler === target[k].multifield[n].value) {
                newQuestion[j].isDefault_loopset = true;
              }
            }
          }
        }
        for (let k = 0; k < target.length; k++) {
          if (target[k].hasOwnProperty('condition') && target[k].condition === true && target[k].do === "loop_set") {
            this.setState({ questions: temp_questionsArr })
            this.create_loop(newQuestion, target[k], j, 'loop_set')
            temp_questionsArr = this.state.questions
          }
        }
      }

      target = [];
    }

    newQuestion = temp_questionsArr;

    this.setState(
      {
        questions: newQuestion,
        selectedQuestion: newQuestion.length > 0 ? newQuestion[0].question : {},
        selectedAnswer: (newQuestion.length > 0 && newQuestion[0].answers && Object.keys(newQuestion[0].answers).length > 0) ? newQuestion[0].answers : {},
        nextExists: newQuestion.length > 1 ? true : false
      },
      () => this.setInitialState()
    );

  }
  /* Handles the api to post the formatted data. */
  postID(type, question_id, survey_answer_tag_id, answers, value, survey_id) {
    let answer = {};
    let url = Constants.ANSWER_URI;

    if (answers && Object.keys(answers).length > 0) {
      answer = answers;
    }

    answer.text = value;

    let newData = {
      consumer_id: this.state.cust_id,
      answer: answer,
      mission_id: mission_id,
      question_id: question_id,
      survey_answer_tag_id: survey_answer_tag_id,
      survey_id: survey_id,
      question_type: type
    };

    axios.post(url, newData, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem("api_key")
      }
    })
      .then(resp => {
        console.log('ID posted');
      })
      .catch(error => {
        console.error(error);
      });

  }

  /* Handles the event to navigate to the previous question from the current question. */
  handleBack = e => {

    let currentPage = this.state.index;
    let prevPage = 0;
    let questionsArray = this.state.questions;


    for (let i = currentPage; i >= 0; i--) {
      if (i < currentPage && (!questionsArray[i].isHide || questionsArray[i].isHide === false)) {
        prevPage = i;
        break;
      }
    }

    this.ClearState();
    this.setState(
      {
        index: prevPage,
        selectedQuestion: this.state.questions[prevPage].question,
        selectedAnswer: this.state.questions[prevPage].answers,
        nextExists: true
      },
      () => {
        this.setInitialState();
      }
    );
  };

  /* 
  * i)Handles the event to navigate to the next question from the current question index and post the answer if the question type is not an info.
  * ii) If it is an info it validate the question is no return or not and then move to next question
  */
  handleNext = () => {
    this.setState(() => ({ show: true }));
    if (this.state.selectedQuestion.type == "input") {
      document.getElementById("inputTypeQuestion").focus()
    }

    if (this.state.selectedQuestion.type !== "info") {

      this.editSurveyAnswer()
    }
    else {
      if (this.state.selectedQuestion.properties.hasOwnProperty('noreturn') && this.state.selectedQuestion.properties.noreturn === 1) {
        this.validateNoReturn();
      }
      else {
        this.moveToNext()
      }
    }

  };

  /* Used to find the hidden questions from the question array. */
  getHiddenQuestions() {
    let questionsArray = this.state.questions;
    let hiddenQuestions = []

    for (let i = 0; i < questionsArray.length; i++) {
      if (questionsArray[i].isHide && questionsArray[i].isHide === true
      ) {
        hiddenQuestions.push(questionsArray[i].id)
      }
    }

    return hiddenQuestions;
  }

  /* Used to remove the hidden questions from the question array. */
  removeHiddenQuestion(questionsArray) {
    let questions = []

    for (let i = 0; i < questionsArray.length; i++) {
      if (
        !questionsArray[i].isHide || questionsArray[i].isHide === false
      ) {
        questions.push(questionsArray[i])
      }
    }

    return questions
  }

  /* Validate the current question property.
  * If the property noreturn is true user not able to move to previous questions . */
  validateNoReturn = () => {
    let question = this.state.questions[this.state.index];

    let hiddenQuestions = this.getHiddenQuestions();
    let post_object = {
      hideList: hiddenQuestions
    }
    let uri = Constants.VALIDATE_NO_RETURN + mission_id + '&survey_id=' + question.survey_id + '&question_id=' + this.state.selectedQuestion.question_id
      + '&survey_answer_tag_id=' + question.survey_answer_tag_id + '&unique_id=' + question.id;
    axios.post(uri, post_object, {
      headers: {
        'Content-Type': 'application/json',
        'Auth': localStorage.getItem("api_key")
      }
    }).then(resp => {
      if (resp.data.status === 200) {
        let newQuestion = this.state.questions.slice(this.state.index + 1);
        let filteredQuestions = this.removeHiddenQuestion(newQuestion);
        this.setState({
          updatedChoiceOptions: [],
          selectedChoiceOptions: []
        });
        if (filteredQuestions.length > 0) {
          this.setState(
            {
              questions: filteredQuestions,
              selectedQuestion: filteredQuestions.length > 0 ? filteredQuestions[0].question : {},
              selectedAnswer: (filteredQuestions.length > 0 && filteredQuestions[0].answers && Object.keys(filteredQuestions[0].answers).length > 0) ? filteredQuestions[0].answers : {},
              nextExists: filteredQuestions.length > 1 ? true : false,
              index: 0,
              show: false,
              enableTermsCond: true,
              Upload: {}
            },
            () => this.setInitialState()
          );
        } else {
          this.handleSubmit();
        }
      }
    })
      .catch(error => {
        this.showNotification(error.response.data.message, "info");
        this.setState({ show: false });
      });
  }

  /* Handles the event to navigate to the next question.
  * if the next question is hidden it will skip the question and move to next. */
  moveToNext = () => {

    let currentPage = this.state.index;
    let nextPage = currentPage;
    let nextExists = false;
    let questionsArray = this.state.questions;
    let arrLength = questionsArray.length;

    for (let i = currentPage; i < questionsArray.length; i++) {
      if (i > currentPage && (!questionsArray[i].isHide || questionsArray[i].isHide === false)) {
        nextPage = i;
        break;
      }
    }
    if (nextPage === (arrLength - 1)) {
      nextExists = false;
    }
    else {
      for (let i = nextPage; i < questionsArray.length; i++) {
        if (i > nextPage && (!questionsArray[i].isHide || questionsArray[i].isHide === false)) {
          nextExists = true;
          break;
        }
      }
    }

    this.ClearState();
    this.setState(
      {
        index: nextPage,
        selectedQuestion: this.state.questions[nextPage].question,
        selectedAnswer: this.state.questions[nextPage].answers,
        nextExists: nextExists,
        show: false
      },
      () => {
        this.setInitialState();
      }
    );

  };

  /* Used to format the answer data based on the question type.
  * Returns the formatted data. */
  updateAnswerData = () => {

    let answer = {};
    if (this.state.selectedAnswer && Object.keys(this.state.selectedAnswer).length > 0) {
      answer = this.state.selectedAnswer;
    }


    if (this.state.selectedQuestion.type === "input") {
      answer.text = this.state.updatedText;
    }
    else if (this.state.selectedQuestion.type === "gps") {
      this.fetchLatitudeLongitude();
      if (latitude !== "" && longitude !== "") {
        answer.latitude = latitude;
        answer.longitude = longitude;
      }
    }
    else if (this.state.selectedQuestion.type === "choice") {
      let updatedChoiceOptions = this.state.selectedChoiceOptions
      if (updatedChoiceOptions && updatedChoiceOptions.length > 0) {
        if (this.state.selectedQuestion.properties.multilevel === 0) {
          if (this.state.selectedQuestion.properties.choice_type === "single") {
            answer["id"] = updatedChoiceOptions[0].id;
            answer["label"] = updatedChoiceOptions[0].label;
            answer["label_image"] = updatedChoiceOptions[0].label_image;
            answer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
            answer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
            if (this.state.selectedQuestion.properties.other) {
              answer["other_value"] = this.state.otheroptionvalue;
            }
          }
          else if (this.state.selectedQuestion.properties.choice_type === "multiple") {
            answer["selected_option"] = updatedChoiceOptions;
            answer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
            answer["multilevel"] = this.state.selectedQuestion.properties.multilevel;
            if (this.state.selectedQuestion.properties.other) {
              answer["other_value"] = this.state.otheroptionvalue;
            }
          }
        }
        else {

          answer["selected_option"] = updatedChoiceOptions;
          answer["choice_type"] = this.state.selectedQuestion.properties.choice_type;
          answer["multilevel"] = this.state.selectedQuestion.properties.multilevel;

        }
      }
      else {
        answer = {};
      }
    }

    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "table") {
      let selectedTableOptions = this.state.selectedTableOptions
      answer["selected_option"] = selectedTableOptions;
      answer["scale_type"] = this.state.selectedQuestion.properties.scale_type;

    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type === "scale") {
      let selectedScaleOptions = this.state.selectedScaleOptions
      answer["selected_option"] = selectedScaleOptions;
      answer["icon_type"] = this.state.selectedQuestion.properties.icon_type;
      answer["scale_type"] = this.state.selectedQuestion.properties.scale_type;
    }
    else if (this.state.selectedQuestion.type === "upload" && this.state.Upload.media && !this.state.Upload.media.startsWith('http')) {


      //data:image/png;base64,iVBOR
      let media = this.state.Upload.media.split(',');
      let format = media[0].split(';')[0].replace('data:', '').split('/');

      answer["media_type"] = format[0];
      answer["media_format"] = format[1];
      answer["media"] = media[1]


    }

    if (this.state.selectedQuestion.type === "upload" && this.state.Upload.media && !this.state.Upload.media.startsWith('http')
      && this.state.Upload.media !== "") {
      let questions = this.state.questions
      questions[this.state.index].answers = this.state.Upload;
      this.setState({ questions })
    }
    else {
      let questions = this.state.questions
      questions[this.state.index].answers = answer;
      this.setState({ questions })

    }

    if (latitude !== "" && longitude !== "") {
      answer.latitude = latitude;
      answer.longitude = longitude;
    }

    return answer;
  };

  /* Handles the api to post the formatted answer along with customer id,questionid, survey id and question type */
  editSurveyAnswer = () => {
    let answer = this.updateAnswerData();
    let survey_answer_tag_id = this.state.questions[this.state.index].survey_answer_tag_id;
    let survey_id = this.state.questions[this.state.index].survey_id;
    let url = Constants.ANSWER_URI;
    if (this.state.selectedQuestion.type === "upload") {
      url = Constants.UPLOAD_ANSWER_URI;
    }

    let mandatoryError = this.mandatoryCheck(this.state.selectedQuestion, answer);

    if (!mandatoryError) {
      if (answer && Object.keys(answer).length > 0) {
        if (this.state.selectedQuestion.type !== "upload" || (this.state.selectedQuestion.type === "upload" && answer.media && !answer.media.startsWith('http'))) {
          let newData = {
            consumer_id: this.state.cust_id,
            answer: answer,
            mission_id: mission_id,
            question_id: this.state.selectedQuestion.question_id,
            survey_answer_tag_id: survey_answer_tag_id,
            survey_id: survey_id,
            question_type: this.state.selectedQuestion.type,
          };
          if (this.state.selectedQuestion.type !== 'gps' && this.state.selectedQuestion.properties.refcode) {
            newData.answer.refcode = this.state.selectedQuestion.properties.refcode
          }

          if (this.state.questions[this.state.index].isloop) {
            newData.loop_number = this.state.questions[this.state.index].loop_number;
            newData.loop_set = this.state.questions[this.state.index].loop_set_num;
            newData.loop_triggered_qid = this.state.questions[this.state.index].loop_triggered_qid;
          }

          axios.post(url, newData, {
            headers: {
              'Content-Type': 'application/json',
              'Auth': localStorage.getItem("api_key")
            }
          }).then(resp => {
            this.executeConditions(this.state.selectedQuestion.conditions, answer, this.state.selectedQuestion.type, this.state.selectedQuestion.properties);

          })
            .catch(error => {
              console.error(error);
              this.executeConditions(this.state.selectedQuestion.conditions, answer, this.state.selectedQuestion.type, this.state.selectedQuestion.properties);

            });
        }
        else {
          this.executeConditions(this.state.selectedQuestion.conditions, this.state.selectedAnswer, this.state.selectedQuestion.type, this.state.selectedQuestion.properties);
        }
      }
      else {
        this.executeConditions(this.state.selectedQuestion.conditions, this.state.selectedAnswer, this.state.selectedQuestion.type, this.state.selectedQuestion.properties);
      }

    }
    else {

      this.showNotification("Please answer this question", "info");
      this.setState(() => ({ show: false }));
    }

  };

  /* Validate the current question.
  * If Current question property is mandatory user should answer the question and move to next.*/
  mandatoryCheck = (question, answer) => {
    let mandatoryError = false;
    if (question.properties.hasOwnProperty('mandatory') && question.properties.mandatory === 1) {
      if (question.type === 'input') {
        if (answer && answer.text && answer.text !== "") {
          mandatoryError = false;
        }
        else {
          mandatoryError = true;
        }
      }
      else if (question.type === 'choice') {
        if (answer && ((answer.selected_option && answer.selected_option.length > 0)
          || (answer.label &&
            answer.label !== ""))) {
          mandatoryError = false;
        }
        else {
          mandatoryError = true;
        }
      }
      else if (question.type === 'scale') {
        // console.dir("question " + JSON.stringify(question, null, 4))
        // console.log("question " + question.properties.table_content.value_length)
        // console.log("answer " + answer)
        // console.log("answer.selected_option " + JSON.stringify(answer.selected_option))
        // console.log("answer.selected_option.length " + answer.selected_option.length)
        // console.log("answer.label " + answer.label)
        // if (answer && ((answer.selected_option && answer.selected_option.length >= question.properties.table_content.value_length) || (answer.label && answer.label !== ""))) {
        if (answer && ((answer.selected_option && answer.selected_option.length > 0)
          || (answer.label && answer.label != ""))) {
          mandatoryError = false;
        }
        else {
          mandatoryError = true;
        }
      }
      else if (question.type === 'upload') {
        if (answer && answer.media && answer.media !== "") {
          mandatoryError = false;
        }
        else {
          mandatoryError = true;
        }
      }

    }

    return mandatoryError;

  }

  /* Handles the api to post the survey answer. */
  handleSubmit = () => {
    let answer = this.updateAnswerData();

    let survey_answer_tag_id = this.state.questions[this.state.index].survey_answer_tag_id;
    let survey_id = this.state.questions[this.state.index].survey_id;

    let hiddenQuestions = this.getHiddenQuestions();

    let url = Constants.ANSWER_URI;;
    if (this.state.selectedQuestion.type === "upload") {
      url = Constants.UPLOAD_ANSWER_URI;;
    }

    let mandatoryError = this.mandatoryCheck(this.state.selectedQuestion, answer);
    if (!mandatoryError) {
      let newData = {
        consumer_id: this.state.cust_id,
        answer: answer,
        mission_id: mission_id,
        question_id: this.state.selectedQuestion.question_id,
        survey_answer_tag_id: survey_answer_tag_id,
        survey_id: survey_id,
        question_type: this.state.selectedQuestion.type,
        hide_list: hiddenQuestions,
        submit: true
      };
      if (this.state.selectedQuestion.type !== 'gps' && this.state.selectedQuestion.properties.refcode) {
        newData.answer.refcode = this.state.selectedQuestion.properties.refcode
      }

      axios.post(url, newData, {
        headers: {
          'Content-Type': 'application/json',
          'Auth': localStorage.getItem("api_key")
        }
      })
        .then(resp => {
          this.setState({
            nextPage: false,
            email: "",
            mobile: "",
            questions: [],
            selectedAnswer: {},
            index: 0,
            selectedQuestion: {},
            updatedScaleOptions: [],
            updatedChoiceOptions: [],
            selectedChoiceOptions: [],
            selectedScaleOptions: [],
            tableHead: [],
            tableData: [],
            tableHeadRadio: [],
            tableDataRadio: [],
            answerRadio: [],
            answer: [],
            radioButtonname: [],
            selectedTableOptions: [],
            Upload: {},
            updatedText: "",
            updatedAnswer: {},
            nextExists: false,
            cust_id: 0,
            error: idExists ? true : false,
            alertMessage: idExists ? 'Survey Submitted Successfully' : this.state.alertMessage
          });

          this.showSuccessNotification("Survey Submitted Successfully", "info");

        })
        .catch(error => {
          if (error.response && error.response.data && error.response.data.mandatoryError) {
            this.showNotification(error.response.data.mandatoryError, "info");
          }
          else {
            this.showNotification("Server error occurred in submitting the survey", "info");
          }
        });

    }
    else {
      this.showNotification("Please answer this question", "info");
    }

  };

  /* Handles the function to update the state variable. */
  onWeblinkNext = () => {
    this.setState({
      nextPage: true
    });
  };

  /* Validate current question condition. */
  executeConditions = (conditions, answer, questionType, properties) => {
    let target = [];
    let unMetTarget = [];
    let questionsArray = this.state.questions;
    let currentQuesIndx = this.state.index;
    let condition = questionsArray[currentQuesIndx].conditions ? questionsArray[currentQuesIndx].conditions : conditions
    if (condition.length > 0) {
      this.getConditionalTarget(condition, answer, questionType, properties, target,
        unMetTarget);
      if (unMetTarget) {
        for (let k = 0; k < unMetTarget.length; k++) {
          if (
            unMetTarget[k].hasOwnProperty("multifield") &&
            unMetTarget[k].multifield.length > 0
          ) {
            //
            if (!unMetTarget[k].hasOwnProperty('loop') && (unMetTarget[k].do === "loop" ||
              unMetTarget[k].do === "loop_input" || unMetTarget[k].do === "loop_set")) {
              this.hide_unMetTarget_loopques(unMetTarget[k], questionsArray, currentQuesIndx)
            }
            //
            //
            if (unMetTarget[k].do === "loop") {
              this.clear_looponly(questionsArray, unMetTarget[k], currentQuesIndx, 'loop')
              this.clear_loop_answer(questionsArray, unMetTarget[k], currentQuesIndx, 'loop')
            } else if (unMetTarget[k].do === "loop_set") {
              this.clear_loopset(questionsArray, unMetTarget[k], currentQuesIndx, 'loop_set')
              this.clear_loop_answer(questionsArray, unMetTarget[k], currentQuesIndx, 'loop_set')
            } else if (unMetTarget[k].do === "loop_input") {
              questionsArray[currentQuesIndx].loop_inputvalue = 0;
              this.clear_loopinput(questionsArray, unMetTarget[k], currentQuesIndx, 'loop_input')
              this.clear_loop_answer(questionsArray, unMetTarget[k], currentQuesIndx, 'loop_input')
            }
            //
            questionsArray = this.state.questions
            for (let j = 0; j < unMetTarget[k].multifield.length; j++) {
              for (let i = 0; i < questionsArray.length; i++) {
                if (unMetTarget[k].loop) {
                  if (unMetTarget[k].multifield[j].value === questionsArray[i].question.handler && questionsArray[i].loop_triggered_qid === unMetTarget[k].loop_triggered_qid
                    && questionsArray[i].loop_set_num === unMetTarget[k].loop_set_num
                  ) {
                    if (unMetTarget[k].do === "show_multiple") {
                      if (unMetTarget[k].loop_number < questionsArray[i].loop_number) {
                        questionsArray[i].isHide = false;
                        break;
                      }
                    } else if (unMetTarget[k].do === "hide_multiple") {
                      if (unMetTarget[k].loop_number < questionsArray[i].loop_number) {
                        questionsArray[i].isHide = false;
                        break;
                      }
                    }
                  }
                  // break;
                } else {
                  if (
                    unMetTarget[k].multifield[j].value ===
                    questionsArray[i].question.handler
                  ) {

                    if (unMetTarget[k].do === "show_multiple") {
                      questionsArray[i].isHide = false;
                    } else if (unMetTarget[k].do === "hide_multiple") {
                      questionsArray[i].isHide = false;
                    }
                    //
                    if (unMetTarget[k].hasOwnProperty('isHide') && unMetTarget[k].isHide) {
                      if (unMetTarget[k].multifield[j].hasOwnProperty('trigger') && unMetTarget[k].multifield[j].trigger) {
                        // skip triggerd ques in the list
                      } else {
                        questionsArray[i].isHide = true;
                        this.clear_loop_answer(questionsArray, target[k], i, 'hide')
                      }
                    }
                    //
                  }
                }
              }
            }
            questionsArray = this.state.questions
          } else {
            for (let i = 0; i < questionsArray.length; i++) {
              if (unMetTarget[k].loop) {
                if (unMetTarget[k].value === questionsArray[i].question.handler && questionsArray[i].loop_triggered_qid === unMetTarget[k].loop_triggered_qid
                  && questionsArray[i].loop_set_num === unMetTarget[k].loop_set_num
                ) {
                  if (unMetTarget[k].do === "show") {
                    if (unMetTarget[k].loop_number < questionsArray[i].loop_number) {
                      questionsArray[i].isHide = false;
                      break;
                    }
                  } else if (unMetTarget[k].do === "hide") {
                    if (unMetTarget[k].loop_number < questionsArray[i].loop_number) {
                      questionsArray[i].isHide = false;
                      break;
                    }
                  }
                }
              } else {
                if (unMetTarget[k].handler === questionsArray[i].question.handler) {
                  if (unMetTarget[k].do === "show") {
                    questionsArray[i].isHide = false;
                  } else if (unMetTarget[k].do === "hide") {
                    questionsArray[i].isHide = false;
                  }
                }
              }
            }
          }
          questionsArray = this.state.questions
        }
      }
      if (target) {
        for (let k = 0; k < target.length; k++) {
          if (
            target[k].hasOwnProperty("multifield") &&
            target[k].multifield.length > 0
          ) {
            //
            if (!target[k].hasOwnProperty('loop') && (target[k].do === "loop" ||
              target[k].do === "loop_input" || target[k].do === "loop_set")) {
              this.hide_unMetTarget_loopques(target[k], questionsArray, currentQuesIndx)
            }
            //
            //
            if (target[k].do === "loop") {
              this.create_loop(questionsArray, target[k], currentQuesIndx, 'loop')
            } else if (target[k].do === "loop_set" && !target[k].hasOwnProperty('condition')) {
              this.create_loop(questionsArray, target[k], currentQuesIndx, 'loop_set')
            } else if (target[k].do === "loop_input") {
              this.create_loop(questionsArray, target[k], currentQuesIndx, 'loop_input')
            }
            questionsArray = this.state.questions
            //
            for (let j = 0; j < target[k].multifield.length; j++) {
              for (let i = 0; i < questionsArray.length; i++) {
                if (target[k].loop) {
                  if (target[k].multifield[j].value === questionsArray[i].question.handler && questionsArray[i].loop_triggered_qid === target[k].loop_triggered_qid
                    && questionsArray[i].loop_set_num === target[k].loop_set_num
                  ) {
                    if (target[k].do === "show_multiple") {
                      if (target[k].loop_number < questionsArray[i].loop_number) {
                        questionsArray[i].isHide = false;
                        break;
                      }
                    } else if (target[k].do === "hide_multiple") {
                      if (target[k].loop_number < questionsArray[i].loop_number) {
                        questionsArray[i].isHide = true;
                        this.clear_loop_answer(questionsArray, target[k], i, 'hide_loop')
                        break;
                      }
                    }
                  }
                  // break;
                } else {
                  if (
                    target[k].multifield[j].value ===
                    questionsArray[i].question.handler
                  ) {
                    if (target[k].do === "show_multiple") {
                      questionsArray[i].isHide = false;
                    } else if (target[k].do === "hide_multiple") {
                      questionsArray[i].isHide = true;
                      this.clear_loop_answer(questionsArray, target[k], i, 'hide')
                    }
                    //
                    if (target[k].hasOwnProperty('isHide') && target[k].isHide === true) {
                      if (target[k].multifield[j].hasOwnProperty('trigger') && target[k].multifield[j].trigger) {
                        target[k].multifield[j].trigger = false
                      } else {
                        questionsArray[i].isHide = false;
                      }
                    }
                    //

                  }
                }
              }
            }
            questionsArray = this.state.questions
          } else {
            for (let i = 0; i < questionsArray.length; i++) {
              if (target[k].loop) {
                if (target[k].value === questionsArray[i].question.handler && questionsArray[i].loop_triggered_qid === target[k].loop_triggered_qid
                  && questionsArray[i].loop_set_num === target[k].loop_set_num) {
                  if (target[k].do === "show") {
                    if (target[k].loop_number < questionsArray[i].loop_number) {
                      questionsArray[i].isHide = false;
                      break;
                    }
                  } else if (target[k].do === "hide") {
                    if (target[k].loop_number < questionsArray[i].loop_number) {
                      questionsArray[i].isHide = true;
                      this.clear_loop_answer(questionsArray, target[k], i, 'hide_loop')
                      break;
                    }

                  }
                }
              } else {
                if (target[k].handler === questionsArray[i].question.handler) {
                  if (target[k].do === "show") {
                    questionsArray[i].isHide = false;
                  } else if (target[k].do === "hide") {
                    questionsArray[i].isHide = true;
                    this.clear_loop_answer(questionsArray, target[k], i, 'hide')

                  }
                }
              }
            }
          }
          questionsArray = this.state.questions
        }
      }



    }
    if (this.state.selectedQuestion.properties.hasOwnProperty('noreturn') && this.state.selectedQuestion.properties.noreturn === 1) {
      this.validateNoReturn();
    }
    else {
      this.moveToNext();
    }
  }

  hide_unMetTarget_loopques(condition, questionsArray, parentIndex) {
    let loop_triggered_ques = false;
    let triggerd_ques_index = condition.multifield.length - 1;;
    let future_questuion = false;
    condition.multifield.forEach((m, cindex) => {
      if (m.value === questionsArray[parentIndex].question.handler) {
        if (triggerd_ques_index > 0) {
          triggerd_ques_index = triggerd_ques_index - 1;
          loop_triggered_ques = true;
        } else {
          loop_triggered_ques = true;
        }
      }
    })

    //  Find previous or future question
    if (condition.multifield.length > 0) {
      questionsArray.forEach((c, g) => {
        if (condition.multifield[triggerd_ques_index].value === c.question.handler &&
          !c.loop_triggered_qid &&
          parentIndex < g
        ) {
          future_questuion = true;;
          // spliceparentIndex = g
        }
      })
    }
    if (future_questuion) {
      if (loop_triggered_ques) {
        condition.isHide = true;
        condition.multifield[condition.multifield.length - 1].trigger = true;
        // condition.multifield.splice(condition.multifield.length - 1 , 1)
      } else {
        condition.isHide = true;
      }
    }
    else {
      condition.isHide = false;
    }
  }

  /* Manages clear loop question answer. */
  clear_loop(survey_answer_tag_id, question_id, loop_triggered_qid, loop_set_num, loop_number) {
    this.clear_loop_api(survey_answer_tag_id, question_id, loop_triggered_qid, loop_set_num, loop_number);
  }


  clear_loop_answer(questionsArray, conditions, currentQuesIndx, label) {
    let survey_answer_tag_id = questionsArray[currentQuesIndx].survey_answer_tag_id;
    let questionID = questionsArray[currentQuesIndx].question_id;
    let loop_triggered_qid = null;
    let loop_set_num = null;
    let loop_number = null;
    if (questionsArray[currentQuesIndx].hasOwnProperty('loop_triggered_qid') && questionsArray[currentQuesIndx].loop_triggered_qid >= 0) {
      loop_triggered_qid = questionsArray[currentQuesIndx].loop_triggered_qid;
    }
    if (loop_triggered_qid !== null) {
      loop_set_num = questionsArray[currentQuesIndx].loop_set_num;
      loop_number = questionsArray[currentQuesIndx].loop_number;
    }
    if (label === 'loop' || label === 'loop_set') {
      if (loop_triggered_qid === null) {
        this.clear_loop(survey_answer_tag_id, null, questionID, null, null)
      } else {
        this.clear_loop(survey_answer_tag_id, null, loop_triggered_qid, loop_set_num + 1, null)
      }
    } else if (label === 'loop_input') {
      if (loop_triggered_qid === null) {
        this.clear_loop(survey_answer_tag_id, null, questionID, null, null)
      } else {
        this.clear_loop(survey_answer_tag_id, null, loop_triggered_qid, null, null)
      }
    } else if (label === 'hide') {
      if (questionsArray[currentQuesIndx].hasOwnProperty('isDefault_loopset')) {
        this.clear_loop(survey_answer_tag_id, questionID, null, null, null)
      } else {
        this.clear_loop(survey_answer_tag_id, questionID, null, null, null)
        this.clear_loop(survey_answer_tag_id, null, questionID, null, null)
      }
    } else if (label === 'hide_loop') {
      this.clear_loop(survey_answer_tag_id, null, loop_triggered_qid, loop_set_num, loop_number)
    }
  }

  /**
   * Clear loop question answer in server based on user selected answer.
   * Clear loop question answer in local storage based on user selected answer.
   */
  clear_loop_api(survey_answer_tag_id, question_id, loop_triggered_qid, loop_set_num, loop_number) {
    let url = ""
    if (question_id !== null) {
      url = Constants.CLEAR_LOOP_ANSWERS + survey_answer_tag_id + '&question_id=' + question_id;
    }
    else if (loop_triggered_qid !== null) {
      url = Constants.CLEAR_LOOP_ANSWERS + survey_answer_tag_id + '&loop_triggered_qid=' + loop_triggered_qid;
      if (loop_set_num !== null) {
        url = url + '&loop_set=' + loop_set_num;
        if (loop_number !== null) {
          url = url + '&loop_number=' + loop_number;
        }
      }
    }
    let apiKey = localStorage.getItem("api_key");
    api2
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Auth: apiKey
        }
      })
      .then(response => {
        console.log('loop answers cleared', response.data)
      })
      .catch(error => {
        console.error(error);
      });

  }



  /* Remove loop question from main array based on loop condition. */
  clear_looponly(questionsArray, condition, parentIndex, label) {
    if (questionsArray[parentIndex].hasOwnProperty('isloop_only') && questionsArray[parentIndex].isloop_only === true) {
      let newquestionsArray = cloneDeep(this.state.questions);
      let questionsArr = cloneDeep(this.state.questions);
      let arry = [];
      let conditions = cloneDeep(condition.multifield);
      let loop_set_num = true;
      conditions.push({
        value: questionsArray[parentIndex].question.handler
      })
      if (questionsArray[parentIndex].hasOwnProperty('loop_set_num')) {
        loop_set_num = questionsArray[parentIndex].loop_set_num;
      }
      questionsArr.forEach((q, index) => {
        let check = false;
        conditions.forEach((m, cindex) => {
          if (!check && m.value === q.question.handler && q.hasOwnProperty('loop_triggered_qid') &&
            q.loop_triggered_qid === questionsArray[parentIndex].question_id
          ) {
            if (loop_set_num === true) {

              arry.push(index)
            } else if (loop_set_num < q.loop_set_num) {

              arry.push(index)
            }
          }
        })
      })
      if (loop_set_num) {
        newquestionsArray[parentIndex].isloop_only = false;
      }
      if (arry.length > 0) {
        let arryset = [...new Set(arry)]
        for (var i = arryset.length - 1; i >= 0; i--) {
          newquestionsArray.splice(arryset[i], 1);
        }
        // if (choice_type) {
        this.setSelectedChoiceOptions()
        this.setState({ questions: newquestionsArray })
      }
    }
  }

  /* Remove loop question from main array based on loop condition. */
  clear_loopset(questionsArray, condition, parentIndex, label) {
    if (questionsArray[parentIndex].hasOwnProperty('isloop_set') && questionsArray[parentIndex].isloop_set === true) {
      let newquestionsArray = cloneDeep(this.state.questions);
      let questionsArr = cloneDeep(this.state.questions);
      let arry = [];

      let conditions = cloneDeep(condition.multifield);
      let loop_set_num = true;
      conditions.push({
        value: questionsArray[parentIndex].question.handler
      })
      if (questionsArray[parentIndex].hasOwnProperty('loop_set_num')) {
        loop_set_num = questionsArray[parentIndex].loop_set_num;
      }
      questionsArr.forEach((q, index) => {
        let check = false;
        conditions.forEach((m, cindex) => {
          if (!check && m.value === q.question.handler && q.hasOwnProperty('loop_triggered_qid') &&
            q.loop_triggered_qid === questionsArray[parentIndex].question_id
          ) {
            if (loop_set_num === true) {
              arry.push(index)

            }
            else {
              if (loop_set_num < q.loop_set_num) {
                arry.push(index)

              }
            }
          }
        })
      })
      if (loop_set_num) {
        newquestionsArray[parentIndex].isloop_set = false;
      }
      if (arry.length > 0) {
        let arryset = [...new Set(arry)]
        for (var i = arryset.length - 1; i >= 0; i--) {
          newquestionsArray.splice(arryset[i], 1);
        }
        // if (choice_type) {
        this.setSelectedChoiceOptions()

        this.setState({ questions: newquestionsArray })
      }
    }
  }

  /* Remove loop question from main array based on user entered number. */
  clear_loopinput(questionsArray, condition, parentIndex, label) {
    if (questionsArray[parentIndex].hasOwnProperty('isloop_input') && questionsArray[parentIndex].isloop_input === true) {
      let newquestionsArray = cloneDeep(this.state.questions);
      let questionsArr = cloneDeep(this.state.questions);
      let arry = [];

      questionsArr.forEach((q, index) => {
        let check = false;
        condition.multifield.forEach((m, cindex) => {
          if (!check && m.value === q.question.handler && q.hasOwnProperty('loop_triggered_qid') &&
            q.loop_triggered_qid === questionsArray[parentIndex].question_id
          ) {
            arry.push(index)

          }
        })
      })
      if (arry.length > 0) {
        let arryset = [...new Set(arry)]
        for (var i = arryset.length - 1; i >= 0; i--) {
          newquestionsArray.splice(arryset[i], 1);
        }
        // if (choice_type) {
        this.setSelectedChoiceOptions()

        this.setState({ questions: newquestionsArray })
      }
    }
  }

  /**
   * Create duplicate question based on loop condition.
   * Find a trigger question in condition.
   * Find loop question set is next or previous question in selected survey questions.
   * Create duplicate question based on conditon or user entered number.
   * Calculate loopset number based on set of question.
   * Copy condition to duplicate condition.
   * Insert duplicate loop question array to main array specific index.
   * 
   */
  create_loop(questionsArray, condition, parentIndex, label) {
    let newquestionsArray = cloneDeep(this.state.questions);
    let questionsArr = cloneDeep(this.state.questions);
    let arry = [];
    let questionID = questionsArray[parentIndex].question_id;
    let newquesarr = {};
    let conditionistrue = false;
    let conditions = cloneDeep(condition.multifield)
    let loopset_condition = cloneDeep(condition.multifield)
    let spliceparentIndex = parentIndex
    let loop_triggered_ques = conditions.length;
    let future_questuion = false;
    let with_trigger = false;
    let check_with_condition = true;
    let move_condition = false;
    let num_loop = null;
    let old_value = null;
    let new_value = null;
    let newconditions = []
    if (label === 'loop') {
      if (newquestionsArray[parentIndex].hasOwnProperty('isloop_only')) {
        conditionistrue = newquestionsArray[parentIndex].isloop_only
      }
    } else if (label === 'loop_set') {
      if (newquestionsArray[parentIndex].hasOwnProperty('isloop_set')) {
        conditionistrue = newquestionsArray[parentIndex].isloop_set
      }
      num_loop = condition.num_loop
      if (num_loop === '' || num_loop < 1) {
        conditionistrue = true;
      }
    } else if (label === 'loop_input') {
      if (newquestionsArray[parentIndex].hasOwnProperty('isloop_input')) {
        conditionistrue = newquestionsArray[parentIndex].isloop_input
      }
      if (newquestionsArray[parentIndex].hasOwnProperty('loop_inputvalue')) {
        old_value = newquestionsArray[parentIndex].loop_inputvalue
        new_value = newquestionsArray[parentIndex].answers.text
        new_value = parseInt(new_value)
        old_value = parseInt(old_value)
        if (old_value !== new_value) {
          conditionistrue = false;
          this.clear_loopinput(questionsArray, condition, parentIndex, label)
          this.clear_loop_answer(questionsArray, condition, parentIndex, label)
          newquestionsArray = cloneDeep(this.state.questions);
          questionsArr = cloneDeep(this.state.questions);

        }
      }
      num_loop = newquestionsArray[parentIndex].answers.text
      num_loop = parseInt(num_loop)
    }

    if (!conditionistrue) {
      if (condition.hasOwnProperty('condition') && condition.condition) {
        check_with_condition = false;
      }

      condition.multifield.forEach((m, cindex) => {
        if (m.value === questionsArray[parentIndex].question.handler) {
          loop_triggered_ques = cindex
          with_trigger = true;
        }
      })
      //  Find previous or future question
      if (condition.multifield.length > 0) {
        if (loop_triggered_ques !== null && loop_triggered_ques > 0) {
          questionsArr.forEach((c, g) => {
            if (!c.hasOwnProperty('loop_number') &&
              condition.multifield[loop_triggered_ques - 1].value === c.question.handler &&
              parentIndex < g
            ) {
              future_questuion = true;
              spliceparentIndex = g
            }
          })
        }
      }
      if (label === 'loop') {
        if (future_questuion) {
          if (with_trigger) {
            let temp = {}
            temp = condition.multifield[condition.multifield.length - 1];
            newconditions.push(temp)
            move_condition = true;
          } else {
            conditionistrue = true;
          }
        } else {
          if (with_trigger) {
            // conditions = [];
            newconditions = condition.multifield
            spliceparentIndex = parentIndex;
            move_condition = true;
          } else {
            // conditions = [];
            newconditions = condition.multifield
            spliceparentIndex = parentIndex;
          }
        }
      } else if (label === 'loop_set') {
        if (check_with_condition) {
          if (future_questuion) {
            if (with_trigger) {
              if (num_loop === 1 || num_loop === 0) {
                let temp = {};
                temp = condition.multifield[condition.multifield.length - 1]
                newconditions.push(temp)
                move_condition = true;
              } else {
                let trigger_Ques = {};
                trigger_Ques = condition.multifield[loop_triggered_ques];
                let temp = []
                loopset_condition = conditions.splice(loop_triggered_ques, 1)
                for (let i = 1; i < num_loop; i++) {
                  conditions.forEach((m, cindex) => {
                    temp.push(m)
                  })
                }
                temp.push(trigger_Ques)
                newconditions = temp
                spliceparentIndex = parentIndex + condition.multifield.length - 1;
                move_condition = true;
              }
            } else {
              if (num_loop === 1 || num_loop === 0) {
                conditionistrue = true;
              } else {
                num_loop = num_loop - 1;
                // conditions = [];       
                for (let i = 0; i < num_loop; i++) {
                  for (let j = 0; j < loopset_condition.length; j++) {
                    newconditions.push(loopset_condition[j])
                  }
                }
              }
            }
          } else {
            if (with_trigger) {
              let trigger_Ques = {};
              trigger_Ques = condition.multifield[loop_triggered_ques];
              let temp = []
              loopset_condition = conditions.splice(loop_triggered_ques, 1)
              for (let i = 0; i < num_loop; i++) {
                conditions.forEach((m, cindex) => {
                  temp.push(m)
                })
              }
              temp.push(trigger_Ques)
              newconditions = temp
              move_condition = true;
            } else {
              for (let i = 0; i < num_loop; i++) {
                loopset_condition.forEach((m, cindex) => {
                  newconditions.push(m)
                })
              }
            }
          }
        } else {
          if (num_loop === 1 || num_loop === 0) {
            conditionistrue = true;
          } else {
            num_loop = num_loop - 1;
            //  conditions = [];       
            for (let i = 0; i < num_loop; i++) {
              loopset_condition.forEach((m, cindex) => {
                newconditions.push(m)
              })
            }
          }
        }
      } else if (label === 'loop_input') {
        if (future_questuion) {
          if (num_loop === 1) {
            newquestionsArray[parentIndex].isloop_input = true;
            newquestionsArray[parentIndex].loop_inputvalue = num_loop
            this.setState({ questionsArr: newquestionsArray })
            conditionistrue = true;
          } else {
            num_loop = num_loop - 1;
            for (let i = 0; i < num_loop; i++) {
              loopset_condition.forEach((m, cindex) => {
                newconditions.push(m)
              })
            }
          }
        } else {
          for (let i = 0; i < num_loop; i++) {
            loopset_condition.forEach((m, cindex) => {
              newconditions.push(m)
            })
          }
        }
      }


    }

    if (!conditionistrue) {
      let num_loop_diff = loopset_condition.length;
      let calc_loop_num = 0;
      let loop_set_num = 1;
      let loop_number = 1;
      if (label === 'loop') {
        newquestionsArray[parentIndex].isloop_only = true;
      } else if (label === 'loop_set') {
        newquestionsArray[parentIndex].isloop_set = true;
      } else if (label === 'loop_input') {
        newquestionsArray[parentIndex].isloop_input = true;
        newquestionsArray[parentIndex].loop_inputvalue = parseInt(newquestionsArray[parentIndex].answers.text);
      }

      if (questionsArray[parentIndex].hasOwnProperty('loop_set_num') &&
        questionsArray[parentIndex].hasOwnProperty('loop_set_end') &&
        questionsArray[parentIndex].loop_set_end === true
      ) {
        loop_set_num = questionsArray[parentIndex].loop_set_num + 1;
      }

      newconditions.forEach((m, cindex) => {
        questionsArr.forEach((q, index) => {
          let check = false;
          if (!check && m.value === q.question.handler) {
            if (q.hasOwnProperty('loop_number')) { check = true; }
            if (!check) {
              if (label === 'loop_input') {
                if (calc_loop_num >= num_loop_diff) {
                  loop_set_num = loop_set_num + 1
                  calc_loop_num = 0;
                  loop_number = 1;
                }
              }
              check = true;
              newquesarr = {};
              newquesarr.answers = ""
              newquesarr.question = q.question;
              newquesarr.question_id = q.question_id;
              newquesarr.loop_triggered_qid = questionID;
              newquesarr.loop_number = label === 'loop_input' ?
                loop_number : cindex + 1;
              newquesarr.loop_set_num = loop_set_num;
              newquesarr.survey_answer_tag_id = q.survey_answer_tag_id;
              newquesarr.survey_id = q.survey_id;
              newquesarr.id = q.id;
              newquesarr.isloop = true;
              // newquesarr.conditions =[];
              if (cindex === newconditions.length - 1) {
                newquesarr.loop_set_end = true
              }
              if (newquesarr.hasOwnProperty('loop_set_end') && newquesarr.loop_set_end === true) {
                // if(future_questuion){
                //   newquesarr.conditions = this.setloopquesconditions(q.conditions, questionID, loop_set_num, cindex + 1, true,future_questuion)
                // } else {
                newquesarr.conditions = this.setloopquesconditions(q.question.conditions, questionID, loop_set_num, cindex + 1, move_condition, move_condition)
                // }
              } else {
                newquesarr.conditions = this.setloopquesconditions(q.question.conditions, questionID, loop_set_num, loop_number, false, false)
              }

              if (questionsArr[index].loop_answers && questionsArr[index].loop_answers.length > 0) {

                questionsArr[index].loop_answers.forEach((a, aindex) => {
                  if (label === 'loop_input') {
                    if (questionID === a.loop_triggered_qid && a.loop_set === loop_set_num && loop_number === a.loop_number) {
                      newquesarr.answers = a.answers;
                    }
                  } else {
                    if (questionID === a.loop_triggered_qid && a.loop_set === loop_set_num && (cindex + 1) === a.loop_number) {
                      newquesarr.answers = a.answers;
                    }
                  }
                })
              }
              arry.push(newquesarr)
              if (label === 'loop_input') {
                calc_loop_num = calc_loop_num + 1;
                loop_number = loop_number + 1;
              }
            }
          }

        })
      })
      if (arry.length > 0) {
        newquestionsArray.splice(spliceparentIndex + 1, 0, ...arry)
        if (this.state.selectedQuestion.length > 0) {
          this.setSelectedChoiceOptions()
        }
        this.setState({ questions: newquestionsArray })
      }
    }
  }


  /**
   * Copy the condition to created loop question.
   * Add trigged question id, loop number and loop setnumber to loop question condition array.
   * 
   */
  setloopquesconditions(conditions, id, loop_set_num, index, check, future_questuion) {
    let condition = cloneDeep(conditions);
    let newcondition = cloneDeep(conditions)
    if (condition.length > 0) {
      let arry = []
      if (check) {
        for (let i = 0; i < condition.length; i++) {
          newcondition[i].target.loop_triggered_qid = id;
          newcondition[i].target.loop_number = index;
          newcondition[i].target.loop_set_num = loop_set_num;
          if (future_questuion === true) {
            newcondition[i].target.loop = true;
          }
        }
      } else {
        for (let i = 0; i < condition.length; i++) {
          if (condition[i].target.do === 'loop' || condition[i].target.do === 'loop_set' || condition[i].target.do === 'loop_input') {
            arry.push(i)
          }
          else {
            newcondition[i].target.loop_triggered_qid = id;
            newcondition[i].target.loop_number = index;
            newcondition[i].target.loop = true;
            newcondition[i].target.loop_set_num = loop_set_num;
          }
        }
      }
      if (arry.length > 0) {
        for (var i = arry.length - 1; i >= 0; i--) {
          newcondition.splice(arry[i], 1);
        }
      }

    }
    return newcondition
  }

  /**
  * Get target question based on user answer's
  * 
  * validate condition based on question type
  *
  * @param {Array} conditions Conditions array
  * @param {String} answer User defined value
  */
  getConditionalTarget(conditions, answer, type, question, target, unMetTarget) {
    let check = true;
    for (let i = 0; i < conditions.length; i++) {
      for (let j = 0; j < conditions[i].source.length; j++) {
        if (conditions[i].source[j].state === "" && conditions[i].target.do === "loop_set") {
          conditions[i].target.condition = true
          target.push(conditions[i].target);
          check = false;
        }
      }
    }
    if (check) {
      if ((answer && Object.keys(answer).length > 0) || (type === 'input')) {
        if (type === "input") {
          this.inputConditionalTarget(conditions, answer, target, unMetTarget);
        } else if (type === 'choice') {
          this.choiceConditionalTarget(conditions, answer, target, unMetTarget);
        } else if (type === 'scale') {
          if (answer && answer.hasOwnProperty('scale_type') && answer.scale_type === 'scale') {
            this.scaleConditionalTarget(conditions, answer, target, unMetTarget);
          } else if (answer && answer.hasOwnProperty('scale_type') && answer.scale_type === 'table') {
            this.tableConditionalTarget(conditions, answer, question, target, unMetTarget);
          }
        }
      } else {
        for (let j = 0; j < conditions.length; j++) {
          if (conditions[j].target.do !== 'release') {
            unMetTarget.push(conditions[j].target);
          }
        }
      }
    }
  }

  /**
    * Input type questions Get target question based on user answer's
    *
    * @param {Array} conditions Conditions Array
    * @param {String} answer User defined value
    */
  inputConditionalTarget(conditions, answer, target, unMetTarget) {
    let { questionsArr } = this.state.questions;

    for (let i = 0; i < conditions.length; i++) {
      let match = 0;
      // Match with current question answer when target is value
      for (let j = 0; j < conditions[i].source.length; j++) {
        if (conditions[i].target.do !== 'release') {
          let isMatch = false;
          if (conditions[i].source[j].state !== '') {
            if (conditions[i].source[j].target !== 'field' && conditions[i].source[j].state !== "loop_input") {
              isMatch = this.conditionValidation(answer.text !== undefined ? answer.text : answer, conditions[i].source[j].match_value, conditions[i].source[j].state);
              if (isMatch) {
                match = match + 1;
              }

              // Match with another question answer when target is field
            } else if (conditions[i].source[j].target === 'field') {
              let matchValue;
              for (let j = 0; j < questionsArr.length; j++) {
                if (questionsArr[j].question.handler === conditions[i].source[j].matchid && !matchValue) {
                  matchValue = this.getFieldQuesionAnswer(questionsArr[j]);
                }
              }
              if (matchValue !== undefined) {
                isMatch = this.conditionValidation(answer.text !== undefined ? answer.text : answer, matchValue, conditions[i].source[j].state);
              }
              if (isMatch) {
                match = match + 1;
              }
            } else if (conditions[i].source[j].state === 'loop_input') {
              let matchValue = answer.text !== undefined ? answer.text : '';
              matchValue = parseInt(matchValue)
              if (isNaN(matchValue)) {
                conditions[i].target.do = 'loop_input'
              } else {
                if (matchValue !== 0) {
                  match = match + 1;
                  conditions[i].target.do = 'loop_input'
                }
              }
            }
          }
        }
        if (conditions[i].rule && conditions[i].rule === "any" && match > 0) {
          target.push(conditions[i].target);
        }
        else if (conditions[i].rule && conditions[i].rule === "and" && match === conditions[i].source.length) {
          target.push(conditions[i].target);
        }
        else {
          unMetTarget.push(conditions[i].target);
        }
      }
    }
  }
  /**
   * Choice type questions Get target question for single selection
   *
   * @param {Array} conditions Conditions Array
   * @param {String} selected Selected value
   */
  choiceSingleLevelTarget(conditions, selected, target, unMetTarget) {
    let { questionsArr } = this.state.questions;

    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].target.do !== 'release') {
        let match = 0;
        // Match with current question answer when target is value
        for (let j = 0; j < conditions[i].source.length; j++) {
          let isMatch = false;
          if (conditions[i].source[j].state !== '') {
            if (conditions[i].source[j].target !== 'field') {
              if (selected !== undefined) {
                isMatch = this.conditionValidation(selected, conditions[i].source[j].match_value, conditions[i].source[j].state, conditions[i].source[j].target);
                if (isMatch) {
                  match = match + 1;
                }
              }
              // Match with another question answer when target is field
            } else if (conditions[i].source[j].target === 'field') {
              let matchValue;
              for (let j = 0; j < questionsArr.length; j++) {
                if (questionsArr[j].question.handler === conditions[i].source[j].matchid && !matchValue) {
                  matchValue = this.getFieldQuesionAnswer(questionsArr[j]);
                }
              }
              if (matchValue !== undefined) {
                isMatch = this.conditionValidation(selected, matchValue, conditions[i].source[j].state, conditions[i].source[j].target);
                if (isMatch) {
                  match = match + 1;
                }
              }

            }
          }
        }
        if (conditions[i].rule && conditions[i].rule === "any" && match > 0) {
          target.push(conditions[i].target);
        }
        else if (conditions[i].rule && conditions[i].rule === "and" && match === conditions[i].source.length) {
          target.push(conditions[i].target);
        }
        else {
          unMetTarget.push(conditions[i].target);
        }
      }
    }
  }

  /**
   * Choice type questions Get target question for multi selection
   *
   * @param {Array} conditions Conditions Array
   * @param {String} selected Selected value
   */
  choiceMultiLevelTarget(conditions, selected, target, unMetTarget, label) {

    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].target.do !== 'release') {
        let match = 0;
        // Match with current question answer when target is value
        for (let j = 0; j < conditions[i].source.length; j++) {
          let isMatch = false;
          let isNotEqual = true;
          if (conditions[i].source[j].state !== '') {
            if (conditions[i].source[j].target !== 'field') {
              if (conditions[i].source[j].target === "Value_Multiple_Any") {
                if (conditions[i].source[j].match_value.length && conditions[i].source[j].match_value.length > 0) {
                  if (conditions[i].source[j].state === "equal") {
                    for (let eq = 0; eq < selected.length; eq++) {
                      for (let mv = 0; mv < conditions[i].source[j].match_value.length; mv++) {
                        if (
                          selected[eq][`${label}`] ===
                          conditions[i].source[j].match_value[mv].value
                        ) {
                          isMatch = true;
                        }
                      }
                    }
                  } else if (conditions[i].source[j].state === "notequal") {
                    for (let neq = 0; neq < selected.length; neq++) {
                      for (let mv = 0; mv < conditions[i].source[j].match_value.length; mv++) {
                        if (
                          selected[neq][`${label}`] ===
                          conditions[i].source[j].match_value[mv].value
                        ) {
                          isNotEqual = false;
                        }
                      }
                    }
                    isMatch = isNotEqual;
                  }
                }
              } else if (conditions[i].source[j].target === "Value_Multiple_All") {
                // let multiple_match = false;
                if (conditions[i].source[j].match_value.length && conditions[i].source[j].match_value.length > 0) {
                  if (conditions[i].source[j].state === "equal") {
                    let match_index = []
                    for (let eq = 0; eq < selected.length; eq++) {
                      for (let mv = 0; mv < conditions[i].source[j].match_value.length; mv++) {
                        if (
                          selected[eq][`${label}`] ===
                          conditions[i].source[j].match_value[mv].value
                        ) {
                          // multiple_match = true;
                          match_index.push(mv)
                        } else {
                          // multiple_match = false
                        }
                      }
                      isMatch = match_index.length === conditions[i].source[j].match_value.length
                      // isMatch = multiple_match
                    }
                  } else if (conditions[i].source[j].state === "notequal") {
                    let match_index = []
                    for (let neq = 0; neq < selected.length; neq++) {
                      for (let mv = 0; mv < conditions[i].source[j].match_value.length; mv++) {
                        if (
                          selected[neq][`${label}`] !==
                          conditions[i].source[j].match_value[mv].value
                        ) {
                          // multiple_match = true;
                          match_index.push(mv)
                        } else {
                          // multiple_match = false;
                        }
                      }
                    }
                    isMatch = match_index.length === conditions[i].source[j].match_value.length
                    // isMatch = multiple_match;
                  }
                }
              }
              if (conditions[i].source[j].state === 'equal') {
                for (let eq = 0; eq < selected.length; eq++) {
                  if (selected[eq][`${label}`] === conditions[i].source[j].match_value) {
                    isMatch = true;
                  }
                }
              } else if (conditions[i].source[j].state === 'notequal') {
                for (let neq = 0; neq < selected.length; neq++) {
                  if (selected[neq][`${label}`] === conditions[i].source[j].match_value) {
                    isNotEqual = false;
                  }
                }
                isMatch = isNotEqual;
              }
              if (isMatch) {
                match = match + 1;
              }
            }
          }
        }
        if (conditions[i].rule && conditions[i].rule === "any" && match > 0) {
          target.push(conditions[i].target);
        }
        else if (conditions[i].rule && conditions[i].rule === "and" && match === conditions[i].source.length) {
          target.push(conditions[i].target);
        }
        else {
          unMetTarget.push(conditions[i].target);
        }
      }

    }

  }

  /**
   * Choice type questions Get target question based on user answer's
   *
   * @param {Array} conditions Conditions Array
   * @param {String} answer User defined value
   */
  choiceConditionalTarget(conditions, answer, target, unMetTarget) {
    let selected;

    if (answer) {
      // Single choice type with multi level list
      if (answer.choice_type === 'single' && answer.multilevel === 1 && answer.hasOwnProperty('selected_option') && answer.selected_option.length > 0) {
        selected = answer.selected_option[0].sublabel;
        this.choiceSingleLevelTarget(conditions, selected, target, unMetTarget);
        // Single choice type with single level list
      } else if (answer.choice_type === 'single' && answer.multilevel === 0 && answer.label && answer.label !== "") {
        selected = answer.label;
        this.choiceSingleLevelTarget(conditions, selected, target, unMetTarget);
        // Multi choice type with single level list
      } else if (answer.choice_type === 'multiple' && answer.multilevel === 0 && answer.hasOwnProperty('selected_option') && answer.selected_option.length > 0) {
        selected = answer.selected_option;
        this.choiceMultiLevelTarget(conditions, selected, target, unMetTarget, "label");
        // Multi choice type with Multi level list
      } else if (answer.choice_type === 'multiple' && answer.multilevel === 1 && answer.hasOwnProperty('selected_option') && answer.selected_option.length > 0) {
        selected = answer.selected_option;
        this.choiceMultiLevelTarget(conditions, selected, target, unMetTarget, "sublabel");
      } else {
        for (let i = 0; i < conditions.length; i++) {
          if (conditions[i].target.do !== 'release') {
            unMetTarget.push(conditions[i].target);
          }
        }

      }
    }
    else {
      for (let i = 0; i < conditions.length; i++) {
        if (conditions[i].target.do !== 'release') {
          unMetTarget.push(conditions[i].target);
        }
      }

    }
  }


  /**
   * Scale type questions Get target question if icon type is emoji
   *
   * @param {Array} conditions Conditions Array
   * @param {String} selected Selected value
   */
  scaleSingleConditionalTarget(conditions, selected, target, unMetTarget) {
    let { questionsArr } = this.state.questions;

    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].target.do !== 'release') {
        let match = 0;
        // Match with current question answer when target is value
        for (let j = 0; j < conditions[i].source.length; j++) {
          let isMatch = false;
          if (conditions[i].source[j].state !== '') {
            if (conditions[i].source[j].target !== 'field') {
              if (selected !== undefined) {
                isMatch = this.conditionValidation(selected, conditions[i].source[j].match_value, conditions[i].source[j].state, conditions[i].source[j].target);
                if (isMatch) {
                  match = match + 1;
                }
              }
              // Match with another question answer when target is field
            } else if (conditions[i].source[j].target === 'field') {
              let matchValue;
              for (let j = 0; j < questionsArr.length; j++) {
                if (questionsArr[j].question.handler === conditions[i].source[j].matchid && !matchValue) {
                  matchValue = this.getFieldQuesionAnswer(questionsArr[j]);
                }

              }
              if (matchValue !== undefined) {
                isMatch = this.conditionValidation(selected, matchValue, conditions[i].source[j].state, conditions[i].source[j].target);
                if (isMatch) {
                  match = match + 1;
                }
              }
            }
          }
        }
        if (conditions[i].rule && conditions[i].rule === "any" && match > 0) {
          target.push(conditions[i].target);
        }
        else if (conditions[i].rule && conditions[i].rule === "and" && match === conditions[i].source.length) {
          target.push(conditions[i].target);
        }
        else {
          unMetTarget.push(conditions[i].target);
        }
      }
    }

  }



  /**
   * Scale type questions Get target question based on user answer's
   *
   * @param {Array} conditions Conditions Array
   * @param {String} answer User defined value
   */
  scaleConditionalTarget(conditions, answer, target, unMetTarget) {
    let selected;

    if (answer) {
      // Get selected answer
      if (answer && answer.hasOwnProperty('selected_option') && answer.selected_option.length > 0) {
        if (answer.icon_type === 'emoji') {
          selected = answer.selected_option[0].value;
          this.scaleSingleConditionalTarget(conditions, selected, target, unMetTarget);
        } else if (answer.icon_type === 'image') {
          let lastSelected = answer.selected_option.length - 1;
          selected = answer.selected_option[lastSelected].value;
          this.scaleSingleConditionalTarget(conditions, selected, target, unMetTarget);
        }
      }
    }
  }

  /**
   * Find the condition source with selected answer
   *
   * @param {Question Object} questionObj Current question object
   * @param {Any} condition Current question condition
   */
  tableConditonalSourceMap(selected, questionObj, source) {
    let isMatch = false;
    let matchOptionId;
    let matchValueId;
    let question = questionObj;
    if (questionObj.hasOwnProperty('table_content')) {
      question = questionObj.table_content;
    }
    const { table_options, table_value } = question;
    // using loop through find the condition source option id
    for (let i = 0; i < table_options.length; i++) {
      if (source.match_option === table_options[i].value) {
        matchOptionId = table_options[i].id;
      }
    }
    // using loop through find the condition source value id
    for (let i = 0; i < table_value.length; i++) {
      if (source.match_value === table_value[i].value) {
        matchValueId = table_value[i].id;
      }
    }
    // Check the matching condition with table options and values
    if (matchOptionId !== undefined && matchValueId !== undefined) {
      let matchObj = {
        optionId: matchOptionId,
        valueId: matchValueId
      }
      isMatch = this.tableConditonalValidate(selected, matchObj, source.state);
    }
    return isMatch;
  }

  /**
   * Validate the table
   *
   * @param {Array} selected Selected answer
   * @param {Object} matchObj Matching row and column as object
   * @param {Object} condition Current condition object
   */
  tableConditonalValidate(selected, matchObj, condition) {
    let isMatch = false;
    const { valueId, optionId } = matchObj;

    if (condition === 'equal') {
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].id === matchObj.valueId && selected[i].image.id === matchObj.optionId && isMatch === false) {
          isMatch = true;
        }
      }
      if (selected[valueId] !== undefined && selected[valueId].image.id === optionId) {
        isMatch = true;
      }
    } else if (condition === 'notequal') {
      let notEqual = true;
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].id === matchObj.valueId && selected[i].image.id === matchObj.optionId && notEqual === true) {
          notEqual = false;
        }
      }
      isMatch = notEqual;
    }
    return isMatch;
  }

  /**
   * Scale type questions Get target question based on user answer's
   *
   * @param {Array} conditions Conditions Array
   * @param {String} answer User defined value
   */
  tableConditionalTarget(conditions, answer, question, target, unMetTarget) {

    let selected;

    if (answer) {
      // Get selected answer
      if (answer && answer.hasOwnProperty('selected_option') && answer.selected_option.length > 0) {
        selected = answer.selected_option;
      }
    }
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].target.do !== 'release') {
        let match = 0;
        // Match with current question answer when target is value
        for (let j = 0; j < conditions[i].source.length; j++) {
          if (conditions[i].source[j].state !== '') {
            if (conditions[i].source[j].target !== 'field') {
              if (selected !== undefined) {
                let isMatch = this.tableConditonalSourceMap(selected, question, conditions[i].source[j]);
                if (isMatch) {
                  match = match + 1;
                }
              }

            }
          }
        }
        if (conditions[i].rule && conditions[i].rule === "any" && match > 0) {
          target.push(conditions[i].target);
        }
        else if (conditions[i].rule && conditions[i].rule === "and" && match === conditions[i].source.length) {
          target.push(conditions[i].target);
        }
        else {
          unMetTarget.push(conditions[i].target);
        }
      }
    }
  }

  getFieldQuesionAnswer(selected) {
    let answer;
    if (selected && selected.question.hasOwnProperty('type')) {
      let type = selected.question.type;
      if (type === 'input') {
        answer = this.inputFieldAnswer(selected);
      } else if (type === 'choice') {
        answer = this.choiceFieldAnswer(selected);
      } else if (type === 'scale') {
        if (selected.hasOwnProperty('scale_type') && selected.scale_type === 'scale') {
          answer = this.scaleFieldAnswer(selected);
        }
      }
    }
    return answer;
  }

  /**
    * Get input type "target field" question answer
    *
    * @param {Object} selected Field question answer
    */
  inputFieldAnswer(selected) {
    let answer;
    answer = selected.answers;
    return answer;
  }

  /**
   * Get Choice type "target field" question answer
   *
   * @param {Object} selected Field question answer
   */
  choiceFieldAnswer(selected) {
    let answer;
    let selecteAnswer = selected.answers;
    // Single choice type with multi level list
    if (selecteAnswer.choice_type === 'single' && selecteAnswer.multilevel === 1 && selecteAnswer.hasOwnProperty('selected_option') && selecteAnswer.selected_option.length > 0) {
      answer = selecteAnswer.selected_option[0].sublabel;
      // Single choice type with single level list
    } else if (selecteAnswer.choice_type === 'single' && selecteAnswer.multilevel === 0) {
      answer = selecteAnswer.label;
    }
    return answer;
  }


  /**
   * Get Scale type "target field" question answer
   *
   * @param {Object} selected Field question answer
   */
  scaleFieldAnswer(selected) {
    let answer;
    let selecteAnswer = selected.answers;
    // Get selected answer from another question
    if (selecteAnswer.hasOwnProperty('selected_option') && selecteAnswer.selected_option.length > 0) {
      answer = selecteAnswer.selected_option[selecteAnswer.selected_option.length - 1].value
    }
    return answer;
  }


  /**
    * Validate input type question when conditions exist in the question
    *
    * @param {String} value User defined value
    * @param {String} matchValue Conditional Match value
    * @param {String} condition Condition Type
    */
  conditionValidation(val, matchVal, condition, target) {
    if ((val !== undefined && matchVal !== undefined) || (condition === "empty" || condition === "filled")) {
      let isMatch = false;
      let multiple_value = true;
      const value = val !== null && typeof (val) === 'string' ? val.toLowerCase() : val;
      const matchValue = typeof (matchVal) === 'string' ? matchVal.toLowerCase() : matchVal;

      switch (condition) {
        case 'equal':
          if (target === "Value_Multiple_Any") {
            for (let mv = 0; mv < matchVal.length; mv++) {
              if (matchVal[mv].value === val) {
                isMatch = true;
              }
            }
          } else if (target === "Value_Multiple_All") {
            for (let mv = 0; mv < matchVal.length; mv++) {
              if (matchVal[mv].value !== value) {
                multiple_value = false;
              }
            }
            isMatch = multiple_value
          } else {
            isMatch = value === matchValue;
          }
          break;
        case 'notequal':
          if (target === "Value_Multiple_Any") {
            for (let mv = 0; mv < matchVal.length; mv++) {
              if (matchVal[mv].value === val) {
                multiple_value = false;
              }
            }
            isMatch = multiple_value
          } else if (target === "Value_Multiple_All") {
            for (let mv = 0; mv < matchVal.length; mv++) {
              if (matchVal[mv].value !== value) {
                multiple_value = false;
              }
            }
            isMatch = multiple_value
          } else {
            isMatch = value !== matchValue;
          }
          break;
        case 'contain':
          isMatch = value !== null && value.includes(matchValue);
          break;
        case 'notcontains':
          isMatch = value !== null && !value.includes(matchValue);
          break;
        case 'starts':
          isMatch = value !== null && value.startsWith(matchValue);
          break;
        case 'notstarts':
          isMatch = value !== null && !value.startsWith(matchValue);
          break;
        case 'ends':
          isMatch = value !== null && value.endsWith(matchValue);
          break;
        case 'notends':
          isMatch = value !== null && !value.endsWith(matchValue);
          break;
        case 'empty':
          isMatch = value === '' || value === null;
          break;
        case 'filled':
          isMatch = value !== '' && value !== null;
          break;
        default:
          break;
      }
      return isMatch;
    }
    else {
      return false;
    }
  }

  onDrop(file) {
    let Upload = []

    const fileType = file.type;
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    // if(options.maxSizeMB>=file.size/1024){
    //   alert("Bring a bigger Image");
    //   return 0;
    // }
    if (!validImageTypes.includes(fileType)) {
      this.getBase64(file).then(data => {
        Upload["media"] = data;
        this.setState({
          Upload: Upload
        })
      })
    }
    else {
      const options = {
        // maxSizeMB: 2,
        maxWidthOrHeight: 500,
        useWebWorker: true
      }
      let output;
      imageCompression(file, options).then(x => {
        output = x;
        this.getBase64(output).then(data => {
          Upload["media"] = data;
          this.setState({
            Upload: Upload
          })
        })
      })
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  render() {

    let questions = this.state.questions;
    let index = this.state.index;
    let selectedQuestion =
      questions.length > 0
        ? questions[index].question
        : {};
    let selectedAnswer = questions.length > 0 ? (questions[index].answers ? questions[index].answers === null : {}) : {};

    const { error, msgColor, br, message, otheroptiontextbox } = this.state;

    const {
      tableContainer,
      tableRow,
      tableRowText,
      tableCellCol,
      tableCellFirstCol
    } = styles;


    return (
      <div style={{ backgroundColor: '#605F77', height: 'inherit' }}>

        <div style={{ height: '100%', width: '100%', padding: '2% 5%' }}>
          <Card style={{ borderRadius: '10px' }}>
            <Snackbar
              place="bc"
              color={msgColor}
              open={br}
              message={message}
              closeNotification={() => this.setState({ br: false })}
              close
            />

            {this.state.nextPage === false ? (

              <div>
                <div>
                  <picture>
                    <source media="(max-width: 760px)" srcset={background} />
                    <img
                      id="myVideo"
                      style={{
                        position: "fixed",
                        left: 0,
                        top: 0,

                        width: "100%",

                        height: "100%",
                        objectFit: "cover",
                        backgroundRepeat: "repeat",
                        overflow: "hidden"
                      }}
                      src={surveyWeb}
                      alt="logo"
                    />

                    <div className="videoOver"> </div>
                  </picture>
                </div>

                <div className="content" style={{ textAlign: "center", minWidth: "250px" }}>

                  <Row className="d-flex justify-content-center">
                    <img src={logo} className="Login-logo" alt="logo" />
                  </Row>
                  <br />
                  {idExists === false &&
                    <p style={{ color: "#fff", fontSize: "14px" }}>Please Enter your Details:</p>
                  }
                  <div>
                    <div className="d-flex justify-content-center">
                      {error && (
                        <Alert style={{ color: "#fff", fontSize: "12px" }}>
                          {this.state.alertMessage}
                        </Alert>
                      )}
                      {!error && (
                        <Alert style={{ color: "#fff", fontSize: "12px" }}>
                        </Alert>
                      )}
                    </div>
                    {idExists === false &&
                      <div>

                        <input
                          style={{
                            marginTop: "5px",
                            width: "100%",
                            padding: "5px",
                            display: "inline-block",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            boxSizing: "border-box",
                            fontSize: "16px"
                          }}
                          type="email"
                          placeholder="Enter Email"
                          id="email"
                          //required
                          onChange={e => this.handleChange(e)}
                        />
                        <br />

                        <input
                          style={{
                            marginTop: "15px",
                            width: "100%",
                            padding: "5px",
                            display: "inline-block",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            boxSizing: "border-box",
                            fontSize: "16px"
                          }}
                          type="number"
                          placeholder="Enter Mobile Number"
                          id="number"
                          onChange={e => this.handleChangeMobile(e)}
                          //required
                          pattern="[0-9]*"
                          inputmode="numeric"
                        />
                        <br />
                        <div
                          style={{ color: "white" }}>
                          <Checkbox
                            style={{ color: "white" }}
                            color="primary"
                            id="1"
                            checked={!this.state.agree}
                            onChange={(e) => e.target.checked === true ? this.setState({ agree: false }) : this.setState({ agree: true })}
                          />
                          <span><a style={{ color: "#fff", fontSize: "14px" }} rel="noopener noreferrer" href="http://www.eolasinternationalportal.com/EolasAppTandCs.htm" target="_blank" >I agree to the Terms of Service and Privacy Policy</a></span>
                        </div>
                        <div
                          style={{
                            marginTop: "10px"
                          }}
                        >
                          <Button
                            style={{ color: "white", fontSize: "14px" }}
                            variant="contained"
                            color="primary"
                            disabled={this.state.agree}
                            onClick={this.WebLinkCredentialValidation}
                          >
                            Submit
                          </Button>
                        </div>

                      </div>
                    }
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            {this.state.nextPage === true && selectedQuestion && selectedQuestion.type && selectedQuestion.properties ? (
              <div style={{ height: '100%', width: '100%' }}>
                <div className="coloredInput">
                  <div
                    className="head-style"
                    style={{
                      marginTop: "50px",
                      marginBottom: "30px"
                    }}
                  >
                    <h4
                      align="center"
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        marginBottom: "10px",
                        color: "#1A385B",
                        fontStyle: "Roboto"
                      }}
                    >
                      {selectedQuestion.properties.question}
                      <span
                        align="center"
                        style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          marginBottom: "10px",
                          color: "red"
                        }}
                      >{selectedQuestion.properties.mandatory ? selectedQuestion.properties.mandatory === 1 ? "*" : "" : ""} </span>
                    </h4>
                    <h6
                      style={{
                        fontSize: "12px",
                        textAlign: "center",
                        opacity: "0.4",
                        color: "#000000",
                        fontWeight: "600",
                        fontStyle: "Roboto"
                      }}
                    >
                      {selectedQuestion.properties.subheading ? selectedQuestion.properties.subheading : ""}
                    </h6>
                  </div>
                  <div
                  // className="scrollVisible"
                  >
                    {selectedQuestion.type === "scale" &&
                      selectedQuestion.properties.scale_type === "scale" ? (
                      <div className="scaleClass">

                        <ul
                          className="scale-image"
                          style={{
                            padding: 0,
                            position: "relative",
                            alignContent: "space-between",
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "20px",
                            marginLeft: "auto",
                            marginRight: "auto"
                          }}
                        >
                          <h6
                            style={{
                              opacity: "1",
                              fontSize: "12px",
                              letterSpacing: "0px",
                              top: "100%",
                              position: "absolute",
                              bottom: 0,
                              textAlign: "left"
                            }}
                          >
                            {selectedQuestion.properties.start_text}
                          </h6>

                          {this.state.updatedScaleOptions.map(
                            function (value, index) {
                              return (
                                <li
                                  className="image-style"
                                  style={{
                                    height: "35px",
                                    width: "100px",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    resizeMode: "stretch",
                                    display: "table",
                                    listStyle: "none",
                                    margin: "0px auto",
                                    alignItems: "stretch",
                                    alignContent: "space-between"
                                  }}
                                >
                                  {selectedQuestion.properties.icon_type === "image" ? (
                                    <Image

                                      key={index}
                                      src={value.image_id}
                                      onClick={() => this.onScaleClick(value)}
                                      style={
                                        selectedQuestion.properties.icon_type ===
                                          "image" && value.defaultValue === false
                                          ? styleMedia
                                          : null
                                      }
                                    />
                                  ) : null}

                                  {selectedQuestion.properties.icon_type === "emoji" ? (
                                    <Image
                                      key={index}
                                      src={value.image_id}
                                      onClick={() => this.onScaleClick(value)}
                                      style={
                                        selectedQuestion.properties.icon_type ===
                                          "emoji" && value.defaultValue === false
                                          ? styleMedia
                                          : null
                                      }
                                    />
                                  ) : null}
                                </li>
                              );
                            }.bind(this)
                          )}
                          <h6
                            style={{
                              opacity: "1",
                              right: 0,
                              fontSize: "12px",
                              letterSpacing: "0px",
                              top: "100%",
                              position: "absolute",
                              bottom: 0,
                              textAlign: "right"
                            }}
                          >
                            {" "}
                            {selectedQuestion.properties.end_text}
                          </h6>
                        </ul>
                      </div>
                    ) : (
                      ""
                    )}
                    {this.state.selectedQuestion.type === "scale" &&
                      this.state.selectedQuestion.properties.scale_type === "table" ? (
                      <div className="scaleTableClass">
                        <li
                          style={{
                            height: "35px",
                            width: "30px",
                            flexDirection: "row",
                            justifyContent: "center",
                            resizeMode: "stretch",
                            display: "table",
                            listStyle: "none",
                            margin: "0px auto",
                            alignItems: "stretch",
                            alignContent: "space-between"
                          }}
                        >
                          {selectedQuestion.properties.grid_type === "image" ? (
                            <Table
                              style={tableContainer}
                              borderStyle={{ borderColor: "#fff" }}
                              className="scaleTable"
                            >
                              <TableBody>
                                <TableRow>
                                  <TableCell />

                                  {this.state.selectedQuestion.properties
                                    .table_content &&
                                    this.state.selectedQuestion.properties.table_content
                                      .table_options
                                    ? this.state.selectedQuestion.properties.table_content.table_options.map(
                                      (options, index) => (
                                        <TableCell>{options.value}</TableCell>
                                      )
                                    )
                                    : ""}
                                </TableRow>

                                {this.state.tableData.map((rowData, index) => (
                                  <TableRow
                                    key={index}
                                    textStyle={tableRowText}
                                    style={tableRow}
                                  >
                                    {rowData.map((cellData, cellIndex) => (
                                      <TableCell
                                        style={
                                          cellIndex === 0
                                            ? tableCellFirstCol
                                            : tableCellCol
                                        }
                                        key={cellIndex}
                                      >
                                        {cellIndex !== 0 ? (
                                          cellData.image_id &&
                                            cellData.image_id !== "" ? (
                                            <Image
                                              style={{
                                                width: 20,
                                                height: 20,
                                                resizeMode: "contain",
                                                opacity: cellData.opacity
                                              }}
                                              src={cellData.image_id}
                                              onClick={e =>
                                                this.onScaleTableClickImage(
                                                  index,
                                                  cellIndex,
                                                  cellData
                                                )
                                              }
                                            />
                                          ) : (
                                            <Image
                                              style={{
                                                width: 25,
                                                height: 25,
                                                resizeMode: "contain",
                                                opacity: cellData.opacity
                                              }}
                                              src={defaultImage}
                                              onClick={e =>
                                                this.onScaleTableClickImage(
                                                  index,
                                                  cellIndex,
                                                  cellData
                                                )
                                              }
                                            />
                                          )
                                        ) : (
                                          cellData
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : null}

                          {selectedQuestion.properties.grid_type === "radio" ? (
                            <Table
                              style={tableContainer}
                              borderStyle={{ borderColor: "#fff" }}
                            >
                              <TableBody>
                                <TableRow>
                                  <TableCell />

                                  {this.state.selectedQuestion.properties
                                    .table_content &&
                                    this.state.selectedQuestion.properties.table_content
                                      .table_options
                                    ? this.state.selectedQuestion.properties.table_content.table_options.map(
                                      (options, index) => (
                                        <TableCell>{options.value}</TableCell>
                                      )
                                    )
                                    : ""}
                                </TableRow>

                                {this.state.tableDataRadio.map((rowData, index) => (
                                  <TableRow
                                    key={index}
                                    textStyle={tableRowText}
                                    style={tableRow}
                                  >
                                    {rowData.map((cellData, cellIndex) => (
                                      <TableCell
                                        key={cellIndex}
                                        style={
                                          cellIndex === 0
                                            ? tableCellFirstCol
                                            : tableCellCol
                                        }
                                      >
                                        {cellIndex !== 0 ? (
                                          <input
                                            name={rowData[0]}
                                            type="radio"
                                            defaultChecked={cellData.isChecked}
                                            onChange={event =>
                                              this.onScaleTableClickRadio(
                                                index,
                                                cellIndex,
                                                cellData
                                              )
                                            }
                                            style={{
                                              marginTop: 3,
                                              verticalAlign: "top"
                                            }}
                                          />
                                        ) : (
                                          cellData
                                        )}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : null}
                        </li>
                      </div>
                    ) : (
                      ""
                    )}

                    {selectedQuestion.type === "input" ? (
                      <div className="inputClass">
                        <TextField
                          id={"inputTypeQuestion"}
                          style={{
                            width: 400,
                            margin: 0,
                            padding: 10,
                            border: "1px solid rgba(0, 0, 0, 0.25)",
                            maxHeight: "500px",
                            //overflow: "auto",
                            fontStyle: "Roboto"
                          }}
                          autoFocus={true}
                          className="scrollVisible"
                          //inputStyle={styles.resize}
                          multiline={true}
                          value={this.state.updatedText}
                          InputProps={{ disableUnderline: true }}
                          onChange={event => {
                            this.setState({ updatedText: event.target.value });
                          }}
                        />
                        <h6
                          style={{
                            marginTop: "5px",
                            fontSize: "12px",
                            textAlign: "center",
                            opacity: "0.4",
                            color: "#000000",
                            fontWeight: "600",
                            fontStyle: "Roboto"
                          }}
                        >
                          {selectedQuestion.properties.sublabel ? selectedQuestion.properties.sublabel : ""}
                        </h6>
                      </div>
                    ) : (
                      ""
                    )}

                    {selectedQuestion.type === "choice" ? (
                      <div
                        className="choiceClass"
                      >
                        <div className="option option-checkbox">
                          <ul className="clear"
                            style={{
                              margin: 5,
                            }}
                          >
                            {this.state.updatedChoiceOptions.map(
                              function (value, index) {
                                return (
                                  <li
                                    style={{
                                      fontSize: "12px",
                                      position: "relative",
                                      textAlign: "left",
                                      display: "inline-block",
                                      marginBottom: 0
                                    }}
                                  >
                                    <div className="mainList"
                                      style={{
                                        borderLeft: "2px solid rgba(0,0,0,0.15)",
                                        borderRight: "2px solid rgba(0,0,0,0.15)",
                                        borderTop: (index === 0) ? "2px solid rgba(0,0,0,0.15)" : "0px solid rgba(0,0,0,0.15)",
                                        borderBottom: "2px solid rgba(0,0,0,0.15)",
                                        padding: 15,
                                      }}
                                    >


                                      {selectedQuestion.properties.multilevel === 0 &&
                                        selectedQuestion.properties.choice_type ===
                                        "single" ? (

                                        <input
                                          name="choice"
                                          type="radio"
                                          defaultChecked={value.defaultValue}
                                          onChange={(e) => this.onChoiceClick(value, e)}
                                          style={{
                                            //marginTop: 3,
                                            verticalAlign: "top",
                                            fontStyle: "Roboto"
                                          }}
                                        />
                                      ) : selectedQuestion.properties.multilevel === 0 &&
                                        selectedQuestion.properties.choice_type ===
                                        "multiple" ? (
                                        <input
                                          type="checkbox"
                                          defaultChecked={value.defaultValue}
                                          onChange={(e) => this.onChoiceClick(value, e)}
                                          style={{
                                            //marginTop: 3,
                                            verticalAlign: "top",
                                            fontStyle: "Roboto"
                                          }}
                                        />
                                      ) : (
                                        ""
                                      )}

                                      {value.label}{" "}
                                      {value.label_image &&
                                        value.label_image.length > 0 && (
                                          <img
                                            alt="label"
                                            src={value.label_image}
                                            style={{
                                              position: "absolute",
                                              right: 5
                                            }}
                                          />
                                        )}
                                      {selectedQuestion.properties.multilevel === 0 && value.id === "other" ?
                                        <TextField style={{
                                          display: "flex"
                                        }}
                                          multiline={true}
                                          disabled={!value.defaultValue}
                                          defaultValue={selectedAnswer.other_value ? selectedAnswer.other_value : ''}
                                          value={this.state.otheroptionvalue}
                                          onChange={(e) => this.setOtherValue(e)}
                                        /> : ('')
                                      }
                                    </div>

                                    <div
                                      style={{
                                        margin: 0,
                                        textAlign: "left",
                                        width: "100%",
                                      }}
                                    >
                                      {value.sublabel
                                        ? value.sublabel.map(
                                          function (subval, key) {
                                            return (
                                              <div
                                                style={{
                                                  position: "relative",
                                                  fontStyle: "Roboto",
                                                  borderLeft: "2px solid rgba(0,0,0,0.15)",
                                                  borderRight: "2px solid rgba(0,0,0,0.15)",
                                                  borderBottom: "2px solid rgba(0,0,0,0.15)",
                                                  padding: 15
                                                }}
                                              >
                                                {selectedQuestion.properties
                                                  .choice_type === "single" ? (
                                                  <input
                                                    name="choice"
                                                    type="radio"
                                                    defaultChecked={
                                                      subval.defaultValue
                                                    }
                                                    onChange={(e) =>
                                                      this.onSubChoiceClick(
                                                        value,
                                                        subval,
                                                        e
                                                      )
                                                    }
                                                  />
                                                ) : (
                                                  <input
                                                    type="checkbox"
                                                    defaultChecked={
                                                      subval.defaultValue
                                                    }
                                                    onChange={(e) =>
                                                      this.onSubChoiceClick(
                                                        value,
                                                        subval,
                                                        e
                                                      )
                                                    }
                                                  />
                                                )}
                                                {subval.label_image &&
                                                  subval.label_image.length > 0 && (
                                                    <img
                                                      alt="label"
                                                      src={subval.label_image}
                                                      style={{
                                                        position: "absolute",
                                                        right: 5
                                                      }}
                                                    />
                                                  )}{" "}
                                                {subval.sublabel}
                                                {selectedQuestion.properties.multilevel === 1 && subval.id === "other" &&
                                                  <TextField style={{
                                                    display: "flex"
                                                  }}
                                                    multiline={true}
                                                    disabled={selectedQuestion.properties
                                                      .choice_type === "multiple" ?
                                                      !subval.defaultValue : !otheroptiontextbox}
                                                    defaultValue={selectedAnswer.other_value ? selectedAnswer.other_value : ''}
                                                    value={this.state.otheroptionvalue}
                                                    onChange={(e) => this.setOtherValue(e)}
                                                  />
                                                }
                                              </div>
                                            );
                                          }.bind(this)
                                        )
                                        : ""}
                                    </div>
                                  </li>
                                );
                              }.bind(this)
                            )}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {selectedQuestion.type === "upload" ? (
                      <div className="uploadClass" style={{ marginLeft: "auto", marginRight: "auto" }}>
                        <div className="new-img-prev-up">
                          <StyledDropZone
                            accept={selectedQuestion.properties.media_type === "image" ? "image/png, image/gif, image/jpeg, image/*" :
                              selectedQuestion.properties.media_type === "video" ? "video/mp4,video/x-m4v,video/*" :
                                selectedQuestion.properties.media_type === "audio" ? "audio/mpeg3,audio/mp3,audio/*" : ""}
                            onDrop={this.onDrop.bind(this)}
                            children="upload" />
                        </div>
                        <div className="new-div-parts" >
                          {selectedQuestion.properties.media_type === "image" && this.state.Upload.media ? (
                            <img src={this.state.Upload.media} alt="media" />
                          ) : selectedQuestion.properties.media_type === "video" && this.state.Upload.media ? (
                            <video width="320" height="240" controls id='thevid' src={this.state.Upload.media} />
                          ) : selectedQuestion.properties.media_type === "audio" && this.state.Upload.media ? (
                            <audio width="320" height="240" controls id='theaid' src={this.state.Upload.media} />
                          ) : (
                            ""
                          )}

                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {selectedQuestion.type === "gps" ? (
                      <div className="gpsClass">
                        <MapContainer />
                      </div>
                    ) : (

                      ""
                    )}


                    {selectedQuestion.type === "info" ? (
                      <div className="infoClass">

                        {React.createElement("div", {
                          dangerouslySetInnerHTML: {
                            __html: selectedQuestion.properties.info_text
                          }
                        })}

                        {selectedQuestion.properties.text_position === "top" ? (
                          <p
                            className={
                              "font" +
                              selectedQuestion.properties.font_style +
                              " text" +
                              selectedQuestion.properties.text_align
                            }
                          >
                            {selectedQuestion.properties.info_text}
                          </p>
                        ) : (
                          ""
                        )}
                        <div className="new-div-info">
                          {selectedQuestion.properties.info_type === "image" ? (
                            <img
                              src={selectedQuestion.properties.info_image}
                              alt="placeholder"
                            />
                          ) : selectedQuestion.properties.info_type === "audio" ? (
                            <audio controls>
                              <source
                                src={selectedQuestion.properties.info_audio}
                                type="audio/mp3"
                              />
                              Your browser does not support the audio element.
                            </audio>
                          ) : selectedQuestion.properties.info_type === "video" ? (
                            <video width="320" height="240" controls>
                              <source
                                src={selectedQuestion.properties.info_video}
                                type="video/mp4"
                              />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            ""
                          )}
                        </div>
                        {selectedQuestion.properties.text_position === "bottom" ? (
                          <p
                            className={
                              "font" +
                              selectedQuestion.properties.font_style +
                              " text" +
                              selectedQuestion.properties.text_align
                            }
                          >
                            {selectedQuestion.properties.info_text}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  {index === 0 && idExists === true && this.state.enableTermsCond === false &&

                    <div className="agreeColorInput" style={{ textAlign: "center", marginTop: "5px" }}>
                      <input
                        type="checkbox"
                        defaultChecked={!this.state.agree}
                        onChange={(e) =>
                          e.target.checked === true ? this.setState({ agree: false }) : this.setState({ agree: true })
                        }
                      />
                      <span style={{ paddingLeft: "5px" }}>I agree to the <a style={{ fontSize: "14px" }} rel="noopener noreferrer" href="http://www.eolasinternationalportal.com/EolasAppTandCs.htm" target="_blank" >Terms of Service and Privacy Policy</a></span>
                    </div>
                  }
                </div>
                {/*		
                   
              <div style={{ textAlign: "center" }}>
                {index > 0 && (
                  <Button
                    style={{
                      marginTop: "10px",
                      marginRight: "15px",
                    }}
                    onClick={e => this.handleBack(e)}
                    variant="contained"
                    color="primary"
                  >
                    Back
                  </Button>
                )}
                  <Button
                    variant="contained"
                    color="primary"
                    disabled = {this.state.show === true || this.state.agree === true}
                    onClick={
                      this.state.nextExists === false
                        ? this.handleSubmit
                        : this.handleNext
                    }
                     style={{
                    marginTop: "10px"
                  }}
                  >
                    {this.state.nextExists === false ? "Submit" : "Next"}
                  </Button>
   
              </div>*/ }
                <div style={{ textAlign: "center", minHeight: '10%', width: '100%' }}>

                  {index > 0 && (
                    <Button
                      style={{
                        marginTop: "10px",
                        marginRight: "15px",
                        marginBottom: "50px"
                      }}
                      onClick={e => this.handleBack(e)}
                      variant="contained"
                      color="primary"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={this.state.show === true || this.state.agree === true}
                    onClick={
                      this.state.nextExists === false
                        ? this.handleSubmit
                        : this.handleNext
                    }
                    style={{
                      marginTop: "10px",
                      marginBottom: "50px"
                    }}
                  >
                    {this.state.nextExists === false ? "Submit" : "Next"}
                  </Button>

                </div>
              </div>
            ) : (
              ""
            )}
          </Card>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(WebLink);