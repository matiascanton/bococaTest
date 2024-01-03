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
  selectPrize,
  setPrize,
  resetPrize,
  newPrize,
} from "../store/prizeSlice";
import reducer from "../store";
import PrizeHeader from "./PrizeHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  //category: yup.string().required("Debe seleccionar una categoria"),
  //points: yup.string().required("Debe seleccionar ingresar los puntos"),
  sku: yup.object().required("Debe ingresar un Titulo"),
  points: yup.string().required("Debe ingresar una Descripcion"),
  //max_exchange: yup.string().required("Debe ingresar una Descripcion"),

});

function Prize(props) {
  const dispatch = useDispatch();
  const prize = useSelector(selectPrize);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noPrize, setnoPrize] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      sku: null,
      points: null,
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updatePrizeState() {
      const { prizeId } = routeParams;

      if (prizeId === "new") {
        dispatch(newPrize());
      } else {
        dispatch(setPrize(location.state));
      }
    }

    updatePrizeState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!prize) {
      return;
    }
    /**
     * Reset the form on prize state changes
     */
    reset(prize);
  }, [prize, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetPrize());
      setnoPrize(false);
    };
  }, [dispatch]);

  if (noPrize) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Competencias
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/prizes"
          color="inherit"
        >
          Volver a Competencias
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (prize &&
      routeParams.prizeId !== prize.id &&
      routeParams.prizeId !== "new" &&
      routeParams.prizeId !== "update" &&
      routeParams.prizeId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<PrizeHeader params={routeParams.prizeId} />}
        content={<BasicInfo params={routeParams.prizeId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("prizesApp", reducer)(Prize);
