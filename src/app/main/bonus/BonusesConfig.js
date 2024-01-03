import { lazy } from "react";

const Bonuses = lazy(() => import("./Bonus"));
//const Bonuses = lazy(() => import("../bonuses/Bonus"));
const Bonus = lazy(() => import("./bonus/Bonus"));
//const Bonus = lazy(() => import('../bonuses/bonus/Bonus'))

const BonusesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "bonuses",
      element: <Bonuses />,

    },
    {
      path: "bonuses/:bonusId",
      element: <Bonus />,
    },
  ],
};

export default BonusesConfig;
