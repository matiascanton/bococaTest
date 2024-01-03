import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import TableHead from "@mui/material/TableHead";
import { lighten } from "@mui/material/styles";

const rows = [
  {
    id: "dest",
    align: "left",
    disablePadding: false,
    label: "Destino",
    sort: true,
  },
  {
    id: "last",
    align: "left",
    disablePadding: false,
    label: "Ultima Actualizacion",
    sort: true,
  },
  {
    id: "usr",
    align: "left",
    disablePadding: false,
    label: "Usuario",
    sort: true,
  },
  {
    id: "carga",
    align: "center",
    disablePadding: false,
    label: "Carga",
    sort: true,
  },
  {
    id: "type",
    align: "center",
    disablePadding: false,
    label: "Tipo",
    sort: true,
  },

];

function UploadsTableHead(props) {
  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="h-48 sm:h-64">
        {rows.map((row) => {
          return (
            <TableCell
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
              className="p-4 md:p-16"
              key={row.id}
              align={row.align}
              padding={row.disablePadding ? "none" : "normal"}
              sortDirection={
                props.order.id === row.id ? props.order.direction : false
              }
            >
              {row.sort && (
                <Tooltip
                  title="Sort"
                  placement={
                    row.align === "right" ? "bottom-end" : "bottom-start"
                  }
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={props.order.id === row.id}
                    direction={props.order.direction}
                    onClick={createSortHandler(row.id)}
                    className="font-semibold"
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              )}
            </TableCell>
          );
        }, this)}
      </TableRow>
    </TableHead>
  );
}

export default UploadsTableHead;
