import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { selectWidgets } from "../store/widgetsSlice";

function PieChart(props) {
  const { dataChart, labels, title } = props;
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();

  const chartOptions = {
    chart: {
      type: "pie",
      height: 350,
      toolbar: {
        show: true,
      },
    },
    dataLabels: {
      style: {
        fontSize: "18px",
      },
    },
    labels: labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    title: {
      text: title,
      align: "left",
      style: {
        fontSize: "18px",
        color: "black",
        fontWeight: "normal",
      },
    },
  };

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  if (awaitRender) {
    return null;
  }
  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
      <div className="flex flex-col sm:flex-row items-start justify-between">
        {/*   <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
        {title}
        </Typography> */}
      </div>

      <div className="flex flex-col flex-auto h-360">
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          series={dataChart.series}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </Paper>
  );
}

export default memo(PieChart);
