/**
 * GalleryList component.
 *
 * This component is used to manage the images in the gallery.
 * 
 */
import React from "react";
import { withStyles } from "@material-ui/core/styles";
// Survey Pages
import "./CreateSurvey.css";
import api2 from "../../helpers/api2";
import { StyledDropZone } from "react-drop-zone";
//material-ui Dialog
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// Custom Components
import Snackbar from "components/Snackbar/Snackbar.jsx";



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

class Gallerylist extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gallery: { images: [] },
            newimage: "",
            step: 1,
            open: false,
            image: {},
            // snackbar props
            msgColor: "info",
            message: "",
            br: false,
        };
    }

    componentDidMount() {

        this.getimages()

    }

    /* Handles the api to fetch the images. */
    getimages = () => {
        let self = this;
        api2
            .get("v1/gallery/images/" + this.props.tag)
            .then(resp => {
                self.setState({
                    gallery: resp.data,
                    newimage: ""
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

    componentWillReceiveProps(nextProps) {
        let self = this;
        api2
            .get("v1/gallery/images/" + nextProps.tag)
            .then(resp => {
                self.setState({
                    gallery: resp.data
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

    /* Formation of data in base64 format. */
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /* Handles the drop of an image in the drop zone. */
    onDrop(file) {
        this.getBase64(file).then(data => {
            this.setState({ newimage: data })
        });
    }

    /* Validates the format of image type. */
    isImage(filename) {
        switch (filename) {
            case "jpg":
            case "jpeg":
            case "gif":
            case "bmp":
            case "png":
                //etc
                return true;
            default:
                return false;
        }
    }

    /* Handles the api to post the images. */
    addImage = () => {
        const data = { image: this.state.newimage }
        api2
            .post("v1/gallery/images/" + this.props.tag, data)
            .then(resp => {
                console.log(resp);
                if (resp.status === 201) {
                    this.getimages()
                    this.showNotification("Image Uploaded Successfully", "success");
                }
                // window.location.reload();

            })
            .catch(error => {
                this.showNotification("Something went to wrong", "danger");
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

    /* Handles the event to move to previous folder. */
    backFunc = () => {
        this.props.step()
    }


    /* Handles the api to delete the images. */

    deleteFun = () => {
        const image = this.state.image
        console.log(image)
        const core = {
            image: image.image,
            id: image.id
        }
        const data = JSON.stringify(core);
        api2
            .post("v1/gallery/delete", data)
            .then(resp => {
                if (resp.status === 200) {
                    console.log(resp);
                    this.getimages()
                    this.showNotification("Image Deleted Successfully", "success");
                }
            })
            .catch(error => {
                this.showNotification("Something went to wrong", "danger");
                if (error.response) {
                    console.log('resp')
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log('req')
                    console.log(error.request);
                } else {
                    console.log('err')
                    console.log("Error", error.message);
                }
                console.log(error.config);
                console.log(data);
            });
    }

    /* Handles the snackbar message notification. */
    showNotification(msg, color) {
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

    render() {
        const { msgColor, br, message } = this.state;
        console.log(this.props.tag)
        let gallery = this.state.gallery.images
        return (
            <div className="gallerydivwrap">
                <span href="#" className="galleryback" onClick={this.backFunc}> <i className="fa fa-chevron-left"></i>  Back </span>

                <div className="gallery gallerylistimages">

                    {gallery.map((image, index) => (

                        <div className="listofgallery listofgalleryalters"><img src={image.image} alt="gallery" />
                            {console.log("image")}
                            {console.log(image)}

                            <div onClick={() => this.setState({ open: true, image: image })}><i className="fa fa-close"></i>
                            </div>
                        </div>

                    ))}
                    <StyledDropZone accept={"image/png, image/gif, image/jpeg, image/*"} onDrop={this.onDrop.bind(this)} />
                    <div className="dropsaveimage" style={{ textAlign: "center" }}>
                        {this.state.newimage ? <div className="dropimage"><img src={this.state.newimage} alt="gallery new" style={{ height: "100px", width: "18%" }} /></div> : ""}
                        <div className="gallerysave" onClick={this.addImage}>Save</div>
                    </div>
                </div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent
                        style={{
                            padding: "25px 40px 16px"
                        }}
                    >
                        <DialogContentText id="alert-dialog-description"
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                textTransform: "initial"
                            }}
                        >
                            Are you sure you want to delete ?
                        </DialogContentText>
                        <DialogActions
                            style={{
                                justifyContent: "center"
                            }}>
                            <Button onClick={() => {
                                this.setState({ open: false })
                                this.deleteFun()
                            }} color="primary" autoFocus
                                style={{
                                    color: "#fff",
                                    backgroundColor: "#074e9e",
                                    margin: "10px 0 0px 10px",
                                    padding: "5px 16px",
                                    fontSize: "12px"
                                }}>
                                Yes
                            </Button>
                            <Button onClick={() => this.setState({ open: false })} color="primary"
                                style={{
                                    color: "#fff",
                                    backgroundColor: "#074e9e",
                                    margin: "10px 0 0px 10px",
                                    padding: "5px 16px",
                                    fontSize: "12px"
                                }}>
                                No
                            </Button>

                        </DialogActions>

                    </DialogContent>
                </Dialog>
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
export default withStyles(styles)(Gallerylist);