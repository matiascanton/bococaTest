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
import Paper from "@mui/material/Paper";

const bull = (
  <Box component="span" sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}>
    •
  </Box>
);

export default function ListCardRanking(props) {
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
          title={<Typography sx={{ fontSize: 16, fontWeight: 500, color: "black" }}>{title}</Typography>}
        ></CardHeader>
        <Paper sx={{ maxHeight: 300, overflow: "auto" }}>
          <List
            sx={{
              margin: "auto",
              width: "95%",
            }}
          >
            {list &&
              list.map((item, index) => {
                return (
                  <ListItem key={item.id} sx={{ padding: 0 }}>
                    <ListItemText
                      primary={
                        <Typography component="div">
                          <Typography noWrap>
                            <span style={{ fontWeight: 800 }}>{`${index + 1}.`} </span> {`${item.id} - ${item.client}`}
                          </Typography>
                          <div>
                            <span style={{ marginLeft: 15, color: "grey" }}>{`Puntos: ${item.points}`}</span>{" "}
                          </div>
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              })}
          </List>
        </Paper>
      </CardContent>
    </Card>
  );
}
