import Button from "@mui/material/Button";
import { Tooltip } from "@mui/material";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  selectCanjesSearchText,
  setCanjesSearchText,
} from "./store/canjesSlice";
import { getCanjes, getCanjesEntregado } from "./store/canjesSlice";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import moment from "moment";

function CanjesHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectCanjesSearchText);

  const downloadCanjes = async () => {
    const respEntregado = await dispatch(getCanjesEntregado());
    const respPedido = await dispatch(getCanjes());

    console.log('respPedido', respPedido)
    console.log('respEntregado', respEntregado)
    //exportarExcel(lista)
    if (respPedido.payload.length > 0) {
      exportarExcel(respPedido.payload, 'Canjes Pedidos')
    }
    if (respEntregado.payload.length > 0) {
      exportarExcel(respEntregado.payload, 'Canjes Entregados')
    }

  };

  const buttonStyle = {
    color: 'black', // Establece el color del texto en negro
    borderColor: 'red', // Color del borde (opcional, puedes personalizarlo)
    backgroundColor: 'white',
    border: 'red solid 2px',
    '&:hover': {
      color: 'red', // Cambia el color del borde al hacer hover
    },
  };



  const exportarExcel = (lista, nombre) => {
    //console.log('clientList', lista)
    let nombreArchivo = nombre
    const header = ['ID', 'Cliente', 'Nombre', 'Título', 'SKU', 'Cantidad', 'Fecha'];
    const dataArray = [header, ...lista.map((item, index) => [item.id, item.client_id, item.business_name, item.trx_description, item.sku, item.qty, moment(item.created_at).format('DD-MM-YYYY')])];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreArchivo);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, nombreArchivo + '.xlsx');
  }

  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight"
      >
        Canjes
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">

        <Paper
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
        >
          <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

          <Input
            placeholder="Busqueda de canjes"
            className="flex flex-1"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              "aria-label": "Search",
            }}
            onChange={(ev) => dispatch(setCanjesSearchText(ev))}
          />
        </Paper>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
        >
          <Button
            className="mr-5 custom-button"
            component={Link}
            to="/canjes/new"
            variant="outlined"

            //style={buttonStyle}
            startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
          >
            Agregar
          </Button>
          <Button variant="outlined" className="custom-button"
            onClick={() => downloadCanjes()}
          >
            <FuseSvgIcon size={20} >
              heroicons-outline:download
            </FuseSvgIcon>
          </Button>


        </motion.div>{" "}

      </div>
    </div>
  );
}

export default CanjesHeader;
