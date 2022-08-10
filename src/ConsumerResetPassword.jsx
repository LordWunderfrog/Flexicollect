/*
* ConsumerResetPassword component. 
* This component will ask user to open the link using mobile app, if user opens reset password link in the browser.
*  
*/

import React from "react";

class ConsumerResetPassword extends React.Component {
  render() {
    return (
      <div>
        <p
          style={{
            fontStyle: "Roboto",
            fontSize: "18px",
            color: "#1A385B",
            padding: "2px",
            marginTop: "2px"
          }}
        >Please access this link using mobile app.</p>
      </div>
    );
  }
}

export default ConsumerResetPassword;
