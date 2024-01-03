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
  selectCanje,
  setCanje,
  resetCanje,
  newCanje,
} from "../store/canjeSlice";
import reducer from "../store";
import CanjeHeader from "./CanjeHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  //category: yup.string().required("Debe seleccionar una categoria"),
  //points: yup.string().required("Debe seleccionar ingresar los puntos"),

  //max_exchange: yup.string().required("Debe ingresar una Descripcion"),

});

function Canje(props) {
  const dispatch = useDispatch();
  const canje = useSelector(selectCanje);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noCanje, setnoCanje] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      qty: null,
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateCanjeState() {
      const { canjeId } = routeParams;

      if (canjeId === "new") {
        dispatch(newCanje());
      } else {
        dispatch(setCanje(location.state));
      }
    }

    updateCanjeState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!canje) {
      return;
    }
    /**
     * Reset the form on canje state changes
     */
    reset(canje);
  }, [canje, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetCanje());
      setnoCanje(false);
    };
  }, [dispatch]);

  if (noCanje) {
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
          to="/canjes"
          color="inherit"
        >
          Volver a Competencias
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (canje &&
      routeParams.canjeId !== canje.id &&
      routeParams.canjeId !== "new" &&
      routeParams.canjeId !== "update" &&
      routeParams.canjeId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CanjeHeader params={routeParams.canjeId} />}
        content={<BasicInfo params={routeParams.canjeId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("canjesApp", reducer)(Canje);
