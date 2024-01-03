import ResetPage from "./ResetPage";
import authRoles from "../../auth/authRoles";

const ResetConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },

  routes: [
    {
      path: "reset-pass",
      element: <ResetPage />,
    },
  ],
};

export default ResetConfig;
