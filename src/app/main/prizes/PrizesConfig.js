import { lazy } from "react";

const Prizes = lazy(() => import("./Prizes"));
const Prize = lazy(() => import("./prize/Prize"));

const PrizesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "prizes",
      element: <Prizes />,

    },
    {
      path: "prizes/:prizeId",
      element: <Prize />,
    },
  ],
};

export default PrizesConfig;
