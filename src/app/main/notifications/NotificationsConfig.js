import { lazy } from "react";

const Notifications = lazy(() => import("./Notifications"));
const Notification = lazy(() => import("./notification/Notification"));

const NotificationsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "notifications",
      element: <Notifications />,
    },
    {
      path: "notifications/:notificationId",
      element: <Notification />,
    },
  ],
};

export default NotificationsConfig;
