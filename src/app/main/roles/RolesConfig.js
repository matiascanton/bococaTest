/* import i18next from "i18next";

import en from './i18n/en';
import tr from "./i18n/tr";
import ar from "./i18n/ar"; */
import Roles from "./Roles";
import Role from "./role/Role";
/* i18next.addResourceBundle("en", "examplePage", en);
i18next.addResourceBundle("tr", "examplePage", tr);
i18next.addResourceBundle("ar", "examplePage", ar); */

const RolesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "roles",
      element: <Roles />,
    },
    {
      path: "roles/:roleId",
      element: <Role />,
    },
  ],
};

export default RolesConfig;
