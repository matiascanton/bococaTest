import { lazy } from "react";

const Points = lazy(() => import("./Points"));
const Point = lazy(() => import("./point/Point"));

const PointsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "points",
      element: <Points />,

    },
    {
      path: "points/:pointId",
      element: <Point />,
    },
  ],
};

export default PointsConfig;
