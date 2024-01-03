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
  selectCompetenciaReport,
  setCompetenciaReport,
  resetCompetenciaReport,
  newCompetenciaReport,
} from "../store/competenciaReportSlice";
import reducer from "../store";
import CompetenciaReportHeader from "./CompetenciaReportHeader";
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

function CompetenciaReport(props) {
  const dispatch = useDispatch();
  const competenciaReport = useSelector(selectCompetenciaReport);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noCompetenciaReport, setnoCompetenciaReport] = useState(false);
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
    function updateCompetenciaReportState() {
      const { competenciaReportId } = routeParams;

      if (competenciaReportId === "new") {
        dispatch(newCompetenciaReport());
      } else {
        dispatch(setCompetenciaReport(location.state));
      }
    }

    updateCompetenciaReportState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!competenciaReport) {
      return;
    }
    /**
     * Reset the form on competenciaReport state changes
     */
    reset(competenciaReport);
  }, [competenciaReport, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetCompetenciaReport());
      setnoCompetenciaReport(false);
    };
  }, [dispatch]);

  if (noCompetenciaReport) {
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
          to="/competenciaReports"
          color="inherit"
        >
          Volver a Competencias
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (competenciaReport &&
      routeParams.competenciaReportId !== competenciaReport.id &&
      routeParams.competenciaReportId !== "new" &&
      routeParams.competenciaReportId !== "update" &&
      routeParams.competenciaReportId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CompetenciaReportHeader params={routeParams.competenciaReportId} />}
        content={<BasicInfo params={routeParams.competenciaReportId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("competenciaReportsApp", reducer)(CompetenciaReport);
