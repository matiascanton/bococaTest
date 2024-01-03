import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import {
  getClients,
  selectClients,
  selectClientsSearchText,
} from "../../store/clientsSlice";
import { getClient, getClientData } from "../../store/clientSlice";
import ClientsTableHead from "./ClientsTableHead";
import { Button, Tooltip } from "@mui/material";

function ClientsTable(props) {
  const dispatch = useDispatch();
  const clients = useSelector(selectClients);
  const searchText = useSelector(selectClientsSearchText);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(clients);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  function goToNextPage() {
    setPage((page) => page + 1);
  }
  function goToPreviousPage() {
    setPage((page) => page - 1);
  }
  useEffect(() => {
    dispatch(getClients(page)).then((resp) => {
      setLoading(false);
    });
  }, [dispatch, page]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(clients, (item) =>
          item.id !== null
            ? item.id.includes(searchText)
            : null
        )
      );
      setPage(0);
    } else {
      setData(clients);
    }
  }, [clients, searchText]);
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



  async function handleClickView(item) {
    try {
      const resp = await new Promise((resolve, reject) => {
        dispatch(getClientData(item.id))
          .then(resolve)
          .catch(reject);
      });

      const clientData = resp.payload;

      await props.navigate('view', {
        state: {
          ...clientData,
        },
      });
    } catch (error) {
      // Manejo del error
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0 || Object.keys(data[0]).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay clientes!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <ClientsTableHead
            order={order}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
          />
          <TableBody>
            {_.orderBy(data, [(o) => o[order.id]], [order.direction]).map(
              (n) => {
                return (
                  <TableRow
                    className="h-72 cursor-pointer"
                    hover
                    key={n.id}
                  >
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.id}
                    </TableCell>
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.cuit}
                    </TableCell>
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.business_name}
                    </TableCell>
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.email}
                    </TableCell>
                    <TableCell
                      className="p-4 md:p-16"
                      component="th"
                      scope="row"
                    >
                      {n.mobile}
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
                    <TableCell className="p-4 md:p-16"
                      component="th"
                      scope="row">
                      <Tooltip title='Ver' placement="top">
                        <Button onClick={(event) => handleClickView(n)}>
                          <FuseSvgIcon size={20} color="action">
                            heroicons-outline:eye
                          </FuseSvgIcon>
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </FuseScrollbars>
      <Box
        sx={{
          width: 200,
          alignSelf: "flex-end",
        }}
      >
        <Button disabled={page <= 0} onClick={goToPreviousPage}>
          Atras
        </Button>
        <Button disabled={searchText.length > 0} onClick={goToNextPage}>
          Siguiente
        </Button>
      </Box>
    </div>
  );
}

export default withRouter(ClientsTable);
