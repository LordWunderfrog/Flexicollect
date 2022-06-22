/**
 * 
 * Custom filter component.
 * 
 * This component is used to filter the column data in mission table.
 * 
 */

import React, { Component } from "react";
import ReactDOM from "react-dom";
import Checkbox from "@material-ui/core/Checkbox";

import './CustomFilter.css'

export default class CustomFilter extends Component {
  constructor(props) {
    super(props);
    this.Uncheck = React.createRef();
    this.state = {
      text: [],
      questions: this.props.agGridReact.props.questions,
      filteredMetricList: this.props.agGridReact.props.filteredMetricList,
      filteredconsumertype: this.props.agGridReact.props.filteredconsumertype,
      scaleFilterValue: [],
      initialItems: [],
      search: "",
      selectAll: false,
      type: ""
    };

    this.valueGetter = this.props.valueGetter;

    this.ScaleChoiceFilter = this.ScaleChoiceFilter.bind(this);
  }

  componentDidMount() {
    this.setFilterValue();
  }

  /* For the user selected column formation of filter value list from cell values.  */
  setFilterValue() {
    let FilterValue = [];
    // FilterValue.checked=false;
    if (this.props.colDef.field === "status") {
      FilterValue = [{
        value: "In Progress",
        checked: false
      },
      {
        value: "New",
        checked: false
      },
      {
        value: "Accepted",
        checked: false
      },
      {
        value: "Hold",
        checked: false
      },
      {
        value: "Invalid",
        checked: false
      },
      {
        value: "Fraudulent",
        checked: false
      }
      ]
    }
    else if (this.props.colDef.field === "reviewed") {
      FilterValue = [{
        value: "Reviewed",
        checked: false
      },
      {
        value: "Not Reviewed",
        checked: false
      }
      ]
      this.setState({ type: "reviewed" })
    }
    else if (this.props.colDef.field === "consumerType") {
      this.state.filteredconsumertype.forEach(c => {
        FilterValue.push({
          value: c,
          checked: false
        })
      })
    }
    else if (this.props.colDef.type === "q") {
      this.state.questions.forEach(q => {
        if (q.type === "scale" && q.question_id === this.props.colDef.id) {
          if (q.question.properties.scale_type === "scale") {
            q.question.properties.scale_content.forEach(scaleFilterQues => {
              FilterValue.push({
                value: scaleFilterQues.value,
                checked: false
              })



            });
            this.setState({ scaleFilterValue: FilterValue, type: "scale" })
          }
          else if (q.question.properties.scale_type === "table") {
            q.question.properties.table_content.table_value.forEach(tableFilterQuesvalue => {
              q.question.properties.table_content.table_options.forEach(tableFilterQuesoptions => {

                FilterValue.push({
                  value: tableFilterQuesvalue.value + ":" + tableFilterQuesoptions.value,
                  checked: false
                })
              })
            });
            this.setState({ type: "table", scaleFilterValue: FilterValue })
          }

        } else if (q.type === "choice" && q.question_id === this.props.colDef.id) {
          if (
            q.question.properties.multilevel === 0 &&
            q.question.properties.choice_type === "single"
          ) {
            q.question.properties.options.forEach(choiceFilterQues => {
              FilterValue.push({
                value: choiceFilterQues.label,
                checked: false
              })
            });
            this.setState({ scaleFilterValue: FilterValue })

          } else if (
            q.question.properties.multilevel === 0 &&
            q.question.properties.choice_type === "multiple"
          ) {
            q.question.properties.options.forEach(choiceFilterQues => {
              FilterValue.push({
                value: choiceFilterQues.label,
                checked: false
              })
              this.setState({ scaleFilterValue: FilterValue })
            });
          } else if (
            q.question.properties.multilevel === 1 &&
            q.question.properties.choice_type === "single"
          ) {
            q.question.properties.options.forEach(choiceFilterQues => {
              choiceFilterQues.sublabel.forEach(sublabelfilter => {
                FilterValue.push({
                  value: choiceFilterQues.label + "-" + sublabelfilter.sublabel,
                  checked: false
                })
              });
            });
          } else if (
            q.question.properties.multilevel === 1 &&
            q.question.properties.choice_type === "multiple"
          ) {
            q.question.properties.options.forEach(choiceFilterQues => {
              choiceFilterQues.sublabel.forEach(sublabelfilter => {
                FilterValue.push({
                  value: choiceFilterQues.label + "-" + sublabelfilter.sublabel,
                  checked: false
                })
              });
            });
          }
          this.setState({ type: "choice" })
        }

      });
    }
    else if (this.props.colDef.type === "m") {

      this.state.filteredMetricList.forEach(q => {
        if (q.metrics_id === this.props.colDef.id) {
          q.filter_list.forEach(metricsFilterData => {
            FilterValue.push({
              value: metricsFilterData,
              checked: false
            })


          });
        }
      });
    }
    this.setState({
      type: "metric",
      scaleFilterValue: FilterValue,
      initialItems: FilterValue
    });
  }
  /* Validate the filter value. */
  isFilterActive() {
    return this.state.text !== null && this.state.text !== undefined;
  }

