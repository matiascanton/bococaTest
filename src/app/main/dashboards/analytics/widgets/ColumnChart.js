import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { selectWidgets } from "../store/widgetsSlice";

function ColumnChart(props) {
 
  const{dataChart, categories, title, stacked, title_y} = props
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: stacked,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories:categories,
    },
    yaxis: {
      title: {
        text: title_y,
      },
    },
    fill: {
      opacity: 1,
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: '18px',
        color: 'black', 
        fontWeight: 'normal'
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
     {/*  <div className="flex flex-col sm:flex-row items-start justify-between">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          {title}
        </Typography>
      </div> */}

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

export default memo(ColumnChart);