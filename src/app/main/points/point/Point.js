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
  selectPoint,
  setPoint,
  resetPoint,
  newPoint,
} from "../store/pointSlice";
import reducer from "../store";
import PointHeader from "./PointHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({

  description: yup.string().required("Debe ingresar una descripcion"),
  points: yup.string().required("Debe ingresar un Nombre"),

});

function Point(props) {
  const dispatch = useDispatch();
  const point = useSelector(selectPoint);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noPoint, setnoPoint] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      client_id: [], channel: null, gec: null, description: '',
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updatePointState() {
      const { pointId } = routeParams;

      if (pointId === "new") {
        dispatch(newPoint());
      } else {
        dispatch(setPoint(location.state));
      }
    }

    updatePointState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!point) {
      return;
    }
    /**
     * Reset the form on point state changes
     */
    reset(point);
  }, [point, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetPoint());
      setnoPoint(false);
    };
  }, [dispatch]);

  if (noPoint) {
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
          to="/points"
          color="inherit"
        >
          Volver a Competencias
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (point &&
      routeParams.pointId !== point.id &&
      routeParams.pointId !== "new" &&
      routeParams.pointId !== "update" &&
      routeParams.pointId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<PointHeader params={routeParams.pointId} />}
        content={<BasicInfo params={routeParams.pointId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("pointsApp", reducer)(Point);
