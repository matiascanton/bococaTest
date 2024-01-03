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
  selectImperdible,
  setImperdible,
  resetImperdible,
  newImperdible,
} from "../store/imperdibleSlice";
import reducer from "../store";
import ImperdibleHeader from "./ImperdibleHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  channel: yup.string().required("Debe seleccionar un Canal"),
  gec: yup.string().required("Debe seleccionar un GEC"),
  year: yup.string().required("Debe seleccionar un Ano"),
  name: yup.string().required("Debe ingresar un Nombre"),
  month: yup.string().required("Debe ingresar un mes"),
  items: yup.array().min(1, "Debe tener al menos una misión asignada"),
});

function Imperdible(props) {
  const dispatch = useDispatch();
  const imperdible = useSelector(selectImperdible);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noImperdible, setnoImperdible] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      deleted: false,
      items: [],
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateImperdibleState() {
      const { imperdibleId } = routeParams;

      if (imperdibleId === "new") {
        dispatch(newImperdible());
      } else {
        dispatch(setImperdible(location.state));
      }
    }

    updateImperdibleState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!imperdible) {
      return;
    }
    /**
     * Reset the form on imperdible state changes
     */
    reset(imperdible);
  }, [imperdible, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetImperdible());
      setnoImperdible(false);
    };
  }, [dispatch]);

  if (noImperdible) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Imperdiblees
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/imperdibles"
          color="inherit"
        >
          Volver a Imperdiblees
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (imperdible &&
      routeParams.imperdibleId !== imperdible.id &&
      routeParams.imperdibleId !== "new" &&
      routeParams.imperdibleId !== "update" &&
      routeParams.imperdibleId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<ImperdibleHeader params={routeParams.imperdibleId} />}
        content={<BasicInfo params={routeParams.imperdibleId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("imperdiblesApp", reducer)(Imperdible);
