import themesConfig from "app/configs/themesConfig";
import i18n from "../../i18n";


export const BASE_URL = "https://femsa-api.vercel.app";
export const API_VERSION = "/api/v2";
export const API_VERSION3 = "/api/v3";
export const TOKEN = `Bearer JOSEBOZZONE`;
export const TOKEN_LOGIN = "Bearer FeMsA@2022"

const settingsConfig = {
  layout: {
    style: "layout1", // layout1 layout2 layout3
    config: {}, // checkout default layout configs at app/theme-layouts for example  app/theme-layouts/layout1/Layout1Config.js
  },
  customScrollbars: true,
  direction: i18n.dir(i18n.options.lng) || "ltr", // rtl, ltr
  theme: {
    main: themesConfig.default,
    navbar: themesConfig.defaultDark,
    toolbar: themesConfig.default,
    footer: themesConfig.defaultDark,
  },
  /*
   To make whole app auth protected by default set defaultAuth:['admin','staff','user']
   To make whole app accessible without authorization by default set defaultAuth: null
   *** The individual route configs which has auth option won't be overridden.
   */
  defaultAuth: ["admin"],
  /*
    Default redirect url for the logged-in user,
   */
  loginRedirectUrl: "/",
};

export default settingsConfig;
