/**
 * @settings is to do conditional statements.
 *
 * @author
 */
import React from "react";
import { withStyles } from "@material-ui/core/styles";
// Survey Pages
import "./CreateSurvey.css";

// API
import api2 from ".../../helpers/api2";

import Select from "react-select";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import { setTimeout } from "timers";
import cloneDeep from 'lodash/cloneDeep';

const styles = theme => ({
    root: {
        width: "100%"
    },
    backButton: {
        marginRight: theme.spacing.unit
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
    card: {
        minWidth: "90%"
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)"
    },
    title: {
        marginBottom: 16,
        fontSize: 14
    },
    pos: {
        marginBottom: 12
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    stepIcon: {
        color: "#d15c17"
    },
    checked: {}
});

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validate: 0,
            condtioncount: [],
            conditions: [],
            drops: [],
            msgColor: "info",
            message: "",
            br: false,
            oldconditions: [],
            languagelist: [],
            value: false,
            missions: [],
            projects: [],
            projectSource: [],
            rangeStartElement: [],
        };

        this.addCondtion = this.addCondtion.bind(this);
        this.deleteCondtion = this.deleteCondtion.bind(this);
        this.deleteSource = this.deleteSource.bind(this);
        this.addNewCondtions = this.addNewCondtions.bind(this);
        this.addMultiSource = this.addMultiSource.bind(this);
    }

    componentDidMount() {
        this.getProjectList();
        let conditions = this.props.oldconditions;
        for (var i = 0; i < this.props.oldconditions.length; i++) {
            let source = this.props.oldconditions[i].source;
            let sourceArray = [];

            if (!(source instanceof Array)) {
                sourceArray.push(source);
                conditions[i].source = sourceArray;
            }

        }
        this.setState({
            conditions: conditions,
            drops: this.props.drops,
            oldconditions: cloneDeep(conditions),
            languagelist: this.props.selectedlanguage,
        });
    }

    getProjectList() {
        var self = this;
        api2
            .get("projects")
            .then(resp => {
                let proj = [];
                resp.data.forEach((x, i) => {
                    proj.push({ value: x.id, label: x.project_name });
                });
                self.setState({
                    projectSource: resp.data,
                    projects: proj
                });
            })
            .catch(error => {
                console.error(error);
                // self.setState({
                //   response: true
                // });
            });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            conditions: nextProps.oldconditions,
            drops: nextProps.drops,
            languagelist: nextProps.selectedlanguage,
        });
    }



    handleProjectChange(name, e) {

        let projectid = e.value
        const value = e.value;
        this.setState({
            [name]: value
        });
        this.getMissionList(projectid);
    };

    getMissionList(e) {
        let miss = [];
        let projectindex = null;
        if (e !== undefined && e !== "" && this.state.projectSource.length > 0) {
            for (var i = 0; i < this.state.projectSource.length; i++) {
                if (this.state.projectSource[i].id === e) {
                    projectindex = i;
                    break
                }
            }
            this.state.projectSource[projectindex].mission_list.forEach((x, i) => {
                miss.push({ value: x.id, label: x.mission_name });
            });
        }
        return miss
    }



    /**
     * Add New Condition to Array
     */
    addCondtion() {

        let conditions = this.state.conditions;
        let cid = conditions ? conditions.length : 0;
        if (conditions.length === 0) {
            let source = {
                handler: "",
                state: ""
            };
            let sourceArr = [];
            sourceArr.push(source);

            conditions.push({
                condtion_id: cid,
                source: sourceArr,
                rule: "any",
                target: {
                    do: "",
                    handler: ""
                }
            });

        } else {

            let id = 0;
            for (let i = 0; i < conditions.length; i++) {
                if (conditions[i].condtion_id > id) {
                    id = conditions[i].condtion_id
                }
            }
            cid = id + 1;

            let sourcehandlercheck = [];
            let sourcestatecheck = [];
            let sourcetargetcheck = [];
            let valuecheck = [];

            for (let i = 0; i < conditions.length; i++) {
                for (let j = 0; j < conditions[i].source.length; j++) {

                    if (conditions[i].target.do === "loop_set" && conditions[i].source[j].state === ""
                        && conditions[i].target.multifield && conditions[i].target.multifield.length > 0) {
                        let matchques = []
                        this.props.drops.forEach((field, index) => {
                            conditions[i].target.multifield.forEach((c, cindex) => {
                                if (c.value === field.handler) {
                                    matchques.push(index)
                                }
                            })
                        });
                        conditions[i].source[j].handler = this.props.drops[matchques[matchques.length - 1]].handler

                    } else {

                        if (conditions[i].source[j].state !== "empty" && conditions[i].source[j].state !== "filled") {
                            if (conditions[i].source[j].handler === "") {
                                sourcehandlercheck = conditions[i]
                            }
                            if (conditions[i].source[j].state === "") {
                                sourcestatecheck = conditions[i]
                            }
                            if (conditions[i].source[j].target === "") {
                                sourcetargetcheck = conditions[i]
                            }
                            if (conditions[i].source[j].match_option === "") {
                                valuecheck = conditions[i]
                            }
                            if (conditions[i].source[j].target === "value" && (conditions[i].source[j].match_value === "" || (!conditions[i].source[j].match_value))) {
                                valuecheck = conditions[i]
                            }
                            if (conditions[i].source[j].target === "field" && (conditions[i].source[j].matchid === "" || (!conditions[i].source[j].matchid))) {
                                valuecheck = conditions[i]
                            }
                        }
                    }
                }
            }

            let targetdocheck = conditions.filter((condition) => (
                condition.target.do === ""
            ))
            let targethandlercheck = conditions.filter((condition) => (
                condition.target.handler === ""
            ))


            if (sourcehandlercheck.length >= 1 || sourcestatecheck.length >= 1 || sourcetargetcheck.length >= 1 || targetdocheck.length >= 1 || targethandlercheck.length >= 1 || valuecheck.length >= 1) {
                this.setState({
                    validate: 1
                });
            } else {
                let source = {
                    handler: "",
                    state: ""
                };
                let sourceArr = [];
                sourceArr.push(source);

                conditions.push({
                    condtion_id: cid,
                    source: sourceArr,
                    rule: "any",
                    target: {
                        do: "",
                        handler: ""
                    }
                });

                this.setState({
                    validate: 0
                });
            }

        }

        this.setState(
            {
                conditions
            },
            this.props.getCondtions(this.state.conditions),
            this.props.autosave()
        );
    }

    /*
    * Used to add the condition inside the conditions.
    *
    */
    addMultiSource = (index) => {
        const conditions = this.state.conditions;
        let source = {
            handler: "",
            state: ""
        };
        conditions[index].source.push(source);
        this.setState({ conditions }, this.props.getCondtions(this.state.conditions));
    };

    /**
     * Delete Condition from Array
     *
     * @param id
     */
    deleteCondtion(id) {

        let countadd = this.state.conditions;
        countadd.splice(id, 1);
        this.setState({ countadd }, this.props.autosave());
    }


    /**
     * Used to delete the condition inside the conditions.
     *
     * @param id
     * @param sourceId
     */
    deleteSource(id, sourceId) {

        let countadd = this.state.conditions;
        countadd[id].source.splice(sourceId, 1);

        this.setState({ countadd }, this.props.autosave());
    }

    /* Used to hide the self question.*/
    checkeSelfHideQues = (conditions, ques) => {
        let match = 0;
        if (conditions.target && conditions.target.do &&
            (conditions.target.do === "hide_multiple" || conditions.target.do === "show_multiple")) {
            if (conditions.target && conditions.target.multifield && conditions.target.multifield.length > 0) {
                conditions.target.multifield.forEach((mul, index) => {
                    if (ques === mul.value) {
                        match = mul.value
                    }
                })
            }
        }
        else if (conditions.target && conditions.target.do && (conditions.target.do === "hide" || conditions.target.do === "show")) {
            if (conditions.target.handler && conditions.target.handler !== '') {
                if (ques === conditions.target.handler) {
                    match = conditions.target.handler
                }
            }
        }
        return match
    }

    /* Reorder the selected questions it includes the self question in the list. */
    reorder_field = (event, drop) => {
        if (drop.target.multifield && drop.target.multifield.length && drop.target.multifield.length > 0
            && drop.source[0].handler !== '') {
            if (drop.target.do === 'loop' || drop.target.do === 'loop_set') {
                let update = drop.target.multifield;
                let triger_ques = null;
                drop.target.multifield.forEach((m, i) => {
                    if (drop.source[0].handler === m.value) {
                        triger_ques = {}
                        triger_ques.label = m.label;
                        triger_ques.value = m.value
                        update.splice(i, 1)
                    }
                })
                if (triger_ques !== null) {
                    update.push(triger_ques)
                    drop.target.multifield = update;
                    this.ShowNotification('Field order is modified', 'info', 3000)
                }
            }
        }

    }

    /* Handles the message bar notification */
    ShowNotification = (msg, color, time) => {
        this.setState({
            message: msg,
            msgColor: color,
            br: true
        }, () => {
            let place = "br";
            var x = [];
            x[place] = true;
            // this.setState(x);
            this.alertTimeout = setTimeout(
                function () {
                    x[place] = false;
                    this.setState(x);
                }.bind(this),
                time
            );
        }
        )
    }



    /**
     * Add new Parameter to the release condition
     *
     * @param event
     * @param drop
     * @param label
     */
    addNewCondtions_release = (event, drop, label, sourceIdx, temp) => {
        if (label === "source") {

            // let value = event.target.value.split(".")[0];
            // let type = event.target.value.split(".")[1];
            // if (event.target.name === "handler" || event.target.name === "matchid") value = parseInt(value);
            let cid = drop.condtion_id;
            let conditionid = drop.condtion_id;
            let newcondtions = this.state.conditions;
            for (let i = 0; i < newcondtions.length; i++) {
                if (newcondtions[i].condtion_id === cid) {
                    conditionid = i;
                }
            }

            if (newcondtions[conditionid].error) {
                delete newcondtions[conditionid].error;
            }

            // let newdrops = this.state.drops.filter((ques, index) => {
            //     return ques.handler == event.target.value;
            // });
            if (newcondtions[conditionid] && newcondtions[conditionid].source[sourceIdx]) {
                newcondtions[conditionid].source[sourceIdx]['match_value'] = event;
            }


            this.setState({ newcondtions }, this.props.getCondtions(this.state.conditions), this.props.autosave());
        }
    }

    /**
     * Add new Parameter to the condition
     *
     * @param event
     * @param drop
     * @param label
     */
    addNewCondtions = (event, drop, label, sourceIdx, temp) => {
        let multilevelcheck = false;
        if (label === "rule") {
            let cid = drop.condtion_id;
            let conditionid = drop.condtion_id;
            let newcondtions = this.state.conditions;
            for (let i = 0; i < newcondtions.length; i++) {
                if (newcondtions[i].condtion_id === cid) {
                    conditionid = i;
                }
            }

            delete newcondtions[conditionid].error;
            let newdrops = this.state.drops.filter((drop, index) => {
                return drop.handler === event.target.value;
            });
            newcondtions[conditionid].rule = event.target.value;
            this.setState({ newcondtions, newdrops }, this.props.getCondtions(this.state.conditions), this.props.autosave());
        }
        else if (label === "source") {

            let value = event.target.value.split(".")[0];
            let type = event.target.value.split(".")[1];
            if (event.target.name === "handler" || event.target.name === "matchid") value = parseInt(value);
            let cid = drop.condtion_id;
            let conditionid = drop.condtion_id;
            let newcondtions = this.state.conditions;
            for (let i = 0; i < newcondtions.length; i++) {
                if (newcondtions[i].condtion_id === cid) {
                    conditionid = i;
                }
            }

            if (newcondtions[conditionid].error) {
                delete newcondtions[conditionid].error;
            }

            let newdrops = this.state.drops.filter((ques, index) => {
                return ques.handler === event.target.value;
            });
            if (newcondtions[conditionid] && newcondtions[conditionid].source[sourceIdx]) {
                newcondtions[conditionid].source[sourceIdx][`${event.target.name}`] = value;
                if (newcondtions[conditionid].source[sourceIdx]['id']) {
                    delete newcondtions[conditionid].source[sourceIdx]['id']
                }
                if (newcondtions[conditionid].source[sourceIdx]['p_id']) {
                    delete newcondtions[conditionid].source[sourceIdx]['p_id']
                }
                for (let i = 0; i < this.state.drops.length; i++) {
                    if (newcondtions[conditionid].source[sourceIdx].handler === this.state.drops[i].handler) {
                        if (this.state.drops[i].type === 'choice') {
                            if (!this.state.drops[i].properties.hasOwnProperty("multilevel") || this.state.drops[i].properties.multilevel === 0) {
                                if (this.state.drops[i].properties.options === undefined) {
                                    break;
                                }
                                if (this.state.drops[i].properties.options.length > 0) {
                                    let options = this.state.drops[i].properties.options;
                                    for (let j = 0; j < options.length; j++) {
                                        if (options[j].label === value) {
                                            newcondtions[conditionid].source[sourceIdx]['id'] = options[j].id;
                                            break;
                                        }
                                    }
                                }
                            }
                            else if (this.state.drops[i].properties.multilevel === 1) {
                                let pidcheck = value && typeof value === "string" ? value.split('###id##') : [];
                                let option_pid = null;
                                if (pidcheck.length > 1) {
                                    value = pidcheck[1];
                                    if (pidcheck[0] === "other") {
                                        option_pid = pidcheck[0]
                                    } else {
                                        option_pid = parseInt(pidcheck[0]);
                                    }
                                    multilevelcheck = true;
                                }
                                if (this.state.drops[i].properties.options.length > 0) {
                                    for (let k = 0; k < this.state.drops[i].properties.options.length; k++) {
                                        if (this.state.drops[i].properties.options[k].sublabel.length > 0) {
                                            let sublabel = this.state.drops[i].properties.options[k].sublabel;
                                            let label_id = this.state.drops[i].properties.options[k].id;
                                            for (let m = 0; m < sublabel.length; m++) {
                                                if ((option_pid !== null && option_pid === label_id && sublabel[m].sublabel === value) || (option_pid === null && sublabel[m].sublabel === value)) {
                                                    newcondtions[conditionid].source[sourceIdx]['p_id'] = label_id;
                                                    newcondtions[conditionid].source[sourceIdx]['id'] = sublabel[m].id;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                }

            }
            // newcondtions[conditionid].source[sourceIdx][`${event.target.name}`] = value;
            if (event.target.name === "match_value") {

                newcondtions[conditionid].source[sourceIdx][`${event.target.name}`] = multilevelcheck === true ? value : event.target.value;
            }

            if (event.target.name === "handler" && label === "source") {
                newcondtions[conditionid][`${label}`][sourceIdx].source_type = type;
                if (newcondtions[conditionid].source[sourceIdx].matchid) {
                    delete newcondtions[conditionid].source[sourceIdx].matchid
                }
                if (newcondtions[conditionid].source[sourceIdx].target) {
                    delete newcondtions[conditionid].source[sourceIdx].target
                }
                if (newcondtions[conditionid].source[sourceIdx].match_value) {
                    delete newcondtions[conditionid].source[sourceIdx].match_value
                }
                if (newcondtions[conditionid].source[sourceIdx].match_option) {
                    delete newcondtions[conditionid].source[sourceIdx].match_option
                }
                if (newcondtions[conditionid].source[sourceIdx].state) {
                    newcondtions[conditionid].source[sourceIdx].state = ""
                }
            }
            if (event.target.value === "empty" || event.target.value === "filled" || event.target.value === "loop_input") {
                if (newcondtions[conditionid].source[sourceIdx].matchid) {
                    delete newcondtions[conditionid].source[sourceIdx].matchid
                }
                if (newcondtions[conditionid].source[sourceIdx].target) {
                    delete newcondtions[conditionid].source[sourceIdx].target
                }
                if (newcondtions[conditionid].source[sourceIdx].match_value) {
                    delete newcondtions[conditionid].source[sourceIdx].match_value
                }
                if (newcondtions[conditionid].source[sourceIdx].matchid) {
                    delete newcondtions[conditionid].source[sourceIdx].matchid
                }
            }
            if (event.target.value === "loop_input") {
                if (!newcondtions[conditionid].source[sourceIdx].target) {
                    newcondtions[conditionid].target.do = "loop_input"
                }
                if (label !== "num_loop") {
                    newcondtions[conditionid][`${label}`][`${event.target.name}`] = value;
                }
                delete newcondtions[conditionid].target["handler"];
            } else {
                if (newcondtions[conditionid].target.do && newcondtions[conditionid].target.do === "loop_input") {
                    newcondtions[conditionid].target.do = "loop"
                }
            }
            if (event.target.value !== "empty" && event.target.value !== "filled") {
                if (!newcondtions[conditionid].source[sourceIdx].target) {
                    newcondtions[conditionid].source[sourceIdx].target = ""
                }
            }

            if (event.target.name === "match_value") {
                if (newcondtions[conditionid].source[sourceIdx].matchid) {
                    delete newcondtions[conditionid].source[sourceIdx].matchid
                }
            }
            if (event.target.name === "matchid") {
                if (newcondtions[conditionid].source[sourceIdx].match_value) {
                    delete newcondtions[conditionid].source[sourceIdx].match_value
                }
            }
            if (temp === "table") {
                newcondtions[conditionid][`${label}`][sourceIdx].target = "value";
                newcondtions[conditionid][`${label}`][sourceIdx].match_option = "";
            }

            this.setState({ newcondtions, newdrops }, this.props.getCondtions(this.state.conditions), this.props.autosave());
        }
        else {
            if (label === 'project') {
                let value = event.target.value;
                let conditionid = drop.condtion_id;
                let cid = drop.condtion_id;
                let newcondtions = this.state.conditions;
                for (let i = 0; i < newcondtions.length; i++) {
                    if (newcondtions[i].condtion_id === cid) {
                        conditionid = i;
                    }
                }
                newcondtions[conditionid]['target'][`${label}`] = parseInt(value);
                // newcondtions[conditionid]['target']['project_label'] = event.label;
                this.setState({ newcondtions }, this.props.getCondtions(this.state.conditions), this.props.autosave())
            }
            else if (label === 'mission') {
                let value = event.target.value;
                let conditionid = drop.condtion_id;
                let cid = drop.condtion_id;
                let newcondtions = this.state.conditions;
                for (let i = 0; i < newcondtions.length; i++) {
                    if (newcondtions[i].condtion_id === cid) {
                        conditionid = i;
                    }
                }
                newcondtions[conditionid]['target'][`${label}`] = parseInt(value);
                // newcondtions[conditionid]['target']['mission_label'] = event.label;
                this.setState({ newcondtions }, this.props.getCondtions(this.state.conditions), this.props.autosave())
            }
            else if (event.target && event.target.value && event.target.value === 'release') {
                let value = event.target.value;
                let conditionid = drop.condtion_id;
                let cid = drop.condtion_id;
                let newcondtions = this.state.conditions;
                for (let i = 0; i < newcondtions.length; i++) {
                    if (newcondtions[i].condtion_id === cid) {
                        conditionid = i;
                    }
                }
                newcondtions[conditionid][`${label}`][`${event.target.name}`] = value;
                newcondtions[conditionid][`${label}`]['project'] = "";
                // newcondtions[conditionid][`${label}`]['project_label'] = "";
                newcondtions[conditionid][`${label}`]['mission'] = "";
                delete newcondtions[conditionid][`${label}`].handler
                // newcondtions[conditionid][`${label}`]['mission_label'] = "";

                this.setState({ newcondtions }, this.props.getCondtions(this.state.conditions), this.props.autosave());
            }
            else if (event.target && event.target.value && (event.target.value === 'Value_Multiple' || event.target.value === 'Value_Multiple')) {

            }
            else {
                let value = event.target.value.split(".")[0];
                if (event.target.name === "handler" || event.target.name === "matchid") value = parseInt(value);
                let cid = drop.condtion_id;
                let conditionid = drop.condtion_id;
                let newcondtions = this.state.conditions;
                for (let i = 0; i < newcondtions.length; i++) {
                    if (newcondtions[i].condtion_id === cid) {
                        conditionid = i;
                    }
                }

                delete newcondtions[conditionid].error;
                let newdrops = this.state.drops.filter((drop, index) => {
                    return drop.handler === event.target.value;
                });
                if (label !== "num_loop") {
                    if (event.target.value == 'hide_range') {
                        newcondtions[conditionid][`${label}`]['uniqueID'] = 'hide_range'
                        newcondtions[conditionid][`${label}`][`${event.target.name}`] = 'hide_multiple'
                    }
                    else {
                        newcondtions[conditionid][`${label}`]['uniqueID'] = ''
                        newcondtions[conditionid][`${label}`][`${event.target.name}`] = value;
                    }
                }

                if (event.target.value === "hide_multiple" || event.target.value === "show_multiple" || event.target.value === "loop"
                    || event.target.value === "loop_set" || event.target.value === "hide_range") {
                    delete newcondtions[conditionid].target["handler"];

                }
                if (label === "num_loop") {
                    newcondtions[conditionid].target.num_loop = parseInt(event.target.value)
                }
                if (event.target.value === "show" || event.target.value === "hide") {
                    delete newcondtions[conditionid].target["multifield"];
                }
                this.setState({ newcondtions, newdrops }, this.props.getCondtions(this.state.conditions), this.props.autosave());
            }

            // this.setState({ newcondtions, newdrops }, this.props.getCondtions(this.state.conditions), this.props.autosave());
        }
        if (event.target && event.target.value) {
            this.reorder_field(event.target.value.split(".")[0], drop)
        }
    }

    /**
     * Add Multi Value to Parameter like Show / Hide Multiple
     *
     * @param event
     * @param drop
     * @param property
     * @param label
     */

    addNewCondtionsMulti(event, drop, property, label, param) {
        let conditionid = drop.condtion_id;
        let newcondtions = this.state.conditions
        let match = true;
        for (let i = 0; i < newcondtions.length; i++) {
            if ((newcondtions[i].condtion_id === drop.condtion_id) && (newcondtions[i].target.do === drop.target.do)) {
                conditionid = i;
            }
        }
        // this.addNewCondtionsLanguage(event, drop, property, label)
        if (param == "FromField" || param == "ToField") {
            if (param == "FromField") {
                newcondtions[conditionid][`${label}`][`${property}`] = []
                this.setState({ rangeStartElement: [] }, () => {
                    this.state.rangeStartElement.push(event)
                })
            }
            else {
                let multipleDrops = this.multiList(drop)
                if (multipleDrops.length > 0) {
                    var startIndex = multipleDrops.findIndex(p => p.value == (this.state.rangeStartElement && this.state.rangeStartElement[0].value));
                    var endIndex = multipleDrops.findIndex(p => p.value == event.value);
                    if (startIndex > 0 && startIndex < endIndex) {
                        let sliceArray = multipleDrops.slice(startIndex, endIndex + 1)
                        if (sliceArray && sliceArray.length > 0) {
                            newcondtions[conditionid][`${label}`][`${property}`] = sliceArray
                        }
                    }
                    else {
                        newcondtions[conditionid][`${label}`][`${property}`] = []
                        this.ShowNotification(" 'From Field' is not bigger then 'To Field'", 'danger', 600000)
                    }
                }
            }
        }
        else {
            newcondtions[conditionid][`${label}`][`${property}`] = event;
        }
        this.state.oldconditions.forEach((c, i) => {
            if (drop.target && drop.target.do && (drop.target.do === "loop" || drop.target.do === "loop_set" || drop.target.do === "loop_input") &&
                (drop.condtion_id === c.condtion_id) && c.target && c.target.multifield && drop.target.multifield && (c.target.multifield.length > drop.target.multifield.length)) {

                this.ShowNotification('Answer for the removed loop question will not be displayed in the response screen here after', 'warning', 5000)
                match = false
            }
        })



        this.setState({ newcondtions }, this.props.getCondtions(this.state.conditions), this.props.autosave());
        if (match) { this.reorder_field('', drop) }

    }

    /* Unused function. */
    addNewCondtionsLanguage(event, dr, property, label) {
        const drop = dr
        let conditionid = drop.condtion_id;
        let selectedlanguage = this.props.selectedlanguage
        let languages_drop = this.props.languages_drop;

        selectedlanguage.forEach((a, b) => {
            if (a.label !== 'English') {
                for (let i = 0; i < languages_drop[a.label].conditions.length; i++) {
                    if ((languages_drop[a.label].conditions[i].condtion_id === drop.condtion_id) && (languages_drop[a.label].conditions[i].target.do === drop.target.do)) {
                        conditionid = i;
                    }
                }
                let temp = []
                if (event.length > 0) {
                    event.forEach((e, f) => {
                        languages_drop[a.label].content.forEach((c, d) => {
                            if (e.value === c.handler) {
                                let opt = {
                                    label: c.label,
                                    handler: c.handler
                                }
                                temp.push(opt)
                            }
                        })
                    })
                }
                // languages_drop[a.label].conditions[conditionid][`${label}`][`${property}`] = temp;
                this.props.languages_drop[[a.label]].conditions[conditionid][`${label}`][`${property}`] = temp;
            }
        })
    }

    /* Unused function. */
    errorcheck = e => {

        let errorcheck = this.state.drops.filter(sdrop => {
            return e.source.handler === sdrop.handler;
        });
        if (errorcheck) {
            errorcheck.length >= 1 && e.source.handler ? console.log("S") : console.log("N");
        }
    };

    /* Reorder the selected questions it includes the self question in the list. */
    change_field_order(event, drop, index, property, label) {
        let multifield = []
        this.props.drops.forEach((m, i) => {
            if (drop && drop.target && drop.target.multifield) {
                drop.target.multifield.forEach((d, j) => {
                    if (m.handler === d.value) {
                        multifield.push(d)
                    }
                })
            }
        })
        let condition = this.state.conditions
        condition[index].target.multifield = multifield
        this.setState({
            conditions: condition
        })
    }

    /* Used to render the header for the multi level question */
    formatGroupLabel = (data) => {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <span
                    style={{ color: 'black', fontSize: 12, fontWeight: 'bolder' }}>{data.label}</span>
                {/* <span style={{
               backgroundColor: '#EBECF0',
      borderRadius: '2em',
      color: '#172B4D',
      display: 'inline-block',
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: '1',
      minWidth: 1,
      padding: '0.16666666666667em 0.5em',
      textAlign: 'center',
          }}>{data.options.length}</span> */}
            </div>)
    };

    /* If user selects valuemultipleany or valuemultipleall in target,returns the choice list to the matched value dropdown. */
    choiceList_release = (conditions, source) => {
        let handler = source.handler;


        let selectedChoice = this.props.drops.filter(drop => {
            return handler === drop.handler;
        });
        if (selectedChoice[0] === undefined) {
            return
        } else if (selectedChoice[0].properties.multilevel === 1 && selectedChoice[0].properties.options) {
            let options = [];
            selectedChoice[0].properties.options.forEach((option, index) => {
                let header = {
                    label: option.label,
                    options: []
                }

                if (option.sublabel) {
                    option.sublabel.forEach((suboption, subindex) => {
                        header.options.push({ value: suboption.sublabel, label: suboption.sublabel, id: suboption.id, p_id: option.id });
                    })
                }

                options.push(header)

            });
            return options
        } else if (selectedChoice[0].properties.options) {
            let options = [];
            selectedChoice[0].properties.options.forEach((option, index) => {
                options.push({ value: option.label, label: option.label, id: option.id });
            });
            return options
        }

    };

    /* If user selects valuemultipleany or valuemultipleall in target,returns the scale list to the matched value dropdown. */
    scaleList_valueMultiple = (conditions, source) => {
        let handler = source.handler;
        let options = [];

        let selectedChoice = this.props.drops.filter(drop => {

            return handler === drop.handler;
        });

        if (selectedChoice && selectedChoice[0] && selectedChoice[0].properties.scale_content) {
            selectedChoice[0].properties.scale_content.forEach((option, index) => {
                options.push({ label: option.value, value: option.value })
            });
            return options
        }
    };

    /* If user selects valuemultipleany or valuemultipleall in target,returns the barcode list to the matched value dropdown. */
    barcodeList_valueMultiple = (conditions, source) => {
        let handler = source.handler;
        let options = [];

        let selectedChoice = this.props.drops.filter(drop => {

            return handler === drop.handler;
        });

        if (selectedChoice[0].properties.barcode_ids) {
            selectedChoice[0].properties.barcode_ids.forEach((option, index) => {
                options.push({ label: option, value: option })
            });
        }
        return options
    };


    /* If user selects except valuemultipleany or valuemultipleall in target,returns the choice list to the matched value dropdown. */
    choiceList = (conditions, source) => {


        let matchVal = source.match_value;
        let handler = source.handler;
        let pid = source.p_id;

        let selectedChoice = this.props.drops.filter(drop => {
            return handler === drop.handler;
        });

        if (selectedChoice === undefined || selectedChoice[0] === undefined) {
            return
        } else if (selectedChoice[0].properties.multilevel === 1 && selectedChoice[0].properties.options) {
            return selectedChoice[0].properties.options.map((option, index) => (
                <optgroup key={index} label={option.label}>
                    {option.sublabel
                        ? option.sublabel.map((suboption, subindex) => (
                            <option key={subindex} selected={((pid !== null && pid === option.id && matchVal === suboption.sublabel) || (pid === null && matchVal === suboption.sublabel)) ? "selected" : ""} value={option.id + "###id##" + suboption.sublabel}>
                                {suboption.sublabel}
                            </option>
                        ))
                        : ""}
                </optgroup>
            ));
        } else if (selectedChoice[0].properties.options) {
            return selectedChoice[0].properties.options.map((option, index) => (
                <option key={index} selected={matchVal === option.label ? "selected" : ""} value={option.label}>
                    {option.label}
                </option>
            ));
        }
    };

    /* If user selects except valuemultipleany or valuemultipleall in target,returns the scale list to the matched value dropdown. */
    scaleList = (conditions, source) => {
        let matchVal = parseInt(source.match_value);
        let handler = source.handler;


        let selectedChoice = this.props.drops.filter(drop => {

            return handler === drop.handler;
        });

        if (selectedChoice && selectedChoice[0] && selectedChoice[0].properties.scale_content) {
            return selectedChoice[0].properties.scale_content.map((option, index) => (
                <option key={index} selected={matchVal === option.value ? "selected" : ""} value={option.value}>
                    {option.value}
                </option>
            ));
        }
    };

    /* If user selects except valuemultipleany or valuemultipleall in target,returns the barcode list to the matched value dropdown. */
    barcodeList = (conditions, source) => {
        let matchVal = source.match_value;
        let handler = source.handler;


        let selectedChoice = this.props.drops.filter(drop => {

            return handler === drop.handler;
        });

        if (selectedChoice[0].properties.barcode_ids) {
            return selectedChoice[0].properties.barcode_ids.map((option, index) => (
                <option key={index} selected={matchVal === option ? "selected" : ""} value={option}>
                    {option}
                </option>
            ));
        }
    };

    /* Handles single level question - returns the table value of selected scale question to the matched value dropdown */
    valueList = (conditions, source) => {
        let matchVal = source.match_value;
        let handler = source.handler;


        let selectedChoice = this.props.drops.filter(drop => {

            return handler === drop.handler;
        });


        if (selectedChoice && selectedChoice[0] && selectedChoice[0].properties.table_content.table_value) {
            return selectedChoice[0].properties.table_content.table_value.map((option, index) => (
                <option key={index} selected={matchVal === option.value ? "selected" : ""} value={option.value}>
                    {option.value}
                </option>
            ));
        }
    };

    /* Handles single level question - returns the table options of selected scale question to the matched value dropdown */
    optionsList = (conditions, source) => {
        let matchVal = source.match_option;
        let handler = source.handler;

        let selectedChoice = this.props.drops.filter(drop => {

            return handler === drop.handler;
        });

        if (selectedChoice && selectedChoice[0] && selectedChoice[0].properties.table_content.table_options) {
            return selectedChoice[0].properties.table_content.table_options.map((option, index) => (
                <option key={index} selected={matchVal === option.value ? "selected" : ""} value={option.value}>
                    {option.value}
                </option>
            ));
        }
    };

    /* Handles single level question -If selection question is scale used to validate the scale question type is scale or table. */
    tableList = (conditions, source) => {
        let handler = source.handler;

        let selectedChoice = this.props.drops.filter(drop => {
            return handler === drop.handler;
        });

        if (selectedChoice.length === 1) {
            if (selectedChoice[0].properties.scale_type) {
                return selectedChoice[0].properties.scale_type
            } else return null
        }
    }

    /* Used to return the options based on the question type. */
    selectedElement = (conditions, source) => {
        let handler = source.handler;

        let selectedChoice = this.props.drops.filter(drop => {
            return handler === drop.handler;
        });
        if (selectedChoice.length === 1) {
            return selectedChoice[0]
        }
        else return { properties: {} }
    }

    /* If user selects hide/show in the do list, user can able to select single question in the field list. */
    doList = conditions => {
        let fields = []
        if (conditions.source && conditions.source.length > 0) {
            this.props.drops.forEach(drop => {
                let match = false;
                conditions.source.forEach(shandler => {
                    if (shandler.handler === drop.handler) {
                        match = true;
                    }
                })
                if (!match) {
                    fields.push({ label: drop.label, handler: drop.handler });
                }
            })
        }
        else {
            this.props.drops.forEach(drop => {
                fields.push({ label: drop.label, handler: drop.handler });
            });
        }

        return fields
    }

    /* If user selects hidemultiple/showmultiple in the do list, user can able to select multiple question in the field list. */
    multiList = conditions => {
        let fields = []
        if (conditions.source && conditions.source.length > 0) {
            this.props.drops.forEach(drop => {
                let match = false;
                conditions.source.forEach(shandler => {
                    if (shandler.handler === drop.handler) {
                        match = true;
                    }
                })
                if (!match) {
                    fields.push({ label: drop.label, value: drop.handler });
                }
            })
        }
        else {
            this.props.drops.forEach(drop => {
                fields.push({ label: drop.label, value: drop.handler });
            });
        }
        return fields
    }

    /* If user selects the loop/loopinput/loopset in the do list,it will return the list of questions to multiselect dropdown.*/
    loopset = (mainindex, label) => {
        let newcondtions = this.state.conditions[mainindex];
        let matchques = []
        var largest = 0;
        let multifields = [];
        if (newcondtions.source.length > 1) {
            this.props.drops.forEach((field, index) => {
                newcondtions.source.forEach((c, cindex) => {
                    if (c.handler === field.handler) {
                        matchques.push(index)
                    }
                })
            });
            for (var i = 0; i <= largest; i++) {
                if (matchques[i] > largest) {
                    largest = matchques[i];
                }
            }
            if (label === 'loop' || label === 'loop_set') {
                this.props.drops.forEach((field, index) => {
                    // if (index <= largest) {
                    multifields.push({ label: field.label, value: field.handler })
                    //}
                });
            } else {
                this.props.drops.forEach((field, index) => {
                    if (index > largest) {
                        multifields.push({ label: field.label, value: field.handler })
                    }
                });
            }

        } else {
            let match = true;
            this.props.drops.forEach((field, index) => {
                if (label === 'loop' || label === 'loop_set') {
                    multifields.push({ label: field.label, value: field.handler })
                } else {

                    if (!match) {
                        multifields.push({ label: field.label, value: field.handler })
                    }
                    if (field && newcondtions.source && newcondtions.source.length > 0 && field.handler === newcondtions.source[0].handler) {
                        match = false;
                    }
                }
            });
        }
        return multifields
    }
    render() {
        const { msgColor, br, message } = this.state;
        return (
            <div className="success">
                <div className="dinamic_questions_parent">
                    <div className="dinamic_questions_wrap">
                        <div className="dinamic_quest_header">
                            <h3>Dynamic Question Section</h3>
                            <p>Change visibility of field(s) depending on `IF` State conditions.</p>

                        </div>
                        {
                            this.state.conditions.map((drop, index) => (
                                <div key={index}>
                                    <div className="dinamic_quest_body">
                                        {
                                            drop.error === 1
                                                ?
                                                <div className="error errordeletes">
                                                    <i className="fa fa-times-circle" aria-hidden="true" /> One or more fields have been deleted which are required by this condition.
                                                </div>
                                                :
                                                null
                                        }
                                        <div className="dinamic_quest_block">
                                            <div className="form-group clear clearfix">
                                                <div className="label-part">Do</div>
                                                <div className="ans-part">
                                                    {drop.target.do !== "loop_input" &&

                                                        <select className="form-control" name="do" onChange={e => this.addNewCondtions(e, drop, "target")}>
                                                            <option value="" disabled selected>
                                                                Select your option
                                                            </option>
                                                            <option selected={drop.target.do === "hide" ? "selected" : ""} value="hide">
                                                                Hide
                                                            </option>
                                                            <option selected={drop.target.do === "show" ? "selected" : ""} value="show">
                                                                Show
                                                            </option>
                                                            <option selected={(drop.target.do === "hide_multiple" && drop.target.uniqueID !== "hide_range") ? "selected" : ""} value="hide_multiple">
                                                                Hide Multiple
                                                            </option>
                                                            <option selected={drop.target.do === "show_multiple" ? "selected" : ""} value="show_multiple">
                                                                Show Multiple
                                                            </option>
                                                            <option selected={(drop.target.do === "hide_multiple" && drop.target.uniqueID === "hide_range") ? "selected" : ""} value="hide_range">
                                                                Hide Range
                                                            </option>
                                                            <option selected={drop.target.do === "loop" ? "selected" : ""}
                                                                value='loop'>
                                                                Loop
                                                            </option>
                                                            <option selected={drop.target.do === "loop_set" ? "selected" : ""} value="loop_set">
                                                                Loop Set
                                                            </option>
                                                            <option selected={drop.target.do === "release" ? "selected" : ""} value="release">
                                                                Release
                                                            </option>
                                                        </select>
                                                    }
                                                    {drop.target.do === "loop_input" &&
                                                        <select className="form-control" name="do" onChange={e => this.addNewCondtions(e, drop, "target")}>
                                                            <option selected={drop.target.do === "loop" ? "selected" : ""}
                                                                value='loop'>
                                                                Loop
                                                            </option>
                                                        </select>
                                                    }
                                                </div>
                                            </div>
                                            {
                                                this.state.conditions[index].target.do
                                                    ?
                                                    <div className="form-group clear clearfix">
                                                        {this.state.conditions[index].target.do === "loop_set" ?
                                                            <div className="label-part">No.of Loops</div> :
                                                            this.state.conditions[index].target.uniqueID === "hide_range" ?
                                                                <div className="label-part">From Field</div> :
                                                                this.state.conditions[index].target.do === "release" ?
                                                                    <div className="label-part">Project</div> :
                                                                    <div className="label-part">Field</div>
                                                        }
                                                        <div className="ans-part">
                                                            {
                                                                this.state.conditions[index].target.do === "hide" || this.state.conditions[index].target.do === "show"
                                                                    ?
                                                                    <select className="form-control" name="handler" onChange={e => this.addNewCondtions(e, drop, "target")}>
                                                                        <option value="" disabled selected>
                                                                            Select your option
                                                                        </option>
                                                                        {this.doList(drop).map((subdrop, index) => (
                                                                            <option key={index} selected={drop.target.handler === subdrop.handler ? "selected" : ""} value={subdrop.handler}>
                                                                                {subdrop.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                    :
                                                                    (this.state.conditions[index].target.do === "hide_multiple" && this.state.conditions[index].target.uniqueID !== "hide_range") || this.state.conditions[index].target.do === "show_multiple"
                                                                        ?
                                                                        <Select
                                                                            isMulti
                                                                            name="multifield"
                                                                            options={this.multiList(drop)}
                                                                            closeMenuOnSelect={false}
                                                                            value={drop.target.multifield}
                                                                            className="basic-multi-select"
                                                                            classNamePrefix="select"
                                                                            onChange={e => this.addNewCondtionsMulti(e, drop, "multifield", "target")}
                                                                        /> :
                                                                        (this.state.conditions[index].target.do === "hide_multiple" && this.state.conditions[index].target.uniqueID === "hide_range") ?
                                                                            <Select
                                                                                styles={{
                                                                                    control: (baseStyles, state) => ({
                                                                                        ...baseStyles,
                                                                                        fontSize: 14,
                                                                                    }),
                                                                                }}
                                                                                isMulti={false}
                                                                                name="FromField"
                                                                                options={this.multiList(drop)}
                                                                                value={drop.target.multifield && drop.target.multifield[0]}
                                                                                className="basic-single"
                                                                                classNamePrefix="select"
                                                                                onChange={e => this.addNewCondtionsMulti(e, drop, "multifield", "target", "FromField")}
                                                                            />
                                                                            :
                                                                            this.state.conditions[index].target.do === "loop_set"
                                                                                ?
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="num_loop"
                                                                                    type="number"
                                                                                    value={drop.target.num_loop}
                                                                                    placeholder="Please type a value here"
                                                                                    onChange={e => this.addNewCondtions(e, drop, "num_loop")}
                                                                                />
                                                                                :
                                                                                this.state.conditions[index].target.do && this.state.conditions[index].target.do === "loop"
                                                                                    ?
                                                                                    <Select
                                                                                        isMulti
                                                                                        name="multifield"
                                                                                        options={this.loopset(index, 'loop')}
                                                                                        closeMenuOnSelect={false}
                                                                                        value={drop.target.multifield}
                                                                                        className="basic-multi-select"
                                                                                        classNamePrefix="select"
                                                                                        onBlur={e => this.change_field_order(e, drop, index, "multifield", "target")}
                                                                                        onChange={e => this.addNewCondtionsMulti(e, drop, "multifield", "target")}
                                                                                    />
                                                                                    :
                                                                                    this.state.conditions[index].target.do === "loop_input"
                                                                                        ?
                                                                                        <Select
                                                                                            isMulti
                                                                                            name="multifield"
                                                                                            options={this.loopset(index, 'loop_input')}
                                                                                            closeMenuOnSelect={false}
                                                                                            value={drop.target.multifield}
                                                                                            className="basic-multi-select"
                                                                                            classNamePrefix="select"
                                                                                            onBlur={e => this.change_field_order(e, drop, index, "multifield", "target")}
                                                                                            onChange={e => this.addNewCondtionsMulti(e, drop, "multifield", "target")}
                                                                                        />
                                                                                        :
                                                                                        this.state.conditions[index].target.do === "release"
                                                                                            ?
                                                                                            <select
                                                                                                className="form-control"
                                                                                                name="project"
                                                                                                onChange={e => this.addNewCondtions(e, drop, "project")}>
                                                                                                <option value="" disabled selected>
                                                                                                    Select your option</option>
                                                                                                {this.state.projects.map((subdrop, index) => (
                                                                                                    <option key={index} selected={drop.target.project === subdrop.value ? "selected" : ""} value={subdrop.value}>
                                                                                                        {subdrop.label}
                                                                                                    </option>
                                                                                                ))}
                                                                                            </select>
                                                                                            :
                                                                                            null
                                                            }
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.conditions[index].target.do === "release"
                                                    ?
                                                    <div className="form-group clear clearfix">
                                                        <div className="label-part">Mission</div>
                                                        <div className="ans-part">
                                                            <select
                                                                className="form-control"
                                                                name="mission"
                                                                onChange={e => this.addNewCondtions(e, drop, "mission")}>
                                                                <option value="" disabled selected>
                                                                    Select your option
                                                                </option>
                                                                {this.getMissionList(drop.target.project).map((subdrop, index) => (
                                                                    <option key={index} selected={drop.target.mission === subdrop.value ? "selected" : ""} value={subdrop.value}>
                                                                        {subdrop.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.conditions[index].target.do && this.state.conditions[index].target.do === "loop_set"
                                                    ?
                                                    <div className="form-group clear clearfix">
                                                        <div className="label-part">Field</div>
                                                        <div className="ans-part">

                                                            <Select
                                                                isMulti
                                                                name="multifield"
                                                                options={this.loopset(index, 'loop_set')}
                                                                closeMenuOnSelect={false}
                                                                value={drop.target.multifield}
                                                                className="basic-multi-select"
                                                                classNamePrefix="select"
                                                                onBlur={e => this.change_field_order(e, drop, index, "multifield", "target")}
                                                                onChange={e => this.addNewCondtionsMulti(e, drop, "multifield", "target")}
                                                            />

                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                            {
                                                this.state.conditions[index].target.uniqueID && this.state.conditions[index].target.uniqueID === "hide_range"
                                                    ?
                                                    <div className="form-group clear clearfix">
                                                        <div className="label-part">To Field</div>
                                                        <div className="ans-part">
                                                            <Select
                                                                styles={{
                                                                    control: (baseStyles, state) => ({
                                                                        ...baseStyles,
                                                                        fontSize: 14,
                                                                    }),
                                                                }}
                                                                isDisabled={this.state.rangeStartElement && this.state.rangeStartElement.length <= 0 ? true : false}
                                                                name="ToField"
                                                                options={this.multiList(drop)}
                                                                value={drop.target.multifield && drop.target.multifield[drop.target.multifield.length - 1]}
                                                                className="basic-single"
                                                                classNamePrefix="select"
                                                                onChange={e => this.addNewCondtionsMulti(e, drop, "multifield", "target", "ToField")}
                                                            />
                                                        </div>
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                        {
                                            drop.source.map((source, idx) => (
                                                <div key={idx} className="dinamic_quest_block">
                                                    <div className="form-group clear clearfix">
                                                        <div className="label-part">If</div>
                                                        <div className="ans-part">
                                                            <select className="form-control" style={{ width: '90%', display: 'inline-block' }} name="handler" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                <option value="" disabled selected>
                                                                    Select your option
                                                                </option>
                                                                {this.props.drops.map((subdrop, index) => (
                                                                    <option
                                                                        key={index}
                                                                        disabled={
                                                                            drop.target.do === 'release' ?
                                                                                (
                                                                                    subdrop.type === "info"
                                                                                        ? "disabled" :
                                                                                        subdrop.type === "gps"
                                                                                            ? "disabled"
                                                                                            : subdrop.properties.marker_enabled === 1 && !subdrop.properties.instruction_enabled && !subdrop.properties.scale_enabled
                                                                                                ? "disabled"
                                                                                                : subdrop.properties.marker_enabled === 0 && !subdrop.properties.instruction_enabled && !subdrop.properties.scale_enabled
                                                                                                    ? "disabled"
                                                                                                    : subdrop.type === "input"
                                                                                                        ? "disabled"
                                                                                                        : subdrop.type === "capture"
                                                                                                            ? "disabled"
                                                                                                            : subdrop.type === "upload"
                                                                                                                ? "disabled"
                                                                                                                : ""
                                                                                )
                                                                                :
                                                                                this.checkeSelfHideQues(drop, subdrop.handler) === subdrop.handler ?
                                                                                    "disabled"
                                                                                    :
                                                                                    this.checkeSelfHideQues(drop, subdrop.handler) === subdrop.handler ?
                                                                                        subdrop.type === "info"
                                                                                            ? "disabled" :
                                                                                            subdrop.type === "gps"
                                                                                                ? "disabled"
                                                                                                : subdrop.properties.marker_enabled === 1 && !subdrop.properties.instruction_enabled && !subdrop.properties.scale_enabled
                                                                                                    ? "disabled"
                                                                                                    : subdrop.properties.marker_enabled === 0 && !subdrop.properties.instruction_enabled && !subdrop.properties.scale_enabled
                                                                                                        ? "disabled"
                                                                                                        : ""
                                                                                        :
                                                                                        subdrop.type === "info"
                                                                                            ? "disabled" :
                                                                                            subdrop.type === "gps"
                                                                                                ? "disabled"
                                                                                                : subdrop.properties.marker_enabled === 1 && !subdrop.properties.instruction_enabled && !subdrop.properties.scale_enabled
                                                                                                    ? "disabled"
                                                                                                    : subdrop.properties.marker_enabled === 0 && !subdrop.properties.instruction_enabled && !subdrop.properties.scale_enabled
                                                                                                        ? "disabled"
                                                                                                        : ""
                                                                        }
                                                                        selected={drop.target.do === "loop_set" && source.state === "" ? "" :
                                                                            source.handler === subdrop.handler ? "selected" : ""}
                                                                        // selected={source.handler === subdrop.handler ? "selected" : ""}
                                                                        value={subdrop.handler + "." + subdrop.type}
                                                                    >
                                                                        {subdrop.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <i className="fa fa-trash" onClick={() => this.deleteSource(index, idx)} />
                                                        </div>
                                                    </div>
                                                    {source.source_type === "input" || this.selectedElement(drop, source).properties.instruction_enabled === 1 ? (
                                                        <div className="form-group clear clearfix"

                                                        >
                                                            <div className="label-part">State</div>
                                                            <div className="ans-part">
                                                                <select
                                                                    className="form-control"
                                                                    name="state"
                                                                    //disabled={source.handler ? "" : "disabled"}
                                                                    onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                >
                                                                    <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                        Select your option
                                                                    </option>
                                                                    <option selected={source.state === "equal" ? "selected" : ""} value="equal">
                                                                        Is Equal to
                                                                    </option>
                                                                    <option selected={source.state === "notequal" ? "selected" : ""} value="notequal">
                                                                        Is Not Equal to
                                                                    </option>
                                                                    <option selected={source.state === "contain" ? "selected" : ""} value="contain">
                                                                        Contains
                                                                    </option>
                                                                    <option selected={source.state === "notcontains" ? "selected" : ""} value="notcontains">
                                                                        Does Not Contains
                                                                    </option>
                                                                    <option selected={source.state === "starts" ? "selected" : ""} value="starts">
                                                                        Starts With
                                                                    </option>
                                                                    <option selected={source.state === "notstarts" ? "selected" : ""} value="notstarts">
                                                                        Does Not Starts with
                                                                    </option>
                                                                    <option selected={source.state === "ends" ? "selected" : ""} value="ends">
                                                                        Ends With
                                                                    </option>
                                                                    <option selected={source.state === "notends" ? "selected" : ""} value="notends">
                                                                        Does Not Ends with
                                                                    </option>
                                                                    <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                        Is Empty
                                                                    </option>
                                                                    <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                        Is Filled
                                                                    </option>
                                                                    <option selected={source.state === "loop_input" ? "selected" : ""} value="loop_input">
                                                                        Loop
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    ) : source.source_type === "choice" || this.selectedElement(drop, source).properties.scale_enabled === 1 ? (

                                                        <div className="form-group clear clearfix"

                                                        >
                                                            <div className="label-part">State</div>
                                                            <div className="ans-part">

                                                                <select
                                                                    className="form-control"
                                                                    name="state"
                                                                    //disabled={source.handler ? "" : "disabled"}
                                                                    onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                >
                                                                    <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                        Select your option
                                                                    </option>
                                                                    <option selected={source.state === "equal" ? "selected" : ""} value="equal">
                                                                        Is Equal to
                                                                    </option>
                                                                    <option selected={source.state === "notequal" ? "selected" : ""} value="notequal">
                                                                        Is Not Equal to
                                                                    </option>
                                                                    <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                        Is Empty
                                                                    </option>
                                                                    <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                        Is Filled
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    ) : this.selectedElement(drop, source).properties.scale_enabled === 1 ? (
                                                        <div className="form-group clear clearfix"

                                                        >
                                                            <div className="label-part">State</div>
                                                            <div className="ans-part">
                                                                <select
                                                                    className="form-control"
                                                                    name="state"
                                                                    //disabled={source.handler ? "" : "disabled"}
                                                                    onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                >
                                                                    <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                        Select your option
                                                                    </option>
                                                                    <option selected={source.state === "equal" ? "selected" : ""} value="equal">
                                                                        Is Equal to
                                                                    </option>
                                                                    <option selected={source.state === "notequal" ? "selected" : ""} value="notequal">
                                                                        Is Not Equal to
                                                                    </option>
                                                                    <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                        Is Empty
                                                                    </option>
                                                                    <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                        Is Filled
                                                                    </option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    ) : source.source_type === "upload" ? (
                                                        <div className="form-group clear clearfix"

                                                        >
                                                            <div className="label-part">State</div>
                                                            <div className="ans-part">
                                                                <select
                                                                    className="form-control"
                                                                    name="state"
                                                                    //disabled={source.handler ? "" : "disabled"}
                                                                    onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                >
                                                                    <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                        Select your option
                                                                    </option>
                                                                    <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                        Is Empty
                                                                    </option>
                                                                    <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                        Is Filled
                                                                    </option>
                                                                </select>
                                                            </div>

                                                        </div>
                                                    )

                                                        : source.source_type === "barcode" && this.selectedElement(drop, source).properties.barcode_enabled === 1 ? (
                                                            <div className="form-group clear clearfix"

                                                            >
                                                                <div className="label-part">State</div>
                                                                <div className="ans-part">
                                                                    <select
                                                                        className="form-control"
                                                                        name="state"
                                                                        //disabled={source.handler ? "" : "disabled"}
                                                                        onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                    >
                                                                        <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                            Select your option
                                                                        </option>
                                                                        <option selected={source.state === "equal" ? "selected" : ""} value="equal">
                                                                            Is Equal to
                                                                        </option>
                                                                        <option selected={source.state === "notequal" ? "selected" : ""} value="notequal">
                                                                            Is Not Equal to
                                                                        </option>
                                                                        <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                            Is Empty
                                                                        </option>
                                                                        <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                            Is Filled
                                                                        </option>
                                                                    </select>
                                                                </div>

                                                            </div>
                                                        )

                                                            : source.source_type === "barcode" && !this.selectedElement(drop, source).properties.barcode_enabled ? (
                                                                <div className="form-group clear clearfix"

                                                                >
                                                                    <div className="label-part">State</div>
                                                                    <div className="ans-part">
                                                                        <select
                                                                            className="form-control"
                                                                            name="state"
                                                                            //disabled={source.handler ? "" : "disabled"}
                                                                            onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                        >
                                                                            <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                                Select your option
                                                                            </option>
                                                                            <option selected={source.state === "equal" ? "selected" : ""} value="equal">
                                                                                Is Equal to
                                                                            </option>
                                                                            <option selected={source.state === "notequal" ? "selected" : ""} value="notequal">
                                                                                Is Not Equal to
                                                                            </option>
                                                                            <option selected={source.state === "contain" ? "selected" : ""} value="contain">
                                                                                Contains
                                                                            </option>
                                                                            <option selected={source.state === "notcontains" ? "selected" : ""} value="notcontains">
                                                                                Does Not Contains
                                                                            </option>
                                                                            <option selected={source.state === "starts" ? "selected" : ""} value="starts">
                                                                                Starts With
                                                                            </option>
                                                                            <option selected={source.state === "notstarts" ? "selected" : ""} value="notstarts">
                                                                                Does Not Starts with
                                                                            </option>
                                                                            <option selected={source.state === "ends" ? "selected" : ""} value="ends">
                                                                                Ends With
                                                                            </option>
                                                                            <option selected={source.state === "notends" ? "selected" : ""} value="notends">
                                                                                Does Not Ends with
                                                                            </option>
                                                                            <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                                Is Empty
                                                                            </option>
                                                                            <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                                Is Filled
                                                                            </option>

                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            )

                                                                : source.source_type === "scale" ? (

                                                                    <div

                                                                    >

                                                                        {this.tableList(drop, source) === "table" ?
                                                                            <div className="form-group clear clearfix">
                                                                                <div className="label-part">State</div>
                                                                                <div className="ans-part">
                                                                                    <select
                                                                                        className="form-control"
                                                                                        name="state"
                                                                                        //disabled={source.handler ? "" : "disabled"}
                                                                                        onChange={e => this.addNewCondtions(e, drop, "source", idx, "table")}
                                                                                    >
                                                                                        <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                                            Select your option
                                                                                        </option>
                                                                                        <option selected={source.state === "equal" ? "selected" : ""} value="equal">
                                                                                            Is Equal to
                                                                                        </option>
                                                                                        <option selected={source.state === "notequal" ? "selected" : ""} value="notequal">
                                                                                            Is Not Equal to
                                                                                        </option>
                                                                                        <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                                            Is Empty
                                                                                        </option>
                                                                                        <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                                            Is Filled
                                                                                        </option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            <div className="form-group clear clearfix">
                                                                                <div className="label-part">State</div>
                                                                                <div className="ans-part">
                                                                                    <select
                                                                                        className="form-control"
                                                                                        name="state"
                                                                                        //disabled={source.handler ? "" : "disabled"}
                                                                                        onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                                    >
                                                                                        <option value="" disabled selected={!source.state || source.state === "" ? "selected" : ""}>
                                                                                            Select your option
                                                                                        </option>
                                                                                        <option selected={source.state === "equal" ? "selected" : ""} value="equal">
                                                                                            Is Equal to
                                                                                        </option>
                                                                                        <option selected={source.state === "notequal" ? "selected" : ""} value="notequal">
                                                                                            Is Not Equal to
                                                                                        </option>
                                                                                        <option selected={source.state === "empty" ? "selected" : ""} value="empty">
                                                                                            Is Empty
                                                                                        </option>
                                                                                        <option selected={source.state === "filled" ? "selected" : ""} value="filled">
                                                                                            Is Filled
                                                                                        </option>
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                )

                                                                    : (
                                                                        ""
                                                                    )}
                                                    {this.tableList(drop, source) === "table" && source.state !== "empty" && source.state !== "filled" ? (
                                                        <div

                                                        >
                                                            <div className="form-group clear clearfix">
                                                                <div className="label-part">Value</div>
                                                                <div className="ans-part">
                                                                    <select className="form-control" name="match_value" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                        <option value="" disabled selected>
                                                                            Select your option
                                                                        </option>
                                                                        {this.valueList(drop, source)}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-group clear clearfix">
                                                                <div className="label-part">Options</div>
                                                                <div className="ans-part">
                                                                    <select className="form-control" name="match_option" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                        <option value="" disabled selected>
                                                                            Select your option
                                                                        </option>
                                                                        {this.optionsList(drop, source)}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {source.state === "empty" || source.state === "loop_input" || !source.state || this.tableList(drop, source) === "table" || source.state === "filled" ? (
                                                        ""
                                                    ) : (
                                                        <div>
                                                            <div className="form-group clear clearfix"

                                                            >
                                                                <div className="label-part">Target</div>
                                                                <div className="ans-part">
                                                                    <select className="form-control" name="target" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                        <option value="" disabled selected>
                                                                            Select your option
                                                                        </option>
                                                                        {source.state === "equal" && this.selectedElement(drop, source).properties.scale_enabled === 1 && !this.selectedElement(drop, source).properties.instruction_enabled ?
                                                                            "" : source.state === "notequal" && this.selectedElement(drop, source).properties.scale_enabled === 1 && !this.selectedElement(drop, source).properties.instruction_enabled ?
                                                                                "" : <option selected={source.target === "value" ? "selected" : ""} value="value">
                                                                                    Value
                                                                                </option>}
                                                                        <option selected={source.target === "field" ? "selected" : ""} value="field">
                                                                            Another Fields
                                                                        </option>
                                                                        {source.state === "equal" && this.selectedElement(drop, source).properties.scale_enabled === 1 ?
                                                                            <option selected={source.target === "scale_value" ? "selected" : ""} value="scale_value">
                                                                                Scale Value
                                                                            </option>
                                                                            :
                                                                            source.state === "notequal" && this.selectedElement(drop, source).properties.scale_enabled === 1 ?
                                                                                <option selected={source.target === "scale_value" ? "selected" : ""} value="scale_value">
                                                                                    Scale Value
                                                                                </option>
                                                                                : ""}
                                                                        {

                                                                            <option selected={source.target === "Value_Multiple_Any" ? "selected" : ""} value="Value_Multiple_Any">
                                                                                Value Multiple Any
                                                                            </option>
                                                                        }
                                                                        {

                                                                            <option selected={source.target === "Value_Multiple_All" ? "selected" : ""} value="Value_Multiple_All">
                                                                                Value Multiple All
                                                                            </option>
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            {source.target === "value" && source.source_type !== "scale" && source.source_type !== "choice" && source.source_type !== "barcode" && this.selectedElement(drop, source).properties.scale_enabled !== 1 ? (
                                                                <div className="form-group clear clearfix"
                                                                >
                                                                    <div className="label-part">Value</div>
                                                                    <div className="ans-part">
                                                                        <input
                                                                            className="form-control"
                                                                            name="match_value"
                                                                            value={source.match_value}
                                                                            onFocus={() => { this.setState({ value: true }) }}
                                                                            onBlur={() => { this.setState({ value: false }) }}
                                                                            placeholder="Please type a value here"
                                                                            onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ) :

                                                                (source.target === "value" && source.source_type === "barcode" && this.selectedElement(drop, source).properties.barcode_enabled === 1) ? (
                                                                    <div className="form-group clear clearfix"

                                                                    >
                                                                        <div className="label-part">Value</div>
                                                                        <div className="ans-part">
                                                                            <select className="form-control" name="match_value" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                                <option value="" disabled selected>
                                                                                    Select your option
                                                                                </option>
                                                                                {this.barcodeList(drop, source)}
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                ) : ((source.target === "Value_Multiple_Any" || source.target === "Value_Multiple_All") && source.source_type === "barcode" && this.selectedElement(drop, source).properties.barcode_enabled === 1) ?
                                                                    (
                                                                        <div className="form-group clear clearfix"

                                                                        >

                                                                            <div className="label-part">Value</div>
                                                                            <div className="ans-part">
                                                                                <Select
                                                                                    name="match_value"
                                                                                    options={this.barcodeList_valueMultiple(drop, source)}
                                                                                    isMulti
                                                                                    isClearable
                                                                                    formatGroupLabel={this.formatGroupLabel}
                                                                                    closeMenuOnSelect={false}
                                                                                    value={source.match_value && source.match_value}
                                                                                    onChange={e => this.addNewCondtions_release(e, drop, "source", idx)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                    :

                                                                    (source.target === "value" && source.source_type === "barcode" && !this.selectedElement(drop, source).properties.barcode_enabled) ? (
                                                                        <div className="form-group clear clearfix"
                                                                        >
                                                                            <div className="label-part">Value</div>
                                                                            <div className="ans-part">
                                                                                <input
                                                                                    className="form-control"
                                                                                    name="match_value"
                                                                                    value={source.match_value}
                                                                                    onFocus={() => { this.setState({ value: true }) }}
                                                                                    onBlur={() => { this.setState({ value: false }) }}
                                                                                    placeholder="Please type a value here"
                                                                                    onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    ) :

                                                                        (source.target === "value" && this.selectedElement(drop, source).properties.scale_enabled === 1) && !this.selectedElement(drop, source).properties.instruction_enabled ? (
                                                                            <div className="form-group clear clearfix"

                                                                            >
                                                                                <div className="label-part">Value</div>
                                                                                <div className="ans-part">
                                                                                    <select className="form-control" name="match_value" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                                        <option value="" disabled selected>
                                                                                            Select your option
                                                                                        </option>
                                                                                        {this.selectedElement(drop, source).properties.scale_images.map((subval, subind) => (
                                                                                            <option key={subind} selected={source.match_value === subind + 1 ? "selected" : ""} value={subind + 1}>
                                                                                                {subind + 1}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        ) :

                                                                            source.target === "value" && this.selectedElement(drop, source).properties.instruction_enabled === 1 ? (
                                                                                <div className="form-group clear clearfix">
                                                                                    <div className="label-part">Value</div>
                                                                                    <div className="ans-part">
                                                                                        <input
                                                                                            className="form-control"
                                                                                            name="match_value"
                                                                                            value={source.match_value}
                                                                                            onFocus={() => { this.setState({ value: true }) }}
                                                                                            onBlur={() => { this.setState({ value: false }) }}
                                                                                            placeholder="Please type a value here"
                                                                                            onChange={e => this.addNewCondtions(e, drop, "source", idx)}
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            ) :

                                                                                source.target === "value" && source.source_type === "choice" ? (
                                                                                    <div className="form-group clear clearfix"

                                                                                    >
                                                                                        <div className="label-part">Value</div>
                                                                                        <div className="ans-part">
                                                                                            <select className="form-control" name="match_value" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                                                <option value="" disabled selected>
                                                                                                    Select your option
                                                                                                </option>
                                                                                                {this.choiceList(drop, source)}
                                                                                            </select>
                                                                                        </div>
                                                                                    </div>
                                                                                ) :

                                                                                    source.target === "scale_value" ? (
                                                                                        <div className="form-group clear clearfix"

                                                                                        >
                                                                                            <div className="label-part">Value</div>

                                                                                            <div className="ans-part">
                                                                                                <select className="form-control" name="match_value" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                                                    <option value="" disabled selected>
                                                                                                        Select your option
                                                                                                    </option>
                                                                                                    {this.selectedElement(drop).properties.scale_images.map((subval, subind) => (
                                                                                                        <option key={subind} selected={source.match_value === subind + 1 ? "selected" : ""} value={subind + 1}>
                                                                                                            {subind + 1}
                                                                                                        </option>
                                                                                                    ))}
                                                                                                </select>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) :





                                                                                        (source.target === "value" && source.source_type === "scale") ? (
                                                                                            <div className="form-group clear clearfix"

                                                                                            >
                                                                                                <div className="label-part">Value</div>
                                                                                                <div className="ans-part">
                                                                                                    <select className="form-control" name="match_value" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                                                        <option value="" disabled selected>
                                                                                                            Select your option
                                                                                                        </option>
                                                                                                        {this.scaleList(drop, source)}
                                                                                                    </select>
                                                                                                </div>
                                                                                            </div>
                                                                                        ) :

                                                                                            (((source.target === "Value_Multiple_Any" ||
                                                                                                source.target === "Value_Multiple_All") && source.source_type === "choice") ? (
                                                                                                <div className="form-group clear clearfix"

                                                                                                >
                                                                                                    <div className="label-part">Value</div>

                                                                                                    <div className="ans-part">
                                                                                                        <Select
                                                                                                            name="match_value"
                                                                                                            options={this.choiceList_release(drop, source)}
                                                                                                            isMulti
                                                                                                            isClearable
                                                                                                            formatGroupLabel={this.formatGroupLabel}
                                                                                                            closeMenuOnSelect={false}
                                                                                                            value={source.match_value && source.match_value}
                                                                                                            onChange={e => this.addNewCondtions_release(e, drop, "source", idx)}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                ((source.target === "Value_Multiple_Any" ||
                                                                                                    source.target === "Value_Multiple_All") && source.source_type === "scale") ? (
                                                                                                    <div className="form-group clear clearfix"

                                                                                                    >
                                                                                                        <div className="label-part">Value</div>

                                                                                                        <div className="ans-part">
                                                                                                            <Select
                                                                                                                isMulti
                                                                                                                name="match_value"
                                                                                                                options={this.scaleList_valueMultiple(drop, source)}
                                                                                                                closeMenuOnSelect={false}
                                                                                                                className="basic-multi-select"
                                                                                                                classNamePrefix="select"
                                                                                                                value={source.match_value && source.match_value}
                                                                                                                onChange={e => this.addNewCondtions_release(e, drop, "source", idx)}
                                                                                                            />
                                                                                                        </div>
                                                                                                    </div>
                                                                                                ) : ("")
                                                                                            ))
                                                            }
                                                            {source.target === "field" ? (
                                                                <div className="form-group clear clearfix"

                                                                >
                                                                    <div className="label-part">Field</div>
                                                                    <div className="ans-part">
                                                                        <select className="form-control" name="matchid" onChange={e => this.addNewCondtions(e, drop, "source", idx)}>
                                                                            <option value="" disabled selected>
                                                                                Select your option
                                                                            </option>
                                                                            {this.props.drops.map((subdrop, index) => (
                                                                                <option key={index} selected={source.matchid === subdrop.handler ? "selected" : ""} value={subdrop.handler}>
                                                                                    {subdrop.label}
                                                                                </option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    )}

                                                </div>
                                            ))
                                        }
                                        <div className="dinamic_quest_block">
                                            <div className="form-group clear clearfix">
                                                <div className="label-part">Rule</div>
                                                <div className="ans-part">
                                                    <select
                                                        className="form-control"
                                                        name="rule"
                                                        onChange={e =>
                                                            this.addNewCondtions(e, drop, "rule")
                                                        }
                                                    >
                                                        <option value="" disabled selected>
                                                            Select your option
                                                        </option>
                                                        <option
                                                            selected={
                                                                drop.rule === "and" ? "selected" : ""
                                                            }
                                                            value="and"
                                                        >
                                                            AND
                                                        </option>
                                                        <option
                                                            selected={
                                                                drop.rule === "any" ? "selected" : ""
                                                            }
                                                            value="any"
                                                        >
                                                            ANY
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="addbtn" onClick={() => this.addMultiSource(index)}>
                                            <i className="fa fa-plus" />
                                        </div>
                                        <div className="deletbtn" onClick={() => this.deleteCondtion(index)}>
                                            <i className="fa fa-trash" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {(this.state.validate === 1) ? <p className="conditionerror"> <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>  Kindly Fill all the Fields to add more Conditions</p> : ""}
                        <div className="plus plus-btns" onClick={this.addCondtion}>
                            <i className="fa fa-plus-circle" />{" "}
                        </div>
                        {/*  <div className="" onClick={this.saveCondition}>Save</div> */}
                    </div>
                </div>
                <Snackbar
                    place="br"
                    color={msgColor}
                    open={br}
                    message={message}
                    closeNotification={() => this.setState({ br: false })}
                    close
                />
            </div>
        );
    }
}
export default withStyles(styles)(Settings);