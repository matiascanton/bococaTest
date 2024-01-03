import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useDispatch, useSelector } from "react-redux";
import { getWidgets, selectWidgets } from "./store/widgetsSlice";
import { useEffect, useState } from "react";

function AnalyticsDashboardAppHeader(props) {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  const convertDataToExcel = (data) => {
    const workbook = XLSX.utils.book_new();

    const sheets = [
      {
        name: "Active Users",
        type: "list",
        data: data.activeUsers.data,
      },
      {
        name: "Users",
        type: "list",
        data: data.users.data,
      },
      { name: "Top 10 Buyers", type: "list", data: data.top10Buyers.list },
      { name: "Top 10 Points", type: "list", data: data.top10Points.list },
      { name: "Top 10 Canjes", type: "list", data: data.top10Canjes.list },
      { name: "Top 10 SKU", type: "list", data: data.top10SKU.list },
      {
        name: "Participantes Imperdibles",
        type: "list",
        data: data.imperdibles_participantes.data,
      },
      {
        name: "Imperdibles Participantes Compl",
        type: "list",
        data: data.imperdibles_participantesCompletaron.data,
      },
      {
        name: "Imperd Vol Total vs Alcanzado",
        type: "list",
        data: data.imperdibles_volumenTotalvsAlcanzado.data.map(entry => {
          const gecData = entry.gec;
          const rowData = {
            month: entry.month,
            year: entry.year,
            canal: entry.canal,
            objetivo: entry.objetivo,
            puntos: entry.puntos,
            productos: entry.productos.join(", "),
          };
  
          for (const gecType in gecData) {
            if (gecData.hasOwnProperty(gecType)) {
              const gecValue = gecData[gecType];
              for (const prop in gecValue) {
                if (gecValue.hasOwnProperty(prop)) {
                  rowData[`${gecType}`] = gecValue[prop];
                }
              }
            }
          }
  
          return rowData;
        }),
      },
      {
        name: "Participantes Misiones",
        type: "list",
        data: data.misiones_participantes.data,
      },
      {
        name: "Misiones Participantes Compl",
        type: "list",
        data: data.misiones_participantesCompletaron.data,
      },
      {
        name: "Misiones Vol Total vs Alcanzado",
        type: "list",
        data: data.misiones_volumenTotalvsAlcanzado.data.map(entry => {
          const gecData = entry.gec;
          const rowData = {
            month: entry.month,
            year: entry.year,
            canal: entry.canal,
            objetivo: entry.objetivo,
            puntos: entry.puntos,
            productos: entry.productos.join(", "),
          };
  
          for (const gecType in gecData) {
            if (gecData.hasOwnProperty(gecType)) {
              const gecValue = gecData[gecType];
              for (const prop in gecValue) {
                if (gecValue.hasOwnProperty(prop)) {
                  rowData[`${gecType}`] = gecValue[prop];
                }
              }
            }
          }
  
          return rowData;
        }),
      },
        
      {
        name: "Productos canjeados",
        type: "list",
        data: data.productos_canjeados.list,
      },
      {
        name: "Canjes",
        type: "list",
        data:data.canjes_clientes.data
      },
    ];

    sheets.forEach((sheet) => {
      const worksheet = XLSX.utils.json_to_sheet(sheet.data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    });

    // Guardar el archivo
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "data.xlsx");
  };

  return (
    <div className="flex w-full container">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
        <div className="flex flex-col flex-auto mb-20">
          <Typography className="text-24 md:text-32 font-extrabold tracking-tight">
            Dashboard
          </Typography>
          {/*   <Typography className="font-medium tracking-tight" color="text.secondary">
            Monitor metrics, check reports and review performance
          </Typography> */}
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          {/*  <Button
            className="whitespace-nowrap"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            Settings
          </Button> */}
        {/*   <Button
            onClick={() => convertDataToExcel(widgets)}
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={
              <FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>
            }
          >
            Exportar
          </Button> */}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboardAppHeader;
