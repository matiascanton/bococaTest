import { lazy } from "react";

const Misions = lazy(() => import("./Mision"));
const Mision = lazy(() => import("./mision/Mision"));

const MisionsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "misions",
      element: <Misions />,

    },
    {
      path: "misions/:misionId",
      element: <Mision />,
    },
  ],
};

export default MisionsConfig;
