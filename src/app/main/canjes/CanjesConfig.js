import { lazy } from "react";

const Canjes = lazy(() => import("./Canjes"));
const Canje = lazy(() => import("./canje/Canje"));

const CanjesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "canjes",
      element: <Canjes />,

    },
    {
      path: "canjes/:canjeId",
      element: <Canje />,
    },
  ],
};

export default CanjesConfig;
