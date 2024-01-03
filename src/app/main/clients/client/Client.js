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
import { useParams, Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { selectClient, getClient, resetClient } from "../store/clientSlice";
import reducer from "../store";
import ClientHeader from "./ClientHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  business_name: yup.string().required("Debe ingresar un nombre"),
});

function Client(props) {
  const dispatch = useDispatch();
  const client = useSelector(selectClient);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const routeParams = useParams();
  const [tabValue, setTabValue] = useState(0);
  const [noClient, setnoClient] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {},
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();

  /*useDeepCompareEffect(() => {
    function updateClientState() {
      const { clientId } = routeParams;

      dispatch(getClient(clientId)).then((action) => {
        if (!action.payload) {
          setnoClient(true); //seria true si no hay cliente pero lo comento y seteo en false para test
        }
      });
    }

    updateClientState();
  }, [dispatch, routeParams]);*/

  useEffect(() => {
    if (!client) {
      return;
    }
    /**
     * Reset the form on client state changes
     */
    reset(client);
  }, [client, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetClient());
      setnoClient(false);
    };
  }, [dispatch]);

  if (noClient) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay cliente!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/clients"
          color="inherit"
        >
          Volver a Clientes
        </Button>
      </motion.div>
    );
  }

  /* if (
     _.isEmpty(form) ||
     (client &&
       routeParams.clientId !== client.id &&
       routeParams.clientId !== "view")
   ) {
     return <FuseLoading />;
   }*/

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<ClientHeader />}
        content={<BasicInfo params={routeParams.clientId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("clientsApp", reducer)(Client);
