/**
* Gallery component.
*
* This component is used to manage the images in the gallery.
* 
*/
import React from "react";
import { withStyles } from "@material-ui/core/styles";
// Survey Pages
import "./CreateSurvey.css";
import Gallerylist from "./gallerylist";
import api2 from "../../helpers/api2";

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

class CreateGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imagetag: [],
            selected: "",
            step: 0
        };
    }

    componentDidMount() {
        let self = this;
        api2
            .get("v1/gallery/tags")
            .then(resp => {
                self.setState({
                    imagetag: resp.data.tags
                });
            })
            .catch(error => {
                console.error(error);
                console.log("NN")
                self.setState({
                    response: true
                });
            });
    }

    /* Handles the api to post the images. */
    addImage = () => {
        const data = { image: this.state.newimage }
        api2
            .post("v1/gallery/images/tmp", data)
            .then(resp => {
                console.log(resp);
                window.location.reload();
            })
            .catch(error => {
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

    /* Handles the event to update the name. */
    selectName = (e) => {
        this.setState({
            selected: e,
            step: 1
        });
    }

    /* Manage the navigation inside the folder. */
    stepFunction = () => {
        this.setState({
            step: 0
        });
    }



    render() {
        const tags = this.state.imagetag
        return (
            <div className="gallery gallery-mail">

                <div className="gallery-mail-innerwrap">
                    <div className="hdeadingbck">
                        <i className="fa fa-picture-o" aria-hidden="true"></i>  <h4>Gallery</h4>
                    </div>

                    {(this.state.step === 0) ?
                        <div className="fullwidthgallerg">
                            {tags.map((tag, index) => (
                                <div key={index} className="galleryparebt" onClick={() => this.selectName(tag.name)}>
                                    <div className="gallery-folder">
                                        <div className="folder-name-image">
                                            <i className="fa fa-folder"></i>
                                        </div>
                                        <div className="folder-name-test">
                                            {tag.name}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div> :
                        <Gallerylist tag={this.state.selected} step={this.stepFunction} />
                    }
                </div>
            </div>
        );
    }
}
export default withStyles(styles)(CreateGallery);
