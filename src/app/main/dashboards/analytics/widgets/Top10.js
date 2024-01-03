import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { selectWidgets } from "../store/widgetsSlice";

function Top10(props) {
  // const widgets = useSelector(selectWidgets);
  const { top10Chart, nameSerie, title } = props;
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const [categories, setCategories] = useState();
  const [serie, setSerie] = useState();

  useEffect(() => {
    // Formatear los datos para ApexCharts
    const categories = [];
    const data = [];
    top10Chart.list.forEach((item) => {
      if (item.hasOwnProperty("sku")) {
        categories.push(item.sku);
        data.push(Number(item.pedidos));
      } else {
        if (item.cliente) {
          categories.push(item.cliente);
        } else {
          categories.push(item.nombre);
        }
        if (item.compra !== undefined) {
          data.push(Number(item.compra));
        } else if (item.puntos !== undefined) {
          data.push(Number(item.puntos));
        } else if (item.canjes !== undefined) {
          data.push(Number(item.canjes));
        } else if (item.sku !== undefined) {
          data.push(Number(item.sku));
        } else if (item.cantidad !== undefined) {
          data.push(Number(item.cantidad));
        }
      }
    });
    setSerie(data);
    setCategories(categories);
  }, []);

  const chartOptions = {
    series: [
      {
        name: nameSerie,
        data: serie,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      //stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
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
    /*  yaxis: {
      title: {
        text: "usuarios",
      },
    }, */
    fill: {
      opacity: 1,
    },
    title: {
      text: title,
      align: "left",
      margin: 30,
      offsetY: -10,
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
        {/*    <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          Top 10
        </Typography> */}
      </div>

      <div className="flex flex-col flex-auto h-360">
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          series={chartOptions.series}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </Paper>
  );
}

export default memo(Top10);
