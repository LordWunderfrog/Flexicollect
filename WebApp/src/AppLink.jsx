/*
* AppLink component. 
* This component will ask user to download app from app store or playstore, if user opens app survey link in the browser.
*  
*/
import React from "react";
import Button from "@material-ui/core/Button";

class AppLink extends React.Component {
  render() {
    var agent = navigator.userAgent;
    var android = false;
    var ios = false;


    if (agent.includes("Android")) {
      android = true;
    } else if (agent.includes("iPhone")) {
      ios = true;
    }
    return (
      <div>
        <p
          style={{
            fontStyle: "Roboto",
            fontSize: "18px",
            textAlign: "center",
            color: "#1A385B",
            padding: "10px",
            marginTop: "10%"
          }}
        >
          To take part in this survey you'll need to download the Eolas Flex Collect App.
          <br />
          <br />
          <br />

          Please  use the links below to get the app.
          <br />
        </p>

        {ios === true ? (
          <div style={{ textAlign: "center" }}>
            <a href="https://apps.apple.com/us/app/id1463959676">
              <Button
                style={{
                  marginLeft: "10px",
                  marginTop: "25px",
                  //padding: "10px",
                  backgroundColor: "#645f5f"
                }}
                variant="contained"
                color="primary"
              >
                <i
                  className="fab fa-apple fa-3x"
                  aria-hidden="true"
                  style={{
                    padding: "0px",
                    marginRight: "12px",
                    fontStyle: "Roboto"
                  }}
                />
                Download it from APP STORE
              </Button>
            </a>
          </div>
        ) : android === true ? (
          <div style={{ textAlign: "center" }}>
            <a href="https://play.google.com/store/apps/details?id=com.eolas">
              <Button
                style={{
                  marginLeft: "15px",
                  marginTop: "25px",
                  // padding: "15px",
                  backgroundColor: "rgb(142, 213, 49)"
                }}
                variant="contained"
                color="primary"
              >
                <i
                  className="fa fa-android fa-3x"
                  aria-hidden="true"
                  style={{
                    padding: "0px",
                    marginRight: "12px",
                    fontStyle: "Roboto"
                  }}
                />
                Download it from ANDROID
              </Button>
            </a>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <a href="https://apps.apple.com/us/app/id1463959676">
              <Button
                style={{
                  marginLeft: "10px",
                  marginTop: "25px",
                  //padding: "10px",
                  backgroundColor: "#645f5f"
                }}
                variant="contained"
                color="primary"
              >
                <i
                  className="fab fa-apple fa-3x"
                  aria-hidden="true"
                  style={{
                    padding: "0px",
                    marginRight: "12px",
                    fontStyle: "Roboto"
                  }}
                />
                Download it from APP STORE
              </Button>
            </a>

            <a href="https://play.google.com/store/apps/details?id=com.eolas">
              <Button
                style={{
                  marginLeft: "15px",
                  marginTop: "25px",
                  // padding: "15px",
                  backgroundColor: "rgb(142, 213, 49)"
                }}
                variant="contained"
                color="primary"
              >
                <i
                  className="fa fa-android fa-3x"
                  aria-hidden="true"
                  style={{
                    padding: "0px",
                    marginRight: "12px",
                    fontStyle: "Roboto"
                  }}
                />
                Download it from PLAY STORE
              </Button>
            </a>
          </div>
        )}

        <p style={{
          fontStyle: "Roboto",
          fontSize: "18px",
          textAlign: "center",
          color: "#1A385B",
          padding: "10px",
          marginTop: "50px"
        }}>

          Please visit our website to learn more about Eolas International
          <br />
          <a target="_blank" rel="noopener noreferrer" href="http://www.eolasinternational.com">http://www.eolasinternational.com</a>
        </p>
      </div>
    );
  }
}

export default AppLink;