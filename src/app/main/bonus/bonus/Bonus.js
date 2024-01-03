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
  selectBonus,
  setBonus,
  resetBonus,
  newBonus,
} from "../store/bonusSlice";
import reducer from "../store";
import BonusHeader from "./BonusHeader";
import BasicInfo from "./BasicInfo";

/*const schema = yup.object().shape({
  image: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
});*/

function Bonus(props) {
  const dispatch = useDispatch();
  const bonus = useSelector(selectBonus);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noBonus, setnoBonus] = useState(false);
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
    function updateBonusState() {
      const { bonusId } = routeParams;

      if (bonusId === "new") {
        dispatch(newBonus());
      } else {
        dispatch(setBonus(location.state));
      }
    }

    updateBonusState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!bonus) {
      return;
    }
    /**
     * Reset the form on bonus state changes
     */
    reset(bonus);
  }, [bonus, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetBonus());
      setnoBonus(false);
    };
  }, [dispatch]);

  if (noBonus) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Bonuses
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/bonuses"
          color="inherit"
        >
          Volver a Bonuses
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (bonus &&
      routeParams.bonusId !== bonus.id &&
      routeParams.bonusId !== "new" &&
      routeParams.bonusId !== "update" &&
      routeParams.bonusId !== "view")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<BonusHeader params={routeParams.bonusId} />}
        content={<BasicInfo params={routeParams.bonusId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("bonusesApp", reducer)(Bonus);