  /* Comparision of user selected value with entire column data. Return the value if it matches. */
  doesFilterPass(params) {
    if (this.state.text.length > 0) {
      if (this.state.type === "scale") {
        let match = [];
        for (let i = 0; i < this.state.text.length; i++) {
          match[i] = this.filterfuncnum(i, params);

        }


        let ret = false;
        for (let j = 0; j < match.length; j++) {

          if (match[j] === true) {

            ret = true;

            break;
          }
        }


        return ret;
      }
      else if (this.state.type === "reviewed") {
        let match = [];
        for (let i = 0; i < this.state.text.length; i++) {
          match[i] = this.filterfuncreview(i, params);

        }


        let ret = false;
        for (let j = 0; j < match.length; j++) {

          if (match[j] === true) {

            ret = true;

            break;
          }
        }


        return ret;
      }
      else {
        let match = [];
        for (let i = 0; i < this.state.text.length; i++) {
          match[i] = this.filterfunc(i, params);
        }
        let ret = false;

        for (let j = 0; j < match.length; j++) {

          if (match[j] === true) {
            ret = true;

            break;
          }
        }

        return ret;
      }
    }
    else {
      return ""
        .toLowerCase()
        .split(" ")
        .every(filterWord => {
          return (
            this.valueGetter(params.node)
              .toString()
              .toLowerCase()
              .indexOf(filterWord) >= 0
          );
        });
    }
  }

  /* Used to filter the numeric value - Scale question.*/
  filterfuncnum(i, params) {
    return this.valueGetter(params.node).indexOf(this.state.text[i]) >= 0;
  }
  /* Used to filter the reviewed column */
  filterfuncreview(i, params) {

    return this.valueGetter(params.node).toString().toLowerCase().indexOf(this.state.text[i]) >= 0;
  }

  /* Used to filter the string from column cell data.  */
  filterfunc(i, params) {

    return this.state.text[i]
      .toLowerCase()
      .split(" ")
      .every(filterWord => {
        return (
          this.valueGetter(params.node)
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0
        );
      });
  }
  /* Unused function */
  filterfuncreset(i, params) {
    return i
      .toLowerCase()
      .split(" ")
      .every(filterWord => {
        return (
          this.valueGetter(params.node)
            .toString()
            .toLowerCase()
            .indexOf(filterWord) >= 0
        );
      });
  }

  /* Using the grid api to return filter value.Function hook from parent component.*/
  getModel() {
    return { value: this.state.text };
  }

  /* Used to clear the filter value in mission table when function gets invoked from parent.*/
  setModel(model) {
    if (model === null) {

      this.setState({ text: [] })
      let checked = []
      this.state.initialItems.forEach(c => {
        checked.push({
          value: c.value,
          checked: false
        });

      });

      this.setState({
        text: [],
        scaleFilterValue: checked,
        search: ""


      })

    }
  }

  afterGuiAttached(params) {
    this.focus();

  }

  focus() {
    window.setTimeout(() => {
      let container = ReactDOM.findDOMNode(this.refs.input);
      if (container) {
        container.focus();
      }
    });
  }

  /* Used to update the filter list when column data gets changed. */
  componentMethod(e) {
    if (this.props.colDef.type === "m") {
      this.valueGetter = this.props.valueGetter;
      let FilterValue = [];
      let filteredMetricList = e;
      filteredMetricList.forEach(q => {
        if (q.metrics_id === this.props.colDef.id) {
          q.filter_list.forEach(metricsFilterData => {
            FilterValue.push({
              value: metricsFilterData,
              checked: false
            })

          });
        }
      });
      this.setState({
        type: "metric",
        scaleFilterValue: FilterValue,
        initialItems: FilterValue
      });

    }

  }

