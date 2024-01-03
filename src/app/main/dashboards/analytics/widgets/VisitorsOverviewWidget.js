import { useSelector, useDispatch } from 'react-redux';
import { styled, useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';
import Paper from '@mui/material/Paper';
import {
  selectWidgets,
  setExportedData,
  setExportedSummaryInfo,
  getWidgets,
  getVariables,
  getMonthData,
} from '../store/widgetsSlice';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import SummaryInfo from '../../components/SummaryInfo';
import moment from 'moment-timezone';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import * as XLSX from 'xlsx';
import Alert from '@mui/material/Alert';

const Root = styled(Paper)(({ theme }) => ({
  //background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

function VisitorsOverviewWidget() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));
  //const widgets = useSelector(selectWidgets);
  const [series, setSeries] = useState([]);
  const [chartReady, setChartReady] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString()); //
  const [selectedMonth, setSelectedMonth] = useState('Todos'); // Para almacenar el mes seleccionado
  const [data, setData] = useState([]);
  const monthsOfYearRef = useRef([]);
  const monthsOfYear = monthsOfYearRef.current;
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1; // Año anterior

  // Opciones del select para el año actual y el año anterior
  const yearOptions = [
    /*  { value: currentYear, label: currentYear.toString() },
    { value: previousYear, label: previousYear.toString() }, */
    { value: 2023, label: '2023' },
  ];

  const [selectedMonthDays, setSelectedMonthDays] = useState([]);

  const chartOptions = {
    chart: {
      height: 300,
      type: 'area',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
        export: {
          csv: {
            filename: selectedMonth !== 'Todos' ? `Filtro: ${selectedYear} - ${selectedMonth}` : 'Todos los registros',
          },
        },
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },

    xaxis: {
      categories:
        selectedMonth === 'Todos' ? ['may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] : selectedMonthDays,
    },
    title: {
      text: 'Ventas',
      align: 'left',
      margin: 30,
      offsetY: -10,
      style: {
        fontSize: '18px',
        color: 'black',
        fontWeight: 'normal',
      },
    },
    subtitle: {
      text: selectedMonth !== 'Todos' ? `Filtro: ${selectedYear} - ${selectedMonth}` : '',
      align: 'left',
      style: {
        fontSize: '14px',
        color: 'gray',
        fontWeight: 'normal',
      },
    },
  };

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  //genera los meses en el select
  const generateMonths = (selectedYear) => {
    const months = [];
    if (selectedYear == currentYear) {
      // Para el año actual, muestra solo los meses hasta el mes actual
      const currentMonth = new Date().getMonth();
      for (let i = 0; i <= currentMonth; i++) {
        months.push(monthNames[i]);
      }
    } else {
      // Para otros años, muestra todos los meses (12 meses)
      for (let i = 0; i <= 11; i++) {
        months.push(monthNames[i]);
      }
    }
    monthsOfYearRef.current = ['Todos', ...months];
  };

  const [selectedChannel, setSelectedChannel] = useState('0');
  const [selectedGec, setSelectedGec] = useState('0');
  const [gecs, setGecs] = useState([]);

  const [openAlert, setAlert] = useState({
    msg: '',
    alert: '',
  });

  const handleSelectChannel = (value) => {
    setSelectedChannel(value);

    // Encuentra el objeto de canal correspondiente al valor seleccionado
    const channel = channels.find((item) => item.canal.toLowerCase() === value);
    const gecList = channel ? channel.gec : [];
    setGecs(gecList);
  };

  const [channels, setChannels] = useState([]);

  const channelOptions = channels.map((channel) => {
    return { label: channel.canal, value: channel.canal.toLowerCase() };
  });

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
    });
  }, [dispatch]);

  useEffect(() => {
    generateMonths(selectedYear);
  }, []);


  // Define una función para manejar la actualización del estado con el valor filtrado
  const updateStateWithFilteredData = (filteredData) => {
    dispatch(setExportedData(filteredData));
  };

  useEffect(() => {
    if (selectedMonth === 'Todos') {
      ///datos anuales
      dispatch(getMonthData({ year: '2023' })).then((resp) => {
        console.log(resp);
        // dispatch(setExportedData(resp.payload.users.data));
        setData(resp.payload);
        setSeries([
          /*    { name: previousYear.toString(), data: historicalData, color: '#ffb45c' }, */
          { name: currentYear.toString(), data: resp.payload.panel?.map((item) => item.qty), color: '#ffb45c' },
        ]);
      });

      // updateStateWithFilteredData(data);
    } else {
      let queryParams = { year: 2023 }; // Asegurarse de ajustar el año correctamente

      // Si se selecciona un mes, añadir el mes a los parámetros de la consulta
      if (selectedMonth !== 'Todos') {
        const selectedMonthIndex = monthNames.findIndex((month) => month === selectedMonth);
        const monthNumber = selectedMonthIndex + 1;
        queryParams.month = monthNumber;
      }

      // Si se selecciona un canal, añadir el canal a los parámetros de la consulta
      if (selectedChannel !== '0') {
        queryParams.channel = selectedChannel.toUpperCase();
      }

      // Si se selecciona un gec, añadir el gec a los parámetros de la consulta
      if (selectedGec !== '0') {
        queryParams.group = selectedGec;
      }

      dispatch(getMonthData(queryParams)).then((res) => {
        try {
          setData(res.payload);
          setSeries([{ name: selectedMonth, data: res.payload.panel?.map((item) => item.qty) }]);

          const generateSelectedMonthDays = () => {
            const daysWithData = res.payload.panel.map((item) => item.day);
            setSelectedMonthDays(daysWithData);
          };
          generateSelectedMonthDays();
        } catch (error) {
          setAlert({
            msg: 'Se produjo un error al obtener los datos, limpie los filtros',
            alert: false,
          });
        }
      });


      //para exportar datos excel
      // Llama a la función de actualización del estado con los datos filtrados
      // updateStateWithFilteredData(filtered);
    }

    setChartReady(true);
  }, [selectedMonth, selectedChannel, selectedGec]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    setSelectedMonth('Todos');
    generateMonths(event.target.value);
  };

  const handleGecChange = (event) => {
    const selectedGec = event.target.value;
    setSelectedGec(selectedGec);
  };
  const handleCleanButton = () => {
    // setSelectedYear(new Date().getFullYear().toString());
    setSelectedMonth('Todos');
    setSelectedChannel('0');
    setSelectedGec('0');
    setAlert(true)
  };

  // const exportedData = widgets.exportedData;
  //const exportedSummaryInfo = widgets.exportedSummaryInfo;

  const handleExportData = () => {
    const workbook = XLSX.utils.book_new();
    const sheets = [
      {
        name: 'Ventas',
        data: exportedData,
      },
      {
        name: 'Resumen',
        data: [
          {
            total: exportedSummaryInfo.total,
            clientes_compra: exportedSummaryInfo.clientes_compra,
            efectidad: exportedSummaryInfo.efectidad,
            cobertura: exportedSummaryInfo.cobertura,
            compra_promedio_drop: exportedSummaryInfo.compra_promedio.drop,
            compra_promedio_ref: exportedSummaryInfo.compra_promedio.ref,
            compra_promedio_frec: exportedSummaryInfo.compra_promedio.frec,
          },
        ],
      },
    ];

    sheets.forEach((sheet) => {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    // Guardar el archivo
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'data.xlsx');
  };
  return (
    <>
      <div
        className="flex flex-row mb-20"
        style={{ backgroundColor: 'white', justifyContent: 'space-between', borderRadius: '10px' }}>
        <div className="flex flex-row items-center">
          <Box sx={{ m: 1, minWidth: 150 }} size="small" className=" flex flex-row items-center">
            <InputLabel id="select-label" className="mr-10">
              Seleccionar Filtro:
            </InputLabel>
            <Select value={selectedYear} onChange={handleYearChange} color="secondary" size="small">
              {yearOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ m: 1, minWidth: 90 }} size="small" className=" flex flex-row items-center">
            <Select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              color="secondary"
              size="small">
              {monthsOfYear.map((month) => (
                <MenuItem key={month} value={month}>
                  {month}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ m: 1, minWidth: 100 }} size="small" className=" flex flex-row items-center">
            <Select

              sx={{ maxWidth: '100%', width: '100%' }}
              value={selectedChannel}
              onChange={(event) => handleSelectChannel(event.target.value)}
              color="secondary"
              size="small">
              <MenuItem value="0">Canal</MenuItem>
              {channelOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ m: 1, minWidth: 100 }} size="small" className=" flex flex-row items-center">
            <Select
              sx={{ maxWidth: '100%', width: 150 }}
              value={selectedGec}
              onChange={(event) => handleGecChange(event)}
              color="secondary"
              size="small">
              <MenuItem value="0">Gec</MenuItem>

              {gecs.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box size="small" className=" flex flex-row items-center">
            <IconButton aria-label="delete" onClick={handleCleanButton}>
              <FilterAltOffIcon />
            </IconButton>
          </Box>
        </div>

        {/*   <div className="flex flex-row items-center justify-end mr-10">
          <Box size="small" className="flex flex-row items-center justify-end">
            <Button
              onClick={() => handleExportData()}
              className="custom-button"
              variant="contained"
              color="secondary"
              startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}>
              Exportar
            </Button>
          </Box>
        </div> */}
      </div>
      {openAlert.alert === false ? <Alert severity="error">{openAlert.msg}</Alert> : null}
      <Root className="flex flex-row flex-auto shadow rounded-2xl overflow-hidden">
        <div style={{ flex: 1 }}>
          <div className="flex flex-col flex-auto h-320 mt-20" style={{ color: 'black' }}>
            {chartReady && series.length > 0 ? (
              <ReactApexChart
                options={chartOptions}
                series={series}
                type={chartOptions.chart.type}
                height={chartOptions.chart.height}
              />
            ) : (
              <div>Loading chart...</div>
            )}
          </div>
        </div>
        <SummaryInfo summaryInfoData={data} />
      </Root>
    </>
  );
}

export default VisitorsOverviewWidget;
