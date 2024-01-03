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
  selectNotification,
  setNotification,
  resetNotification,
  newNotification,
} from "../store/notificationSlice";
import reducer from "../store";
import NotificationHeader from "./NotificationHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  channel: yup.string().required("Debe seleccionar un Canal"),
  gec: yup.string().required("Debe seleccionar un GEC"),
  due_date: yup.string().required("Debe seleccionar ingresar una Fecha de Vencimiento"),
  title: yup.string().required("Debe ingresar un Titulo"),
});

function Notification(props) {
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noNotification, setnoNotification] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      img: "",
      channel: "",
      gec: "",
      title: "",
      description: "",
    },
    resolver: yupResolver(schema),
  });
  console.log('notification;', notification)
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateNotificationState() {
      const { notificationId } = routeParams;
      if (notificationId === "new") {
        dispatch(newNotification());
      } else {
        dispatch(setNotification(location.state));
      }
    }

    updateNotificationState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!notification) {
      return;
    }
    /**
     * Reset the form on notification state changes
     */
    reset(notification);
  }, [notification, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetNotification());
      setnoNotification(false);
    };
  }, [dispatch]);

  if (noNotification) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Notificacion!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/notifications"
          color="inherit"
        >
          Volver a Notificationes
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (notification &&
      routeParams.notificationId !== notification.id &&
      routeParams.notificationId !== "new" &&
      routeParams.notificationId !== "update" &&
      routeParams.notificationId !== "view")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<NotificationHeader params={routeParams.notificationId} />}
        content={<BasicInfo params={routeParams.notificationId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("notificationsApp", reducer)(Notification);
