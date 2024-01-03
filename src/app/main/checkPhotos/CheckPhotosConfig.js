import { lazy } from "react";

const CheckPhotos = lazy(() => import("./CheckPhotos"));
const CheckPhoto = lazy(() => import("./checkPhoto/CheckPhoto"));

const CheckPhotosConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "checkPhotos",
      element: <CheckPhotos />,
    },
    {
      path: "checkPhotos/:checkPhotoId",
      element: <CheckPhoto />,
    },
  ],
};

export default CheckPhotosConfig;
