/**
 * 
 * Modalpopup component.
 * 
 * This component is used to render the selected question and its answer in the modal popup
 *  when user clicks the cell in the mission response table.
 *
 *
 */

import React, { Component } from "react";
import Image from "material-ui-image";
import TextField from "@material-ui/core/TextField";
import './ModalPopUp.css';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Datetime from 'react-datetime';
import moment from "moment";

const styleMedia = {
  opacity: "0.5",
  objectFit: "contain"
};
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
    borderBottomWidth: 2,
    borderRightWidth: 2
  },
  tableCellCol: {
    flex: 1,
    width: 100,
    alignItems: "center",
    borderBottomWidth: 2,
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

const settingsSlider = {
  dots: false,
  arrows: true,
  infinite: false,
  speed: 500,
  swipe: true,
  slidesToShow: 1,
  slidesToScroll: 1
};

//let updatedAnswer = [];
class ModalPopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedQuestion: this.props.selectedQuestion,
      selectedAnswer: this.props.selectedAnswer,
      updatedScaleOptions: [],
      updatedText: "",
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
      updatedOptions: [],
      otheroptionvalue: "",
      otheroptiontextbox: false,
      maxdifftableHead: ["Least", "", "Most"],
      maxdifftableRow: [],
      currentSliderPage: 0,
      selectedmaxdiffOptions: []
    };
  }

  componentDidMount() {
    this.setInitialState();
  }

  // componentDidUpdate() {
  //   this.setInitialState();
  // }

  componentWillUnmount() {
    this.setState({
      updatedScaleOptions: [],
      updatedText: "",
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
      updatedOptions: [],
      maxdifftableRow: [],
      currentSliderPage: 0,
      selectedmaxdiffOptions: []
    });
  }

  /* Used to get the updated text. */
  getUpdatedText() {
    return this.state.updatedText;
  }

  /* Used to get the selectedScaleOptions. */
  getSelectedScaleOptions() {
    return this.state.selectedScaleOptions;
  }

  /* Used to get the selectedChoiceOptions. */
  getSelectedChoiceOptions() {
    return this.state.selectedChoiceOptions;
  }

  /* Used to get the otheroptionvalue. */
  getOtherOptionValue() {
    return this.state.otheroptionvalue;
  }

  /* Used to get the selectedTableOptions. */
  getSelectedTableOptions() {
    return this.state.selectedTableOptions;
  }

  getSelectedMaxdiffOption() {
    return this.state.selectedmaxdiffOptions
  }

  /* Handles the validation of question type and update the answer based on question type. */
  setInitialState() {
    if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type && this.state.selectedQuestion.properties.scale_type === 'scale') {
      this.setSelectedScaleOptions();
    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type && this.state.selectedQuestion.properties.scale_type === 'table'
      && this.state.selectedQuestion.properties.grid_type === "image") {
      this.setSelectedScaleTableImageOptions();
    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type && this.state.selectedQuestion.properties.scale_type === 'table'
      && this.state.selectedQuestion.properties.grid_type === "radio") {
      this.setSelectedScaleTableRadioOptions();
    } else if (
      this.state.selectedQuestion.type === "scale" &&
      this.state.selectedQuestion.properties.scale_type &&
      this.state.selectedQuestion.properties.scale_type === "maxdiff"
    ) {
      this.setSelectedScalemaxdiffTable();
    }
    else if (this.state.selectedQuestion.type === "input" || this.state.selectedQuestion.type === "m") {
      if (this.state.selectedAnswer && this.state.selectedAnswer.text) {
        this.setState({ updatedText: this.state.selectedAnswer.text });
      }
    }
    else if (this.state.selectedQuestion.type === "choice") {
      this.setSelectedChoiceOptions();
    }
  }

  onDeleteModelPopupValue() {
    if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type && this.state.selectedQuestion.properties.scale_type === 'scale') {
      this.setState({ updatedScaleOptions: [], selectedScaleOptions: [] })
    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type && this.state.selectedQuestion.properties.scale_type === 'table'
      && this.state.selectedQuestion.properties.grid_type === "image") {
      this.setState({ selectedTableOptions: [] })
    }
    else if (this.state.selectedQuestion.type === "scale" && this.state.selectedQuestion.properties.scale_type && this.state.selectedQuestion.properties.scale_type === 'table'
      && this.state.selectedQuestion.properties.grid_type === "radio") {
      this.setState({ selectedTableOptions: [] })
    } else if (
      this.state.selectedQuestion.type === "scale" &&
      this.state.selectedQuestion.properties.scale_type &&
      this.state.selectedQuestion.properties.scale_type === "maxdiff"
    ) {
      this.setState({ selectedmaxdiffOptions: [] })
    }
    else if (this.state.selectedQuestion.type === "input") {
      this.setState({ updatedText: "" })
    }
    else if (this.state.selectedQuestion.type === "choice") {
      this.setState({ selectedChoiceOptions: [], updatedChoiceOptions: [], otheroptionvalue: "" })
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
      updatedScaleOptions: updatedScaleOptions
    });
  }

  /* Used to format the question data for choice question and update the options respectively. */
  setSelectedChoiceOptions = () => {

    let updatedChoiceOptions = [];
    let selectedChoiceOptions = [];
    let otheroptiontextbox = false;

    // let defaultSelection = false;
    if (this.state.selectedQuestion.properties.multilevel === 0) {
      this.state.selectedQuestion.properties.options.forEach(question => {
        let defaultSelection = false;
        if (this.state.selectedQuestion.properties.choice_type === "multiple" && this.state.selectedAnswer && this.state.selectedAnswer.selected_option) {
          this.state.selectedAnswer.selected_option.forEach(answer => {
            if (answer.id === question.id) {
              if (question.id === 'other') {
                otheroptiontextbox = true;
              }
              defaultSelection = true;
              selectedChoiceOptions.push({
                id: question.id,
                label: question.label
              })
            }

          })
        }
        else {
          if (this.state.selectedAnswer && this.state.selectedAnswer.id === question.id) {
            if (question.id === 'other') {
              otheroptiontextbox = true;
            }
            defaultSelection = true;
            selectedChoiceOptions.push({
              id: question.id,
              label: question.label
            })
          }
        }
        updatedChoiceOptions.push({
          id: question.id,
          label: question.label,
          label_image: question.label_image,
          defaultValue: defaultSelection
        })
        defaultSelection = false;
      })
    }

    else if (this.state.selectedQuestion.properties.multilevel === 1) {
      let subLabelItem = [];
      this.state.selectedQuestion.properties.options.forEach(question => {
        question.sublabel.forEach(questionsublabel => {
          let matched = false;
          if (this.state.selectedAnswer && this.state.selectedAnswer.selected_option) {
            this.state.selectedAnswer.selected_option.forEach(answer => {
              if (question.id === answer.id && (questionsublabel.id === answer.sublabel_id || questionsublabel.id === answer.sub_id)) {
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

                })
                subLabelItem.push({
                  id: questionsublabel.id,
                  label_image: questionsublabel.label_image,
                  sublabel: questionsublabel.sublabel,
                  defaultValue: true
                })
                matched = true;
              }
            })
          }
          if (matched === false) {

            subLabelItem.push({
              id: questionsublabel.id,
              label_image: questionsublabel.label_image,
              sublabel: questionsublabel.sublabel,
              defaultValue: false
            })

          }

        })

        updatedChoiceOptions.push({
          id: question.id,
          label: question.label,
          label_image: question.label_image,
          sublabel: subLabelItem,

        })
        subLabelItem = [];

      })
    }
    let otheroptionvalue = ''
    if (this.state.selectedAnswer.other_value) {
      otheroptionvalue = this.state.selectedAnswer.other_value;
    }
    this.setState({
      updatedChoiceOptions: updatedChoiceOptions,
      selectedChoiceOptions: selectedChoiceOptions,
      otheroptionvalue: otheroptionvalue,
      otheroptiontextbox: otheroptiontextbox
    })
  }

  /* Handles the event to validate the choice type and renders the choice options in the modal popup. */
  onChoiceClick(value, e) {
    let selectedChoiceOptions = this.state.selectedChoiceOptions;
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
        })
      }
      else {
        for (var i = 0; i < selectedChoiceOptions.length; i++) {
          if (selectedChoiceOptions[i].id === value.id) {
            selectedChoiceOptions.splice(i, 1);
            break;
          }
        }
      }

    }
    else {
      selectedChoiceOptions = [];
      selectedChoiceOptions.push({
        id: value.id,
        label: value.label,
        label_image: value.label_image
      })

    }

    this.setState({
      selectedChoiceOptions: selectedChoiceOptions,
      otheroptiontextbox: otheroptiontextbox
    })

  }

  /* Handles the event to validate the sub choice type and renders the options based on sub choice type in the modal popup. */
  onSubChoiceClick(parent, subvalue, e) {
    let otheroptiontextbox = false;
    if (subvalue.id === 'other' && e.target.checked === true) {
      otheroptiontextbox = true;
    }
    let selectedChoiceOptions = this.state.selectedChoiceOptions
    if (this.state.selectedQuestion.properties.choice_type === "multiple") {
      if (subvalue.defaultValue === false) {
        selectedChoiceOptions.push({
          id: parent.id,
          label: parent.label,
          sublabel: subvalue.sublabel,
          sublabel_id: subvalue.id,
          label_image: parent.label_image,
          sub_label_image: subvalue.label_image

        })
      }
      else {
        for (var i = 0; i < selectedChoiceOptions.length; i++) {
          if (selectedChoiceOptions[i].id === parent.id && selectedChoiceOptions[i].sublabel_id === subvalue.id) {
            selectedChoiceOptions.splice(i, 1);
            break;
          }
        }
      }

    }
    else {
      selectedChoiceOptions = [];
      selectedChoiceOptions.push({
        id: parent.id,
        label: parent.label,
        sub_id: subvalue.id,
        sublabel: subvalue.sublabel,
        label_image: parent.label_image,
        sub_label_image: subvalue.label_image

      })
    }

    this.setState({
      selectedChoiceOptions: selectedChoiceOptions,
      otheroptiontextbox: otheroptiontextbox
    })
  }

  /* Handles the event to update the value */
  onTextClick(e, other) {
    this.setState({ updatedText: e.target.value });
    if (other) {
      this.setState({ otheroptionvalue: e.target.value });
    }
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
    })

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

    if (selectedAnswer.selected_option) {
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
    if (selectedAnswer.selected_option) {
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
              if (answerRadio[k].image.id === table_value[i].image[j].id) {
                tempObj.isChecked = true;
              }
              else {
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
  setSelectedScalemaxdiffTable() {
    let question = this.state.selectedQuestion.properties
    let attributesSet = this.state.selectedAnswer.attribute_Set

    let selectedAnswer = this.state.selectedAnswer;
    let selectedmaxdiffOptions = [];

    let answermaxdiff = [];
    if (selectedAnswer && selectedAnswer.selected_option) {
      answermaxdiff = selectedAnswer.selected_option;
      for (let m = 0; m < answermaxdiff.length; m++) {
        let obj = answermaxdiff[m];
        selectedmaxdiffOptions.push(obj);
      }
    }

    let tableDatamaxd = [];
    tableDatamaxd = attributesSet && attributesSet.map((item, index) => {
      return item && item.map((obj, index) => {
        let ansObj = selectedmaxdiffOptions.find(aObj => (aObj.id == obj.id && aObj.attributeSetID == obj.attributeSetID));
        let arrTemp = []
        if (ansObj) {
          arrTemp[0] = { ...obj, isLeastCheck: true, isChecked: ansObj.isLeastCheck == true ? true : false, name: 'Left' }
          arrTemp[1] = obj.label
          arrTemp[2] = { ...obj, isLeastCheck: false, isChecked: ansObj.isLeastCheck == false ? true : false, name: 'Right' }
        }
        else {
          arrTemp[0] = { ...obj, isChecked: false, isLeastCheck: true, name: 'Left' }
          arrTemp[1] = obj.label
          arrTemp[2] = { ...obj, isChecked: false, isLeastCheck: false, name: 'Right' }
        }
        return arrTemp
      })
    })


    this.setState({
      maxdifftableRow: tableDatamaxd,
      selectedmaxdiffOptions: selectedmaxdiffOptions
    });

  }
  onMaxdiffTableScaleClick = (cellDataobj) => {
    let selectedmaxdiffOptions = this.state.selectedmaxdiffOptions;

    if (selectedmaxdiffOptions.length > 0) {
      if (selectedmaxdiffOptions.some(e => e.attributeSetID == cellDataobj.attributeSetID && e.id == cellDataobj.id)) {
        // already added item for same row lest/most item
      }
      else {
        let isMatch = false
        selectedmaxdiffOptions.map((Ansobj, index) => {
          if (Ansobj.attributeSetID == cellDataobj.attributeSetID && Ansobj.isLeastCheck == cellDataobj.isLeastCheck) {
            selectedmaxdiffOptions.splice(index, 1);
            selectedmaxdiffOptions.push(cellDataobj);
            isMatch = true
          }
        })
        if (isMatch == false) {
          selectedmaxdiffOptions.push(cellDataobj);
        }
      }
    }
    else {
      this.state.selectedmaxdiffOptions.push(cellDataobj);
    }
    this.setState({ selectedmaxdiffOptions })
  }
  afterChangeHandler = (currentSlide) => {
    this.setState({
      currentSliderPage: currentSlide
    })
  }
  render() {

    const { selectedQuestion } = this.state;
    let increasingIndex = 0;
    const { updatedScaleOptions, updatedChoiceOptions, otheroptiontextbox } = this.state;
    const {
      tableContainer,
      tableRow,
      tableRowText,
      tableCellCol,
      tableCellFirstCol
    } = styles;

    return (
      <div>
        <div>
          <h4 align="center"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              // textTransform: "capitalize"
            }}
          >{selectedQuestion.type === "m" ? selectedQuestion.headerName : selectedQuestion.question}</h4>
          {this.state.selectedQuestion.type === "scale" &&
            this.state.selectedQuestion.properties.scale_type === "scale" ? (
            <ul
              style={{
                padding: 0,
                position: "relative",
                alignContent: "space-between",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px"
              }}>
              <h6
                style={{
                  opacity: "1",
                  fontSize: "12px",
                  letterSpacing: "0px",
                  top: "100%",
                  position: "absolute",
                  bottom: 0,
                  textAlign: "left",
                  width: "50px"
                }}
              >{selectedQuestion.properties.start_text}</h6>

              {updatedScaleOptions.map(
                function (value, index) {
                  return (
                    <li
                      key={index}
                      style={{
                        height: "35px",
                        width: "30px",
                        flexDirection: "row",
                        justifyContent: "center",
                        resizeMode: "stretch",
                        display: "table",
                        listStyle: "none",
                        float: "left",
                        margin: "0px 5px",
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
                            selectedQuestion.properties.icon_type === "image" &&
                              value.defaultValue === false
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
                            selectedQuestion.properties.icon_type === "emoji" &&
                              value.defaultValue === false
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
                  textAlign: "right",
                  width: "50px"
                }}
              > {selectedQuestion.properties.end_text}</h6>
            </ul>
          ) : (
            ""
          )}
          {this.state.selectedQuestion.type === "scale" &&
            this.state.selectedQuestion.properties.scale_type === "table" ? (
            <li
              style={{
                height: "35px",
                width: "30px",
                flexDirection: "row",
                justifyContent: "center",
                resizeMode: "stretch",
                display: "table",
                listStyle: "none",
                float: "left",
                margin: "0px 5px",
                alignItems: "stretch",
                alignContent: "space-between"
              }}
            >
              {selectedQuestion.properties.grid_type === "image" ? (
                <Table
                  style={tableContainer}
                  borderstyle={{ borderColor: "#fff" }}
                >
                  <TableBody>
                    <TableRow>
                      <TableCell />

                      {this.state.selectedQuestion.properties.table_content &&
                        this.state.selectedQuestion.properties.table_content
                          .table_options
                        ? this.state.selectedQuestion.properties.table_content.table_options.map(
                          (options, index) => (
                            <TableCell key={index}>{options.value}</TableCell>
                          )
                        )
                        : ""}
                    </TableRow>

                    {this.state.tableData.map((rowData, index) => (
                      <TableRow
                        key={index}
                        textstyle={tableRowText}
                        style={tableRow}
                      >
                        {rowData.map((cellData, cellIndex) => (
                          <TableCell
                            style={
                              cellIndex === 0 ? tableCellFirstCol : tableCellCol
                            }
                            key={cellIndex}
                          >
                            {cellIndex !== 0 ? (
                              cellData.image_id && cellData.image_id !== "" ? (
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
                                />) : ""

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
                  borderstyle={{ borderColor: "#fff" }}
                >
                  <TableBody>
                    <TableRow>
                      <TableCell />

                      {this.state.selectedQuestion.properties.table_content &&
                        this.state.selectedQuestion.properties.table_content
                          .table_options
                        ? this.state.selectedQuestion.properties.table_content.table_options.map(
                          (options, index) => (
                            <TableCell key={index}>{options.value}</TableCell>
                          )
                        )
                        : ""}
                    </TableRow>

                    {this.state.tableDataRadio.map((rowData, index) => (
                      <TableRow
                        key={index}
                        textstyle={tableRowText}
                        style={tableRow}
                      >
                        {rowData.map((cellData, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            style={
                              cellIndex === 0 ? tableCellFirstCol : tableCellCol
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
          ) : (
            ""
          )}

          {this.state.selectedQuestion.type === "scale" &&
            this.state.selectedQuestion.properties.scale_type === "maxdiff" ? (
            <div className="scaleTableClass maxDiffCss maxDiffModal">

              {(this.state.maxdifftableRow && this.state.maxdifftableRow.length > 0) ? <div className="slider-arrow">
                <h6>{(this.state.currentSliderPage + 1) + " Of " + this.state.maxdifftableRow.length}</h6>
              </div> : ""}

              <Slider ref={c => (this.slider = c)} {...settingsSlider} afterChange={this.afterChangeHandler}>
                {this.state.maxdifftableRow && this.state.maxdifftableRow.map((rowData, index) => (
                  <Table
                    key={index}
                    style={tableContainer}
                    borderstyle={{ borderColor: "#fff" }}
                  >
                    <TableBody>
                      <TableRow>
                        {this.state.maxdifftableHead && this.state.maxdifftableHead.map(
                          (options, index) => (
                            <TableCell className="max-diff-table-header" key={index}>{options}</TableCell>
                          )
                        )}
                      </TableRow>
                      {rowData && rowData.map((cellData, rowIndex) => (
                        <TableRow
                          key={rowIndex}
                          textstyle={tableRowText}
                          style={{ height: 50, width: 50, alignItems: 'center' }}
                        >
                          {cellData && cellData.map((cellDataobj, cellIndex) => (
                            <TableCell
                              key={cellIndex}
                              style={{ height: 50, width: 50, alignItems: 'center' }}
                            >
                              {cellIndex !== 1 ? (
                                <input
                                  className={(this.state.selectedmaxdiffOptions && this.state.selectedmaxdiffOptions.some(e => e.attributeSetID == cellDataobj.attributeSetID && e.id == cellDataobj.id)) ? "pointer-eventsNone" : null}
                                  name={(cellDataobj.name + cellDataobj.attributeSetID)}
                                  type="radio"
                                  defaultChecked={cellDataobj.isChecked}
                                  //disabled={this.state.selectedmaxdiffOptions && this.state.selectedmaxdiffOptions.some(e => e.attributeSetID == cellDataobj.attributeSetID && e.id == cellDataobj.id)}
                                  onChange={event =>
                                    this.onMaxdiffTableScaleClick(
                                      cellDataobj
                                    )
                                  }
                                />
                              ) : (
                                cellDataobj
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ))}
              </Slider>
            </div>
          ) : (
            ""
          )}

          {this.state.selectedQuestion.type === "input" ? (
            <>
              {this.state.selectedQuestion.properties.hasOwnProperty('datePickerOn') && this.state.selectedQuestion.properties.datePickerOn == 1 ?
                <Datetime
                  inputProps={{ readOnly: true }}
                  name="inputDate"
                  dateFormat="DD/MM/YYYY"
                  value={this.state.updatedText}
                  selected={this.state.updatedText}
                  timeFormat={false}
                  onChange={e => {
                    const newDate = moment(e).format('DD-MM-YYYY');
                    this.setState({ updatedText: newDate ? newDate : "" });
                  }}
                  closeOnSelect
                /> :
                <TextField style={{
                  display: "flex"
                }}
                  //inputStyle={styles.resize}
                  multiline={true}
                  value={this.state.updatedText}
                  onChange={value => this.onTextClick(value)}
                />}
            </>
          ) : (
            ""
          )}

          {this.state.selectedQuestion.type === "m" ? (
            <TextField style={{
              display: "flex"
            }}
              //inputStyle={styles.resize}
              multiline={true}
              value={this.state.updatedText}
              onChange={value => this.onTextClick(value)}
            />
          ) : (
            ""
          )}

          {this.state.selectedQuestion.type === "choice" ? (
            <div className="field"
              style={{
                maxHeight: "500px",
                overflow: "auto"

              }}>
              <div className="option option-checkbox">

                <ul className="clear">
                  {updatedChoiceOptions.map(
                    function (value, index) {
                      return (
                        <li
                          key={index}
                          style={{
                            fontSize: "12px",
                            position: "relative",
                            textAlign: "left",
                            display: "inline-block"
                          }}
                        >

                          {selectedQuestion.properties.multilevel === 0 && selectedQuestion.properties.choice_type === "single" ?
                            <input name="choice" id={index} type="radio" defaultChecked={value.defaultValue} onChange={(e) => this.onChoiceClick(value, e)}
                              style={{
                                marginTop: 3,
                                verticalAlign: "top"
                              }}
                            /> :
                            selectedQuestion.properties.multilevel === 0 && selectedQuestion.properties.choice_type === "multiple" ?
                              <input type="checkbox" id={index} defaultChecked={value.defaultValue} onChange={(e) => this.onChoiceClick(value, e)}
                                style={{
                                  marginTop: 3,
                                  verticalAlign: "top"
                                }}
                              />
                              : ""
                          }
                          <label htmlFor={index}>{value.label}</label>
                          {value.label_image && value.label_image.length > 0 &&
                            <img src={value.label_image}
                              alt="label"
                              style={{
                                position: "absolute",
                                right: 0
                              }}
                            />}
                          {selectedQuestion.properties.multilevel === 0 && value.id === "other" &&
                            <TextField style={{
                              display: "flex"
                            }}
                              multiline={true}
                              disabled={!otheroptiontextbox}
                              value={this.state.otheroptionvalue}
                              onChange={value => this.onTextClick(value, true)}
                            />
                          }
                          <div className="parent-of-child-class clear"
                            style={{
                              marginTop: 12,
                              textAlign: "left",
                              border: "none"
                            }}
                          >
                            {value.sublabel
                              ? value.sublabel.map(
                                function (subval, key) {
                                  increasingIndex = increasingIndex + 1
                                  return (
                                    <div
                                      style={{
                                        position: "relative"
                                      }}
                                    >
                                      {selectedQuestion.properties.choice_type === "single" ? <input name="choice" id={increasingIndex} type="radio" defaultChecked={subval.defaultValue} onChange={(e) => this.onSubChoiceClick(value, subval, e)} /> : <input type="checkbox" id={increasingIndex} defaultChecked={subval.defaultValue} onChange={(e) => this.onSubChoiceClick(value, subval, e)} />}
                                      {subval.label_image && subval.label_image.length > 0 &&
                                        <img src={subval.label_image}
                                          alt="label"
                                          style={{
                                            position: "absolute",
                                            right: 0
                                          }}
                                        />}
                                      <label htmlFor={increasingIndex}>{subval.sublabel}</label>
                                      {selectedQuestion.properties.multilevel === 1 && subval.id === "other" &&
                                        <TextField style={{
                                          display: "flex"
                                        }}
                                          multiline={true}
                                          disabled={!otheroptiontextbox}
                                          value={this.state.otheroptionvalue}
                                          onChange={value => this.onTextClick(value, true)}
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
          )
            : ("")
          }



        </div>
      </div>
    );
  }
}

export default ModalPopUp;
