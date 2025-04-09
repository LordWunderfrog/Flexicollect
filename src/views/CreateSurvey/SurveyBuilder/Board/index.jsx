// /**
//  * Board component.
//  * 
//  * This component is used to manage the drag and drop the survey elements.
//  *
//  */
// import React, { Component } from "react";

// import Card from "./Drop";

// import DropList from "./DropList";

// import "./Board.css";
// import api2 from "helpers/api2";
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// import cloneDeep from 'lodash/cloneDeep';


// const getItemStyle = (isDragging, draggableStyle) => ({
//   /* some basic styles to make the items look a bit nicer */
//   // userSelect: 'none',

//   /* change background colour if dragging */
//   background: isDragging ? '#d15c17' : '',

//   /* styles we need to apply on draggables */
//   ...draggableStyle
// });

// const getListStyle = isDraggingOver => ({
//   background: isDraggingOver ? '' : '',

// });
// class Board extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       drops: [],
//       sidebox: true,
//       gallery: { images: [] },
//       emojis: [],
//       scaleico: [],
//       infoico: [],
//       elementsDefined: false,
//       SourceArray: [],
//       dropAction: "reorder",

//     };

//     this.ropen = this.ropen.bind(this);
//   }

//   componentDidMount() {

//     this.checkrefcode(this.props.olddrops)
//     this.gallerrfun();
//     this.getEmojis();
//     this.infoGallery();
//     this.getScaleimg();
//     let SourceArray = [
//       {
//         id: "item1",
//         type: "info",
//         icon: "fa fa-info-circle",
//         text: "Information Display"
//       },
//       {
//         id: "item2",
//         type: "input",
//         icon: "fa fa-font",
//         text: "Text Input"

//       },
//       {
//         id: "item3",
//         type: "Dropdown",
//         icon: "fa fa-caret-square-o-down",
//         text: "Dropdown"
//       },
//       {
//         id: "item4",
//         type: "gps",
//         icon: "fa fa-map-marker",
//         text: "GPS"
//       },
//       {
//         id: "item5",
//         type: "capture",
//         icon: "fa fa-camera",
//         text: "Image Tagging"
//       },
//       {
//         id: "item6",
//         type: "scale",
//         icon: "fa fa-exchange",
//         text: "Scale"
//       },
//       {
//         id: "item7",
//         type: "upload",
//         icon: "fa fa-upload",
//         text: "Upload"
//       },
//       {
//         id: "item8",
//         type: "barcode",
//         icon: "fa fa-barcode",
//         text: "Barcode"
//       },
//       {
//         id: "item9",
//         type: "choice",
//         icon: "fa fa-check-square",
//         text: "Choice Questions"
//       }
//     ]

//     this.setState({
//       SourceArray: SourceArray
//     })
//   }
//   componentWillReceiveProps(nextProps) {
//     this.setState({ drops: nextProps.olddrops })
//   }

//   /* Handles the validation of reference code. */
//   async checkrefcode(drops) {
//     drops.forEach((p, i) => {
//       let fieldprops = p;
//       if (fieldprops.type !== "info" && fieldprops.type !== "gps") {
//         if ((fieldprops.properties.refcode && fieldprops.properties.refcode === "") || !fieldprops.properties.refcode) {
//           let type = ""
//           if (fieldprops.type === "input") {
//             type = "TXT"
//           } else if (fieldprops.type === "upload") {
//             type = "UPL"
//           } else if (fieldprops.type === "choice") {
//             type = "CHO"
//           } else if (fieldprops.type === "scale") {
//             type = "SCA"
//           } else if (fieldprops.type === "capture") {
//             type = "CAP  "
//           } else if (fieldprops.type === "barcode") {
//             type = "BAR"
//           }
//           this.generaterefcode('generate', type, this.state.drops, i);
//         }
//       }
//     })
//     this.setState({
//       drops: drops,
//       elementsDefined: true
//     }, () => {
//       setTimeout(() => {
//         this.autoSave()
//       }, 3000);
//     });
//   }
//   /* Handles the api to generate the reference code. */
//   async generaterefcode(check, type, fieldprops, i) {
//     let refcode = ""
//     let url = "refcode/generate?type=" + type + "&survey_refcode=" + this.props.refcode
//     api2
//       .get(url)
//       .then(resp => {
//         if (resp.status === 200) {
//           refcode = resp.data.message;
//           if (check === 'generate') {
//             let drops = this.state.drops
//             drops[i].properties.refcode = refcode
//             this.setState({ drops })
//             //  return fieldprops
//             this.saverefcode(refcode, 'generate');
//           } else {
//           }
//         } else {
//           // return fieldprops
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }
//   /* Handles the api to save the reference code. */
//   async saverefcode(refcode, check) {
//     api2
//       .get("refcode/save?refcode=" + refcode)
//       .then(resp => {
//         if (resp.status === 200) {
//           if (check === 'generate') {
//             // this.updateprojectrefcode(refcode)
//           }
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }


//   /* Handles the api to load the common images from the gallery. */
//   gallerrfun = () => {
//     let self = this;
//     api2
//       .get("v1/gallery/images/common")
//       .then(resp => {
//         self.setState({
//           gallery: resp.data
//         });
//       })
//       .catch(error => {
//         console.error(error);
//         self.setState({
//           response: true
//         });
//       });
//   };


//   /* Handles the api to load the info images from the gallery. */
//   infoGallery = () => {
//     let self = this;
//     api2
//       .get("v1/gallery/images/info")
//       .then(resp => {
//         self.setState({
//           infoico: resp.data.images
//         });
//       })
//       .catch(error => {
//         console.error(error);

//         self.setState({
//           response: true
//         });
//       });
//   };


//   /* Handles the api to load the scale images from the gallery. */
//   getScaleimg = () => {
//     let self = this;
//     api2
//       .get("v1/gallery/images/scale")
//       .then(resp => {
//         self.setState({
//           scaleico: resp.data.images
//         });
//       })
//       .catch(error => {
//         console.error(error);

//         self.setState({
//           response: true
//         });
//       });
//   };

//   /* Handles the api to load the emojis from the gallery. */
//   getEmojis = () => {
//     let self = this;
//     api2
//       .get("v1/gallery/scale_images")
//       .then(resp => {
//         self.setState({
//           emojis: resp.data.images
//         });
//       })
//       .catch(error => {
//         console.error(error);

//         self.setState({
//           response: true
//         });
//       });
//   };


//   /**
//    * Handles the settings bar.
//    *
//    * @public
//    * @param {e}
//    * @param {status}
//    * @param {i}
//    *
//    */
//   ropen(e, status, i, index) {
//     let selectedlanguage = this.props.selectedlanguage
//     let languages_drop = this.props.languages_drop;
//     let defaultdrops = this.props.defaultdrops
//     let currentlanguage = this.props.dropcurrentlanguage
//     let drops = this.state.drops;

//     //

//     let fieldprops = this.props.defaultdrops[index]
//     // let selectedlanguage = this.props.selectedlanguage
//     // let languages_drop = this.props.languages_drop;
//     selectedlanguage.forEach((a, b) => {
//       if (a.label !== 'English') {
//         let defaultdrops = languages_drop[a.label].content[index]
//         if (fieldprops && fieldprops.type === 'info') {
//           if (defaultdrops.label === "" && fieldprops.label !== "") {

//             defaultdrops.completed = 0;
//           }
//           else if ((defaultdrops.properties.info_text === "" && fieldprops.properties.info_text !== "") ||
//             (defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

//             defaultdrops.completed = 0;
//           }
//           else {
//             defaultdrops.completed = 1;
//           }
//         }
//         else if (fieldprops && fieldprops.type === 'input') {
//           if ((fieldprops.label !== "" && defaultdrops.label === "")) {

//             defaultdrops.completed = 0;
//           }
//           else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

//             defaultdrops.completed = 0;
//           }
//           else {
//             defaultdrops.completed = 1;
//           }
//         }
//         else if (fieldprops && fieldprops.type === 'capture') {
//           if ((defaultdrops.label === "" && fieldprops.label !== "")) {

//             defaultdrops.completed = 0;
//           }
//           else if ((fieldprops.properties.question !== "" && defaultdrops.properties.question === "")) {

//             defaultdrops.completed = 0;
//           }
//           else if ((fieldprops.properties.instruction_text && fieldprops.properties.instruction_text !== "") &&
//             defaultdrops.properties.instruction_text && defaultdrops.properties.instruction_text === "") {
//             defaultdrops.completed = 0;
//           }
//           else if ((fieldprops.properties.marker_instruction_text && fieldprops.properties.marker_instruction_text !== "") &&
//             defaultdrops.properties.marker_instruction_text && defaultdrops.properties.marker_instruction_text === "") {
//             defaultdrops.completed = 0;
//           }
//           else if ((fieldprops.properties.scale_text && fieldprops.properties.scale_text !== "") &&
//             defaultdrops.properties.scale_text && defaultdrops.properties.scale_text === "") {
//             defaultdrops.completed = 0;
//           }
//           else {
//             defaultdrops.completed = 1;

