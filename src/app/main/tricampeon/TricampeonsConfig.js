import { lazy } from "react";

const Tricampeons = lazy(() => import("./Tricampeons"));
const Tricampeon = lazy(() => import("./tricampeon/Tricampeon"));

const TricampeonsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "tricampeons",
      element: <Tricampeons />,

    },
    {
      path: "tricampeons/:tricampeonId",
      element: <Tricampeon />,
    },
  ],
};

export default TricampeonsConfig;