  /* When user selects the filter value in the filter value list.
  * Update the selected value as checked 
  * pass the selected filter value to the grid api to return the filtered column data.  */
  ScaleChoiceFilter(value, event, index1) {

    let newValue = [];
    newValue = this.state.text;
    if (this.props.colDef.field === "reviewed") {
      let selectvalue = value.value === "Reviewed" ? 1 : 0
      if (event.target.checked === false) {
        this.setState({ selectAll: false })

        let copyarray = newValue;

        copyarray.forEach((slicevalue, index) => {
          if (slicevalue === selectvalue) {
            newValue.splice(index, 1);
            let scaleFilterValue = this.state.scaleFilterValue
            scaleFilterValue[index1].checked = false
            this.setState({ scaleFilterValue })
          }
        });
      } else if (event.target.checked === true) {
        newValue.push(selectvalue);
        let scaleFilterValue = this.state.scaleFilterValue
        scaleFilterValue[index1].checked = true
        this.setState({ scaleFilterValue })
      }
    }
    else {
      if (event.target.checked === false) {
        this.setState({ selectAll: false })
        let copyarray = newValue;
        copyarray.forEach((slicevalue, index) => {
          if (slicevalue === value.value) {
            newValue.splice(index, 1);
            let scaleFilterValue = this.state.scaleFilterValue
            scaleFilterValue[index1].checked = false
            this.setState({ scaleFilterValue })
          }
        });
      } else if (event.target.checked === true) {
        newValue.push(value.value);
        let scaleFilterValue = this.state.scaleFilterValue
        scaleFilterValue[index1].checked = true
        this.setState({ scaleFilterValue })
      }
    }
    this.setState(
      {
        text: newValue
      },
      () => {
        this.props.filterChangedCallback();
      }
    );
  }

  /* Used to select/unselect all the values in the filter value list. */
  selectAll(e) {
    let checked = [];
    let newValue = [];
    if (e.target.checked === true) {
      if (this.state.type === "reviewed") {
        this.state.scaleFilterValue.forEach(c => {
          checked.push({
            value: c.value,
            checked: true
          });

        });
        newValue = [0, 1]
      }
      else {
        this.state.scaleFilterValue.forEach(c => {
          checked.push({
            value: c.value,
            checked: true,
            selectAll: true
          });
          newValue.push(c.value)
        });
      }
      this.setState({
        scaleFilterValue: checked,
        text: newValue
      }, () => {
        this.props.filterChangedCallback()
      });

    }
    else if (e.target.checked === false) {

      this.state.scaleFilterValue.forEach(c => {
        checked.push({
          value: c.value,
          checked: false
        });
        // newValue.push("")
      })
      this.setState({
        scaleFilterValue: checked,
        text: [],
        selectAll: false
      }, () => {
        this.props.filterChangedCallback()
      });

    }


  }

  /* Unused function.*/
  Blank = (e) => {
    let checked = [];
    if (e.target.checked === true) {
      checked.push("");
      this.setState({
        text: checked
      })
    }
  }

  /* Used to compare the filter value with filter value list and return the new filter value list*/
  onChange = (e) => {

    let updatedList = this.state.initialItems;
    updatedList = updatedList.filter((i) => {
      return i.value.toString().toLowerCase().search(e.target.value.toLowerCase()) !== -1;
    })
    this.setState({
      scaleFilterValue: updatedList,
      search: e.target.value
    });
  }



  render() {
    this.state.selectAll = false
    // this.setState({ selectAll: false })
    if (this.state.text.length === this.state.scaleFilterValue.length) {
      this.setState({ selectAll: true })
    }

    return (

      <div className="scaleFilter" style={{ width: "200px" }}>
        <div className="Search" style={{ boxSizing: "border-box", margin: "2px 4px 0px 4px" }}>
          <input style={{ height: "30px", width: "100%" }}
            type="text"
            placeholder="Search"
            value={this.state.search}
            onChange={this.onChange} />
        </div>
        <div className="selectAll" style={{ borderBottom: "1px solid #BDC3C7" }}>
          <Checkbox
            checked={this.state.selectAll}
            onChange={e => this.selectAll(e)}
            color="primary"
            disabled={this.state.scaleFilterValue.length <= 0 ? true : false}
          />
          <span style={{ marginTop: "15px", }}>
            (SelectAll)
          </span>
        </div>

        <div className="fixed" style={{ height: "auto", maxHeight: "350px", overflowY: "auto" }}>
          {this.state.scaleFilterValue.map((scaleValue, index) => (
            <div className="list-cbox" >
              <div className="checkbox-render" style={{ display: "inline-flex" }}>

                <Checkbox
                  ref="input"

                  checked={scaleValue.checked}
                  onChange={e => this.ScaleChoiceFilter(scaleValue, e, index)}
                  color="primary"

                />
                <span style={{ marginTop: "15px", }}>
                  {scaleValue.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    );
  }
}