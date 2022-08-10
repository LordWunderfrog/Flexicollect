/**
 * 
 * Image editor component.
 * 
 * This component is used to manage the view and download of an image.
 * 
 */
import React from "react";
import "./Imageeditor.css";



// Install Fabric Js npm install --no-save --no-optional fabric@~1.6.7

// image-editor  //https://nhn.github.io/tui.image-editor/latest/
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'

// svg Icon
const icona = require('tui-image-editor/dist/svg/icon-a.svg')
const iconb = require('tui-image-editor/dist/svg/icon-b.svg')
const iconc = require('tui-image-editor/dist/svg/icon-c.svg')
const icond = require('tui-image-editor/dist/svg/icon-d.svg')
// https://github.com/nhn/toast-ui.vue-image-editor/issues/5

var blackTheme = {
  // main icons
  'menu.normalIcon.path': icond,
  'menu.activeIcon.path': iconb,
  'menu.disabledIcon.path': icona,
  'menu.hoverIcon.path': iconc,
}

export default class PhotoEditor extends React.Component {
  editorRef = React.createRef();
  constructor(props, context) {
    super(props, context);
    this.state = {
      maxwidth: 625,
      maxheight: 600,
      imageData: null,
      open: false,
      imageRow: null,
      dataUrl: null,
      imageColumn: null,
      questions: [],
      filteredMissions: [],
      FilterRowData: [],
      menu: []

    }
  }

  componentDidMount() {
    this.setState({
      questions: this.props.questions,
      filteredMissions: this.props.filteredMissions,
      FilterRowData: this.props.FilterRowData,
      colDef: this.props.colDef
    }, () => { this.CurrentImage() })
  }

