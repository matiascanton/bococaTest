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
  selectCoupon,
  setCoupon,
  resetCoupon,
  newCoupon,
} from "../store/couponSlice";
import reducer from "../store";
import CouponHeader from "./CouponHeader";
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

function Coupon(props) {
  const dispatch = useDispatch();
  const coupon = useSelector(selectCoupon);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noCoupon, setnoCoupon] = useState(false);
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
    function updateCouponState() {
      const { couponId } = routeParams;

      if (couponId === "new") {
        dispatch(newCoupon());
      } else {
        dispatch(setCoupon(location.state));
      }
    }

    updateCouponState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!coupon) {
      return;
    }
    /**
     * Reset the form on coupon state changes
     */
    reset(coupon);
  }, [coupon, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetCoupon());
      setnoCoupon(false);
    };
  }, [dispatch]);

  if (noCoupon) {
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
          to="/coupons"
          color="inherit"
        >
          Volver a Cupones
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (coupon &&
      routeParams.couponId !== coupon.id &&
      routeParams.couponId !== "new" &&
      routeParams.couponId !== "update")
  ) {
    return <FuseLoading />;
  }
  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<CouponHeader />}
        content={<BasicInfo params={routeParams.couponId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("couponsApp", reducer)(Coupon);
