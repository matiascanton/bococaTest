import "@mock-api";
import BrowserRouter from "@fuse/core/BrowserRouter";
import FuseLayout from "@fuse/core/FuseLayout";
import FuseTheme from "@fuse/core/FuseTheme";
import { SnackbarProvider } from "notistack";
import { useSelector } from "react-redux";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { selectCurrentLanguageDirection } from "app/store/i18nSlice";
import { selectUser, setUser } from "app/store/userSlice";
import themeLayouts from "app/theme-layouts/themeLayouts";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import FuseAuthorization from "@fuse/core/FuseAuthorization";
import settingsConfig from "app/configs/settingsConfig";
import withAppProviders from "./withAppProviders";
import { AuthProvider } from "./auth/AuthContext";
import { useEffect, useState, useLayoutEffect } from "react";
import { appFB } from "./configs/fbServices";
import store from "./store";
import { AES, enc } from "crypto-js";
import { useDispatch } from "react-redux";
import { login } from "./../app/store/userSlice";
import {
  removeNavigationItem,
  selectNavigation,
  setNavigation,
} from "./store/fuse/navigationSlice";
import { authRoles } from "./auth";
import { useDeepCompareEffect } from "@fuse/hooks";

import { Navigate } from "react-router-dom";

const emotionCacheOptions = {
  rtl: {
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
  ltr: {
    key: "muiltr",
    stylisPlugins: [],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
};

const App = () => {
  const user = useSelector(selectUser);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);
  const dispatch = useDispatch();
  const nav = useSelector(selectNavigation);

  useEffect(() => {
    // Cargar usuario al inicio de la aplicación
    const loadUserFromLocalStorage = () => {
      if (localStorage.getItem("data") !== null) {
        const decrypted = AES.decrypt(localStorage.getItem("data"), "MYKEY91/");
        const decryptedObject = JSON.parse(decrypted.toString(enc.Utf8));
        dispatch(setUser(decryptedObject));
      }
    };

    loadUserFromLocalStorage();
  }, [dispatch]);

  useDeepCompareEffect(() => {
    function filterMenuByRole(menu, role) {
      return menu.filter((item) => {
        if (item.type === "item") {
          return role.includes(item.id);
        } else if (item.type === "collapse") {
          const filteredChildren = filterMenuByRole(item.children, role);
          item.children = filteredChildren;
          return filteredChildren.length > 0;
        } else if (item.type === "divider") {
          return role.includes(item.id);
        } else {
          return true;
        }
      });
    }

    if (user) {
      if (
        user.profile === "usuario" ||
        user.profile === "datos" ||
        user.profile === "contenido" ||
        user.profile === "estadistica" ||
        user.profile === "carga_datos"
      ) {
        dispatch(setNavigation([]));
        const filteredMenu = filterMenuByRole(nav, authRoles[user.profile]);
        dispatch(setNavigation(filteredMenu));
      }
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user.profile === "admin") {
      dispatch(removeNavigationItem("config"));
      dispatch(removeNavigationItem("divider-8"));
    }
  }, [user.profile]);

  useLayoutEffect(() => {
    const restoreHistory = () => {
      window.history.pushState(null, null, window.location.href);
    };

    // Reemplazar la entrada actual en el historial con una nueva entrada vacía
    window.history.replaceState(null, null, window.location.href);

    // Agregar evento para restaurar el comportamiento normal del botón de retroceso
    window.addEventListener("popstate", restoreHistory);

    return () => {
      // Eliminar el evento al desmontar el componente
      window.removeEventListener("popstate", restoreHistory);
    };
  }, []);

  return (
    <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
      <FuseTheme theme={mainTheme} direction={langDirection}>
        <BrowserRouter>
          <FuseAuthorization
            userRole={user.role}
            loginRedirectUrl={settingsConfig.loginRedirectUrl}
          >
            <SnackbarProvider
              maxSnack={5}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              classes={{
                containerRoot:
                  "bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99",
              }}
            >
              <FuseLayout layouts={themeLayouts} />
            </SnackbarProvider>
          </FuseAuthorization>
        </BrowserRouter>
      </FuseTheme>
    </CacheProvider>
  );
};

export default withAppProviders(App)();
