import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Box } from "@mui/system";
import TableHead from "@mui/material/TableHead";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";

const rows = [
  {
    id: "image",
    align: "left",
    disablePadding: false,
    label: "Imagen",
    sort: true,
  },
  {
    id: "channel",
    align: "left",
    disablePadding: false,
    label: "Canal",
    sort: true,
  },


  {
    id: "geck",
    align: "left",
    disablePadding: false,
    label: "GEC",
    sort: true,
  },
  {
    id: "enabled",
    align: "left",
    disablePadding: false,
    label: "Habilitado",
    sort: true,
  },
  {
    id: "actions",
    align: "left",
    disablePadding: false,
    label: "Acciones",
    sort: true,
  }
];

function SlidersTableHead(props) {
  const { selectedSliderIds } = props;
  const numSelected = selectedSliderIds.length;

  const [selectedSlidersMenu, setSelectedSlidersMenu] = useState(null);

  const dispatch = useDispatch();

  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  function openSelectedSlidersMenu(event) {
    setSelectedSlidersMenu(event.currentTarget);
  }

  function closeSelectedSlidersMenu() {
    setSelectedSlidersMenu(null);
  }

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

export default SlidersTableHead;
