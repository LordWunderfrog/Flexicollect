
/**
 * Card component
 * 
 * This component handles properties of survey elements.
 *
 *
 */
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Switch from "@material-ui/core/Switch";
import Textarea from "react-textarea-autosize";
import { StyledDropZone } from "react-drop-zone";
import "react-drop-zone/dist/styles.css";
import api2 from "helpers/api2";
import Select from "react-select";

import Confirm from "./Confirm";
import "@reach/dialog/styles.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ES6

import Snackbar from "components/Snackbar/Snackbar.jsx";
import ExpandArrow from "../../../../assets/img/expand-arrow.png";
import CollapseArrow from "../../../../assets/img/collapse-arrow.png";
import $ from 'jquery';
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
const style = {
    cursor: 'move',
}

let updateProperties = false;
let newupdatevalue;
let stripedHtml;
let evalue;
class Card extends React.Component {
    constructor(props) {
        super(props);
        this.contentEditable = React.createRef();
        this.quillRef = React.createRef();
        this.state = {
            selecteddrops: [],
            option: [{ id: 1, value: "option 1" }],
            open: false,
            mandatory: false,
            scale_popup: [],
            limitchar: false,
            fieldlabel: "",
            conditions: [],
            selectedFile: null,
            loaded: 0,
            productNumber: [],
            choiceOptionsList: [],
            questionGroup: [],
            fieldprops: {
                label: "",
                group_number: false,
                properties: {
                    question: "",
                    subheading: "",
                    refcode: "",
                    image_size: "",
                    productNumber: 0,
                    ReportTag: '',
                    currentQuestionGroup: '',
                    currentQuestionSubGroup1: { value: "", label: "" },
                    currentQuestionSubGroup2: { value: "", label: "" },
                    currentQuestionSubGroup3: { value: "", label: "" },
                    currentProductNumber: { value: "", label: "" },
                    selectedChoiceGroup: { value: "", label: "", group_id: null },
                }
            },
            updatedInfoVal: "",
            /* Snackbar props. */
            msgColor: "info",
            message: "",
            br: false,
            disabled: true,
            duplicateRefCode: false,
            oldrefcode: "",
            editrefcode: false,
            selectedlanguage: [],
            currentlanguage: { label: "English", value: 'English' },
            defaultdrops: [],
            incomplete: [],
            MandatoryStyle: false,
            show: [false, false, false, false],
            maximumAttribute: [],
            attributePerTask: [],
            repeatAttribute: [],
            allQuestionGroupArray: [],
            selectedGroupData: {},
            randomizedOptions: [
                { value: 1, label: 'Group 1' },
                { value: 2, label: 'Group 2' },
                { value: 3, label: 'Group 3' },
                { value: 4, label: 'Group 4' },
                { value: 5, label: 'Group 5' },
                { value: 6, label: 'Group 6' },
                { value: 7, label: 'Group 7' },
                { value: 8, label: 'Group 8' },
                { value: 9, label: 'Group 9' },
                { value: 10, label: 'Group 10' },
            ],
            pasteKeyPressed: false,
        };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    /** Rich text editor Toolbar control. */
    modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["clean"]
        ]
    };
    modules_minimal = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
        ]
    };

    /* Rich text editor formats control. */
    formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "background",
        "align",
        "left",
        "center",
        "right"
    ];

    /* Rich text editor submit function. */
    richText = value => {
        let match = false;
        this.setState({ updatedInfoVal: value })
        if (value.indexOf('<a href=') > -1) {
            let teststr = value.substring(value.indexOf('<a href='));
            let testArr = teststr.split('<a href="');
            for (var i = 0; i < testArr.length; i++) {
                if (testArr[i] !== "" && !(testArr[i].startsWith('http'))) {

                    this.showNotification('Please add the scheme http:// or https:// to the start of the link ' + testArr[i].substring(0, testArr[i].indexOf('"')), "danger");
                }
            }
        }
        if (match === false) {
            let fieldprops = this.state.fieldprops;
            fieldprops.properties.info_text = value;
            this.setState({ fieldprops });
        }
        //this.props.autosave()
    };

    /* Unused function.Kept this code for reference. */
    completedvaluecheck(fieldprops) {
        if (fieldprops.type === 'info') {
            if (fieldprops.label === "" || fieldprops.question === "") {

            }
            if ((fieldprops.properties.info_text === "" || fieldprops.properties.question === "")) {

            }
        }
        if (fieldprops.type === 'input') {
            if (fieldprops.label === "" || fieldprops.question === "") {

            }
            if (fieldprops.properties.question === "") {

            }
        }
        if (fieldprops.type === 'capture') {
            if (fieldprops.label === "" || fieldprops.question === "") {

            }
            if (fieldprops.properties.question === "") {

            }
        }


    }

    /* Handles the api to generate the reference code. */
    generaterefcode(check, type, fieldprops) {
        let refcode = ""
        let url = "refcode/generate?type=" + type + "&survey_refcode=" + this.props.refcode
        api2
            .get(url, { timeout: 300000 })
            .then(resp => {
                if (resp.status === 200) {
                    refcode = resp.data.message;
                    if (check === 'generate') {
                        fieldprops.properties.refcode = refcode
                        this.setState({
                            open: false,
                            conditions: this.props.oldconditions,
                            fieldprops
                        });
                        // this.saverefcode(refcode, 'generate');
                    } else {
                    }
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    /* Handles the api to save the reference code. */
    saverefcode(refcode, check) {
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

    /* Update state variable when we recieve new properties from parent. */
    componentWillReceiveProps(nextProps) {
        let rightStatus = nextProps.rightStatus ? nextProps.rightStatus : false;
        let Mandatory_style = false;
        if (rightStatus) {
            Mandatory_style = this.getMandatoryStyle(nextProps.labelprop)
        }
        let fieldprops = nextProps.labelprop;
        if (!fieldprops.properties.question_text && fieldprops.type !== "dropdown") {
            fieldprops.properties.question_text = "<p>" + fieldprops.properties.question + "</p>";
        }
        if (fieldprops.type === "choice") {
            if (!fieldprops.properties.display_type) {
                fieldprops.properties.display_type = "choice";
            }
        }
        fieldprops.question_id = nextProps.question_id;
        this.setState({
            fieldprops,
            open: rightStatus,
            MandatoryStyle: Mandatory_style,
            conditions: nextProps.oldconditions,
            selectedlanguage: nextProps.selectedlanguage,
            currentlanguage: nextProps.dropcurrentlanguage,
            defaultdrops: nextProps.defaultdrops
        });
    }

    /* One time functions which call after mounting. */
    componentDidMount() {
        const selectedProfile = this.props.selectedProfile && this.props.selectedProfile.value !== "";
        const mappingProfileEnable = this.props.mappingProfileEnable;
        if (mappingProfileEnable && selectedProfile) {
            this.fetchClientesQuestion(this.props.selectedProfile);
        }
        let fieldprops = this.props.oldprop;
        if (fieldprops.type === "choice") {
            if (fieldprops.properties.options) {
                fieldprops.properties.options.map((option) => {
                    if (!option.label_text) {
                        option.label_text = option.label
                    }
                    if (fieldprops.properties.multilevel) {
                        option.sublabel.map((sublabel) => {
                            if (!sublabel.sublabel_text) {
                                sublabel.sublabel_text = sublabel.sublabel;
                            }
                        });
                    }
                })
            }
        }
        fieldprops.question_id = this.props.question_id;
        this.setState({
            open: false,
            conditions: this.props.oldconditions,
            fieldprops,
            selectedlanguage: this.props.selectedlanguage,
            defaultdrops: this.props.defaultdrops,
            incomplete: this.props.selectedlanguage,
        }, () => {
            this.manageMaxdiffSettingOption()
        });
        // Add keydown event listener to Quill editor container
        if (this.quillRef.current && this.quillRef.current.editor) {
            this.quillRef.current.editor.container.addEventListener("paste", this.handleKeyDown);
        }
    };

    componentWillUnmount() {
        if (this.quillRef.current && this.quillRef.current.editor) {
            this.quillRef.current.editor.container.removeEventListener("paste", this.handleKeyDown);
        }
    };

    /* Fetch question of client's */
    fetchClientesQuestion = (selectedProfile) => {
        if (this.state.allQuestionGroupArray.length > 0) {
            this.setGroupQuestionAnswers(this.state.allQuestionGroupArray);
        } else {
            api2
                .get("questions_of_client?id=" + (selectedProfile.id || 1))
                .then(resp => {
                    if (resp.status === 200) {
                        this.setState({
                            allQuestionGroupArray: resp.data.Group,
                            productNumber: resp.data.Product
                        })
                        this.setGroupQuestionAnswers(resp.data.Group);
                    }
                })
                .catch(error => {
                    console.error(error);
                });
            api2
                .get("dropdown?client_id=" + (selectedProfile.id || 1))
                .then(resp => {
                    if (resp.status === 200) {
                        this.setState({
                            choiceOptionsList: resp.data.data
                        })
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    /* Handles the event to update the question props. */
    handleFocus = (e) => {
        let fieldprops = this.state.fieldprops;
        let fieldans = fieldprops.properties;
        if (fieldans.question === "Type a question" || fieldans.question === "Type the message" || fieldans.question === "Type Information") {
            fieldans.question = ""
        }
        if (fieldans.question_text === "<p>Type a question</p>" || fieldans.question_text === "<p>Type the message</p>" || fieldans.question_text === "<p>Type Information</p>") {
            fieldans.question_text = ""
        }

        this.setState({ fieldprops: fieldprops });

    }

    /* Handles the event to update the props. */
    handleBlur = (e) => {
        setTimeout(() => {
            if (!this.state.pasteKeyPressed) {
                if (e === "<p><br></p>" || e === "<p></p>" || e === "") {
                    let fieldprops = this.state.fieldprops;
                    let fieldans = fieldprops.properties;
                    let message = fieldprops.type === "info" ? "Type Information" : fieldprops.type === "capture" ? "Type the message" : "Type a question";
                    let message_text = fieldprops.type === "info" ? "<p>Type Information</p>" : fieldprops.type === "capture" ? "<p>Type the message</p>" : "<p>Type a question</p>";
                    fieldans.question = message
                    fieldans.question_text = message_text
                    this.setState({ fieldprops: fieldprops });
                }
                else {
                    let fieldprops = this.state.fieldprops;
                    let fieldans = fieldprops.properties;
                    fieldans.question = fieldans.question.replace(/&nbsp;/gi, '').trim()
                    fieldans.question_text = fieldans.question_text.replace(/&nbsp;/gi, '').trim()
                    this.setState({ fieldprops: fieldprops });
                }
            }
        }, 200)
    }
    handleOnBlurData = (e, index, subindex) => {
        let fieldprops = this.state.fieldprops;
        let fieldans = fieldprops.properties;
        if (e === "SUBHEADING") {
            fieldans.subheading = fieldans.subheading ? fieldans.subheading.replace(/&nbsp;/gi, '') : ""
            fieldans.subheading_text = fieldans.subheading_text ? fieldans.subheading_text.replace(/&nbsp;/gi, '') : ""
        }
        else if (e === "INFOCONTENT") {
            fieldans.info_text = fieldans.info_text ? fieldans.info_text.replace(/&nbsp;/gi, '') : ""
        }
        else if (e === "SUBLABLE") {
            fieldans.sublabel = fieldans.sublabel ? fieldans.sublabel.replace(/&nbsp;/gi, '') : ""
            fieldans.sublabel_text = fieldans.sublabel_text ? fieldans.sublabel_text.replace(/&nbsp;/gi, '') : ""
        }
        else if (e === "SUBLABLE") {
            fieldans.sublabel = fieldans.sublabel ? fieldans.sublabel.replace(/&nbsp;/gi, '') : ""
            fieldans.sublabel_text = fieldans.sublabel_text ? fieldans.sublabel_text.replace(/&nbsp;/gi, '') : ""
        }
        else if (e === "CHOICELABLE") {
            fieldans.options[index].label = fieldans.options[index].label ? fieldans.options[index].label.replace(/&nbsp;/gi, '') : ""
            fieldans.options[index].label_text = fieldans.options[index].label_text ? fieldans.options[index].label_text.replace(/&nbsp;/gi, '') : ""
        }
        else if (e === "CHOICESUBLABLE") {
            let sublabel = fieldans.options[index].sublabel[subindex].sublabel
            let sublabel_text = fieldans.options[index].sublabel[subindex].sublabel_text
            fieldans.options[index].sublabel[subindex].sublabel = sublabel ? sublabel.replace(/&nbsp;/gi, '') : ""
            fieldans.options[index].sublabel[subindex].sublabel_text = sublabel_text ? sublabel_text.replace(/&nbsp;/gi, '') : ""
        }

        this.setState({ fieldprops: fieldprops });
    }
    handlePaste = (e) => {
        e.preventDefault();
        let text = e.clipboardData.getData('text/plain');
        // You can perform further cleaning on the pasted text here if needed
        document.execCommand('insertText', false, text);
    }

    /* Handles the api to validate the ref code. */
    ValidateRefCode(e) {
        const refcode = e.target.value;
        let fieldprops = this.state.fieldprops;
        if (refcode.length < 1) {
            this.setState({
                editrefcode: false,
                duplicateRefCode: false
            })
            return;
        }
        this.setState({
            editrefcode: false,
        })
        api2
            .get("refcode/validate?refcode=" + refcode)
            .then(resp => {
                if (resp.status === 200) {
                    fieldprops.properties.refcode = refcode
                    this.setState({
                        duplicateRefCode: false,
                        fieldprops
                    })
                } else {
                    this.showNotification("RefCode Already Exists", "danger")
                    this.setState({
                        duplicateRefCode: true
                    })
                }
            })
            .catch(error => {
                // if(error.status === 400){
                this.showNotification("RefCode Already Exists", "danger")
                this.setState({
                    duplicateRefCode: true
                })
                // }
                console.error(error);
            });
    }

    /* Handles the api to update the ref code. */
    updaterefcode(e, i, index, key) {
        const evalu = e.target.value;
        let fieldprops = this.state.fieldprops;
        let oldrefcode = this.state.oldrefcode;
        if (!this.state.editrefcode) {
            oldrefcode = fieldprops.properties.refcode
        }
        fieldprops.properties.refcode = evalu
        this.setState({
            fieldprops,
            oldrefcode,
            editrefcode: true
        });
    }

    /* Handles and return the element to move one step downward. */
    downArrow() {
        return (
            this.state.currentlanguage.value === "English" && (
                <span>
                    <i
                        className="fas fa-arrow-down"
                        style={{ marginTop: "-30px", marginRight: "15px" }}
                        onClick={e => this.downArrowi()}
                    />
                </span>
            )
        )
    }

    /* Handles the events to update the props. */
    downArrowi(e) {
        this.props.downArrowFunc(this.props.question_id);
        this.props.downArrowFuncLanguage(this.props.question_id);
    }

    /* Handles and return the element to move one step upward. */
    upArrow() {

        return (
            this.state.currentlanguage.value === "English" && (
                <span>
                    <i
                        className="fas fa-arrow-up"
                        style={{ marginTop: "-30px", marginRight: "40px" }}
                        onClick={e => this.upArrowi()}
                    />
                </span>
            )
        )
    }

    /* Handles the events to update the props. */
    upArrowi(e) {
        this.props.upArrowFunc(this.props.question_id);
        this.props.upArrowFuncLanguage(this.props.question_id);
    }

    /* Formation of data in base64 format. */
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /* Handles the event to update the icons of scale element.    */
    scaleIcon(e, i, x, y) {
        const fieldprops = this.state.fieldprops;
        if (y === "table_image") {
            fieldprops.properties.table_content.table_value[i].image[x].image_id = e;
            // this.props.updatelanguagescaleicon()
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.table_content.table_value[i].image[x].image_id = e;
                    // a.content.push(drop)
                }
            })
        } else if (y === "scale_image") {
            fieldprops.properties.scale_content.forEach((image, index) => {
                image.image_id = e;
            });
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.scale_content.forEach((image, index) => {
                        image.image_id = e;
                    });
                }
            })
        } else if (y === "upload_icon") {
            fieldprops.properties.upload_icon = e;
            this.props.updatelanguageproperties(this.props.index, 'upload_icon', true, e)
        } else {
            fieldprops.properties.scale_content[i].image_id = e;
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.scale_content[i].image_id = e;
                }
            })
        }
        this.setState({ fieldprops }
            , this.props.autosave()
        );
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
            4000
        );
    };

    /* Handles the event to validate and update the file.    */
    onDrop(e, s, key, file) {

        this.getBase64(file).then(data => {
            const fieldprops = this.state.fieldprops;
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            if (e === "parenlabel_image") {
                fieldprops.properties.options[s].label_image = data;
                const fileTypeCut = file.type.split("/")[1];
                if (this.isImage(fileTypeCut)) {
                    this.setState({ fieldprops });
                }
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.options[s].label_image = data;
                    }
                })
            } else if (e === "sublabel_image") {
                fieldprops.properties.options[s].sublabel[key].label_image = data;
                const fileTypeCut = file.type.split("/")[1];
                if (this.isImage(fileTypeCut)) {
                    this.setState({ fieldprops });
                }
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.options[s].sublabel[key].label_image = data;
                    }
                })
            }
            else if (e === "info_image") {
                if (file.size < 2097152) {
                    fieldprops.properties.info_image = data;
                    const fileTypeCut = file.type.split("/")[1];
                    if (this.isImage(fileTypeCut)) {
                        //this.props.updatelanguageproperties(this.props.index, 'info_image', true, data)
                        this.setState({ fieldprops, br: false });
                    }
                    /** added by k - for persistant image */
                    selectedlanguage.forEach((a, b) => {
                        if (a.label !== 'English') {
                            languages_drop[a.label].content[this.props.index].properties.info_image = data;
                        }
                    })
                }
                else {
                    this.setState({ msgColor: 'warning', message: 'The image you selected is too large. Please upload an image that is less than 2 MB', br: true });
                }
            }
            else if (e === "info_video") {
                //nothing
            } else if (e === "t_options_image") {
                fieldprops.properties.table_content.table_options[s].image = data;
                const fileTypeCut = file.type.split("/")[1];
                if (this.isImage(fileTypeCut)) {
                    this.setState({ fieldprops });
                }
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.table_content.table_options[s].image = data;
                    }
                })
            } else if (e === "t_table_image") {

                fieldprops.properties.table_content.table_value[s].image[key] = data;
                const fileTypeCut = file.type.split("/")[1];
                if (this.isImage(fileTypeCut)) {
                    this.setState({ fieldprops });
                }
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.table_content.table_value[s].image[key] = data;
                    }
                })
            } else if (e === "sliding_ico") {
                fieldprops.properties.scale_content.slide_images[s].image = data;
                const fileTypeCut = file.type.split("/")[1];
                if (this.isImage(fileTypeCut)) {
                    this.setState({ fieldprops });
                }
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content.slide_images[s].image = data;
                    }
                })
            } else if (e === "binary_ico") {
                fieldprops.properties.scale_content[s].image = data;
                const fileTypeCut = file.type.split("/")[1];
                if (this.isImage(fileTypeCut)) {
                    this.setState({ fieldprops });
                }
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content[s].image = data;
                    }
                })
            } else {
                if (!fieldprops.properties[`${e}`]) {
                    fieldprops.properties[`${e}`] = {};
                }
                fieldprops.properties[`${e}`][`${s}`].image = data;
                const fileTypeCut = file.type.split("/")[1];
                if (this.isImage(fileTypeCut)) {
                    this.setState({ fieldprops });
                }
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        if (!languages_drop[a.label].content[this.props.index].properties[`${e}`]) {
                            languages_drop[a.label].content[this.props.index].properties[`${e}`] = {};
                        }
                        languages_drop[a.label].content[this.props.index].properties[`${e}`][`${s}`].image = data;
                    }
                })
            }
        });
        this.props.autosave()
    }

    /* Handles the validation of file format.     */
    isImage(filename) {
        switch (filename) {
            case "jpg":
            case "jpeg":
            case "gif":
            case "bmp":
            case "png":
                return true;
            default:
                return false
        }
    }

    /* Validate the delete button with conditions.    */
    handleReset = event => {

        let condtions = this.state.conditions;
        event.conditions.forEach((condition, index) => {
            condtions.map((original, i) => (original.condtion_id === condition.condtion_id ? (original.error = 1) : ""));
        });
        this.setState({
            condtions
        });
        this.props.deleteddrops(this.props.question_id);
    };

    /* Handles the event to update the element id to parent to handle delete.     */
    handleDelete(e) {
        this.props.deleteddrops(this.props.question_id);
    }

    /* Handle the event to update the element value.     */
    updatestatus(e) {
        const result = e.target.value;
        this.setState(
            {
                fieldlabel: result
            },
            this.testfun
        );
    }

    /* unused function kept for reference*/
    // updateprops=(e, i, index, key) =>{
    //     let novalu;
    //     let evalu;
    //     if(e.target){
    //         evalu = e.target.value;
    //     }
    //     else{
    //         evalu=e
    //     }
    //     var stripedHtml = evalu.replace(/<[^>]+>/g, '');
    //     novalu=evalu;
    //     updateProperties=true;
    //     localStorage.setItem('updateProperties',true);
    //     if(stripedHtml===""){
    //         evalu="";
    //     }
    //     if (i === "label") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.options[index][`${i}`] = stripedHtml;
    //         fieldprops.properties.options[index]['label_text'] = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         // let selectedlanguage = this.props.selectedlanguage
    //         // let languages_drop = this.props.languages_drop;
    //         // selectedlanguage.map((a,b)=>{    
    //         //     if(a.label !== 'English') {       
    //         //     languages_drop[a.label].content[this.props.index].properties.options[index][`${i}`] = ;
    //         //     }
    //         // })
    //     } else if (i === "childlabel") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.options[index].sublabel[key].sublabel = stripedHtml;
    //         fieldprops.properties.options[index].sublabel[key].sublabel_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         // let selectedlanguage = this.props.selectedlanguage
    //         // let languages_drop = this.props.languages_drop;
    //         // selectedlanguage.map((a,b)=>{    
    //         //     if(a.label !== 'English') {       
    //         //     languages_drop[a.label].content[this.props.index].properties.options[index].sublabel[key].sublabel = evalu;
    //         //     }
    //         // })
    //     } else if (i === "info_text") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.info_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         // let selectedlanguage = this.props.selectedlanguage
    //         // let languages_drop = this.props.languages_drop;
    //         // selectedlanguage.map((a,b)=>{    
    //         //     if(a.label !== 'English') {       
    //         //     languages_drop[a.label].content[this.props.index].properties.table_content.table_value[index].value = evalu;
    //         //     }
    //         // })
    //     }else if (i === "t_value") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.table_content.table_value[index].value = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //     }else if (i === "t_options") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.table_content.table_options[index].value = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         // let selectedlanguage = this.props.selectedlanguage
    //         // let languages_drop = this.props.languages_drop;
    //         // selectedlanguage.map((a,b)=>{    
    //         //     if(a.label !== 'English') {       
    //         //     languages_drop[a.label].content[this.props.index].properties.table_content.table_options[index].value = evalu;
    //         //     }
    //         // })
    //     } else if (i === "slider_from") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.scale_content.slide_range[0].from = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.scale_content.slide_range[0].from = evalu;
    //             }
    //         })
    //     } else if (i === "slider_to") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.scale_content.slide_range[0].to = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.scale_content.slide_range[0].to = evalu;
    //             }
    //         })
    //     } else if (i === "binary") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.scale_content[index].text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.scale_content[index].text = evalu;
    //             }
    //         })
    //     } else if (i === "addscale") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.scale_images = [];
    //         fieldprops.properties.scale_length = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.scale_images = [];
    //                 languages_drop[a.label].content[this.props.index].properties.scale_length = evalu;

    //                 // a.content.push(drop)
    //             }
    //         })
    //         for (let i = 0; i < evalu; i++) {
    //             fieldprops.properties.scale_images.push({ id: i, image: "" });
    //             this.setState({
    //                 fieldprops
    //             });
    //         }
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 for (let i = 0; i < evalu; i++) {
    //                     languages_drop[a.label].content[this.props.index].properties.scale_images.push({ id: i, image: "" });
    //                 }
    //             }
    //         })

    //     } 
    //     else if (i === "inputtypename") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.label = evalu;
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].label = evalu;
    //             }
    //         })
    //         this.setState({
    //             fieldprops
    //         });

    //     } 
    //     else if (i === "inputquestion") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.question_text = novalu;
    //         fieldprops.properties.question=stripedHtml;
    //         this.setState({
    //             fieldprops
    //         });
    //     } 
    //     else if (i === "inputsubheading") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.subheading = stripedHtml;
    //         fieldprops.properties.subheading_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //     } 
    //     else if (i === "inputsublabel") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.sublabel = stripedHtml;
    //         fieldprops.properties.sublabel_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });

    //     } else if (i === "start_text") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.start_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //     } else if (i === "end_text") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.end_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //     } else if (i === "marker_instruction_text") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.marker_instruction_text = evalu;
    //         fieldprops.properties.markertext_text = stripedHtml;
    //         this.setState({
    //             fieldprops
    //         });
    //     } else if (i === "instruction_text") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.instruction_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //     } else if (i === "scale_text") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.scale_text = evalu;
    //         this.setState({
    //             fieldprops
    //         });
    //     } else if (i === "addscalecnt") {

    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.scale_content = [];
    //         fieldprops.properties.scale_length = evalu;
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.scale_content = [];
    //                 languages_drop[a.label].content[this.props.index].properties.scale_length = evalu;
    //             }
    //         })
    //         if (evalu > 5) {
    //             fieldprops.properties.icon_type = "image";
    //             selectedlanguage.forEach((a, b) => {
    //                 if (a.label !== 'English') {
    //                     languages_drop[a.label].content[this.props.index].properties.icon_type = "image";
    //                 }
    //             })
    //         }
    //         this.setState({
    //             fieldprops
    //         });
    //         if (fieldprops.properties.icon_type === "emoji") {
    //             let selectedlanguage = this.props.selectedlanguage
    //             let languages_drop = this.props.languages_drop;

    //             if (evalu === "1") {
    //                 fieldprops.properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });
    //                     }
    //                 })
    //             } else if (evalu === "2") {
    //                 fieldprops.properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
    //                     }
    //                 })
    //             } else if (evalu === "3") {
    //                 fieldprops.properties.scale_content.push(
    //                     { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                     { id: 1, value: 2, image_id: this.props.emojis[2].image },
    //                     { id: 2, value: 3, image_id: this.props.emojis[4].image }
    //                 );
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push(
    //                             { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                             { id: 1, value: 2, image_id: this.props.emojis[2].image },
    //                             { id: 2, value: 3, image_id: this.props.emojis[4].image }
    //                         );
    //                     }
    //                 })
    //             } else if (evalu === "4") {
    //                 fieldprops.properties.scale_content.push(
    //                     { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                     { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                     { id: 2, value: 3, image_id: this.props.emojis[3].image },
    //                     { id: 3, value: 4, image_id: this.props.emojis[4].image }
    //                 );
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push(
    //                             { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                             { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                             { id: 2, value: 3, image_id: this.props.emojis[3].image },
    //                             { id: 3, value: 4, image_id: this.props.emojis[4].image }
    //                         );
    //                     }
    //                 })
    //             } else if (evalu === "5") {
    //                 fieldprops.properties.scale_content.push(
    //                     { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                     { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                     { id: 2, value: 3, image_id: this.props.emojis[2].image },
    //                     { id: 3, value: 4, image_id: this.props.emojis[3].image },
    //                     { id: 4, value: 5, image_id: this.props.emojis[4].image }
    //                 );
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push(
    //                             { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                             { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                             { id: 2, value: 3, image_id: this.props.emojis[2].image },
    //                             { id: 3, value: 4, image_id: this.props.emojis[3].image },
    //                             { id: 4, value: 5, image_id: this.props.emojis[4].image }
    //                         );
    //                     }
    //                 })
    //             }
    //             this.setState({
    //                 fieldprops
    //             });
    //         } else {
    //             for (let i = 0; i < evalu; i++) {
    //                 fieldprops.properties.scale_content.push({ id: i, value: i + 1, image_id: "" });
    //                 this.setState({
    //                     fieldprops
    //                 });
    //             }
    //             selectedlanguage.forEach((a, b) => {
    //                 if (a.label !== 'English') {
    //                     for (let i = 0; i < evalu; i++) {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: i, value: i + 1, image_id: "" });
    //                     }
    //                 }
    //             })
    //         }
    //     } else if (i === "table_value") {
    //         let fieldprops = this.state.fieldprops;
    //         let popup = this.state.scale_popup;
    //         popup.table_gallery = [];
    //         fieldprops.properties.table_content.value_length = evalu;
    //         fieldprops.properties.table_content.table_value = [];
    //         this.setState({
    //             fieldprops
    //         });
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.table_content.value_length = evalu;
    //                 languages_drop[a.label].content[this.props.index].properties.table_content.table_value = [];
    //             }
    //         })
    //         // let optionarr = [];
    //         // let optionarr1 = [];
    //         // if (fieldprops.properties.table_content.table_options) {
    //         //     optionarr = fieldprops.properties.table_content.table_options.map((opt, y) => {
    //         //         return { id: y, image_id: "" };
    //         //     });
    //         //     selectedlanguage.forEach((a, b) => {
    //         //         if (a.label !== 'English') {
    //         //             optionarr1 = languages_drop[a.label].content[this.props.index].properties.table_content.table_options.map((opt, y) => {
    //         //                 return { id: y, image_id: "" };
    //         //             });
    //         //             optionarr1 = []
    //         //         }
    //         //     })
    //         // }
    //         for (let i = 0; i < evalu; i++) {
    //             fieldprops.properties.table_content.table_value.push({ id: i, value: "", image: [] });
    //             popup.table_gallery.push([]);
    //             //fieldprops.properties.scale_content.table_value[i].image = []
    //             //fieldprops.properties.scale_content.table_value[i].image.push(optionarr)
    //             this.setState({
    //                 fieldprops,
    //                 popup
    //             });
    //         }
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 for (let i = 0; i < evalu; i++) {
    //                     languages_drop[a.label].content[this.props.index].properties.table_content.table_value.push({ id: i, value: "", image: [] });
    //                     popup.table_gallery.push([]);
    //                 }
    //             }
    //         })
    //         fieldprops.properties.table_content.table_value.forEach((val, i) => {
    //             val.image = [];
    //             if (fieldprops.properties.table_content.table_options) {
    //                 fieldprops.properties.table_content.table_options.forEach((opt, y) => {
    //                     val.image.push({ id: y, image_id: "" });
    //                 });
    //             }
    //         });
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {

    //                 languages_drop[a.label].content[this.props.index].properties.table_content.table_value.forEach((val, i) => {
    //                     val.image = [];
    //                     if (languages_drop[a.label].content[this.props.index].properties.table_content.table_options) {
    //                         languages_drop[a.label].content[this.props.index].properties.table_content.table_options.forEach((opt, y) => {
    //                             val.image.push({ id: y, image_id: "" });
    //                         });
    //                     }
    //                 });
    //             }
    //         })
    //         this.setState({
    //             fieldprops
    //         });
    //     } else if (i === "table_options") {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.table_content.options_length = evalu;
    //         fieldprops.properties.table_content.table_options = [];
    //         this.setState({
    //             fieldprops
    //         });
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.table_content.options_length = evalu;
    //                 languages_drop[a.label].content[this.props.index].properties.table_content.table_options = [];
    //             }
    //         })

    //         for (let i = 0; i < evalu; i++) {
    //             fieldprops.properties.table_content.table_options.push({ id: i, value: "" });
    //             this.setState({
    //                 fieldprops
    //             });
    //         }
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.table_content.options_length = evalu;
    //                 for (let i = 0; i < evalu; i++) {
    //                     languages_drop[a.label].content[this.props.index].properties.table_content.table_options.push({ id: i, value: "" });

    //                 }
    //             }
    //         })
    //         fieldprops.properties.table_content.table_value.forEach((val, i) => {
    //             val.image = [];
    //             fieldprops.properties.table_content.table_options.forEach((opt, y) => {
    //                 val.image.push({ id: y, image_id: "" });
    //             });
    //         });
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.table_content.table_value.forEach((val, i) => {
    //                     val.image = [];
    //                     languages_drop[a.label].content[this.props.index].properties.table_content.table_options.forEach((opt, y) => {
    //                         val.image.push({ id: y, image_id: "" });
    //                     });
    //                 });
    //             }
    //         })
    //         this.setState({
    //             fieldprops
    //         });
    //     } else if (i === "barcode_ids") {
    //         const oldprops = this.state.fieldprops.properties;
    //         let value = e.target.value;
    //         let arrayval = value.split(/[\n,]+/);
    //         oldprops[`${i}`] = arrayval;
    //         let selectedlanguage = this.props.selectedlanguage
    //         let languages_drop = this.props.languages_drop;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties[`${i}`] = arrayval;
    //             }
    //         })
    //         this.setState({ oldprops });
    //     } else if (i === "icon_type") {
    //         const oldprops = this.state.fieldprops.properties;
    //         let value = e.target.value;
    //         if (value === "emoji") {
    //             let selectedlanguage = this.props.selectedlanguage
    //             let languages_drop = this.props.languages_drop;
    //             if (!oldprops.scale_content) {
    //                 oldprops.scale_content = [];
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content = [];
    //                     }
    //                 })

    //             }
    //             if (oldprops.scale_content.length === 1) {
    //                 oldprops.scale_content = [];
    //                 oldprops.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content = [];
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });

    //                     }
    //                 })
    //             } else if (oldprops.scale_content.length === 2) {
    //                 oldprops.scale_content = [];
    //                 oldprops.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content = [];
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
    //                     }
    //                 })
    //             } else if (oldprops.scale_content.length === 3) {
    //                 oldprops.scale_content = [];
    //                 oldprops.scale_content.push(
    //                     { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                     { id: 1, value: 2, image_id: this.props.emojis[2].image },
    //                     { id: 2, value: 3, image_id: this.props.emojis[4].image }
    //                 );
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content = [];
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push(
    //                             { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                             { id: 1, value: 2, image_id: this.props.emojis[2].image },
    //                             { id: 2, value: 3, image_id: this.props.emojis[4].image }
    //                         );
    //                     }
    //                 })
    //             } else if (oldprops.scale_content.length === 4) {
    //                 oldprops.scale_content = [];
    //                 oldprops.scale_content.push(
    //                     { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                     { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                     { id: 2, value: 3, image_id: this.props.emojis[3].image },
    //                     { id: 3, value: 4, image_id: this.props.emojis[4].image }
    //                 );
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content = [];
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push(
    //                             { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                             { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                             { id: 2, value: 3, image_id: this.props.emojis[3].image },
    //                             { id: 3, value: 4, image_id: this.props.emojis[4].image }
    //                         );
    //                     }
    //                 })
    //             } else if (oldprops.scale_content.length === 5) {
    //                 oldprops.scale_content = [];
    //                 oldprops.scale_content.push(
    //                     { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                     { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                     { id: 2, value: 3, image_id: this.props.emojis[2].image },
    //                     { id: 3, value: 4, image_id: this.props.emojis[3].image },
    //                     { id: 4, value: 5, image_id: this.props.emojis[4].image }
    //                 );
    //                 selectedlanguage.forEach((a, b) => {
    //                     if (a.label !== 'English') {
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content = [];
    //                         languages_drop[a.label].content[this.props.index].properties.scale_content.push(
    //                             { id: 0, value: 1, image_id: this.props.emojis[0].image },
    //                             { id: 1, value: 2, image_id: this.props.emojis[1].image },
    //                             { id: 2, value: 3, image_id: this.props.emojis[2].image },
    //                             { id: 3, value: 4, image_id: this.props.emojis[3].image },
    //                             { id: 4, value: 5, image_id: this.props.emojis[4].image }
    //                         );
    //                     }
    //                 })
    //             }
    //             oldprops[`${i}`] = value;
    //             selectedlanguage.forEach((a, b) => {
    //                 if (a.label !== 'English') {
    //                     languages_drop[a.label].content[this.props.index].properties[`${i}`] = value;
    //                 }
    //             })

    //         } else {
    //             oldprops[`${i}`] = value;
    //             oldprops.scale_content.forEach((empty, index) => {
    //                 empty.image_id = "";
    //             });
    //             let selectedlanguage = this.props.selectedlanguage
    //             let languages_drop = this.props.languages_drop;
    //             selectedlanguage.forEach((a, b) => {
    //                 if (a.label !== 'English') {
    //                     languages_drop[a.label].content[this.props.index].properties[`${i}`] = value;
    //                     languages_drop[a.label].content[this.props.index].properties.scale_content.forEach((empty, index) => {
    //                         empty.image_id = "";
    //                     });
    //                 }
    //             })
    //         }
    //         this.setState({ oldprops });
    //     }
    //      else {
    //         const oldprops = this.state.fieldprops.properties;
    //         let value = e.target.value;
    //         if (i === "minimum" || i === "maximum" || i === "addscale") value = parseInt(value);
    //         if (i === "info_type") {
    //             delete oldprops['info_image']
    //             delete oldprops['info_video']
    //             delete oldprops['info_audio']
    //             oldprops[`${i}`] = value;
    //         } else {
    //             oldprops[`${i}`] = value;
    //             let selectedlanguage = this.props.selectedlanguage
    //             let languages_drop = this.props.languages_drop;
    //             selectedlanguage.forEach((a, b) => {
    //                 if (a.label !== 'English') {
    //                     languages_drop[a.label].content[this.props.index].properties[`${i}`] = value;
    //                     //  languages_drop[a.label].content[this.props.index].properties[`${i}`] ? languages_drop[a.label].content[this.props.index].properties[`${i}`] : ""
    //                 }
    //             })
    //             if (i === "gps_stats" && value === "hide") {
    //                 this.setState(
    //                     {
    //                         'mandatory': 0
    //                     },
    //                     () => {
    //                         this.updatepropschecked(0, 'mandatory');
    //                     }
    //                 );
    //             }

    //             //     if(this.state.currentlanguage.value !== "English"){
    //             //     this.props.updatelanguageproperties(this.props.index,`${i}`,false,value)
    //             // }
    //         }
    //         this.setState({ oldprops });
    //     }
    //     this.props.updateProperties(this.state.fieldprops)
    //     // this.props.autosave()
    // }

    /* Handle the event to update the props.    */
    updateprops = (e, i, index, key) => {
        let evalu;
        if (e.target) {
            evalu = e.target.value;
        }
        else {
            evalu = e
        }
        var stripedHtml = evalu.replace(/<[^>]+>/g, '');
        updateProperties = true;
        localStorage.setItem('updateProperties', true);
        if (stripedHtml === "") {
            evalu = "";
        }
        const oldprops = this.state.fieldprops.properties;
        let value = e.target.value;
        if (i === "minimum" || i === "maximum" || i === "addscale") value = parseInt(value);

        /** added by k - for persistant image */
        // if (i === "info_type") {
        //     delete oldprops['info_image']
        //     delete oldprops['info_video']
        //     delete oldprops['info_audio']
        //     oldprops[`${i}`] = value;
        // } else {
        oldprops[`${i}`] = value;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties[`${i}`] = value;
                //  languages_drop[a.label].content[this.props.index].properties[`${i}`] ? languages_drop[a.label].content[this.props.index].properties[`${i}`] : ""
            }
        })
        if (i === "gps_stats" && value === "hide") {
            this.setState(
                {
                    'mandatory': 0
                },
                () => {
                    this.updatepropschecked(0, 'mandatory');
                }
            );
        }

        if (this.state.currentlanguage.value !== "English") {
            this.props.updatelanguageproperties(this.props.index, `${i}`, false, value)
        }
        // }
        this.setState({ oldprops });
        // this.props.updateProperties(this.state.fieldprops)
        // this.props.autosave()
    }

    checkValue = (e) => {
        if (e.target) {
            evalue = e.target.value;
        }
        else {
            evalue = e
        }
        stripedHtml = evalue.replace(/<[^>]+>/g, '');
        newupdatevalue = evalue;
        updateProperties = true;
        localStorage.setItem('updateProperties', true);
        if (stripedHtml === "") {
            evalue = "";
        }
    }

    label = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.options[index][`${i}`] = stripedHtml;
        fieldprops.properties.options[index]['label_text'] = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
        // let selectedlanguage = this.props.selectedlanguage
        // let languages_drop = this.props.languages_drop;
        // selectedlanguage.map((a,b)=>{    
        //     if(a.label !== 'English') {       
        //     languages_drop[a.label].content[this.props.index].properties.options[index][`${i}`] = ;
        //     }
        // })
    }
    childlabel = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.options[index].sublabel[key].sublabel = stripedHtml;
        fieldprops.properties.options[index].sublabel[key].sublabel_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
        // let selectedlanguage = this.props.selectedlanguage
        // let languages_drop = this.props.languages_drop;
        // selectedlanguage.map((a,b)=>{    
        //     if(a.label !== 'English') {       
        //     languages_drop[a.label].content[this.props.index].properties.options[index].sublabel[key].sublabel = evalu;
        //     }
        // })
    }
    info_text = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.info_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
        // let selectedlanguage = this.props.selectedlanguage
        // let languages_drop = this.props.languages_drop;
        // selectedlanguage.map((a,b)=>{    
        //     if(a.label !== 'English') {       
        //     languages_drop[a.label].content[this.props.index].properties.table_content.table_value[index].value = evalu;
        //     }
        // })
    }
    t_value = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.table_content.table_value[index].value = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    t_options = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.table_content.table_options[index].value = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
        // let selectedlanguage = this.props.selectedlanguage
        // let languages_drop = this.props.languages_drop;
        // selectedlanguage.map((a,b)=>{    
        //     if(a.label !== 'English') {       
        //     languages_drop[a.label].content[this.props.index].properties.table_content.table_options[index].value = evalu;
        //     }
        // })
    }
    slider_from = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.scale_content.slide_range[0].from = evalue;
        this.setState({
            fieldprops
        });
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.scale_content.slide_range[0].from = evalue;
            }
        })
        // this.props.updateProperties(this.state.fieldprops)
    }
    slider_to = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.scale_content.slide_range[0].to = evalue;
        this.setState({
            fieldprops
        });
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.scale_content.slide_range[0].to = evalue;
            }
        })
        // this.props.updateProperties(this.state.fieldprops)
    }
    binary = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.scale_content[index].text = evalue;
        this.setState({
            fieldprops
        });
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.scale_content[index].text = evalue;
            }
        })
        // this.props.updateProperties(this.state.fieldprops)
    }
    addscale = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.scale_images = [];
        fieldprops.properties.scale_length = evalue;
        this.setState({
            fieldprops
        });
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.scale_images = [];
                languages_drop[a.label].content[this.props.index].properties.scale_length = evalue;

                // a.content.push(drop)
            }
        })
        for (let i = 0; i < evalue; i++) {
            fieldprops.properties.scale_images.push({ id: i, image: "" });
            this.setState({
                fieldprops
            });
        }
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                for (let i = 0; i < evalue; i++) {
                    languages_drop[a.label].content[this.props.index].properties.scale_images.push({ id: i, image: "" });
                }
            }
        })
        // this.props.updateProperties(this.state.fieldprops)
    }

    /* handle Attribute selection  */
    handleAttribute = (e, attributename) => {
        let fieldprops = this.state.fieldprops;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        /** Validation */
        if (this.validationOfMaxdiffSetting(e, fieldprops, attributename)) {
            fieldprops.properties[attributename] = e
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties[attributename] = e
                }
            })
            if (attributename == "Maximum_Attributes") {
                fieldprops.properties.Attribute_PerTask = ""
                fieldprops.properties.Repeate_Attribute = ""
            }
            else if (attributename == "Attribute_PerTask") {
                fieldprops.properties.Repeate_Attribute = ""
            }
            this.setState({
                fieldprops
            }, () => {
                // if (attributename == "Repeate_Attribute") {
                //     this.createMaxdiffSet()
                // }
                this.props.autosave()
            });
        }
    }
    validationOfMaxdiffSetting = (e, fieldprops, attributename) => {
        var maxAttribute = fieldprops.properties.Maximum_Attributes
        if (attributename == 'Attribute_PerTask') {
            if (!maxAttribute) {
                this.showNotification('Please select maxium attribute', "danger")
                return false
            }
            else if (maxAttribute.value % e.value !== 0) {
                this.showNotification('Attribute per task should be divisable by maxium attribute', "danger")
                return false
            }
            else {
                return true
            }
        }
        else if (attributename == 'Repeate_Attribute') {
            let attributepertask = fieldprops.properties.Attribute_PerTask
            if (!maxAttribute) {
                this.showNotification('Please select maxium attribute', "danger")
                return false
            }
            else if (!attributepertask) {
                this.showNotification('Please select attribute per task', "danger")
                return false
            }
            else {
                return true
            }
        }
        else {
            return true
        }
    }
    addAttributefun = (e, index) => {
        let fieldprops = this.state.fieldprops
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        let manual = fieldprops.properties.attribute_data ? fieldprops.properties.attribute_data.length : 0;


        if (fieldprops.properties.attribute_data) {
            let attribute = fieldprops.properties.attribute_data;
            let id = 0;
            for (let i = 0; i < attribute.length; i++) {
                if (attribute[i].id > id) {
                    id = attribute[i].id
                }
            }
            manual = id + 1;
        }

        if (!fieldprops.properties.attribute_data) {
            fieldprops.properties.attribute_data = []
        }
        else {
            fieldprops.properties.attribute_data.push({
                id: manual,
                label: "",
            })
        }


        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                let manual1 = languages_drop[a.label].content[this.props.index].properties.attribute_data ? languages_drop[a.label].content[this.props.index].properties.attribute_data.length : 0;
                if (languages_drop[a.label].content[this.props.index].properties.attribute_data) {
                    let attribute = languages_drop[a.label].content[this.props.index].properties.attribute_data;
                    let id = 0;
                    for (let i = 0; i < attribute.length; i++) {
                        if (attribute[i].id > id) {
                            id = attribute[i].id
                        }
                    }
                    manual1 = id + 1;
                }

                if (!languages_drop[a.label].content[this.props.index].properties.attribute_data) {
                    languages_drop[a.label].content[this.props.index].properties.attribute_data = []
                }
                languages_drop[a.label].content[this.props.index].properties.attribute_data.push({
                    id: manual1,
                    label: "",
                })
                languages_drop[a.label].content[this.props.index].properties.Maximum_Attributes = ""
                languages_drop[a.label].content[this.props.index].properties.Attribute_PerTask = ""
                languages_drop[a.label].content[this.props.index].properties.Repeate_Attribute = ""
            }
        })

        /**set initail set for setting and set state filed propes */
        fieldprops.properties.Maximum_Attributes = ""
        fieldprops.properties.Attribute_PerTask = ""
        fieldprops.properties.Repeate_Attribute = ""
        this.setState({
            fieldprops
        }, () => {
            this.props.autosave()
            this.manageMaxdiffSettingOption()
        });
    }
    manageMaxdiffSettingOption = () => {
        let tempfieldprops = this.state.fieldprops
        let lengthOfattribute = tempfieldprops.properties.attribute_data && tempfieldprops.properties.attribute_data.length || 0
        let temparray = Array.from(Array(lengthOfattribute).keys())
        let option = []
        temparray && temparray.map((obj) => {
            option.push({ label: obj + 1, value: obj + 1 })
        })
        this.setState({
            maximumAttribute: [{ label: "All", value: lengthOfattribute }, ...option],
            attributePerTask: option,
            repeatAttribute: option
        })
    }
    attributeChangeEvent = (e, index) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.attribute_data[index]['label'] = evalue;
        this.setState({
            fieldprops
        });
    }
    deleteAttribute = (index) => {
        let fieldprops = this.state.fieldprops;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;

        fieldprops.properties.attribute_data.splice(index, 1);
        fieldprops.properties.Maximum_Attributes = ""
        fieldprops.properties.Attribute_PerTask = ""
        fieldprops.properties.Repeate_Attribute = ""
        this.setState({
            fieldprops
        }, () => {
            this.manageMaxdiffSettingOption()
        });
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.attribute_data.splice(index, 1);
            }
        })
    }

    // createMaxdiffSet = () => {
    //     let fieldprops = this.state.fieldprops
    //     let max_attr = fieldprops.properties.Maximum_Attributes ? fieldprops.properties.Maximum_Attributes.value : 0
    //     let attr_per_task = fieldprops.properties.Attribute_PerTask ? fieldprops.properties.Attribute_PerTask.value : 0
    //     let repeat_attr = fieldprops.properties.Repeate_Attribute ? fieldprops.properties.Repeate_Attribute.value : 0
    //     const num_sets = (max_attr / attr_per_task) * repeat_attr;
    //     let tempAtt = fieldprops.properties.attribute_data

    //     let setOfAttribute = [];
    //     let occurrences = {}; // Track occurrences of each item
    //     const maxAttempts = 10000; // Maximum number of attempts to find suitable combinations

    //     // Loop through num_sets and generate subarrays
    //     for (let i = 0; i < num_sets; i++) {
    //         let subarray = [];

    //         // Loop until subarray is filled with unique attributes or until maximum attempts is reached
    //         let attempts = 0;
    //         while (subarray.length < attr_per_task && attempts < maxAttempts) {
    //             let randomIndex = Math.floor(Math.random() * max_attr);
    //             let randomItem = tempAtt[randomIndex];

    //             // Check if the random item has exceeded the desired count (repeat_attr) in the subarray
    //             if (
    //                 !subarray.includes(randomItem) &&
    //                 (!occurrences[randomIndex] || occurrences[randomIndex] < repeat_attr)
    //             ) {
    //                 subarray.push(randomItem);
    //                 // Update the occurrences for the selected random item
    //                 occurrences[randomIndex] = occurrences[randomIndex] ? occurrences[randomIndex] + 1 : 1;
    //             }
    //             attempts++;
    //         }

    //         // If subarray is not filled with unique attributes or maximum attempts is reached,
    //         // reset setOfAttribute and start over from the beginning
    //         if (subarray.length < attr_per_task || attempts === maxAttempts) {
    //             setOfAttribute = [];
    //             occurrences = {};
    //             i = -1;
    //         } else {
    //             subarray = subarray.map((element) => {
    //                 return { ...element, attributeSetID: i };
    //             });
    //             setOfAttribute.push(subarray);
    //         }
    //     }

    //     fieldprops.properties['attribute_Set'] = setOfAttribute
    //     this.setState({
    //         fieldprops
    //     })
    // }

    // Function to check if an attribute has already occurred in setOfAttribute
    hasOccured(setOfAttribute, att, repeat_attr) {
        let count = 0;
        for (let i = 0; i < setOfAttribute.length; i++) {
            if (setOfAttribute[i].includes(att)) {
                count++;
                if (count >= repeat_attr) {
                    return true;
                }
            }
        }
        return false;
    }

    /* handleQuestionGroupChange(name, event) {
        //this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.currentQuestionGroup = event
        this.setState({
            fieldprops
        });
    };*/

    inputtypename = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.label = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].label = evalue;
            }
        })
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)this.props.updateProperties(this.state.fieldprops)
    }

    /** Randomise some set of question based on group selected. 
     *  for example - if selected group 1 in four choice question then 
     *  that question will ask in random order 
     */
    RandomizeGroupName = (e) => {
        let fieldprops = this.state.fieldprops;
        fieldprops.group_number = e.value
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].group_number = evalue;
            }
        })
        this.setState({
            fieldprops
        },
            () => {
                this.props.autosave()
            });
    };

    getSelectedRandomizeGroupName = (value) => {
        if (value) {
            return this.state.randomizedOptions.find((item) => item.value == value)
        }
        else return null
    };

    onBlurName = (e, i, index, key) => {
        this.checkValue(e);
        /** code for change the question in condition of Hide/show if lable is change */
        if (this.state.conditions.length > 0) {
            this.state.conditions.map((conditionObj) => {
                if (conditionObj.target.do == 'hide_multiple' || conditionObj.target.do == 'show_multiple') {
                    let multifileddata = conditionObj.target.multifield
                    multifileddata && multifileddata.map((objMul) => {
                        if (this.state.fieldprops.handler == objMul.value) {
                            objMul["label"] = this.state.fieldprops.label
                        }
                    })
                }
            })
        }
    }

    /* Map profile dropdon selection */
    handleProductNumberChange = (e, i, index, key) => {
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.currentProductNumber = e
        this.setState({
            fieldprops
        });
        this.props.autosave()
    }

    /* Map profile choice dropdon selection */
    handleselectedChoiceGroup = (e, i, index, key) => {
        let fieldprops = this.state.fieldprops;
        const selectedChoiceGroupOptions = this.state.choiceOptionsList.length > 0 ?
            this.state.choiceOptionsList.find((item) => { return item.group_id == e.group_id }).options : [];
        const newOptions = selectedChoiceGroupOptions && selectedChoiceGroupOptions.length > 0 ?
            selectedChoiceGroupOptions.map((item, index) => {
                return {
                    id: index,
                    label: item.label,
                    label_text: `<p>${item.label}</p>`,
                    label_image: ""
                }
            }) : []
        fieldprops.properties.selectedChoiceGroup = e
        fieldprops.properties.options = newOptions
        this.setState({
            fieldprops
        });
        this.props.autosave()
    }

    handleSetQuestionGroupData = (e, index) => {
        let groupArray = this.state.allQuestionGroupArray.length > 0 && this.state.allQuestionGroupArray.find((item, id) => { return item.group.value == e.value });
        this.setState({
            selectedGroupData: groupArray
        });
    };

    handleQuestionGroupChange = (e, i, index, key) => {
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.currentQuestionGroup = e
        fieldprops.properties.currentQuestionSubGroup1 = { value: "", label: "" }
        fieldprops.properties.currentQuestionSubGroup2 = { value: "", label: "" }
        this.setState({
            fieldprops
        });
        // this.props.autosave();
        this.handleSetQuestionGroupData(e, index)
    }
    handleQuestionSubGroupChange = (e, i, index, key) => {
        let fieldprops = this.state.fieldprops;
        const val = { value: e.value, label: e.label }
        if (i == 'currentQuestionSubGroup1') {
            fieldprops.properties.currentQuestionSubGroup2 = { value: "", label: "" }
        }
        fieldprops.properties[i] = val
        this.setState({
            fieldprops
        });
        this.props.autosave()
    }

    inputtypeProductNum = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.productNumber = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].label = evalue;
            }
        })
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)this.props.updateProperties(this.state.fieldprops)
    }
    inputtypeReportTag = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.ReportTag = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].label = evalue;
            }
        })
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)this.props.updateProperties(this.state.fieldprops)
    }
    inputtypeOther = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.other = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].label = evalue;
            }
        })
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)this.props.updateProperties(this.state.fieldprops)
    }
    inputquestion = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.question_text = newupdatevalue;
        fieldprops.properties.question = stripedHtml;
        this.setState({
            fieldprops
        });
        if (this.state.pasteKeyPressed) {
            setTimeout(() => {
                this.setState({
                    pasteKeyPressed: false
                })
            }, 200)
        }
        // this.props.updateProperties(this.state.fieldprops)
    }
    handleKeyDown = (e) => {
        this.setState({ pasteKeyPressed: true })
    }
    inputsubheading = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.subheading = stripedHtml;
        fieldprops.properties.subheading_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    inputsublabel = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.sublabel = stripedHtml;
        fieldprops.properties.sublabel_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    start_text = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.start_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    end_text = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.end_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    marker_instruction_text = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.marker_instruction_text = evalue;
        fieldprops.properties.markertext_text = stripedHtml;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    instruction_text = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.instruction_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    scale_text = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.scale_text = evalue;
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    addscalecnt = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.scale_content = [];
        fieldprops.properties.scale_length = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.scale_content = [];
                languages_drop[a.label].content[this.props.index].properties.scale_length = evalue;
            }
        })
        if (evalue > 5) {
            fieldprops.properties.icon_type = "image";
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.icon_type = "image";
                }
            })
        }
        this.setState({
            fieldprops
        });
        if (fieldprops.properties.icon_type === "emoji") {
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;

            if (evalue === "1") {
                fieldprops.properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });
                    }
                })
            } else if (evalue === "2") {
                fieldprops.properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
                    }
                })
            } else if (evalue === "3") {
                fieldprops.properties.scale_content.push(
                    { id: 0, value: 1, image_id: this.props.emojis[0].image },
                    { id: 1, value: 2, image_id: this.props.emojis[2].image },
                    { id: 2, value: 3, image_id: this.props.emojis[4].image }
                );
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push(
                            { id: 0, value: 1, image_id: this.props.emojis[0].image },
                            { id: 1, value: 2, image_id: this.props.emojis[2].image },
                            { id: 2, value: 3, image_id: this.props.emojis[4].image }
                        );
                    }
                })
            } else if (evalue === "4") {
                fieldprops.properties.scale_content.push(
                    { id: 0, value: 1, image_id: this.props.emojis[0].image },
                    { id: 1, value: 2, image_id: this.props.emojis[1].image },
                    { id: 2, value: 3, image_id: this.props.emojis[3].image },
                    { id: 3, value: 4, image_id: this.props.emojis[4].image }
                );
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push(
                            { id: 0, value: 1, image_id: this.props.emojis[0].image },
                            { id: 1, value: 2, image_id: this.props.emojis[1].image },
                            { id: 2, value: 3, image_id: this.props.emojis[3].image },
                            { id: 3, value: 4, image_id: this.props.emojis[4].image }
                        );
                    }
                })
            } else if (evalue === "5") {
                fieldprops.properties.scale_content.push(
                    { id: 0, value: 1, image_id: this.props.emojis[0].image },
                    { id: 1, value: 2, image_id: this.props.emojis[1].image },
                    { id: 2, value: 3, image_id: this.props.emojis[2].image },
                    { id: 3, value: 4, image_id: this.props.emojis[3].image },
                    { id: 4, value: 5, image_id: this.props.emojis[4].image }
                );
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push(
                            { id: 0, value: 1, image_id: this.props.emojis[0].image },
                            { id: 1, value: 2, image_id: this.props.emojis[1].image },
                            { id: 2, value: 3, image_id: this.props.emojis[2].image },
                            { id: 3, value: 4, image_id: this.props.emojis[3].image },
                            { id: 4, value: 5, image_id: this.props.emojis[4].image }
                        );
                    }
                })
            }
            this.setState({
                fieldprops
            });
        } else {
            for (let i = 0; i < evalue; i++) {
                fieldprops.properties.scale_content.push({ id: i, value: i + 1, image_id: "" });
                this.setState({
                    fieldprops
                });
            }
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    for (let i = 0; i < evalue; i++) {
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: i, value: i + 1, image_id: "" });
                    }
                }
            })
        }
        // this.props.updateProperties(this.state.fieldprops)
    }
    table_value = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        let popup = this.state.scale_popup;
        popup.table_gallery = [];
        fieldprops.properties.table_content.value_length = evalue;
        fieldprops.properties.table_content.table_value = [];
        this.setState({
            fieldprops
        });
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.table_content.value_length = evalue;
                languages_drop[a.label].content[this.props.index].properties.table_content.table_value = [];
            }
        })
        // let optionarr = [];
        // let optionarr1 = [];
        // if (fieldprops.properties.table_content.table_options) {
        //     optionarr = fieldprops.properties.table_content.table_options.map((opt, y) => {
        //         return { id: y, image_id: "" };
        //     });
        //     selectedlanguage.forEach((a, b) => {
        //         if (a.label !== 'English') {
        //             optionarr1 = languages_drop[a.label].content[this.props.index].properties.table_content.table_options.map((opt, y) => {
        //                 return { id: y, image_id: "" };
        //             });
        //             optionarr1 = []
        //         }
        //     })
        // }
        for (let i = 0; i < evalue; i++) {
            fieldprops.properties.table_content.table_value.push({ id: i, value: "", image: [] });
            popup.table_gallery.push([]);
            //fieldprops.properties.scale_content.table_value[i].image = []
            //fieldprops.properties.scale_content.table_value[i].image.push(optionarr)
            this.setState({
                fieldprops,
                popup
            });
        }
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                for (let i = 0; i < evalue; i++) {
                    languages_drop[a.label].content[this.props.index].properties.table_content.table_value.push({ id: i, value: "", image: [] });
                    popup.table_gallery.push([]);
                }
            }
        })
        fieldprops.properties.table_content.table_value.forEach((val, i) => {
            val.image = [];
            if (fieldprops.properties.table_content.table_options) {
                fieldprops.properties.table_content.table_options.forEach((opt, y) => {
                    val.image.push({ id: y, image_id: "" });
                });
            }
        });
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {

                languages_drop[a.label].content[this.props.index].properties.table_content.table_value.forEach((val, i) => {
                    val.image = [];
                    if (languages_drop[a.label].content[this.props.index].properties.table_content.table_options) {
                        languages_drop[a.label].content[this.props.index].properties.table_content.table_options.forEach((opt, y) => {
                            val.image.push({ id: y, image_id: "" });
                        });
                    }
                });
            }
        })
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    table_options = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.table_content.options_length = evalue;
        fieldprops.properties.table_content.table_options = [];
        this.setState({
            fieldprops
        });
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.table_content.options_length = evalue;
                languages_drop[a.label].content[this.props.index].properties.table_content.table_options = [];
            }
        })

        for (let i = 0; i < evalue; i++) {
            fieldprops.properties.table_content.table_options.push({ id: i, value: "" });
            this.setState({
                fieldprops
            });
        }
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.table_content.options_length = evalue;
                for (let i = 0; i < evalue; i++) {
                    languages_drop[a.label].content[this.props.index].properties.table_content.table_options.push({ id: i, value: "" });

                }
            }
        })
        fieldprops.properties.table_content.table_value.forEach((val, i) => {
            val.image = [];
            fieldprops.properties.table_content.table_options.forEach((opt, y) => {
                val.image.push({ id: y, image_id: "" });
            });
        });
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.table_content.table_value.forEach((val, i) => {
                    val.image = [];
                    languages_drop[a.label].content[this.props.index].properties.table_content.table_options.forEach((opt, y) => {
                        val.image.push({ id: y, image_id: "" });
                    });
                });
            }
        })
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)
    }
    barcode_ids = (e, i, index, key) => {
        this.checkValue(e);
        const oldprops = this.state.fieldprops.properties;
        let value = e.target.value;
        let arrayval = value.split(/[\n,]+/);
        oldprops[`${i}`] = arrayval;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties[`${i}`] = arrayval;
            }
        })
        this.setState({ oldprops });
        // this.props.updateProperties(this.state.fieldprops)
    }
    icon_type = (e, i, index, key) => {
        this.checkValue(e);
        const oldprops = this.state.fieldprops.properties;
        let value = e.target.value;
        if (value === "emoji") {
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            if (!oldprops.scale_content) {
                oldprops.scale_content = [];
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content = [];
                    }
                })

            }
            if (oldprops.scale_content.length === 1) {
                oldprops.scale_content = [];
                oldprops.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content = [];
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image });

                    }
                })
            } else if (oldprops.scale_content.length === 2) {
                oldprops.scale_content = [];
                oldprops.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content = [];
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push({ id: 0, value: 1, image_id: this.props.emojis[0].image }, { id: 1, value: 2, image_id: this.props.emojis[4].image });
                    }
                })
            } else if (oldprops.scale_content.length === 3) {
                oldprops.scale_content = [];
                oldprops.scale_content.push(
                    { id: 0, value: 1, image_id: this.props.emojis[0].image },
                    { id: 1, value: 2, image_id: this.props.emojis[2].image },
                    { id: 2, value: 3, image_id: this.props.emojis[4].image }
                );
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content = [];
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push(
                            { id: 0, value: 1, image_id: this.props.emojis[0].image },
                            { id: 1, value: 2, image_id: this.props.emojis[2].image },
                            { id: 2, value: 3, image_id: this.props.emojis[4].image }
                        );
                    }
                })
            } else if (oldprops.scale_content.length === 4) {
                oldprops.scale_content = [];
                oldprops.scale_content.push(
                    { id: 0, value: 1, image_id: this.props.emojis[0].image },
                    { id: 1, value: 2, image_id: this.props.emojis[1].image },
                    { id: 2, value: 3, image_id: this.props.emojis[3].image },
                    { id: 3, value: 4, image_id: this.props.emojis[4].image }
                );
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content = [];
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push(
                            { id: 0, value: 1, image_id: this.props.emojis[0].image },
                            { id: 1, value: 2, image_id: this.props.emojis[1].image },
                            { id: 2, value: 3, image_id: this.props.emojis[3].image },
                            { id: 3, value: 4, image_id: this.props.emojis[4].image }
                        );
                    }
                })
            } else if (oldprops.scale_content.length === 5) {
                oldprops.scale_content = [];
                oldprops.scale_content.push(
                    { id: 0, value: 1, image_id: this.props.emojis[0].image },
                    { id: 1, value: 2, image_id: this.props.emojis[1].image },
                    { id: 2, value: 3, image_id: this.props.emojis[2].image },
                    { id: 3, value: 4, image_id: this.props.emojis[3].image },
                    { id: 4, value: 5, image_id: this.props.emojis[4].image }
                );
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content[this.props.index].properties.scale_content = [];
                        languages_drop[a.label].content[this.props.index].properties.scale_content.push(
                            { id: 0, value: 1, image_id: this.props.emojis[0].image },
                            { id: 1, value: 2, image_id: this.props.emojis[1].image },
                            { id: 2, value: 3, image_id: this.props.emojis[2].image },
                            { id: 3, value: 4, image_id: this.props.emojis[3].image },
                            { id: 4, value: 5, image_id: this.props.emojis[4].image }
                        );
                    }
                })
            }
            oldprops[`${i}`] = value;
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties[`${i}`] = value;
                }
            })

        } else {
            oldprops[`${i}`] = value;
            oldprops.scale_content.forEach((empty, index) => {
                empty.image_id = "";
            });
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties[`${i}`] = value;
                    languages_drop[a.label].content[this.props.index].properties.scale_content.forEach((empty, index) => {
                        empty.image_id = "";
                    });
                }
            })
        }
        this.setState({ oldprops });
        // this.props.updateProperties(this.state.fieldprops)
    }

    /* Handles gallery popup function.     */
    localGallery(i, y, x) {

        let scale_popup = this.state.scale_popup;
        if (y === "table_gallery") {

            if (!scale_popup[`${y}`]) {
                scale_popup[`${y}`] = [];

            }
            if (!scale_popup[`${y}`][i]) {

                scale_popup[`${y}`][i] = [];
            }
            scale_popup[`${y}`][i][x] = "enabled";
        } else {
            if (!scale_popup[`${y}`]) {
                scale_popup[`${y}`] = [];
            }
            scale_popup[`${y}`][i] = "enabled";
        }

        this.setState({
            scale_popup
        });
    }

    /* Handles the hide event of gallery.   */
    hideGallery(i, y, x) {
        let scale_popup = this.state.scale_popup;
        if (y === "table_gallery") {
            scale_popup[`${y}`][i][x] = "disabled";
        } else {
            scale_popup[`${y}`][i] = "disabled";
        }
        this.setState({
            scale_popup
        });
    }

    /* Handles the event to update the image size.   */
    imagesize_Change = event => {
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.image_size = event.target.value;
        this.setState({
            fieldprops
        }, this.props.autosave()
        );
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.image_size = event.target.value;
            }
        })
    }

    displayChange = event => {
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.display_type = event.target.value;
        fieldprops.properties.choice_type = "single";
        fieldprops.properties.image_size = "small";
        fieldprops.properties.other = 0;
        fieldprops.properties.multilevel = 0;
        fieldprops.properties.setlimit = 0;
        fieldprops.properties.noneofabove = 0;
        fieldprops.properties.random = 0;
        fieldprops.properties.setlimit_type = ""
        this.setState({
            fieldprops
        },
            () => {
                this.props.autosave();
                this.updatepropschecked(0, "other");
                this.updatepropschecked(0, "multilevel");
                this.updatepropschecked(0, "setlimit");
                this.updatepropschecked(0, "noneofabove");
            }
        );
        // this.setState(
        //     {
        //         "other": 0
        //     },
        //     () => {
        //         this.updatepropschecked(0, "other");
        //     }
        // );
        this.setState({
            fieldprops
        }, this.props.autosave()
        );
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.display_type = event.target.value;
                languages_drop[a.label].content[this.props.index].properties.image_size = "small";
            }
        })
    };

    /* Handles the event to update the value.   */
    radioChange = event => {

        let fieldprops = this.state.fieldprops;
        fieldprops.properties.choice_type = event.target.value;
        this.setState({
            fieldprops
        }, this.props.autosave()
        );
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.choice_type = event.target.value;
            }
        })
    };
    setLimitRadioChange = event => {
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.setlimit_type = event.target.value;
        fieldprops.properties.minlimit = 0
        fieldprops.properties.maxlimit = 0
        this.setState({
            fieldprops
        }, this.props.autosave()
        );
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.setlimit_type = event.target.value;
            }
        })
        if (event.target.value == 'noneofabove') {
            this.updatepropschecked(1, 'noneofabove')
        }
        else {
            this.updatepropschecked(0, 'noneofabove')
        }
    };
    setMinLimitOption = (e, i, index, key) => {
        this.checkValue(e);

        let optionlength = this.state.fieldprops.properties.options && this.state.fieldprops.properties.options.length
        if (optionlength > 0) {
            if (evalue < 0) {
                evalue = 0
            }
            else if (evalue > this.state.fieldprops.properties.maxlimit && this.state.fieldprops.properties.maxlimit != 0) {
                evalue = this.state.fieldprops.properties.maxlimit
            }
            else if (evalue > optionlength) {
                evalue = optionlength
            }
            else {
                evalue = (typeof evalue === 'string') ? Number(evalue) : evalue
            }
        }
        else {
            //if there is no option then value should be 0
            evalue = 0
        }

        let fieldprops = this.state.fieldprops;
        fieldprops.properties.minlimit = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.minlimit = evalue;
            }
        })
        this.setState({
            fieldprops
        });
    }
    setMaxLimitOption = (e, i, index, key) => {
        this.checkValue(e);
        let optionlength = this.state.fieldprops.properties.options && this.state.fieldprops.properties.options.length
        if (optionlength > 0) {
            if (evalue < 0) {
                evalue = 0
            }
            else if (evalue < this.state.fieldprops.properties.minlimit) {
                evalue = this.state.fieldprops.properties.minlimit
            }
            else if (evalue > optionlength) {
                evalue = optionlength
            }
            else {
                evalue = (typeof evalue === 'string') ? Number(evalue) : evalue
            }
        }
        else {
            //if there is no option then value should be 0
            evalue = 0
        }

        let fieldprops = this.state.fieldprops;
        fieldprops.properties.maxlimit = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].properties.maxlimit = evalue;
            }
        })

        this.setState({
            fieldprops
        });
    }

    /* Handles the event to update the value.   */
    radioFunction = name => event => {

        let evalue = event.target.value;
        let fieldprops = this.state.fieldprops;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        if (evalue === "sliding") {
            fieldprops.properties.scale_type = evalue;
            fieldprops.properties.scale_content = {
                slide_range: [{ from: "", to: "" }],
                slide_images: [{ id: 0, image: "" }, { id: 1, image: "" }, { id: 2, image: "" }]
            };
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.scale_type = evalue;
                    languages_drop[a.label].content[this.props.index].properties.scale_content = {
                        slide_range: [{ from: "", to: "" }],
                        slide_images: [{ id: 0, image: "" }, { id: 1, image: "" }, { id: 2, image: "" }]
                    };
                    // a.content.push(drop)
                }
            })
        } else if (evalue === "binary") {
            fieldprops.properties.scale_type = evalue;
            fieldprops.properties.scale_content = [{ id: 0, text: "", image: "" }, { id: 1, text: " ", image: "" }];
        } else if (evalue === "scale") {
            if (fieldprops.properties.grid_type) {

                delete fieldprops.properties.grid_type;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.grid_type
                    }
                })
            }
            if (fieldprops.properties.table_content) {
                delete fieldprops.properties.table_content;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.table_content
                    }
                })
            }
            if (fieldprops.properties.attribute_data) {

                delete fieldprops.properties.attribute_data;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.attribute_data
                    }
                })
            }
            if (fieldprops.properties.Maximum_Attributes) {

                delete fieldprops.properties.Maximum_Attributes;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.Maximum_Attributes
                    }
                })
            }
            if (fieldprops.properties.Attribute_PerTask) {

                delete fieldprops.properties.Attribute_PerTask;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.Attribute_PerTask
                    }
                })
            }
            if (fieldprops.properties.Repeate_Attribute) {

                delete fieldprops.properties.Repeate_Attribute;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.Repeate_Attribute
                    }
                })
            }
            fieldprops.properties.scale_type = evalue;
            fieldprops.properties.icon_type = "image";
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.scale_type = evalue;
                    languages_drop[a.label].content[this.props.index].properties.icon_type = "image";

                }
            })
        } else if (evalue === "table") {
            if (fieldprops.properties.start_text) {
                delete fieldprops.properties.start_text;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.start_text
                    }
                })
            }
            if (fieldprops.properties.end_text) {
                delete fieldprops.properties.end_text;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.end_text
                    }
                })
            }
            if (fieldprops.properties.scale_content) {
                delete fieldprops.properties.scale_content;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.scale_content
                    }
                })
            }
            if (fieldprops.properties.attribute_data) {

                delete fieldprops.properties.attribute_data;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.attribute_data
                    }
                })
            }
            if (fieldprops.properties.Maximum_Attributes) {

                delete fieldprops.properties.Maximum_Attributes;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.Maximum_Attributes
                    }
                })
            }
            if (fieldprops.properties.Attribute_PerTask) {

                delete fieldprops.properties.Attribute_PerTask;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.Attribute_PerTask
                    }
                })
            }
            if (fieldprops.properties.Repeate_Attribute) {

                delete fieldprops.properties.Repeate_Attribute;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.Repeate_Attribute
                    }
                })
            }
            fieldprops.properties.scale_type = evalue;
            fieldprops.properties.grid_type = "radio";
            fieldprops.properties.table_content = {};
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.scale_type = evalue;
                    languages_drop[a.label].content[this.props.index].properties.grid_type = "radio";
                    languages_drop[a.label].content[this.props.index].properties.table_content = {};

                }
            })
        } else if (evalue === "maxdiff") {
            if (fieldprops.properties.grid_type) {

                delete fieldprops.properties.grid_type;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.grid_type
                    }
                })
            }
            if (fieldprops.properties.table_content) {
                delete fieldprops.properties.table_content;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.table_content
                    }
                })
            }
            if (fieldprops.properties.start_text) {
                delete fieldprops.properties.start_text;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.start_text
                    }
                })
            }
            if (fieldprops.properties.end_text) {
                delete fieldprops.properties.end_text;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.end_text
                    }
                })
            }
            if (fieldprops.properties.scale_content) {
                delete fieldprops.properties.scale_content;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        delete languages_drop[a.label].content[this.props.index].properties.scale_content
                    }
                })
            }
            fieldprops.properties.scale_type = evalue;
            fieldprops.properties.attribute_data = [];
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.scale_type = evalue;
                    languages_drop[a.label].content[this.props.index].properties.attribute_data = [];

                }
            })
        }
        else {
            fieldprops.properties.scale_type = evalue;
            fieldprops.properties.scale_content = [];

            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.scale_type = evalue;
                    languages_drop[a.label].content[this.props.index].properties.scale_content = [];

                }
            })
        }
        this.setState({
            fieldprops
        }, this.props.autosave()
        );
    };

    /* Handles the callback function.   */
    testfun() {
        this.props.attrib(this.state.fieldlabel, this.props.vid);
    }

    /* Handles the callback function to update fieldprops.   */
    handleClick() {
        const newval = this.state.option.length + 1;
        this.setState({
            option: [...this.state.option, { id: newval, value: "option " + newval }]
        });
    }

    /* Handles the event to update the language.   */
    handlelanguageChange(name, event) {
        this.setState({
            currentlanguage: event,
            updatedInfoVal: ""
        }, () => { this.props.changedroplanguage(event.label) })
    };

    /*inputtypeProductNum = (e, i, index, key) => {
        this.checkValue(e);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.productNumber = evalue;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                languages_drop[a.label].content[this.props.index].label = evalue;
            }
        })
        this.setState({
            fieldprops
        });
        // this.props.updateProperties(this.state.fieldprops)this.props.updateProperties(this.state.fieldprops)
    }*/
    /*handleQuestionGroupChange(name, event) {
        this.setState({
            currentQuestionGroup: event,
            updatedInfoVal: ""
        }, () => { this.props.changedroplanguage(event.label) })


    };*/
    /* Handles the event to validate the value and return boolean value.   */
    // getMandatoryStyle(fieldprops) {
    //     let conditions = this.state.conditions;
    //     let style = false;
    //     if (conditions.length > 0) {
    //         conditions.forEach((condtion, index) => {
    //             if (condtion.target && condtion.target.do && (condtion.target.do === 'loop' || condtion.target.do === 'loop_set' || condtion.target.do === "loop_input")) {
    //                 if (condtion.source && condtion.source[0] && condtion.source[0].handler &&
    //                     condtion.target.multifield && condtion.target.multifield.length > 0) {
    //                     if (`condtion`.source[0].handler === fieldprops.handler) {
    //                         let ques_index = condtion.target.multifield.length - 1;
    //                         if (fieldprops.handler === (condtion.target.multifield[ques_index].value && condtion.target.multifield[ques_index].value)) {
    //                             style = true;
    //                         }
    //                     }
    //                 }
    //             }
    //         })
    //     }
    //     if (style) {
    //         return true;
    //     } else {
    //         return false;
    //     }

    // }
    getMandatoryStyle(fieldprops) {
        let conditions = this.state.conditions;
        let style = false;
        if (conditions.length > 0) {
            conditions.map((condtion, index) => {
                if (condtion.target && condtion.target.do && (condtion.target.do === 'loop' || condtion.target.do === 'loop_set' || condtion.target.do === "loop_input")) {
                    if (condtion.source && condtion.source[0] && condtion.source[0].handler &&
                        condtion.target.multifield && condtion.target.multifield.length > 0) {
                        if (condtion.source[0].handler === fieldprops.handler) {
                            let ques_index = condtion.target.multifield.length - 1;
                            if (fieldprops.handler === (condtion.target.multifield[ques_index].value && condtion.target.multifield[ques_index].value)) {
                                style = true;
                            }
                        }
                    }
                }
                return 0;
            })
        }
        if (style) {
            return true;
        } else {
            return false;
        }
    }

    /* Handles the open event of settings.   */
    handleClickOpen = e => {
        const { question_id } = this.props;
        let Mandatory_style = this.getMandatoryStyle(this.state.fieldprops)
        if (this.state.duplicateRefCode) {
            let fieldprops = this.state.fieldprops
            fieldprops.properties.refcode = this.state.oldrefcode

            this.setState({
                fieldprops: fieldprops,
                oldrefcode: "",
                open: true,
                disabled: true,
                duplicateRefCode: false,
                MandatoryStyle: Mandatory_style
            }, () => {
                this.props.rightOpen(e, true, question_id)
            }
            )
        } else {
            this.setState({
                open: true,
                disabled: true,
                MandatoryStyle: Mandatory_style
            }, () => {
                this.props.rightOpen(e, true, question_id, this.props.index)
            })
        }
    };

    /* Handles the close event of settings.   */
    handleClose = e => {
        if (localStorage.getItem('updateProperties')) {
            this.props.autosave()
            localStorage.removeItem('updateProperties')
        }
        const { question_id } = this.props;
        if (this.state.duplicateRefCode) {
            let fieldprops = this.state.fieldprops
            fieldprops.properties.refcode = this.state.oldrefcode
            this.setState({
                fieldprops: fieldprops,
                oldrefcode: "",
                open: false,
                disabled: true,
                duplicateRefCode: false,
                // currentlanguage: {label:'English',value:'English'},
            }, () => {
                this.props.rightOpen(e, false, question_id)
                if (this.state.currentlanguage.label !== 'English') {
                    this.props.changedroplanguage('English')
                }
            })
        } else {
            this.setState({
                open: false,
                disabled: true,
                //   currentlanguage: {label:'English',value:'English'},
            }, () => {
                this.props.rightOpen(e, false, question_id, this.props.index)
                if (this.state.currentlanguage.label !== 'English') {
                    this.props.changedroplanguage('English')
                }
            });
        }
    };
    handleChangetext = (html) => {
        this.setState({ name1: html })
    }

    /* Handles the event to manage the limitation of character.   */
    // handleChange = name => event => {
    //     let checkval;
    //     event.target.checked === true ? (checkval = 1) : (checkval = 0);
    //     let selectedlanguage = this.props.selectedlanguage
    //     let languages_drop = this.props.languages_drop;
    //     if (name === "limitchar" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops["properties"]["minimum"] = 0;
    //         fieldprops["properties"]["maximum"] = 100;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index]["properties"]["minimum"] = 0;
    //                 languages_drop[a.label].content[this.props.index]["properties"]["maximum"] = 100;
    //             }
    //         })
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "limitchar" && checkval === 0) {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops["properties"]["minimum"] = "";
    //         fieldprops["properties"]["maximum"] = "";
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index]["properties"]["minimum"] = "";
    //                 languages_drop[a.label].content[this.props.index]["properties"]["maximum"] = "";
    //             }
    //         })
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     if (name === "instruction_enabled" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "instruction_enabled" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     if (name === "barcode_enabled" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "barcode_enabled" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     if (name === "text_info" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         fieldprops.properties.font_style = "normal";
    //         fieldprops.properties.text_align = "left";
    //         fieldprops.properties.text_position = "top";
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 languages_drop[a.label].content[this.props.index].properties.font_style = "normal";
    //                 languages_drop[a.label].content[this.props.index].properties.text_align = "left";
    //                 languages_drop[a.label].content[this.props.index].properties.text_position = "top";
    //             }
    //         })
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "text_info" && checkval === 0) {
    //         let fieldprops = this.state.fieldprops;
    //         delete fieldprops.properties.font_style;
    //         delete fieldprops.properties.text_align;
    //         delete fieldprops.properties.text_position;
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 delete languages_drop[a.label].content[this.props.index].properties.font_style;
    //                 delete languages_drop[a.label].content[this.props.index].properties.text_align;
    //                 delete languages_drop[a.label].content[this.props.index].properties.text_position;
    //             }
    //         })
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     if (name === "marker_enabled" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "marker_enabled" && checkval === 0) {
    //         let fieldprops = this.state.fieldprops;
    //         if (fieldprops.properties.instruction_enabled) {
    //             fieldprops.properties.instruction_enabled = 0;
    //         }
    //         if (fieldprops.properties.instruction_text) {
    //             delete fieldprops.properties.instruction_text;
    //         }
    //         selectedlanguage.forEach((a, b) => {
    //             if (a.label !== 'English') {
    //                 if (languages_drop[a.label].content[this.props.index].properties.instruction_enabled) {
    //                     languages_drop[a.label].content[this.props.index].properties.instruction_enabled = 0;
    //                 }
    //                 if (languages_drop[a.label].content[this.props.index].properties.instruction_text) {
    //                     delete languages_drop[a.label].content[this.props.index].properties.instruction_text;
    //                 }
    //             }
    //         })
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     if (name === "scale_enabled" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "scale_enabled" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     if (name === "other" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "other" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     if (name === "allow_gallery" && checkval === 1) {
    //         let fieldprops = this.state.fieldprops;
    //         this.setState(
    //             {
    //                 [name]: checkval,
    //                 fieldprops
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "allow_gallery" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "mandatory" && checkval === 1) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "mandatory" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "noreturn" && checkval === 1) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "noreturn" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "multilevel" && checkval === 1) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "multilevel" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "random" && checkval === 0) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     } else if (name === "random" && checkval === 1) {
    //         this.setState(
    //             {
    //                 [name]: checkval
    //             },
    //             () => {
    //                 this.updatepropschecked(checkval, name);
    //             }
    //         );
    //     }
    //     this.props.autosave()
    // };
    limitchar = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        if (name === "limitchar" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            fieldprops["properties"]["minimum"] = 0;
            fieldprops["properties"]["maximum"] = 100;
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index]["properties"]["minimum"] = 0;
                    languages_drop[a.label].content[this.props.index]["properties"]["maximum"] = 100;
                }
            })
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
        else if (name === "limitchar" && checkval === 0) {
            let fieldprops = this.state.fieldprops;
            fieldprops["properties"]["minimum"] = "";
            fieldprops["properties"]["maximum"] = "";
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index]["properties"]["minimum"] = "";
                    languages_drop[a.label].content[this.props.index]["properties"]["maximum"] = "";
                }
            })
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }
    instruction_enabled = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "instruction_enabled" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "instruction_enabled" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    barcode_enabled = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "barcode_enabled" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "barcode_enabled" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    text_info = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;

        if (name === "text_info" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            fieldprops.properties.font_style = "normal";
            fieldprops.properties.text_align = "left";
            fieldprops.properties.text_position = "top";
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.font_style = "normal";
                    languages_drop[a.label].content[this.props.index].properties.text_align = "left";
                    languages_drop[a.label].content[this.props.index].properties.text_position = "top";
                }
            })
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "text_info" && checkval === 0) {
            let fieldprops = this.state.fieldprops;
            delete fieldprops.properties.font_style;
            delete fieldprops.properties.text_align;
            delete fieldprops.properties.text_position;
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    delete languages_drop[a.label].content[this.props.index].properties.font_style;
                    delete languages_drop[a.label].content[this.props.index].properties.text_align;
                    delete languages_drop[a.label].content[this.props.index].properties.text_position;
                }
            })
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    marker_enabled = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;

        if (name === "marker_enabled" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "marker_enabled" && checkval === 0) {
            let fieldprops = this.state.fieldprops;
            if (fieldprops.properties.instruction_enabled) {
                fieldprops.properties.instruction_enabled = 0;
            }
            if (fieldprops.properties.instruction_text) {
                delete fieldprops.properties.instruction_text;
            }
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    if (languages_drop[a.label].content[this.props.index].properties.instruction_enabled) {
                        languages_drop[a.label].content[this.props.index].properties.instruction_enabled = 0;
                    }
                    if (languages_drop[a.label].content[this.props.index].properties.instruction_text) {
                        delete languages_drop[a.label].content[this.props.index].properties.instruction_text;
                    }
                }
            })
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    scale_enabled = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "scale_enabled" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "scale_enabled" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    other = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "other" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "other" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    allow_gallery = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "allow_gallery" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            this.setState(
                {
                    [name]: checkval,
                    fieldprops
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "allow_gallery" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    mandatory = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "mandatory" && checkval === 1) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "mandatory" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    noreturn = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "noreturn" && checkval === 1) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "noreturn" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    setDatepickerOn = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);
        if (name === "datePickerOn" && checkval === 1) {
            let fieldprops = this.state.fieldprops;
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop
            fieldprops["properties"]["minimum"] = "";
            fieldprops["properties"]["maximum"] = "";
            fieldprops["properties"]["limitchar"] = 0;
            fieldprops["properties"]["content_type"] = "text";
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index]["properties"]["minimum"] = "";
                    languages_drop[a.label].content[this.props.index]["properties"]["maximum"] = "";
                    languages_drop[a.label].content[this.props.index]["properties"]["limitchar"] = 0;
                    languages_drop[a.label].content[this.props.index]["properties"]["content_type"] = "text"
                }
            })
        }
        this.setState(
            {
                [name]: checkval
            },
            () => {
                this.updatepropschecked(checkval, name);
            }
        );
    }

    multilevel = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "multilevel" && checkval === 1) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "multilevel" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    random = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);

        if (name === "random" && checkval === 0) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "random" && checkval === 1) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    };

    setlimit = name => event => {
        updateProperties = true;
        let checkval;
        event.target.checked === true ? (checkval = 1) : (checkval = 0);
        if (name === "setlimit" && checkval === 0) {
            let fieldprops = this.state.fieldprops
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    if (fieldprops) {
                        /** if set limit false then do all flag 0*/
                        fieldprops.properties.maxlimit = 0
                        fieldprops.properties.minlimit = 0
                        fieldprops.properties.noneofabove = 0
                        fieldprops.properties.setlimit_type = ""
                        this.updatepropschecked(0, 'noneofabove'); //clear non of above
                    }
                    this.updatepropschecked(checkval, name);
                }
            );
        } else if (name === "setlimit" && checkval === 1) {
            this.setState(
                {
                    [name]: checkval
                },
                () => {
                    this.updatepropschecked(checkval, name);
                }
            );
        }
    }

    /* Handles the event to update the props.   */
    updatepropschecked(e, i) {

        let oldprops = this.state.fieldprops.properties;
        let random = i === "random" ? e : oldprops.random ? oldprops.random : 0;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        if (i === 'random' && random === 1) {
            if (!oldprops['options']) {
                oldprops['options'] = [];
            }
            let other_opt = {};
            for (var j = 0; j < oldprops['options'].length; j++) {
                if (oldprops['options'][j].id === "other") {
                    other_opt = oldprops['options'][j];
                    oldprops['options'].splice(j, 1);
                    oldprops['options'].push(other_opt);
                    break;
                }
            }
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    if (!languages_drop[a.label].content[this.props.index].properties['options']) {
                        languages_drop[a.label].content[this.props.index].properties['options'] = [];
                    }
                    let other_lan_opt = {};
                    for (var k = 0; k < languages_drop[a.label].content[this.props.index].properties['options'].length; k++) {
                        if (languages_drop[a.label].content[this.props.index].properties['options'][k].id === "other") {
                            other_lan_opt = languages_drop[a.label].content[this.props.index].properties['options'][k];
                            languages_drop[a.label].content[this.props.index].properties['options'].splice(k, 1);
                            languages_drop[a.label].content[this.props.index].properties['options'].push(other_lan_opt);
                            break;
                        }
                    }
                }
            })
        }
        if (i === 'other') {
            if (oldprops.multilevel) {
                if (oldprops.multilevel === 0) {
                    if (e === 1) {
                        if (!oldprops.options) {
                            oldprops.options = []
                        }
                        oldprops.options.push({
                            id: 'other',
                            label: "others",
                            label_image: "",
                            label_text: '<p>others</p>'
                        })
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                if (!languages_drop[a.label].content[this.props.index].properties.options) {
                                    languages_drop[a.label].content[this.props.index].properties.options = []
                                }
                                languages_drop[a.label].content[this.props.index].properties.options.push({
                                    id: 'other',
                                    label: "others",
                                    label_image: "",
                                    label_text: '<p>others</p>'
                                })
                            }
                        })
                    }
                    else if (e === 0) {
                        let arr = oldprops.options;

                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j].id === 'other') {
                                arr.splice(j, 1);
                            }
                        }
                        oldprops.options = arr;
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                var arr1 = languages_drop[a.label].content[this.props.index].properties.options;
                                for (var j = 0; j < arr1.length; j++) {
                                    if (arr1[j].id === 'other') {
                                        arr1.splice(j, 1);
                                    }
                                }
                                languages_drop[a.label].content[this.props.index].properties.options = arr1;
                            }
                        })
                    }
                }
                else if (oldprops.multilevel === 1) {
                    if (e === 1) {
                        if (!oldprops.options) {
                            oldprops.options = []
                        }
                        oldprops.options.push({
                            id: 'other',
                            label: "others",
                            label_image: "",
                            label_text: '<p>others</p>',
                            sublabel: [{
                                id: 'other',
                                label_image: "",
                                sublabel: "others",
                                sublabel_text: '<p>others</p>'
                            }]
                        })
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                if (!languages_drop[a.label].content[this.props.index].properties.options) {
                                    languages_drop[a.label].content[this.props.index].properties.options = []
                                }
                                languages_drop[a.label].content[this.props.index].properties.options.push({
                                    id: 'other',
                                    label: "others",
                                    label_image: "",
                                    label_text: '<p>others</p>',
                                    sublabel: [{
                                        id: 'other',
                                        label_image: "",
                                        sublabel: "others",
                                        sublabel_text: '<p>others</p>'
                                    }]
                                })
                            }
                        })
                    }
                    else if (e === 0) {
                        let arr = oldprops.options;

                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j].id === 'other') {
                                arr.splice(j, 1);
                            }
                        }
                        oldprops.options = arr;
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                var arr1 = languages_drop[a.label].content[this.props.index].properties.options;
                                for (var j = 0; j < arr1.length; j++) {
                                    if (arr1[j].id === 'other') {
                                        arr1.splice(j, 1);
                                    }
                                }
                                languages_drop[a.label].content[this.props.index].properties.options = arr1;
                            }
                        })
                    }
                }
            }
            else {
                if (oldprops.choice_type === "single" || oldprops.choice_type === "multiple") {
                    if (e === 1) {
                        if (!oldprops.options) {
                            oldprops.options = []
                        }
                        oldprops.options.push({
                            id: 'other',
                            label: "others",
                            label_image: "",
                            label_text: '<p>others</p>',
                        })
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                if (!languages_drop[a.label].content[this.props.index].properties.options) {
                                    languages_drop[a.label].content[this.props.index].properties.options = []
                                }
                                languages_drop[a.label].content[this.props.index].properties.options.push({
                                    id: 'other',
                                    label: "others",
                                    label_image: "",
                                    label_text: '<p>others</p>',
                                })
                            }
                        })
                    }
                    else if (e === 0) {
                        let arr = oldprops.options;
                        if (arr) {
                            for (let j = 0; j < arr.length; j++) {
                                if (arr[j].id === 'other') {
                                    arr.splice(j, 1);
                                }
                            }

                            oldprops.options = arr;
                            selectedlanguage.forEach((a, b) => {
                                if (a.label !== 'English') {
                                    var arr1 = languages_drop[a.label].content[this.props.index].properties.options;
                                    for (var j = 0; j < arr1.length; j++) {
                                        if (arr1[j].id === 'other') {
                                            arr1.splice(j, 1);
                                        }
                                    }
                                    languages_drop[a.label].content[this.props.index].properties.options = arr1;
                                }
                            })
                        }
                    }
                }
            }
        }
        if (i === 'noneofabove') {
            if (oldprops.multilevel) {
                if (oldprops.multilevel === 0) {
                    if (e === 1) {
                        if (!oldprops.options) {
                            oldprops.options = []
                        }
                        oldprops.options.push({
                            id: 'noneofabove',
                            label: "none of above",
                            label_image: "",
                            label_text: '<p>none of above</p>'
                        })
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                if (!languages_drop[a.label].content[this.props.index].properties.options) {
                                    languages_drop[a.label].content[this.props.index].properties.options = []
                                }
                                languages_drop[a.label].content[this.props.index].properties.options.push({
                                    id: 'noneofabove',
                                    label: "none of above",
                                    label_image: "",
                                    label_text: '<p>none of above</p>'
                                })
                            }
                        })
                    }
                    else if (e === 0) {
                        let arr = oldprops.options;

                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j].id === 'noneofabove') {
                                arr.splice(j, 1);
                            }
                        }
                        oldprops.options = arr;
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                var arr1 = languages_drop[a.label].content[this.props.index].properties.options;
                                for (var j = 0; j < arr1.length; j++) {
                                    if (arr1[j].id === 'noneofabove') {
                                        arr1.splice(j, 1);
                                    }
                                }
                                languages_drop[a.label].content[this.props.index].properties.options = arr1;
                            }
                        })
                    }
                }
                else if (oldprops.multilevel === 1) {
                    if (e === 1) {
                        if (!oldprops.options) {
                            oldprops.options = []
                        }
                        oldprops.options.push({
                            id: 'noneofabove',
                            label: "none of above",
                            label_image: "",
                            label_text: '<p>none of above</p>',
                            sublabel: [{
                                id: 'noneofabove',
                                label_image: "",
                                sublabel: "none of above",
                                sublabel_text: '<p>none of above</p>'
                            }]
                        })
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                if (!languages_drop[a.label].content[this.props.index].properties.options) {
                                    languages_drop[a.label].content[this.props.index].properties.options = []
                                }
                                languages_drop[a.label].content[this.props.index].properties.options.push({
                                    id: 'noneofabove',
                                    label: "none of above",
                                    label_image: "",
                                    label_text: '<p>none of above</p>',
                                    sublabel: [{
                                        id: 'noneofabove',
                                        label_image: "",
                                        sublabel: "none of above",
                                        sublabel_text: '<p>none of above</p>'
                                    }]
                                })
                            }
                        })
                    }
                    else if (e === 0) {
                        let arr = oldprops.options;

                        for (let j = 0; j < arr.length; j++) {
                            if (arr[j].id === 'noneofabove') {
                                arr.splice(j, 1);
                            }
                        }
                        oldprops.options = arr;
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                var arr1 = languages_drop[a.label].content[this.props.index].properties.options;
                                for (var j = 0; j < arr1.length; j++) {
                                    if (arr1[j].id === 'noneofabove') {
                                        arr1.splice(j, 1);
                                    }
                                }
                                languages_drop[a.label].content[this.props.index].properties.options = arr1;
                            }
                        })
                    }
                }
            }
            else {
                if (oldprops.choice_type === "single" || oldprops.choice_type === "multiple") {
                    if (e === 1) {
                        if (!oldprops.options) {
                            oldprops.options = []
                        }
                        oldprops.options.push({
                            id: 'noneofabove',
                            label: "none of above",
                            label_image: "",
                            label_text: '<p>none of above</p>',
                        })
                        selectedlanguage.forEach((a, b) => {
                            if (a.label !== 'English') {
                                if (!languages_drop[a.label].content[this.props.index].properties.options) {
                                    languages_drop[a.label].content[this.props.index].properties.options = []
                                }
                                languages_drop[a.label].content[this.props.index].properties.options.push({
                                    id: 'noneofabove',
                                    label: "none of above",
                                    label_image: "",
                                    label_text: '<p>none of above</p>',
                                })
                            }
                        })
                    }
                    else if (e === 0) {
                        let arr = oldprops.options;
                        if (arr) {
                            for (let j = 0; j < arr.length; j++) {
                                if (arr[j].id === 'noneofabove') {
                                    arr.splice(j, 1);
                                }
                            }

                            oldprops.options = arr;
                            selectedlanguage.forEach((a, b) => {
                                if (a.label !== 'English') {
                                    var arr1 = languages_drop[a.label].content[this.props.index].properties.options;
                                    for (var j = 0; j < arr1.length; j++) {
                                        if (arr1[j].id === 'noneofabove') {
                                            arr1.splice(j, 1);
                                        }
                                    }
                                    languages_drop[a.label].content[this.props.index].properties.options = arr1;
                                }
                            })
                        }
                    }
                }
            }
        }
        if (i === 'multilevel' && e === 1) {
            oldprops[`${i}`] = e;
            oldprops[`${'image_size'}`] = 'small';
            this.props.updatelanguageproperties(this.props.index, `${i}`, true, e);
        } else if (i === 'multilevel' && e === 0) {
            oldprops[`${i}`] = e;
            if (oldprops.options && oldprops.options.length > 0) {
                oldprops.options.forEach(sub => {
                    if (sub.sublabel) {
                        delete sub.sublabel
                        delete sub.sublabel_text
                    }
                })
            }

            this.props.updatelanguageproperties(this.props.index, `${i}`, true, e);
        } else {
            oldprops[`${i}`] = e;
            this.props.updatelanguageproperties(this.props.index, `${i}`, true, e)
        }
        this.setState({ oldprops });
    }


    /* Handles the function to add new element.   */
    addfun(e, index) {
        const fieldprops = this.state.fieldprops;

        if (e === "suboptions") {
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            let manual = fieldprops.properties.options[index].sublabel ? fieldprops.properties.options[index].sublabel.length : 0;
            if (fieldprops.properties.options[index].sublabel) {
                let sublabel = fieldprops.properties.options[index].sublabel;
                let id = 0;
                for (var i = 0; i < sublabel.length; i++) {
                    if (sublabel[i].id > id) {
                        id = sublabel[i].id
                    }
                }
                manual = id + 1;
            }
            if (!fieldprops.properties.options[index].sublabel || !(fieldprops.properties.options[index].sublabel instanceof Array)) {
                fieldprops.properties.options[index].sublabel = [];
            }
            fieldprops.properties.options[index].sublabel.push({ id: manual, sublabel: "", label_image: "" });
            this.setState({ fieldprops });
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    let manual1 = languages_drop[a.label].content[this.props.index].properties.options[index].sublabel ? languages_drop[a.label].content[this.props.index].properties.options[index].sublabel.length : 0;
                    if (languages_drop[a.label].content[this.props.index].properties.options[index].sublabel) {
                        let sublabel = languages_drop[a.label].content[this.props.index].properties.options[index].sublabel;
                        let id = 0;
                        for (let i = 0; i < sublabel.length; i++) {
                            if (sublabel[i].id > id) {
                                id = sublabel[i].id
                            }
                        }
                        manual1 = id + 1;
                    }
                    if (!languages_drop[a.label].content[this.props.index].properties.options[index].sublabel || !(languages_drop[a.label].content[this.props.index].properties.options[index].sublabel instanceof Array)) {
                        languages_drop[a.label].content[this.props.index].properties.options[index].sublabel = [];
                    }
                    languages_drop[a.label].content[this.props.index].properties.options[index].sublabel.push({ id: manual1, sublabel: "", label_image: "" });
                }
            })

        } else {
            let selectedlanguage = this.props.selectedlanguage
            let languages_drop = this.props.languages_drop;
            let manual = fieldprops.properties[`${e}`] ? fieldprops.properties[`${e}`].length : 0;

            if (fieldprops.properties[`${e}`]) {
                let options = fieldprops.properties[`${e}`];
                let id = 0;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].id > id) {
                        id = options[i].id
                    }
                }
                manual = id + 1;
            }

            if (!fieldprops.properties[`${e}`]) {
                fieldprops.properties[`${e}`] = [];
            }

            /** if other option available then push at second last position otherwise last */
            if (fieldprops.properties[`${e}`].some(obj => obj.id === "other") && fieldprops.properties[`${e}`].some(obj => obj.id === "noneofabove")) {
                let indexToInsert = fieldprops.properties[`${e}`].length - 2
                fieldprops.properties[`${e}`].splice(indexToInsert, 0, { id: manual, label: "", label_image: "" });
            }
            else if (fieldprops.properties[`${e}`].some(obj => obj.id === "other") || fieldprops.properties[`${e}`].some(obj => obj.id === "noneofabove")) {
                let indexToInsert = fieldprops.properties[`${e}`].length - 1
                fieldprops.properties[`${e}`].splice(indexToInsert, 0, { id: manual, label: "", label_image: "" });
            }
            else {
                fieldprops.properties[`${e}`].push({ id: manual, label: "", label_image: "" });
            }
            let random = fieldprops.properties.random ? fieldprops.properties.random : 0;
            if (random === 1) {
                let other_opt = {};
                for (let i = 0; i < fieldprops.properties[`${e}`].length; i++) {
                    if (fieldprops.properties[`${e}`][i].id === "other") {
                        other_opt = fieldprops.properties[`${e}`][i];
                        fieldprops.properties[`${e}`].splice(i, 1);
                        fieldprops.properties[`${e}`].push(other_opt);
                        break;
                    }
                }
            }
            this.setState({ fieldprops });
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    let manual1 = languages_drop[a.label].content[this.props.index].properties[`${e}`] ? languages_drop[a.label].content[this.props.index].properties[`${e}`].length : 0;

                    if (languages_drop[a.label].content[this.props.index].properties[`${e}`]) {
                        let options = languages_drop[a.label].content[this.props.index].properties[`${e}`];
                        let id = 0;
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].id > id) {
                                id = options[i].id
                            }
                        }
                        manual1 = id + 1;
                    }

                    if (!languages_drop[a.label].content[this.props.index].properties[`${e}`]) {
                        languages_drop[a.label].content[this.props.index].properties[`${e}`] = [];
                    }

                    /** if other option available then push at second last position otherwise last */
                    if (languages_drop[a.label].content[this.props.index].properties[`${e}`].some(obj => obj.id === "other")) {
                        let indexToInsert1 = languages_drop[a.label].content[this.props.index].properties[`${e}`].length - 1
                        languages_drop[a.label].content[this.props.index].properties[`${e}`].splice(indexToInsert1, 0, { id: manual1, label: "", label_image: "" });
                    }
                    else {
                        languages_drop[a.label].content[this.props.index].properties[`${e}`].push({ id: manual1, label: "", label_image: "" });
                    }
                    if (random === 1) {
                        let other_lan_opt = {};
                        for (let i = 0; i < languages_drop[a.label].content[this.props.index].properties[`${e}`].length; i++) {
                            if (languages_drop[a.label].content[this.props.index].properties[`${e}`][i].id === "other") {
                                other_lan_opt = languages_drop[a.label].content[this.props.index].properties[`${e}`][i];
                                languages_drop[a.label].content[this.props.index].properties[`${e}`].splice(i, 1);
                                languages_drop[a.label].content[this.props.index].properties[`${e}`].push(other_lan_opt);
                                break;
                            }
                        }
                    }
                }
            })
        }
    }


    /* Handles the function to remove element.   */
    deletefun(key, type, subkey) {
        let fieldprops = this.state.fieldprops;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        if (type === "childlabel") {
            //delete fieldprops.properties.options[key].sublabel[subkey]
            fieldprops.properties.options[key].sublabel.splice(subkey, 1);
            // fieldprops.properties.options[key].sublabel_text.splice(subkey, 1);
            this.setState({ fieldprops });
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.options[key].sublabel.splice(subkey, 1);
                    // languages_drop[a.label].content[this.props.index].properties.options[key].sublabel_text.splice(subkey, 1);
                }
            })
        } else if (type === "parentlabel") {
            fieldprops.properties.options.splice(key, 1);
            this.setState({ fieldprops });
            selectedlanguage.forEach((a, b) => {
                if (a.label !== 'English') {
                    languages_drop[a.label].content[this.props.index].properties.options.splice(key, 1);
                }
            })
            //delete fieldprops.properties.options[key]
            // let newFieldProps = fieldprops.properties.options.splice(key, 1);

            // this.setState({ fieldprops });
            // selectedlanguage.map((a, b) => {
            //     if (a.label !== 'English') {
            //         let newFieldProps1 = languages_drop[a.label].content[this.props.index].properties.options.splice(key, 1);
            //     }
            // })

        }
    }


    /* Handles the function to validate conditions and alert when delete.   */
    deleteAlert = () => {

        const conditions = this.props.oldconditions;
        let check = conditions.filter(condition => {
            return (
                condition.source.handler === this.state.fieldprops.handler ||
                condition.source.matchid === this.state.fieldprops.handler ||
                condition.target.handler === this.state.fieldprops.handler
            );
        });
        return (
            this.state.currentlanguage.value === "English" && (
                <span>
                    {conditions.length === 0 ? (
                        <span>
                            <i className="fa fa-trash" onClick={e => this.handleDelete()} />
                        </span>
                    ) : (
                        <span>
                            {check.length > 0 ? (
                                <span>
                                    <Confirm title={"delete " + this.props.labelprop.label} description="The Element is Assosiated with Condtions. Are you sure want to delete ?">
                                        {confirm => <i className="fa fa-trash" onClick={confirm(() => this.handleReset(this.state.fieldprops))} />}
                                    </Confirm>
                                </span>
                            ) : (
                                <span>
                                    <i className="fa fa-trash" onClick={e => this.handleDelete()} />
                                </span>
                            )}
                        </span>
                    )}
                </span>
            )
        );
    };


    /* Handles the validation video file format.   */
    isVideo(filename) {
        switch (filename) {
            case "jpeg":
            case "gif":
            case "png":
            case "mp4":
            case "mov":
            case "mp3":
                return true;
            default:
                return false
        }
    }


    /* Handles the processing of video file.   */
    handleselectedFile = event => {

        let filename = event.target.files[0].name;
        let filenameArr = filename.split(".");
        const fileTypeCut = filenameArr[filenameArr.length - 1];

        if (this.isVideo(fileTypeCut)) {
            this.setState({
                selectedFile: event.target.files[0],
                loaded: 0
            });
        }
    };


    /* Handles the event to upload video file.   */
    handleUpload = name => {
        const data = new FormData();
        data.append("file", this.state.selectedFile, this.state.selectedFile.name);

        api2
            .post("v1/gallery/video", data, {
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
                    });
                }
            })
            .then(resp => {

                let fieldprops = this.state.fieldprops;
                fieldprops.properties[`${name}`] = resp.data.url;
                /** added by k - for persistant image */
                this.props.updatelanguageproperties(this.props.index, `${name}`, true, resp.data.url)
                this.setState({
                    selectedFile: null,
                    loaded: 0,
                    fieldprops
                }, this.props.autosave()
                );
            })
            .catch(error => {
                console.log("Error", error);
            });
    };

    /* Handles the function to delete any media and update fieldprops.   */
    activateLasers = (name) => {

        let fieldprops = this.state.fieldprops;
        if (name === "image") {
            fieldprops.properties.info_image = ""
        }
        else if (name === "video") {
            fieldprops.properties.info_video = ""
        }
        else if (name === "audio") {
            fieldprops.properties.info_audio = ""
        }
        this.setState({ fieldprops }, this.props.autosave()
        );

    }

    /* Handles the function to delete scale images and update fieldprops.   */
    deleteTag = (index) => {

        let fieldprops = this.state.fieldprops;
        fieldprops.properties.scale_images[index].image = ""
        this.setState({ fieldprops }, this.props.autosave()
        );
    }
    showHide(num) {
        this.setState((prevState) => {
            const newItems = [...prevState.show];
            newItems[num] = !newItems[num];
            return { show: newItems };
        });
        $(`#sublabelid${num}`).addClass("d-none")

    }

    /* Fetch questions after client is selected */
    setGroupQuestionAnswers = (data) => {
        this.setState({ allQuestionGroupArray: data })
        let groupArray = [];
        const selectedGroupAnswers = this.props.oldprop.properties;                                                 // selected question's properties
        const _allQuestionGroupArray = data;
        if (selectedGroupAnswers) {
            const isGroupSelected = selectedGroupAnswers.hasOwnProperty('currentQuestionGroup') &&                  // is Group selected
                selectedGroupAnswers.currentQuestionGroup.hasOwnProperty("value");

            const tempGroupArray = _allQuestionGroupArray.map((item, index) => {                                      // all groups list array
                if (isGroupSelected && item.group.value == selectedGroupAnswers.currentQuestionGroup.value) {
                    groupArray = item
                }
                return item.group
            }) || [];

            this.setState({
                questionGroup: tempGroupArray,
                selectedGroupData: groupArray
            })
        }
    }

    getSubGroupArray = (type) => {
        const selectedGroup = this.state.selectedGroupData;
        const subGroup = selectedGroup && selectedGroup.Subgroups
        if (type == 1 && selectedGroup && subGroup) {
            return selectedGroup && selectedGroup.Subgroups && selectedGroup.Subgroups.map((item => item.Subgroup1))
        }
        else if (type == 2 && selectedGroup && subGroup) {
            const val1 = this.state.fieldprops.properties.currentQuestionSubGroup1 && this.state.fieldprops.properties.currentQuestionSubGroup1.value || "";
            const temparray = selectedGroup && selectedGroup.Subgroups && selectedGroup.Subgroups.find((item) => item.Subgroup1.value == val1);
            if (temparray && temparray.Subgroup1 && temparray.Subgroup1.Subgroup2) {
                return temparray.Subgroup1.Subgroup2
            } else return []
        } else return []
    }

    onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) {
            return;
        }
        const updatedArray = Array.from(this.state.fieldprops.properties.options);
        const [removed] = updatedArray.splice(source.index, 1);
        updatedArray.splice(destination.index, 0, removed);
        localStorage.setItem('updateProperties', true);
        let fieldprops = this.state.fieldprops;
        fieldprops.properties.options = updatedArray;
        this.setState({
            fieldprops
        });

        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;
        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                const languageOptions = languages_drop[a.label].content[this.props.index].properties.options;
                const updatedArray1 = Array.from(languageOptions);
                const [removed1] = updatedArray1.splice(source.index, 1);
                updatedArray1.splice(destination.index, 0, removed1);
                languages_drop[a.label].content[this.props.index].properties.options = updatedArray1;
            }
        })
    }

    render() {
        const gallery = this.props.gallery;
        const infoico = this.props.infoico;
        const scaleico = this.props.scaleico;
        const infoicon = gallery.concat(infoico)
        const scaleicon = gallery.concat(scaleico)
        const mappingProfileEnable = this.props.mappingProfileEnable
        const choiceOptionsList = this.state.choiceOptionsList
        const { open } = this.state;
        const scale_images = this.state.fieldprops && this.state.fieldprops.properties ? this.state.fieldprops.properties.scale_images : undefined;
        const scale_content = this.state.fieldprops && this.state.fieldprops.properties ? this.state.fieldprops.properties.scale_content : undefined;
        const table_content = this.state.fieldprops && this.state.fieldprops.properties ? this.state.fieldprops.properties.table_content : undefined;
        const scale_length = scale_content ? scale_content.length : 0;
        const scale_len = scale_images ? scale_images.length : "";
        const boardval = open ? "properties-mmain-tab drag-options openbox" : "properties-mmain-tab drag-options closebox";
        let alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        const { msgColor, br, message, MandatoryStyle } = this.state;
        const disabledive = { 'pointerEvents': 'none', opacity: 0.4, 'cursor': "none" }
        const createChoiceGrpArray = choiceOptionsList.length > 0 ?
            choiceOptionsList.map((item) => { return { group_id: item.group_id, value: item.value, label: item.label } }) : [];

        const info = (

            <div className={boardval} onDragStart={(e) => { console.log(e) }}>
                <div className="properties-main-header clear">
                    <p>Information Properties</p>
                    <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                </div>
                <div className="properties-body-tab">
                    <ul>
                        <li>
                            <Select
                                placeholder={'select Language'}
                                value={this.state.currentlanguage}
                                options={this.state.selectedlanguage}
                                onChange={this.handlelanguageChange.bind(this, 'language')}
                                name="language"
                                className="language_list"
                            />
                        </li>
                        <li>
                            <h3>Information Text</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops && this.state.defaultdrops.properties.question === "" ? disabledive : {} : {}}
                            >
                                <ReactQuill
                                    ref={this.quillRef}
                                    className="quillEditor"
                                    name="inputquestion"
                                    value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                    onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                    // onChange={e => this.updateprops(e, "inputquestion")}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed. Please use bellow information type image option to add image", "danger")

                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputquestion(html, "inputquestion")
                                        }
                                    }}
                                />
                                {/* <input type="text" name="name" className="mediumfm" onFocus={this.handleFocus} value={this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} />
                                <label> Type your informations </label> */}
                            </div>
                        </li>

                        <li>
                            <h3>Name</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label ? this.state.fieldprops.label : ""} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                <label> Edit your Name </label>
                            </div>
                        </li>

                        <li>
                            <h3>Sub Heading</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === ("" || null || undefined) ? disabledive : {} : {}}
                            >
                                <ReactQuill
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    // onChange={e => this.updateprops(e, "inputsubheading")}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed. Please use bellow information type image option to add image", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputsubheading(html, "inputsubheading")
                                        }
                                    }}
                                    onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                />
                                {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} /> */}
                                {/* <label> Add a sub heading below main title. </label> */}
                            </div>
                        </li>

                        {/* <li>
                                            <div className="below-lanbel-body">
                                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                                    <div className="switch-textboxes xtboxestext">Mandatory</div>
                                                    <div className="switches-boxes">
                                                        <Switch checked={this.state.fieldprops.properties.mandatory} onChange={this.handleChange("mandatory")} value="mandatory" color="primary" />
                                                    </div>
                                                </div>
                                                <label> Prevent submission if this question is empty. </label>
                                            </div>
                                        </li> */}

                        <li>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}

                            >
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">No Return</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.info_text === "" ? disabledive : {} : {}}

                                className="below-lanbel-body">
                                <div>
                                    <h3>Information Content</h3>
                                    <div>
                                        <ReactQuill
                                            className="infocontentQuill"
                                            value={this.state.fieldprops.properties.info_text ? this.state.fieldprops.properties.info_text : ""}
                                            inlineStyles="true"
                                            modules={this.modules_minimal}
                                            formats={this.formats}
                                            onChange={(html, delta, source) => {
                                                // const containsImage = html.includes('<img');
                                                // if (containsImage) {
                                                //     this.showNotification("Image not allowed. Please use bellow information type image option to add image", "danger")
                                                //     return
                                                // }
                                                if (source === 'user') {
                                                    this.info_text(html, "info_text")
                                                }
                                            }}
                                            onBlur={() => this.handleOnBlurData("INFOCONTENT")}
                                        // onChange={e => this.updateprops(e, "info_text")}
                                        />
                                        {/* <ReactQuill
                                            className="infocontentQuill"
                                            value={this.state.fieldprops.properties.info_text} inlineStyles="true" modules={this.modules} formats={this.formats}
                                            onChange={e => this.updateprops(e, "info_text")} /> */}
                                    </div>

                                </div>
                            </div>
                        </li>

                        {this.state.fieldprops.properties.text_info ? (
                            <li className="info-fontstyle info-fontstyleborder">
                                <h3>Text Position</h3>
                                <div className="belownewtext clearfix">
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="top"
                                            checked={this.state.fieldprops.properties.text_position === "top"}
                                            name="text_position"
                                            onChange={e => this.updateprops(e, "text_position")}
                                        />
                                        <label>Top</label>
                                    </span>
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="bottom"
                                            checked={this.state.fieldprops.properties.text_position === "bottom"}
                                            name="text_position"
                                            onChange={e => this.updateprops(e, "text_position")}
                                        />
                                        <label>Bottom</label>
                                    </span>
                                </div>
                            </li>
                        ) : (
                            ""
                        )}

                        <li
                            /** added by k - for persistant image */
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Information Type</h3>
                            <div className="belownewtext clearfix"


                            >
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="none"
                                        id="infonone"
                                        checked={this.state.fieldprops.properties.info_type === "none"}
                                        // name="icon_type"
                                        onChange={e => this.updateprops(e, "info_type")}
                                    />
                                    <label htmlFor={"infonone"}>None</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="image"
                                        id="infoimage"
                                        checked={this.state.fieldprops.properties.info_type === "image"}
                                        // name="icon_type"
                                        onChange={e => this.updateprops(e, "info_type")}
                                    />
                                    <label htmlFor={"infoimage"}>Image</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="video"
                                        id="infovideo"
                                        checked={this.state.fieldprops.properties.info_type === "video"}
                                        //  name="icon_type"
                                        onChange={e => this.updateprops(e, "info_type")}
                                    />
                                    <label htmlFor={"infovideo"}>Video</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        id="infoaudio"
                                        value="audio"
                                        checked={this.state.fieldprops.properties.info_type === "audio"}
                                        //   name="icon_type"
                                        onChange={e => this.updateprops(e, "info_type")}
                                    />
                                    <label htmlFor={"infoaudio"}>Audio</label>
                                </span>
                            </div>
                            <div className="t-i-v-wrap">
                                {this.state.fieldprops.properties.info_type ? (
                                    <div>
                                        {this.state.fieldprops.properties.info_type === "image" && !this.state.fieldprops.properties.info_image ? (
                                            <div className="uploadimage-alter">
                                                {" "}
                                                <StyledDropZone children="Scale upload image" accept="image/png, image/gif, image/jpeg, image/*" minSize={0} maxSize={2097152} onDrop={this.onDrop.bind(this, "info_image", "", "")} />
                                            </div>
                                        ) : this.state.fieldprops.properties.info_type === "video" && !this.state.fieldprops.properties.info_video ? (
                                            <div>
                                                <input className="inputfiletypech" type="file" accept="video/mp4,video/x-m4v,video/*" name="" id="" onChange={this.handleselectedFile} />

                                                <div className="upload-process clearfix">
                                                    <button className="uploadbtncls" onClick={() => this.handleUpload("info_video")} disabled={this.state.selectedFile ? "" : "disabled"}>
                                                        Upload
                                                    </button>
                                                    <div className="uploadbtnclsbtns"> {Math.round(this.state.loaded, 2)} %</div>
                                                </div>
                                            </div>
                                        ) : this.state.fieldprops.properties.info_type === "audio" && !this.state.fieldprops.properties.info_audio ? (
                                            <div>
                                                <input className="inputfiletypech" type="file" accept="audio/mpeg3,audio/mp3" name="" id="" onChange={this.handleselectedFile} />
                                                <div className="upload-process clearfix">
                                                    <button className="uploadbtncls" onClick={() => this.handleUpload("info_audio")} disabled={this.state.selectedFile ? "" : "disabled"}>
                                                        Upload
                                                    </button>
                                                    <div className="uploadbtnclsbtns"> {Math.round(this.state.loaded, 2)} %</div>
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>

                            <div>
                                {this.state.fieldprops.properties.info_type === "image" ? (
                                    <div style={{ textAlign: "center" }}>
                                        {this.state.fieldprops.properties.info_image ? (
                                            <div className="relativepos">
                                                <img style={{ maxWidth: "100%" }} src={this.state.fieldprops.properties.info_image} alt="placeholder" />
                                                <button className="deletenewicons" onClick={() => this.activateLasers('image')}>< i className="fa fa-trash"></i> </button>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ) : this.state.fieldprops.properties.info_type === "video" ? (
                                    <div>
                                        {this.state.fieldprops.properties.info_video ? (
                                            <div className="relativepos">
                                                <video key={this.state.fieldprops.properties.info_video} width="320" height="240" controls>
                                                    <source src={this.state.fieldprops.properties.info_video} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                                <button className="deletenewicons" onClick={() => this.activateLasers('video')}>< i className="fa fa-trash"></i></button>
                                            </div>
                                        ) : (
                                            ""
                                        )}{" "}
                                    </div>
                                ) : this.state.fieldprops.properties.info_type === "audio" ? (
                                    <div>
                                        {this.state.fieldprops.properties.info_audio ? (
                                            <div className="relativepos">
                                                <audio key={this.state.fieldprops.properties.info_audio} controls>
                                                    <source src={this.state.fieldprops.properties.info_audio} type="audio/mpeg" />
                                                    Your browser does not support the audio element.
                                                </audio>
                                                <button className="deletenewicons deletenewiconsaud" onClick={() => this.activateLasers('audio')}>< i className="fa fa-trash"></i></button>
                                            </div>
                                        ) : (
                                            ""
                                        )}{" "}
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Information Status</h3>
                            <div className="belownewtext clearfix">
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={this.state.fieldprops.properties.info_stats === "hide"}
                                        name="info_stats"
                                        onChange={e => this.updateprops(e, "info_stats")}
                                    />
                                    <label>Hide</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={this.state.fieldprops.properties.info_stats === "show"}
                                        name="info_stats"
                                        onChange={e => this.updateprops(e, "info_stats")}
                                    />
                                    <label>Show</label>
                                </span>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        );

        const inputbox = (

            <div className={boardval}>
                <div className="properties-main-header clear">
                    <p>Text Input Properties</p>
                    {/* <Button
                        className="scbtn"    
                        style={{ float: "right", right: 0 }}
                        variant="contained"
                        color="primary"
                    >
                    Save & Close
                    </Button> */}
                    {/* <p className="scbtn">Save & Close</p> */}
                    <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                </div>
                <div className="properties-body-tab">
                    <ul>
                        <li>
                            <Select

                                placeholder={'select Language'}
                                value={this.state.currentlanguage}
                                options={this.state.selectedlanguage}
                                onChange={this.handlelanguageChange.bind(this, 'language')}
                                name="language"
                                className="language_list"
                            />
                        </li>
                        <li>
                            <h3>Question Text</h3>
                            {/* {this.state.fieldprops.properties.info_text!==undefined? */}
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.question === ("" || null || undefined) ? disabledive : {} : {}}

                            >
                                <ReactQuill
                                    ref={this.quillRef}
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                    onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                    // onChange={this.richTextInput}
                                    // onChange={(html, delta, source) => {
                                    //     if (source === 'user') {
                                    //       this.updateprops(html, "inputquestion")
                                    //     }
                                    //   }}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputquestion(html, "inputquestion")
                                        }
                                    }}
                                // onChange={e => this.updateprops(e, "inputquestion")}
                                />
                                {/* <input type="text" disabled={true} name="name" className="mediumfm"
                                 onFocus={this.handleFocus} onBlur={this.handleBlur}
                                  value={this.state.fieldprops.properties.info_text.replace(/<[^>]+>/g, '')} 
                                   onChange={e => this.updateprops(e, "inputquestion")} />
                                <label> Type your questions </label>
                                 <img onClick={()=>this.showHide(0)} className="expandArrow" src={this.state.show[0]?CollapseArrow:ExpandArrow}  alt="expandArrow" />
                                 {this.state.show[0]&&
                                <ReactQuill
                                id="editor"
                                    value={this.state.fieldprops.properties.info_text}
                                    inlineStyles="true" 
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    // onChange={this.richTextInput}
                                    onChange={e => this.updateprops(e, "inputquestion")}
                                    // onChange={e => this.updateprops(e, "inputquestion")}
                                />} */}
                            </div>
                            {/* :null} */}
                        </li>

                        <li>
                            <h3>Name</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label ? this.state.fieldprops.label : ""} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                <label> Edit your Name </label>
                            </div>
                        </li>

                        <li>
                            <h3>Sub Heading</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === ("" || null || undefined) ? disabledive : {} : {}}

                            >
                                <ReactQuill
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputsubheading(html, "inputsubheading")
                                            //   this.updateprops(html, "inputsubheading")
                                        }
                                    }}
                                    onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                // onChange={e => this.updateprops(e, "inputsubheading")}
                                />
                                {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} /> */}
                                {/* <label> Add a sub heading below main title. </label> */}
                            </div>
                        </li>
                        <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}} >
                            <h3>Ref Code</h3>
                            <div className="below-lanbel-body">
                                <input type="text" name="name"
                                    value={this.state.fieldprops.properties.refcode}
                                    className="mediumfm"
                                    style={{ width: '70%', marginRight: '2%' }}
                                    disabled={this.state.disabled}
                                    onBlur={(e) => this.ValidateRefCode(e, 'refcodevalidate')}
                                    onChange={e => this.updaterefcode(e, "refcodechange")}
                                />
                                <div className="addmoreimage addmoreimage-big"
                                    onClick={() => this.setState({ disabled: false })}
                                > Ref Code
                                </div>
                            </div>
                        </li>
                        <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}} >
                            <div>
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Product Number</h3>
                                <Select
                                    placeholder={'select Product Number'}
                                    value={this.state.fieldprops.properties.currentProductNumber}
                                    options={this.state.productNumber}
                                    onChange={e => this.handleProductNumberChange(e, "productNumber")}
                                    name="productNumber"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Question Group</h3>
                                <Select
                                    placeholder={'select Question Group'}
                                    value={this.state.fieldprops.properties.currentQuestionGroup}
                                    options={this.state.questionGroup}
                                    onChange={e => this.handleQuestionGroupChange(e, "questionGroup")}
                                    name="questionGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 1`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 1`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup1}
                                    options={this.getSubGroupArray(1)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup1`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 2`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 2`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup2}
                                    options={this.getSubGroupArray(2)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup2`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3>Comments</h3>
                                <div className="below-lanbel-body" style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                    <input
                                        type="text"
                                        name="productNum"
                                        className="mediumfm"
                                        value={this.state.fieldprops.properties.productNumber ? this.state.fieldprops.properties.productNumber : ""}
                                        onChange={e => this.inputtypeProductNum(e, "inputtypeProductNum")}
                                    />
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}

                            >
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={MandatoryStyle ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Mandatory</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.mandatory)} onChange={this.mandatory("mandatory")} value="mandatory" color="primary" />
                                    </div>
                                    {MandatoryStyle && <label className="mandatory-disable" >Disabled : Trigger Question</label>}
                                </div>
                                <label> Prevent submission if this question is empty. </label>
                            </div>
                        </li>

                        <li>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">No Return</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">Open DatePicker</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.datePickerOn)} onChange={this.setDatepickerOn("datePickerOn")} value="datePickerOn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li style={this.state.currentlanguage.value !== "English" || this.state.fieldprops.properties.datePickerOn == 1 ? disabledive : {}}>
                            <h3>Validation</h3>
                            <div className="below-lanbel-body">
                                <select onChange={e => this.updateprops(e, "content_type")} value={this.state.fieldprops.properties.content_type}>
                                    <option value="text">None</option>
                                    <option value="alphabets">Alphabetic</option>
                                    <option value="alphanumeric">AlphaNumeric</option>
                                    <option value="email">Email</option>
                                    <option value="number">Numeric</option>
                                </select>
                            </div>
                        </li>
                        <li style={this.state.currentlanguage.value !== "English" || this.state.fieldprops.properties.datePickerOn == 1 ? disabledive : {}}>
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">
                                        Limit Entry <span>(Chars) </span>
                                    </div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.limitchar)} onChange={this.limitchar("limitchar")} value="limitchar" color="primary" />
                                    </div>
                                </div>
                                {this.state.fieldprops.properties.limitchar ? (
                                    <div className="twocol">
                                        <div className="switch-textboxes">
                                            <label>MIN </label>
                                            <input type="number" name="name" value={this.state.fieldprops.properties.minimum} onChange={e => this.updateprops(e, "minimum")} />
                                        </div>
                                        <div className="switch-textboxes">
                                            <label>MAX </label>
                                            <input type="number" name="name" value={this.state.fieldprops.properties.maximum} onChange={e => this.updateprops(e, "maximum")} />
                                        </div>
                                    </div>
                                ) : (
                                    false
                                )}

                                <label>Limit the maximum number of characters allowed for this field. </label>
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? (this.state.defaultdrops === undefined || this.state.defaultdrops.properties.sublabel === "" || null || undefined) ? disabledive : {} : {}}
                        >
                            <h3>Sub Label</h3>
                            <div className="below-lanbel-body">
                                <ReactQuill
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.sublabel_text ? this.state.fieldprops.properties.sublabel_text : this.state.fieldprops.properties.sublabel ? this.state.fieldprops.properties.sublabel : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputsublabel(html, "inputsublabel")
                                        }
                                    }}
                                    onBlur={() => this.handleOnBlurData("SUBLABLE")}
                                // onChange={e => this.updateprops(e, "inputsublabel")}
                                />
                                {/* <input type="text" name="name" value={this.state.fieldprops.properties.sublabel} className="mediumfm" onChange={e => this.updateprops(e, "inputsublabel")} /> */}
                                {/* <label> Add a small description below the input field. </label> */}
                            </div>
                        </li>
                        {/* <li>
                                <h3>Placeholder</h3>
                                <div className="below-lanbel-body">
                                    <input type="text" name="name" value={this.state.fieldprops.placeholder} className="mediumfm" onChange={(e) => this.updateprops(e, 'placeholder')} />
                                    <label>Add an example hint inside the field. </label>
                                </div>
                            </li> */}

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Inputbox Status</h3>
                            <div className="belownewtext clearfix">
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={this.state.fieldprops.properties.input_stats === "hide"}
                                        name="input_stats"
                                        onChange={e => this.updateprops(e, "input_stats")}
                                    />
                                    <label>Hide</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={this.state.fieldprops.properties.input_stats === "show"}
                                        name="input_stats"
                                        onChange={e => this.updateprops(e, "input_stats")}
                                    />
                                    <label>Show</label>
                                </span>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>

        );

        const upload = (

            <div className={boardval}>
                <div className="properties-main-header clear">
                    <p>Upload Properties</p>
                    <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                </div>
                <div className="properties-body-tab">
                    <ul>
                        <li>
                            <Select
                                placeholder={'select Language'}
                                value={this.state.currentlanguage}
                                options={this.state.selectedlanguage}
                                onChange={this.handlelanguageChange.bind(this, 'language')}
                                name="language"
                                className="language_list"
                            />
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.question === ("" || null || undefined) ? disabledive : {} : {}}
                        >
                            <h3>Question Text</h3>
                            <div className="below-lanbel-body"
                            >
                                <ReactQuill
                                    ref={this.quillRef}
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputquestion(html, "inputquestion")
                                        }
                                    }}
                                    // onChange={e => this.updateprops(e, "inputquestion")}
                                    onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                    onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                />
                                {/* <input type="text" name="name" className="mediumfm" onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.fieldprops.properties.question} onChange={e => this.updateprops(e, "inputquestion")} />
                                <label> Type your questions </label> */}
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Name</h3>
                            <div className="below-lanbel-body"
                            >
                                <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                <label> Edit your Name </label>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === ("" || null || undefined) ? disabledive : {} : {}}
                        >
                            <h3>Sub Heading</h3>
                            <div className="below-lanbel-body">
                                <ReactQuill
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    // onChange={this.richTextInput}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputsubheading(html, "inputsubheading")
                                        }
                                    }}
                                    onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                // onChange={e => this.updateprops(e, "inputsubheading")}
                                // onChange={e => this.updateprops(e, "inputquestion")}
                                />
                                {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} />
                                <label> Add a sub heading below main title. </label> */}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Ref Code</h3>
                            <div className="below-lanbel-body">
                                <input type="text" name="name"
                                    value={this.state.fieldprops.properties.refcode}
                                    className="mediumfm"
                                    style={{ width: '70%', marginRight: '2%' }}
                                    disabled={this.state.disabled}
                                    onBlur={(e) => this.ValidateRefCode(e, 'refcodevalidate')}
                                    onChange={e => this.updaterefcode(e, "refcodechange")}
                                />
                                <div className="addmoreimage addmoreimage-big"
                                    onClick={() => this.setState({ disabled: false })}
                                > Ref Code
                                </div>
                            </div>
                        </li>
                        <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}} >
                            <div>
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Product Number</h3>
                                <Select
                                    placeholder={'select Product Number'}
                                    value={this.state.fieldprops.properties.currentProductNumber}
                                    options={this.state.productNumber}
                                    onChange={e => this.handleProductNumberChange(e, "productNumber")}
                                    name="productNumber"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Question Group</h3>
                                <Select
                                    placeholder={'select Question Group'}
                                    value={this.state.fieldprops.properties.currentQuestionGroup}
                                    options={this.state.questionGroup}
                                    onChange={e => this.handleQuestionGroupChange(e, "questionGroup")}
                                    name="questionGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 1`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 1`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup1}
                                    options={this.getSubGroupArray(1)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup1`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 2`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 2`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup2}
                                    options={this.getSubGroupArray(2)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup2`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3>Comments</h3>
                                <div className="below-lanbel-body" style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                    <input type="text" name="productNum" className="mediumfm" value={this.state.fieldprops.properties.productNumber ? this.state.fieldprops.properties.productNumber : ""} onChange={e => this.inputtypeProductNum(e, "inputtypeProductNum")} />
                                </div>
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={MandatoryStyle ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Mandatory</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.mandatory)} onChange={this.mandatory("mandatory")} value="mandatory" color="primary" />
                                    </div>
                                    {MandatoryStyle && <label className="mandatory-disable" >Disabled : Trigger Question</label>}
                                </div>
                                <label> Prevent submission if this question is empty. </label>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">No Return</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Media Type</h3>

                            <div className="mediatyppe-total-wrap">
                                <div className="belownewtext clearfix">
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="image"
                                            checked={this.state.fieldprops.properties.media_type === "image"}
                                            //name="media_type"
                                            onChange={e => this.updateprops(e, "media_type")}
                                        />
                                        <label>Image</label>
                                    </span>
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="audio"
                                            disabled={scale_length >= 6 ? "disabled" : ""}
                                            checked={this.state.fieldprops.properties.media_type === "audio"}
                                            //name="media_type"
                                            onChange={e => this.updateprops(e, "media_type")}
                                        />
                                        <label>Audio</label>
                                    </span>
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="video"
                                            disabled={scale_length >= 6 ? "disabled" : ""}
                                            checked={this.state.fieldprops.properties.media_type === "video"}
                                            //name="media_type"
                                            onChange={e => this.updateprops(e, "media_type")}
                                        />
                                        <label>Video</label>
                                    </span>
                                </div>
                                <div>
                                    <div className="twocol dropboxer dropboxeredits">
                                        <div className="dropper ">
                                            <div className="droppertotalcls clearfix">
                                                <div className="droppertotalclsinner droppertotalclsinnerclsn">
                                                    <label className="icontype_cls_name">Icon Type</label>
                                                    <span onClick={() => this.localGallery(0, "icon_gallery")}>Choose Icon</span>
                                                </div>
                                                {this.state.fieldprops.properties.upload_icon ? (
                                                    <div className="dropperprev">
                                                        <img width="50" height="50" alt="upload icon" src={this.state.fieldprops.properties.upload_icon} />
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>

                                            {this.state.scale_popup.icon_gallery ? (
                                                this.state.scale_popup.icon_gallery[0] === "enabled" ? (
                                                    <div className="imgdpgallnparent">
                                                        <div className="imgdpgall">
                                                            {infoicon.map((image, i) => (
                                                                <img src={image.image} key={i} alt="scale" onClick={() => this.scaleIcon(image.image, 0, 0, "upload_icon")} />
                                                            ))}
                                                            <div className="scalgalclose" onClick={() => this.hideGallery(0, "icon_gallery")}>
                                                                <i className="fa fa-close" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ""
                                                )
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/*<div className="max-up-clds">
                                                    <h4 className="maximuuploadcls">Maximum Upload</h4>
                                                    <input
                                                        type="number"
                                                        name="name"
                                                        value={this.state.fieldprops.properties.max_upload}
                                                        className="mediumfm iuploin"
                                                        onChange={e => this.updateprops(e, "max_upload")}
                                                    />
                                                </div> */ }
                                <div>
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <div className="switch-textboxes xtboxestext xtboxestextchange">Allow User to Upload From Gallery</div>
                                        <div className="switches-boxes">
                                            <Switch
                                                checked={Boolean(this.state.fieldprops.properties.allow_gallery)}
                                                onChange={this.allow_gallery("allow_gallery")}
                                                value="scale"
                                                color="primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>

                        {/* <li>
                                            <h3>Sub Label</h3>
                                            <div className="below-lanbel-body">
                                                <input type="text" name="name" value={this.state.fieldprops.properties.sublabel} className="mediumfm" onChange={e => this.updateprops(e, "sublabel")} />
                                                <label> Add a small description below the input field. </label>
                                            </div>
                                        </li> */}

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Upload Status</h3>
                            <div className="belownewtext clearfix">
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={this.state.fieldprops.properties.upload_stats === "hide"}
                                        name="upload_stats"
                                        onChange={e => this.updateprops(e, "upload_stats")}
                                    />
                                    <label>Hide</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={this.state.fieldprops.properties.upload_stats === "show"}
                                        name="upload_stats"
                                        onChange={e => this.updateprops(e, "upload_stats")}
                                    />
                                    <label>Show</label>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        );

        const button = (
            <div className="bdrop">
                <div className="topbar">
                    <div className="label">
                        <input
                            type="text"
                            name="name"
                            style={{ border: "0px", backgroundColor: "#f7f7f7" }}
                            placeholder={"Button text"}
                            value={this.state.fieldlabel}
                            onChange={this.updatestatus}
                            autoFocus
                        />

                        {this.upArrow()}
                        {this.downArrow()}
                    </div>
                    <div className="actions">
                        <span onClick={this.handleClickOpen}>
                            <i className="fa fa-cog" />
                        </span>

                        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" id="blackmodel">
                            <DialogTitle id="form-dialog-title">Button Properties</DialogTitle>
                            <DialogContent style={{ minWidth: "500px" }}>
                                <div className="fblock" style={{ paddingTop: "0px" }}>
                                    {/* <Switch checked={this.state.checkedA} onChange={this.handleChange("checkedA")} value="checkedA" /> */}
                                    <label>Add Resset Button</label>
                                    <p>Add reset button near to submit button</p>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={this.handleClose} color="primary">
                                    Submit
                                </Button>
                            </DialogActions>
                        </Dialog>
                        {this.deleteAlert()}
                    </div>
                </div>
                <div className="field">
                    <input type="button" name="name" value="Button" disabled />
                </div>
            </div>
        );

        const capture = (

            <div className={boardval}>
                <div className="properties-main-header clear">
                    <p>Image Tagging Properties</p>
                    <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                </div>
                <div className="properties-body-tab">
                    <ul>
                        <li>
                            <Select
                                placeholder={'select Language'}
                                value={this.state.currentlanguage}
                                options={this.state.selectedlanguage}
                                onChange={this.handlelanguageChange.bind(this, 'language')}
                                name="language"
                                className="language_list"
                            />
                        </li>
                        <li>
                            <h3>Question Text</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.question === ("" || null || undefined) ? disabledive : {} : {}}
                            >
                                <ReactQuill
                                    ref={this.quillRef}
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                    onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputquestion(html, "inputquestion")
                                        }
                                    }}
                                // onChange={e => this.updateprops(e, "inputquestion")}
                                />
                                {/* <input type="text" name="name" className="mediumfm" onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.fieldprops.properties.question} onChange={e => this.updateprops(e, "inputquestion")} /> */}
                                {/* <label> Type your questions </label> */}
                            </div>
                        </li>
                        <li>
                            <h3>Name</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                <label> Edit Your Name </label>
                            </div>
                        </li>

                        <li>
                            <h3>Sub Heading</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === ("" || null || undefined) ? disabledive : {} : {}}
                            >
                                <ReactQuill
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputsubheading(html, "inputsubheading")
                                        }
                                    }}
                                    onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                // onChange={e => this.updateprops(e, "inputsubheading")}
                                />
                                {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} /> */}
                                {/* <label> Add a sub heading below main title. </label> */}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Ref Code</h3>
                            <div className="below-lanbel-body">
                                <input type="text" name="name"
                                    value={this.state.fieldprops.properties.refcode}
                                    className="mediumfm"
                                    style={{ width: '70%', marginRight: '2%' }}
                                    disabled={this.state.disabled}
                                    onBlur={(e) => this.ValidateRefCode(e, 'refcodevalidate')}
                                    onChange={e => this.updaterefcode(e, "refcodechange")}
                                />
                                <div className="addmoreimage addmoreimage-big"
                                    onClick={() => this.setState({ disabled: false })}
                                > Ref Code
                                </div>
                            </div>
                        </li>
                        <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                            <div>
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Product Number</h3>
                                <Select
                                    placeholder={'select Product Number'}
                                    value={this.state.fieldprops.properties.currentProductNumber}
                                    options={this.state.productNumber}
                                    onChange={e => this.handleProductNumberChange(e, "productNumber")}
                                    name="productNumber"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Question Group</h3>
                                <Select
                                    placeholder={'select Question Group'}
                                    value={this.state.fieldprops.properties.currentQuestionGroup}
                                    options={this.state.questionGroup}
                                    onChange={e => this.handleQuestionGroupChange(e, "questionGroup")}
                                    name="questionGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 1`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 1`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup1}
                                    options={this.getSubGroupArray(1)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup1`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 2`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 2`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup2}
                                    options={this.getSubGroupArray(2)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup2`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3>Comments</h3>
                                <div className="below-lanbel-body" style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                    <input type="text" name="productNum" className="mediumfm" value={this.state.fieldprops.properties.productNumber ? this.state.fieldprops.properties.productNumber : ""} onChange={e => this.inputtypeProductNum(e, "inputtypeProductNum")} />
                                </div>
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={MandatoryStyle ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Mandatory</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.mandatory)} onChange={this.mandatory("mandatory")} value="mandatory" color="primary" />
                                    </div>
                                    {MandatoryStyle && <label className="mandatory-disable" >Disabled : Trigger Question</label>}
                                </div>
                                <label> Prevent submission if this question is empty. </label>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">No Return</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>


                        <div>
                            <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                <div className="switch-textboxes xtboxestext xtboxestextchange">Allow User to Upload From Gallery</div>
                                <div className="switches-boxes">
                                    <Switch
                                        checked={Boolean(this.state.fieldprops.properties.allow_gallery)}
                                        onChange={this.allow_gallery("allow_gallery")}
                                        value="scale"
                                        color="primary"
                                    />
                                </div>
                            </div>
                        </div>
                        <li
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Markers</div>
                                    <div className="switches-boxes">
                                        <Switch
                                            checked={Boolean(this.state.fieldprops.properties.marker_enabled)}
                                            onChange={this.marker_enabled("marker_enabled")}
                                            value="marker_enabled"
                                            color="primary"
                                        />
                                    </div>
                                </div>
                                {this.state.fieldprops.properties.marker_enabled ? (
                                    <div
                                        style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.marker_instruction_text === "" ? disabledive : {} : {}}
                                    >
                                        <label>Marker Text </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={this.state.fieldprops.properties.marker_instruction_text}
                                            className="mediumfm"
                                            onChange={e => this.marker_instruction_text(e, "marker_instruction_text")}
                                        />
                                    </div>
                                ) : (
                                    false
                                )}
                            </div>
                        </li>
                        {this.state.fieldprops.properties.marker_enabled ? (
                            <li
                            >
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                    >
                                        <div className="switch-textboxes xtboxestext">Explanation</div>
                                        <div className="switches-boxes">
                                            <Switch
                                                checked={Boolean(this.state.fieldprops.properties.instruction_enabled)}
                                                onChange={this.instruction_enabled("instruction_enabled")}
                                                value="instruction_enabled"
                                                color="primary"
                                            />
                                        </div>
                                    </div>
                                    {this.state.fieldprops.properties.instruction_enabled ? (
                                        <div
                                            style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.instruction_text === "" ? disabledive : {} : {}}
                                        >
                                            <label>Explain text </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={this.state.fieldprops.properties.instruction_text}
                                                className="mediumfm"
                                                onChange={e => this.instruction_text(e, "instruction_text")}
                                            />
                                        </div>
                                    ) : (
                                        false
                                    )}
                                </div>
                            </li>
                        ) : ("")}

                        <li>
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Scale</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.scale_enabled)} onChange={this.scale_enabled("scale_enabled")} value="scale" color="primary" />
                                    </div>
                                </div>
                                {this.state.fieldprops.properties.scale_enabled ? (
                                    <div
                                        style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.scale_text === "" ? disabledive : {} : {}}
                                    >
                                        <label>Instruction Text </label>
                                        <input type="text" name="name" value={this.state.fieldprops.properties.scale_text} className="mediumfm" onChange={e => this.scale_text(e, "scale_text")} />

                                        <div
                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                        >
                                            <p className="newtxt">
                                                <span>Scale 1 of</span>
                                                <input type="number" min="0" value={this.state.fieldprops.properties.scale_length} onChange={e => this.addscale(e, "addscale")} />{" "}
                                            </p>
                                        </div>
                                        {scale_images
                                            ? Object.keys(scale_images).map(
                                                function (key, index) {
                                                    return (
                                                        <div className="twocol dropboxer"
                                                            key={index}
                                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                        >
                                                            <div className="dropper">
                                                                <label>
                                                                    Scale {index + 1} of {scale_len}
                                                                </label>
                                                                <StyledDropZone accept={"image/png, image/gif, image/jpeg, image/*"} children="Scale upload image" onDrop={this.onDrop.bind(this, "scale_images", key, "")} />
                                                            </div>
                                                            {scale_images[`${key}`].image ? (
                                                                <div className="dropperprev dropperprevnicons relative">
                                                                    <img width="50" height="50" alt="scale" src={scale_images[`${key}`].image} />
                                                                    <span onClick={() => this.deleteTag(index)}>  <i className="fa fa-trash"> </i>  </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    );
                                                }.bind(this)
                                            )
                                            : ""}
                                    </div>
                                ) : (
                                    false
                                )}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Image Tagging Status</h3>
                            <div className="belownewtext clearfix">
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={this.state.fieldprops.properties.img_stats === "hide"}
                                        name="img_stats"
                                        onChange={e => this.updateprops(e, "img_stats")}
                                    />
                                    <label>Hide</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={this.state.fieldprops.properties.img_stats === "show"}
                                        name="img_stats"
                                        onChange={e => this.updateprops(e, "img_stats")}
                                    />
                                    <label>Show</label>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        );

        const scale = (

            <div className={boardval}>
                <div className="properties-main-header clear">
                    <p>Scale Properties</p>
                    <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                </div>
                <div className="properties-body-tab">
                    <ul>
                        <li>
                            <Select
                                placeholder={'select Language'}
                                value={this.state.currentlanguage}
                                options={this.state.selectedlanguage}
                                onChange={this.handlelanguageChange.bind(this, 'language')}
                                name="language"
                                className="language_list"
                            />
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.question === ("" || null || undefined) ? disabledive : {} : {}}
                        >
                            <h3>Question Text</h3>
                            <div className="below-lanbel-body"
                            >
                                <ReactQuill
                                    ref={this.quillRef}
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                    onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputquestion(html, "inputquestion")
                                        }
                                    }}
                                // onChange={e => this.updateprops(e, "inputquestion")}
                                />
                                {/* <input type="text" name="name" className="mediumfm" onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.fieldprops.properties.question} onChange={e => this.updateprops(e, "inputquestion")} /> */}
                                {/* <label> Type your questions </label> */}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Name</h3>
                            <div className="below-lanbel-body">
                                <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                <label> Edit Your Name </label>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === ("" || null || undefined) ? disabledive : {} : {}}
                        >
                            <h3>Sub Heading</h3>
                            <div className="below-lanbel-body">
                                <ReactQuill
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputsubheading(html, "inputsubheading")
                                        }
                                    }}
                                    onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                // onChange={e => this.updateprops(e, "inputsubheading")}
                                />
                                {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} /> */}
                                {/* <label> Add a sub heading below main title. </label> */}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Ref Code</h3>
                            <div className="below-lanbel-body">
                                <input type="text" name="name"
                                    value={this.state.fieldprops.properties.refcode}
                                    className="mediumfm"
                                    style={{ width: '70%', marginRight: '2%' }}
                                    disabled={this.state.disabled}
                                    onBlur={(e) => this.ValidateRefCode(e, 'refcodevalidate')}
                                    onChange={e => this.updaterefcode(e, "refcodechange")}
                                />
                                <div className="addmoreimage addmoreimage-big"
                                    onClick={() => this.setState({ disabled: false })}
                                > Ref Code
                                </div>
                            </div>
                        </li>
                        <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                            <div>
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Product Number</h3>
                                <Select
                                    placeholder={'select Product Number'}
                                    value={this.state.fieldprops.properties.currentProductNumber}
                                    options={this.state.productNumber}
                                    onChange={e => this.handleProductNumberChange(e, "productNumber")}
                                    name="productNumber"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Question Group</h3>
                                <Select
                                    placeholder={'select Question Group'}
                                    value={this.state.fieldprops.properties.currentQuestionGroup}
                                    options={this.state.questionGroup}
                                    onChange={e => this.handleQuestionGroupChange(e, "questionGroup")}
                                    name="questionGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 1`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 1`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup1}
                                    options={this.getSubGroupArray(1)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup1`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 2`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 2`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup2}
                                    options={this.getSubGroupArray(2)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup2`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3>Comments</h3>
                                <div className="below-lanbel-body" style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                    <input type="text" name="productNum" className="mediumfm" value={this.state.fieldprops.properties.productNumber ? this.state.fieldprops.properties.productNumber : ""} onChange={e => this.inputtypeProductNum(e, "inputtypeProductNum")} />
                                </div>
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={MandatoryStyle ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Mandatory</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.mandatory)} onChange={this.mandatory("mandatory")} value="mandatory" color="primary" />
                                    </div>
                                    {MandatoryStyle && <label className="mandatory-disable" >Disabled : Trigger Question</label>}
                                </div>
                                <label> Prevent submission if this question is empty. </label>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">No Return</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="xtboxestext">Scale type</div>

                                    <div className="radioForm clearfix"
                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                    >
                                        <div className="block">
                                            <input type="radio" value="scale" checked={this.state.fieldprops.properties.scale_type === "scale"}
                                                //name="scale_type" 
                                                onChange={this.radioFunction("scale_type")} />
                                            <span>Scale</span>
                                        </div>
                                        <div className="block">
                                            <input type="radio" value="table" checked={this.state.fieldprops.properties.scale_type === "table"}
                                                //name="scale_type" 
                                                onChange={this.radioFunction("scale_type")} />
                                            <span>Table</span>
                                        </div>
                                        <div className="block">
                                            <input type="radio" value="maxdiff" checked={this.state.fieldprops.properties.scale_type === "maxdiff"}
                                                onChange={this.radioFunction("scale_type")} />
                                            <span>MaxDiff</span>
                                        </div>
                                        {/*
                                                    <div className="block">
                                                        <input
                                                            type="radio"
                                                            value="sliding"
                                                            checked={this.state.fieldprops.properties.scale_type === "sliding"}
                                                            name="scale_type"
                                                            onChange={this.radioFunction}
                                                        />
                                                        <span>Sliding </span>
                                                    </div>
                                                    <div className="block">
                                                        <input
                                                            type="radio"
                                                            value="binary"
                                                            checked={this.state.fieldprops.properties.scale_type === "binary"}
                                                            name="scale_type"
                                                            onChange={this.radioFunction}
                                                        />
                                                        <span>Binary</span>
                                                    </div>
                                                    */}
                                    </div>

                                    <div className="condtionalrender">
                                        {this.state.fieldprops.properties.scale_type === "scale" ? (
                                            <div>
                                                <div className="scaletxt newdivlabp clear clearfix">
                                                    <div className="newtxt newtxtpalt"
                                                        style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.start_text === "" ? disabledive : {} : {}}
                                                    >
                                                        <label>Start Text</label>
                                                        <input
                                                            type="text"
                                                            name="scale"
                                                            placeholder="Start text"
                                                            value={this.state.fieldprops.properties.start_text}
                                                            onChange={e => this.start_text(e, "start_text")}
                                                        />
                                                    </div>
                                                    <div className="newtxt newtxtpalt"
                                                        style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops.properties.end_text === "" ? disabledive : {} : {}}
                                                    >
                                                        <label>End Text</label>
                                                        <input type="text" name="scale" value={this.state.fieldprops.properties.end_text} onChange={e => this.end_text(e, "end_text")} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="newtxt"
                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                    >
                                                        <span>Scale 1 of</span>
                                                        <input
                                                            type="number"
                                                            name="scale"
                                                            value={this.state.fieldprops.properties.scale_length}
                                                            min="0"
                                                            onChange={e => this.addscalecnt(e, "addscalecnt")}
                                                        />{" "}
                                                    </p>
                                                    <div className="belownewtext clearfix"
                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                    >
                                                        <span className="widthfifty">
                                                            <input
                                                                type="radio"
                                                                value="image"
                                                                checked={this.state.fieldprops.properties.icon_type === "image"}
                                                                //name="icon_type"
                                                                onChange={e => this.icon_type(e, "icon_type")}
                                                            />
                                                            <label>Images</label>
                                                        </span>
                                                        <span className="widthfifty">
                                                            <input
                                                                type="radio"
                                                                value="emoji"
                                                                disabled={scale_length >= 6 ? "disabled" : ""}
                                                                checked={this.state.fieldprops.properties.icon_type === "emoji"}
                                                                //name="icon_type"
                                                                onChange={e => this.icon_type(e, "icon_type")}
                                                            />
                                                            <label>Emojis</label>
                                                        </span>
                                                    </div>
                                                </div>
                                                {scale_content && this.state.fieldprops.properties.icon_type === "image" ? (
                                                    <div className="twocol dropboxer dropboxeredits"
                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                    >
                                                        <div className="dropper ">
                                                            <div className="droppertotalcls clearfix">
                                                                <div className="droppertotalclsinner">
                                                                    <label>Scale Image</label>
                                                                    <span onClick={() => this.localGallery(0, "scale_gallery")}>Choose Image</span>
                                                                </div>

                                                                {scale_content[0] ? (
                                                                    scale_content[0].image_id ? (
                                                                        <div className="dropperprev">
                                                                            <img width="50" height="50" alt="dropper" src={scale_content[0].image_id} />
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>

                                                            {this.state.scale_popup.scale_gallery ? (
                                                                this.state.scale_popup.scale_gallery[0] === "enabled" ? (
                                                                    <div className="imgdpgall"
                                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                                    >
                                                                        {scaleicon.map((image, i) => (
                                                                            <img key={i} src={image.image} alt="scale icon" onClick={() => this.scaleIcon(image.image, 0, 0, "scale_image")} />
                                                                        ))}
                                                                        <div className="scalgalclose" onClick={() => this.hideGallery(0, "scale_gallery")}>
                                                                            <i className="fa fa-close" />
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    ""
                                                                )
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : scale_content && this.state.fieldprops.properties.icon_type === "emoji" ? (
                                                    <div
                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                    >
                                                        {scale_content.map((emoji, index) => (
                                                            <span key={index}>
                                                                <img src={emoji.image_id} alt="scale content" width="40" />
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        ) : this.state.fieldprops.properties.scale_type === "table" ? (
                                            <div>
                                                <div className="newdivlabp clear clearfix"
                                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                >
                                                    <p className="newtxt">
                                                        <span>Values</span>
                                                        <input
                                                            type="number"
                                                            // value={this.state.fieldprops.properties.table_content.value_length}
                                                            value={this.state.fieldprops.properties.table_content.value_length > 0 ? this.state.fieldprops.properties.table_content.value_length : ''}
                                                            name="table"
                                                            onChange={e => this.table_value(e, "table_value")}
                                                        />{" "}
                                                    </p>
                                                    <p className="newtxt">
                                                        <span>Options</span>
                                                        <input
                                                            disabled={this.state.fieldprops.properties.table_content.value_length ? "" : "disabled"}
                                                            type="number"
                                                            // value={this.state.fieldprops.properties.table_content.options_length}
                                                            value={this.state.fieldprops.properties.table_content.options_length > 0 ? this.state.fieldprops.properties.table_content.options_length : ''}
                                                            name="tableop"
                                                            onChange={e => this.table_options(e, "table_options")}
                                                        />{" "}
                                                    </p>
                                                </div>

                                                <div className="scaletxt newdivlabp newdivlabpalternew clear "
                                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                >
                                                    <div>
                                                        <h3>Grid Type</h3>
                                                        <div className="clear clearfix">
                                                            <div className="ridtype-input-wrap clear clearfix">
                                                                <div className="ridtype-input">
                                                                    <input
                                                                        type="radio"
                                                                        value="image"
                                                                        checked={this.state.fieldprops.properties.grid_type === "image"}
                                                                        //name="grid_type"
                                                                        onChange={e => this.updateprops(e, "grid_type")}
                                                                    />
                                                                    <label>Image</label>
                                                                </div>

                                                                <div className="ridtype-input">
                                                                    <input
                                                                        type="radio"
                                                                        value="radio"
                                                                        checked={this.state.fieldprops.properties.grid_type === "radio"}
                                                                        //name="grid_type"
                                                                        onChange={e => this.updateprops(e, "grid_type")}
                                                                    />
                                                                    <label>Radio</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="value-parent-div">
                                                    <h6>Value</h6>
                                                    {this.state.fieldprops.properties.table_content.table_value
                                                        ? Object.keys(this.state.fieldprops.properties.table_content.table_value).map(
                                                            function (key, index) {
                                                                return (
                                                                    <div className="twocol dropboxer"
                                                                        key={index}
                                                                    >
                                                                        <div className="dropper"
                                                                            style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops && this.state.defaultdrops.properties.table_content && this.state.defaultdrops.properties.table_content.table_value && this.state.defaultdrops.properties.table_content.table_value[index].value === "" ? disabledive : {} : {}}
                                                                        >
                                                                            <label>Value {index + 1}</label>
                                                                            <input
                                                                                type="text"
                                                                                value={this.state.fieldprops.properties.table_content.table_value[index].value}
                                                                                disabled={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops.properties.table_content && this.state.defaultdrops.properties.table_content.table_value && this.state.defaultdrops.properties.table_content.table_value[index].value === "" ? true : false : false}
                                                                                onChange={e => this.t_value(e, "t_value", index)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }.bind(this)
                                                        )
                                                        : ""}
                                                </div>
                                                <div className="value-parent-div">
                                                    <h6>Options</h6>
                                                    {this.state.fieldprops.properties.table_content.table_options
                                                        ? Object.keys(this.state.fieldprops.properties.table_content.table_options).map(
                                                            function (key, index) {
                                                                return (
                                                                    <div className="twocol dropboxer"
                                                                        style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops && this.state.defaultdrops.properties.table_content && this.state.defaultdrops.properties.table_content.table_options && this.state.defaultdrops.properties.table_content.table_options[index].value === "" ? disabledive : {} : {}}
                                                                        key={index}
                                                                    >
                                                                        <div className="dropper">
                                                                            <label>Options {index + 1}</label>
                                                                            <input
                                                                                type="text"
                                                                                value={this.state.fieldprops.properties.table_content.table_options[index].value}
                                                                                onChange={e => this.t_options(e, "t_options", index)}
                                                                            />
                                                                            {/* <StyledDropZone label="Scale Option image" onDrop={this.onDrop.bind(this, 't_options_image', index, "")} /> */}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }.bind(this)
                                                        )
                                                        : ""}
                                                </div>

                                                {this.state.fieldprops.properties.grid_type === "image" ? (
                                                    <div className="value-parent-div"
                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                    >
                                                        <h6>Options Images </h6>

                                                        {this.state.fieldprops.properties.table_content.table_value
                                                            ? this.state.fieldprops.properties.table_content.table_value.map((value, index) => (
                                                                <div className="" key={index}>
                                                                    {value.image.map((val, i) => (
                                                                        <div key={i}>
                                                                            <div key={i} className="twocol dropboxer dropboxeredits">
                                                                                <div className="dropper ">
                                                                                    <div className="droppertotalcls clearfix">
                                                                                        <div className="droppertotalclsinner">
                                                                                            <label>
                                                                                                {" "}
                                                                                                value {index + 1}, Option {i + 1}
                                                                                            </label>

                                                                                            <span onClick={() => this.localGallery(index, "table_gallery", i)}>Choose Image</span>
                                                                                        </div>
                                                                                        {table_content.table_value[index].image[i].image_id ? (
                                                                                            <div className="dropperprev">
                                                                                                <img width="50" height="50" alt="dropper" src={table_content.table_value[index].image[i].image_id} />
                                                                                            </div>
                                                                                        ) : (
                                                                                            ""
                                                                                        )}
                                                                                    </div>

                                                                                    {this.state.scale_popup.table_gallery && this.state.scale_popup.table_gallery[index] && this.state.scale_popup.table_gallery[index][i] ? (
                                                                                        this.state.scale_popup.table_gallery[index][i] === "enabled" ? (
                                                                                            <div className="imgdpgall">
                                                                                                {scaleicon.map((image, objIndex) => (
                                                                                                    <img key={index} src={image.image} alt="scale" onClick={() => this.scaleIcon(image.image, index, i, "table_image")} />
                                                                                                ))}
                                                                                                <div className="scalgalclose" onClick={() => this.hideGallery(index, "table_gallery", i)}>
                                                                                                    <i className="fa fa-close" />
                                                                                                </div>
                                                                                            </div>
                                                                                        ) : (
                                                                                            ""
                                                                                        )
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))
                                                            : ""}
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        ) : this.state.fieldprops.properties.scale_type === "sliding" ? (
                                            <div>
                                                <div>
                                                    <h6>Slider Range</h6>
                                                    <div>
                                                        <label>From</label>
                                                        <input type="text" value={this.state.fieldprops.properties.scale_content.slide_range.from} onChange={e => this.slider_from(e, "slider_from")} />
                                                    </div>
                                                    <div>
                                                        <label>To</label>
                                                        <input type="text" value={this.state.fieldprops.properties.scale_content.slide_range.from} onChange={e => this.slider_to(e, "slider_to")} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6>Slider Images</h6>
                                                    <div>
                                                        <label>bad</label>
                                                        <StyledDropZone label="Scale Sliding image" onDrop={this.onDrop.bind(this, "sliding_ico", 0, "")} />
                                                    </div>
                                                    <div>
                                                        <label>average</label>
                                                        <StyledDropZone label="Scale Sliding image" onDrop={this.onDrop.bind(this, "sliding_ico", 1, "")} />
                                                    </div>
                                                    <div>
                                                        <label>good</label>
                                                        <StyledDropZone label="Scale Sliding image" onDrop={this.onDrop.bind(this, "sliding_ico", 2, "")} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : this.state.fieldprops.properties.scale_type === "binary" ? (
                                            <div>
                                                <h6>Binary Content</h6>
                                                <div>
                                                    <label>No</label>
                                                    <input type="text" value={this.state.fieldprops.properties.scale_content[0].text} onChange={e => this.binary(e, "binary", 0)} />
                                                    <StyledDropZone label="Scale Sliding image" onDrop={this.onDrop.bind(this, "binary_ico", 0, "")} />
                                                </div>
                                                <div>
                                                    <label>Yes</label>
                                                    <input type="text" value={this.state.fieldprops.properties.scale_content[1].text} onChange={e => this.binary(e, "binary", 1)} />
                                                    <StyledDropZone label="Scale Sliding image" onDrop={this.onDrop.bind(this, "binary_ico", 1, "")} />
                                                </div>
                                            </div>
                                        ) : this.state.fieldprops.properties.scale_type === "maxdiff" ? (
                                            <div>

                                                {this.state.fieldprops.properties.attribute_data
                                                    ? this.state.fieldprops.properties.attribute_data.map(
                                                        function (value, index) {
                                                            return (
                                                                <div className="twocol dropboxer" key={index}>
                                                                    <div className="choicedropper dropper">
                                                                        <div className="parentlabel clear clearfix d-flex align-items-center"
                                                                            style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops.properties.attribute_data && this.state.defaultdrops.properties.attribute_data[index] && this.state.defaultdrops.properties.attribute_data[index].label === "" ? disabledive : {} : {}}
                                                                        >
                                                                            <span>{alphabet[index]}</span>
                                                                            <input
                                                                                type="text"
                                                                                name="name"
                                                                                value={this.state.fieldprops.properties.attribute_data[index].label}
                                                                                className="mediumfm mx-2"
                                                                                onChange={e => this.attributeChangeEvent(e, index)}
                                                                            />
                                                                            <div className="addimgs"
                                                                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                                                                <i className="fa fa-trash pl-0" onClick={() => this.deleteAttribute(index)} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }.bind(this)
                                                    )
                                                    : ""}

                                                <div className="options"
                                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                >
                                                    <div className="addmoreimage addmoreimage-big" onClick={() => this.addAttributefun()}>
                                                        {" "}
                                                        <i className="fa fa-plus" /> Add Attribute{" "}
                                                    </div>
                                                </div>

                                                <div style={{ height: "20px" }}></div>
                                                <h3>Maximum Attributes</h3>
                                                <div style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                                    <Select
                                                        placeholder={'Maximum Attributes'}
                                                        value={this.state.fieldprops.properties.Maximum_Attributes}
                                                        options={this.state.maximumAttribute}
                                                        onChange={e => this.handleAttribute(e, "Maximum_Attributes")}
                                                        name="Maximum_Attributes"
                                                        className="language_list"
                                                    />
                                                    <h3>Attributes Per Task</h3>
                                                    <Select
                                                        placeholder={'Attributes Per Task'}
                                                        value={this.state.fieldprops.properties.Attribute_PerTask}
                                                        options={this.state.attributePerTask}
                                                        onChange={e => this.handleAttribute(e, "Attribute_PerTask")}
                                                        name="Attribute_PerTask"
                                                        className="language_list"
                                                    />
                                                    <h3>Repeate Attribute</h3>
                                                    <Select
                                                        placeholder={'Repeate Attribute'}
                                                        value={this.state.fieldprops.properties.Repeate_Attribute}
                                                        options={this.state.repeatAttribute}
                                                        onChange={e => this.handleAttribute(e, "Repeate_Attribute")}
                                                        name="Repeate_Attribute"
                                                        className="language_list"
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                {this.state.fieldprops.properties.scale_enabled ? (
                                    <div>
                                        <label>Instruction Text </label>
                                        <input type="text" name="name" value={this.state.fieldprops.properties.scale_text} className="mediumfm" onChange={e => this.scale_text(e, "scale_text")} />

                                        <div className="parent-od-newtxt">
                                            <p className="newtxt">
                                                <span>Scale 1 of</span>
                                                <input type="number" min="0" value={this.state.fieldprops.properties.addscale} onChange={e => this.addscale(e, "addscale")} />{" "}
                                            </p>
                                        </div>
                                        {scale_images
                                            ? Object.keys(scale_images).map(
                                                function (key, index) {
                                                    return (
                                                        <div key={index} className="twocol dropboxer">
                                                            <div className="dropper">
                                                                <label>
                                                                    Scale {index + 1} of {scale_len}
                                                                </label>
                                                                <StyledDropZone accept={"image/png, image/gif, image/jpeg, image/*"} children="Scale upload image" onDrop={this.onDrop.bind(this, "scale_images", key, "")} />
                                                            </div>
                                                            {scale_images[`${key}`].image ? (
                                                                <div className="dropperprev">
                                                                    <img width="50" height="50" alt="scale" src={scale_images[`${key}`].image} />
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    );
                                                }.bind(this)
                                            )
                                            : ""}
                                    </div>
                                ) : (
                                    false
                                )}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Scale Status</h3>
                            <div className="belownewtext clearfix">
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={this.state.fieldprops.properties.scale_stats === "hide"}
                                        name="scale_stats"
                                        onChange={e => this.updateprops(e, "scale_stats")}
                                    />
                                    <label>Hide</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={this.state.fieldprops.properties.scale_stats === "show"}
                                        name="scale_stats"
                                        onChange={e => this.updateprops(e, "scale_stats")}
                                    />
                                    <label>Show</label>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        );

        const getListStyle = isDraggingOver => ({
            background: isDraggingOver ? '' : '',
        });

        const choice = (
            <div>
                <div className={boardval}>
                    <div className="properties-main-header clear">
                        <p>Choice question Properties</p>
                        <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                    </div>
                    <div className="properties-body-tab">
                        <ul>
                            <li>
                                <Select
                                    placeholder={'select Language'}
                                    value={this.state.currentlanguage}
                                    options={this.state.selectedlanguage}
                                    onChange={this.handlelanguageChange.bind(this, 'language')}
                                    name="language"
                                    className="language_list"
                                />
                            </li>
                            <li>
                                <h3>Question Text</h3>
                                <div className="below-lanbel-body"
                                    style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.question === ("" || null || undefined) ? disabledive : {} : {}}
                                >
                                    <ReactQuill
                                        ref={this.quillRef}
                                        className="quillEditor"
                                        value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                        inlineStyles="true"
                                        modules={this.modules_minimal}
                                        formats={this.formats}
                                        onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                        onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                        onChange={(html, delta, source) => {
                                            // const containsImage = html.includes('<img');
                                            // if (containsImage) {
                                            //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                            //     return
                                            // }
                                            if (source === 'user') {
                                                this.inputquestion(html, "inputquestion")
                                            }
                                        }}
                                    // onChange={e => this.updateprops(e, "inputquestion")}
                                    />
                                    {/* <input type="text" name="name" className="mediumfm" onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.fieldprops.properties.question} onChange={e => this.updateprops(e, "inputquestion")} />
                                    <label> Type your questions </label> */}
                                </div>
                            </li>
                            <li>
                                <h3>Name</h3>
                                <div className="below-lanbel-body"
                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                >
                                    <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                    <label> Edit your Name </label>
                                </div>
                            </li>

                            <li>
                                <h3>Sub Heading</h3>
                                <div className="below-lanbel-body"
                                    style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === ("" || null || undefined) ? disabledive : {} : {}}
                                >
                                    <ReactQuill
                                        className="quillEditor"
                                        value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                        inlineStyles="true"
                                        modules={this.modules_minimal}
                                        formats={this.formats}
                                        onChange={(html, delta, source) => {
                                            // const containsImage = html.includes('<img');
                                            // if (containsImage) {
                                            //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                            //     return
                                            // }
                                            if (source === 'user') {
                                                this.inputsubheading(html, "inputsubheading")
                                            }
                                        }}
                                        onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                    // onChange={e => this.updateprops(e, "inputsubheading")}
                                    />
                                    {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} />
                                    <label> Add a sub heading below main title. </label> */}
                                </div>
                            </li>
                            <li
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <h3>Ref Code</h3>
                                <div className="below-lanbel-body">
                                    <input type="text" name="name"
                                        value={this.state.fieldprops.properties.refcode}
                                        className="mediumfm"
                                        style={{ width: '70%', marginRight: '2%' }}
                                        disabled={this.state.disabled}
                                        onBlur={(e) => this.ValidateRefCode(e, 'refcodevalidate')}
                                        onChange={e => this.updaterefcode(e, "refcodechange")}
                                    />
                                    <div className="addmoreimage addmoreimage-big"
                                        onClick={() => this.setState({ disabled: false })}
                                    > Ref Code
                                    </div>
                                </div>
                            </li>
                            <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                <div>
                                    <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Product Number</h3>
                                    <Select
                                        placeholder={'select Product Number'}
                                        value={this.state.fieldprops.properties.currentProductNumber}
                                        options={this.state.productNumber}
                                        onChange={e => this.handleProductNumberChange(e, "productNumber")}
                                        name="productNumber"
                                        className="language_list"
                                    />
                                    <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Question Group</h3>
                                    <Select
                                        placeholder={'select Question Group'}
                                        value={this.state.fieldprops.properties.currentQuestionGroup}
                                        options={this.state.questionGroup}
                                        onChange={e => this.handleQuestionGroupChange(e, "questionGroup")}
                                        name="questionGroup"
                                        className="language_list"
                                    />
                                    <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 1`}</h3>
                                    <Select
                                        placeholder={`select Question Sub Group 1`}
                                        value={this.state.fieldprops.properties.currentQuestionSubGroup1}
                                        options={this.getSubGroupArray(1)}
                                        onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup1`)}
                                        name="currentQuestionSubGroup"
                                        className="language_list"
                                    />
                                    <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 2`}</h3>
                                    <Select
                                        placeholder={`select Question Sub Group 2`}
                                        value={this.state.fieldprops.properties.currentQuestionSubGroup2}
                                        options={this.getSubGroupArray(2)}
                                        onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup2`)}
                                        name="currentQuestionSubGroup"
                                        className="language_list"
                                    />
                                    <h3>Comments</h3>
                                    <div className="below-lanbel-body" style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                        <input type="text" name="productNum" className="mediumfm" value={this.state.fieldprops.properties.productNumber ? this.state.fieldprops.properties.productNumber : ""} onChange={e => this.inputtypeProductNum(e, "inputtypeProductNum")} />
                                    </div>
                                </div>
                            </li>
                            <li
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                        style={MandatoryStyle ? disabledive : {}}
                                    >
                                        <div className="switch-textboxes xtboxestext">Mandatory</div>
                                        <div className="switches-boxes">
                                            <Switch checked={Boolean(this.state.fieldprops.properties.mandatory)} onChange={this.mandatory("mandatory")} value="mandatory" color="primary" />
                                        </div>
                                        {MandatoryStyle && <label className="mandatory-disable" >Disabled : Trigger Question</label>}
                                    </div>
                                    <label> Prevent submission if this question is empty. </label>
                                </div>
                            </li>

                            <li
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <div className="switch-textboxes xtboxestext">No Return</div>
                                        <div className="switches-boxes">
                                            <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <h3>Randomize Question Group Number</h3>
                                <Select
                                    placeholder={'select Randomize Group Number'}
                                    value={this.getSelectedRandomizeGroupName(this.state.fieldprops.group_number)}
                                    options={this.state.randomizedOptions}
                                    onChange={(e) => this.RandomizeGroupName(e)}
                                    name="language"
                                    className="language_list"
                                />
                            </li>

                            <li
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <div className="switch-textboxes xtboxestext">Display Other Option</div>
                                        {/* {this.state.fieldprops.properties.other!==undefined?
                                        <div className="switches-boxes" style={this.state.fieldprops.properties.display_type==="dropdown"?disabledive:null}>
                                                <Switch checked={this.state.fieldprops.properties.other} onChange={this.handleChange("other")} value="<p>other</p>" color="primary" />
                                        </div>:
                                        <div className="switches-boxes" style={this.state.fieldprops.properties.display_type==="dropdown"?disabledive:null}>
                                        <Switch checked={this.state.fieldprops.properties.other} onChange={this.handleChange("other")} value="<p>other</p>" color="primary" />
                                </div>
                                        } */}
                                        <div className="switches-boxes" style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                            <Switch checked={Boolean(this.state.fieldprops.properties.other)} onChange={this.other("other")} value="<p>other</p>" color="primary" />
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <h3>Display Type</h3>
                                        <div className="twocol">
                                            <div className="switch-textboxes">
                                                <div className="radio-box">
                                                    <input type="radio" value="choice" checked={this.state.fieldprops.properties.display_type === "choice"} onChange={this.displayChange} />
                                                    <label>Choice</label>
                                                </div>
                                            </div>
                                            <div className="switch-textboxes">
                                                <div className="radio-box">
                                                    <input type="radio" value="dropdown" checked={this.state.fieldprops.properties.display_type === "dropdown"} onChange={this.displayChange} />
                                                    <label>Dropdown</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}} >
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <h3>Choice Type</h3>
                                        <div className="twocol" style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                            <div className="switch-textboxes">
                                                <div className="radio-box">
                                                    <input type="radio" value="single" checked={this.state.fieldprops.properties.choice_type === "single"} onChange={this.radioChange} />
                                                    <label>Single</label>
                                                </div>
                                            </div>
                                            <div className="switch-textboxes">
                                                <div className="radio-box">
                                                    <input type="radio" value="multiple" checked={this.state.fieldprops.properties.choice_type === "multiple"} onChange={this.radioChange} />
                                                    <label>Multiple</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <div className="switch-textboxes xtboxestext"
                                            style={(this.state.currentlanguage.value !== "English" || this.state.fieldprops.properties.display_type === "dropdown") ? disabledive : {}}
                                        >Random Options</div>
                                        <div className="switches-boxes"
                                            style={(this.state.currentlanguage.value !== "English" || this.state.fieldprops.properties.display_type === "dropdown") ? disabledive : {}}
                                        >
                                            <Switch checked={Boolean(this.state.fieldprops.properties.random)}
                                                onChange={this.random("random")} value="random" color="primary" />
                                        </div>
                                    </div>
                                </div>
                            </li>

                            <li>
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <div className="switch-textboxes xtboxestext"
                                            style={(this.state.currentlanguage.value !== "English" || this.state.fieldprops.properties.display_type === "dropdown") ? disabledive : {}}
                                        >Set Selection Limit</div>
                                        <div className="switches-boxes"
                                            style={(this.state.currentlanguage.value !== "English" || this.state.fieldprops.properties.display_type === "dropdown") ? disabledive : {}}
                                        >
                                            <Switch checked={Boolean(this.state.fieldprops.properties.setlimit)}
                                                onChange={this.setlimit('setlimit')} value="setlimit" color="primary" />
                                        </div>
                                    </div>
                                    <div>
                                        {this.state.fieldprops.properties.setlimit == 1 ? (
                                            <div>
                                                <div className="radioForm clearfix radioSetLimit"
                                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                >
                                                    <div className="block">
                                                        <input type="radio" value="noneofabove" checked={this.state.fieldprops.properties.setlimit_type === "noneofabove"}
                                                            onChange={this.setLimitRadioChange} />
                                                        <span>None Of Above</span>
                                                    </div>
                                                    <div className="block">
                                                        <input type="radio" value="setminmaxlimit" checked={this.state.fieldprops.properties.setlimit_type === "setminmaxlimit"}
                                                            style={(this.state.fieldprops.properties.choice_type == "single" || this.state.fieldprops.properties.multilevel == 1) ? disabledive : {}}
                                                            onChange={this.setLimitRadioChange} />
                                                        <span style={(this.state.fieldprops.properties.choice_type == "single" || this.state.fieldprops.properties.multilevel == 1) ? disabledive : {}}>Set Limit</span>
                                                    </div>
                                                </div>

                                                {this.state.fieldprops.properties.setlimit_type === "setminmaxlimit" ? (
                                                    <div className="newdivlabp clear clearfix"
                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                    >
                                                        <div className="scaletxt newdivsetlimit clear clearfix">
                                                            <p className="newtxt">
                                                                <span style={(this.state.fieldprops.properties.choice_type == "single" || this.state.fieldprops.properties.multilevel == 1) ? disabledive : {}}>MIN</span>
                                                                <input
                                                                    style={(this.state.fieldprops.properties.choice_type == "single" || this.state.fieldprops.properties.multilevel == 1) ? disabledive : {}}
                                                                    type="number"
                                                                    value={this.state.fieldprops.properties.minlimit}
                                                                    name="setlimitmin"
                                                                    onChange={e => this.setMinLimitOption(e)}
                                                                />
                                                            </p>
                                                            <p className="newtxt">
                                                                <span style={(this.state.fieldprops.properties.choice_type == "single" || this.state.fieldprops.properties.multilevel == 1) ? disabledive : {}}>MAX</span>
                                                                <input
                                                                    style={(this.state.fieldprops.properties.choice_type == "single" || this.state.fieldprops.properties.multilevel == 1) ? disabledive : {}}
                                                                    disabled={this.state.fieldprops.properties.minlimit >= 0 ? "" : "disabled"}
                                                                    type="number"
                                                                    value={this.state.fieldprops.properties.maxlimit}
                                                                    name="setlimitmax"
                                                                    onChange={e => this.setMaxLimitOption(e)}
                                                                />
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : ""}
                                            </div>
                                        ) : ""}
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="below-lanbel-body">
                                    <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                        <h3
                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                        >Options</h3>
                                        <h3
                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                        >Image Size</h3>
                                        <div className="twocol"
                                            style={this.state.currentlanguage.value !== "English" ?
                                                disabledive : this.state.fieldprops.properties.multilevel ?
                                                    this.state.fieldprops.properties.multilevel === 1 ?
                                                        disabledive : {} : {}
                                            }
                                        >
                                            <div className="switch-textboxes" style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                                <div className="radio-box">
                                                    <input type="radio"
                                                        value="small"
                                                        checked={this.state.fieldprops.properties.image_size ?
                                                            this.state.fieldprops.properties.image_size === "small" :
                                                            true}
                                                        onChange={this.imagesize_Change}
                                                    />
                                                    <label>Small</label>
                                                </div>
                                            </div>
                                            <div className="switch-textboxes" style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                                <div className="radio-box">
                                                    <input type="radio"
                                                        value="medium"
                                                        checked={this.state.fieldprops.properties.image_size &&
                                                            this.state.fieldprops.properties.image_size === "medium"}
                                                        onChange={this.imagesize_Change}
                                                    />
                                                    <label>Medium</label>
                                                </div>
                                            </div>
                                            <div className="switch-textboxes" style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                                <div className="radio-box">
                                                    <input type="radio"
                                                        value="large"
                                                        checked={this.state.fieldprops.properties.image_size &&
                                                            this.state.fieldprops.properties.image_size === "large"}
                                                        onChange={this.imagesize_Change}
                                                    />
                                                    <label>Large</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="switch-textboxes xtboxestext"
                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                        >Multilevel</div>
                                        <div className="switches-boxes"
                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                        >
                                            <div style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                                <Switch checked={Boolean(this.state.fieldprops.properties.multilevel)}
                                                    onChange={this.multilevel("multilevel")} value="multilevel" color="primary"
                                                    disabled={this.props.mappingProfileEnable == true}
                                                />
                                            </div>
                                        </div>
                                        <div className="clearfix" />

                                        {this.props.mappingProfileEnable == true &&
                                            <div className="mt-3">
                                                <h3 className={"required-field"}>Select Group</h3>
                                                <Select
                                                    placeholder={'select group'}
                                                    value={this.state.fieldprops.properties.selectedChoiceGroup}
                                                    options={createChoiceGrpArray}
                                                    onChange={e => this.handleselectedChoiceGroup(e, "selectedChoiceGroup")}
                                                    name="selectedChoiceGroup"
                                                    className="language_list"
                                                />
                                            </div>
                                        }

                                        <DragDropContext onDragEnd={(result) => this.onDragEnd(result)}>
                                            <Droppable droppableId="ChoiceOptionDropable">
                                                {(provided, snapshot) => (
                                                    <ul style={getListStyle(snapshot.isDraggingOver)} ref={provided.innerRef} {...provided.droppableProps} className="droppable-area">
                                                        {this.state.fieldprops.properties.options && this.state.fieldprops.properties.options.length > 0 &&
                                                            this.state.fieldprops.properties.options.map((value, index) => (
                                                                <Draggable
                                                                    isDragDisabled={this.state.currentlanguage.value !== "English"}
                                                                    draggableId={value.id.toString()}
                                                                    key={value.id}
                                                                    index={index}
                                                                >
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                opacity: snapshot.isDragging ? 0.5 : 1,
                                                                                ...provided.draggableProps.style
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    opacity: snapshot.isDragging ? 0.5 : 1,
                                                                                }}
                                                                                className="twocol dropboxer"
                                                                            >
                                                                                <div className="choicedropper dropper">
                                                                                    <div className="parentlabel clear clearfix"
                                                                                        style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops.properties.options && this.state.defaultdrops.properties.options[index] && this.state.defaultdrops.properties.options[index].label === "" ? disabledive : {} : {}}
                                                                                    >
                                                                                        <span>{alphabet[index]}</span>
                                                                                        <ReactQuill
                                                                                            style={this.props.mappingProfileEnable == true ? disabledive : {}}
                                                                                            className={`${this.state.fieldprops.properties.multilevel ? 'multichoicequill' : 'choicequill'} ${'quillEditor'}`}
                                                                                            value={this.state.fieldprops.properties.options[index].label_text ? this.state.fieldprops.properties.options[index].label_text : this.state.fieldprops.properties.options[index].label ? this.state.fieldprops.properties.options[index].label : ""}
                                                                                            inlineStyles="true"
                                                                                            modules={this.modules_minimal}
                                                                                            formats={this.formats}
                                                                                            onChange={(html, delta, source) => {
                                                                                                // const containsImage = html.includes('<img');
                                                                                                // if (containsImage) {
                                                                                                //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                                                                                //     return
                                                                                                // }
                                                                                                if (source === 'user') {
                                                                                                    this.label(html, "label", index)
                                                                                                }
                                                                                            }}
                                                                                            onBlur={() => this.handleOnBlurData("CHOICELABLE", index)}
                                                                                        //  onChange={e => this.updateprops(e, "label", index)}
                                                                                        />

                                                                                        {this.state.fieldprops.properties.multilevel ?
                                                                                            <img onClick={() => this.showHide(index)} className="expandArrow" src={this.state.show[index] ? ExpandArrow : CollapseArrow} alt="expandArrow" />
                                                                                            : ""}
                                                                                        {/* <input
                                                                        type="text"
                                                                        name="name"
                                                                        className="mediumfm"
                                                                        placeholder={value.id === 'other' ? 'other' : ''}
                                                                        value={this.state.fieldprops.properties.options[index].label}
                                                                        onChange={e => this.updateprops(e, "label", index)}
                                                                    /> */}

                                                                                        <div className="wrap-upload-delete"
                                                                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                                                        >
                                                                                            <div style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                                                                                <StyledDropZone accept={"image/png, image/gif, image/jpeg, image/*"} children="upload" onDrop={this.onDrop.bind(this, "parenlabel_image", index, "")} />
                                                                                            </div>
                                                                                            <div className="addimgs"
                                                                                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}

                                                                                            >
                                                                                                {(value.id !== 'other' && value.id !== 'noneofabove') ? <i className="fa fa-trash" onClick={() => this.deletefun(index, "parentlabel")} /> : ""}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    {this.state.fieldprops.properties.multilevel === 1 ? (
                                                                                        <div className={`${'sublabel'} ${this.state.show[index] ? 'd-none' : 'd-block'}`}>
                                                                                            {this.state.fieldprops.properties.options && this.state.fieldprops.properties.options[index].sublabel &&
                                                                                                this.state.fieldprops.properties.options[index].sublabel instanceof Array
                                                                                                ? this.state.fieldprops.properties.options[index].sublabel.map(
                                                                                                    function (value, key) {
                                                                                                        return (
                                                                                                            <div className="clear clearfix"
                                                                                                                key={key}
                                                                                                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops.properties.options && this.state.defaultdrops.properties.options[index] && this.state.defaultdrops.properties.options[index].sublabel && this.state.defaultdrops.properties.options[index].sublabel[key].sublabel === "" ? disabledive : {} : {}}
                                                                                                            >
                                                                                                                <ReactQuill
                                                                                                                    className="quillEditor"
                                                                                                                    value={this.state.fieldprops.properties.options[index].sublabel[key].sublabel_text ? this.state.fieldprops.properties.options[index].sublabel[key].sublabel_text : this.state.fieldprops.properties.options[index].sublabel[key].sublabel ? this.state.fieldprops.properties.options[index].sublabel[key].sublabel : ""}
                                                                                                                    inlineStyles="true"
                                                                                                                    modules={this.modules_minimal}
                                                                                                                    formats={this.formats}
                                                                                                                    onChange={(html, delta, source) => {
                                                                                                                        // const containsImage = html.includes('<img');
                                                                                                                        // if (containsImage) {
                                                                                                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                                                                                                        //     return
                                                                                                                        // }
                                                                                                                        if (source === 'user') {
                                                                                                                            this.childlabel(html, "childlabel", index, key)
                                                                                                                        }
                                                                                                                    }}
                                                                                                                    onBlur={() => this.handleOnBlurData("CHOICESUBLABLE", index, key)}
                                                                                                                // onChange={e => this.updateprops(e, "childlabel", index,key)}
                                                                                                                />
                                                                                                                {/* <input
                                                                                                type="text"
                                                                                                name="name"
                                                                                                className="mediumfm"
                                                                                                placeholder={value.id === 'other' ? 'other' : ''}
                                                                                                value={this.state.fieldprops.properties.options[index].sublabel[key].sublabel}
                                                                                                onChange={e => this.updateprops(e, "childlabel", index, key)}
                                                                                            /> */}

                                                                                                                <div className="wrap-upload-delete"
                                                                                                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                                                                                >
                                                                                                                    <div style={this.state.fieldprops.properties.display_type === "dropdown" ? disabledive : null}>
                                                                                                                        <StyledDropZone accept={"image/png, image/gif, image/jpeg, image/*"} children="upload" onDrop={this.onDrop.bind(this, "sublabel_image", index, key)} />
                                                                                                                    </div>
                                                                                                                    <div className="addimgs"
                                                                                                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}

                                                                                                                    >
                                                                                                                        {(value.id !== 'other' && value.id !== 'noneofabove') ? <i className="fa fa-trash" onClick={() => this.deletefun(index, "childlabel", key)} /> : ""}
                                                                                                                    </div>
                                                                                                                    {/* <img src={value.label_image} alt="label" width="50" /> */}
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        );
                                                                                                    }.bind(this)
                                                                                                )
                                                                                                :
                                                                                                ""}
                                                                                            {value.id !== 'other' &&
                                                                                                <div className="addmoreimage"
                                                                                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                                                                                    onClick={() => this.addfun("suboptions", index)}>
                                                                                                    {" "}
                                                                                                    <i className="fa fa-plus" /> Add{" "}
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                    ) : (
                                                                                        ""
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                        {provided.placeholder}
                                                    </ul>
                                                )}
                                            </Droppable>
                                        </DragDropContext>


                                        {this.state.fieldprops.properties.options
                                            ? this.state.fieldprops.properties.options.map(
                                                function (value, index) {
                                                    return (
                                                        <div className="twocol dropboxer" key={index}>
                                                        </div>
                                                    );
                                                }.bind(this)
                                            )
                                            : ""}
                                        <div className="options"
                                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                        >
                                            <div className="addmoreimage addmoreimage-big" onClick={() => this.addfun("options")}>
                                                <i className="fa fa-plus" /> Add{" "}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <h3>Choice Status</h3>
                                <div className="belownewtext clearfix">
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="hide"
                                            checked={this.state.fieldprops.properties.choice_stats === "hide"}
                                            name="choice_stats"
                                            onChange={e => this.updateprops(e, "choice_stats")}
                                        />
                                        <label>Hide</label>
                                    </span>
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="show"
                                            checked={this.state.fieldprops.properties.choice_stats === "show"}
                                            name="choice_stats"
                                            onChange={e => this.updateprops(e, "choice_stats")}
                                        />
                                        <label>Show</label>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div >
        );

        const barcode = (
            <div className={boardval}>
                <div className="properties-main-header clear">
                    <p>Barcode Properties</p>
                    <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                </div>
                <div className="properties-body-tab">
                    <ul>
                        <li>
                            <Select
                                placeholder={'select Language'}
                                value={this.state.currentlanguage}
                                options={this.state.selectedlanguage}
                                onChange={this.handlelanguageChange.bind(this, 'language')}
                                name="language"
                                className="language_list"
                            />
                        </li>
                        <li>
                            <h3>Question Text</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.question === ("" || null || undefined) ? disabledive : {} : {}}
                            >
                                <ReactQuill
                                    ref={this.quillRef}
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                    onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputquestion(html, "inputquestion")
                                        }
                                    }}
                                // onChange={e => this.updateprops(e, "inputquestion")}
                                />
                                {/* <input type="text" name="name" className="mediumfm" onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.fieldprops.properties.question} onChange={e => this.updateprops(e, "inputquestion")} />
                                <label> Type your questions </label> */}
                            </div>
                        </li>
                        <li>
                            <h3>Name</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                <label> Edit Your Name </label>
                            </div>
                        </li>

                        <li>
                            <h3>Sub Heading</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === ("" || null || undefined) ? disabledive : {} : {}}
                            >
                                <ReactQuill
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputsubheading(html, "inputsubheading")
                                        }
                                    }}
                                    onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                // onChange={e => this.updateprops(e, "inputsubheading")}
                                />
                                {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} />
                                <label> Add a sub heading below main title. </label> */}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Ref Code</h3>
                            <div className="below-lanbel-body">
                                <input type="text" name="name"
                                    value={this.state.fieldprops.properties.refcode}
                                    className="mediumfm"
                                    style={{ width: '70%', marginRight: '2%' }}
                                    disabled={this.state.disabled}
                                    onBlur={(e) => this.ValidateRefCode(e, 'refcodevalidate')}
                                    onChange={e => this.updaterefcode(e, "refcodechange")}
                                />
                                <div className="addmoreimage addmoreimage-big"
                                    onClick={() => this.setState({ disabled: false })}
                                > Ref Code
                                </div>
                            </div>
                        </li>

                        <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                            <div>
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Product Number</h3>
                                <Select
                                    placeholder={'select Product Number'}
                                    value={this.state.fieldprops.properties.currentProductNumber}
                                    options={this.state.productNumber}
                                    onChange={e => this.handleProductNumberChange(e, "productNumber")}
                                    name="productNumber"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>Question Group</h3>
                                <Select
                                    placeholder={'select Question Group'}
                                    value={this.state.fieldprops.properties.currentQuestionGroup}
                                    options={this.state.questionGroup}
                                    onChange={e => this.handleQuestionGroupChange(e, "questionGroup")}
                                    name="questionGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 1`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 1`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup1}
                                    options={this.getSubGroupArray(1)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup1`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3 className={mappingProfileEnable == true ? "required-field" : ""}>{`Sub Group 2`}</h3>
                                <Select
                                    placeholder={`select Question Sub Group 2`}
                                    value={this.state.fieldprops.properties.currentQuestionSubGroup2}
                                    options={this.getSubGroupArray(2)}
                                    onChange={e => this.handleQuestionSubGroupChange(e, `currentQuestionSubGroup2`)}
                                    name="currentQuestionSubGroup"
                                    className="language_list"
                                />
                                <h3>Comments</h3>
                                <div className="below-lanbel-body" style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                                    <input type="text" name="productNum" className="mediumfm" value={this.state.fieldprops.properties.productNumber ? this.state.fieldprops.properties.productNumber : ""} onChange={e => this.inputtypeProductNum(e, "inputtypeProductNum")} />
                                </div>
                            </div>
                        </li>

                        <li style={this.state.currentlanguage.value !== "English" ? disabledive : {}}>
                            <span className="validateclassradio">
                                <input
                                    type="radio"
                                    value="validate"
                                    checked={this.state.fieldprops.properties.validate === "validate"}
                                    //name="validate"
                                    onChange={e => this.updateprops(e, "validate")}
                                />
                                <label>Validate</label>
                            </span>
                            <span className="validateclassradio">
                                <input
                                    type="radio"
                                    value="identity"
                                    checked={this.state.fieldprops.properties.validate === "identity"}
                                    //name="validate"
                                    onChange={e => this.updateprops(e, "validate")}
                                />
                                <label>Identify</label>
                            </span>
                            <span className="validateclassradio">
                                <input
                                    type="radio"
                                    value="both"
                                    checked={this.state.fieldprops.properties.validate === "both"}
                                    //name="validate"
                                    onChange={e => this.updateprops(e, "validate")}
                                />
                                <label>Both</label>
                            </span>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={MandatoryStyle ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Mandatory</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.mandatory)} onChange={this.mandatory("mandatory")} value="mandatory" color="primary" />
                                    </div>
                                    {MandatoryStyle && <label className="mandatory-disable" >Disabled : Trigger Question</label>}
                                </div>
                                <label> Prevent submission if this question is empty. </label>
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">No Return</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li>
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">List of Barcodes</div>
                                    <div className="switches-boxes">
                                        <Switch
                                            checked={Boolean(this.state.fieldprops.properties.barcode_enabled)}
                                            onChange={this.barcode_enabled("barcode_enabled")}

                                            value="barcode enabled"
                                            color="primary"
                                        />
                                    </div>
                                </div>
                                {this.state.fieldprops.properties.barcode_enabled ? (
                                    <div
                                        style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                                    >
                                        <label>Barcode ID list (use commas to seperate ids) </label>
                                        <Textarea
                                            minRows={1}
                                            maxRows={10}
                                            value={this.state.fieldprops.properties.barcode_ids ? this.state.fieldprops.properties.barcode_ids.join(",") : ""}
                                            onChange={e => this.barcode_ids(e, "barcode_ids")}
                                            className="fullwidthgrey"
                                        />
                                    </div>
                                ) : (
                                    false
                                )}
                            </div>
                        </li>
                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>Barcode Status</h3>
                            <div className="belownewtext clearfix">
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={this.state.fieldprops.properties.barcode_stats === "hide"}
                                        name="barcode_stats"
                                        onChange={e => this.updateprops(e, "barcode_stats")}
                                    />
                                    <label>Hide</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={this.state.fieldprops.properties.barcode_stats === "show"}
                                        name="barcode_stats"
                                        onChange={e => this.updateprops(e, "barcode_stats")}
                                    />
                                    <label>Show</label>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        );

        const gps = (
            <div className={boardval}>
                <div className="properties-main-header clear">
                    <p>GPS Properties</p>
                    <i className="fa fa-save" onClick={() => this.handleClose("open1")} />
                </div>
                <div className="properties-body-tab">
                    <ul>
                        <li>
                            <Select
                                placeholder={'select Language'}
                                value={this.state.currentlanguage}
                                options={this.state.selectedlanguage}
                                onChange={this.handlelanguageChange.bind(this, 'language')}
                                name="language"
                                className="language_list"
                            />
                        </li>
                        <li>
                            <h3>Question Text</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.question === ("" || null || undefined) ? disabledive : {} : {}}
                            >
                                <ReactQuill
                                    ref={this.quillRef}
                                    className="quillEditor"
                                    value={this.state.fieldprops.properties.question_text ? this.state.fieldprops.properties.question_text : this.state.fieldprops.properties.question ? this.state.fieldprops.properties.question : ""}
                                    inlineStyles="true"
                                    modules={this.modules_minimal}
                                    formats={this.formats}
                                    onFocus={() => this.handleFocus(this.state.fieldprops.properties.question_text)}
                                    onBlur={() => this.handleBlur(this.state.fieldprops.properties.question_text)}
                                    onChange={(html, delta, source) => {
                                        // const containsImage = html.includes('<img');
                                        // if (containsImage) {
                                        //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                        //     return
                                        // }
                                        if (source === 'user') {
                                            this.inputquestion(html, "inputquestion")
                                        }
                                    }}
                                // onChange={e => this.updateprops(e, "inputquestion")}
                                />
                                {/* <input type="text" name="name" className="mediumfm" onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.fieldprops.properties.question} onChange={e => this.updateprops(e, "inputquestion")} /> */}
                                {/* <label> Type your questions </label> */}
                            </div>
                        </li>
                        <li>
                            <h3>Name</h3>
                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}

                            >
                                <input type="text" name="name" className="mediumfm" value={this.state.fieldprops.label} onChange={e => this.inputtypename(e, "inputtypename")} onBlur={e => this.onBlurName(e, "onBlurName")} />
                                <label> Edit Your Name </label>
                            </div>
                        </li>

                        <li>

                            <div className="below-lanbel-body"
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear"
                                    style={MandatoryStyle ? disabledive : {}}
                                >
                                    <div className="switch-textboxes xtboxestext">Mandatory</div>
                                    <div className="switches-boxes" style={this.state.fieldprops.properties.gps_stats === "hide" ? disabledive : null}>
                                        <Switch checked={Boolean(this.state.fieldprops.properties.mandatory)} onChange={this.mandatory("mandatory")} value="mandatory" color="primary" />
                                    </div>
                                    {MandatoryStyle && <label className="mandatory-disable" >Disabled : Trigger Question</label>}
                                </div>
                                <label> Prevent submission if this question is empty. </label>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <div className="below-lanbel-body">
                                <div className="switch-text-boxes switch-text-boxes-mandatory clear">
                                    <div className="switch-textboxes xtboxestext">No Return</div>
                                    <div className="switches-boxes">
                                        <Switch checked={Boolean(this.state.fieldprops.properties.noreturn)} onChange={this.noreturn("noreturn")} value="noreturn" color="primary" />
                                    </div>
                                </div>
                            </div>
                        </li>

                        <li
                            style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                        >
                            <h3>GPS Status</h3>
                            <div className="belownewtext clearfix">
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="hide"
                                        checked={this.state.fieldprops.properties.gps_stats === "hide"}
                                        name="gps_stats"
                                        onChange={e => this.updateprops(e, "gps_stats")}
                                    />
                                    <label>Hide</label>
                                </span>
                                <span className="widthfifty widththirty">
                                    <input
                                        type="radio"
                                        value="show"
                                        checked={this.state.fieldprops.properties.gps_stats === "show"}
                                        name="gps_stats"
                                        onChange={e => this.updateprops(e, "gps_stats")}
                                    />
                                    <label>Show</label>
                                </span>
                            </div>
                        </li>


                        {this.state.fieldprops.properties.gps_stats === "show" ? (
                            <li
                                style={this.state.currentlanguage.value !== "English" ? disabledive : {}}
                            >
                                <h3>Point Type</h3>
                                <div className="belownewtext clearfix">
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="map"
                                            checked={this.state.fieldprops.properties.point_type === "map"}
                                            name="point_type"
                                            onChange={e => this.updateprops(e, "point_type")}
                                        />
                                        <label>Map</label>
                                    </span>
                                    <span className="widthfifty widththirty">
                                        <input
                                            type="radio"
                                            value="coordinates"
                                            checked={this.state.fieldprops.properties.point_type === "coordinates"}
                                            name="point_type"
                                            onChange={e => this.updateprops(e, "point_type")}
                                        />
                                        <label>Coordinates</label>
                                    </span>
                                </div>
                            </li>
                        ) : (
                            ""
                        )}

                        {this.state.fieldprops.properties.gps_stats === "show" ? (
                            <li
                                style={this.state.currentlanguage.value !== "English" ? this.state.defaultdrops === undefined || this.state.defaultdrops.properties.subheading === "" ? disabledive : {} : {}}
                            >
                                <h3>Sub heading</h3>
                                <div className="below-lanbel-body">
                                    <ReactQuill
                                        className="quillEditor"
                                        value={this.state.fieldprops.properties.subheading_text ? this.state.fieldprops.properties.subheading_text : this.state.fieldprops.properties.subheading ? this.state.fieldprops.properties.subheading : ""}
                                        inlineStyles="true"
                                        modules={this.modules_minimal}
                                        formats={this.formats}
                                        onChange={(html, delta, source) => {
                                            // const containsImage = html.includes('<img');
                                            // if (containsImage) {
                                            //     this.showNotification("Image not allowed here. Please use information element image type to add image with information", "danger")
                                            //     return
                                            // }
                                            if (source === 'user') {
                                                this.inputsubheading(html, "inputsubheading")
                                            }
                                        }}
                                        onBlur={() => this.handleOnBlurData("SUBHEADING")}
                                    // onChange={e => this.updateprops(e, "inputsubheading")}
                                    />
                                    {/* <input type="text" name="name" value={this.state.fieldprops.properties.subheading} className="mediumfm" onChange={e => this.updateprops(e, "inputsubheading")} /> */}
                                    {/* <label> Add a sub heading below main title. </label> */}
                                </div>
                            </li>
                        ) : (
                            ""
                        )}

                        {/*this.state.fieldprops.properties.gps_stats === "show" ? (
                            <li>
                                <h3>Sub Label</h3>
                                <div className="below-lanbel-body">
                                    <input type="text" name="name" value={this.state.fieldprops.properties.sublabel} className="mediumfm" onChange={e => this.updateprops(e, "sublabel")} />
                                    <label> Add a small description below the input field. </label>
                                </div>
                            </li>
                         ) : (
                            ""
                        )*/}
                    </ul>
                </div>
            </div>

        );

        const type = this.props.type;

        const {
            isDragging,
        } = this.props
        const opacity = isDragging ? 0 : 1

        return (
            <div>{this.state.open === true ? (
                <div style={Object.assign({}, style, { opacity })}>
                    {type === "info"
                        ? info
                        : type === "input"
                            ? inputbox
                            : type === "button"
                                ? button
                                : type === "capture"
                                    ? capture
                                    : type === "choice"
                                        ? choice
                                        : type === "barcode"
                                            ? barcode
                                            : type === "scale"
                                                ? scale
                                                : type === "upload"
                                                    ? upload
                                                    : type === "gps"
                                                        ? gps
                                                        : false}
                </div>
            ) : (
                <div style={Object.assign({}, style, { opacity })}>
                    {type === "info"
                        ? info
                        : type === "input"
                            ? inputbox
                            : type === "button"
                                ? button
                                : type === "capture"
                                    ? capture
                                    : type === "choice"
                                        ? choice
                                        : type === "barcode"
                                            ? barcode
                                            : type === "scale"
                                                ? scale
                                                : type === "upload"
                                                    ? upload
                                                    : type === "gps"
                                                        ? gps
                                                        : false}
                </div>)}
                <Snackbar
                    place="bc"
                    color={msgColor}
                    open={br}
                    message={message}
                    closeNotification={() => this.setState({ br: false })}
                    close
                /></div>
        );
    }
}

export default Card;