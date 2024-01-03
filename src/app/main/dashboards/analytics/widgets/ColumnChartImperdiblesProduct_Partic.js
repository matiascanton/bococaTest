import React, { memo, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { useSelector, useDispatch } from "react-redux";
import { selectWidgets, getVariables } from "../store/widgetsSlice";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import moment from "moment-timezone";

function ColumnChartImperdiblsParticipantes(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const { data, ranges } = widgets?.imperdibles_volumenTotalvsAlcanzado ?? {
    data: [],
    ranges: {},
  };
  const [tabValue, setTabValue] = useState(0);
  const currentRange = Object.keys(ranges)[tabValue];
  const [series, setSeries] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("Mostrar Todos");

  // Obtener todos los canales y GEC únicos
  var canalesUnicos = [...new Set(data.map((item) => item.canal))];
  canalesUnicos.unshift("promedio de participantes");
  canalesUnicos.unshift("total de imperdibles");

  const [channels, setChannels] = useState([]);

  const channelOptions = channels.map((channel) => {
    return { label: channel.canal, value: channel.canal.toLowerCase() };
  });

  // Add an option to show all channels
  channelOptions.unshift({ label: "Mostrar Todos", value: "Mostrar Todos" });

  // Obtain the unique GECs from the channelsData state
  const currentChannelData = channels.find((channel) => channel.canal.toLowerCase() === selectedChannel);
  const gecsUpper = currentChannelData ? currentChannelData.gec : [];

  // Convert the items in the gecsUnicos array to lowercase
  const gecsUnicos = gecsUpper.map((gec) => gec.toLowerCase());

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
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
      categories: selectedChannel === "Mostrar Todos" ? canalesUnicos : gecsUnicos,
      canalesUnicos,
    },
    legend: {
      customLegendItems: selectedChannel === "Mostrar Todos" ? ["total de imperdibles", "promedio de participantes", "canales"] : [],
      show: selectedChannel === "Mostrar Todos",
    },
    yaxis: {
      title: {
        text: "Cantidad",
      },
    },
    fill: {
      opacity: 1,
    },
    title: {
      text: "Volumen Total vs Promedio alcanzado",
      align: "left",
      style: {
        fontSize: "18px",
        color: "black",
        fontWeight: "normal",
      },
    },
    subtitle: {
      text:
        selectedChannel === "Mostrar Todos"
          ? `${currentRange === "histórico" ? "Anual" : "Mensual"}`
          : `Gecs en el Canal ${selectedChannel} (${currentRange === "histórico" ? "Anual" : "Mensual"})`,
      align: "left",
      style: {
        fontSize: "14px",
        color: "gray",
        fontWeight: "normal",
      },
    },
  };

  const handleFilter = (value) => {
    setSelectedChannel(value);
  };

 
  useEffect(() => {
    //para select y obtener gec unicos
    dispatch(getVariables()).then((res) => {
         // Filtrar el objeto con el canal "TODOS" antes de guardar los canales únicos en el estado
    const filteredChannels = res.payload.channels.filter((channel) => channel.canal !== "TODOS");
    setChannels(filteredChannels);

    });
  }, [dispatch]);

  useEffect(() => {
    const filteredData = () => {
      if (currentRange === "mes") {
        // Get the current date in the timezone of Buenos Aires
        const currentDate = moment.tz("America/Argentina/Buenos_Aires");

        // Get the current year and month
        const currentYear = currentDate.year();
        const currentMonth = currentDate.month() + 1; // Month index is 0-based, so we add 1 to get the actual month number

        // Filter the data to include only entries for the selected month
        return data.filter((item) => item.year === currentYear && item.month === currentMonth);
      } else if (currentRange === "histórico") {
        return data;
      }
    };

    // Obtener los arreglos de usuarios activos y no activos
    const dataByDate = filteredData();

    //para calcular la suma de la cantidad de productos
    const sumaProductos = data.reduce((accumulator, item) => {
      return accumulator + item.productos.length;
    }, 0);

    // Calculate the average quantity
    const totalQuantity = dataByDate.reduce((sum, obj) => {
      const quantities = Object.values(obj.gec).map((item) => item.cantidad);
      return sum + quantities.reduce((total, val) => total + val, 0);
    }, 0);

    const averageParticipants = (totalQuantity / dataByDate.length).toFixed(2);

    //gecs
    //mostrar en pnatalla una vez selecionado el canal, la info de los gec
    const filteredDataByChannel = selectedChannel !== "Mostrar Todos" ? dataByDate.filter((entry) => entry.canal === selectedChannel) : dataByDate;

    // Step 1: Extract and count users for each GEC
    const gecData = filteredDataByChannel.reduce((acc, item) => {
      const gecKeys = Object.keys(item.gec);
      gecKeys.forEach((gecKey) => {
        const { cantidad } = item.gec[gecKey];
        if (!acc[gecKey]) {
          acc[gecKey] = 0;
        }
        acc[gecKey] += cantidad;
      });
      return acc;
    }, {});

    // Step 3: Prepare data for the column chart
    const gecSeries = gecsUnicos.map((gec) => {
      const dataPoints = gecsUnicos.map((gecKey) => (gecKey === gec ? (gecData[gec] ? gecData[gec] : 0) : 0));
      return {
        name: gec,
        data: dataPoints,
        color: "#e43c07",
      };
    });

    //canal
    // Agrupar los datos por canal y sumar las cantidades de cada mes
    const channelsData = dataByDate.reduce((acc, item) => {
      const { canal, gec } = item;
      const totalCantidad = Object.values(gec).reduce((sum, product) => sum + product.cantidad, 0);

      if (!acc[canal]) {
        acc[canal] = 0;
      }
      acc[canal] += totalCantidad;
      return acc;
    }, {});

    // Preparar los datos para el gráfico de columnas
    const channelsSeries = canalesUnicos.map((canal) => {
      //  const index = canalesUnicos.indexOf(canal);
      const dataPoints = canalesUnicos.map((c) => (c === canal ? channelsData[c] : 0));

      return {
        name: canal,
        data: dataPoints,
        color: "#e43c07", // Asignar el color correspondiente al canal
      };
    });

    if (selectedChannel === "Mostrar Todos") {
      setSeries([
        { name: "sumaProductos", data: [sumaProductos], color: "#81bda4" },
        { name: "promedioPaticipantes", data: [0, averageParticipants], color: "#4ed4e1" },
        ...channelsSeries.map((c) => {
          return { name: c.name, data: c.data, color: c.color };
        }),
      ]);
    } else {
      setSeries(gecSeries);
    }
    setAwaitRender(false);
  }, [currentRange, data, selectedChannel]);

  if (awaitRender) {
    return null;
  }

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
      <div className="flex justify-end mt-10" style={{ backgroundColor: "white", height: 30, alignItems: "center" }}>
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
            children: <Box sx={{ bgcolor: "text.disabled" }} className="w-full h-full rounded-full opacity-20" />,
          }}
          sx={{
            color: "black",
          }}
        >
          {Object.entries(ranges).map(([key, label]) => (
            <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12" disableRipple key={key} label={label} />
          ))}
        </Tabs>
        <div>
          <Box sx={{ m: 1, minWidth: 150 }} size="small" className=" flex flex-row justify-end items-center">
            <InputLabel id="select-label" className="mr-10">
              Seleccionar Canal
            </InputLabel>
            <Select value={selectedChannel} onChange={(event) => handleFilter(event.target.value)} color="secondary" size="small">
              {channelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </div>
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

export default memo(ColumnChartImperdiblsParticipantes);
