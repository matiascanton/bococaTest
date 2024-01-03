import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
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
  getPrizes,
  selectPrizes,
  selectPrizesSearchText,
  getProducts,
} from "./store/prizesSlice";
import PrizesTableHead from "./PrizesTableHead";
import moment from "moment";
import { Button, Tooltip } from "@mui/material";

function PrizesTable(props) {
  const dispatch = useDispatch();
  const prizes = useSelector(selectPrizes);
  const searchText = useSelector(selectPrizesSearchText);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(prizes);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });
  const [productos, setProductos] = useState()

  useEffect(() => {
    dispatch(getPrizes()).then((resp) => {

    });
    dispatch(getProducts()).then((resp) => {
      console.log('res', resp.payload)
      setProductos(resp.payload)
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(prizes, (item) =>
          item.description !== null
            ? item.description.toLowerCase().includes(searchText.toLowerCase())
            : null
        )
      );
      setPage(0);
    } else {
      setData(prizes);
    }
  }, [prizes, searchText]);

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

  async function handleClickUpdate(item) {
    await props.navigate(`update`, {
      state: {
        ...item,
      },
    });
  }

  async function handleClickView(item) {
    await props.navigate(`view`, {
      state: {
        ...item,
      },
    });
  }



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
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl " aria-labelledby="tableTitle">
          <PrizesTableHead
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
                        src={productos.find(objeto => objeto.sku === n.sku)?.image}
                        //src={n.image}
                        alt={n.id}
                        style={{ objectFit: 'contain', maxHeight: '60px' }}
                      />
                    </TableCell>


                    <TableCell
                      className="p-4 md:p-16 "
                      component="th"
                      scope="row"
                    >
                      {productos.find(objeto => objeto.sku === n.sku)?.description}
                      {/*n.description*/}
                    </TableCell>
                    <TableCell
                      className="p-4 md:p-16 "
                      component="th"
                      scope="row"
                    >
                      {n.category}
                    </TableCell>
                    <TableCell
                      className="p-4 md:p-16 "
                      component="th"
                      scope="row"
                    >
                      {n.points}
                    </TableCell>


                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.status === 'available' ? (
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
                      <Tooltip title='Editar' placement="top">
                        <Button onClick={(event) => handleClickUpdate(n)}>
                          <FuseSvgIcon size={20} color="action">
                            heroicons-outline:pencil
                          </FuseSvgIcon>
                        </Button>
                      </Tooltip>
                    </TableCell>

                  </TableRow>
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
  );
}

export default withRouter(PrizesTable);
