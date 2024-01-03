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
  selectPromotion,
  setPromotion,
  resetPromotion,
  newPromotion,
} from "../store/promotionSlice";
import reducer from "../store";
import PromotionHeader from "./PromotionHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  img_brief: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
  img_description: yup
    .mixed()
    .test("required", "You need to provide a file", (file) => {
      return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
    }),
});

function Promotion(props) {
  const dispatch = useDispatch();
  const promotion = useSelector(selectPromotion);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noPromotion, setnoPromotion] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      img_brief: "",
      img_description: "",
      enabled: false,
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();

  useDeepCompareEffect(() => {
    function updatePromotionState() {
      const { promotionId } = routeParams;

      if (promotionId === "new") {
        dispatch(newPromotion());
      } else {
        dispatch(setPromotion(location.state));
      }
    }

    updatePromotionState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!promotion) {
      return;
    }
    /**
     * Reset the form on promotion state changes
     */
    reset(promotion);
  }, [promotion, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetPromotion());
      setnoPromotion(false);
    };
  }, [dispatch]);

  if (noPromotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay Cupones!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/promotions"
          color="inherit"
        >
          Volver a Cupones
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (promotion &&
      routeParams.promotionId !== promotion.id &&
      routeParams.promotionId !== "new" &&
      routeParams.promotionId !== "update")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<PromotionHeader />}
        content={<BasicInfo params={routeParams.promotionId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("promotionsApp", reducer)(Promotion);
