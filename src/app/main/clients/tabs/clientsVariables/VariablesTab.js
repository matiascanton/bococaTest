import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import FuseLoading from "@fuse/core/FuseLoading";
import { getVariables, selectVariables } from "../../store/clientsSlice";
import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';



function VariablesTab() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const variables = useSelector(selectVariables);
  const [data, setData] = useState(variables);

  const display = Object.entries(data).map((dato, key) => {
    return (
      <Card
        sx={{ display: "flex"}}
        key={key}
        style={{ backgroundColor: "#eeeeee" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <CardContent>
            <List>
              <ListItem disablePadding>
                <ListItemText primary={dato[0].toUpperCase()} />
              </ListItem>
              <List>
                {dato[1].map((d, index) => {
                  return (
                    <ListItem disablePadding key={index}>
                      <ListItemText secondary={d.id} />
                    </ListItem>
                  );
                })}
              </List>
            </List>
          </CardContent>
        </Box>
      </Card>
    );
  });

  useEffect(() => {
    dispatch(getVariables()).then((resp) => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    setData(variables);
  }, [variables]);

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
          No hay clientes!
        </Typography>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-32 sm:mt-40"
      initial="hidden"
      animate="show"
    >
      {display}
    </motion.div>
  );
}

export default VariablesTab;
