/**
 * SurveyInfo component.
 *
 * This component is used to build the survey and returns survey information.
 * 
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Radio from "@material-ui/core/Radio";

import allQuestion from "assets/img/all.png";
import singleQuestion from "assets/img/single.png";
import messageQuestion from "assets/img/msg.png";
import Select from "react-select";
import Switch from "@material-ui/core/Switch";

// API
import api2 from ".../../helpers/api2";

import "./SurveyInfo.css";

import {
  FormControl,
  FormGroup,
  Col,
  Row
} from "react-bootstrap";

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


const options = [
  { value: "App Only", label: "App Only" },
  { value: "App & Browser", label: "App & Browser" },
  { value: "Browser Only", label: "Browser Only" }
];



class SurveyInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      tags: "",
      points: 0,
      minutes: 0,
      selectedValue: "all",
      projectSource: [],
      missions: [],
      projects: [],
      profileList: [],
      selectedProfile: "",
      platformType: {},
      isAssigned: "",
      refcode: "",
      oldrefcode: props.oldrefcode ? props.oldrefcode : "",
      languagelist: [],
      selectedlanguage: { label: "English", value: 'English' }
    };
  }

  componentDidMount() {
    localStorage.removeItem('updateProperties');
    this.getProjectList();
    let option = {};
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === this.props.platformType) {
        option = options[i];
      }
    }
    this.setState({
      name: this.props.surveyname,
      tags: this.props.prevtags,
      points: this.props.points,
      selectedValue: this.props.qtype,
      minutes: this.props.minutes,
      platformType: option,
      isAssigned: this.props.isAssigned,
      refcode: this.props.refcode,
      languagelist: this.props.languagelist,
      selectedlanguage: this.props.selectedlanguage,
      profileList: [{ value: 1, label: 'User A' }, { value: 2, label: 'User B' }, { value: 3, label: 'User C' }, { value: 4, label: 'User D' }]
    })
  }

  /* Handles the api to fetch the project list. */
  getProjectList() {
    var self = this;
    api2
      .get("project_lite_list")
      .then(resp => {
        let proj = [];
        resp.data.forEach((x, i) => {
          proj.push({ value: x.id, label: x.project_name });
        });
        self.setState({
          projectSource: resp.data,
          projects: proj
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  componentWillReceiveProps(nextProps) {

    let option = {};

    for (var i = 0; i < options.length; i++) {
      if (options[i].value === nextProps.platformType) {
        option = options[i];
      }
    }

    this.setState({
      name: nextProps.surveyname,
      tags: nextProps.prevtags,
      points: nextProps.points,
      selectedValue: nextProps.qtype,
      minutes: nextProps.minutes,
      platformType: option,
      refcode: nextProps.refcode,
      languagelist: nextProps.languagelist,
      selectedlanguage: nextProps.selectedlanguage


    })
  }

  /* Handles the events to filter the selected language from the list. */

  selectedlanguage(name, event) {
    let difference = this.state.selectedlanguage.filter(x => !event.includes(x)); // calculates diff
    if (difference.length > 0) {
      this.props.handledeletelanguage(difference);
    }
    const value = event;
    this.props.handleselectedlanguage(name, value);

  };

  /* Handles the events to update the platform type. */
  handlePlatformType = event => {
    this.setState({
      platformType: event
    });

    this.props.handlePlatformType(event);
  };



  /* Handles the event when the input value changes. */
  handleInputChange = event => {
    const target = event.target;
    let value = target.value;
    const name = target.name;

    if (name === "points" || name === "minutes") value = parseInt(value);


    this.setState({
      [name]: value
    });

    this.props.handleInputChange(event);
  };

  /* Handles the event to update the ref code. */
  handleRefcodeChange = event => {
    const target = event.target;
    let value = target.value;
    const name = target.name;


    this.setState({
      [name]: value
    });

    // this.props.handleRefcodeChange(event);
  };

  /* Handles the event when the input value changes. */
  handleInputChange2(name, event) {
    const value = event.value;
    this.setState({
      [name]: value
    });
    this.props.handleprojects(name, value);
  };

  /* Handles the event to update the selected project. */
  handleProjectChange(name, event) {
    let projectid = event.value
    const value = event.value;
    this.setState({
      [name]: value
    });
    this.props.handleprojects(name, value);
    this.getMissionList(projectid);
  };

  /* Handles the api to fetch the mission list. */
  getMissionList(projectid) {
    var self = this;
    api2
      .get("inactive_missions?id=" + projectid)
      .then(resp => {
        let mission = [];
        resp.data.missions.forEach((x, i) => {
          mission.push({ value: x.id, label: x.mission_name });
        });
        self.setState({
          missions: mission
        });
      })
      .catch(error => {
        console.error(error);
        self.setState({
          response: true
        });
      });
  }

  /* Handles the api to validate the ref code. */
  ValidateMissionRefCode = refcode => {
    if (refcode.length < 1 || refcode === this.props.oldrefcode) {
      this.setState({
        duplicatemissionRefCode: false
      })
      this.props.handleRefcodeChange(false, refcode)
      return;
    }
    api2
      .get("refcode/validate?refcode=" + refcode)
      .then(resp => {
        if (resp.status === 200) {
          this.setState({
            refcode: refcode,
            duplicatemissionRefCode: false,
          })
          this.props.handleRefcodeChange(false, refcode)
        } else {
          this.setState({
            duplicatemissionRefCode: true
          })
        }
      })
      .catch(error => {
        // if(error.status === 400){
        this.setState({
          duplicatemissionRefCode: true
        })
        this.setState({ refcode: refcode })
        this.props.handleRefcodeChange(true, refcode)

        // }
        //console.error(error);
      });
  };


  /* Handles the event to update the value. */
  handleChange = event => {
    this.setState({ selectedValue: event.target.value }, this.props.handleqtypeChange(event));
  };

  /** Handles selection of the profile for mapping */
  handleProfileSelection(name, event) {
    this.setState({
      selectedProfile: event
    });
    this.props.handleProfileChange(event);
  }

  /** Handles toggle for mapping profile make compulsory */
  handleMapProfileToggle = event => {
    event.preventDefault();
    this.props.handleMappingProfileChange(!this.state.mappingProfileEnable)
  };

  render() {
    return (
      <Fragment>
        <FormGroup className="form-hei-alt">
          <Col sm={6} className="survey-input">
            <span style={{ marginLeft: "10px" }}>
              Survey Name
            </span>
            <FormControl
              autoFocus
              className="input-blue"
              name="name"
              type="text"
              placeholder="Survey Name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </Col>
          <br />
          <Row className="padder">
            <Col md={4} className="survey-input2">
              <span style={{ marginLeft: "10px" }}>Tags</span>
              <FormControl
                className="input-blue"
                name="tags"
                type="text"
                placeholder="#Onboarding, #Screener, #Survey"
                value={this.state.tags}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={2} >
              <span>Survey Ref Code</span>
              <FormControl
                name="refcode"
                type="text"
                value={this.state.refcode}
                onChange={this.handleRefcodeChange}
                onBlur={e => {
                  this.ValidateMissionRefCode(e.target.value);
                }}

              />
            </Col>

          </Row>
          <br />
          <Row className="padder">
            <Col md={3} className="survey-input2">
              <div>
                <span style={{ marginLeft: "10px" }}>Languages</span>
                <Select
                  maxMenuHeight={200}
                  isMulti
                  options={this.state.languagelist}
                  value={this.state.selectedlanguage.length > 0 ? this.state.selectedlanguage : { label: "English", value: 'English' }}
                  defaultValue={{ label: "English", value: 'English' }}
                  onChange={this.selectedlanguage.bind(this, 'language')}
                  name="project"
                  className="selectinfo"
                />
              </div>
            </Col>


          </Row>
          <br />
          <Row className="padder">
            <Col md={3} className="survey-input2">
              <span style={{ marginLeft: "10px" }}>Survey Points</span>
              <FormControl
                className="input-blue"
                name="points"
                type="number"
                placeholder="Survey Points"
                value={this.state.points}
                onChange={this.handleInputChange}
              />
            </Col>
            <Col md={3}>
              <span style={{ marginLeft: "10px" }}>Survey Minutes</span>
              <FormControl
                className="input-blue"
                name="minutes"
                type="number"
                placeholder="Survey Minutes"
                value={this.state.minutes}
                onChange={this.handleInputChange}
              />
            </Col>
          </Row>
          <br />
          <Row className="padder">
            <Col md={3} className="survey-input2">
              <div>
                <span style={{ marginLeft: "10px" }}>Project</span>
                <Select
                  options={this.state.projects}
                  onChange={this.handleProjectChange.bind(this, 'project_id')}
                  name="project"
                  className="selectinfo"
                />
              </div>
            </Col>

            <Col md={3}>

              {this.props.isAssigned !== "" && this.props.isAssigned === "yes" &&

                <div style={{ textAlign: "center", marginTop: "25px" }}>
                  <span>Platform type: </span><span style={{ fontWeight: 600 }}>{this.props.platformType}</span>
                </div>
              }
              {this.props.isAssigned === "" &&
                <div>
                  <span style={{ marginLeft: "10px" }}>Platform type</span>
                  <Select
                    options={options}
                    value={this.state.platformType}
                    onChange={this.handlePlatformType}
                    name="PlatformType"
                    className="selectinfo"
                  />
                </div>
              }
            </Col>

            {(this.state.project_id) ?
              <Col md={3}>
                <span style={{ marginLeft: "10px" }}>Missions</span>
                <Select
                  options={this.state.missions}
                  onChange={this.handleInputChange2.bind(this, 'mission_id')}
                  name="missions"
                  className="selectinfo"
                />
              </Col>
              : ""}
          </Row>
          <br />

          <Row className="padder">
            <Col md={3} className="survey-input2">
              <div>
                <span style={{ marginLeft: "10px" }}>Mapping Profile</span>
                <Switch
                  checked={this.props.mappingProfileEnable}
                  color={'primary'}
                  onChange={this.handleMapProfileToggle}
                />
              </div>
            </Col>

            <Col md={3}>
              <div>
                <span style={{ marginLeft: "10px" }}>Select Profile</span>
                <Select
                  options={this.state.profileList}
                  value={this.state.selectedProfile}
                  onChange={this.handleProfileSelection.bind(this, 'MappingProfile')}
                  name="MappingProfile"
                  className="selectinfo"
                />
              </div>
            </Col>
          </Row>
          <br />

          <Col sm={6} className="survey-input">
            <Row className="show-grid">
              <Col xs={4} md={4}>
                <Radio
                  checked={this.state.selectedValue === "all"}
                  onChange={this.handleChange}
                  value="all"
                  name="all"
                  color="primary"
                />
                <br />
                <img src={allQuestion} alt="allQuestion" />
                <Typography variant="body2">
                  All Questions on one page
                </Typography>
              </Col>
              <Col xs={4} md={4}>
                <Radio
                  checked={this.state.selectedValue === "single"}
                  onChange={this.handleChange}
                  value="single"
                  name="single"
                  color="primary"
                />
                <br />
                <img src={singleQuestion} alt="singleQuestion" />
                <Typography variant="body2">
                  Single Question per page
                </Typography>
              </Col>
              <Col xs={4} md={4}>
                <Radio
                  checked={this.state.selectedValue === "message"}
                  onChange={this.handleChange}
                  value="message"
                  name="message"
                  color="primary"
                />
                <br />
                <img src={messageQuestion} alt="messageQuestion" />
                <Typography variant="body2">Messenger</Typography>
              </Col>
            </Row>
          </Col>
        </FormGroup>
      </Fragment>
    );
  }
}

SurveyInfo.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(SurveyInfo);