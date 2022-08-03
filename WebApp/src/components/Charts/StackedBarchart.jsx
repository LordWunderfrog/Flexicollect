
/**
 * 
 * StackedBarchart component.
 * 
 * This component is used to render the StackedBarchart.
 * 
 */
import React from "react";
import "./Charts.css";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "components/Card/CardHeader.jsx";

import { Bar } from "react-chartjs-2";

const styles = {
  card: {
    minWidth: 180,
    height: "94%",
    marginTop: "4%"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

class StackedBarchart extends React.Component {
  constructor(props) {
    super(props);
    this.chartColors = {
      red: "rgb(255, 99, 132)",
      orange: "rgb(255, 159, 64)",
      yellow: "rgb(255, 205, 86)",
      green: "rgb(75, 192, 192)",
      blue: "rgb(54, 162, 235)",
      purple: "rgb(153, 102, 255)",
      grey: "rgb(201, 203, 207)",
      darkgrey: "rgb(158, 158, 158)"
    };

    this.stackedbardata = {
      datasets: [
        {
          label: "Draft",
          backgroundColor: this.chartColors.blue,
          data: this.props.data.datasetOne
        },
        {
          label: "In-Progress",
          backgroundColor: this.chartColors.orange,
          data: this.props.data.datasetTwo
        },
        {
          label: "Completed",
          backgroundColor: this.chartColors.darkgrey,
          data: this.props.data.datasetThree
        }
      ],
      labels: ["H&S", "Lux", "Colgate", "Tresemme"]
    };

    this.stackedoptions = {
      responsive: true,
      plugins: {
        datalabels: { display: true, color: "white", font: { weight: "bold" } }
      },
      maintainAspectRatio: true,
      legend: { position: "bottom" },
      title: { display: false },
      tooltips: { mode: "index", intersect: false },
      scales: {
        xAxes: [
          {
            stacked: true,
            position: "bottom",
            ticks: { fontSize: 9 },
            gridLines: { display: false }
          }
        ],
        yAxes: [
          {
            stacked: true,
            position: "left",
            ticks: { display: false },
            gridLines: { display: false, drawBorder: false }
          }
        ]
      }
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardHeader
          color="info"
          style={{ position: "absolute", height: "40px", marginTop: "-17px" }}
        >
          <h5
            className={classes.cardTitleWhite}
            style={{ fontSize: "1rem", marginTop: "-0.2rem" }}
          >
            {this.props.title}
          </h5>
        </CardHeader>
        <CardContent style={{ paddingBottom: "0" }}>
          <div className="chart-adjust">
            <Bar
              width={270}
              data={this.stackedbardata}
              options={this.stackedoptions}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(StackedBarchart);
