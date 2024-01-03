import { lazy } from "react";

const Coupons = lazy(() => import("./Coupons"));
const Coupon = lazy(() => import("./coupon/Coupon"));

const CouponsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "coupons",
      element: <Coupons />,
    },
    {
      path: "coupons/:couponId",
      element: <Coupon />,
    },
  ],
};

export default CouponsConfig;
