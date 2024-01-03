import { lazy } from "react";

const Promotions = lazy(() => import("./Promotions"));
const Promotion = lazy(() => import("./promotion/Promotion"));

const PromotionsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "promotions",
      element: <Promotions />,
    },
    {
      path: "promotions/:promotionId",
      element: <Promotion />,
    },
  ],
};

export default PromotionsConfig;
