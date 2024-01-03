import { lazy } from "react";

const CompetenciaReports = lazy(() => import("./CompetenciaReports"));
const CompetenciaReport = lazy(() => import("./competenciaReport/CompetenciaReport"));

const CompetenciaReportsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "competenciaReports",
      element: <CompetenciaReports />,

    },
    {
      path: "competenciaReports/:competenciaReportId",
      element: <CompetenciaReport />,
    },
  ],
};

export default CompetenciaReportsConfig;
