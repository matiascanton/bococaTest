import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
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
import {
  getUsers,
  selectUsersSearchText,
  selectUsers,
} from "./store/rolesSlice";
import UsersTableHead from "./RolesTableHead";

function RolesTable(props) {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const searchText = useSelector(selectUsersSearchText);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });

  useEffect(() => {
    dispatch(getUsers()).then((res) => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        _.filter(
          users,
          (item) =>
            item.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.last_name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setPage(0);
    } else {
      setData(users);
    }
  }, [users, searchText]);

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

  function handleClick(item) {
    props.navigate(`/roles/${item.id}`);
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
          No se encontraron perfiles
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <FuseScrollbars className="grow overflow-x-auto">
        <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
          <UsersTableHead
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
                    onClick={(event) => handleClick(n)}
                  >
                    <TableCell
                      className="p-4 md:p-12"
                      component="th"
                      scope="row"
                    >
                      {n.first_name}
                    </TableCell>
                    <TableCell
                      className="p-4 md:p-12"
                      component="th"
                      scope="row"
                    >
                      {n.last_name}
                    </TableCell>

                    <TableCell
                      className="p-4 md:p-12"
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

export default withRouter(RolesTable);
