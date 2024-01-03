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
  selectTricampeon,
  setTricampeon,
  resetTricampeon,
  newTricampeon,
} from "../store/tricampeonSlice";
import reducer from "../store";
import TricampeonHeader from "./TricampeonHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  start_date: yup.string().required("Debe seleccionar un GEC"),
  due_date: yup.string().required("Debe seleccionar un Ano"),
  name: yup.string().required("Debe ingresar un Nombre"),
  type: yup.string().required("Debe seleccionar un Destinatario"),
  gift_1: yup.string().required("Debe ingresar un premio"),
  gift_2: yup.string().required("Debe ingresar un premio"),
  skus_1: yup.string().required("Debe ingresar un premio"),
  skus_2: yup.string().required("Debe ingresar un premio"),
  skus_3: yup.string().required("Debe ingresar un premio"),
  skus_4: yup.string().required("Debe ingresar un premio"),
  points: yup.string().required("Debe ingresar un premio"),
  bonus: yup.string().required("Debe ingresar un premio"),
  image: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
});

function Tricampeon(props) {
  const dispatch = useDispatch();
  const tricampeon = useSelector(selectTricampeon);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noTricampeon, setnoTricampeon] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      enabled: true,
      name: '',
      type: '',
      start_date: '',
      due_date: '',
      terms: '',
      gift_1: '',
      gift_2: '',
      skus_1: '',
      skus_2: '',
      skus_3: '',
      skus_4: ''
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateTricampeonState() {
      const { tricampeonId } = routeParams;

      if (tricampeonId === "new") {
        dispatch(newTricampeon());
      } else {
        dispatch(setTricampeon(location.state));
      }
    }

    updateTricampeonState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!tricampeon) {
      return;
    }
    /**
     * Reset the form on tricampeon state changes
     */
    reset(tricampeon);
  }, [tricampeon, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetTricampeon());
      setnoTricampeon(false);
    };
  }, [dispatch]);

  if (noTricampeon) {
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
          to="/tricampeons"
          color="inherit"
        >
          Volver a Competencias
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (tricampeon &&
      routeParams.tricampeonId !== tricampeon.id &&
      routeParams.tricampeonId !== "new" &&
      routeParams.tricampeonId !== "update" &&
      routeParams.tricampeonId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<TricampeonHeader params={routeParams.tricampeonId} />}
        content={<BasicInfo params={routeParams.tricampeonId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("tricampeonsApp", reducer)(Tricampeon);
