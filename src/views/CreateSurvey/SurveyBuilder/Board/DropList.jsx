/**
 * DropList component
 * 
 * This component renders survey elements and its functional interfaces.
 *
 *
 */
import React from "react";
import Textarea from "react-textarea-autosize";
import placeholder from "assets/img/placeholder.png";
import barimg from "assets/img/barimg.jpg";
import "react-drop-zone/dist/styles.css";
import Confirm from "./Confirm";
import "@reach/dialog/styles.css";
import "react-quill/dist/quill.snow.css"; // ES6
import $ from 'jquery';
import Select from "react-select";

import Snackbar from "components/Snackbar/Snackbar.jsx";
const style = {
    cursor: 'move',
}

class DropList extends React.Component {
    constructor(props) {
        super(props);
        this.contentEditable = React.createRef();
        this.state = {
            open: false,
            fieldlabel: "",
            conditions: [],
            fieldprops: { properties: {} },
            disabled: true,
            duplicateRefCode: false,
            oldrefcode: "",
            editrefcode: false,
            selectedlanguage: [],
            currentlanguage: { label: "English", value: 'English' },
            defaultdrops: [],
            incomplete: [],
            MandatoryStyle: false,
            selectedOption: null,
            msgColor: "info",
            message: "",
            br: false,
        };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    /* Pre mount of conditions and old elements. */
    componentDidMount() {
        let fieldprops = this.props.oldprop;
        fieldprops.question_id = this.props.question_id;
        this.setState({
            open: false,
            conditions: this.props.oldconditions,
            fieldprops,
            selectedlanguage: this.props.selectedlanguage,
            defaultdrops: this.props.defaultdrops,
            incomplete: this.props.selectedlanguage,
        });
        //     if(this.props.dropcurrentlanguage.value !== "English"){
        //     this.completedvaluecheck(fieldprops)
        // }
    }

    componentWillReceiveProps(nextProps) {
        if (localStorage.getItem('updateProperties')) {
        }
        else {
            let rightStatus = nextProps.rightStatus ? nextProps.rightStatus : false;
            let Mandatory_style = false;
            if (rightStatus) {
                Mandatory_style = this.getMandatoryStyle(nextProps.labelprop)
            }
            let fieldprops = nextProps.labelprop;
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
    }

    handleFocus(event) {
        let fieldprops = this.state.fieldprops;
        let fieldans = fieldprops.properties;
        if (fieldans.question === "Type a question" || fieldans.question === "Type the message" || fieldans.question === "Type Information") {
            fieldans.question = ""
        }

        this.setState({ fieldprops: fieldprops });
    }

    /* Handles the event to update the props. */
    handleBlur(event) {
        if (event.target.value === "") {
            let fieldprops = this.state.fieldprops;
            let fieldans = fieldprops.properties;
            let message = fieldprops.type === "info" ? "" : fieldprops.type === "capture" ? "Type the message" : "Type a question";
            fieldans.question = message
            this.setState({ fieldprops: fieldprops });
        }
    }

    /* Handles element delete*/
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

    /* Handles the event to validate the value and return boolean value. */
    getMandatoryStyle(fieldprops) {
        let conditions = this.state.conditions;
        let style = false;
        if (conditions.length > 0) {
            conditions.forEach((condtion, index) => {
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
            })
        }
        if (style) {
            return true;
        } else {
            return false;
        }

    }

    /* Handles the open event of settings. */
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

    /* Handles the clone click. */
    handleClickOpen = e => {
        console.log(e)
    };

    /* Handles the close event of settings. */
    handleClose = e => {
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
                // if (this.state.currentlanguage.label !== 'English') {
                if (this.props.dropcurrentlanguage.label !== 'English') {
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
                // if (this.state.currentlanguage.label !== 'English') {
                if (this.props.dropcurrentlanguage.label !== 'English') {
                    this.props.changedroplanguage('English')
                }
            });
        }
    };

