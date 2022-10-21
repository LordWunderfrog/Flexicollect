/**
 * 
 * PieChart component.
 * 
 * This component is used to render the piechart.
 * 
 */
import React from "react";
import "./Charts.css";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "components/Card/CardHeader.jsx";
import CardContent from "@material-ui/core/CardContent";

import { Pie } from "react-chartjs-2";

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

class Peichart extends React.Component {
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

    this.piedata = {
      datasets: [
        {
          label: "Overall Project State",
          backgroundColor: [
            this.chartColors.red,
            this.chartColors.orange,
            this.chartColors.green,
            this.chartColors.blue
          ],
          data: this.props.data
        }
      ],
      labels: ["Head & Shoulders", "Lux", "Colgate", "Tresemme"]
    };

    this.pieoptions = {
      responsive: true,
      plugins: {
        datalabels: {
          display: false
        }
      },
      maintainAspectRatio: true,
      legend: {
        position: "bottom"
      },
      title: {
        display: false
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
            <Pie width={270} data={this.piedata} options={this.pieoptions} />
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Peichart);
