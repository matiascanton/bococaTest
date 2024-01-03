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
  selectUpload,
  setUpload,
  resetUpload,
  newUpload,
} from "../store/uploadSlice";
import reducer from "../store";
import UploadHeader from "./UploadHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  image: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
});

function Upload(props) {
  const dispatch = useDispatch();
  const upload = useSelector(selectUpload);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noUpload, setnoUpload] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      enabled: true,
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateUploadState() {
      const { uploadId } = routeParams;

      if (uploadId === "new") {
        dispatch(newUpload());
      } else {
        dispatch(setUpload(location.state));
      }
    }

    updateUploadState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!upload) {
      return;
    }
    /**
     * Reset the form on upload state changes
     */
    reset(upload);
  }, [upload, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetUpload());
      setnoUpload(false);
    };
  }, [dispatch]);

  if (noUpload) {
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
          to="/uploads"
          color="inherit"
        >
          Volver a Competencias
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (upload &&
      routeParams.uploadId !== upload.id &&
      routeParams.uploadId !== "new" &&
      routeParams.uploadId !== "update" &&
      routeParams.uploadId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<UploadHeader params={routeParams.uploadId} />}
        content={<BasicInfo params={routeParams.uploadId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("uploadsApp", reducer)(Upload);
