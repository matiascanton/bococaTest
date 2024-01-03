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
  selectCheckPhoto,
  setCheckPhoto,
  resetCheckPhoto,
  newCheckPhoto,
} from "../store/checkPhotoSlice";
import reducer from "../store";
import CheckPhotoHeader from "./CheckPhotoHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  channel: yup.string().required("Debe seleccionar un Canal"),
  gec: yup.string().required("Debe seleccionar un GEC"),
  due_date: yup.string().required("Debe seleccionar ingresar una Fecha de Vencimiento"),
  title: yup.string().required("Debe ingresar un Titulo"),
  description: yup.string().required("Debe ingresar una Descripcion"),
  img: yup.mixed().test("required", "You need to provide a file", (file) => {
    return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
  }),
});

function CheckPhoto(props) {
  const dispatch = useDispatch();
  const checkPhoto = useSelector(selectCheckPhoto);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noCheckPhoto, setnoCheckPhoto] = useState(false);
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
  console.log('checkPhoto;', checkPhoto)
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateCheckPhotoState() {
      const { checkPhotoId } = routeParams;
      if (checkPhotoId === "new") {
        dispatch(newCheckPhoto());
      } else {
        dispatch(setCheckPhoto(location.state));
      }
    }

    updateCheckPhotoState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!checkPhoto) {
      return;
    }
    /**
     * Reset the form on checkPhoto state changes
     */
    reset(checkPhoto);
  }, [checkPhoto, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetCheckPhoto());
      setnoCheckPhoto(false);
    };
  }, [dispatch]);

  if (noCheckPhoto) {
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
          to="/checkPhotos"
          color="inherit"
        >
          Volver a CheckPhotoes
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (checkPhoto &&
      routeParams.checkPhotoId !== checkPhoto.id &&
      routeParams.checkPhotoId !== "new" &&
      routeParams.checkPhotoId !== "update" &&
      routeParams.checkPhotoId !== "view")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CheckPhotoHeader params={routeParams.checkPhotoId} />}
        content={<BasicInfo params={routeParams.checkPhotoId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("checkPhotosApp", reducer)(CheckPhoto);