    /* Handles and return the element to move one step downward. */
    downArrow() {
        return (
            // this.state.currentlanguage.value === "English" && (
           this.props.dropcurrentlanguage.value === "English" && (
                <span>
                    <i
                        className="fas fa-arrow-down"
                        // style={{ marginTop: "-30px", marginRight: "15px" }}
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
            // this.state.currentlanguage.value === "English" && (
            this.props.dropcurrentlanguage.value === "English" && (
                <span>
                    <i
                        className="fas fa-arrow-up"
                        // style={{ marginTop: "-30px", marginRight: "40px" }}
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

    showNotification = (msg, color) => {
        $(".App-body").addClass("disabledContent");
        this.setState({
            message: msg,
            msgColor: color
        });

        let place = "br";
        var x = [];
        x[place] = true;
        this.setState(x);
    };

    saveUpdate = () => {
        this.props.autosave()
        localStorage.removeItem('updateProperties')
        this.setState({ br: false })
        this.handleClickOpen("open2")
        $('div').removeClass('disabledContent');
    }

    /* Handles the open event of settings.   */
    handleClickOpen = e => {
        if (localStorage.getItem('updateProperties')) {
            this.showNotification("You have unsaved changes in the current element.", "danger")
        }
        else {
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
        }

    };

    /* Handle the event to update the props.    */
    updateprops(e, i, index, key) {
        const evalu = e.target.value;
        if (i === "inputquestion") {
            let fieldprops = this.state.fieldprops;
            fieldprops.properties.question = evalu;
            this.setState({
                fieldprops
            });
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
        })
        // return this.state.currentlanguage.value === "English" &&
        return this.props.dropcurrentlanguage.value === "English" &&
            <span>
                {conditions.length === 0 ?
                    <span>
                        <i className="fa fa-trash" onClick={e => this.handleDelete(e)} />
                    </span>
                    :
                    <span>
                        {check.length > 0 ? (
                            <span>
                                <Confirm title={"delete " + this.props.labelprop.label} description="The Element is Assosiated with Conditions. Are you sure want to delete ?">
                                    {confirm => <i className="fa fa-trash" onClick={confirm(() => this.handleReset(this.state.fieldprops))} />}
                                </Confirm>
                            </span>
                        ) : (
                            <span>
                                <i className="fa fa-trash" onClick={e => this.handleDelete(e)} />
                            </span>
                        )}
                    </span>
                }
            </span>
    }

    /* Handles the event to update the element id to parent to handle delete.     */
    handleDelete(e) {
        this.props.deleteddrops(this.props.question_id);
    }

    /* Handle the event to clone button */
    cloneAction = (questionID, type) => {
        // return this.state.currentlanguage.value === "English" &&
        return this.props.dropcurrentlanguage.value === "English" &&
            <span onClick={() => this.handleCloneClick(questionID, type)}>
                <i className="far fa-clone" color="action" />
            </span>
    }
    handleCloneClick = (question_id, type) => {
        this.props.cloneDrop(question_id, type)
    }
    handleChoiceChange = selectedOption => {
        this.setState({ selectedOption });
    };
    render() {
        const info = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>  {React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea minRows={1} maxRows={10} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth"
                                    style={{ resize: "none" }} onFocus={this.handleFocus} readOnly />}

                            {this.state.fieldprops.properties.subheading_text ?
                                <>  {React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 0)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">{this.state.fieldprops.properties.info_text ?
                        <div className="quill editor" style={{ width: "100%" }}>
                            <div className="quill-contents ql-container ql-snow">
                                <div className="ql-editor">
                                    {React.createElement("div", { dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.info_text } })}
                                </div>
                            </div>
                        </div> : ""}</div>
                </div>
            </div>
        )

        const inputbox = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>{React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea minRows={1} maxRows={10} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth"
                                    style={{ resize: "none" }} onFocus={this.handleFocus} onBlur={this.handleBlur} readOnly />}
                            {this.state.fieldprops.properties.subheading_text ?
                                <>  {React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 1)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">
                        <input type="text" name="name" style={{ 'width': '100%' }} disabled size={this.state.fieldprops.properties.length} />
                        {this.state.fieldprops.properties.sublabel_text ?
                            <> {React.createElement("p", { className: 'flabel', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.sublabel_text } })}</>
                            : this.state.fieldprops.properties.sublabel ? <p className="flabel">{this.state.fieldprops.properties.sublabel}</p> : ""}
                    </div>
                </div>
            </div>
        )

        const upload = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>{React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea minRows={1} maxRows={10} onFocus={this.handleFocus} onBlur={this.handleBlur} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth" style={{ resize: "none" }} readOnly />}

                            {this.state.fieldprops.properties.subheading_text ?
                                <>  {React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 6)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">
                        <input type="file" name="name" disabled />
                        <p className="flabel">{this.state.fieldprops.properties.sublabel}</p>
                    </div>
                </div>
            </div>
        )

        const capture = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>{React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea onFocus={this.handleFocus} onBlur={this.handleBlur} minRows={1} maxRows={10} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth" style={{ resize: "none" }} readOnly />}
                            {this.state.fieldprops.properties.subheading_text ?
                                <>  {React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 4)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">
                        <div className="text-center">
                            <img src={placeholder} width="80" alt="placeholder" />
                        </div>
                    </div>
                </div>
            </div>
        )

        const scale = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>{React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea onFocus={this.handleFocus} onBlur={this.handleBlur} minRows={1} maxRows={10} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth" style={{ resize: "none" }} readOnly />}
                            {this.state.fieldprops.properties.subheading_text ?
                                <>  {React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 5)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">
                        <div className="text-center">
                            <img src={placeholder} width="80" alt="placeholder" />
                        </div>
                    </div>
                </div>
            </div>
        )

        const choice = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>{React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea onFocus={this.handleFocus} onBlur={this.handleBlur} minRows={1} maxRows={10} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth" style={{ resize: "none" }} readOnly />}
                            {this.state.fieldprops.properties.subheading_text ?
                                <>  {React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 8)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">
                        {this.state.fieldprops.properties.display_type === "dropdown" && this.state.fieldprops.properties.options ?
                            <Select
                                placeholder={'Select Option'}
                                value={this.state.selectedOption}
                                options={
                                    this.state.fieldprops.properties.options.map((e, key) => ({
                                        label: e.label,
                                        value: e.id,
                                    }))
                                }
                                //   options={
                                //     this.state.fieldprops.properties.options.map((e, key) => ({
                                //         label:<span dangerouslySetInnerHTML={{ __html: e.label_text }} />,
                                //         value: e.id,
                                //  }))
                                onChange={this.handleChoiceChange}
                                name="language"
                                className="language_list"
                            />
                            : <div className="option option-checkbox">
                                {this.state.fieldprops.properties.options ? (
                                    <ul className="clear">
                                        {this.state.fieldprops.properties.options.map(
                                            function (value, index) {
                                                return (
                                                    <li key={index}>
                                                        {this.state.fieldprops.properties.choice_type === "multiple" ? <input type="checkbox" /> : <input name="choice" type="radio" />}{" "}
                                                        <img src={value.label_image} alt="label" />
                                                        {React.createElement("div", { className: 'choicelabel', dangerouslySetInnerHTML: { __html: value.label_text ? value.label_text : value.label } })}

                                                        <div className="parent-of-child-class clear">
                                                            {value.sublabel && value.sublabel instanceof Array
                                                                ? value.sublabel.map(
                                                                    function (subval, key) {
                                                                        return (
                                                                            <div key={key}>
                                                                                {this.state.fieldprops.properties.choice_type === "multiple" ? <input type="checkbox" /> : <input name="choice" type="radio" />}{" "}
                                                                                <img src={subval.label_image} alt="label" />
                                                                                {React.createElement("div", { className: 'choicelabel', dangerouslySetInnerHTML: { __html: subval.sublabel_text ? subval.sublabel_text : subval.sublabel } })}
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
                                        { /* this.state.fieldprops.properties.other === 1 ? (<li>
                                            {this.state.fieldprops.properties.choice_type === "single" ? <input name="choice" type="radio" /> : <input type="checkbox" />}
                                            Others
                                        </li>) : ("") */}
                                    </ul>
                                ) : (
                                    ""
                                )}
                            </div>}
                    </div>
                </div>
            </div>
        )

        const barcode = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>{React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea onFocus={this.handleFocus} onBlur={this.handleBlur} minRows={1} maxRows={10} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth" style={{ resize: "none" }} readOnly />}
                            {this.state.fieldprops.properties.subheading_text ?
                                <>{React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 7)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">
                        <div className="text-center">
                            <img src={barimg} width="80" alt="placeholder" />
                        </div>
                    </div>
                </div>
            </div>
        )

        const gps = (
            <div>
                <h4 className="labelheading">{this.state.fieldprops.label}</h4>
                <div className="bdrop" onDoubleClick={() => this.handleClickOpen("open2")}>
                    <div className="topbar">
                        <div className="label customlbl">
                            {this.state.fieldprops.properties.question_text ?
                                <>{React.createElement("div", { className: 'questionText', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.question_text ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question_text : "" } })}</>
                                : <Textarea onFocus={this.handleFocus} onBlur={this.handleBlur} minRows={1} maxRows={10} value={this.state.fieldprops.properties.question ? this.state.fieldprops.question_id + '_' + this.state.fieldprops.properties.question : ""} onChange={e => this.updateprops(e, "inputquestion")} className="fullwidth" style={{ resize: "none" }} readOnly />}
                            {this.state.fieldprops.properties.subheading_text ?
                                <>{React.createElement("h6", { className: 'subheading', dangerouslySetInnerHTML: { __html: this.state.fieldprops.properties.subheading_text } })}</>
                                : this.state.fieldprops.properties.subheading ? <h6 className="subheading">{this.state.fieldprops.properties.subheading}</h6> : ""}
                            <div className="arrowstyl">
                                {this.upArrow()}
                                {this.downArrow()}
                            </div>
                        </div>
                        <div className="actions">
                            <span onClick={() => this.handleClickOpen("open2")}>
                                <i className="fa fa-cog" />
                            </span>
                            {this.cloneAction(this.state.fieldprops.question_id, 3)}
                            {this.deleteAlert()}
                        </div>
                    </div>
                    <div className="field">
                        <div className="text-center">
                            <i className="fa fa-map-marker" />
                        </div>
                    </div>
                </div>
            </div>
        )

        const type = this.props.type;
        const { msgColor, br, message } = this.state;
        const { isDragging } = this.props
        const opacity = isDragging ? 0 : 1
        return (
            <>
                <div style={Object.assign({}, style, { opacity })}>
                    {type === "info"
                        ? info
                        : type === "input"
                            ? inputbox
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
                <div>
                    <Snackbar
                        place="bc"
                        color={msgColor}
                        open={br}
                        update={true}
                        message={message}
                        saveUpdate={() => this.saveUpdate()}
                        closeNotification={() => { this.setState({ br: false }); $('div').removeClass('disabledContent') }}
                        close
                    />
                </div>
            </>
        )
    }
}


export default DropList