//           }
//         }
//         else if (fieldprops && fieldprops.type === 'upload') {
//           if ((fieldprops.label !== "" && defaultdrops.label === "")) {

//             defaultdrops.completed = 0;
//           }
//           else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

//             defaultdrops.completed = 0;
//           }
//           else {
//             defaultdrops.completed = 1;
//           }
//         }
//         else if (fieldprops && fieldprops.type === 'choice') {
//           if ((fieldprops.label !== "" && defaultdrops.label === "")) {

//             defaultdrops.completed = 0;
//           }
//           else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

//             defaultdrops.completed = 0;
//           }
//           else if (!fieldprops.properties.multilevel && !defaultdrops.properties.multilevel) {
//             defaultdrops.completed = 1;
//           }
//           else if (fieldprops.properties.multilevel === 1) {
//             if (fieldprops.properties.options) {
//               fieldprops.properties.options.forEach((x, y) => {
//                 if (x.label !== "" && (defaultdrops.properties.options && defaultdrops.properties.options[y] && defaultdrops.properties.options[y].label === "")) {
//                   defaultdrops.completed = 0;
//                 } else {
//                   defaultdrops.completed = 1;
//                 }
//                 if (x.sublabel) {
//                   x.sublabel.forEach((a, b) => {
//                     if (a.sublabel !== "" && defaultdrops.properties.options && defaultdrops.properties.options[y] &&
//                       defaultdrops.properties.options[y].sublabel && defaultdrops.properties.options[y].sublabel[b] && defaultdrops.properties.options[y].sublabel[b].sublabel === "") {
//                       defaultdrops.completed = 0;
//                     }
//                     else {
//                       defaultdrops.completed = 1;
//                     }
//                   })
//                 }
//               })
//             }
//           }
//           else if (fieldprops.properties.multilevel === 0 || fieldprops.properties) {
//             if (fieldprops.properties.options) {
//               fieldprops.properties.options.forEach((x, y) => {
//                 if (x.label !== "" && (defaultdrops.properties.options[y].label === "")) {
//                   defaultdrops.completed = 0;
//                 }
//                 else {
//                   defaultdrops.completed = 1;
//                 }
//               })
//             }
//           }
//         }
//         else if (fieldprops && fieldprops.type === 'gps') {
//           if (fieldprops.label !== "" && defaultdrops.label === "") {

//             defaultdrops.completed = 0;
//           }
//           else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

//             defaultdrops.completed = 0;
//           }
//           else {
//             defaultdrops.completed = 1;
//           }
//         }
//         else if (fieldprops && fieldprops.type === 'scale') {
//           if ((fieldprops.label === "" && defaultdrops.label !== "")) {

//             defaultdrops.completed = 0;
//           }
//           else if ((defaultdrops.properties.question !== "" && fieldprops.properties.question === "")) {

//             defaultdrops.completed = 0;
//           }
//           else if (fieldprops.properties.end_text !== "" && defaultdrops.properties.end_text === "") {
//             defaultdrops.completed = 0;
//           }
//           else if (fieldprops.properties.start_text !== "" && defaultdrops.properties.start_text === "") {
//             defaultdrops.completed = 0;
//           }
//           else {
//             defaultdrops.completed = 1;
//           }
//         }
//         else if (fieldprops && fieldprops.type === 'barcode') {
//           if (fieldprops.label !== "" && defaultdrops.label === "") {

//             defaultdrops.completed = 0;
//           }
//           if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

//             defaultdrops.completed = 0;
//           } else {
//             defaultdrops.completed = 1;
//           }
//         }

//       }
//     })





//     if (this.state.drops.length <= 0) {
//       i = 0;
//     }

//     for (let temp = 0; temp < drops.length; temp++) {
//       if (drops[temp]) {
//         drops[temp].rightStatus = false;
//         if (currentlanguage.value !== "English" && defaultdrops[temp]) { defaultdrops[temp].rightStatus = false; }
//         selectedlanguage.forEach((a, b) => {
//           if (a.label !== 'English') {
//             languages_drop[a.label].content[temp].rightStatus = false;
//           }
//         })
//       }
//     }
//     for (let temp = 0; temp < drops.length; temp++) {
//       if (drops[temp].question_id === i) {
//         i = temp;
//         break;
//       }
//     }

//     let self = this;
//     setTimeout(function () {
//       if (drops[i]) {
//         drops[i].rightStatus = status;
//         if (currentlanguage.value !== "English" && defaultdrops[i]) { defaultdrops[i].rightStatus = status; }
//         selectedlanguage.forEach((a, b) => {
//           if (a.label !== 'English') {
//             languages_drop[a.label].content[i].rightStatus = status;
//           }
//         })
//       }
//       self.setState({ drops }, _ => { self.props.rchange(e) });
//     })

//   }


//   cloneDrop = (question_id, type) => {
//     const index = this.state.drops.findIndex(drop => Number(drop.question_id) === Number(question_id)),
//       newDrop = this.endDrag(type),
//       newDropsArray = [...this.state.drops]
//     newDrop.properties = {
//       ...newDrop.properties,
//       ...this.state.drops[index].properties,
//       refcode: "",
//       question: "Copy of " + String(this.state.drops[index].properties.question).trim()
//     }
//     newDrop.question_id = Number([...this.state.drops].sort((a, b) => Number(b.question_id) - Number(a.question_id))[0].question_id) + 1
//     newDropsArray.push(newDrop)
//     this.setState({
//       drops: [...newDropsArray]
//     }, () => {
//       this.checkrefcode(newDropsArray);
//       this.props.ondraglick(newDropsArray, true);
//     });


//     const selectedlanguage = this.props.selectedlanguage,
//       languages_drop = {
//         ...this.props.languages_drop
//       }
//     selectedlanguage.forEach((a, b) => {
//       if (a.label !== 'English') {
//         const index = languages_drop[a.label].content.findIndex(content => {
//           return Number(content.question_id) === Number(question_id)
//         })
//         const newDropLang = {
//           ...languages_drop[a.label].content[index],
//           handler: newDrop.handler,
//           question_id: newDrop.question_id
//         }
//         languages_drop[a.label].content.push(newDropLang)
//       }
//     })
//     this.props.setDropsLang(languages_drop)
//   }


//   /**
//    * Handles on deleting an element.
//    *
//    * @public
//    * @param {e}
//    */
//   deleteDrops = (e) => {
//     const currentdrops = this.state.drops;
//     let newdata = currentdrops.filter(currentdrops => {
//       return currentdrops && currentdrops.question_id !== e
//     });

//     let selectedlanguage = this.props.selectedlanguage
//     let languages_drop = { ...this.props.languages_drop };
//     selectedlanguage.forEach((a, b) => {
//       if (a.label !== 'English') {
//         let drop = []
//         languages_drop[a.label].content.forEach(x => {
//           if (e !== x.question_id) {
//             drop.push(x)
//           }
//         })
//         languages_drop[a.label].content = drop

//       }
//     })


//     this.setState({
//       drops: newdata
//     }, function () {
//       this.props.deteldrops(this.state.drops);
//       this.props.setDropsLang(languages_drop)
//     });

//   }

//   /**
//    * Handles on updating the element.
//    *
//    * @public
//    * @param {e}
//    */
//   updateattrib(lb, e) {
//     let olddata = this.state.drops;
//     var idx = olddata.findIndex((ele) => {
//       return ele.vid === e;
//     });
//     olddata[idx].question = lb;
//     this.setState({ olddata }, this.props.ondraglick(this.state.drops))
//   }

//   /**
//    * Handles on swapping an element in an array.
//    *
//    * @public
//    * @param {e}
//    */
//   upArrowFun = e => {
//     for (let i = 0; i < this.state.drops.length; i++) {
//       if (this.state.drops[i].question_id === e) {
//         e = i;
//         break;
//       }
//     }


//     var newarray = this.state.drops.slice();

//     if (e !== 0) {
//       let temp = newarray[e - 1];
//       newarray[e - 1] = newarray[e];
//       newarray[e] = temp;
//     }

//     this.setState({ drops: newarray }, function () {
//       this.props.deteldrops(this.state.drops, true);
//     });

//   };

//   /**
//    * Handles on swapping an element in an array.
//    *
//    * @public
//    * @param {e}
//    */

//   downArrowFun = e => {

//     for (let i = 0; i < this.state.drops.length; i++) {
//       if (this.state.drops[i].question_id === e) {
//         e = i;
//         break;
//       }
//     }

//     let newarray = this.state.drops.slice();
//     let arrlen = newarray.length - 1;

//     if (e !== arrlen) {
//       let temp = newarray[e + 1];
//       newarray[e + 1] = newarray[e];
//       newarray[e] = temp;
//     }

//     this.setState({ drops: newarray }, function () {
//       this.props.deteldrops(this.state.drops, true);
//     });
//   };

