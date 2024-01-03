import { lazy } from "react";

const Uploads = lazy(() => import("./Uploads"));
const Upload = lazy(() => import("./upload/Upload"));

const UploadsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "uploads",
      element: <Uploads />,

    },
    {
      path: "uploads/:uploadId",
      element: <Upload />,
    },
  ],
};

export default UploadsConfig;
