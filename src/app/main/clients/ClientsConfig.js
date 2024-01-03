import { lazy } from "react";

const Clients = lazy(() => import("./Clients"));
const Client = lazy(() => import("./client/Client"));

const ClientsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "clients",
      element: <Clients />,
      
    },
    {
      path: "clients/:clientId",
      element: <Client />,
    },
  ],
};

export default ClientsConfig;
