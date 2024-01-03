import { lazy } from "react";

const Sliders = lazy(() => import("./Sliders"));
const Slider = lazy(() => import("./slider/Slider"));

const SlidersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "sliders",
      element: <Sliders type={'clients'} />,
    },
    {
      path: "sliders/:sliderId",
      element: <Slider type={'clients'} />,
    },
  ],
};

export default SlidersConfig;
