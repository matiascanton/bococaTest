import { useState, useEffect } from "react";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  selectClientsSearchText,
  setClientsSearchText,
} from "./store/clientsSlice";
import { getActiveClients } from "./store/clientSlice";
import { Button } from "@mui/material";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Tooltip } from "@mui/material";


function ClientsHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectClientsSearchText);
  const [clientList, setClientList] = useState([])
  let lista = []

  const downloadClients = async (currentPage = 0) => {
    const resp = await dispatch(getActiveClients(currentPage));

    if (resp.payload.length > 0) {
      lista = lista.concat(resp.payload)
      console.log('resp.payloadresp.payload', resp.payload);
      //setClientList([...clientList, ...resp.payload]);
      await downloadClients(currentPage + 1);
    } else {
      if (lista.length > 0)
        exportarExcel(lista)
    }
    console.log('clientListclientListclientListclientList', lista)
  };

  useEffect(() => {
    console.log('test', clientList)
  }, [clientList])


  const exportarExcel = (lista) => {
    console.log('clientList', lista)
    let nombreArchivo = 'Clientes Registrados'
    const header = ['ID', 'Nombre'];
    const dataArray = [header, ...lista.map((item, index) => [item.id, item.business_name])];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreArchivo);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, nombreArchivo + '.xlsx');
  }
  const buttonStyle = {
    color: 'black', // Establece el color del texto en negro
    borderColor: 'red', // Color del borde (opcional, puedes personalizarlo)
  };

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight"
      >
        Clientes
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">

        <Paper
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center w-full sm:max-w-256 space-x-6 px-12 rounded-full border-1 shadow-0"
        >
          <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

          <Input
            placeholder="Búsqueda por nro. de Cliente"
            className="flex flex-1"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              "aria-label": "Search",
            }}
            onChange={(ev) => dispatch(setClientsSearchText(ev))}
          />
        </Paper>
        <Tooltip title="Descargar Clientes Registrados">
          <Button variant="outlined" className="custom-button"
            onClick={() => downloadClients(0)}
            color="error">
            <FuseSvgIcon size={20}>
              heroicons-outline:download
            </FuseSvgIcon>
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default ClientsHeader;
