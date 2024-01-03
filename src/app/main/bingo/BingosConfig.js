import { lazy } from "react";

const Bingos = lazy(() => import("./Bingos"));
const Bingo = lazy(() => import("./bingo/Bingo"));
const UploadImage = lazy(() => import("./UploadImages/UploadImage"));

const BingosConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "bingos",
      element: <Bingos />,
    },
    {
      path: "bingos/:bingoId",
      element: <Bingo />,
    },
    {
      path: "bingos/uploadImage",
      element: <UploadImage />,
    },  ]
};

export default BingosConfig;
