import _ from "@lodash";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import { getSummary, selectPromo, selectSummary } from "./store/promoSlice";
import Box from "@mui/material/Box";

function PromoSummary(props) {
  const dispatch = useDispatch();
  const summary = useSelector(selectSummary);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(summary);

  useEffect(() => {
    dispatch(getSummary()).then((resp) => {
      setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    setData(summary);
  }, [summary]);

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
          No se encontraron Promociones
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Box margin={5}>
        <div>
          <Typography
            display="inline"
            className="text-18 md:text-7l  font-bold tracking-tight"
          >
            Canjes:
          </Typography>
          <Typography
            display="inline"
            className="text-18 md:text-7l ml-10 tracking-tight"
          >
            {data.canjes}
          </Typography>
        </div>
        <div>
          <Typography
            display="inline"
            className="text-18 md:text-7l  font-bold tracking-tight"
          >
            Devoluciones:
          </Typography>
          <Typography
            display="inline"
            className="text-18 md:text-7l ml-10 tracking-tight"
          >
            {data.devoluciones}
          </Typography>
        </div>
        <div>
          <Typography
            display="inline"
            className="text-18 md:text-7l  font-bold tracking-tight"
          >
            Actualización:
          </Typography>
          <Typography
            display="inline"
            className="text-18 md:text-7l ml-10 tracking-tight"
          >
            {data.last_update}
          </Typography>
        </div>
      </Box>
    </div>
  );
}

export default withRouter(PromoSummary);
