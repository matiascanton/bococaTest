import React, { memo, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ReactApexChart from "react-apexcharts";
import { getVariables, getBrands, getProducts, setExportedData } from "../store/widgetsSlice";
import { selectWidgets } from "../store/widgetsSlice";
import { useSelector, useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import TableList from "../../components/TableList";
import { Button, Typography } from "@mui/material";

function ColumnChartUsers() {
  const widgets = useSelector(selectWidgets);
  const exportedData = widgets.exportedData;
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const [selectedBrand, setSelectedBrand] = useState("0");
  const [selectedProduct, setSelectedProduct] = useState("0");
  const dispatch = useDispatch();
  const [brands, setbrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [series, setSeries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [isButtonDisabledFilter, setIsButtonDisabledFilter] = useState(true);
  const [originalExportData, setOriginalExportData] = useState("");

 

  const handleBrandChange = async (event) => {
    const selectedBrand = event.target.value;
    const selectedAdditionalValue = brands.find((brand) => brand.brand.toLowerCase() === selectedBrand);
    setSelectedBrand(selectedBrand);
    const products = await dispatch(getProducts(selectedAdditionalValue.id));
    setProducts(products.payload);
    setIsButtonDisabledFilter(false);
  };
  
  const handleFilter = () => {
    setOriginalExportData(exportedData);
    const filtered = exportedData.filter(
      (entry) => entry.sku === selectedProduct 
    );
    dispatch(setExportedData(filtered));
    setFilteredData(filtered);

    setShowEmptyMessage(filtered.length === 0 && selectedProduct !== "");
    // Esperar y ocultar el mensaje vacío
    setTimeout(() => {
      setShowEmptyMessage(false);
    }, 2000);
  };

  const handleCleanButton = () => {
    setSelectedBrand("0");
    setSelectedProduct("0");
    setFilteredData([]);
    setShowEmptyMessage(false);
    setIsButtonDisabledFilter(true);
    setProducts([]);
    dispatch(setExportedData(originalExportData));
  };

  const chartData = {
    series: [
      {
        name: "Usuarios",
        data: series,
        color: "#ffb45c" 
      },
    ],
  };

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnmaxWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      maxWidth: 2,
      colors: ["transparent"],
    },
    xaxis: {
      // categories: selectedChannel === 'Seleccione un canal' ? uniqueCategories : uniqueGecs.map((gec) => `${gec}`),
    },
    yaxis: {
      title: {
        //   text: title_y,
      },
    },
    fill: {
      opacity: 1,
    },
    title: {
      text: "titulo",
      align: "left",
      margin: 30,
      offsetY: -10,
      style: {
        fontSize: "18px",
        color: "black",
        fontWeight: "normal",
      },
    },
    subtitle: {
      text: "subtitulo",
      align: "left",
      style: {
        fontSize: "14px",
        color: "gray",
        fontWeight: "normal",
      },
    },
  };

  const brandsOptions = brands.map((brands) => {
    return { label: brands.brand, value: brands.brand.toLowerCase(), id: brands.id };
  });

  useEffect(() => {
    dispatch(getBrands()).then((res) => {
      setbrands(res.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  useEffect(() => {
    const seriesData = filteredData.map((item) => ({
      x: item.fecha,
      y: item.usuarios,
    }));
    setSeries(seriesData);
    if (filteredData.length < 21 && filteredData.length > 0) {
      setShowChart(true);
    } else {
      setShowChart(false);
    }
  }, [filteredData]);

  if (awaitRender) {
    return null;
  }
 

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
      <Typography className="mb-20 text-18">Generador de informes</Typography>
      <Grid container spacing={2} alignItems="center">
      

        <Grid item xs={5} sx={{ textAlign: "center" }}>
          <Select
            sx={{ maxWidth: "100%", width: 250 }}
            value={selectedBrand}
            onChange={(event) => handleBrandChange(event)}
            color="secondary"
            size="small"
          >
            <MenuItem value="0">Marca</MenuItem>
            {brandsOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={5} sx={{ textAlign: "center" }}>
          <Select
            sx={{ maxWidth: "100%", width: 150, width: 250 }}
            value={selectedProduct}
            onChange={(event) => setSelectedProduct(event.target.value)}
            color="secondary"
            size="small"
          >
            <MenuItem value="0">Producto</MenuItem>
            {products.map((option) => (
              <MenuItem key={option.sku} value={option.sku}>
                {option.description}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={1} container justifyContent={"right"}>
          <Button className="custom-button" variant="contained" color="secondary" onClick={handleFilter} disabled={isButtonDisabledFilter}>
            Filtrar
          </Button>
        </Grid>
        <Grid item xs={1} container justifyContent={"right"}>
          <Button className="custom-button" variant="contained" color="secondary" onClick={handleCleanButton} disabled={isButtonDisabledFilter}>
            Limpiar
          </Button>
        </Grid>
      </Grid>

      <TableList exportedData={filteredData} showEmptyMessage={showEmptyMessage} />
      {showChart && (
        <div className="flex flex-col flex-auto h-360 mt-24">
          <ReactApexChart
            className="flex flex-auto items-center justify-center w-full h-full"
            options={chartOptions}
            series={chartData.series}
            type={chartOptions.chart.type}
            height={chartOptions.chart.height}
          />
        </div>
      )}
    </Paper>
  );
}

export default memo(ColumnChartUsers);
