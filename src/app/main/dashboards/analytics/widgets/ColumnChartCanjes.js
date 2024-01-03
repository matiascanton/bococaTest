import Paper from "@mui/material/Paper";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import { useSelector } from "react-redux";
import { selectWidgets } from "../store/widgetsSlice";

function ColumnChart(props) {
  const widgets = useSelector(selectWidgets);
  const { dataChart, categories, title, stacked, title_y } = props;
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const { data, ranges } = widgets?.canjes_clientes ?? { data: [], ranges: {} };
  const [tabValue, setTabValue] = useState(0);
  const currentRange = Object.keys(ranges)[tabValue];
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
      categories: categories,
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
      align: "left",
      style: {
        fontSize: "18px",
        color: "black",
        fontWeight: "normal",
      },
    },
  };
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const filteredData = () => {
      if (currentRange === "mes") {
        // Filtrar los datos por el rango actual (mes en curso)
        return data.filter(
          (item) =>
            new Date(item.fecha).getFullYear() === new Date().getFullYear() &&
            new Date(item.fecha).getMonth() === new Date().getMonth()
        );
      } else if (currentRange === "histórico") {
        // Filtrar los datos por el rango histórico (meses anteriores del año en curso)
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        return data.filter(
          (item) =>
            new Date(item.fecha).getFullYear() === currentYear &&
            new Date(item.fecha).getMonth() < currentMonth
        );
      }
      return [];
    };

    const filteredCanjes = filteredData();
    let totalCanjes = 0;

    for (let i = 0; i < filteredCanjes.length; i++) {
      totalCanjes += filteredCanjes[i].canjes;
    }

    setSeries([
      {
        name: "Clientes que cajeraron",
        data: [filteredCanjes.length],
      },
      {
        name: "Canjes realizados",
        data: [totalCanjes],
      },
    ]);

    setAwaitRender(false);
  }, [series]);

  if (awaitRender) {
    return null;
  }
  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
      <div
        className="flex justify-end mt-10"
        style={{ backgroundColor: "white", height: 30, alignItems: "center" }}
      >
        <Tabs
          value={tabValue}
          onChange={(ev, value) => setTabValue(value)}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="-mx-4 min-h-40"
          classes={{
            indicator: "flex justify-center bg-transparent w-full h-full",
          }}
          TabIndicatorProps={{
            children: (
              <Box
                sx={{ bgcolor: "text.disabled" }}
                className="w-full h-full rounded-full opacity-20"
              />
            ),
          }}
          sx={{
            color: "black",
          }}
        >
          {Object.entries(ranges).map(([key, label]) => (
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              key={key}
              label={label}
            />
          ))}
        </Tabs>
        <div className="flex items-center justify-center"></div>
      </div>
      <div className="flex flex-col flex-auto h-360">
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          series={series}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </Paper>
  );
}

export default memo(ColumnChart);
