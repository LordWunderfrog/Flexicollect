/* 
* Translation Component.
*
* This component is used to create / update / delete / publish mobile app language.
*
*/
import React from "react";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createMuiTheme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Modal from "@material-ui/core/Modal";
/* Type and select. */
import Select from "react-select";

import { AgGridReact } from "ag-grid-react";

import * as Constants from "../../helpers/constants.jsx";
import * as TranslationKey from "../../helpers/TranslationConstants.jsx";
import api2 from "../../helpers/api2";
import Snackbar from "components/Snackbar/Snackbar.jsx";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

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

const styles = {
    loadingDiv: {
        width: "100%",
        height: 'calc(100% - 60px)',
        justifyContent: "center"
    },
    paper: {
        position: "absolute",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: "none"
    }
}


class Translation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // snackbar props
            msgColor: "info",
            message: "",
            br: false,
            response: false,
            Languages: [],
            listItems: [],
            columnDefs: [],
            LanguageDetails: [],
            selectedLanguage: { label: 'English', value: 1 },
            AddLanguage: false,
            NewLanguage: "",
            PublishLanguagePopup: false,
            DeleteLanguagePopup: false,
            CellValueChanged: false,
            LanguageSavePopup: false,
            TempselectedLanguage: { label: '', value: '' }
        }
    }
    componentDidMount() {
        this.getTranslationsLanguage();
        this.getLanguageDetails(this.state.selectedLanguage.value, "Default");
    }
    /* By default it will fetch details in english.Then based on the user language selection it fill fetch the details from api.*/
    getLanguageDetails(id, language, SaveAndPublish) {
        let selectedLanguage = language === "Default" ? "English" : null;
        api2
            .get(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE + '?id=' + id)
            .then(resp => {
                if (selectedLanguage !== null) {
                    this.setState({
                        LanguageDetails: resp.data.data[0],
                        selectedLanguage: { label: 'English', value: 1 },
                        NewLanguage: ""
                    }, () => {
                        if (SaveAndPublish === 'SaveAndPublish') {
                            this.Tablehead();
                            this.PublishLanguage();
                            // this.stopLoading();
                        } else {
                            this.Tablehead();
                            this.stopLoading();
                        }

                    })
                } else {
                    this.setState({
                        LanguageDetails: resp.data.data[0],
                        NewLanguage: ""
                    }, () => {
                        if (SaveAndPublish === 'SaveAndPublish') {
                            this.Tablehead();
                            this.PublishLanguage();
                            // this.stopLoading();
                        } else {
                            this.Tablehead();
                            this.stopLoading();
                        }

                    })
                }
            })
            .catch(error => {
                this.ShowNotification("Somthing Went Wrong", "danger");
                this.stopLoading();

            });
    }

    /* Handles the api to fetch the list of translation language. */
    getTranslationsLanguage(language) {
        this.openLoading()
        let selectLanguage = language !== undefined ? language : ""
        api2
            .get(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE)
            .then(resp => {
                let Language = [];
                let selectedLanguage = null;
                resp.data.data.map(lan => {
                    Language.push({
                        label: lan.name,
                        value: lan.id
                    })
                    if (selectLanguage === lan.name) {
                        selectedLanguage = {
                            label: lan.name,
                            value: lan.id
                        }
                    }
                })
                if (selectedLanguage !== null) {
                    this.setState({
                        Languages: Language,
                        selectedLanguage: selectedLanguage,
                        LanguageDetails: [],
                        NewLanguage: ""
                    }, () => { this.getLanguageDetails(selectedLanguage.value, selectedLanguage.label) })
                } else {
                    this.setState({
                        Languages: Language,
                        selectedLanguage: { label: 'English', value: 1 },
                        LanguageDetails: [],
                        NewLanguage: ""
                    }, () => { this.getLanguageDetails(1, "Default") })
                }
            })
            .catch(error => {
                this.ShowNotification("Somthing Went Wrong", "danger");
                this.stopLoading();

            });
    }

    /* Handles the open event of loading symbol. */
    openLoading = () => {
        this.setState({
            response: false,
            AddLanguage: false,
            PublishLanguagePopup: false,
            DeleteLanguagePopup: false
        });
    };

    /* Handles the close event of loading symbol. */
    stopLoading = () => {
        this.setState({
            response: true,
            NewLanguage: "",
            AddLanguage: false,
            PublishLanguagePopup: false,
            DeleteLanguagePopup: false
        });
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

    /* Handles the open event of popup to add new language. */
    AddLanguage() {
        this.setState({
            AddLanguage: true,
        })

    }

    /* Handles the api to manage deletion of language from the list of translation language. */
    DeleteLanguage() {
        this.openLoading()
        let id = this.state.selectedLanguage.value;
        let label = this.state.selectedLanguage.label;
        api2
            .delete(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE + "?id=" + id)
            .then(resp => {
                if (resp.status === 200) {
                    this.getTranslationsLanguage();
                    this.ShowNotification(label + " Language Deleted Successfully", "success");
                } else {
                    this.stopLoading();
                    this.ShowNotification(resp.message, "danger");
                }
            })
            .catch(error => {
                this.ShowNotification("Somthing Went Wrong", "danger");
                this.stopLoading();

            });
    }

    /* Validate the  user entered language is empty or not and if its not empty it will match with language code.
    * Then it will pass the language code and name to the api.
    * Handles the api to manage addition of language into the list of translation language. */
    AddNewLanguage() {
        let Language = this.state.NewLanguage;
        let Language_Code = "";
        let selectedLanguage = "";
        let DuplicateLanguage = false;
        if (Language !== "") {
            let LanguageList = this.state.Languages;
            LanguageList.map(L => {
                let Listlanguage = L.label;
                let EnterLanguage = Language;
                Listlanguage = Listlanguage.toLowerCase();
                EnterLanguage = EnterLanguage.toLowerCase();
                if (Listlanguage === EnterLanguage) {
                    DuplicateLanguage = true;
                }
            })
            if (!DuplicateLanguage) {
                Language = Language.toLowerCase()
                TranslationKey.Language_support.map((lan, index) => {
                    let Language_List = lan.label.toLowerCase();
                    if (Language_List === Language) {
                        Language_Code = lan.value;
                        selectedLanguage = lan.label;
                    }
                })
                if (Language_Code !== "") {
                    this.openLoading();
                    let Language_Details = {
                        "language": selectedLanguage,
                        "code": Language_Code,
                        "content": {}
                    };
                    api2
                        .post(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE, Language_Details)
                        .then(resp => {
                            if (resp.status === 200) {
                                this.getTranslationsLanguage(selectedLanguage)
                                this.ShowNotification(selectedLanguage + " Language Added Successfully", "success");
                            } else {
                                this.stopLoading();
                                this.ShowNotification(resp.message, "danger");
                            }
                        })
                        .catch(error => {
                            this.ShowNotification("Somthing Went Wrong", "danger");
                            this.stopLoading();


                        });
                } else {
                    this.ShowNotification(
                        "Unsupported Language",
                        "danger"
                    );
                }
            } else {
                this.ShowNotification(Language + " Already Exists", "danger");
            }
        } else {
            this.ShowNotification("Field cannot be empty", "danger");

        }
    }

    /* Form the data in default structure.
    * Handles the api to save and publish the data in server. */
    SaveAndPublish() {
        this.api.tabToNextCell();
        this.openLoading()
        let rowData = [];
        this.api.forEachNodeAfterFilter(node => rowData.push(node.data));
        let selectedLanguage = this.state.selectedLanguage;
        let defaultpage = TranslationKey.defaulpage;
        let content = {};
        let data = {
            "language": selectedLanguage.label,
            "id": selectedLanguage.value,
            "code": this.state.LanguageDetails.code,
            "content": content
        };
        defaultpage.map((o, p) => {
            let page = o.value;
            content[page] = this.FormData(page, rowData, selectedLanguage.label)
        })
        api2
            .patch(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE, data)
            .then(resp => {
                if (resp.status === 200) {
                    this.setState({
                        CellValueChanged: false,
                    }, () => {
                        this.getLanguageDetails(selectedLanguage.value, selectedLanguage.label, 'SaveAndPublish');
                    })
                    // this.PublishLanguage();
                    // this.ShowNotification(selectedLanguage.label + " Language Updated Successfully", "success");

                } else {
                    this.stopLoading();
                    this.ShowNotification(resp.message, "danger");
                }
            })
            .catch(error => {
                this.ShowNotification("Somthing Went Wrong", "danger");
                this.stopLoading()


            });
    }

    /* Form the data in default structure.
    * Handles the api to save the data in server. */
    SaveLanguageDetails() {
        this.api.tabToNextCell();
        this.openLoading()
        let rowData = [];
        this.api.forEachNodeAfterFilter(node => rowData.push(node.data));
        let selectedLanguage = this.state.selectedLanguage;
        let defaultpage = TranslationKey.defaulpage;
        let content = {};
        let data = {
            "language": selectedLanguage.label,
            "id": selectedLanguage.value,
            "code": this.state.LanguageDetails.code,
            "content": content
        };
        defaultpage.map((o, p) => {
            let page = o.value;
            content[page] = this.FormData(page, rowData, selectedLanguage.label)
        })
        api2
            .patch(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE, data)
            .then(resp => {
                if (resp.status === 200) {
                    this.setState({
                        CellValueChanged: false,
                    }, () => {
                        this.getLanguageDetails(selectedLanguage.value, selectedLanguage.label)
                        this.ShowNotification(selectedLanguage.label + " Language Updated Successfully", "success");
                    })
                } else {
                    this.stopLoading();
                    this.ShowNotification(resp.message, "danger");
                }
            })
            .catch(error => {
                this.ShowNotification("Somthing Went Wrong", "danger");
                this.stopLoading()


            });
    }

    /* Handles this function to form the data in default structure. */
    FormData(page, data, language) {
        let arr = {};
        let Gender_List = [];
        let array = false;
        data.map(d => {
            if (d.defaultpage === page) {
                if (d.array === false) {
                    arr[d.defaultkey] = d[language]
                }
                else {
                    array = true;
                    if (Gender_List.length < 3) { Gender_List.push({ label: d[language], value: d.defaultkey }) }
                }
            }
        })
        if (array) {
            arr["Gender_List"] = Gender_List
        }
        return arr
    }

    /* Validate the field is empty or not. If its empty user will receive a notification.
    * All the fields are mandatory.
    * If it satisfies the above condition,by using language id it will publish this language using api. */
    PublishLanguage() {
        this.openLoading();
        let rowData = [];
        let selectedLanguage = this.state.selectedLanguage;
        let Publish = true;
        let skip_values = TranslationKey.skip_validation;
        this.api.forEachNodeAfterFilter(node => rowData.push(node.data));
        for (let i = 0; i < rowData.length; i++) {
            let value = rowData[i][selectedLanguage.label];
            value = value.trim();
            if (!skip_values.includes(rowData[i].defaultkey) && value.length === 0) {
                Publish = false;
                break;
            }
        }
        if (Publish) {
            api2
                .patch(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE + "/publish?id=" + selectedLanguage.value)
                .then(resp => {
                    if (resp.status === 200) {
                        this.getLanguageDetails(selectedLanguage.value, selectedLanguage.label);
                        this.ShowNotification(selectedLanguage.label + " Language Published Successfully", "success");
                    } else {
                        this.stopLoading();
                        this.ShowNotification(resp.message, "danger");
                    }
                })
                .catch(error => {
                    this.ShowNotification("Somthing Went Wrong", "danger");
                    this.stopLoading();
                });
        } else {
            this.stopLoading();
            this.ShowNotification("Values cannot be empty. All Fields Are Mandatory to Publish.", "warning");
        }
    }

    /* Formation of column definition in aggrid table */
    Tablehead() {
        let columnDefs =
            [
                {
                    headerName: "Functionality",
                    field: "functionality",
                    defaultpage: "defaultpage",
                    defaultkey: "defaultkey",
                    array: "array",
                    width: 300
                },
                {
                    headerName: "Lables",
                    field: "lables",
                    defaultpage: "defaultpage",
                    defaultkey: "defaultkey",
                    array: "array",
                    width: 300
                },
                {
                    headerName: this.state.selectedLanguage.label,
                    field: this.state.selectedLanguage.label,
                    width: 300,
                    defaultpage: "defaultpage",
                    defaultkey: "defaultkey",
                    array: "array",
                    editable: true,
                }
            ]

        this.setState({
            columnDefs: columnDefs,
        }, () => { this.Answerdata() });
    }

    /*  To form the answer data match the default structure of data with selected language content.*/
    Answerdata() {
        let answer = [];
        let defaultkey = TranslationKey.defaultkey;
        let defaultpage = TranslationKey.defaulpage;
        let selectedLanguage = this.state.selectedLanguage.label;
        let languageContent = this.state.LanguageDetails.content;

        if (Object.keys(languageContent).length > 0) {

            defaultpage.map((o, p) => {

                defaultkey[o.label].map((x, y) => {
                    if (x["Gender_List"] && x["Gender_List"].length && x["Gender_List"].length > 0) {
                        if (languageContent[o.value]["Gender_List"] && languageContent[o.value]["Gender_List"].length && languageContent[o.value]["Gender_List"].length > 0) {
                            languageContent[o.value]["Gender_List"].map((g, indx) => {
                                answer.push({
                                    functionality: o.label,
                                    lables: x["Gender_List"][indx].label,
                                    [selectedLanguage]: g.label,
                                    defaultpage: o.value,
                                    defaultkey: x["Gender_List"][indx].value,
                                    array: true
                                })
                            })
                        }
                    } else {
                        if (languageContent[o.value][x.value] !== undefined && languageContent[o.value][x.value] !== null) {
                            answer.push({
                                functionality: o.label,
                                lables: x.label,
                                [selectedLanguage]: languageContent[o.value][x.value],
                                defaultpage: o.value,
                                defaultkey: x.value,
                                array: false
                            })
                        } else {
                            answer.push({
                                functionality: o.label,
                                lables: x.label,
                                [selectedLanguage]: "",
                                defaultpage: o.value,
                                defaultkey: x.value,
                                array: false
                            })
                        }
                    }


                })
            })
        } else {
            defaultpage.map((o, p) => {

                defaultkey[o.label].map((x, y) => {
                    if (x["Gender_List"] && x["Gender_List"].length && x["Gender_List"].length > 0) {
                        x["Gender_List"].map((g, indx) => {
                            answer.push({
                                functionality: o.label,
                                lables: g.label,
                                [selectedLanguage]: "",
                                defaultpage: o.value,
                                defaultkey: g.value,
                                array: true
                            })
                        })
                    } else {
                        answer.push({
                            functionality: o.label,
                            lables: x.label,
                            [selectedLanguage]: "",
                            defaultpage: o.value,
                            defaultkey: x.value,
                            array: false
                        })

                    }
                })
            })

        }
        let listItems = [];
        answer.forEach(answ => {
            listItems.push(this.Formatansw(answ))
        })
        this.setState({
            listItems: listItems
        })
    }

    /* To form the table data match the column definition with answer data. */
    Formatansw = answ => {
        let arr = {};
        this.state.columnDefs.forEach(ans => {
            arr[ans.field] = answ[ans.field]
            arr[ans.defaultpage] = answ[ans.defaultpage]
            arr[ans.defaultkey] = answ[ans.defaultkey]
            arr[ans.array] = answ[ans.array]
        })
        return arr
    }

    /* Used to listen the grid events and update the table. */
    onGridReady = (params) => {
        this.api = params.api;
        params.api.sizeColumnsToFit();
    }
    /* Handles the function update the state variable. */
    CellValueChanged = (params) => {
        if (!this.state.CellValueChanged) {
            this.setState({
                CellValueChanged: true,
            })
        }
    }

    /* Handles the event update the language selection. */
    handleLanguageChange = e => {
        if (!this.state.CellValueChanged) {
            this.setState({
                selectedLanguage: { label: e.label, value: e.value },
                response: false
            }, () => { this.getLanguageDetails(e.value) })
        } else {
            this.setState({
                LanguageSavePopup: true,
                AddLanguage: true,
                TempselectedLanguage: { label: e.label, value: e.value },
            })
        }
    }

    /* Handles this function to auto update the content when user change the language without save. */
    SaveAndLanguageChange() {
        this.api.tabToNextCell();
        this.openLoading()
        let rowData = [];
        this.api.forEachNodeAfterFilter(node => rowData.push(node.data));
        let selectedLanguage = this.state.selectedLanguage;
        let defaultpage = TranslationKey.defaulpage;
        let content = {};
        let data = {
            "language": selectedLanguage.label,
            "id": selectedLanguage.value,
            "code": this.state.LanguageDetails.code,
            "content": content
        };
        defaultpage.map((o, p) => {
            let page = o.value;
            content[page] = this.FormData(page, rowData, selectedLanguage.label)
        })
        api2
            .patch(Constants.GET_LISTOF_TRANSLATIONS_LANGUAGE, data)
            .then(resp => {
                if (resp.status === 200) {
                    this.setState({
                        selectedLanguage: { label: this.state.TempselectedLanguage.label, value: this.state.TempselectedLanguage.value },
                        response: false,
                        LanguageSavePopup: false,
                        CellValueChanged: false,
                    }, () => { this.getLanguageDetails(this.state.TempselectedLanguage.value) })
                } else {
                    this.stopLoading();
                    this.ShowNotification(resp.message, "danger");
                }
            })
            .catch(error => {
                this.ShowNotification("Somthing Went Wrong", "danger");
                this.stopLoading()


            });
    }

    /* Style for popup layout. */
    getModalStyle() {
        const top = 50;
        const left = 50;

        return {
            top: `${top}%`,
            left: `${left}%`,
            transform: `translate(-${top}%, -${left}%)`,
            minWidth: `350px`,
            borderRadius: `5px`
        };
    }
    render() {
        let body_class = this.props.fullWidth
            ? "body-full body-full-expanded"
            : "body-full body-full-collapsed";
        const { classes } = this.props;
        const {
            msgColor,
            br,
            message,
            response,
            selectedLanguage,
            LanguageDetails,
            Languages,
            AddLanguage,
            NewLanguage,
            PublishLanguagePopup,
            DeleteLanguagePopup,
            CellValueChanged,
            LanguageSavePopup
        } = this.state
        let PublishedTime = "";
        if (LanguageDetails.published_on !== undefined && LanguageDetails.published_on !== null) {
            PublishedTime = new Date(LanguageDetails.published_on);
            PublishedTime = PublishedTime.toLocaleString();
        }
        return (
            <div className={body_class}>
                <div style={{ height: '100%', width: '100%', paddingRight: '25px', paddingLeft: '10px' }}>
                    <div style={{ height: '60px', width: '100%', flexDirection: 'row', display: 'flex' }}>
                        <div style={{ width: "30%", marginTop: '5px', alignSelf: 'center', fontSize: "16px", marginLeft: "10px", fontWeight: 600 }}>
                            {LanguageDetails.published_on !== undefined && LanguageDetails.published_on !== null && <label>Last Published Time : {PublishedTime}</label>}
                        </div>
                        <div style={{ width: "70%", flexDirection: 'row', display: 'flex', marginRight: "10px", justifyContent: "flex-end" }}>
                            <div style={{ marginTop: '5px', marginRight: "5px", minWidth: "170px" }}>
                                <Button
                                    variant="contained"
                                    disabled={!response}
                                    style={{
                                        color: !response ? "rgba(0, 0, 0, 0.26)" : "#fff",
                                        backgroundColor: !response ? "rgba(0, 0, 0, 0.26)" : "#074e9e",
                                        margin: "10px 0 0px 10px",
                                        padding: "5px 16px",
                                        fontSize: "12px"
                                    }}
                                    onClick={() => { this.AddLanguage(); }}
                                >
                                    Add New Language
                                </Button>
                            </div>
                            <div style={{ marginTop: '5px', marginRight: "5px" }}>
                                <Button
                                    variant="contained"
                                    disabled={LanguageDetails.is_published === 1 || !response}
                                    // disabled={true}
                                    style={{
                                        color: LanguageDetails.is_published === 1 ? "rgba(0, 0, 0, 0.26)" : !response ? "rgba(0, 0, 0, 0.26)" : "#fff",
                                        backgroundColor: LanguageDetails.is_published === 1 ? "rgba(0, 0, 0, 0.26)" : !response ? "rgba(0, 0, 0, 0.26)" : "#074e9e",
                                        margin: "10px 0 0px 10px",
                                        padding: "5px 16px",
                                        fontSize: "12px"

                                    }}
                                    onClick={() => { this.setState({ DeleteLanguagePopup: true, AddLanguage: true, PublishLanguagePopup: false }) }}
                                >
                                    Delete
                                </Button>
                            </div>
                            <div style={{ marginTop: '5px', marginRight: "5px" }}>
                                <Button
                                    variant="contained"
                                    disabled={!response}
                                    style={{
                                        color: !response ? "rgba(0, 0, 0, 0.26)" : "#fff",
                                        backgroundColor: !response ? "rgba(0, 0, 0, 0.26)" : "#074e9e",
                                        margin: "10px 0 0px 10px",
                                        padding: "5px 16px",
                                        fontSize: "12px"
                                    }}
                                    onClick={() => { this.SaveLanguageDetails() }}
                                >
                                    Save
                                </Button>
                            </div>

                            <div style={{ marginTop: '5px', marginRight: "5px" }}>
                                <Button
                                    variant="contained"
                                    disabled={!response}
                                    style={{
                                        color: !response ? "rgba(0, 0, 0, 0.26)" : "#fff",
                                        backgroundColor: !response ? "rgba(0, 0, 0, 0.26)" : "#074e9e",
                                        margin: "10px 0 0px 10px",
                                        padding: "5px 16px",
                                        fontSize: "12px"
                                    }}

                                    onClick={() => { this.setState({ PublishLanguagePopup: true, DeleteLanguagePopup: false, AddLanguage: true }) }}
                                >
                                    Publish
                                </Button>
                            </div>
                            <div style={{ marginTop: "5px", padding: "5px 16px", width: '200px', minWidth: "100px" }}>
                                <Select style={{ fontSize: "12px" }}
                                    isDisabled={!response}
                                    value={selectedLanguage}
                                    options={Languages}
                                    onChange={this.handleLanguageChange}
                                />
                            </div>
                        </div>

                    </div>
                    {!response ? (
                        <div className={classes.loadingDiv}>
                            <CircularProgress style={{ marginLeft: "50%", marginTop: '25%' }} className={classes.progress} color="primary" />
                        </div>
                    ) : (
                        <div style={{ height: 'calc(100% - 60px)', width: '100%' }}>

                            <div
                                className="ag-theme-balham"
                                style={{
                                    height: "100%",
                                    width: "100%",
                                }}
                            >
                                <AgGridReact
                                    columnDefs={this.state.columnDefs}
                                    rowData={this.state.listItems}
                                    onGridReady={this.onGridReady}
                                    onCellValueChanged={this.CellValueChanged}
                                    suppressMenuHide={true}
                                    defaultColDef={{
                                        sortable: true,
                                        filter: true,
                                        lockPosition: true,
                                        autoHeight: true,
                                        resizable: true,
                                        animateRows: true
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={AddLanguage}
                    onClose={(e) => { this.setState({ AddLanguage: false }) }}
                >


                    <div style={this.getModalStyle()} className={classes.paper}>
                        {CellValueChanged && LanguageSavePopup && (
                            <div
                                style={{ textAlign: "center" }}
                            >


                                <div>
                                    <label
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            textTransform: "initial"
                                        }}
                                    > Do you want to save changes and continue ?</label>
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
                                        onClick={() => {
                                            this.SaveAndLanguageChange()
                                        }}
                                    >
                                        ok
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

                                        onClick={() => { this.setState({ AddLanguage: false, PublishLanguagePopup: false, LanguageSavePopup: false }) }}


                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        {CellValueChanged && PublishLanguagePopup && (
                            <div
                                style={{ textAlign: "center" }}
                            >


                                <div>
                                    <label
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            textTransform: "initial"
                                        }}
                                    > Do you want to save changes and continue to publish {selectedLanguage.label} Language ?</label>
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
                                        onClick={() => {
                                            this.SaveAndPublish()
                                        }}
                                    >
                                        ok
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

                                        onClick={() => { this.setState({ AddLanguage: false, PublishLanguagePopup: false }) }}


                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        {!CellValueChanged && PublishLanguagePopup && (
                            <div
                                style={{ textAlign: "center" }}
                            >


                                <div>
                                    <label
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            textTransform: "initial"
                                        }}
                                    >Are you sure want to publish {selectedLanguage.label} Language</label>
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
                                        onClick={() => {
                                            this.PublishLanguage()
                                        }}
                                    >
                                        ok
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

                                        onClick={() => { this.setState({ AddLanguage: false, PublishLanguagePopup: false }) }}


                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        {DeleteLanguagePopup && (
                            <div
                                style={{ textAlign: "center" }}
                            >


                                <div>
                                    <label
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            textTransform: "initial"
                                        }}
                                    >Are you sure you want to delete this {selectedLanguage.label} Language ?</label>
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
                                        onClick={() => {
                                            this.DeleteLanguage()
                                        }}
                                    >
                                        ok
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

                                        onClick={() => { this.setState({ AddLanguage: false, PublishLanguagePopup: false, DeleteLanguagePopup: false }) }}


                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                        {!PublishLanguagePopup && !DeleteLanguagePopup && !LanguageSavePopup && (
                            <div
                                style={{ textAlign: "center" }}
                            >
                                <div>
                                    <label
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            textTransform: "initial"
                                        }}
                                    >Enter Language Name :</label>
                                </div>

                                <div>
                                    <TextField style={{
                                        display: "flex"
                                    }}
                                        value={NewLanguage}
                                        onChange={(e) => { this.setState({ NewLanguage: e.target.value }) }}
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
                                        onClick={() => {
                                            this.AddNewLanguage()
                                        }}
                                    >
                                        Save
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

                                        onClick={() => { this.setState({ AddLanguage: false, NewLanguage: "" }) }}


                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
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

export default withStyles(styles)(Translation);