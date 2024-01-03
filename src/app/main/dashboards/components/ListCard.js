import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useSelector } from "react-redux";
import { selectWidgets } from "../analytics/store/widgetsSlice";
import CardHeader from "@mui/material/CardHeader";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function ListCard(props) {
  const { top10List, title, type } = props;
  const { list } = top10List;

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <CardHeader
          sx={{
            backgroundColor: "#50e39673",
            borderRadius: "8px",
            margin: "auto",
            width: "98%",
            // boxShadow: "0px 3px 8px rgba(34, 35, 58, 0.5)",
            fontSize: 16,
          }}
          title={
            <Typography sx={{ fontSize: 16, fontWeight: 500, color: "black" }}>
              {title}
            </Typography>
          }
        ></CardHeader>

        <List
          sx={{
            margin: "auto",
            width: "95%",
          }}
        >
          {list.map((item, index) => {
            if (item.hasOwnProperty("sku")) {
              return (
                <ListItem key={item.sku} sx={{ padding: 0 }}>
                  <ListItemText
                    primary={`${index + 1}. SKU: ${item.sku} - ${
                      item.producto
                    }`}
                    secondary={
                      <React.Fragment>
                        <span style={{ marginLeft: 15 }}>
                          Cantidad: {item.pedidos}
                        </span>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              );
            } else {
              return (
                <ListItem key={item.id || index} sx={{ padding: 0 }}>
                  <ListItemText
                    primary={
                      type != "canjes_clientes"
                        ? `${index + 1}. ${item.cliente} - ${item.id}`
                        : `${index + 1}. ${item.nombre} - ID: ${item.id}`
                    }
                    secondary={
                      <React.Fragment>
                        {type === "compra" && (
                          <span style={{ marginLeft: 15 }}>
                            Compra: {item.compra}
                          </span>
                        )}
                        {type === "puntos" && (
                          <span style={{ marginLeft: 15 }}>
                            Puntos: {item.puntos}
                          </span>
                        )}
                        {type === "canjes" && (
                          <span style={{ marginLeft: 15 }}>
                            Canjes: {item.canjes}
                          </span>
                        )}
                        {type === "canjes_clientes" && (
                          <span style={{ marginLeft: 15 }}>
                            Presentación: {item.presentacion}, Cantidad:{" "}
                            {item.cantidad}
                          </span>
                        )}
                      </React.Fragment>
                    }
                  />
                </ListItem>
              );
            }
          })}
        </List>
      </CardContent>
    </Card>
  );
}
