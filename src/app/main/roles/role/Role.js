import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useDeepCompareEffect } from "@fuse/hooks";
import Button from "@mui/material/Button";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import withReducer from "app/store/withReducer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import _ from "@lodash";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { getUser, resetUser, selectUser, newUser } from "../store/roleSlice";
import reducer from "../store";
import RoleHeader from "./RoleHeader";
import RoleInfo from "./RoleInfo";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  last_name: yup.string().required("Debe ingresar un Apellido"),
  first_name: yup.string().required("Debe ingresar un Apellido"),
  email: yup.string().email("Debe ingresar un email valido"),
});

function Role(props) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noUser, setNoUser] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  useDeepCompareEffect(() => {
    function updateUserState() {
      const { roleId } = routeParams;
      if (roleId === "new") {
        dispatch(newUser());
      } else {
        dispatch(getUser(roleId)).then((action) => {
          if (!action.payload) {
            setNoUser(true);
          }
        });
      }
    }

    updateUserState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (!user) {
      return;
    }

    reset(user);
  }, [user, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetUser());
      setNoUser(false);
    };
  }, [dispatch]);

  /**
   * Show Message if the requested users is not exists
   */
  if (noUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay pefil!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/roles"
          color="inherit"
        >
          Volver a Perfiles
        </Button>
      </motion.div>
    );
  }

  /**
   * Wait while usuario data is loading and form is setted
   */
  if (
    _.isEmpty(form) ||
    (user && routeParams.roleId !== user.id && routeParams.roleId !== "new")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<RoleHeader />}
        content={<RoleInfo />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("usersApp", reducer)(Role);
