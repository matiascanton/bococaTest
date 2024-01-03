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

function ColumnChartMisionesParticipantes(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const { data, ranges } = widgets?.misiones_participantesCompletaron ?? {
    data: [],
    ranges: {},
  };
  const [tabValue, setTabValue] = useState(0);
  const currentRange = Object.keys(ranges)[tabValue];
  const [series, setSeries] = useState([]);

  const [selectedChannel, setSelectedChannel] = useState("Mostrar Todos");

  // Obtener todos los canales y GEC únicos
  var canalesUnicos = [...new Set(data.map((item) => item.canal))];
  canalesUnicos.unshift("clientes completaron");
  // Obtener la fecha y hora actual en la zona horaria de Buenos Aires
  const currentDate = moment().tz("America/Argentina/Buenos_Aires");

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
      customLegendItems: selectedChannel === "Mostrar Todos" ? ["completaron", "canales"] : [],
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
      text: "Clientes que completaron",
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
      let dataByDate;
      if (currentRange === "mes") {
        // Get the start and end of the selected month in the timezone of Buenos Aires
        const startOfMonth = currentDate.clone().startOf("month");
        const endOfMonth = currentDate.clone().endOf("month");

        // Filter the data to include only entries for the selected month
        dataByDate = data.filter((item) => {
          const fecha = moment(item.fecha).tz("America/Argentina/Buenos_Aires");
          return fecha >= startOfMonth && fecha <= endOfMonth;
        });
      } else if (currentRange === "histórico") {
        dataByDate = data;
      }
      return dataByDate;
    };
    // Obtener los arreglos de usuarios activos y no activos
    const dataByDate = filteredData();

    const cantCompeltaron = dataByDate.reduce((total, item) => {
      if (item.cantidad) {
        return total + item.cantidad;
      } else {
        return total;
      }
    }, 0);

    //gecs
    //mostrar en pnatalla una vez selecionado el canal, la info de los gec
    const filteredDataByChannel = selectedChannel !== "Mostrar Todos" ? dataByDate.filter((entry) => entry.canal === selectedChannel) : dataByDate;

    // Agrupar los datos por GEC y contar todos los usuarios utilizando un ciclo for
    const gecData = filteredDataByChannel.reduce((acc, item) => {
      const { gec, cantidad } = item;
      if (!acc[gec]) {
        acc[gec] = 0;
      }
      acc[gec] += cantidad;
      return acc;
    }, {});

    // Preparar los datos para el gráfico de columnas
    const gecSeries = gecsUnicos.map((gec) => {
      const index = gecData[gec] ? gecsUnicos.indexOf(gec) : -1;
      const dataPoints = Array(gecsUnicos.length).fill(0);
      if (index !== -1) {
        dataPoints[index] = gecData[gec];
      }
      return {
        name: gec,
        data: dataPoints,
        color: "#e43c07",
      };
    });

    //canales
    // Agrupar los datos por canal y contar todos los usuarios utilizando un ciclo for
    const channelsData = dataByDate.reduce((acc, item) => {
      const { canal, cantidad } = item;
      if (!acc[canal]) {
        acc[canal] = 0;
      }
      acc[canal] += cantidad; // Update to use the 'cantidad' property
      return acc;
    }, {});

    // Preparar los datos para el gráfico de columnas
    const channelsSeries = canalesUnicos.map((canal) => {
      const index = channelsData[canal] ? canalesUnicos.indexOf(canal) : -1;
      const dataPoints = Array(canalesUnicos.length).fill(0);
      if (index !== -1) {
        dataPoints[index] = channelsData[canal];
      }
      return {
        name: canal,
        data: dataPoints,
        color: "#e43c07", // Asignar el color correspondiente al canal
      };
    });

    if (selectedChannel === "Mostrar Todos") {
      setSeries([
        { name: "Completaron", data: [cantCompeltaron], color: "#81bda4" },
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

export default memo(ColumnChartMisionesParticipantes);
