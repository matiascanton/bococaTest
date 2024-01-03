import { combineReducers } from "@reduxjs/toolkit";

import competenciaReports from "./competenciaReportsSlice";
import competenciaReport from "./competenciaReportSlice";

const reducer = combineReducers({
  competenciaReports,
  competenciaReport,
});

export default reducer;