//   /* Unused function.Kept this code for reference. */
//   // /**
//   //  * handles on drop actions of the element.
//   //  *
//   //  * @public
//   //  * @param {color}
//   //  * @param {Shape}
//   //  * @param {text}
//   //  * @param {type}
//   //  * @param {dropChange}
//   //  * @param {vid}
//   //  * @param {question}
//   //  * @param {properties}
//   //  * @param {question_id}
//   //  * @param {label}
//   //  */
//   // handleDrop(color, shape, text, type, dropChange, handler, question, properties, question_id, label, conditions) {
//   //   const { drops } = this.state;
//   //   const nextDrops = [
//   //     ...drops,
//   //     {
//   //       conditions,
//   //       label,
//   //       type,
//   //       handler,
//   //       properties
//   //     }
//   //   ];

//   //   let qid = nextDrops[0] && nextDrops[0].question_id >= 0 ? nextDrops[0].question_id : -1;

//   //   for (var i = 0; i < nextDrops.length; i++) {
//   //     qid = nextDrops[i].question_id >= 0 && nextDrops[i].question_id > qid ? nextDrops[i].question_id : qid;
//   //   }

//   //   qid = qid + 1;
//   //   nextDrops[nextDrops.length - 1].question_id = qid;
//   //   this.props.updatelanguagedrop(nextDrops[nextDrops.length - 1]);
//   //   this.state.drops.push(nextDrops[nextDrops.length - 1]);
//   //   this.setState({
//   //     drops: this.state.drops
//   //   }, () => {
//   //     this.checkrefcode()
//   //   });
//   //   //this.props.ondraglick(this.state.drops);
//   //   //this.props.autosave()
//   // }

//   /* Unused function. */
//   handleDropAppOnly(e) {
//     return false;
//   }

//   /**
//    * Handles open event of settings bar.
//    *
//    * @public
//    */
//   openevent() {

//     this.setState({
//       sidebox: (this.state.sidebox) ? false : true
//     }, this.props.lchange);
//   }


//   /* Handles reordering of question. */

//   reorder(list, startIndex, endIndex) {
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);
//     return result;
//   };

//   /* Handles the validation of question type. */

//   endDrag(type) {
//     if (type === 0) {
//       type = "info"
//     } else if (type === 1) {
//       type = "input"

//     } else if (type === 2) {
//       type = "dropdown"

//     } else if (type === 3) {
//       type = "gps"

//     } else if (type === 4) {
//       type = "capture"

//     } else if (type === 5) {
//       type = "scale"

//     } else if (type === 6) {
//       type = "upload"

//     } else if (type === 7) {
//       type = "barcode"

//     } else if (type === 8) {
//       type = "choice"

//     }


//     // const { onDrop } = props;
//     // const { text } = props;
//     // const { type } = props;
//     // let qid = 0;
//     let labelval = 0;




//     if (this.state.drops.length > 0) {
//       this.state.drops.forEach((drop, index) => {

//         // if (drop.qid > qid) {
//         //   qid = drop.question_id;
//         // }
//         if (type === drop.type) {
//           labelval = labelval + 1
//         }
//       })
//     }

//     if (labelval === 0) {
//       labelval = ""
//     }
//     // const  question  = "";
//     // const { dropChange } = props;
//     // const { question_id } = props;
//     const handler = new Date().valueOf();
//     const inputlabel = "Text Input " + labelval;
//     const capturelabel = "Image Tagging " + labelval;
//     const choicelabel = "Choice Questions " + labelval;
//     const scalelabel = "Scale " + labelval;
//     const barcodelabel = "Barcode " + labelval;
//     const infolabel = "Information " + labelval;
//     const uploadlabel = "Upload " + labelval;
//     const gpslabel = "GPS " + labelval;
//     const label = type === 'input' ? (inputlabel)
//       : type === 'choice' ? (choicelabel)
//         : type === 'capture' ? (capturelabel)
//           : type === 'barcode' ? (barcodelabel)
//             : type === 'scale' ? (scalelabel)
//               : type === 'info' ? (infolabel)
//                 : type === 'upload' ? (uploadlabel)
//                   : type === 'gps' ? (gpslabel)
//                     : false
//     const inputprops = {
//       question: "Type a question",
//       length: "20",
//     }
//     const captureprops = {
//       question: "Type the message",
//       marker_enabled: 1,
//       scale_images: [],
//     }
//     const choiceprops = {
//       question: "Type a question",
//       choice_type: "single",
//       image_size: "small",
//     }
//     const barcodeprops = {
//       question: "Type a question",
//       validate: "identity"
//     }
//     const scaleprops = {
//       question: "Type a question",
//     }
//     const gpsprops = {
//       question: "Type a question",
//       gps_stats: "hide"
//     }
//     const infoprops = {
//       question: "Type Information",
//       info_type: "none",
//       info_text: ''
//     }
//     const uploadprops = {
//       question: "Type a question",
//       media_type: "image",
//       allow_gallery: 1
//     }
//     const conditions = []
//     const properties = type === 'input' ? (inputprops)
//       : type === 'choice' ? (choiceprops)
//         : type === 'capture' ? (captureprops)
//           : type === 'barcode' ? (barcodeprops)
//             : type === 'scale' ? (scaleprops)
//               : type === 'info' ? (infoprops)
//                 : type === 'upload' ? (uploadprops)
//                   : type === 'gps' ? (gpsprops)
//                     : false

//     return {

//       conditions,
//       label,
//       type,
//       handler,
//       properties
//     }
//     // const { color } = monitor.getItem();
//     // const { shape } = monitor.getDropResult();
//     // onDrop(color, shape, text, type, dropChange, handler, question, properties, question_id, label, conditions);
//   }

//   /* Handles the event to update the properties of question. */
//   autoSave() {
//     this.props.autosave()
//   }

//   /* Validating the destination area while droppping the element. */
//   onDragEnd = result => {
//     const { source, destination } = result;
//     // dropped outside the list
//     if (!destination && this.state.drops.length > 0) {
//       return

//     }
//     else if ((source.droppableId === 'droppable') && (this.props.platformType !== "App Only" && source.index === 4)) {

//       return;
//     }
//     else if ((source.droppableId === 'droppable') && (this.props.platformType !== "App Only" && source.index === 7)) {

//       return;
//     }

//     else if ((source.droppableId === 'droppable') && (destination && destination.droppableId === 'droppable')) {

//       return;
//     }
//     else if ((source.droppableId === 'droppable2') && (destination && destination.droppableId === 'droppable2')) {
//       const items = this.reorder(
//         this.state.drops,
//         source.index,
//         destination.index
//       );


//       this.setState({
//         drops: items,
//         dropAction: "reorder"
//       }, () => {
//         this.props.ondraglick(this.state.drops, true);
//         this.props.updatelanguagedrop("reorder", destination.index, source.index);
//       })
//     }
//     else if ((source.droppableId === 'droppable') && (destination && destination.droppableId === 'droppable2')) {
//       this.setState({
//         dropAction: "move"

//       })

//       const result = this.endDrag(source.index)
//       let selectedDrop = result;
//       let drops = this.state.drops;
//       drops.splice(destination.index, 0, selectedDrop);

//       this.setState({
//         drops: drops
//       }, () => {
//         let nextDrops = this.state.drops
//         let qid = nextDrops[0] && nextDrops[0].question_id >= 0 ? nextDrops[0].question_id : -1;

//         for (var i = 0; i < nextDrops.length; i++) {
//           qid = nextDrops[i].question_id >= 0 && nextDrops[i].question_id > qid ? nextDrops[i].question_id : qid;
//         }

//         qid = qid + 1;
//         let drops = this.state.drops
//         drops[destination.index].question_id = qid;
//         this.setState({ drops })
//         let other_lan = cloneDeep(nextDrops);
//         this.props.updatelanguagedrop("move", other_lan[destination.index], destination.index);
//         //this.props.updatelanguagedrop("move",nextDrops[destination.index], destination.index);
//         this.setState({
//           drops: this.state.drops,
//           dropAction: "reorder"

//         }, () => {

//           this.setState({ dropAction: "reorder" })
//           this.checkrefcode(drops);
//           this.props.ondraglick(this.state.drops, true);
//           // this.props.autosave();
//         })
//       })
//     }
//     else if ((source.droppableId === 'droppable') && (this.state.drops.length === 0)) {
//       this.setState({
//         dropAction: "move"
//       })
//       const result = this.endDrag(source.index)
//       let selectedDrop = result;
//       let drops = this.state.drops
//       drops.push(selectedDrop);
//       drops[this.state.drops.length - 1].question_id = 0;
//       this.setState({ drops })
//       let otherlang = cloneDeep(this.state.drops);
//       this.props.updatelanguagedrop("move", otherlang[otherlang.length - 1], otherlang.length - 1);
//       //this.props.updatelanguagedrop("move",this.state.drops[this.state.drops.length - 1], this.state.drops.length - 1);

