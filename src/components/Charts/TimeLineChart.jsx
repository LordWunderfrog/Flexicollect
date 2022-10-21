/**
 * 
 * TimeLineChart component.
 * 
 * This component is used to render the TimeLineChart.
 * 
 */
import React from "react";
import "./Charts.css";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "components/Card/CardHeader.jsx";

import { HorizontalBar } from "react-chartjs-2";

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

class TimeLineChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartColors = {
      red: "rgb(255, 99, 132)",
      orange: "rgb(255, 159, 64)",
      yellow: "rgb(255, 205, 86)",
      green: "rgb(75, 192, 192)",
      blue: "rgb(54, 162, 235)",
      purple: "rgb(153, 102, 255)",
      grey: "rgb(201, 203, 207)"
    };

    if (this.props.color === "blue") {
      this.color = [
        "rgba(54, 162, 235, 0.4)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(54, 162, 235, 0.7)",
        "rgba(54, 162, 235, 0.8)",
        "rgba(54, 162, 235, 1)"
      ];
    } else this.color = this.chartColors[this.props.color];

    this.horizontalbardata = {
      datasets: [
        {
          label: "Horizontalbardata",
          backgroundColor: this.color,
          data: this.props.data
        }
      ],
      labels: [
        "Project 6",
        "Project 5",
        "Project 4",
        "Project 3",
        "Project 2",
        "Project 1"
      ]
    };

    this.horizontalbaroptions = {
      responsive: true,
      plugins: { datalabels: { display: false } },
      maintainAspectRatio: true,
      legend: { display: false },
      title: { display: false },
      scales: {
        xAxes: [{ position: "bottom", ticks: { fontSize: 11 } }],
        yAxes: [
          {
            position: "left",
            ticks: { fontSize: 10 },
            gridLines: { display: false }
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
            style={{ fontSize: "1rem", marginTop: "-0.2rem", color: "#fff" }}
          >
            {this.props.title}
          </h5>
        </CardHeader>
        <CardContent style={{ paddingBottom: "0" }}>
          <div className="chart-adjust">
            <HorizontalBar
              width={270}
              data={this.horizontalbardata}
              options={this.horizontalbaroptions}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(TimeLineChart);
