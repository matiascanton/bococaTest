import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  getCompetenciaReports,
  selectCompetenciaReports,
  selectCompetenciaReportsSearchText,
} from "./store/competenciaReportsSlice";
import { getRanking, top30 } from "./store/competenciaReportsSlice";
import CompetenciaReportsTableHead from "./CompetenciaReportsTableHead";
import moment from "moment";
import { Button, TableContainer, Tooltip } from "@mui/material";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { lighten } from "@mui/material/styles";



function CompetenciaReportsTable(props) {
  const dispatch = useDispatch();
  const competenciaReports = useSelector(selectCompetenciaReports);
  const searchText = useSelector(selectCompetenciaReportsSearchText);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(competenciaReports);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });
  const [dataClient, setDataClient] = useState([]);
  const [dataRanking, setDataRanking] = useState([]);
  useEffect(() => {
    dispatch(getCompetenciaReports()).then((resp) => {
      setLoading(false);
    });
    dispatch(top30()).then((resp) => {
      setDataClient(resp.payload.slice(0, 30))
      setDataRanking(resp.payload)
      setLoading(false);
    });

  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(competenciaReports, (item) =>
          item.name !== null
            ? item.name.toLowerCase().includes(searchText.toLowerCase())
            : null
        )
      );
      setPage(0);
    } else {
      setData(competenciaReports);
    }
  }, [competenciaReports, searchText]);

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

  const handleExport = () => {
    /*dispatch(rankingGeneral()).then((resp) => {
      setDataClient(resp.payload)
      setLoading(false);
    });*/
    let nombreArchivo = 'Ranking General'
    const header = ['Posicion', 'Cliente', 'Nombre Negocio', 'Puntos'];
    const dataArray = [header, ...dataRanking.map((item, index) => [index + 1, item.id, item.business_name, item.total])];
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    XLSX.utils.book_append_sheet(workbook, worksheet, nombreArchivo);
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, nombreArchivo + '.xlsx');
  }



  async function handleClickView(item) {

    /*dispatch(getReports(item.id)).then((resp) => {
      reporte = resp.payload
    });*/
    await props.navigate(`view`, {
      state: {
        ...item,
      },
    });
  }

  async function handleClickExport(items) {
    let reporte = []
    dispatch(getRanking(items.id)).then((resp) => {
      let nombreArchivo = 'Ranking Competencia'
      reporte = resp.payload
      const header = ['Posicion', 'Cliente', 'Nombre Negocio', 'Puntos'];
      const dataArray = [header, ...reporte.map(item => [item.indice, item.client_id, item.business_name, item.puntaje])];
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      saveAs(blob, nombreArchivo + '.xlsx');
    });
  }

  const cellStyles = {
    backgroundColor: (theme) =>
      theme.palette.mode === 'light'
        ? lighten(theme.palette.background.default, 0.4)
        : lighten(theme.palette.background.default, 0.02),
  };


  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
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
    <>
      <div className="w-full flex flex-col ">
        <FuseScrollbars className="grow overflow-x-auto">
          <div className="p-10 m-5">
            <Typography variant="h5" className=" truncate font-semibold"> Listado </Typography>
          </div>
          <TableContainer className="p-5 m-5">
            <Table stickyHeader className="min-w-xl " aria-labelledby="tableTitle">
              <CompetenciaReportsTableHead
                order={order}
                onRequestSort={handleRequestSort}
                rowCount={data.length}
              />

              <TableBody>
                {_.orderBy(data, [(o) => o[order.id]], [order.direction])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n) => {
                    return (
                      <TableRow
                        className="h-72 cursor-pointer"
                        hover
                        key={n.id}

                      >
                        <TableCell component="th" scope="row" padding="none">
                          <img
                            width={100}

                            className="rounded ml-10"
                            src={n.image}
                            alt={n.name}
                            style={{ objectFit: 'contain', maxHeight: '60px' }}
                          />
                        </TableCell>

                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {n.name}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {moment(n.start_date).format('DD-MM-YYYY')}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {moment(n.due_date).format('DD-MM-YYYY')}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >

                          {n.type === 'clients' ? <>Clientes</> : <>Canal</>}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16"
                          component="th"
                          scope="row"
                        >
                          {n.enabled ? (
                            <FuseSvgIcon className="text-green" size={20}>
                              heroicons-outline:check-circle
                            </FuseSvgIcon>
                          ) : (
                            <FuseSvgIcon className="text-red" size={20}>
                              heroicons-outline:minus-circle
                            </FuseSvgIcon>
                          )}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          <Tooltip title='Ver' placement="top">
                            <Button onClick={(event) => handleClickView(n)}>
                              <FuseSvgIcon size={20} color="action">
                                heroicons-outline:eye
                              </FuseSvgIcon>
                            </Button>
                          </Tooltip>

                          <Tooltip title='Descargar' placement="top">
                            <Button onClick={(event) => handleClickExport(n)}>
                              <FuseSvgIcon size={20} color="action">
                                heroicons-outline:download
                              </FuseSvgIcon>
                            </Button>
                          </Tooltip>


                        </TableCell>

                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
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
      <div className="p-10 m-5">
        <div className="p-10 m-5" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" className="truncate font-semibold" style={{ flex: 1 }}>Ranking General</Typography>
          <Tooltip title="Descargar Ranking">
            <Button className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleExport}>
              <FuseSvgIcon size={20}>
                heroicons-outline:download
              </FuseSvgIcon>
            </Button>
          </Tooltip>
        </div>
        <TableContainer className="p-5 m-5" style={{ maxHeight: '400px', overflow: 'auto' }}>
          <Table className="min-w-xl " aria-labelledby="tableTitle">
            <TableHead>
              <TableRow className="h-48 sm:h-64">
                <TableCell sx={cellStyles}>Pos</TableCell>
                <TableCell sx={cellStyles}>Cliente ID</TableCell>
                <TableCell sx={cellStyles}>Nombre Negocio</TableCell>
                <TableCell sx={cellStyles}>Puntos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.orderBy(dataClient, [(o) => o[order.id]], [order.direction])
                .map((d, index) => {
                  return (
                    <>
                      <TableRow>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                          key={d.id}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {d.id}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {d.business_name}
                        </TableCell>
                        <TableCell
                          className="p-4 md:p-16 "
                          component="th"
                          scope="row"
                        >
                          {d.total}
                        </TableCell>
                      </TableRow>

                    </>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default withRouter(CompetenciaReportsTable);
