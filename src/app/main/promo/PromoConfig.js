import { lazy } from "react";

const Promo = lazy(() => import("./Promo"));

const PromoConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "promo",
      element: <Promo />,
    },
  ],
};

export default PromoConfig;
