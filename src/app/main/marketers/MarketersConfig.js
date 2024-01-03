import { lazy } from "react";

const Marketers = lazy(() => import("./Marketers"));
//const Client = lazy(() => import("./marketer/Marketer"));

const MarketeresConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "marketers",
      element: <Marketers />,
      
    },
   /*  {
      path: "clients/:clientId",
      element: <Client />,
    }, */
  ],
};

export default MarketeresConfig;
