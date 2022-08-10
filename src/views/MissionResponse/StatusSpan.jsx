/**
 * StatusSpan component.
 * 
 * This component is used to manage the status of the mission responses.
 *
 */

import React from "react";
/* API */
import api2 from "../../helpers/api2";

export default class CreateStatusSpan extends React.Component {
    constructor(props) {
        super(props);
        let statoptions = [];
        if (props.value === 'In Progress') {
            for (let i = 0; i < props.statusOptions.length; i++) {
                if (props.statusOptions[i].label !== 'Re-Publish') {
                    statoptions.push(props.statusOptions[i])

                }

            }
        }
        else {
            statoptions = props.statusOptions;
        }
        this.state = {
            value: props.value,
            options: statoptions
        };

    }

    /*  
    * Validate the event value with status option list.
    *
    * If value and options gets matched it will pass the value to update the status.
    * 
    */
    handleStatusChange(value) {
        let selectedOption = {};
        this.state.options.forEach(s => {
            if (s.label === value) {
                selectedOption = s;
            };
        });
        this.updateResponseStatus(this.props.data.survey_tag_id, selectedOption.value, selectedOption.label, this.props.data.customer_id);
    };

    /* Handles the api to update response status to server. */
    updateResponseStatus = (survey_tag_id, status, statusName, customer_id) => {
        let data = { survey_tag_id: survey_tag_id, status: status, customer_id: customer_id };
        api2
            .patch("v1/survey_report/update_status", data)
            .then(resp => {
                if (resp.status === 200) {
                    this.props.agGridReact.props.showNotification("Status Updated Successfully", "success");
                    this.props.data.status = statusName;
                    if (statusName === 'In Progress' || statusName === 'Hold') {
                        this.props.data.reviewed = 0;
                    }
                    // redrawRowData(survey_tag_id, this.props.data);
                    this.props.agGridReact.props.updateRowData(survey_tag_id, this.props.data);

                }
                else {
                    this.props.agGridReact.props.showNotification("Error in updating the status", "danger");
                }

            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.error) {
                    this.props.agGridReact.props.showNotification(error.response.data.error, "danger");
                }
                else {
                    this.props.agGridReact.props.showNotification("Error in updating the status", "danger");
                }
                this.props.agGridReact.props.updateRowData(survey_tag_id, this.props.data);

            });

    };

    render() {

        return (
            <span>
                <select defaultValue={this.state.value} onChange={(event) => this.handleStatusChange(event.target.value)}
                    style={{
                        marginTop: "15px",
                        marginBottom: "10px",
                        minWidth: "150px",
                        minHeight: "25px"
                    }}>
                    {
                        this.state.options.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.label}
                            >{opt.label}</option>
                        ))
                    }
                </select>

            </span>
        );
    }
}