import Paper from "@mui/material/Paper";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";

function ColumnChart(props) {
  const { dataChart } = props;
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const [series, setSeries] = useState([]);
  const [categorias, setCategprias] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Mostrar Todos");
  const [categoriasDate, setCategoriasDate] = useState([]);

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
      categories: selectedOption === "Mostrar Todos" ? categorias : categoriasDate,
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
      text: "Tricampeon",
      align: "left",
      style: {
        fontSize: "18px",
        color: "black",
        fontWeight: "normal",
      },
    },
  };
  // Función para reagrupar los datos en competencias de a tres elementos y seleccionar el más reciente
  const agruparCompetencias = (data) => {
    const competencias = [];
    let grupo = [];
    data.forEach((item) => {
      grupo.push(item);
      if (item.nombre.includes("Semi")) {
        competencias.push(grupo);
        grupo = [];
      }
    });
    // Agregar el último grupo si quedó incompleto
    if (grupo.length > 0) {
      competencias.push(grupo);
    }
    return competencias;
  };

  const competenciasAgrupadas = agruparCompetencias(dataChart);
  const lastThreeElements = competenciasAgrupadas.slice(-3);

  let totalCategorias = 0;
  for (const lista of lastThreeElements) {
    for (const partido of lista) {
      // Suma los puntos en cada elemento
      totalCategorias += partido.puntos[0];
    }
  }

  //select
  // Mapeo de nombres completos de meses a abreviaturas
  const mesesAbreviados = {
    Enero: "Ene",
    Febrero: "Feb",
    Marzo: "Mar",
    Abril: "Abr",
    Mayo: "May",
    Junio: "Jun",
    Julio: "Jul",
    Agosto: "Ago",
    Septiembre: "Sep",
    Octubre: "Oct",
    Noviembre: "Nov",
    Diciembre: "Dic",
  };
  // Función para obtener todos los meses entre dos meses dados
  // Función para obtener todos los meses entre dos meses dados
  const obtenerMesesEntre = (startMonth, endMonth) => {
    const mesesAbreviadosInvertidos = Object.entries(mesesAbreviados).reduce((acc, [nombre, abreviatura]) => {
      acc[abreviatura] = nombre;
      return acc;
    }, {});

    const mesesOrdenados = Object.keys(mesesAbreviados);
    const startIndex = mesesOrdenados.indexOf(mesesAbreviadosInvertidos[startMonth]);
    const endIndex = mesesOrdenados.indexOf(mesesAbreviadosInvertidos[endMonth]);

    if (startIndex === -1 || endIndex === -1) {
      return [];
    }

    if (startIndex <= endIndex) {
      return mesesOrdenados.slice(startIndex, endIndex + 1);
    } else {
      const mesesEntreInicio = mesesOrdenados.slice(startIndex);
      const mesesEntreFin = mesesOrdenados.slice(0, endIndex + 1);
      return mesesEntreInicio.concat(mesesEntreFin);
    }
  };

  // Función para obtener las etiquetas de tiempo basadas en los meses presentes en los datos
  const obtenerEtiquetasDeTiempo = (data) => {
    const meses = data.flat().map((item) => item.nombre.split(" | ")[1].trim());
    return Array.from(new Set(meses)).map((mes) => mesesAbreviados[mes]);
  };

  // Función para obtener los puntos de los elementos filtrados
  const obtenerPuntos = (data) => {
    return data.map((item) => item.puntos[0]);
  };

  useEffect(() => {
    let serieData;
    let categoriaData;
    // Preparar los datos para el gráfico
    categoriaData = lastThreeElements.map((grupo) => {
      const primerMes = mesesAbreviados[grupo[0].nombre.split("|")[1].trim()];
      const ultimoMes = mesesAbreviados[grupo[grupo.length - 1].nombre.split("|")[1].trim()];
      return `${primerMes}-${ultimoMes}`;
    });
    categoriaData.unshift("todas las competencias");
    if (selectedOption === "Mostrar Todos") {
      serieData = lastThreeElements.map((grupo) => grupo.reduce((acumulador, item) => acumulador + item.puntos[0], 0));
    } else {
      // Filtrar los datos según la opción seleccionada
      const filteredData = lastThreeElements.flat().filter((item) => {
        const [startMonth, endMonth] = selectedOption.split("-");
        console.log(startMonth, endMonth);

        const itemMonth = item.nombre.split(" | ")[1].trim();
        const meses = obtenerMesesEntre(startMonth, endMonth);
        console.log(meses);
        return meses.includes(itemMonth);
      });
      console.log(filteredData);
      // Obtener las etiquetas y puntos para el gráfico ApexCharts
      serieData = obtenerPuntos(filteredData);
      let categoriasByDate = obtenerEtiquetasDeTiempo(filteredData);
      setCategoriasDate(categoriasByDate);
    }
    setCategprias(categoriaData);
    setSeries(serieData);
    setAwaitRender(false);
  }, [selectedOption]);

  // Agregar un cero al inicio de la serie "series"
  let chartSeries;
  if (selectedOption === "Mostrar Todos") {
    chartSeries = [
      {
        name: "Total de puntos",
        data: [totalCategorias],
      },
      {
        name: "Puntos cada competencia",
        data: [0, ...series],
      },
    ];
  } else {
    chartSeries = [
      {
        name: "Puntos",
        data: series,
      },
    ];
  }

  if (awaitRender) {
    return null;
  }
  // Crear un nuevo array de objetos - select
  const dateOptions = categorias.map((item) => ({
    label: item === "todas las competencias" ? "Mostrar Todos" : item,
    value: item === "todas las competencias" ? "Mostrar Todos" : item,
  }));

  const handleFilter = (value) => {
    setSelectedOption(value);
  };

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
      <div>
        <Box sx={{ m: 1, minWidth: 150 }} size="small" className=" flex flex-row justify-end items-center">
          <InputLabel id="select-label" className="mr-10">
            Seleccionar Fechas
          </InputLabel>
          <Select value={selectedOption} onChange={(event) => handleFilter(event.target.value)} color="secondary" size="small">
            {dateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </div>

      <div className="flex flex-col flex-auto h-360">
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          series={chartSeries}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </Paper>
  );
}

export default memo(ColumnChart);
