/**
 * CreateSurvey component.
 * 
 * This component is used to create a custom survey page.
 *
 * 
 */

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { Redirect } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import api2 from "../../helpers/api2";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import cloneDeep from 'lodash/cloneDeep';

/* Survey pages */
import SurveyInfo from "./SurveyInfo/SurveyInfo";
import SurveyBuilder from "./SurveyBuilder/SurveyBuilder";
import "./CreateSurvey.css";
import Settings from "./settings";
import $ from 'jquery';

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: {
            main: "#074e9e"
        }
    }
});

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

/**
 * gets the steps of the views.
 *
 * @public
 * @returns {string} [Survey Info], [Form Builder], [Preview]
 */
function getSteps() {
    //return ["Survey Info", "Form Builder", "Conditions", "Preview"];
    return ["Survey Info", "Form Builder", "Conditions"];
}

let handleClick;


/**
 * Creates a survey view which is to get the customizable user input.
 */
class CreateSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            name: "",
            tags: "",
            points: 0,
            minutes: 0,
            project_id: "",
            mission_id: "",
            saveform: false,
            selectedValue: "all",
            redirect: false,
            drops: [],
            conditions: [],
            lopen: false,
            ropen: false,
            id: "",
            validate: 0,
            loading: 0,
            qid: 0,
            draftid: 0,
            updatedate: "",
            platformType: "",
            isAssigned: "",
            refcode: "",
            duplicatemissionRefCode: false,
            /* snackbar props */
            msgColor: "info",
            message: "",
            br: false,
            con: false,
            refcodedit: false,
            oldrefcode: "",
            positionChanged: false,
            languagelist: [],
            selectedlanguage: [],
            languages_drop: [],
            defaultdrops: [],
            defaultconditions: [],
            dropcurrentlanguage: { label: "English", value: 'English' },
            concurrentlanguage: { label: "English", value: 'English' },
            deletelanguage: [],
            load: false
        };
        this.props.handleCollapseScreen(false);
        this.elementsbar = this.showAddElements.bind(this);
        this.settingsbar = this.settingsOptions.bind(this);
        this.addCondtions = this.addCondtions.bind(this);
        this.ShowNotification = this.ShowNotification.bind(this);
    }


    /**
     * Handles on clearing set interval.
     */
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    /**
     * Handles on loading data from api.
     */
    componentDidMount() {
        localStorage.removeItem('updateProperties');
        //this.interval = setInterval(() => this.handleOnClick2("draft", "auto"), 20000)
        this.getlanguagelist()
        if (this.props.match.params.id) {
            const id = this.props.match.params.id;
            api2.get("survey?id=" + id)
                .then(resp => {
                    if (resp.data.refcode && (resp.data.refcode === "" || !resp.data.refcode)) {
                        this.generaterefcode('generate');
                    }
                    let selectedlanguage = []
                    let languages_drop = {};
                    resp.data.languages.forEach((x, y) => {
                        selectedlanguage.push({
                            label: x,
                            value: x
                        })

                        if (x !== "English") {

                            languages_drop[x] = {
                                conditions: [],
                                conditions_completed: 1,
                                content: [],
                                content_completed: 0,
                                id: null,
                                language: x,
                                survey_id: id,
                            }
                        }
                    })
                    // this.state.selectedlanguage = selectedlanguage
                    this.setState({
                        name: resp.data.title,
                        tags: resp.data.tags,
                        refcode: resp.data.refcode,
                        points: resp.data.survey_points,
                        selectedValue: resp.data.type,
                        drops: resp.data.content,
                        defaultdrops: resp.data.content,
                        defaultconditions: resp.data.conditions,
                        conditions: resp.data.conditions,
                        id: resp.data.id,
                        draftid: resp.data.id,
                        minutes: resp.data.survey_minutes,
                        platformType: resp.data.platform_type,
                        isAssigned: resp.data.isAssigned ? resp.data.isAssigned : "",
                        oldrefcode: resp.data.refcode,
                        selectedlanguage: selectedlanguage,
                        languages_drop: languages_drop
                    }, () => {
                        this.getlanguagedetails()
                    });

                })
                .catch(error => {
                    if (error.response) {
                        //console.log(error.response.status);
                        //console.log(error.response.headers);
                    } else if (error.request) {
                        //console.log(error.request);
                    } else {
                        //console.log("Error", error.message);
                    }
                    //console.log(error.config);
                });
        } else {
            this.generaterefcode('create');
        }
    }

    /* Handles api to generate the ref code*/
    generaterefcode(check) {
        let refcode = ""
        api2
            .get("refcode/generate?type=S")
            .then(resp => {
                if (resp.status === 200) {
                    refcode = resp.data.message;
                    if (check === 'generate') {
                        this.saverefcode(refcode, 'generate');
                        this.setState({ Poldrefcode: refcode })
                    } else {
                        this.setState({
                            refcode: refcode,
                            oldrefcode: refcode
                        })
                    }
                }
            })
            .catch(error => {
                //console.error(error);
            });
    }

    /* Handles api to save the ref code*/
    saverefcode(refcode, check) {
        api2
            .get("refcode/save?refcode=" + refcode)
            .then(resp => {
                if (resp.status === 200) {
                    if (check === 'generate') {
                        this.updateprojectrefcode(refcode)
                    } else {
                        this.setState({
                            refcodedit: false,
                        })
                    }
                }
            })
            .catch(error => {
                //console.error(error);
            });
    }

    /* Handles the event to validate the type and pass ref code*/
    savedropsrefcode(drops) {
        drops.forEach(r => {
            if (r.type !== 'info' && r.type !== 'gps') {
                this.savedroprefcode(r.properties.refcode);
            }
        })
    }

    /* Handles api to save the ref code. */
    async savedroprefcode(refcode) {
        api2
            .get("refcode/save?refcode=" + refcode)
            .then(resp => {
                if (resp.status === 200) {
                    //
                }
            })
            .catch(error => {
                //console.error(error);
            });
    }
    /* Handles api to update the ref code. */
    updateprojectrefcode(refcode) {
        let id = this.props.match.params.id;
        api2
            .get("refcode/update?refcode=" + refcode + "&survey_id=" + id)
            .then(resp => {
                if (resp.status === 200) {
                    this.setState({
                        refcode: refcode
                    })
                }
            })
            .catch(error => {
                //console.error(error);
            });
        this.stopLoading();
    }

    /* Handles api to fetch language list. */
    getlanguagelist() {
        api2
            .get("v1/languages")
            .then(resp => {
                let proj = [];
                resp.data.data.forEach((x, i) => {
                    ////console.log(i);
                    proj.push({ value: x, label: x });
                });
                this.setState({ languagelist: proj });
            })
            .catch((error) => {
                //console.log(error)
            });
    }
    // (languages_drop[L.value] && languages_drop[L.value].language && languages_drop[L.value].language !== L.value)

    /* Handles this function to update the selected language in the selected language list.*/
    handleselectedlanguage = (name, value) => {
        let defaultlanguage = false;
        let getlanguagedetails = false;
        let languages_drop = this.state.languages_drop;
        let id = this.state.id;
        if (id !== "") {
            value.forEach((L, I) => {
                if ((!languages_drop[L.value]) || (languages_drop[L.value].content.length < 1)) {

                    if (L.label !== 'English') {
                        let data = {
                            language: L.label,
                            survey_id: id,
                            questions: [],
                            conditions: [],
                            content_completed: 0,
                            conditions_completed: 1
                        }
                        getlanguagedetails = true;
                        this.AddLanuageToApi(data)
                    }

                }
                if (L.value === 'English') { defaultlanguage = true }
            })
            if (!defaultlanguage) {
                let defaultlanguage = {
                    label: "English",
                    value: "English"
                };
                value.push(defaultlanguage)
            }
        }

        this.setState({
            selectedlanguage: value,
            languages_drop: languages_drop,
            load: getlanguagedetails ? true : false
        }, () => {
            if (getlanguagedetails) {
                setTimeout(() => {
                    this.getlanguagedetails()
                }, 1000);
            }
        });
    }

    /* Set the default language as english. */
    OtherLanguagegenerate = (dname) => {

        // this.getlanguagedetails()
        this.setState({
            dropcurrentlanguage: { label: 'English', value: 'English' },
            concurrentlanguage: { label: 'English', value: 'English' },
            drops: this.state.defaultdrops
        })
        this.generateotherlanguage();
    };

    /* Handles this function to delete the language from the selected language list in the api. */
    deletelanguageslist = (value) => {
        let deletelanguages = value
        let language = this.state.languages_drop
        deletelanguages.forEach((l, i) => {
            if (l.label !== 'English') {
                let id = ""
                if (language[l.label] && language[l.label].id) {
                    id = language[l.label].id
                    let url = "survey_language?id=" + id;
                    delete this.state.languages_drop[l.label]
                    this.deletelanguagetoapi(url)
                } else {
                    if (language[l.label]) {
                        delete this.state.languages_drop[l.label]
                    }
                }
            }
        })
    }

    /* Handles this function to delete the language from the selected language list in the local list. */
    handledeletelanguage = (value) => {
        this.deletelanguageslist(value)
        let matchlanguage = []
        let language = this.state.languages_drop
        let selectedlanguage = this.state.selectedlanguage
        if (value.length > 0) {
            value.forEach((m, n) => {
                selectedlanguage.forEach((x, y) => {
                    if (x.label === m.label) {
                        matchlanguage.push(y)
                    }
                })
            })
            matchlanguage.forEach((a, b) => {
                selectedlanguage.splice(a, 1)
            })
        }

        this.setState({
            languages_drop: language,
            selectedlanguage: selectedlanguage
        })
    }

    /* Handles the api to delete language. */
    deletelanguagetoapi = (url) => {
        api2.delete(url)
            .then(resp => {
                //console.log('delete ok',resp)
            })
            .catch(error => {
                //console.log('delete error')

            });
    }

    /* Handles this function to retrieve all the survey element details for all the selected languages except default language. */
    getlanguagedetails = () => {
        let value = this.state.selectedlanguage;
        let id = this.state.id

        if (id !== "") {
            value.forEach((l, i) => {
                if (l.label !== 'English') {
                    //  if (languages_drop[l.value]&& languages_drop[l.value].id && languages_drop[l.value].id === null){
                    // console.log('22222',languages_drop[l.value].content.length)
                    // if (apicall) {
                    this.setState({ load: true })
                    // if (id !== "") {
                    let url = "survey_language?survey_id=" + id + "&language=" + l.label;
                    this.getlanguagedetailstoapi(url)
                    // }
                    // }
                    // }
                }
                else {
                    this.setState({ load: false })
                }
            })
        } else {
            this.setState({ load: false })
        }

    }

    /* Handles the api retrieve all the survey element details for all the selected languages except default language. */
    getlanguagedetailstoapi = (url) => {
        api2.get(url)
            .then(resp => {
                let languages_drop = this.state.languages_drop
                languages_drop[resp.data.language] = resp.data;
                this.setState({ load: false, languages_drop })
            })
            .catch(error => {
                this.setState({ load: false })
            });
    }

    /* Unused function. */
    AddLanuage = () => {
        let value = this.state.selectedlanguage
        let language = this.state.languages_drop;

        value.forEach((l, i) => {
            if (l.label !== 'English') {
                let data = {
                    language: l.label,
                    survey_id: this.state.id,
                    questions: language[l.label].content,
                    id: language[l.label].id,
                    conditions: language[l.label].conditions,
                    content_completed: language[l.label].content_completed,
                    conditions_completed: language[l.label].conditions_completed
                }
                this.AddLanuageToApi(data)
            }
        })
    }

    /* Handles the api to form the initial data format for seleceted languages except default lang. */
    AddLanuageToApi = (data) => {
        //console.log('lan data')
        api2.post("survey_language", data)
            .then(resp => {
                //console.log('lan added')
            })
            .catch(error => {
                //console.log('lan error')

            });
    }

    /* Unused function. */
    OtherLancongenerate = (dname) => {

        if (this.state.dropcurrentlanguage.value === "English") {
            this.setState({ defaultdrops: this.state.drops, defaultconditions: this.state.conditions })
        }
        else {
            let languages_drop = this.state.languages_drop
            languages_drop[this.state.dropcurrentlanguage.value].content = cloneDeep(this.state.drops)
            this.setState({ languages_drop })
        }
        this.setState({ drops: this.state.defaultdrops, conditions: this.state.defaultconditions })
        this.setState({
            dropcurrentlanguage: { label: 'English', value: 'English' },
            concurrentlanguage: { label: 'English', value: 'English' },
        })
    };

    /* Handles validation of all labels for all question type to be filled or not. */
    get_completed = (x, y) => {
        let defaultdrops = x;
        let fieldprops = this.state.defaultdrops[y];
        if (fieldprops.type === 'info') {
            if (defaultdrops.label === "" && fieldprops.label !== "") {

                return false;
            }
            else if ((defaultdrops.properties.info_text === "" && fieldprops.properties.info_text !== "") ||
                (defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

                return false;
            }
            else {
                return true;
            }
        }
        else if (fieldprops.type === 'input') {
            if ((fieldprops.label !== "" && defaultdrops.label === "")) {

                return false;
            }
            else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

                return false;
            }
            else {
                return true;
            }
        }
        else if (fieldprops.type === 'capture') {
            if ((defaultdrops.label === "" && fieldprops.label !== "")) {

                return false;
            }
            else if ((fieldprops.properties.question !== "" && defaultdrops.properties.question === "")) {

                return false;
            }
            else if ((fieldprops.properties.instruction_text && fieldprops.properties.instruction_text !== "") &&
                defaultdrops.properties.instruction_text && defaultdrops.properties.instruction_text === "") {
                return false;
            }
            else if ((fieldprops.properties.marker_instruction_text && fieldprops.properties.marker_instruction_text !== "") &&
                defaultdrops.properties.marker_instruction_text && defaultdrops.properties.marker_instruction_text === "") {
                return false;
            }
            else if ((fieldprops.properties.scale_text && fieldprops.properties.scale_text !== "") &&
                defaultdrops.properties.scale_text && defaultdrops.properties.scale_text === "") {
                return false;
            }
            else {
                return true;

            }
        }
        else if (fieldprops.type === 'upload') {
            if ((fieldprops.label !== "" && defaultdrops.label === "")) {

                return false;
            }
            else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

                return false;
            }
            else {
                return true;
            }
        }
        else if (fieldprops.type === 'choice') {
            if ((fieldprops.label !== "" && defaultdrops.label === "")) {

                return false;
            }
            else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

                return false;
            }
            else if (!fieldprops.properties.multilevel && !defaultdrops.properties.multilevel) {
                return true;
            }
            else if (fieldprops.properties.multilevel === 1) {
                if (fieldprops.properties.options) {
                    fieldprops.properties.options.map((x, y) => {
                        if (x.label !== "" && (defaultdrops.properties.options[y].label === "")) {
                            return false;
                        } else {
                            return true;
                        }
                    })
                }
            }
            else if (fieldprops.properties.multilevel === 0 || fieldprops.properties) {
                if (fieldprops.properties.options) {
                    fieldprops.properties.options.map((x, y) => {
                        if (x.label !== "" && (defaultdrops.properties.options[y].label === "")) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    })
                }
            }
        }
        else if (fieldprops.type === 'gps') {
            if (fieldprops.label !== "" && defaultdrops.label === "") {

                return false;
            }
            else if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

                return false;
            }
            else {
                return true;
            }
        }
        else if (fieldprops.type === 'scale') {
            if ((fieldprops.label === "" && defaultdrops.label !== "")) {

                return false;
            }
            else if ((defaultdrops.properties.question !== "" && fieldprops.properties.question === "")) {

                return false;
            }
            else if (fieldprops.properties.end_text !== "" && defaultdrops.properties.end_text === "") {
                return false;
            }
            else if (fieldprops.properties.start_text !== "" && defaultdrops.properties.start_text === "") {
                return false;
            }
            else {
                return true;
            }
        }
        else if (fieldprops.type === 'barcode') {
            if (fieldprops.label !== "" && defaultdrops.label === "") {

                return false;
            }
            if ((defaultdrops.properties.question === "" && fieldprops.properties.question !== "")) {

                return false;
            } else {
                return true;
            }
        }
    }

    /* Notification gets enabled when the questions are not properly filled when compared to default language. */
    editlanguage = (notification) => {
        let value = this.state.selectedlanguage
        let language = this.state.languages_drop;
        let defaultdrops = this.state.defaultdrops
        let ShowNotification = ""

        value.forEach((l, i) => {
            if (l.label !== 'English') {
                let content_completed = 0;
                let match = true;
                let questions = ""
                language[l.label].content.forEach((x, y) => {
                    if (x.completed === 0) {
                        let completed = this.get_completed(x, y);
                        if (completed) {
                            x.completed = 1;
                        } else {
                            match = false
                            questions = questions === "" ? (x.label === "" ? defaultdrops[y].label : defaultdrops[y].properties.question) : questions + " ," + (x.label === "" ? defaultdrops[y].label : defaultdrops[y].properties.question)
                        }
                    }
                })
                if (match) {
                    content_completed = 1;
                }

                let data = {
                    questions: language[l.label].content,
                    conditions_completed: 1,
                    conditions: language[l.label].conditions,
                    content_completed: content_completed,
                    id: language[l.label].id
                }
                language[l.label].content_completed = content_completed

                this.editlanguagetoapi(data)
                if (content_completed === 0) {
                    ShowNotification = ShowNotification === "" ? (l.label + "(" + questions + ")") : ShowNotification + ', ' + l.label + "(" + questions + ")"
                }

            }
        })
        if (notification && ShowNotification !== "") {
            this.ShowNotification(ShowNotification + " language is incomplete. Hence this version will not be available in mobile app.", 'danger', 600000)
        }
    }

    /* Handles this function to form the changes in selected language list. */
    editlanguageupdate = (notification) => {
        let value = this.state.selectedlanguage
        let language = this.state.languages_drop;
        value.forEach((l, i) => {
            if (l.label !== 'English') {
                let data = {
                    questions: language[l.label].content,
                    conditions_completed: 1,
                    conditions: language[l.label].conditions,
                    content_completed: language[l.label].content_completed,
                    id: language[l.label].id
                }
                this.editlanguagetoapi(data)
            }
        })
    }

    /* Handles this api to update the changes in selected language list. */
    editlanguagetoapi = (data) => {
        let url = "survey_language";
        api2.patch(url, data)
            .then(resp => {
                //console.log('lan added')
            })
            .catch(error => {
                //console.log('lan error')

            });
    }

    /* Unused function. */
    generateotherlancon = () => {
        let value = this.state.selectedlanguage
        let language = this.state.languages_drop;
        const defaultconditions = cloneDeep(this.state.defaultconditions);
        let survey_id = this.state.id
        value.forEach((l, i) => {
            let conditions = []
            if (language[l.label] && language[l.label].conditions && language[l.label].conditions.length > 0) {
                conditions = language[l.label].conditions;
            } else {
                conditions = this.getotherlanguageconditions(defaultconditions)
            }
            if (l.label !== 'English') {
                language[l.label] = {
                    'content': language[l.label].content,
                    'conditions': conditions,
                    'conditions_completed': 1,
                    'content_completed': language[l.label].content_completed,
                    'id': language[l.label].id,
                    'language': language[l.label],
                    'survey_id': survey_id,
                }
            }
        })
        this.setState({
            languages_drop: language
        })
    }

    /* Unused function */
    getotherlanguageconditions = (org) => {
        let conditions = []
        org.forEach((q, i) => {
            q.completed = 1;
            let match = false;
            if (q.source) {
                q.source.forEach((x, y) => {
                    if (x.match_value && x.source_type === "input") {
                        conditions.push(q);
                        conditions[i].source[y].match_value = ""
                        q.completed = 0;
                        match = true;
                    } else {
                        conditions.push(q);
                        match = true;
                    }
                })
            }
            else {
                conditions.push(q);
                match = true;
            }
            if (!match) {
                conditions.push(q);
            }
        })
        return conditions
    }

    /* Unused function */
    changecondroplanguage = (value) => {
        if (this.state.dropcurrentlanguage.value === "English") {
            this.setState({ defaultconditions: this.state.conditions })
        } else {
            let languages_drop = this.state.languages_drop
            languages_drop[this.state.dropcurrentlanguage.value].content = cloneDeep(this.state.conditions)
            this.setState({ languages_drop: languages_drop })
        }
        if (value === "English") {
            this.setState({
                conditions: this.state.defaultconditions,
                dropcurrentlanguage: { label: value, value: value }
            })
        } else {

            this.setState({
                conditions: this.state.languages_drop[value].conditions,
                dropcurrentlanguage: { label: value, value: value }
            })
        }

        //console.log('languages_drop', this.state.languages_drop)
    }

    /* Validates the language in selected language list and updates the content respectively */
    generateotherlanguage = () => {
        let value = this.state.selectedlanguage
        let language = this.state.languages_drop;
        let defaultdrops = cloneDeep(this.state.drops)
        let survey_id = this.state.id
        value.forEach((l, i) => {
            let content = [];
            let conditions = [];
            let conditions_completed = 1;
            let content_completed = 0;
            let id = "";
            if (l.label !== 'English') {
                if (language[l.label] && language[l.label].content && language[l.label].content.length > 0) {
                    content = language[l.label].content
                } else {
                    content = this.getotherlanguagecontent(defaultdrops)
                }
                if (language[l.label] && language[l.label].conditions && language[l.label].conditions.length > 0) {
                    conditions = language[l.label].conditions
                } else {
                    conditions = [];
                }
                if (language[l.label] && language[l.label].content_completed) {
                    content_completed = language[l.label].content_completed;
                }
                if (language[l.label] && language[l.label].conditions_completed) {
                    conditions_completed = language[l.label].conditions_completed;
                }
                if (language[l.label] && language[l.label].id) {
                    id = language[l.label].id
                }
                if (language[l.label] && language[l.label].survey_id) {
                    survey_id = language[l.label].survey_id
                }
                language[l.label] = {
                    'content': content,
                    'conditions': conditions,
                    conditions_completed: conditions_completed,
                    content_completed: content_completed,
                    id: id,
                    language: language[l.label],
                    survey_id: survey_id,
                }
            }
        })
        this.setState({
            languages_drop: language
        })
        //console.log('other_language', language)
    }

    /* Handles the event in updating the language in the property window. */
    changedroplanguage = (value) => {
        if (this.state.dropcurrentlanguage.value === "English") {
            this.setState({ defaultdrops: this.state.drops, defaultconditions: this.state.conditions })
        } else {
            let languages_drop = this.state.languages_drop
            languages_drop[this.state.dropcurrentlanguage.value].content = this.state.drops
            languages_drop[this.state.dropcurrentlanguage.value].conditions = cloneDeep(this.state.conditions)
            this.setState({ languages_drop: languages_drop })
        }
        if (value === "English") {
            this.setState({
                conditions: this.state.defaultconditions,
                drops: this.state.defaultdrops,
                dropcurrentlanguage: { label: value, value: value },
                concurrentlanguage: { label: value, value: value }
            })
        } else {

            this.setState({
                conditions: this.state.languages_drop[value].conditions,
                drops: this.state.languages_drop[value].content,
                dropcurrentlanguage: { label: value, value: value },
                concurrentlanguage: { label: value, value: value }
            })
        }

        //console.log('languages_drop', this.state.languages_drop)
    }

    /* Unused function */
    updateconlanguage = (value) => {
        if (this.state.concurrentlanguage.value === "English") {
            this.setState({ defaultconditions: this.state.conditions, defaultdrops: this.state.drops })
            if (value !== "English") {
                if (this.state.languages_drop[value].conditions && this.state.languages_drop[value].conditions.length > 0) {

                    this.state.languages_drop[value].conditions.forEach((x, y) => {
                        let temp = []
                        if ((x.target.do === "hide_multiple" || x.target.do === "show_multiple" || x.target.do === "loop"
                            || x.target.do === "loop_set" || x.target.do === "loop_input") && x.target.multifield && x.target.multifield.length > 0) {

                            x.target.multifield.forEach((d, e) => {
                                this.state.languages_drop[value].content.forEach((c, b) => {
                                    if ((d.value === c.handler) || (d.handler === c.handler)) {
                                        let opt = {
                                            label: c.label,
                                            value: c.handler
                                        }
                                        temp.push(opt)
                                    }
                                })
                            })
                        }
                        let languages_drop = this.state.languages_drop
                        languages_drop[value].conditions[y].target.multifield = temp
                        this.setState({ languages_drop: languages_drop })
                        temp = []
                    })

                }
            }
        }
        else {
            let languages_drop = this.state.languages_drop
            languages_drop[this.state.concurrentlanguage.value].conditions = cloneDeep(this.state.conditions)
            languages_drop[this.state.concurrentlanguage.value].content = cloneDeep(this.state.drops)
            this.setState({ languages_drop: languages_drop })

            if (value === "English") {
                if (this.state.defaultconditions && this.state.defaultconditions.length > 0) {
                    this.state.defaultconditions.forEach((x, y) => {
                        let temp = []
                        if ((x.target.do === "hide_multiple" || x.target.do === "show_multiple" || x.target.do === "loop"
                            || x.target.do === "loop_set" || x.target.do === "loop_input") && x.target.multifield && x.target.multifield.length > 0) {
                            x.target.multifield.forEach((d, e) => {
                                this.state.defaultdrops.forEach((c, b) => {
                                    if ((d.value === c.handler) || (d.handler === c.handler)) {
                                        let opt = {
                                            label: c.label,
                                            value: c.handler
                                        }
                                        temp.push(opt)
                                    }
                                })
                            })
                        }
                        let tmp_defaultconditions = this.state.defaultconditions
                        tmp_defaultconditions[y].target.multifield = temp
                        this.setState({ defaultconditions: tmp_defaultconditions })
                        temp = []
                    })
                }
            }

        }
        if (value === "English") {
            this.setState({
                conditions: this.state.defaultconditions,
                drops: this.state.defaultdrops,
                concurrentlanguage: { label: value, value: value },
                dropcurrentlanguage: { label: value, value: value }
            })
        } else {
            //console.log('check',this.state.languages_drop[value].conditions)
            this.setState({
                conditions: this.state.languages_drop[value].conditions,
                drops: this.state.languages_drop[value].content,
                concurrentlanguage: { label: value, value: value },
                dropcurrentlanguage: { label: value, value: value }
            })
        }

        //console.log('languages_drop', this.state.languages_drop)
    }

    /* Handles the event to swap the questions for other languages when swap occur in default language. */
    downArrowFuncLanguage = e => {
        let position = e;
        let languages_drop = this.state.languages_drop;
        let selectedlanguage = this.state.selectedlanguage
        selectedlanguage.forEach((a, i) => {
            if (a.label !== 'English') {
                for (let i = 0; i < languages_drop[a.label].content.length; i++) {
                    if (languages_drop[a.label].content[i].question_id === e) {
                        position = i;
                        break;
                    }
                }

                let newarray = languages_drop[a.label].content.slice();
                let arrlen = newarray.length - 1;

                if (position !== arrlen) {
                    let temp = newarray[position + 1];
                    newarray[position + 1] = newarray[position];
                    newarray[position] = temp;
                }
                this.state.languages_drop[a.label].content = newarray;
                // let languages_drop_tmp = this.state.languages_drop
                // languages_drop_tmp[a.label].content = newarray;
                // this.setState({ languages_drop: languages_drop_tmp })
            }
        })
    };

    /* Handles the event to swap the questions for other languages when swap occur in default language. */
    upArrowFuncLanguage = e => {
        let position = e;
        let languages_drop = this.state.languages_drop;
        let selectedlanguage = this.state.selectedlanguage
        selectedlanguage.forEach((a, i) => {
            if (a.label !== 'English') {
                for (let i = 0; i < languages_drop[a.label].content.length; i++) {
                    if (languages_drop[a.label].content[i].question_id === e) {
                        position = i;
                        break;
                    }
                }

                var newarray = languages_drop[a.label].content.slice();

                if (position !== 0) {
                    let temp = newarray[position - 1];
                    newarray[position - 1] = newarray[position];
                    newarray[position] = temp;
                }
                this.state.languages_drop[a.label].content = newarray;
                //let languages_drop_tmp = this.state.languages_drop
                // languages_drop_tmp[a.label].content = newarray;
                // this.setState({ languages_drop: languages_drop_tmp })
            }
        })
    };

    /* Handles the event to delete the question and update the position of questions respectively. */
    deleteDrops = (i, flag) => {
        if (flag && flag === true) {
            this.setState({
                positionChanged: true
            });
        }

        this.setState({
            drops: i,
            defaultdrops: i
        }, this.autoSave);
    };
    setDropsLang = (languages_drop) => {
        this.setState({
            languages_drop: languages_drop
        }, this.autoSave);
    };


    /* Handles this function to update the properties in other languages when changes occur in default language except label. */
    updatelanguageproperties = (index, properties, check, e) => {
        let languages_drop = this.state.languages_drop;
        let selectedlanguage = this.state.selectedlanguage
        selectedlanguage.forEach((a, i) => {
            if (a.label !== 'English') {
                if (check) {
                    if (properties === 'multilevel') {
                        if (e === 1) {
                            languages_drop[a.label].content[index].properties['image_size'] = 'small';
                        } else {
                            if (languages_drop[a.label].content[index].properties.options && languages_drop[a.label].content[index].properties.options.length > 0) {
                                languages_drop[a.label].content[index].properties.options.forEach(sub => {
                                    if (sub.sublabel) {
                                        delete sub.sublabel
                                    }
                                })
                            }
                        }
                    }
                    languages_drop[a.label].content[index].properties[properties] = e;
                }
                else {
                    languages_drop[a.label].content[index].properties[properties] = "";
                }
                // a.content.push(drop)
            }
        })
        this.setState({ languages_drop })
    }

    /* Handles this function to update the position of question in other languages when changes occur in default language. */
    updatelanguagedrop = (action, drop, index) => {
        let languages_drop = this.state.languages_drop;
        let selectedlanguage = this.state.selectedlanguage
        if (action === "move") {
            //let updatedrop = [];
            //updatedrop.push(drop)
            selectedlanguage.forEach((a, i) => {
                if (a.label !== 'English') {
                    let updatedrop = [];
                    let drops = cloneDeep(drop)
                    updatedrop.push(drops)
                    let content = this.getotherlanguagecontent(updatedrop)
                    languages_drop[a.label].content.splice(index, 0, (content[0]))

                    if (languages_drop[a.label].id) {
                        languages_drop[a.label].id = languages_drop[a.label].id
                    }
                    if (languages_drop[a.label].conditions_completed) {
                        languages_drop[a.label].conditions_completed = languages_drop[a.label].conditions_completed
                    }
                    if (languages_drop[a.label].content_completed) {
                        languages_drop[a.label].content_completed = languages_drop[a.label].content_completed
                    }
                }
            })
            this.setState({ languages_drop })
        }
        else if (action === "reorder") {
            let sourceindex = index;
            let destinationindex = drop;
            selectedlanguage.forEach((a, i) => {
                if (a.label !== 'English') {
                    let removed = languages_drop[a.label].content.splice(sourceindex, 1);
                    languages_drop[a.label].content.splice(destinationindex, 0, removed[0]);
                    this.setState({ languages_drop })
                }
            })
        }
    }

    /* Validates the language in selected language list and updates the content and empty the label respectively . */
    getotherlanguagecontent = (org) => {
        // let org = this.state.drops;
        let question = []
        org.forEach((q, i) => {
            let properties = q.properties;
            properties['question'] = '';
            properties['subheading'] = '';

            if (q.type === 'info') {
                properties['info_text'] = '';
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    type: q.type
                }
                return question.push(content)
            }
            else if (q.type === 'input') {
                properties['sublabel'] = '';
                properties['subheading_text'] = '';
                properties['sublabel_text'] = '';
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    type: q.type
                }
                return question.push(content)
            }
            else if (q.type === 'gps') {
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    type: q.type
                }
                return question.push(content)
            }
            else if (q.type === 'capture') {
                properties['instruction_text'] = '';
                properties['marker_instruction_text'] = '';
                properties['markertext_text'] = '';
                properties['scale_text'] = '';
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    type: q.type
                }
                return question.push(content)
            }
            else if (q.type === 'scale') {
                properties['start_text'] = '';
                properties['end_text'] = '';
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    type: q.type
                }
                return question.push(content)
            }
            else if (q.type === 'upload') {
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    rightStatus: q.rightStatus,
                    type: q.type
                }
                return question.push(content)
            }
            else if (q.type === 'barcode') {
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    type: q.type
                }
                return question.push(content)
            }
            else if (q.type === 'choice') {
                // if (properties.options) {
                //     properties.options = this.getoptions(q, i, q.properties.multilevel ? q.properties.multilevel : 0);

                // }
                let content = {
                    conditions: [],
                    handler: q.handler,
                    completed: 0,
                    label: q.label,
                    properties: properties,
                    question: "",
                    question_id: q.question_id,
                    rightStatus: q.rightStatus,
                    type: q.type
                }
                return question.push(content)
            }
        })

        return question
    }

    /* Used to validate the choice question and empty the label for other languages. */
    getoptions = (q, i, multilevel) => {
        let options = []
        if (q.properties.options) {
            q.properties.options.forEach((o, p) => {
                let opt = {
                    id: o.id,
                    label: "",
                    label_image: o.label_image
                }
                let suboptions = [];

                if (multilevel === 1 && o.sublabel) {
                    o.sublabel.forEach((s, si) => {
                        let subopt = {
                            id: s.id,
                            sublabel: "",
                            label_image: s.label_image,
                            childlabel_text: ''
                        }

                        suboptions.push(subopt)
                    })
                    opt.sublabel = suboptions;
                }

                options.push(opt)
            })
        }
        return options
    }


    /* Handles the event to update the platform type. */
    handlePlatformType = event => {

        this.setState({
            platformType: event.value
        });


    };

    /* Handles the snackbar message notification. */
    ShowNotification = (msg, color, time) => {
        this.setState({
            message: msg,
            msgColor: color,
            //   br:true
        });

        let place = "br";
        var x = [];
        x[place] = true;
        this.setState(x);
        if (time !== '') {
            this.alertTimeout = setTimeout(
                function () {
                    x[place] = false;
                    this.setState(x);
                }.bind(this),
                time
            );
        }
    }

    /* Unused function. */
    ShowConNotification = (msg, color, time) => {
        this.setState({
            message: msg,
            msgColor: color,
            //   br:true
        });

        let place = "con";
        var x = [];
        x[place] = true;
        this.setState(x);
        // this.alertTimeout = setTimeout(
        //     function () {
        //         x[place] = false;
        //         this.setState(x);
        //     }.bind(this),
        //     time
        // );
    }

    /**
     * Sets the input element.
     *
     */
    settingsOptions(e) {
        if (e === "open2") {
            this.setState({
                ropen: true
            });
        } else if (e === "open1") {
            this.setState({
                ropen: false
            });
        }
    }

    /**
     * Handle property bar.
     *
     */
    showAddElements() {
        this.setState({
            lopen: !this.state.lopen
        });
    }

    /**
     * Listen to changes on drop.
     */
    dropChange = (i, pos) => {
        this.setState({
            drops: i,
            defaultdrops: i
        });
        if (pos) {
            this.setState({
                positionChanged: true
            });
        }

    };

    /* Handles this function to validate the type and properties to be filled. */
    CheckScale = () => {
        let scalecheck = true;
        let labelname = "";
        let type = "";
        let defaultdrops = this.state.drops;
        for (let i = 0; i < defaultdrops.length; i++) {
            let q = defaultdrops[i];
            if (q.type === 'scale') {
                if (q.properties && q.properties.scale_type && q.properties.scale_type !== '') {
                    if (q.properties.scale_type === "scale" && q.properties.scale_content) {
                        if (q.properties.icon_type) {
                            if (q.properties.scale_content.length <= 0) {
                                scalecheck = false;
                                labelname = q.label;
                                type = "Scale";
                                break;
                            }
                        }
                    }
                    else if (q.properties.scale_type === "table" && q.properties.table_content) {
                        let optionObject = q.properties.table_content.table_options && q.properties.table_content.table_options.filter((obj) => {
                            return !obj.value
                        })
                        let valueObject = q.properties.table_content.table_value && q.properties.table_content.table_value.filter((obj) => {
                            return !obj.value
                        })
                        if (!q.properties.table_content.options_length || !q.properties.table_content.value_length) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "Table";
                            break;
                        }
                        else if (q.properties.table_content.options_length <= 0 || q.properties.table_content.value_length <= 0) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "Table";
                            break;
                        }
                        else if (((optionObject && optionObject.length) > 0) || (valueObject && valueObject.length) > 0) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "Table";
                            break;
                        }
                    }
                    else if (q.properties.scale_type === "maxdiff" && q.properties.attribute_data) {
                        let emptyAttribute = q.properties.attribute_data && q.properties.attribute_data.filter((obj) => {
                            return obj.label.trim().length === 0
                        })
                        if (q.properties.attribute_data.length <= 0) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "maxdiff";
                            break;
                        }
                        else if (!q.properties.Maximum_Attributes) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "maxdiff";
                            break;
                        }
                        else if (!q.properties.Attribute_PerTask) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "maxdiff";
                            break;
                        }
                        else if (!q.properties.Repeate_Attribute) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "maxdiff";
                            break;
                        }
                        else if (emptyAttribute.length > 0) {
                            scalecheck = false;
                            labelname = q.label;
                            type = "maxdiff";
                            break;
                        }
                    }
                    else {
                        scalecheck = false;
                        labelname = q.label;
                        type = "Scale";
                        break;
                    }
                } else {
                    scalecheck = false;
                    labelname = q.label;
                    type = "Scale";
                    break;
                }
            }
        }
        if (!scalecheck) { this.ShowNotification(" ( " + labelname + " ) " + type + " Elements Are Empty. This will affect the display in mobile app.", "danger", 5000); }
        return scalecheck;
    }

    /**
     * Handle next button.
     *
     */
    handleNextProps = () => {
        this.setState({ br: false });
        $('div').removeClass('disabledContent');
        localStorage.removeItem('updateProperties');
        handleClick = '';
        const { activeStep } = this.state;
        const steps = getSteps();
        activeStep === steps.length - 1 ?
            this.handleOnClick() : activeStep === 2 ?
                this.handleNext2() : this.handleNext()
    }

    handleNext = () => {
        if (localStorage.getItem('updateProperties')) {
            handleClick = 'Next';
            $(".App-body").addClass("disabledContent");
            this.ShowNotification("You have unsaved changes in the current element.", "danger", '')
        }
        else {
            let next = true;
            const { activeStep } = this.state;
            if (activeStep === 0) {
                this.state.draftid ? this.updateSurvey("draft", "auto", true) : this.addSurvey("draft", "auto", true);
                this.OtherLanguagegenerate()
            } else {
                if (activeStep === 1) {
                    next = this.CheckScale();
                    if (next) {
                        this.editlanguage(true);
                        this.OtherLancongenerate();
                    }
                }
                if (next) {
                    this.setState({
                        activeStep: activeStep + 1,
                        lopen: false,
                        ropen: false
                    }, () => this.handleOnClick2('darft', 'auto', false))
                }
            }
        }
    };

    /**
     * Handle next button of condition page.
     */
    handleNext2 = (dname) => {
        if (localStorage.getItem('updateProperties')) {
            $(".App-body").addClass("disabledContent");
            this.ShowNotification("You have unsaved changes in the current element.", "danger", '')
        }
        else {
            const { conditions, drops } = this.state;
            let validatecheck = []
            if (conditions.length > 0) {

                let lastcondition = conditions[conditions.length - 1]


                for (var j = 0; j < lastcondition.source.length; j++) {
                    if (lastcondition.source[j].handler === "" || lastcondition.source[j].state === "" || lastcondition.target.do === "" || lastcondition.target.handler === "") {
                        if (lastcondition.target.do === "loop_set" && lastcondition.target.multifield && lastcondition.target.multifield.length > 0) {
                            let matchques = []
                            drops.forEach((field, index) => {
                                lastcondition.target.multifield.forEach((c, cindex) => {
                                    if (c.value === field.handler) {
                                        matchques.push(index)
                                    }
                                })
                            });
                            lastcondition.source[j].handler = drops[matchques[matchques.length - 1]].handler

                            // }
                        } else {
                            validatecheck.push(validatecheck.length);
                        }
                    }
                    else if (lastcondition.source[j].state !== "empty" && lastcondition.source[j].state !== "filled" && lastcondition.source[j].state !== "loop_input") {

                        if (lastcondition.source[j].target === "") {
                            validatecheck.push(validatecheck.length)
                        }
                        if (lastcondition.source[j].target === "value" && lastcondition.source[j].match_option === "") {
                            validatecheck.push(validatecheck.length)
                        }
                        if (lastcondition.source[j].target === "value" && (lastcondition.source[j].match_value === "" || (!lastcondition.source[j].match_value))) {
                            validatecheck.push(validatecheck.length)
                        }
                        if (lastcondition.source[j].target === "field" && (lastcondition.source[j].matchid === "" || (!lastcondition.source[j].matchid))) {
                            validatecheck.push(validatecheck.length)
                        }
                    }
                }

                let targetmultifieldcheck = conditions.filter((condition) => {
                    if (condition.target.do === 'hide_multiple' || condition.target.do === 'show_multiple') {
                        return condition.target.multifield === undefined || (condition.target.multifield && condition.target.multifield.length <= 0)
                    }
                })
                if (targetmultifieldcheck && targetmultifieldcheck.length >= 1) {
                    validatecheck.push(validatecheck.length)
                }
            }


            if (validatecheck.length > 0) {
                this.setState({
                    validate: 1

                });
                return false
            } else {
                drops.map((drop, i) => (drop.conditions = []));
                let selectedlanguage = this.state.selectedlanguage;
                let languages_drop = this.state.languages_drop;
                selectedlanguage.forEach((a, b) => {
                    if (a.label !== 'English') {
                        languages_drop[a.label].content.map((x, y) => (x.conditions = []))
                    }
                })
                conditions.forEach((condtion, index) => {
                    drops.map((drop, i) => (
                        condtion.source[0] && condtion.source[0].handler && drop.handler && condtion.source[0].handler === drop.handler
                            ? drop.conditions.push(condtion)
                            : false
                    ))

                    selectedlanguage.forEach((a, b) => {
                        if (a.label !== 'English') {
                            languages_drop[a.label].content.map((x, y) => (
                                condtion.source[0] && condtion.source[0].handler && x.handler && condtion.source[0].handler === x.handler
                                    ? x.conditions.push(condtion)
                                    : false
                            ))
                        }
                    })
                })
                this.state.id ? this.updatecall(dname, 'update') : this.updatecall(dname, 'add');
                // this.state.id ? this.editlanguage() : this.editlanguage()

            }
        }
    };

    /* Manage the update call for all languages. */
    updatecall(dname, check) {
        if (this.state.concurrentlanguage.value === "English") {
            this.setState({ defaultdrops: this.state.drops, defaultconditions: this.state.conditions })
        }
        else {
            let languages_drop = this.state.languages_drop
            languages_drop[this.state.concurrentlanguage.value].conditions = cloneDeep(this.state.conditions)
            this.setState({ languages_drop: languages_drop })
        }
        this.setState({ conditions: this.state.defaultconditions, drops: this.state.defaultdrops })
        if (check === "update") {
            this.updateSurvey(dname)
        } else {
            this.addSurvey(dname)
        }

        this.editlanguageupdate(true)
    }

    /**
     * Handle the event of back button.
     *
     */


    handleBack = () => {
        if (localStorage.getItem('updateProperties')) {
            handleClick = 'Back';
            $(".App-body").addClass("disabledContent");
            this.ShowNotification("You have unsaved changes in the current element.", "danger", '')
        }
        else {
            const { activeStep } = this.state;
            if (activeStep === 0) {
                this.setState({ redirect: true });
            } else {
                this.setState({
                    activeStep: activeStep - 1
                });
            }
        }
    };

    handleBackProps = () => {
        this.setState({ br: false });
        $('div').removeClass('disabledContent');
        handleClick = '';
        this.autoSave()
        localStorage.removeItem('updateProperties');

        const { activeStep } = this.state;
        if (activeStep === 0) {
            this.setState({ redirect: true });
        } else {
            this.setState({
                activeStep: activeStep - 1
            });
        }
    };

    /**
     * Handle back button on conditions page.
     *
     */
    handleBack2 = () => {
        const { activeStep } = this.state;
        const { conditions, drops } = this.state;

        drops.map((drop, i) => (drop.conditions = []));
        conditions.map((condtion, index) =>
            drops.map(
                (drop, i) => (
                    condtion.source[0] && condtion.source[0].handler && drop.handler && condtion.source[0].handler === drop.handler
                        ? drop.conditions.push(condtion)
                        : false
                )
            )
        );

        if (activeStep === 0) {
            this.setState({
                redirect: true,
                // dropcurrentlanguage: { label: this.state.concurrentlanguage.value, value: this.state.concurrentlanguage.value } 
            })
        } else {
            this.setState({
                // dropcurrentlanguage: { label: this.state.concurrentlanguage.value, value: this.state.concurrentlanguage.value },
                activeStep: activeStep - 1,
                drops
            });
        }
    };

    /**
     * Handle the events to when input value changes.
     * 
     *
     */
    handleInputChange = event => {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (name === "points" || name === "minutes") value = parseInt(value);

        this.setState({
            [name]: value
        });
    };

    /**
     * Handle the events to update the project change.
     *
     */
    handleProjectChange = (name, value) => {
        this.setState({
            [name]: value
        });
    };


    /* Handles the events to set selected value. */

    handleqtypeChange = event => {
        const value = event.target.value;
        this.setState({
            selectedValue: value
        });
    };

    /* Handles the events to manage ref code. */
    handleRefcodeChange = (event, refcode) => {
        this.setState({
            duplicatemissionRefCode: event,
            refcode: refcode,
            refcodedit: true,
        })
        if (event) { this.ShowNotification("Surevey RefCode Already Exists", "danger", 3000) }
    };

    /* Handles the events to validate ref code. */
    ValidateSurveyRefCode = refcode => {
        this.setState({
            duplicatemissionRefCode: refcode
        })
    };

    /**
     * Handles the events to check the survey existance.
     *
     */
    handleOnClick = (dname) => {
        this.handleNext2(dname);
    };


    /**
     * Handles the events to check the survey existance with autosave.
     *
     */
    handleOnClick2 = (dname, dauto, check) => {
        if (this.state.dropcurrentlanguage.value === "English") {
            this.state.draftid ? this.updateSurvey(dname, dauto) : this.addSurvey(dname, dauto);
            if (check) { this.state.draftid ? this.autoupdate('update') : this.autoupdate('add') }
        } else {

            if (check) { this.state.draftid ? this.autoupdate('update') : this.autoupdate('add') }
        }
    };

    /* Handles the events to autosave. */
    autoupdate = () => {
        this.editlanguageupdate(false)
    }


    /* Handles the events to add conditions. */
    addCondtions(event) {

        this.setState({
            conditions: event,
            // languages_drop:languages_drop
        });
    }


    /* Handles the events to add new survey. */
    addSurvey(dname, dauto, check) {
        const mydate = new Date();
        const dd = mydate.getDate();
        const mm = mydate.getMonth() + 1;
        const yyyy = mydate.getFullYear();
        const time = mydate.toTimeString();
        const timer = time.split(" ");
        const PubDate = `${yyyy}-${mm}-${dd} ${timer[0]}`;
        const data = {
            survey_name: this.state.name,
            survey_tags: this.state.tags,
            status: (dname === "draft") ? "draft" : "published",
            question_type: this.state.selectedValue,
            survey_points: this.state.points,
            survey_minutes: this.state.minutes,
            project_id: this.state.project_id,
            mission_id: this.state.mission_id,
            author: localStorage.getItem("username"),
            questions: this.state.drops,
            conditions: this.state.conditions,
            responses: 0,
            published: PubDate,
            platform_type: this.state.platformType && this.state.platformType !== "" ? this.state.platformType : "App Only",
            refcode: this.state.refcode
        };

        const self = this;
        if (dauto !== "auto") {
            this.setState({
                loading: 1
            });
        }
        api2.post("survey", data)
            .then(resp => {
                if (dauto === "auto") {
                    if (check !== undefined && check === true) {
                        if (resp.message && resp.message === "Request failed with status code 409") {
                            this.ShowNotification(
                                "Survey Name already exists",
                                "danger", 3000
                            );
                        } else if (resp.message && resp.message.startsWith("Request failed with status code")) {
                            this.ShowNotification(
                                "Request Failure",
                                "danger", 3000
                            );
                        } else {
                            const FormattedPubDate = `Auto Saved at ${dd}/${mm}/${yyyy} ${timer[0]}`;
                            self.setState({
                                draftid: resp.data.survey_id,
                                id: resp.data.survey_id,
                                updatedate: FormattedPubDate,
                                activeStep: this.state.activeStep + 1,
                                lopen: false,
                                ropen: false
                            }, () => {
                                this.handleselectedlanguage("add", this.state.selectedlanguage);
                            });
                        }
                    } else {
                        const FormattedPubDate = `Auto Saved at ${dd}/${mm}/${yyyy} ${timer[0]}`;
                        self.setState({
                            draftid: resp.data.survey_id,
                            id: resp.data.survey_id,
                            updatedate: FormattedPubDate,
                        }, () => {
                            this.handleselectedlanguage("add", this.state.selectedlanguage);
                        });
                    }
                } else {
                    self.setState({
                        redirect: this.state.con ? false : true,
                        draftid: resp.data.survey_id
                    });
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    this.ShowNotification(
                        error.response.data.message,
                        "danger", 3000
                    );
                } else if (error.response && error.response.data && error.response.data.error) {
                    this.ShowNotification(
                        error.response.data.error,
                        "danger", 3000
                    );
                } else {
                    this.ShowNotification(
                        "Server Error",
                        "danger", 3000
                    );
                }
            });
    }


    /* Handles the events to update the survey. */
    updateSurvey(dname, dauto, check) {
        if (this.state.refcodedit) { this.saverefcode(this.state.refcode) }
        // this.savedropsrefcode(this.state.drops)
        const mydate = new Date();
        const dd = mydate.getDate();
        const mm = mydate.getMonth() + 1;
        const yyyy = mydate.getFullYear();
        const time = mydate.toTimeString();
        const timer = time.split(" ");
        const PubDate = `${yyyy}-${mm}-${dd} ${timer[0]}`;
        // this.state.defaultdrops.map((question)=>{
        //     if(question.properties.question===""){
        //         question.properties.question==="Type a question";
        //         question.properties.question_text==="<p>Type a question</p>"
        //     }
        // })
        const data = {
            id: this.state.id,
            survey_name: this.state.name,
            survey_tags: this.state.tags,
            status: (dname === "draft") ? "draft" : "published",
            question_type: this.state.selectedValue,
            survey_points: this.state.points,
            survey_minutes: this.state.minutes,
            project_id: this.state.project_id,
            mission_id: this.state.mission_id,
            author: localStorage.getItem("username"),
            // questions: this.state.drops,
            questions: this.state.defaultdrops,
            conditions: this.state.conditions,
            responses: 0,
            published: PubDate,
            platform_type: this.state.platformType && this.state.platformType !== "" ? this.state.platformType : "App Only",
            refcode: this.state.refcode,
            positionChanged: this.state.positionChanged === true ? 1 : 0
        };
        if (this.state.dropcurrentlanguage.value !== "English") {
            data.questions = this.state.defaultdrops
            data.conditions = this.state.defaultconditions
        }
        const self = this;
        api2.patch("survey", data)
            .then(resp => {
                if (dauto === "auto") {
                    if (check !== undefined && check === true) {
                        if (resp.data && resp.data.error && resp.data.error !== "") {
                            this.ShowNotification(
                                resp.data.error,
                                "danger", 3000
                            );
                        } else {
                            const FormattedPubDate = `Auto Saved at ${dd}/${mm}/${yyyy} ${timer[0]}`;
                            self.setState({
                                updatedate: FormattedPubDate,
                                activeStep: this.state.activeStep + 1,
                                lopen: false,
                                ropen: false
                            });
                            return false
                        }
                    }
                    else {
                        const FormattedPubDate = `Auto Saved at ${dd}/${mm}/${yyyy} ${timer[0]}`;
                        self.setState({
                            updatedate: FormattedPubDate
                            //positionChanged: false
                        });
                        return false
                    }
                } else {
                    self.setState({
                        redirect: this.state.con ? false : true,
                        draftid: resp.data.survey_id
                    });
                }
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    this.ShowNotification(
                        error.response.data.message,
                        "danger", 3000
                    );
                } else if (error.response && error.response.data && error.response.data.error) {
                    this.ShowNotification(
                        error.response.data.error,
                        "danger", 3000
                    );
                } else {
                    this.ShowNotification(
                        "Server Error",
                        "danger", 3000
                    );
                }

            });

    }

    /* Handles the events to update the properties. */
    autoSave = () => {
        this.handleOnClick2("draft", "auto", true)
    }

    render() {
        const validater = this.state.activeStep === 0 ? (this.state.name === "" || this.state.duplicatemissionRefCode) : this.state.drops.length === 0;

        const platformType = this.state.platformType;

        if (this.state.redirect) {
            return <Redirect push to="/home/surveys" />;
        }

        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep, id } = this.state;
        const previewname = this.state.name;
        const qtype = this.state.selectedValue;
        const prevtags = this.state.tags;
        const points = this.state.points;
        const previewdrops = this.state.drops;
        const previewconditions = this.state.conditions;
        const validate = this.state.validate
        const minutes = this.state.minutes
        const isAssigned = this.state.isAssigned
        let refcode = this.state.refcode
        let oldrefcode = this.state.oldrefcode;
        let languagelist = this.state.languagelist;
        let selectedlanguage = this.state.selectedlanguage;
        let dropcurrentlanguage = this.state.dropcurrentlanguage;
        let defaultdrops = this.state.defaultdrops;
        let languages_drop = this.state.languages_drop;
        let concurrentlanguage = this.state.concurrentlanguage

        /**
         * gets the step contents to perform next and previous actions.
         *
         * @public
         * @param {Number} [stepIndex]
         * @param {string} [handleInputChange]
         * @param {string} [handlePlatformType]
         * @param {string} [handleqtypeChange]
         * @param {string} [dropChange]
         * @param {string} [elemetsbar]
         * @param {string} [settingsbar]
         * 
         */
        function getStepContent(
            stepIndex,
            handleInputChange,
            handleProjectChange,
            handlePlatformType,
            handleqtypeChange,
            dropChange,
            deleteDrops,
            setDropsLang,
            autoSave,
            elemetsbar,
            settingsbar,
            addCondtions,
            handleRefcodeChange,
            handleselectedlanguage,
            changedroplanguage,
            updatelanguagedrop,
            updatelanguageproperties,
            downArrowFuncLanguage,
            upArrowFuncLanguage,
            updateconlanguage,
            handledeletelanguage
        ) {
            switch (stepIndex) {
                case 0:
                    return (
                        <SurveyInfo
                            name="1"
                            handleInputChange={handleInputChange}
                            handleqtypeChange={handleqtypeChange}
                            handleprojects={handleProjectChange}
                            handlePlatformType={handlePlatformType}
                            surveyname={previewname}
                            qtype={qtype}
                            prevtags={prevtags}
                            points={points}
                            minutes={minutes}
                            platformType={platformType}
                            isAssigned={isAssigned}
                            refcode={refcode}
                            handleRefcodeChange={handleRefcodeChange}
                            oldrefcode={oldrefcode}
                            languagelist={languagelist}
                            handleselectedlanguage={handleselectedlanguage}
                            selectedlanguage={selectedlanguage}
                            handledeletelanguage={handledeletelanguage}
                        />
                    );
                case 1:
                    return (
                        <SurveyBuilder
                            name="2"
                            dropChange={dropChange}
                            deletedrops={deleteDrops}
                            setDropsLang={setDropsLang}
                            olddrops={previewdrops}
                            lchange={elemetsbar}
                            rchange={settingsbar}
                            id={id}
                            oldconditions={previewconditions}
                            autosave={autoSave}
                            platformType={platformType}
                            refcode={refcode}
                            selectedlanguage={selectedlanguage}
                            changedroplanguage={changedroplanguage}
                            dropcurrentlanguage={dropcurrentlanguage}
                            defaultdrops={defaultdrops}
                            updatelanguagedrop={updatelanguagedrop}
                            updatelanguageproperties={updatelanguageproperties}
                            languages_drop={languages_drop}
                            downArrowFuncLanguage={downArrowFuncLanguage}
                            upArrowFuncLanguage={upArrowFuncLanguage}
                        />
                    );
                case 2:
                    return <Settings
                        drops={previewdrops}
                        getCondtions={addCondtions}
                        oldconditions={previewconditions}
                        autosave={autoSave}
                        selectedlanguage={selectedlanguage}
                        updateconlanguage={updateconlanguage}
                        concurrentlanguage={concurrentlanguage}
                        languages_drop={languages_drop}
                    />
                default:
                    return "Preview Page";
            }
        }

        const body_class = this.props.fullWidth ? "body-form body-form-expanded" : "body-form body-form-collapsed";

        const { lopen, ropen } = this.state;
        const lefttoggle = lopen ? " leftopen" : " leftclose";
        const righttoggle = ropen ? " rightopen" : " rightclose";
        const fullwidth = this.state.activeStep !== 1 ? " fullwidth" : " shrink";
        const update = this.state.id ? "Update" : "Finish";
        const { msgColor, br, message, load, con } = this.state;



        return (
            <MuiThemeProvider theme={theme}>
                <div className={`builderwrap ${body_class}`}>
                    <Card style={{ height: "100%" }} className={`additionalclassaddmulticard ${classes.card}${lefttoggle}${righttoggle}${fullwidth}`}>
                        <CardContent className="buildercont">
                            <div className={`relativeposition ${classes.root}`} style={{ alignContent: "center" }}>
                                {activeStep !== 0 ? (
                                    <div style={{ position: "relative" }}>
                                        <div className="stepersurveyname"
                                            style={{
                                                textAlign: "center",
                                                fontSize: "18px",
                                                fontWeight: "bold",
                                                marginTop: "10px"
                                            }}
                                        >{previewname}</div>
                                        <div
                                            style={{
                                                textAlign: "center",
                                                fontSize: "14px",
                                                color: "green",
                                                fontWeight: "800"
                                            }}
                                        >
                                            {this.state.updatedate !== "" &&
                                                this.state.updatedate
                                            }
                                        </div>
                                    </div>
                                )
                                    : ("")
                                }
                                <Stepper activeStep={activeStep} alternativeLabel style={{ width: "100%" }}>
                                    {steps.map(label => (
                                        <Step key={label}>
                                            <StepLabel
                                                StepIconProps={{
                                                    classes: { root: classes.stepIcon }
                                                }}>
                                                {label}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                <div>
                                    {this.state.activeStep === steps.length ? (
                                        <div>
                                            <Typography className={classes.instructions}>All steps completed</Typography>
                                            <Button onClick={this.handleReset}>Reset</Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className={classes.instructions}>
                                                {getStepContent(
                                                    activeStep,
                                                    this.handleInputChange,
                                                    this.handleProjectChange,
                                                    this.handlePlatformType,
                                                    this.handleqtypeChange,
                                                    this.dropChange,
                                                    this.deleteDrops,
                                                    this.setDropsLang,
                                                    this.autoSave,
                                                    this.elementsbar,
                                                    this.settingsbar,
                                                    this.addCondtions,
                                                    this.handleRefcodeChange,
                                                    this.handleselectedlanguage,
                                                    this.changedroplanguage,
                                                    this.updatelanguagedrop,
                                                    this.updatelanguageproperties,
                                                    this.downArrowFuncLanguage,
                                                    this.upArrowFuncLanguage,
                                                    this.updateconlanguage,
                                                    this.handledeletelanguage
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        { /*this.state.updatedate ? <div className="autosave">Auto Draft On : {this.state.updatedate}</div> :"" */}
                        <CardActions
                            style={{
                                bottom: 0,
                                backgroundColor: "#f1f1f1",
                                height: "10%",
                                position: "sticky"
                            }}>
                            <div style={{ width: "100%" }}>
                                <Button
                                    disabled={con}
                                    style={{ float: "left", left: 0 }}
                                    onClick={activeStep === 2 ? this.handleBack2 : this.handleBack}
                                    className={classes.backButton} variant="contained"
                                    color="primary">
                                    Back
                                </Button>
                                {(validate === 1) ? <div className="bottom-errormessageshow"><i className="fa fa-exclamation-triangle" aria-hidden="true"></i> Kindly Fill or Delete the incomplete conditions</div> : ""}
                                {/*(activeStep > 0) ?
                        <Button
                            name="draft"
							variant="contained"
							color="primary"
                            onClick={
                                () => this.handleOnClick("draft")
                            }>
                            Save as Draft
                        </Button>
                         :"" */}
                                <Button
                                    style={{ float: "right", right: 0 }}
                                    variant="contained"
                                    color="primary"
                                    disabled={load ? load : validater}
                                    onClick={
                                        // activeStep === 0 ? this.OtherLanguagegenerate :
                                        // activeStep === 1 ? this.OtherLancongenerate :
                                        activeStep === steps.length - 1 ? this.handleOnClick : activeStep === 2 ? this.handleNext2 : this.handleNext
                                    }>
                                    {activeStep === steps.length - 1 ? update : "Next"}
                                </Button>
                            </div>
                        </CardActions>
                    </Card>
                    <Snackbar
                        place={ropen ? "bc" : "br"}
                        color={msgColor}
                        open={br}
                        message={message}
                        update={localStorage.getItem('updateProperties') ? true : ''}
                        back={handleClick === "Back" ? this.handleBackProps : this.handleNextProps}
                        closeNotification={() => { handleClick = ''; this.setState({ br: false }); $('div').removeClass('disabledContent') }}
                        close
                    />
                    {/* <Snackbar
                        place="br"
                        color={msgColor}
                        open={con}
                        message={message}
                        closeNotification={() => this.setState({ br: false, redirect: true })}
                        close
                    /> */}
                </div>
            </MuiThemeProvider>
        );
    }
}

CreateSurvey.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(CreateSurvey);