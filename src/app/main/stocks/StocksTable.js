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
  getStocks,
  selectStocks,
  selectStocksSearchText,
} from "./store/stocksSlice";
import StocksTableHead from "./StocksTableHead";
import moment from "moment";
import { Button, Tooltip, TextField, Grid } from "@mui/material";
require('moment/locale/es');

function StocksTable({ props, handleInputChange }) {
  const dispatch = useDispatch();
  const stocks = useSelector(selectStocks);
  const searchText = useSelector(selectStocksSearchText);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(stocks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    dispatch(getStocks()).then((resp) => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(stocks, (item) =>
          item.description !== null
            ? item.description.toLowerCase().includes(searchText.toLowerCase())
            : null
        )
      );
      setPage(0);
    } else {
      setData(stocks);
    }
  }, [stocks, searchText]);

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

  async function handleClick(item) {
    await props.navigate(`update`, {
      state: {
        ...item,
      },
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
          No se encontraron Stocks
        </Typography>
      </motion.div>
    );
  }

  return (
    <>


      <div className="w-full flex flex-col min-h-full">

        <FuseScrollbars className="grow overflow-x-auto">
          <Table stickyHeader className="min-w-xl " aria-labelledby="tableTitle">
            <StocksTableHead
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
                      className="h-32 cursor-pointer"
                      hover
                      key={n.sku}
                    >
                      <TableCell
                        className="p-2 md:p-12 "
                        component="th"
                        scope="row"
                      >
                        {n.sku}
                      </TableCell>

                      <TableCell
                        className="p-2 md:p-12 "
                        component="th"
                        scope="row"
                      >
                        {n.description}
                      </TableCell>
                      <TableCell
                        className="p-2 md:p-0 "
                        component="th"
                        scope="row"
                      >
                        <Grid container
                          padding={2}
                          rowSpacing={2}
                          textAlign={"center"}
                          alignItems={"center"}
                        >
                          <Grid item xs={6} md={2} > {n.stock}</Grid>
                          <Grid item xs={6} md={4} >
                            <TextField
                              placeholder="Ingrese nuevo stock"
                              id={`stock-${n.sku}`}
                              variant="outlined"
                              fullWidth
                              className="p-0 md:p-0"
                              inputProps={{ type: "number" }}
                              onChange={(e) => handleInputChange(e, n.sku)}
                            />
                          </Grid>
                        </Grid>
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
    </>
  );
}

export default withRouter(StocksTable);
