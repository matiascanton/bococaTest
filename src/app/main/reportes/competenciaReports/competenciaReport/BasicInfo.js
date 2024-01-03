import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Typography, ToggleButtonGroup, ToggleButton, Select, MenuItem } from "@mui/material";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import {
  getBrands,
  getProducts,
  getVariables
} from '../store/competenciaReportsSlice';
import { getReports, getClientDetail, getRanking } from "../store/competenciaReportsSlice";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import ReportTableHead from "./ReportTableHead";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import FuseLoading from "@fuse/core/FuseLoading";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  //const storage = getStorage();
  const { errors } = formState;
  const dispatch = useDispatch();
  const {
    id,
    gift_1,
    gift_2,
  } = control._formValues;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });
  const [searchText, setSearchText] = useState('')
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const smallRowStyle = {
    height: '20px',
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataClient, setDataClient] = useState()
  const [client, setClient] = useState('')
  const [dataExport, setDataExport] = useState([]);


  useEffect(() => {
    if (id !== undefined)
      dispatch(getRanking(id)).then((resp) => {
        //const updatedData = resp.payload.map((item) => ({ ...item, show: false }));
        setData(resp.payload);
        setDataExport(resp.payload);
        setFilteredData(resp.payload)
        setLoading(false);
        console.log('resp', resp.payload)
      });
  }, [id])



  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  /*useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(competenciaReports, (item) =>
          item.type !== null
            ? item.type.toLowerCase().includes(searchText.toLowerCase())
            : null
        )
      );
      setPage(0);
    } else {
      setData(competenciaReports);
    }
  }, [competenciaReports, searchText]);*/
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    const searchText = event.target.value;
    const filteredTableData = data.filter((item) => {
      // Aquí, debes ajustar la lógica de filtrado según tus necesidades.
      // Por ejemplo, si deseas filtrar por el nombre del cliente, puedes hacer:
      return item.client_id.includes(searchText);
    });
    setFilteredData(filteredTableData);
  };
  const handleClickView = (clientID) => {
    setClient(clientID)
    //console.log('client', typeof clientId)
    const val = { competenceId: id, clientId: clientID }
    dispatch(getClientDetail(val)).then((resp) => {
      setDataClient(resp.payload);
      console.log('resp', resp.payload)
    });
    setIsModalOpen(true);
  }


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDataClient([]);
    setClient('')
  };

  const handleExport = () => {
    let nombreArchivo = 'Ranking Competencia'
    const header = ['Posicion', 'Cliente', 'Nombre Negocio', 'Puntos'];
    const dataArray = [header, ...dataExport.map(item => [item.indice, item.client_id, item.business_name, item.puntaje])];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreArchivo);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, nombreArchivo + '.xlsx');
  }


  async function handleExportMovements() {
    let reporte = []
    dispatch(getReports(id)).then((resp) => {
      let nombreArchivo = 'Movimientos Competencia'
      reporte = resp.payload
      const header = ['ID', 'Cliente', 'Descripcion', 'Fecha', 'Puntos'];
      const dataArray = [header, ...reporte.map(item => [item.id, item.client_id, item.description, moment(item.created_at).format('DD-MM-YYYY'), item.points])];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(blob, nombreArchivo + '.xlsx');
    });
  }

  const handleExportClient = () => {
    const nombreArchivo = 'Puntos Cliente ' + client
    const header = ['TRX', 'Descripcion', 'Puntos', 'Fecha'];
    const dataArray = [header, ...dataClient.map(item => [item.id, item.client_id, item.description, moment(item.created_at).format('DD-MM-YYYY'), item.points])];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreArchivo);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, nombreArchivo + '.xlsx');
  }





  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No se encontraron Competencias
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="ml-10">
      <Grid
        container
        padding={3}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={6} md={2} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Busqueda de cliente
          </Typography>
          <TextField
            placeholder="Ingrese Nro de Cliente"
            autoFocus
            id="name"
            variant="outlined"
            fullWidth
            value={searchText}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={6} md={3} textAlign={'center'}>
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Premio 1
          </Typography>
          <Chip className="text-12 sm:text-12 truncate font-semibold" label={gift_1} style={{ backgroundColor: 'lightgray' }} />

        </Grid>
        <Grid item xs={6} md={3} textAlign={'center'}>
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Premio 2
          </Typography>
          <Chip className="text-12 sm:text-12 truncate font-semibold" label={gift_2} style={{ backgroundColor: 'white' }} />

        </Grid>
        <Grid item xs={6} md={2} >
          <Button className="whitespace-nowrap mx-4 custom-button"
            variant="contained"
            color="secondary"
            onClick={handleExportMovements}>
            Descargar Movimientos
          </Button></Grid>
        <Grid item xs={6} md={2} >
          <Button className="whitespace-nowrap mx-4 custom-button"
            variant="contained"
            color="secondary"
            onClick={handleExport}>
            Descargar Ranking
          </Button>

        </Grid>
      </Grid>
      <Grid container
        padding={3}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <div className="w-full flex flex-col min-h-full">
          <FuseScrollbars className="grow overflow-x-auto">
            <Table stickyHeader className="min-w-xl " aria-labelledby="tableTitle">
              <ReportTableHead
                order={order}
                onRequestSort={handleRequestSort}
                rowCount={filteredData.length}
              />

              <TableBody>
                {_.orderBy(filteredData, [(o) => o[order.id]], [order.direction])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n) => {
                    return (
                      <>

                        <TableRow
                          className=" cursor-pointer"
                          hover
                          key={n.client_id}
                          style={{ backgroundColor: n.indice <= 10 ? 'lightgray' : 'white' }}
                        >
                          <TableCell component="th" scope="row" padding="none" style={{ height: '20px', width: '30px', paddingLeft: '20px' }} >
                            {n.indice}
                          </TableCell>

                          <TableCell
                            className=" md:p-1 "
                            component="th"
                            scope="row"
                            style={{ height: '20px' }}
                          >
                            {n.client_id}
                          </TableCell>
                          <TableCell
                            className=" md:p-1 "
                            component="th"
                            scope="row"
                            style={{ height: '20px' }}
                          >
                            {n.business_name}
                          </TableCell>
                          <TableCell
                            className=" md:p-1 "
                            component="th"
                            scope="row"
                            style={{ height: '20px' }}
                          >
                            {n.puntaje}
                          </TableCell>
                          <TableCell
                            className=" md:p-1 "
                            component="th"
                            scope="row"
                            style={{ height: '20px' }}
                          >
                            <Tooltip title='Ver' placement="top">
                              <Button onClick={(event) => handleClickView(n.client_id)}>
                                <FuseSvgIcon size={18} color="action">
                                  heroicons-outline:eye
                                </FuseSvgIcon>
                              </Button>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          </FuseScrollbars>

          <TablePagination
            className="shrink-0 border-t-1"
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Grid>



      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth='lg'>
        <DialogTitle sx={{ m: 2, p: 2 }}>Puntos cliente Nro  <Chip label={client} style={{ backgroundColor: '#fe0019c9', color: 'white' }} />  </DialogTitle>
        <DialogContent dividers>

          <Table className="min-w-xl " aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>TRX</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Puntos</TableCell>
                <TableCell>Fecha</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.orderBy(dataClient, [(o) => o[order.id]], [order.direction])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((d) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                          key={d.id}
                        >
                          {d.trx}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {d.description}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {d.points}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {moment(d.created_at).format('DD-MM-YYYY')}
                        </TableCell>
                      </TableRow>

                    </>
                  );
                })}
            </TableBody>
          </Table>

        </DialogContent>
        <DialogActions sx={{ m: 0, p: 2 }} dividers>
          <Button className="whitespace-nowrap mx-4 custom-button"
            variant="outlined"
            onClick={handleExportClient}>Descargar Excel Cliente</Button>
          <Button className="whitespace-nowrap mx-4"
            variant="outlined"
            color="error" onClick={handleCloseModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>

    </div >
  );
}

export default BasicInfo;
