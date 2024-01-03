import { lazy } from "react";

const BonusExecutions = lazy(() => import("./BonusExecution"));
//const BonusExecutions = lazy(() => import("../bonusExecutions/Bonus"));
const BonusExecution = lazy(() => import("./bonusExecution/BonusExecution"));
//const BonusExecution = lazy(() => import('../bonusExecutions/bonusExecution/BonusExecution'))

const BonusExecutionsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "bonusExecutions",
      element: <BonusExecutions />,

    },
    {
      path: "bonusExecutions/:bonusExecutionId",
      element: <BonusExecution />,
    },
  ],
};

export default BonusExecutionsConfig;
