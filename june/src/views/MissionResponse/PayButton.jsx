/**
 * PayButton component.
 * 
 * This component is used to design the pay button.
 * 
 * This button is imported in aggrid table.
 *
 */

import React, { Component } from "react";
import Button from "@material-ui/core/Button";

export default class PayButton extends Component {

  /* Function is used to call the methodFromParentPay method in AgMissionResponse component. */

  invokeParentMethod = () => {
    this.props.context.componentParent.methodFromParentPay(this.props);
  };

  /* Function is used to call the methodFromParentPaydetails method in AgMissionResponse component. */
  invokeParentDetailsMethod = () => {
    this.props.context.componentParent.methodFromParentPaydetails(this.props);
  };


  render() {
    return (
      <span>
        {this.props.data.payment.paymentEnabled === 1 ? (
          <div
            style={{
              height: 20,
              lineHeight: 0.5,
              fontSize: 14,
              marginTop: 25,
              marginBottom: 25,
              paddingLeft: 10,
              fontWeight: 600
            }}

            onClick={this.invokeParentDetailsMethod}
          >
            {this.props.data.payment.paymentStatus === "SUCCESS" ? 'PAID' : this.props.data.payment.paymentStatus}
          </div>
        ) : this.props.data.payment.paymentEnabled === 0 ? (
          <Button
            variant="contained"
            disabled={
              this.props.data.reviewed !== 1 ||
              this.props.data.status !== "Accepted" ||
              this.props.paymentEnabledMission === 0
            }
            style={{
              height: 20,
              lineHeight: 0.5,
              fontSize: 10,
              marginTop: 15,
              marginBottom: 15
            }}
            onClick={this.invokeParentMethod}
            color="primary"
          >
            Pay
          </Button>
        ) : (
          ""
        )}
      </span>
    );
  }
}