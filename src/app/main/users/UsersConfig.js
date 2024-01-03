/* import i18next from "i18next";

import en from './i18n/en';
import tr from "./i18n/tr";
import ar from "./i18n/ar"; */
import Users from "./Users";
import User from "./user/User";
/* i18next.addResourceBundle("en", "examplePage", en);
i18next.addResourceBundle("tr", "examplePage", tr);
i18next.addResourceBundle("ar", "examplePage", ar); */

const UsersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "users",
      element: <Users />,
    },
    {
      path: "users/:userId",
      element: <User />,
    },
  ],
};

export default UsersConfig;