//       this.props.ondraglick(this.state.drops, true);
//       // this.props.autosave();

//     }
//   };



//   render() {
//     let disable = this.props.dropcurrentlanguage.value !== "English" ? { 'pointerEvents': 'none', opacity: 0.4, 'cursor': "none" } : {}

//     const { drops, sidebox, dropAction } = this.state;
//     const boardval = (sidebox) ? "openbox" : 'closebox';


//     return (
//       <DragDropContext onDragEnd={this.onDragEnd}
//       >
//         <div id="board" className={boardval} >
//           <div className="new-btn pointer" onClick={() => this.openevent()}>
//             <div className='relativepos'>
//               <p>Add Elements</p>
//               <span className="bdr-ripple-ani-btn rippleff rotator"><i className="fa fa-plus"></i></span>
//             </div>
//           </div>

//           <div id="board__sources">
//             <div className="new-btn pointerhan" onClick={() => this.openevent()}>
//               <div className='relativepos'>
//                 <p>Form Elements</p>
//                 <span className="bdr-ripple-ani-btn rippleff rotator"> <i className="fa fa-times pointer closebtn" /></span>
//               </div>
//             </div>
//             <div className="list-froms-wrap"
//               style={disable}
//             >
//               <Droppable droppableId="droppable">
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     style={getListStyle(snapshot.isDraggingOver)}
//                     draggable
//                   >
//                     {this.state.SourceArray.map((item, index) => (
//                       <Draggable
//                         key={item.id}
//                         draggableId={item.id}
//                         index={index}
//                       >
//                         {(provided, snapshot) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             style={getItemStyle(
//                               snapshot.isDragging,
//                               provided.draggableProps.style
//                             )}
//                           >
//                             <div
//                               className="board__sources__source"
//                               style={{
//                                 opacity: (item.id === "item3" || (item.id === "item5" && this.props.platformType !== "App Only") || (item.id === "item8" && this.props.platformType !== "App Only")) ? 0.3 : snapshot.isDragging ? 0.25 : 1,
//                                 cursor: (item.id === "item3" || (item.id === "item5" && this.props.platformType !== "App Only") || (item.id === "item8" && this.props.platformType !== "App Only")) ? "none" : ""
//                               }}
//                             >
//                               <i className={item.icon} />
//                               <p> {item.text} </p>
//                             </div>

//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>

//             </div>
//           </div>

//           <div

//             id="board__targets"
//           >

//             <Droppable droppableId="droppable2">
//               {(provided, snapshot) => (
//                 <div
//                   ref={provided.innerRef}
//                   style={getListStyle(snapshot.isDraggingOver)}
//                 >
//                   {this.state.drops.map((drop, index) => (drops[index] ? (
//                     <Draggable
//                       isDragDisabled={this.props.dropcurrentlanguage.value !== "English"}
//                       key={drop.question_id}
//                       draggableId={
//                         dropAction === "reorder" ? drop.question_id.toString() : drop.question_id
//                       }
//                       index={index}>
//                       {(provided, snapshot) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           style={getItemStyle(
//                             snapshot.isDragging,
//                             provided.draggableProps.style
//                           )}
//                         >
//                           <DropList
//                             index={index}
//                             key={index}
//                             question_id={drop.question_id}
//                             id={drop.id}
//                             type={drop.type}
//                             cloneDrop={this.cloneDrop}
//                             deleteddrops={(e) => this.deleteDrops(e)}
//                             dropstate={this.state.drops}
//                             rightStatus={drop.rightStatus}
//                             rightOpen={this.ropen}
//                             labelprop={drop}
//                             oldprop={drop}
//                             oldconditions={this.props.oldconditions}
//                             autosave={() => this.autoSave()}
//                             upArrowFunc={e => this.upArrowFun(e)}
//                             downArrowFunc={e => this.downArrowFun(e)}
//                             refcode={this.props.refcode}
//                             selectedlanguage={this.props.selectedlanguage}
//                             changedroplanguage={this.props.changedroplanguage}
//                             dropcurrentlanguage={this.props.dropcurrentlanguage}
//                             defaultdrops={this.props.defaultdrops[index]}
//                             languages_drop={this.props.languages_drop}
//                             downArrowFuncLanguage={this.props.downArrowFuncLanguage}
//                             upArrowFuncLanguage={this.props.upArrowFuncLanguage}
//                           />

//                         </div>
//                       )}
//                     </Draggable>
//                   ) : ""
//                   ))}
//                   <div style={{ height: 100 }}>
//                   </div>
//                   {provided.placeholder}
//                 </div>

//               )}
//             </Droppable>
//             {this.state.drops.map((drop, index) => (drops[index] ? (
//               <Card
//                 index={index}
//                 color={drop.color}
//                 key={index}
//                 question_id={drop.question_id}
//                 id={drop.id}
//                 shape={drop.shape}
//                 text={drop.label}
//                 type={drop.type}
//                 attrib={() => this.updateattrib()}
//                 deleteddrops={(e) => this.deleteDrops(e)}
//                 dropstate={this.state.drops}
//                 rightStatus={drop.rightStatus}
//                 rightOpen={this.ropen}
//                 labelprop={drop}
//                 oldprop={drop}
//                 test={drop.question}
//                 oldconditions={this.props.oldconditions}
//                 autosave={() => this.autoSave()}
//                 upArrowFunc={e => this.upArrowFun(e)}
//                 downArrowFunc={e => this.downArrowFun(e)}
//                 scaleico={this.state.scaleico}
//                 infoico={this.state.infoico}
//                 emojis={this.state.emojis}
//                 gallery={this.state.gallery.images}
//                 refcode={this.props.refcode}
//                 selectedlanguage={this.props.selectedlanguage}
//                 changedroplanguage={this.props.changedroplanguage}
//                 dropcurrentlanguage={this.props.dropcurrentlanguage}
//                 defaultdrops={this.props.defaultdrops[index]}
//                 defaultdropsstatus={this.props.defaultdrops}
//                 updatelanguageproperties={this.props.updatelanguageproperties}
//                 languages_drop={this.props.languages_drop}
//                 downArrowFuncLanguage={this.props.downArrowFuncLanguage}
//                 upArrowFuncLanguage={this.props.upArrowFuncLanguage}
//               />
//             ) : ""
//             ))}

//           </div>

//         </div>

//       </DragDropContext>
//     );
//   }
// }
// export default Board;

/**
 * Board component.
 * 
 * This component is used to manage the drag and drop the survey elements.
 *
 */
import React, { Component } from "react";

import Card from "./Drop";

import DropList from "./DropList";

import "./Board.css";

import api2 from "helpers/api2";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cloneDeep from 'lodash/cloneDeep';