  /* 
   * This function gets invoked when tui editor component gets mounted.  
   * On cell click it fetches the column index,row index and selected answer.
   * Validates the question type of selected question and check whether original image or edited image exists in the question.
   * Selected answer contains question id.Matches the question id with mission data with some conditions.
   * While matching it validates the whether the question contains loop number,loop set number if it not exists it validate the mission data with questionid alone.  * 
   * Check whether image or media property exists in the question.If it exists it will fetch the url of the edited or original image.
   * Then it forms the data by using column index, row index,answer,question title,survey tag id and if its loop question include the loop question number as well.
   * Image url exists in answer object which is used to render the image in the tui editor.
   * */
  CurrentImage() {
    let Column = []
    let selectedAnswer = this.props.selectedAnswer;
    let column_index = selectedAnswer.column_index;
    let selected_index = 0;
    let disable = false;
    this.state.FilterRowData.forEach((x, y) => {
      if (x.column_index === column_index) {
        selected_index = y
      }
    })
    if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "upload" || selectedAnswer.queType === "capture") {
      if (selectedAnswer.field.includes('B_oimage') || selectedAnswer.field.includes('U_oimage') || selectedAnswer.field.includes('C_oimage')) { disable = true; }
    }
    this.state.filteredMissions[selectedAnswer.column_index].responses.forEach((r, index) => {
      if ((selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) ?
        selectedAnswer.loop_triggered_qid === r.loop_triggered_qid && selectedAnswer.loop_set === r.loop_set &&
        selectedAnswer.loop_number === r.loop_number && r.question_id === selectedAnswer.question_id
        :
        (!r.loop_triggered_qid && r.question_id === this.props.selectedAnswer.question_id)
      ) {
        if (r.answers.image || r.answers.media) {
          if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "capture") {
            Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.image : r.answers.image
          }
          else if (selectedAnswer.queType === "upload") {
            Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.media : r.answers.media
          }
          Column.title = selectedAnswer.headerName
          Column.question_id = selectedAnswer.question_id
          Column.survey_tag_id = selectedAnswer.survey_tag_id
          Column.answers = r.answers
          Column.type = r.type
          Column.index = selectedAnswer.column_index
          Column.rowindex = selectedAnswer.row_index
          Column.selected_index = selected_index
          Column.customer_id = this.state.filteredMissions[selectedAnswer.column_index].customer_id
          if (selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) {
            Column.loop_set = selectedAnswer.loop_set;
            Column.loop_number = selectedAnswer.loop_number;
            Column.loop_triggered_qid = selectedAnswer.loop_triggered_qid;
          }

        }
      }
    })


    this.setState({
      imageData: Column,
      open: true
    })

  }


  /* When user clicks the down arrow in the tui editor this function gets invoked.
   * It will increase the row index by 1 and it validates the index with the row length.If index is lesser or equal to row length it will navigate to next cell else it will quit the function.
   * By using the column index fetches row index and selcted answer.
   * Validates the question type of selected question is barcode or upload or capture and check whether original image or edited image exists in the question.
   * Selected answer contains question id.Matches the question id with mission data with some conditions.
   * While matching it validates the whether the question contains loop number,loop set number if it not exists it validate the mission data with questionid alone.  * 
   * Check whether image or media property exists in the question.If it exists it will fetch the url of the edited or original image.
   * Then it forms the data by using column index, row index,answer,question title,survey tag id and if its loop question include the loop question number as well.
   * If image url exists in answer object, which is used to render the image in the tui editor using instance method.If the url not exists it will increase index by one and it calls the same function.
    *
    * While validating the question type is not barcode or upload or capture it will increase index by one and it calls the same function.
    * 
    * */
  DownClick = (a, b) => {
    let imageList = this.state.imageData
    let colDef = this.state.colDef
    let selected_index = imageList.selected_index
    var z = a === "loop" ? b : selected_index + 1
    let disable = false
    if (this.state.FilterRowData.length > z) {
      let i = this.state.FilterRowData[z].column_index
      let match = false;
      let Column = []
      let filteredMissions = this.state.filteredMissions;

      if (filteredMissions.length > i) {
        let a = colDef[imageList.rowindex];
        let selectedAnswer = a
        if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "upload" || selectedAnswer.queType === "capture") {
          if (selectedAnswer.field.includes('B_oimage') || selectedAnswer.field.includes('U_oimage') || selectedAnswer.field.includes('C_oimage')) { disable = true; }
        }
        this.state.filteredMissions[i].responses.forEach((r, index) => {
          if ((selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) ?
            selectedAnswer.loop_triggered_qid === r.loop_triggered_qid && selectedAnswer.loop_set === r.loop_set &&
            selectedAnswer.loop_number === r.loop_number && r.question_id === selectedAnswer.id
            :
            (!r.loop_triggered_qid && r.question_id === selectedAnswer.id)
          ) {
            if (r.answers !== {} && ((r.type === 'upload' && r.answers.media_type === 'image' && r.answers.media !== "") ||
              (r.type === 'capture' && r.answers.image && r.answers.image !== "") ||
              (r.type === 'barcode' && r.answers.image && r.answers.image !== ""))) {
              if (!r.answers.hide || r.answers.hide !== 1) {
                if (r.answers.image || r.answers.media) {
                  match = true;
                  if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "capture") {
                    Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.image : r.answers.image
                  }
                  else if (selectedAnswer.queType === "upload") {
                    Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.media : r.answers.media
                  }

                  Column.title = selectedAnswer.headerName
                  Column.question_id = selectedAnswer.id
                  Column.survey_tag_id = this.state.filteredMissions[i].survey_tag_id
                  Column.answers = r.answers
                  Column.type = r.type
                  Column.index = i
                  Column.selected_index = z
                  Column.rowindex = imageList.rowindex
                  Column.customer_id = this.state.filteredMissions[i].customer_id
                  if (selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) {
                    Column.loop_set = selectedAnswer.loop_set;
                    Column.loop_number = selectedAnswer.loop_number;
                    Column.loop_triggered_qid = selectedAnswer.loop_triggered_qid;
                  }

                }
              }
            }

          }
        })
        if (match === false) {
          i = z + 1;
          this.DownClick("loop", i)
        }
        else {
          const editorInstance = this.editorRef.current.getInstance();
          this.setState({
            imageData: Column
          }, () => { editorInstance.loadImageFromURL(Column.image, Column.title) })
        }
      }
    }
  }

  /* When user clicks the up arrow in the tui editor this function gets invoked.
  * It will decrease the row index by 1 and it validates the index with the row length and it should be less than or equal to zero.If index is lesser or equal to row length and its length is less than or equal to zero it will navigate to next cell else it will quit the function.
  * By using the column index fetches row index and selcted answer.
  * Validates the question type of selected question is barcode or upload or capture and check whether original image or edited image exists in the question.
  * Selected answer contains question id.Matches the question id with mission data with some conditions.
  * While matching it validates the whether the question contains loop number,loop set number if it not exists it validate the mission data with questionid alone.  * 
  * Check whether image or media property exists in the question.If it exists it will fetch the url of the edited or original image.
  * Then it forms the data by using column index, row index,answer,question title,survey tag id and if its loop question include the loop question number as well.
  * If image url exists in answer object, which is used to render the image in the tui editor using instance method.If the url not exists it will decrease index by one and it calls the same function.
   *
   * While validating the question type is not barcode or upload or capture it will decrease index by one and it calls the same function.
   * 
   * */
  UpClick = (a, b) => {

    let imageList = this.state.imageData
    let colDef = this.state.colDef
    let selected_index = imageList.selected_index
    let disable = false
    var z = a === "loop" ? b : selected_index - 1
    if (z >= 0 && this.state.FilterRowData.length > z) {
      let i = this.state.FilterRowData[z].column_index
      let match = false;
      let Column = []

      if (i >= 0) {
        let a = colDef[imageList.rowindex];
        let selectedAnswer = a
        if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "upload" || selectedAnswer.queType === "capture") {
          if (selectedAnswer.field.includes('B_oimage') || selectedAnswer.field.includes('U_oimage') || selectedAnswer.field.includes('C_oimage')) { disable = true; }
        }
        this.state.filteredMissions[i].responses.forEach((r, index) => {
          if ((selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) ?
            selectedAnswer.loop_triggered_qid === r.loop_triggered_qid && selectedAnswer.loop_set === r.loop_set &&
            selectedAnswer.loop_number === r.loop_number && r.question_id === selectedAnswer.id
            :
            (!r.loop_triggered_qid && r.question_id === selectedAnswer.id)
          ) {
            if (r.answers !== {} && ((r.type === 'upload' && r.answers.media_type === 'image' && r.answers.media !== "") ||
              (r.type === 'capture' && r.answers.image && r.answers.image !== "") ||
              (r.type === 'barcode' && r.answers.image && r.answers.image !== ""))) {
              if (!r.answers.hide || r.answers.hide !== 1) {
                if (r.answers.image || r.answers.media) {
                  match = true;
                  if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "capture") {
                    Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.image : r.answers.image
                  }
                  else if (selectedAnswer.queType === "upload") {
                    Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.media : r.answers.media
                  }

                  Column.title = selectedAnswer.headerName
                  Column.question_id = selectedAnswer.id
                  Column.survey_tag_id = this.state.filteredMissions[i].survey_tag_id
                  Column.answers = r.answers
                  Column.type = r.type
                  Column.index = i
                  Column.selected_index = z
                  Column.rowindex = imageList.rowindex
                  Column.customer_id = this.state.filteredMissions[i].customer_id
                  if (selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) {
                    Column.loop_set = selectedAnswer.loop_set;
                    Column.loop_number = selectedAnswer.loop_number;
                    Column.loop_triggered_qid = selectedAnswer.loop_triggered_qid;
                  }

                }
              }
            }

          }
        })
        if (match === false) {
          i = z - 1;
          this.UpClick("loop", i)
        } else {
          const editorInstance = this.editorRef.current.getInstance();
          this.setState({
            imageData: Column
          }, () => { editorInstance.loadImageFromURL(Column.image, Column.title) })
        }
      }
    }
  }

  /* When user clicks the right arrow in the tui editor this function gets invoked.
  * It will increase the column index by 1 and it validates the index with the column length.If index is lesser or equal to column length it will navigate to next cell else it will quit the function.
  * By using the column index fetches row index and selcted answer.
  * Validates the question type of selected question is barcode or upload or capture and check whether original image or edited image exists in the question.
  * Selected answer contains question id.Matches the question id with mission data with some conditions.
  * While matching it validates the whether the question contains loop number,loop set number if it not exists it validate the mission data with questionid alone.  * 
  * Check whether image or media property exists in the question.If it exists it will fetch the url of the edited or original image.
  * Then it forms the data by using column index, row index,answer,question title,survey tag id and if its loop question include the loop question number as well.
  * If image url exists in answer object, which is used to render the image in the tui editor using instance method.If the url not exists it will increase index by one and it calls the same function.
   *
   * While validating the question type is not barcode or upload or capture it will increase index by one and it calls the same function.
   * 
   * */
  RightClick = (a, b) => {
    let image = this.state.imageData
    let i = a === "loop" ? b : image.rowindex + 1
    //  i = image.rowindex + 1
    let ci = image.index
    let Column = []
    let no_match = false;
    let value_exists = false;
    let colDef = this.state.colDef
    let length = colDef.length
    let disable = false
    if (colDef.length > i) {
      let a = colDef[i];

      for (i; a.queType !== ""; i++) {
        if (i < length) {
          a = colDef[i];
          if ((a.queType === "upload") || (a.queType === "capture" && !a.field.includes('-C_scale') && !a.field.includes('-C_instext')) || (a.queType === "barcode" && (a.field.includes("-B_image") || a.field.includes("-B_oimage")))) {
            break;
          }

        }
        else {
          a = colDef[image.rowindex]
          no_match = true;
          break;
        }
      }
      if (no_match === false) {

        let selectedAnswer = a
        if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "upload" || selectedAnswer.queType === "capture") {
          if (selectedAnswer.field.includes('B_oimage') || selectedAnswer.field.includes('U_oimage') || selectedAnswer.field.includes('C_oimage')) { disable = true; }
        }
        this.state.filteredMissions[ci].responses.forEach((r, index) => {
          if ((selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) ?
            selectedAnswer.loop_triggered_qid === r.loop_triggered_qid && selectedAnswer.loop_set === r.loop_set &&
            selectedAnswer.loop_number === r.loop_number && r.question_id === selectedAnswer.id
            :
            (!r.loop_triggered_qid && r.question_id === selectedAnswer.id)
          ) {
            if (r.answers !== {} && ((r.type === 'upload' && r.answers.media_type === 'image' && r.answers.media !== "") ||
              (r.type === 'capture' && r.answers.image && r.answers.image !== "") ||
              (r.type === 'barcode' && r.answers.image && r.answers.image !== ""))) {
              if (!r.answers.hide || r.answers.hide !== 1) {
                if (r.answers.image || r.answers.media) {
                  value_exists = true;
                  if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "capture") {
                    Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.image : r.answers.image
                  }
                  else if (selectedAnswer.queType === "upload") {
                    Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.media : r.answers.media
                  }

                  Column.question_id = selectedAnswer.id
                  Column.survey_tag_id = this.state.filteredMissions[ci].survey_tag_id
                  Column.answers = r.answers
                  Column.type = r.type
                  Column.index = image.index
                  Column.rowindex = i
                  Column.selected_index = image.selected_index
                  Column.title = selectedAnswer.headerName
                  Column.customer_id = this.state.filteredMissions[ci].customer_id
                  if (selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) {
                    Column.loop_set = selectedAnswer.loop_set;
                    Column.loop_number = selectedAnswer.loop_number;
                    Column.loop_triggered_qid = selectedAnswer.loop_triggered_qid;
                  }

                }
              }
            }
          }

        })
        if (value_exists === false) {
          i = i + 1;
          this.RightClick("loop", i)
        } else {
          const editorInstance = this.editorRef.current.getInstance();
          this.setState({
            imageData: Column
          }, () => { editorInstance.loadImageFromURL(Column.image, Column.title) })
        }
      }
    }

  }

  /* When user clicks the right arrow in the tui editor this function gets invoked.
  * It will decrease the column index by 1 and it validates the index with the column length.If index is lesser or equal to column length it will navigate to next cell else it will quit the function.
  * By using the column index fetches row index and selcted answer.
  * Validates the question type of selected question is barcode or upload or capture and check whether original image or edited image exists in the question.
  * Selected answer contains question id.Matches the question id with mission data with some conditions.
  * While matching it validates the whether the question contains loop number,loop set number if it not exists it validate the mission data with questionid alone.  * 
  * Check whether image or media property exists in the question.If it exists it will fetch the url of the edited or original image.
  * Then it forms the data by using column index, row index,answer,question title,survey tag id and if its loop question include the loop question number as well.
  * If image url exists in answer object, which is used to render the image in the tui editor using instance method.If the url not exists it will decrease index by one and it calls the same function.
   *
   * While validating the question type is not barcode or upload or capture it will decrease index by one and it calls the same function.
   * 
   * */
  LeftClick = (a, b) => {
    let image = this.state.imageData
    let i = a === "loop" ? b : image.rowindex - 1
    let ci = image.index
    let Column = [];
    let colDef = this.state.colDef
    let no_match = false;
    let value_exists = false;
    let disable = false;
    if (i >= 0) {
      if (colDef.length > i) {
        let a = colDef[i];

        for (i; a.queType !== ""; i--) {
          if (i >= 0) {
            a = colDef[i];
            if ((a.queType === "upload") || (a.queType === "capture" && !a.field.includes('-C_scale') && !a.field.includes('-C_instext')) || (a.queType === "barcode" && (a.field.includes("-B_image") || a.field.includes("-B_oimage")))) {
              break;
            }
          }
          else {
            a = colDef[image.rowindex]
            no_match = true;
            break;
          }
        }
        if (no_match === false) {

          let selectedAnswer = a
          if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "upload" || selectedAnswer.queType === "capture") {
            if (selectedAnswer.field.includes('B_oimage') || selectedAnswer.field.includes('U_oimage') || selectedAnswer.field.includes('C_oimage')) { disable = true; }
          }
          this.state.filteredMissions[ci].responses.forEach((r, index) => {
            if ((selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) ?
              selectedAnswer.loop_triggered_qid === r.loop_triggered_qid && selectedAnswer.loop_set === r.loop_set &&
              selectedAnswer.loop_number === r.loop_number && r.question_id === selectedAnswer.id
              :
              (!r.loop_triggered_qid && r.question_id === selectedAnswer.id)
            ) {
              if (r.answers !== {} && ((r.type === 'upload' && r.answers.media_type === 'image' && r.answers.media !== "") ||
                (r.type === 'capture' && r.answers.image && r.answers.image !== "") ||
                (r.type === 'barcode' && r.answers.image && r.answers.image !== ""))) {
                if (!r.answers.hide || r.answers.hide !== 1) {
                  if (r.answers.image || r.answers.media) {
                    value_exists = true;
                    if (selectedAnswer.queType === "barcode" || selectedAnswer.queType === "capture") {
                      Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.image : r.answers.image
                    }
                    else if (selectedAnswer.queType === "upload") {
                      Column.image = disable ? r.answers.image_orig ? r.answers.image_orig : r.answers.media : r.answers.media
                    }
                    Column.question_id = selectedAnswer.id
                    Column.survey_tag_id = this.state.filteredMissions[ci].survey_tag_id
                    Column.answers = r.answers
                    Column.type = r.type
                    Column.index = image.index
                    Column.rowindex = i
                    Column.selected_index = image.selected_index
                    Column.title = selectedAnswer.headerName
                    Column.customer_id = this.state.filteredMissions[ci].customer_id
                    if (selectedAnswer.loop_set && selectedAnswer.loop_set != null && selectedAnswer.loop_set > 0) {
                      Column.loop_set = selectedAnswer.loop_set;
                      Column.loop_number = selectedAnswer.loop_number;
                      Column.loop_triggered_qid = selectedAnswer.loop_triggered_qid;
                    }

                  }
                }
              }
            }

          })
          if (value_exists === false) {
            i = i - 1;
            this.LeftClick("loop", i)
          } else {
            const editorInstance = this.editorRef.current.getInstance();
            this.setState({
              imageData: Column
            }, () => { editorInstance.loadImageFromURL(Column.image, Column.title) })
          }

        }
      }

    }
  }


  /*
   *Used to download the edited image of current question.
    * Edited image fetch from tui editor by using instance method.
    * download the edited image to the local. */
  handleClickDownload = () => {

    //npm install file-saver --save
    var FileSaver = require('file-saver');
    const editorInstance = this.editorRef.current.getInstance();
    FileSaver.saveAs(editorInstance.toDataURL({ quality: 0.8 }), 'image.jpg')
  };

  // handleClickSave = () => {
  //   const editorInstance = this.editorRef.current.getInstance();
  //   let dataURL = editorInstance.toDataURL({ quality: 0.8 });
  //   this.setState({
  //     dataURL: dataURL
  //   }, () => { this.props.updateAnswer() })
  // };

  /* Used to return the image data of edited image.  */
  getdataURL() {
    return this.state.dataURL
  }

  /* Used to return the answer data of edited image.  */
  getImageData() {
    return this.state.imageData
  }

  render() {

    return (
      <>
        {this.state.open === true ? (
          <div>
            <div className='editorcontent'>
              <div className='imageeditor'
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginTop: '2%'
                }}>

                <div className="image-edit-header"
                  style={{
                    position: "absolute",
                    width: "100%",
                    zIndex: "10",
                    paddingRight: "50px",
                  }}
                >
                  <div className='editorclose'
                    onClick={this.props.closeLightbox}
                    style={{
                      fontSize: "30px",
                      float: "right",
                      position: "relative",
                      right: "-30px",
                      color: "#fff",
                      cursor: 'pointer'
                    }}
                  >&times;</div>
                  <button
                    className="tui-image-editor__apply-btn"
                    onClick={this.handleClickDownload}
                    href=''
                    style={{
                      border: "none",
                      padding: "8px 20px",
                      cursor: "pointer",
                      float: "right",
                      margin: "10px",
                      borderRadius: "5px",
                      background: "#074e9e",
                      color: "#fff"
                    }}
                  > Download</button>


                  <h3 style={{ color: "white" }}>{this.state.imageData.title}</h3>


                </div>
                <div className='imagesize' style={{ position: "relative" }}>

                  <ImageEditor
                    ref={this.editorRef}
                    includeUI={{
                      theme: blackTheme,
                      menu: this.state.menu,
                      loadImage: {
                        path: this.state.imageData.image + "?editor=yes",
                        name: 'SampleImage'
                      },

                      menuBarPosition: 'top'
                    }}
                    cssMaxHeight={this.state.maxheight}
                    cssMaxWidth={this.state.maxwidth}
                    selectionStyle={{
                      cornerSize: 20,
                      rotatingPointOffset: 70

                    }}
                  />
                  <i className="fas fa-chevron-up" onClick={this.UpClick}
                    style={{
                      left: "50%",
                      transform: "translate(-50%, 10px)",
                      top: "-60px",
                      height: "50px"
                    }} />
                  <i className="fas fa-chevron-down" onClick={this.DownClick}
                    style={{
                      left: "50%",
                      transform: "translate(-50%, -10px)",
                      bottom: "-60px"
                    }} />
                  <i className="fas fa-chevron-left" onClick={this.LeftClick}
                    style={{
                      left: "-46px",
                      top: "50%",
                      width: "50px",
                      transform: "translateY(-50%)"
                    }} />
                  <i className="fas fa-chevron-right" onClick={this.RightClick}
                    style={{
                      right: "-50px",
                      top: "50%",
                      width: "50px",
                      transform: "translateY(-50%)"
                    }} />

                </div>
              </div>
            </div>



          </div>
        ) : ("")}

      </>
    );
  }
}
