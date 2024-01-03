import { lazy } from "react";

const Stocks = lazy(() => import("./Stocks"));
//const Stocks = lazy(() => import("../stocks/Stock"));
const Stock = lazy(() => import("./stock/Stock"));
//const Stock = lazy(() => import('../stocks/stock/Stock'))

const StocksConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "stocks",
      element: <Stocks />,

    },
    {
      path: "stocks/:stockId",
      element: <Stock />,
    },
  ],
};

export default StocksConfig;
