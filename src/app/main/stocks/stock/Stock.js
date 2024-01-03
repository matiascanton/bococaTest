import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import { useDeepCompareEffect } from "@fuse/hooks";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  selectStock,
  setStock,
  resetStock,
  newStock,
} from "../store/stockSlice";
import reducer from "../store";
import StockHeader from "./StockHeader";
import BasicInfo from "./BasicInfo";

/*const schema = yup.object().shape({
  image: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
});*/

function Stock(props) {
  const dispatch = useDispatch();
  const stock = useSelector(selectStock);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noStock, setnoStock] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      title: '',
    },
    //resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateStockState() {
      const { stockId } = routeParams;

      if (stockId === "new") {
        dispatch(newStock());
      } else {
        dispatch(setStock(location.state));
      }
    }

    updateStockState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!stock) {
      return;
    }
    /**
     * Reset the form on stock state changes
     */
    reset(stock);
  }, [stock, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetStock());
      setnoStock(false);
    };
  }, [dispatch]);

  if (noStock) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Stocks
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/stocks"
          color="inherit"
        >
          Volver a Stocks
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (stock &&
      routeParams.stockId !== stock.id &&
      routeParams.stockId !== "new" &&
      routeParams.stockId !== "update" &&
      routeParams.stockId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<StockHeader params={routeParams.stockId} />}
        content={<BasicInfo params={routeParams.stockId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("stocksApp", reducer)(Stock);
