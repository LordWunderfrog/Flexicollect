/**
 * Preview  component.
 * 
 * This component is used to preview the final survey page with input values.
 * 
 */
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import sample from "assets/img/sample.jpeg";
import mapicon from "assets/img/mapicon.png";
import barcode from "assets/img/barcode.png";
import camera from "assets/img/camera.png";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
/* Survey Pages */
import "./CreateSurvey.css";
import "react-drop-zone/dist/styles.css";
import api2 from "../../helpers/api2";
import 'react-quill/dist/quill.snow.css'; // ES6

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
    loadingDiv: {
        width: "100%",
        textAlign: "center"
    },
    checked: {}
});


class Previewsurvey extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            tags: "",
            preview: [],
            validate: {},
            staticval: 0,
            markers: [],
            errors: [],
            conditions: []
        };
    }

    componentDidMount() {
        this.getMarkerList();
        let drops = this.props.suveyfield;
        let conditions = this.props.suveyconditions;
        drops.map((element, index) => {
            element.show = 1;
        });

        drops.map((element, index) => {
            conditions.map((condition, subindex) => {
                if (element.handler == condition.target.handler && condition.target.do === "show") {
                    element.show = 1;
                }
            });
        });

        const propert = drops;
        this.setState({
            preview: propert,
            conditions: this.props.suveyconditions
        });
    }

    /**
     * gets the marker lists of the views.
     *
     * @public
     */
    getMarkerList() {
        const url = "http://34.219.255.242/survey_markers";
        var headers = {
            "Content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token")
        };
        api2
            .get("survey_markers")
            .then(resp => {
                this.setState({
                    markers: resp.data
                });
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });
    }

    /**
     * handles the blur action element input.
     *
     * @public
     * @param {event}
     */
    handleBlur(event, element) {
        let val = event.target.value;
        let handler = element.handler;

        let alphabets = /^[a-zA-Z]+$/;
        let numbers = /^[0-9]+$/;
        let alphnumeric = /^[0-9a-zA-Z]+$/;
        let email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let errors = this.state.errors;
        let preview = this.state.preview;
        if (element.properties.content_type === "alphabets") {
            if (!alphabets.test(val)) {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        prev.error = "Enter only Alphabets";
                    }
                });
            } else {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        delete prev.error;
                    }
                });
            }
        } else if (element.properties.content_type === "alphanumeric") {
            if (!alphnumeric.test(val)) {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        prev.error = "Enter only Alphabets and numbers";
                    }
                });
            } else {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        delete prev.error;
                    }
                });
            }
        } else if (element.properties.content_type === "email") {
            if (!email.test(val)) {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        prev.error = "Enter valid email";
                    }
                });
            } else {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        delete prev.error;
                    }
                });
            }
        } else if (element.properties.content_type === "number") {
            if (!numbers.test(val)) {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        prev.error = "Enter only Numbers";
                    }
                });
            } else {
                preview.map((prev, index) => {
                    if (prev.handler === handler) {
                        delete prev.error;
                    }
                });
            }
        }
        if (!event.target.value) {
            preview.map((prev, index) => {
                if (prev.handler === handler) {
                    delete prev.error;
                }
            });
        }
        this.setState({
            preview
        });
    }

    /**
     * handles the validation of input elememts.
     *
     * @public
     * @param {event}
     */
    validate(e) {
        let valid = this.state;
        let name = e.target.name;
        let value = e.target.value;
        valid.validate[`${name}`] = value;
        this.setState({ valid });
    }

    /**
     * sets the state value
     *
     * @public
     */
    prevVal() {
        let newval = this.state.staticval - 1;
        this.setState({
            staticval: newval
        });
    }

    /**
     * sets the state value
     *
     * @public
     */
    nextVal() {
        let newval = this.state.staticval + 1;
        this.setState({
            staticval: newval
        });
    }

    checkConditions = (event, data) => {
        if (data.conditions.length > 0) {
            console.log("yes");
        } else {
            console.log("no");
        }
        console.log(event.target.value);
    };

    render() {
        const { classes } = this.props;
        const previewobj = this.state.preview;
        const checker = this.state.staticval + 1;
        return (
            <div>
                {this.props.loading === 1 ? (
                    <div className={classes.loadingDiv}>
                        <CircularProgress className={classes.progress} color="primary" />
                        <p>Survey is being saved...</p>
                    </div>
                ) : (
                    <div className="prevbox ">
                        <h1>{this.props.surveyname}</h1>
                        {this.props.qtype === "all" ? (
                            <div className="prevfield">
                                {previewobj.map((prevdata, index) => (
                                    <div>
                                        {prevdata.show == 1 ? (
                                            <div className="bbtom bbtom-news">
                                                <label>
                                                    {" "}
                                                    <span className="numbers">{index + 1}</span> {prevdata.properties.question} {prevdata.properties.mandatory ? <span style={{ color: "red" }}>*</span> : false}
                                                </label>
                                                <h6 className="prevheading prevheadingnews">{prevdata.properties.subheading}</h6>
                                                {prevdata.type === "input" ? (
                                                    <div>
                                                        <input type={prevdata.properties.content_type} size={prevdata.properties.length} onBlur={e => this.handleBlur(e, prevdata)} onChange={e => this.checkConditions(e, prevdata)} />
                                                        <span className="error">{prevdata.error}</span>
                                                    </div>
                                                ) : prevdata.type === "capture" ? (
                                                    <div>
                                                        <ul className="markerprev">
                                                            {this.state.markers.map((markerimage, index) => (
                                                                <li key={index}>
                                                                    <img src={markerimage.marker_image} height="100" />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <img src={sample} width="260" />
                                                        <ul className="markerprev scaleprev">
                                                            {prevdata.properties.scale_images.map((scaleimg, index) => (
                                                                <li key={index} style={{ width: `calc(100% / ${prevdata.properties.scale_images.length})` }}>
                                                                    <img src={scaleimg.image} />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ) : prevdata.type === "choice" ? (
                                                    <div>
                                                        <div className="option-checkbox privew-option-checkbox  ">
                                                            <ul className="clear">
                                                                {prevdata.properties.options
                                                                    ? prevdata.properties.options.map(
                                                                        function (value) {
                                                                            return (
                                                                                <li>
                                                                                    {" "}
                                                                                    {prevdata.properties.choice_type === "multiple" ? <input type="checkbox" /> : <input name="choice" type="radio" />} <img src={value.label_image} /> {value.label}
                                                                                    <div className="parent-of-child-class clear">
                                                                                        {value.sublabel
                                                                                            ? value.sublabel.map(
                                                                                                function (subval) {
                                                                                                    return (
                                                                                                        <div>
                                                                                                            {prevdata.properties.choice_type === "multiple" ? <input type="checkbox" /> : <input name="choice" type="radio" />} <img src={subval.label_image} /> {subval.sublabel}
                                                                                                        </div>
                                                                                                    );
                                                                                                }.bind(this)
                                                                                            )
                                                                                            : ""}
                                                                                    </div>
                                                                                </li>
                                                                            );
                                                                        }.bind(this)
                                                                    )
                                                                    : ""}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ) : prevdata.type === "barcode" ? (
                                                    <div>
                                                        <div>
                                                            <img src={barcode} width="100" alt="placeholder" />
                                                        </div>
                                                        {prevdata.properties.barcode_ids ? <p>{prevdata.properties.barcode_ids[0]}</p> : ""}
                                                        {/* <ul className="barcodeli">
                                                                {(prevdata.properties.barcode_ids) ? (
                                                                prevdata.properties.barcode_ids.map(function(value) {
                                                                    return <li> {value} </li>
                                                                }.bind(this))):""}
                                                        </ul> */}
                                                    </div>
                                                ) : prevdata.type === "gps" ? (
                                                    <div>
                                                        {prevdata.properties.gps_stats === "show" ? (
                                                            <div>
                                                                <p>
                                                                    <i className="fa fa-map-marker" /> Provide Map Location
                                                                </p>
                                                                <div>
                                                                    {prevdata.properties.point_type === "map" ? (
                                                                        <img src={mapicon} width="100" alt="placeholder" />
                                                                    ) : prevdata.properties.point_type === "coordinates" ? (
                                                                        <div>
                                                                            <span>
                                                                                <label>Latitude</label>
                                                                                <input type="text" />
                                                                            </span>
                                                                            <span>
                                                                                <label>Longitude</label>
                                                                                <input type="text" />
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                ) : prevdata.type === "info" ? (
                                                    <div>
                                                        <div className="quill editor" style={{ width: "300px" }}>
                                                            <div className="quill-contents ql-container ql-snow">
                                                                <div className="ql-editor">
                                                                    {React.createElement("div", { dangerouslySetInnerHTML: { __html: prevdata.properties.info_text } })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {prevdata.properties.text_position === "top" ? <p className={"font" + prevdata.properties.font_style + " text" + prevdata.properties.text_align}>{prevdata.properties.info_text}</p> : ""}
                                                        <div className="new-div-parts">
                                                            {prevdata.properties.info_type === "image" ? (
                                                                <img src={prevdata.properties.info_image} alt="placeholder" />
                                                            ) : prevdata.properties.info_type === "audio" ? (
                                                                <audio controls>
                                                                    <source src={prevdata.properties.info_audio} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            ) : prevdata.properties.info_type === "video" ? (
                                                                <video width="320" height="240" controls>
                                                                    <source src={prevdata.properties.info_video} type="video/mp4" />
                                                                    Your browser does not support the video tag.
                                                                </video>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                        {prevdata.properties.text_position === "bottom" ? <p className={"font" + prevdata.properties.font_style + " text" + prevdata.properties.text_align}>{prevdata.properties.info_text}</p> : ""}
                                                    </div>
                                                ) : prevdata.type === "upload" ? (
                                                    <div>
                                                        <p> Please Upload {prevdata.properties.media_type}</p>
                                                        <div className="new-img-prev-up">
                                                            <img src={prevdata.properties.upload_icon} />
                                                            <input type="file" disabled="disbaled" />
                                                        </div>
                                                    </div>
                                                ) : prevdata.type === "scale" ? (
                                                    <div>
                                                        {prevdata.properties.scale_type === "scale" ? (
                                                            <div>
                                                                {prevdata.properties.icon_type === "image" ? (
                                                                    <div>
                                                                        <span className="pr-num-scalesucc">{prevdata.properties.start_text}</span>
                                                                        <span className="pr-num-scale">
                                                                            {prevdata.properties.scale_content.map((image, index) => (
                                                                                <span>
                                                                                    <img src={image.image_id} width="40" />
                                                                                </span>
                                                                            ))}
                                                                        </span>
                                                                        <span className="pr-num-scalesucc pr-num-scalesucc_wrong">{prevdata.properties.end_text}</span>
                                                                    </div>
                                                                ) : prevdata.properties.icon_type === "emoji" ? (
                                                                    <div>
                                                                        <span className="pr-num-scalesucc">{prevdata.properties.start_text}</span>
                                                                        <span className="pr-num-scale">
                                                                            {prevdata.properties.scale_content.map((emoji, index) => (
                                                                                <span>
                                                                                    <img src={emoji.image_id} width="40" />
                                                                                </span>
                                                                            ))}
                                                                        </span>
                                                                        <span className="pr-num-scalesucc pr-num-scalesucc_wrong">{prevdata.properties.end_text}</span>
                                                                    </div>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <table className="table-bordered prev_tablealtcls">
                                                                    <tbody>
                                                                        <tr className="priview_tablehear">
                                                                            <td />
                                                                            {prevdata.properties.table_content && prevdata.properties.table_content.table_options ? prevdata.properties.table_content.table_options.map((options, index) => <td>{options.value}</td>) : ""}
                                                                        </tr>
                                                                        {prevdata.properties.table_content && prevdata.properties.table_content.table_value
                                                                            ? prevdata.properties.table_content.table_value.map((value, index) => (
                                                                                <tr className="priview_tablebody">
                                                                                    <td>{value.value}</td>
                                                                                    {value.image.map((subvalue, subindex) => (
                                                                                        <td>
                                                                                            {prevdata.properties.grid_type === "image" ? <img src={subvalue.image_id} width="20" /> : <input name="choice" type="radio" />}

                                                                                        </td>
                                                                                    ))}
                                                                                </tr>
                                                                            ))
                                                                            : ""}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div />
                                                )}
                                                <p className="flabel">{prevdata.properties.sublabel}</p>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="prevfield prevboxsingle">
                                <div>
                                    <div className="bbtom">
                                        <label>
                                            {" "}
                                            <span className="numbers">{this.state.staticval + 1}</span>
                                            {previewobj[this.state.staticval].properties.question} {previewobj[this.state.staticval].properties.mandatory ? <span style={{ color: "red" }}>*</span> : false}
                                        </label>
                                        <h6 className="prevheading prevheadingnewws">{previewobj[this.state.staticval].properties.subheading}</h6>

                                        {previewobj[this.state.staticval].type === "input" ? (
                                            <input type={previewobj[this.state.staticval].properties.content_type} placeHolder={previewobj[this.state.staticval].placeholder} size={previewobj[this.state.staticval].length} />
                                        ) : previewobj[this.state.staticval].type === "capture" ? (
                                            <div className="single-capture-cls">
                                                <ul className="markerprev">
                                                    {this.state.markers.map((markerimage, index) => (
                                                        <li key={index}>
                                                            <img src={markerimage.marker_image} height="100" />
                                                        </li>
                                                    ))}
                                                </ul>
                                                <img src={sample} width="260" />
                                                <ul className="markerprev scaleprev">
                                                    {previewobj[this.state.staticval].properties.scale_images.map((scaleimg, index) => (
                                                        <li
                                                            key={index}
                                                            style={{
                                                                width: `calc(100% / ${previewobj[this.state.staticval].properties.scale_images.length})`
                                                            }}
                                                        >
                                                            <img src={scaleimg.image} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : previewobj[this.state.staticval].type === "choice" ? (
                                            <div>
                                                <div className="option-checkbox privew-option-checkbox privew-option-checkbox-single">
                                                    <ul className="clear">
                                                        {previewobj[this.state.staticval].properties.options
                                                            ? previewobj[this.state.staticval].properties.options.map(
                                                                function (value) {
                                                                    return (
                                                                        <li>
                                                                            {" "}
                                                                            {previewobj[this.state.staticval].properties.choice_type === "multiple" ? <input type="checkbox" /> : <input name="choice" type="radio" />} <img src={value.label_image} /> {value.label}
                                                                            <div className="parent-of-child-class clear">
                                                                                {value.sublabel
                                                                                    ? value.sublabel.map(
                                                                                        function (subval) {
                                                                                            return (
                                                                                                <div>
                                                                                                    {previewobj[this.state.staticval].properties.choice_type === "multiple" ? <input type="checkbox" /> : <input name="choice" type="radio" />} <img src={subval.label_image} /> {subval.sublabel}
                                                                                                </div>
                                                                                            );
                                                                                        }.bind(this)
                                                                                    )
                                                                                    : ""}
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                }.bind(this)
                                                            )
                                                            : ""}
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : previewobj[this.state.staticval].type === "barcode" ? (
                                            <div>
                                                <div>
                                                    <img src={barcode} width="100" alt="placeholder" />
                                                </div>
                                                {previewobj[this.state.staticval].properties.barcode_ids ? <p> {previewobj[this.state.staticval].properties.barcode_ids[0]} </p> : ""}
                                                {/* <ul className="barcodelisingle">
                                                {(previewobj[this.state.staticval].properties.barcode_ids) ? (
                                                    previewobj[this.state.staticval].properties.barcode_ids.map(function(value) {
                                                        return <li> {value} </li>
                                                    }.bind(this))):""}
                                            </ul> */}
                                            </div>
                                        ) : previewobj[this.state.staticval].type === "info" ? (
                                            <div>
                                                <div className="quill editor" style={{ width: "300px" }}>
                                                    <div className="quill-contents ql-container ql-snow">
                                                        <div className="ql-editor">
                                                            {React.createElement("div", { dangerouslySetInnerHTML: { __html: previewobj[this.state.staticval].properties.info_text } })}
                                                        </div>
                                                    </div>
                                                </div>
                                                {previewobj[this.state.staticval].properties.text_position === "top" ? <p className={"font" + previewobj[this.state.staticval].properties.font_style + " text" + previewobj[this.state.staticval].properties.text_align}>{previewobj[this.state.staticval].properties.info_text}</p> : ""}
                                                <div className="new-div-parts">
                                                    {previewobj[this.state.staticval].properties.info_type === "image" ? (
                                                        <img src={previewobj[this.state.staticval].properties.info_image} alt="placeholder" />
                                                    ) : previewobj[this.state.staticval].properties.info_type === "audio" ? (
                                                        <audio controls>
                                                            <source src={previewobj[this.state.staticval].properties.info_audio} type="audio/mpeg" />
                                                            Your browser does not support the audio element.
                                                        </audio>
                                                    ) : previewobj[this.state.staticval].properties.info_type === "video" ? (
                                                        <video width="320" height="240" controls>
                                                            <source src={previewobj[this.state.staticval].properties.info_video} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    ) : (
                                                        ""
                                                    )}
                                                </div>
                                                {previewobj[this.state.staticval].properties.text_position === "bottom" ? <p className={"font" + previewobj[this.state.staticval].properties.font_style + " text" + previewobj[this.state.staticval].properties.text_align}>{previewobj[this.state.staticval].properties.info_text}</p> : ""}
                                            </div>
                                        ) : previewobj[this.state.staticval].type === "gps" ? (
                                            <div>
                                                {previewobj[this.state.staticval].properties.gps_stats === "show" ? (
                                                    <div>
                                                        <p>
                                                            <i className="fa fa-map-marker" /> Provide Map Location
                                                        </p>
                                                        <div>
                                                            {previewobj[this.state.staticval].properties.point_type === "map" ? (
                                                                <img src={mapicon} width="100" alt="placeholder" />
                                                            ) : previewobj[this.state.staticval].properties.point_type === "coordinates" ? (
                                                                <div>
                                                                    <span>
                                                                        <label>Latitude</label>
                                                                        <input type="text" />
                                                                    </span>
                                                                    <span>
                                                                        <label>Longitude</label>
                                                                        <input type="text" />
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                ""
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        ) : previewobj[this.state.staticval].type === "upload" ? (
                                            <div>
                                                <p> Please Upload {previewobj[this.state.staticval].properties.media_type}</p>
                                                <div className="new-img-prev-up">
                                                    <img src={previewobj[this.state.staticval].properties.upload_icon} />
                                                    <input type="file" disabled="disbaled" />
                                                </div>
                                            </div>
                                        ) : previewobj[this.state.staticval].type === "scale" ? (
                                            <div>
                                                {previewobj[this.state.staticval].properties.scale_type === "scale" ? (
                                                    <div>
                                                        {previewobj[this.state.staticval].properties.icon_type === "image" ? (
                                                            <div>
                                                                <span className="pr-num-scalesucc">{previewobj[this.state.staticval].properties.start_text}</span>
                                                                <span className="pr-num-scale">
                                                                    {previewobj[this.state.staticval].properties.scale_content.map((image, index) => (
                                                                        <span>
                                                                            <img src={image.image_id} width="40" />
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                                <span className="pr-num-scalesucc pr-num-scalesucc_wrong">{previewobj[this.state.staticval].properties.end_text}</span>
                                                            </div>
                                                        ) : previewobj[this.state.staticval].properties.icon_type === "emoji" ? (
                                                            <div>
                                                                <span className="pr-num-scalesucc">{previewobj[this.state.staticval].properties.start_text}</span>
                                                                <span className="pr-num-scale">
                                                                    {previewobj[this.state.staticval].properties.scale_content.map((emoji, index) => (
                                                                        <span>
                                                                            <img src={emoji.image_id} width="40" />
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                                <span className="pr-num-scalesucc pr-num-scalesucc_wrong">{previewobj[this.state.staticval].properties.end_text}</span>
                                                            </div>
                                                        ) : (
                                                            ""
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <table className="table-bordered prev_tablealtcls">
                                                            <tbody>
                                                                <tr className="priview_tablehear">
                                                                    <td />
                                                                    {previewobj[this.state.staticval].properties.table_content && previewobj[this.state.staticval].properties.table_content.table_options ? previewobj[this.state.staticval].properties.table_content.table_options.map((options, index) => <td>{options.value}</td>) : ""}
                                                                </tr>
                                                                {previewobj[this.state.staticval].properties.table_content && previewobj[this.state.staticval].properties.table_content.table_value
                                                                    ? previewobj[this.state.staticval].properties.table_content.table_value.map((value, index) => (
                                                                        <tr className="priview_tablebody">
                                                                            <td>{value.value}</td>
                                                                            {value.image.map((subvalue, subindex) => (
                                                                                <td>
                                                                                    {previewobj[this.state.staticval].properties.grid_type === "image" ? <img src={subvalue.image_id} width="20" /> : <input name="choice" type="radio" />}

                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))
                                                                    : ""}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div />
                                        )}
                                        <p className="flabel">{previewobj[this.state.staticval].properties.sublabel}</p>
                                    </div>
                                    <div className="nextq clear">
                                        {this.state.staticval === 0 ? (
                                            <span className="spancls">
                                                <i className="fa fa-arrow-left" aria-hidden="true" />
                                            </span>
                                        ) : (
                                            <span onClick={() => this.prevVal()}>
                                                <i className="fa fa-arrow-left" aria-hidden="true" />
                                            </span>
                                        )}

                                        {previewobj.length === checker ? (
                                            <span>
                                                <i className="fa fa-check" aria-hidden="true" />
                                            </span>
                                        ) : (
                                            <span onClick={() => this.nextVal()}>
                                                <i className="fa fa-arrow-right" aria-hidden="true" />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
export default withStyles(styles)(Previewsurvey);
