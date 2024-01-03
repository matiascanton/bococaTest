import { lazy } from 'react';

const AnalyticsDashboard = lazy(() => import('./analytics/AnalyticsDashboard'));

const AnalyticsDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboards',
      element: <AnalyticsDashboard />,
    },
  ],
};

export default AnalyticsDashboardAppConfig;
