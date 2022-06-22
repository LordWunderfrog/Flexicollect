/**
 * 
 * Image cell renderer component.
 * 
 * This component is used to render the images with popover function.
 * 
 */

import React from "react";
import Popover from '@material-ui/core/Popover';


export default class ImageCellRenderer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
      anchorEl: null,
      setLoader: true,
      height: "10px"
    };
  }

  /* Handles the event to close the popup. */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /* Handles the event to render the image in table when user mouse an image. */
  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  /* Handles the function to load the loading symbol. */
  loadImage = () => {
    this.setState({ setLoader: false, height: "400px" });
  }

  /* Handles the function to stop the loading symbol. */
  errorImage = () => {
    this.setState({ setLoader: false });
  }

  render() {
    const open = Boolean(this.state.anchorEl);
    let prop = "";
    let scale = "";
    let imgoverlay = false;
    if (this.state.value && this.state.value !== undefined && this.state.value.length > 0) {
      prop = this.state.value[1] ? this.state.value[1] : "";
      scale = this.state.value[2] ? this.state.value[2] : "";
      imgoverlay = this.state.value[0] ? this.state.value[0] === 1 ? true : false : false;
    }

    return (
      <div>
        {prop && prop !== "" &&
          <div
            style={imgoverlay === true ? styles.imgoverlay : styles.imag}
          >
            <img
              onMouseEnter={this.handleClick}
              onMouseLeave={this.handleClose}
              src={prop}
              alt={prop}
              style={{
                objectFit: "cover",
                height: '150px',
                width: 'auto'
              }}
            />
          </div>
        }
        {scale && scale !== "" &&
          <Popover
            style={{ pointerEvents: 'none' }}
            id="mouse-over-popover"
            open={open}
            anchorEl={this.state.anchorEl}
            onClose={this.handleClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transitionDuration='auto'
            BackdropProps={{ style: { opacity: 0 } }}
          >
            {this.state.setLoader === true &&
              <div className="fa fa-spinner fa-spin">
              </div>
            }
            <img
              onMouseLeave={this.handleClose}
              src={scale}
              alt={scale}
              onLoad={this.loadImage}
              onError={this.errorImage}
              style={{
                objectFit: "contain",
                height: this.state.height,
                width: 'auto'
              }}
            />
          </Popover>

        }
      </div>
    );
  }
}


const styles = {

  imag: {
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  imgoverlay: {
    marginTop: 5,
    marginBottom: 5,
    opacity: '0.2',
    justifyContent: 'center',
    alignSelf: 'center'
    // backgroundColor: ' rgba(128,128,128,1)',
  }
}
