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
  selectBonusExecution,
  setBonusExecution,
  resetBonusExecution,
  newBonusExecution,
} from "../store/bonusExecutionSlice";
import reducer from "../store";
import BonusExecutionHeader from "./BonusExecutionHeader";
import BasicInfo from "./BasicInfo";

/*const schema = yup.object().shape({
  image: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
});*/

function BonusExecution(props) {
  const dispatch = useDispatch();
  const bonusExecution = useSelector(selectBonusExecution);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noBonusExecution, setnoBonusExecution] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      title: '',
    },
    //resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateBonusExecutionState() {
      const { bonusExecutionId } = routeParams;

      if (bonusExecutionId === "new") {
        dispatch(newBonusExecution());
      } else {
        dispatch(setBonusExecution(location.state));
      }
    }

    updateBonusExecutionState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!bonusExecution) {
      return;
    }
    /**
     * Reset the form on bonusExecution state changes
     */
    reset(bonusExecution);
  }, [bonusExecution, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetBonusExecution());
      setnoBonusExecution(false);
    };
  }, [dispatch]);

  if (noBonusExecution) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay BonusExecutions
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/bonusExecutions"
          color="inherit"
        >
          Volver a BonusExecutions
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (bonusExecution &&
      routeParams.bonusExecutionId !== bonusExecution.id &&
      routeParams.bonusExecutionId !== "new" &&
      routeParams.bonusExecutionId !== "update" &&
      routeParams.bonusExecutionId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<BonusExecutionHeader params={routeParams.bonusExecutionId} />}
        content={<BasicInfo params={routeParams.bonusExecutionId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("bonusExecutionsApp", reducer)(BonusExecution);
