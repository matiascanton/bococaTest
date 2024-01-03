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
  selectBingo,
  setBingo,
  resetBingo,
  newBingo,
} from "../store/bingoSlice";
import reducer from "../store";
import BingoHeader from "./BingoHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  type: yup.string().required("Debe ingresar un tipo de promocion"),
  due_date: yup.date(),
});

function Bingo(props) {
  const dispatch = useDispatch();
  const bingo = useSelector(selectBingo);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  const routeParams = useParams();
  const [noBingo, setnoBingo] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      header: "",
      name: "",
      year_month: "",
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updateBingoState() {
      const { bingoId } = routeParams;

      if (bingoId === "new") {
        dispatch(newBingo());
      } else {
        dispatch(setBingo(location.state));
      }
    }

    updateBingoState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!bingo) {
      return;
    }
    /**
     * Reset the form on bingo state changes
     */
    reset(bingo);
  }, [bingo, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetBingo());
      setnoBingo(false);
    };
  }, [dispatch]);

  if (noBingo) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Bingos!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/bingos"
          color="inherit"
        >
          Volver a Bingos
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (bingo &&
      routeParams.bingoId !== bingo.id &&
      routeParams.bingoId !== "new" &&
      routeParams.bingoId !== "update")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<BingoHeader />}
        content={<BasicInfo params={routeParams.bingoId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("bingosApp", reducer)(Bingo);