const getItemStyle = (isDragging, draggableStyle) => ({
  /* some basic styles to make the items look a bit nicer */
  // userSelect: 'none',

  /* change background colour if dragging */
  background: isDragging ? '#d15c17' : '',

  /* styles we need to apply on draggables */
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '' : '',

});
//let selectedIndex = 0
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drops: [],
      sidebox: true,
      gallery: { images: [] },
      emojis: [],
      scaleico: [],
      infoico: [],
      elementsDefined: false,
      SourceArray: [],
      dropAction: "reorder",
      selectedIndex: 0
    };

    this.ropen = this.ropen.bind(this);
  }

  UNSAFE_componentWillMount() {

    this.checkrefcode()
    this.gallerrfun();
    this.getEmojis();
    this.infoGallery();
    this.getScaleimg();
    let SourceArray = [
      {
        id: "item1",
        type: "info",
        icon: "fa fa-info-circle",
        text: "Information Display"


      },
      {
        id: "item2",
        type: "input",
        icon: "fa fa-font",
        text: "Text Input"

      },
      // {
      //   id: "item3",
      //   type: "Dropdown",
      //   icon: "fa fa-caret-square-o-down",
      //   text: "Dropdown"


      // },
      {
        id: "item4",
        type: "gps",
        icon: "fa fa-map-marker",
        text: "GPS"


      },
      {
        id: "item5",
        type: "capture",
        icon: "fa fa-camera",
        text: "Image Tagging"


      },
      {
        id: "item6",
        type: "scale",
        icon: "fa fa-exchange",
        text: "Scale"


      },
      {
        id: "item7",
        type: "upload",
        icon: "fa fa-upload",
        text: "Upload"


      },
      {
        id: "item8",
        type: "barcode",
        icon: "fa fa-barcode",
        text: "Barcode"


      },
      {
        id: "item9",
        type: "choice",
        icon: "fa fa-check-square",
        text: "Choice Questions"


      }
    ]

    this.setState({
      SourceArray: SourceArray
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ drops: nextProps.olddrops })
  }

  /* Handles the validation of reference code. */
  checkrefcode() {
    this.state.drops = this.props.olddrops
    this.props.olddrops.map((p, i) => {
      let fieldprops = p;
      if (fieldprops.type !== "info" && fieldprops.type !== "gps") {
        if ((fieldprops.properties.refcode && fieldprops.properties.refcode === "") || !fieldprops.properties.refcode) {
          let type = ""
          if (fieldprops.type === "input") {
            type = "TXT"
          } else if (fieldprops.type === "upload") {
            type = "UPL"
          } else if (fieldprops.type === "choice") {
            type = "CHO"
          } else if (fieldprops.type === "scale") {
            type = "SCA"
          } else if (fieldprops.type === "capture") {
            type = "CAP  "
          } else if (fieldprops.type === "barcode") {
            type = "BAR"
          }
          this.generaterefcode('generate', type, this.state.drops, i);
        }
      } else {
        // drops.push(p)
      }
    })
    let drops = this.state.drops
    this.setState({
      drops: drops,
      elementsDefined: true
    }, () => {
      setTimeout(() => {
        this.autoSave()
      }, 3000);
    });
  }
  /* Handles the validation of reference code for cloned question. */
  addrefcodeForClonedQuestion(newDropArray) {
    this.state.drops = newDropArray
    newDropArray && newDropArray.map((p, i) => {
      let fieldprops = p;
      if (fieldprops.type !== "info" && fieldprops.type !== "gps") {
        if (fieldprops.properties.refcode && fieldprops.properties.refcode === "" || !fieldprops.properties.refcode) {
          let type = ""
          if (fieldprops.type === "input") {
            type = "TXT"
          } else if (fieldprops.type === "upload") {
            type = "UPL"
          } else if (fieldprops.type === "choice") {
            type = "CHO"
          } else if (fieldprops.type === "scale") {
            type = "SCA"
          } else if (fieldprops.type === "capture") {
            type = "CAP  "
          } else if (fieldprops.type === "barcode") {
            type = "BAR"
          }
          this.generaterefcode('generate', type, this.state.drops, i);
        }
      } else {
        // drops.push(p)
      }
    })
    let drops = this.state.drops
    this.setState({
      drops: drops,
      elementsDefined: true
    }, () => {
      setTimeout(() => {
        this.autoSave()
      }, 3000);
    });
  }

  /* Handles the api to generate the reference code. */
  async generaterefcode(check, type, fieldprops, i) {
    let refcode = ""
    let url = "refcode/generate?type=" + type + "&survey_refcode=" + this.props.refcode
    api2
      .get(url)
      .then(resp => {
        if (resp.status === 200) {
          refcode = resp.data.message;
          if (check === 'generate') {
            this.state.drops[i].properties.refcode = refcode
            //  return fieldprops
            this.saverefcode(refcode, 'generate');
          } else {
          }
        } else {
          // return fieldprops
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  /* Handles the api to save the reference code. */
  async saverefcode(refcode, check) {
    api2
      .get("refcode/save?refcode=" + refcode)
      .then(resp => {
        if (resp.status === 200) {
          if (check === 'generate') {
            // this.updateprojectrefcode(refcode)
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }


  /* Handles the api to load the common images from the gallery. */
  gallerrfun = () => {
    let self = this;
    api2
      .get("v1/gallery/images/common")
      .then(resp => {
        self.setState({
          gallery: resp.data
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  };


  /* Handles the api to load the info images from the gallery. */
  infoGallery = () => {
    let self = this;
    api2
      .get("v1/gallery/images/info")
      .then(resp => {
        self.setState({
          infoico: resp.data.images
        });
      })
      .catch(error => {
        console.error(error);

        self.setState({
          response: true
        });
      });
  };


  /* Handles the api to load the scale images from the gallery. */
  getScaleimg = () => {
    let self = this;
    api2
      .get("v1/gallery/images/scale")
      .then(resp => {
        self.setState({
          scaleico: resp.data.images
        });
      })
      .catch(error => {
        console.error(error);

        self.setState({
          response: true
        });
      });
  };

  /* Handles the api to load the emojis from the gallery. */
  getEmojis = () => {
    let self = this;
    api2
      .get("v1/gallery/scale_images")
      .then(resp => {
        self.setState({
          emojis: resp.data.images
        });
      })
      .catch(error => {
        console.error(error);

        self.setState({
          response: true
        });
      });
  };


  /**
   * Handles the settings bar.
   *
   * @public
   * @param {e}
   * @param {status}
   * @param {i}
   *
   */
  ropen(e, status, i, index) {
    this.setState({ selectedIndex: index })
    // selectedIndex = index
    let selectedlanguage = this.props.selectedlanguage
    let languages_drop = this.props.languages_drop;
    let defaultdrop = this.props.defaultdrops
    let currentlanguage = this.props.dropcurrentlanguage
    let drops = this.state.drops;

    let fieldprops = this.props.defaultdrops[index]
    selectedlanguage.map((a, b) => {
      if (a.label !== 'English') {
        let defaultdrops = languages_drop[a.label].content[index]
        if (defaultdrops) {
          if (fieldprops && fieldprops.type === 'info') {
            if (this.safeTrim(defaultdrops.label) === "" && this.safeTrim(fieldprops.label) !== "") {

              defaultdrops.completed = 0;
            }
            else if (((defaultdrops.properties.info_text || '').trim() === "" && (fieldprops.properties.info_text || '').trim() !== "") ||
              (this.safeTrim(defaultdrops.properties.question) === "" && this.safeTrim(fieldprops.properties.question) !== "")) {

              defaultdrops.completed = 0;
            }
            else {
              defaultdrops.completed = 1;
            }
          }
          else if (this.safeTrim(fieldprops && fieldprops.type) === 'input') {
            if ((this.safeTrim(fieldprops.label) !== "" && this.safeTrim(defaultdrops.label) === "")) {

              defaultdrops.completed = 0;
            }
            else if ((this.safeTrim(defaultdrops.properties.question) === "" && this.safeTrim(fieldprops.properties.question) !== "")) {

              defaultdrops.completed = 0;
            }
            else {
              defaultdrops.completed = 1;
            }
          }
          else if (fieldprops && fieldprops.type === 'capture') {
            if ((this.safeTrim(defaultdrops.label) === "" && this.safeTrim(fieldprops.label) !== "")) {

              defaultdrops.completed = 0;
            }
            else if ((this.safeTrim(fieldprops.properties.question) !== "" && this.safeTrim(defaultdrops.properties.question) === "")) {

              defaultdrops.completed = 0;
            }
            else if ((fieldprops.properties.instruction_text && this.safeTrim(fieldprops.properties.instruction_text) !== "") &&
              defaultdrops.properties.instruction_text && this.safeTrim(defaultdrops.properties.instruction_text) === "") {
              defaultdrops.completed = 0;
            }
            else if ((fieldprops.properties.marker_instruction_text && this.safeTrim(fieldprops.properties.marker_instruction_text) !== "") &&
              defaultdrops.properties.marker_instruction_text && this.safeTrim(defaultdrops.properties.marker_instruction_text) === "") {
              defaultdrops.completed = 0;
            }
            else if ((fieldprops.properties.scale_text && this.safeTrim(fieldprops.properties.scale_text) !== "") &&
              defaultdrops.properties.scale_text && this.safeTrim(defaultdrops.properties.scale_text) === "") {
              defaultdrops.completed = 0;
            }
            else {
              defaultdrops.completed = 1;

            }
          }
          else if (fieldprops && fieldprops.type === 'upload') {
            if ((this.safeTrim(fieldprops.label) !== "" && this.safeTrim(defaultdrops.label) === "")) {

              defaultdrops.completed = 0;
            }
            else if ((this.safeTrim(defaultdrops.properties.question) === "" && this.safeTrim(fieldprops.properties.question) !== "")) {

              defaultdrops.completed = 0;
            }
            else {
              defaultdrops.completed = 1;
            }
          }
          else if (fieldprops && fieldprops.type === 'choice') {
            if ((this.safeTrim(fieldprops.label) !== "" && this.safeTrim(defaultdrops.label) === "")) {

              defaultdrops.completed = 0;
            }
            else if ((this.safeTrim(defaultdrops.properties.question) === "" && this.safeTrim(fieldprops.properties.question) !== "")) {

              defaultdrops.completed = 0;
            }
            else if (!fieldprops.properties.multilevel && !defaultdrops.properties.multilevel) {
              defaultdrops.completed = 1;
            }
            else if (fieldprops.properties.multilevel === 1) {
              let completed = 1;
              if (fieldprops.properties.options) {
                fieldprops.properties.options.map((x, y) => {
                  if (this.safeTrim(x.label) !== "" && (defaultdrops.properties.options && defaultdrops.properties.options[y] && this.safeTrim(defaultdrops.properties.options[y].label) === "")) {
                    completed = 0;
                  }
                  if (x.sublabel) {
                    x.sublabel.map((a, b) => {
                      if (this.safeTrim(a.sublabel) !== "" && defaultdrops.properties.options && defaultdrops.properties.options[y] &&
                        defaultdrops.properties.options[y].sublabel && defaultdrops.properties.options[y].sublabel[b] && this.safeTrim(defaultdrops.properties.options[y].sublabel[b].sublabel) === "") {
                        completed = 0;
                      }
                    })
                  }
                })
              }
              defaultdrops.completed = completed;
            }
            else if (fieldprops.properties.multilevel === 0 || fieldprops.properties) {
              if (fieldprops.properties.options) {
                fieldprops.properties.options.map((x, y) => {
                  if (this.safeTrim(x.label) !== "" && (this.safeTrim(defaultdrops.properties.options[y].label) === "")) {
                    defaultdrops.completed = 0;
                  }
                  else {
                    defaultdrops.completed = 1;
                  }
                })
              }
            }
          }
          else if (fieldprops && fieldprops.type === 'gps') {
            if (fieldprops.label !== "" && defaultdrops.label === "") {

              defaultdrops.completed = 0;
            }
            else if ((this.safeTrim(defaultdrops.properties.question) === "" && this.safeTrim(fieldprops.properties.question) !== "")) {

              defaultdrops.completed = 0;
            }
            else {
              defaultdrops.completed = 1;
            }
          }
          else if (fieldprops && fieldprops.type === 'scale') {
            if (defaultdrops.properties.question) {
              if ((this.safeTrim(fieldprops.label) === "" && this.safeTrim(defaultdrops.label) !== "")) {

                defaultdrops.completed = 0;
              }
              else if ((this.safeTrim(defaultdrops.properties.question) !== "" && this.safeTrim(fieldprops.properties.question) === "")) {

                defaultdrops.completed = 0;
              }
              else if (fieldprops.properties.scale_type == "scale" && this.safeTrim(fieldprops.properties.end_text) !== "" && this.safeTrim(defaultdrops.properties.end_text) === "") {
                defaultdrops.completed = 0;
              }
              else if (fieldprops.properties.scale_type == "scale" && this.safeTrim(fieldprops.properties.start_text) !== "" && this.safeTrim(defaultdrops.properties.start_text) === "") {
                defaultdrops.completed = 0;
              }
              else {
                defaultdrops.completed = 1;
              }
            }
          }
          else if (fieldprops && fieldprops.type === 'barcode') {
            if (this.safeTrim(fieldprops.label) !== "" && this.safeTrim(defaultdrops.label) === "") {

              defaultdrops.completed = 0;
            }
            if ((this.safeTrim(defaultdrops.properties.question) === "" && this.safeTrim(fieldprops.properties.question) !== "")) {

              defaultdrops.completed = 0;
            } else {
              defaultdrops.completed = 1;
            }
          }
        }
      }
    })

    if (this.state.drops.length <= 0) {
      i = 0;
    }

    for (let temp = 0; temp < drops.length; temp++) {
      if (drops[temp]) {
        drops[temp].rightStatus = false;
        if (currentlanguage.value !== "English" && defaultdrop[temp]) { defaultdrop[temp].rightStatus = false; }
        selectedlanguage.map((a, b) => {
          if (a.label !== 'English' && languages_drop[a.label].content[temp]) {
            languages_drop[a.label].content[temp].rightStatus = false;
          }
        })
      }
    }
    for (let temp = 0; temp < drops.length; temp++) {
      if (drops[temp].question_id == i) {
        i = temp;
        break;
      }
    }

    let self = this;
    setTimeout(function () {
      if (drops[i]) {
        drops[i].rightStatus = status;
        if (currentlanguage.value !== "English" && defaultdrop[i]) { defaultdrop[i].rightStatus = status; }
        selectedlanguage.map((a, b) => {
          if (a.label !== 'English' && languages_drop[a.label].content[i]) {
            languages_drop[a.label].content[i].rightStatus = status;
          }
        })
      }
      self.setState({ drops }, _ => { self.props.rchange(e) });
    })

  }

  /**
   * Handles on deleting an element.
   *
   * @public
   * @param {e}
   */
  deleteDrops = (e) => {
    const currentdrops = this.state.drops;
    let newdata = currentdrops.filter(currentdrops => {
      return currentdrops && currentdrops.question_id !== e
    });

    let selectedlanguage = this.props.selectedlanguage
    let languages_drop = this.props.languages_drop;
    selectedlanguage.map((a, b) => {
      if (a.label !== 'English') {
        let drop = []
        languages_drop[a.label].content.map((x, y) => {


          if (e !== x.question_id) {
            drop.push(x)
          }
        })
        languages_drop[a.label].content = drop;

      }
    })


    this.setState({
      drops: newdata,
      selectedIndex: this.state.selectedIndex >= 1 ? this.state.selectedIndex - 1 : 0
    }, function () {

      this.props.deteldrops(this.state.drops);
    });

  }

  cloneDrop = (question_id, type) => {
    const index = this.state.drops.findIndex(drop => Number(drop.question_id) === Number(question_id)),
      newDrop = this.endDrag(type),
      newDropsArray = [...this.state.drops]
    newDrop['rightStatus'] = false
    newDrop.properties = {
      ...newDrop.properties,
      ...this.state.drops[index].properties,
      refcode: "",
      question: String(this.state.drops[index].properties.question).trim()
    }
    newDrop['question'] = String(this.state.drops[index].properties.question).trim()
    if (this.state.drops[index].group_number) { newDrop['group_number'] = Number(this.state.drops[index].group_number) }
    newDrop.question_id = Number([...this.state.drops].sort((a, b) => Number(b.question_id) - Number(a.question_id))[0].question_id) + 1

    let dropindex = newDropsArray.findIndex((element) => element.question_id === question_id);
    newDropsArray.splice(dropindex + 1, 0, cloneDeep(newDrop));
    this.setState({
      drops: [...newDropsArray]

    }, () => {
      this.addrefcodeForClonedQuestion(newDropsArray);
      this.props.ondraglick(newDropsArray, true);
      this.checkDroppedQuesitonHideRange()
    });


    const selectedlanguage = this.props.selectedlanguage,
      languages_drop = {
        ...this.props.languages_drop
      }
    selectedlanguage.forEach((a, b) => {
      if (a.label !== 'English') {
        const index = languages_drop[a.label].content.findIndex(content => {
          return Number(content.question_id) === Number(question_id)
        })
        const newDropLang = {
          ...languages_drop[a.label].content[index],
          label: newDrop.label,
          handler: newDrop.handler,
          question_id: newDrop.question_id
        }
        languages_drop[a.label].content.splice(index + 1, 0, cloneDeep(newDropLang));
      }
    })
    this.props.setDropsLang(languages_drop)
  }


  // cloneDrop = (question_id, type) => {
  //   const index = this.state.drops.findIndex(drop => Number(drop.question_id) === Number(question_id)),
  //     newDrop = this.endDrag(type),
  //     newDropsArray = [...this.state.drops]
  //   newDrop.properties = {
  //     ...newDrop.properties,
  //     ...this.state.drops[index].properties,
  //     refcode: "",
  //     question: "Copy of " + String(this.state.drops[index].properties.question).trim()
  //   }
  //   newDrop.question_id = Number([...this.state.drops].sort((a, b) => Number(b.question_id) - Number(a.question_id))[0].question_id) + 1

  //   let dropindex = newDropsArray.findIndex((element) => element.question_id === question_id);
  //   newDropsArray.splice(dropindex + 1, 0, newDrop);
  //   // newDropsArray.push(newDrop)
  //   this.setState({
  //     drops: [...newDropsArray]

  //   }, () => {
  //     this.checkrefcode(newDropsArray);
  //     this.props.ondraglick(newDropsArray, true);
  //   });


  //   const selectedlanguage = this.props.selectedlanguage,
  //     languages_drop = {
  //       ...this.props.languages_drop
  //     }
  //   selectedlanguage.forEach((a, b) => {
  //     if (a.label !== 'English') {
  //       const index = languages_drop[a.label].content.findIndex(content => {
  //         return Number(content.question_id) === Number(question_id)
  //       })
  //       const newDropLang = {
  //         ...languages_drop[a.label].content[index],
  //         handler: newDrop.handler,
  //         question_id: newDrop.question_id
  //       }
  //       languages_drop[a.label].content.push(newDropLang)
  //     }
  //   })
  //   this.props.setDropsLang(languages_drop)
  // }


  /**
   * Handles on updating the element.
   *
   * @public
   * @param {e}
   */
  updateattrib(lb, e) {
    let olddata = this.state.drops;
    var idx = olddata.findIndex((ele) => {
      return ele.vid === e;
    });
    olddata[idx].question = lb;
    this.setState({ olddata }, this.props.ondraglick(this.state.drops))
  }

  /**
   * Handles on swapping an element in an array.
   *
   * @public
   * @param {e}
   */
  upArrowFun = e => {
    for (let i = 0; i < this.state.drops.length; i++) {
      if (this.state.drops[i].question_id == e) {
        e = i;
        break;
      }
    }


    var newarray = this.state.drops.slice();

    if (e != 0) {
      let temp = newarray[e - 1];
      newarray[e - 1] = newarray[e];
      newarray[e] = temp;
    }

    this.setState({ drops: newarray }, function () {
      this.props.deteldrops(this.state.drops, true);
    });

  };

  /**
   * Handles on swapping an element in an array.
   *
   * @public
   * @param {e}
   */

  downArrowFun = e => {

    for (let i = 0; i < this.state.drops.length; i++) {
      if (this.state.drops[i].question_id == e) {
        e = i;
        break;
      }
    }

    let newarray = this.state.drops.slice();
    let arrlen = newarray.length - 1;

    if (e != arrlen) {
      let temp = newarray[e + 1];
      newarray[e + 1] = newarray[e];
      newarray[e] = temp;
    }

    this.setState({ drops: newarray }, function () {
      this.props.deteldrops(this.state.drops, true);
    });
  };

  /* Unused function.Kept this code for reference. */
  // /**
  //  * handles on drop actions of the element.
  //  *
  //  * @public
  //  * @param {color}
  //  * @param {Shape}
  //  * @param {text}
  //  * @param {type}
  //  * @param {dropChange}
  //  * @param {vid}
  //  * @param {question}
  //  * @param {properties}
  //  * @param {question_id}
  //  * @param {label}
  //  */
  // handleDrop(color, shape, text, type, dropChange, handler, question, properties, question_id, label, conditions) {
  //   const { drops } = this.state;
  //   const nextDrops = [
  //     ...drops,
  //     {
  //       conditions,
  //       label,
  //       type,
  //       handler,
  //       properties
  //     }
  //   ];

  //   let qid = nextDrops[0] && nextDrops[0].question_id >= 0 ? nextDrops[0].question_id : -1;

  //   for (var i = 0; i < nextDrops.length; i++) {
  //     qid = nextDrops[i].question_id >= 0 && nextDrops[i].question_id > qid ? nextDrops[i].question_id : qid;
  //   }

  //   qid = qid + 1;
  //   nextDrops[nextDrops.length - 1].question_id = qid;
  //   this.props.updatelanguagedrop(nextDrops[nextDrops.length - 1]);
  //   this.state.drops.push(nextDrops[nextDrops.length - 1]);
  //   this.setState({
  //     drops: this.state.drops
  //   }, () => {
  //     this.checkrefcode()
  //   });
  //   //this.props.ondraglick(this.state.drops);
  //   //this.props.autosave()
  // }

  /* Unused function. */
  handleDropAppOnly(e) {
    return false;
  }

  /**
   * Handles open event of settings bar.
   *
   * @public
   */
  openevent() {

    this.setState({
      sidebox: (this.state.sidebox) ? false : true
    }, this.props.lchange);
  }


  /* Handles reordering of question. */

  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  /* Handles the validation of question type. */

  endDrag(type) {
    if (type === 0) {
      type = "info"
    } else if (type === 1) {
      type = "input"

    } else if (type === 2) {
      type = "gps"

    } else if (type === 3) {
      type = "capture"

    } else if (type === 4) {
      type = "scale"

    } else if (type === 5) {
      type = "upload"

    } else if (type === 6) {
      type = "barcode"

    } else if (type === 7) {
      type = "choice"
    }


    // const { onDrop } = props;
    // const { text } = props;
    // const { type } = props;
    // let qid = 0;
    let labelval = 0;




    if (this.state.drops.length > 0) {
      this.state.drops.map((drop, index) => {

        // if (drop.qid > qid) {
        //   qid = drop.question_id;
        // }
        if (type === drop.type) {
          labelval = labelval + 1
        }
      })
    }

    if (labelval === 0) {
      labelval = ""
    }
    // const  question  = "";
    // const { dropChange } = props;
    // const { question_id } = props;
    const handler = new Date().valueOf();
    const inputlabel = "Text Input " + labelval;
    const capturelabel = "Image Tagging " + labelval;
    const choicelabel = "Choice Questions " + labelval;
    const scalelabel = "Scale " + labelval;
    const barcodelabel = "Barcode " + labelval;
    const infolabel = "Information " + labelval;
    const uploadlabel = "Upload " + labelval;
    const gpslabel = "GPS " + labelval;
    const label = type === 'input' ? (inputlabel)
      : type === 'choice' ? (choicelabel)
        : type === 'capture' ? (capturelabel)
          : type === 'barcode' ? (barcodelabel)
            : type === 'scale' ? (scalelabel)
              : type === 'info' ? (infolabel)
                : type === 'upload' ? (uploadlabel)
                  : type === 'gps' ? (gpslabel)
                    : false
    const inputprops = {
      question: "Type a question",
      length: "20",
    }
    const captureprops = {
      question: "Type the message",
      marker_enabled: 1,
      scale_images: [],
      allow_gallery: 1
    }
    const choiceprops = {
      question: "Type a question",
      choice_type: "single",
      image_size: "small",
    }
    const barcodeprops = {
      question: "Type a question",
      validate: "identity"
    }
    const scaleprops = {
      question: "Type a question",
    }
    const gpsprops = {
      question: "Type a question",
      gps_stats: "hide"
    }
    const infoprops = {
      question: "Type Information",
      info_type: "none",
      info_text: ''
    }
    const uploadprops = {
      question: "Type a question",
      media_type: "image",
      allow_gallery: 1
    }
    const conditions = []
    const properties = type === 'input' ? (inputprops)
      : type === 'choice' ? (choiceprops)
        : type === 'capture' ? (captureprops)
          : type === 'barcode' ? (barcodeprops)
            : type === 'scale' ? (scaleprops)
              : type === 'info' ? (infoprops)
                : type === 'upload' ? (uploadprops)
                  : type === 'gps' ? (gpsprops)
                    : false

    return {

      conditions,
      label,
      type,
      handler,
      properties
    }
    // const { color } = monitor.getItem();
    // const { shape } = monitor.getDropResult();
    // onDrop(color, shape, text, type, dropChange, handler, question, properties, question_id, label, conditions);
  }

  /* Handles the event to update the properties of question. */
  autoSave() {
    this.props.autosave()
  }

  /* Validating the destination area while droppping the element. */
  onDragEnd = result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination && this.state.drops.length > 0) {
      return

    }
    else if ((source.droppableId === 'droppable') && (this.props.platformType != "App Only" && source.index === 3)) {

      return;
    }
    else if ((source.droppableId === 'droppable') && (this.props.platformType != "App Only" && source.index === 6)) {

      return;
    }

    else if ((source.droppableId === 'droppable') && (destination && destination.droppableId === 'droppable')) {

      return;
    }
    else if ((source.droppableId === 'droppable2') && (destination && destination.droppableId === 'droppable2')) {
      const items = this.reorder(
        this.state.drops,
        source.index,
        destination.index
      );


      this.setState({
        drops: items,
        dropAction: "reorder"
      }, () => {
        this.props.ondraglick(this.state.drops, true);
        this.props.updatelanguagedrop("reorder", destination.index, source.index);
        this.checkDroppedQuesitonHideRange();
      })
    }
    else if ((source.droppableId === 'droppable') && (destination && destination.droppableId === 'droppable2')) {
      this.setState({
        dropAction: "move"

      })

      const result = this.endDrag(source.index)
      let selectedDrop = result;
      let drops = this.state.drops;
      drops.splice(destination.index, 0, selectedDrop);

      this.setState({
        drops: drops
      }, () => {
        let nextDrops = this.state.drops
        let qid = nextDrops[0] && nextDrops[0].question_id >= 0 ? nextDrops[0].question_id : -1;

        for (var i = 0; i < nextDrops.length; i++) {
          qid = nextDrops[i].question_id >= 0 && nextDrops[i].question_id > qid ? nextDrops[i].question_id : qid;
        }

        qid = qid + 1;
        this.state.drops[destination.index].question_id = qid;
        let other_lan = cloneDeep(nextDrops);
        this.props.updatelanguagedrop("move", other_lan[destination.index], destination.index);
        //this.props.updatelanguagedrop("move",nextDrops[destination.index], destination.index);
        this.setState({
          drops: this.state.drops,
          dropAction: "reorder"

        }, () => {

          this.state.dropAction = "reorder";
          this.checkrefcode();
          this.props.ondraglick(this.state.drops, true);
          this.checkDroppedQuesitonHideRange();
          // this.props.autosave();
        })
      })
    }
    else if ((source.droppableId === 'droppable') && (this.state.drops.length === 0)) {
      this.setState({
        dropAction: "move"
      })
      const result = this.endDrag(source.index)
      let selectedDrop = result;
      this.state.drops.push(selectedDrop);
      this.state.drops[this.state.drops.length - 1].question_id = 0;
      let otherlang = cloneDeep(this.state.drops);
      this.props.updatelanguagedrop("move", otherlang[otherlang.length - 1], otherlang.length - 1);
      //this.props.updatelanguagedrop("move",this.state.drops[this.state.drops.length - 1], this.state.drops.length - 1);

      this.props.ondraglick(this.state.drops, true);
      // this.props.autosave();

    }
  };

  /** Check Dropped indexes are available in hide range conditions or not */
  checkDroppedQuesitonHideRange = () => {
    const tempArray = this.state.drops;
    const findHideRangeCondition = this.findHideRangeCondition();
    for (let i = 0; i < findHideRangeCondition.length; i++) {
      if (findHideRangeCondition[i].target.multifield && findHideRangeCondition[i].target.multifield.length > 0) {
        const multiField = findHideRangeCondition[i].target.multifield;

        const findFirstIndex = tempArray.findIndex(item => item.handler === multiField[0].value);
        const findLastIndex = tempArray.findIndex(item => item.handler === multiField[multiField.length - 1].value);

        const slice = tempArray.slice(findFirstIndex, findLastIndex + 1);
        const tempArr = slice.map((item) => { return { value: item.handler, label: item.label } });

        if (!this.arraysMatch(multiField, tempArr)) {
          const condition = this.props.oldconditions;
          const condition_index = condition.findIndex((item) => item.condtion_id == findHideRangeCondition[i].condtion_id)
          condition[condition_index]['target']['multifield'] = tempArr;
          this.autoSave();
        }
      }
    }
  };

  arraysMatch = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }
    return arr1.every((item, index) =>
      item.value === arr2[index].value && item.label === arr2[index].label
    );
  };


  findHideRangeCondition = () => {
    let findHideRangeTemp = [];
    this.props.oldconditions.map((condition) => {
      if (condition.target.uniqueID !== "" && condition.target.uniqueID == "hide_range") {
        findHideRangeTemp.push(condition)
      }
    })
    return findHideRangeTemp;
  };

  updateProperties = (e) => {
    this.setState({ drops: this.state.drops })
  }

  safeTrim(value) {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }

  render() {

    /* Unused code. */
    // let original = this.state.drops;

    // let filteredinput = original.filter(drop => {
    //   return drop && drop.type === "input";
    // });
    // let filteredcapture = original.filter(drop => {
    //   return drop && drop.type === "capture";
    // });
    // let filteredchoice = original.filter(drop => {
    //   return drop && drop.type === "choice";
    // });
    // let filteredbarcode = original.filter(drop => {
    //   return drop && drop.type === "barcode";
    // });
    // let filteredinfo = original.filter(drop => {
    //   return drop && drop.type === "info";
    // });
    // let filteredscale = original.filter(drop => {
    //   return drop && drop.type === "scale";
    // });
    // let filteredupload = original.filter(drop => {
    //   return drop && drop.type === "upload";
    // });
    // let filteredgps = original.filter(drop => {
    //   return drop && drop.type === "gps";
    // });
    // let inputlength = filteredinput.length + 1;
    // let capturelength = filteredcapture.length + 1;
    // let choicelength = filteredchoice.length + 1;
    // let barcodelength = filteredbarcode.length + 1;
    // let scalelength = filteredscale.length + 1;
    // let infolength = filteredinfo.length + 1;
    // let uploadlength = filteredupload.length + 1;
    // let gpslength = filteredupload.length + 1;
    let disable = this.props.dropcurrentlanguage.value !== "English" ? { 'pointer-events': 'none', opacity: 0.4, 'cursor': "none" } : {}

    const { drops, sidebox, dropAction, selectedIndex } = this.state;
    const boardval = (sidebox) ? "openbox" : 'closebox';


    return (
      <DragDropContext onDragEnd={this.onDragEnd}
      >
        <div id="board" className={boardval} >
          <div className="new-btn pointer" onClick={() => this.openevent()}>
            <div className='relativepos'>
              <p>Add Elements</p>
              <a href="#" className="bdr-ripple-ani-btn rippleff rotator"><i className="fa fa-plus"></i></a>
            </div>
          </div>

          <div id="board__sources">
            <div className="new-btn pointerhan" onClick={() => this.openevent()}>
              <div className='relativepos'>
                <p>Form Elements</p>
                <a href="#" className="bdr-ripple-ani-btn rippleff rotator"> <i className="fa fa-times pointer closebtn" /></a>
              </div>
            </div>
            <div className="list-froms-wrap"
              style={disable}
            >
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    draggable
                  >
                    {this.state.SourceArray.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <div
                              className="board__sources__source"
                              style={{
                                opacity: (item.id === "item3" || (item.id === "item5" && this.props.platformType != "App Only") || (item.id === "item8" && this.props.platformType != "App Only")) ? 0.3 : snapshot.isDragging ? 0.25 : 1,
                                cursor: (item.id === "item3" || (item.id === "item5" && this.props.platformType != "App Only") || (item.id === "item8" && this.props.platformType != "App Only")) ? "none" : ""
                              }}
                            >
                              <i className={item.icon} />
                              <p> {item.text} </p>
                            </div>

                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

            </div>
          </div>

          <div id="board__targets">
            <Droppable droppableId="droppable2">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {this.state.drops.map((drop, index) => (drops[index] ? (
                    <Draggable
                      isDragDisabled={this.props.dropcurrentlanguage.value != "English"}
                      key={drop.question_id}
                      draggableId={
                        dropAction === "reorder" ? drop.question_id.toString() : drop.question_id
                      }
                      index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <DropList
                            index={index}
                            key={index}
                            question_id={drop.question_id}
                            id={drop.id}
                            type={drop.type}
                            cloneDrop={this.cloneDrop}
                            deleteddrops={(e) => this.deleteDrops(e)}
                            dropstate={this.state.drops}
                            rightStatus={drop.rightStatus}
                            rightOpen={this.ropen}
                            labelprop={drop}
                            oldprop={drop}
                            oldconditions={this.props.oldconditions}
                            autosave={() => this.autoSave()}
                            upArrowFunc={e => this.upArrowFun(e)}
                            downArrowFunc={e => this.downArrowFun(e)}
                            refcode={this.props.refcode}
                            selectedlanguage={this.props.selectedlanguage}
                            changedroplanguage={this.props.changedroplanguage}
                            dropcurrentlanguage={this.props.dropcurrentlanguage}
                            defaultdrops={this.props.defaultdrops[index]}
                            languages_drop={this.props.languages_drop}
                            downArrowFuncLanguage={this.props.downArrowFuncLanguage}
                            upArrowFuncLanguage={this.props.upArrowFuncLanguage}
                            updateCondition={this.props.updateCondition}
                          />
                        </div>
                      )}
                    </Draggable>
                  ) : ""
                  ))}
                  <div style={{ height: 50 }}>
                  </div>
                  {provided.placeholder}
                </div>

              )}
            </Droppable>
            {this.state.drops && this.state.drops.length > 0 ?
              <div>
                <Card
                  index={selectedIndex}
                  color={this.state.drops[selectedIndex].color}
                  key={selectedIndex}
                  question_id={this.state.drops[selectedIndex].question_id}
                  id={this.state.drops[selectedIndex].id}
                  shape={this.state.drops[selectedIndex].shape}
                  text={this.state.drops[selectedIndex].label}
                  type={this.state.drops[selectedIndex].type}
                  attrib={() => this.updateattrib()}
                  deleteddrops={(e) => this.deleteDrops(e)}
                  dropstate={this.state.drops}
                  rightStatus={this.state.drops[selectedIndex].rightStatus}
                  rightOpen={this.ropen}
                  labelprop={this.state.drops[selectedIndex]}
                  oldprop={this.state.drops[selectedIndex]}
                  test={this.state.drops[selectedIndex].question}
                  oldconditions={this.props.oldconditions}
                  autosave={() => this.autoSave()}
                  upArrowFunc={e => this.upArrowFun(e)}
                  downArrowFunc={e => this.downArrowFun(e)}
                  scaleico={this.state.scaleico}
                  infoico={this.state.infoico}
                  emojis={this.state.emojis}
                  gallery={this.state.gallery.images}
                  refcode={this.props.refcode}
                  selectedlanguage={this.props.selectedlanguage}
                  changedroplanguage={this.props.changedroplanguage}
                  dropcurrentlanguage={this.props.dropcurrentlanguage}
                  defaultdrops={this.props.defaultdrops[selectedIndex]}
                  defaultdropsstatus={this.props.defaultdrops}
                  updatelanguageproperties={this.props.updatelanguageproperties}
                  languages_drop={this.props.languages_drop}
                  downArrowFuncLanguage={this.props.downArrowFuncLanguage}
                  upArrowFuncLanguage={this.props.upArrowFuncLanguage}
                  updateProperties={() => this.updateProperties()}
                  mappingProfileEnable={this.props.mappingProfileEnable}
                  selectedProfile={this.props.selectedProfile}
                  updateCondition={this.props.updateCondition}
                />
              </div> : ""}

          </div>

        </div>

      </DragDropContext>
    );
  }
}
export default Board;