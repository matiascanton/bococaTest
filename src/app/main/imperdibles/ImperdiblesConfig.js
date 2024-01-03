import { lazy } from "react";

const Imperdibles = lazy(() => import("./Imperdible"));
const Imperdible = lazy(() => import("./imperdible/Imperdible"));

const ImperdiblesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "imperdibles",
      element: <Imperdibles />,

    },
    {
      path: "imperdibles/:imperdibleId",
      element: <Imperdible />,
    },
  ],
};

export default ImperdiblesConfig;
