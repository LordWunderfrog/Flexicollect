/**
 * SurveyBuilder component.
 * 
 * This component is used to handle input for the survey.
 *
 * 
 */
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Board from "./Board";

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


class SurveyBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      tags: "",
      selectedValue: "all",
      newonj: []
    };
    this.checker = this.checker.bind(this);
    this.lchange = this.elementsProp.bind(this);
    this.rchange = this.settingsPorp.bind(this);
  }

  /**
   * Handles the props for setting bar.
   *
   * @public
   * @param {e}
   */
  settingsPorp(e) {
    this.props.rchange(e)
  }

  /**
   * Handles the props for setting bar.
   *
   * @public
   * @param {e} to the set division true of false
   * @returns {boolean} true or false
   */
  checker(e, pos) {
    this.props.dropChange(e, pos)
  }

  /* Handles the props for setting bar. */
  deleteDrops = (e, flag) => {
    this.props.deletedrops(e, flag)
  }

  /**
   * Handles the props for add element box.
   *
   * @public
   */
  elementsProp() {
    this.props.lchange('e')
  }

  /* Handles the events to auto save the props*/
  autoSave() {
    this.props.autosave()
  }

  render() {
    return (
      <div styles={{ width: 100, height: 100 }}>
        <Board
          ondraglick={this.checker}
          deteldrops={this.deleteDrops}
          setDropsLang={this.props.setDropsLang}
          lchange={this.lchange}
          rchange={this.rchange}
          olddrops={this.props.olddrops}
          oldconditions={this.props.oldconditions}
          autosave={() => this.autoSave()}
          platformType={this.props.platformType}
          mappingProfileEnable={this.props.mappingProfileEnable}
          props="check props"
          refcode={this.props.refcode}
          selectedlanguage={this.props.selectedlanguage}
          changedroplanguage={this.props.changedroplanguage}
          dropcurrentlanguage={this.props.dropcurrentlanguage}
          defaultdrops={this.props.defaultdrops}
          updatelanguagedrop={this.props.updatelanguagedrop}
          updatelanguageproperties={this.props.updatelanguageproperties}
          downArrowFuncLanguage={this.props.downArrowFuncLanguage}
          upArrowFuncLanguage={this.props.upArrowFuncLanguage}
          languages_drop={this.props.languages_drop}
        />
      </div>
    );
  }
}

SurveyBuilder.propTypes = {
  classes: PropTypes.object
};
export default withStyles(styles)(SurveyBuilder);