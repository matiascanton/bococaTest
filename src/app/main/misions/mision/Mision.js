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
  selectMision,
  setMision,
  resetMision,
  newMision,
} from "../store/misionSlice";
import reducer from "../store";
import MisionHeader from "./MisionHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  channel: yup.string().required("Debe seleccionar un Canal"),
  gec: yup.string().required("Debe seleccionar un GEC"),
  year: yup.string().required("Debe seleccionar un Ano"),
  name: yup.string().required("Debe ingresar un Nombre"),
  month: yup.string().required("Debe ingresar un mes"),
  missions: yup.array().min(1, "Debe tener al menos una misión asignada"),
});

function Mision(props) {
  const dispatch = useDispatch();
  const mision = useSelector(selectMision);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noMision, setnoMision] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      deleted: false,
      missions: [],
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateMisionState() {
      const { misionId } = routeParams;

      if (misionId === "new") {
        dispatch(newMision());
      } else {
        dispatch(setMision(location.state));
      }
    }

    updateMisionState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!mision) {
      return;
    }
    /**
     * Reset the form on mision state changes
     */
    reset(mision);
  }, [mision, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetMision());
      setnoMision(false);
    };
  }, [dispatch]);

  if (noMision) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Misiones
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/misions"
          color="inherit"
        >
          Volver a Misiones
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (mision &&
      routeParams.misionId !== mision.id &&
      routeParams.misionId !== "new" &&
      routeParams.misionId !== "update" &&
      routeParams.misionId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<MisionHeader params={routeParams.misionId} />}
        content={<BasicInfo params={routeParams.misionId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("misionsApp", reducer)(Mision);
