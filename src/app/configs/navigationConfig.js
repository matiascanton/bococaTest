import i18next from "i18next";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";
import authRoles from '../auth/authRoles';

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

const navigationConfig = [

  {
    id: 'appsf',
    title: 'PANEL ADMINISTRADOR',
    // subtitle: 'Custom made application designs',
    type: "collapse",
    icon: 'heroicons-outline:template',
    // translate: 'APPLICATIONS',
    // auth: authRoles.admin, 
    children: [
      {
        id: "dashboards",
        title: "Dashboard",
        //    translate: "notifications",
        type: "item",
        icon: "heroicons-outline:chart-pie",
        url: "dashboards",
        end: true,
      },
      {
        id: "uploads",
        title: "Carga de Datos",
        type: "item",
        icon: "heroicons-outline:cloud-upload",
        url: "uploads",
        end: true,
      },

      {
        id: 'appsclien',
        title: 'Reportes',
        // subtitle: 'Custom made application designs',
        type: "collapse",
        icon: 'heroicons-outline:home',
        // translate: 'APPLICATIONS',
        children: [
          {
            id: "competenciaReports",
            title: "Competencias",
            type: "item",
            icon: "heroicons-outline:clipboard-check",
            url: "competenciaReports",
            end: true,
          },

        ]
      },


    ]
  },


  {
    id: "clients",
    title: "CLIENTES",
    // translate: "Clients",
    //auth: authRoles.admin,
    type: "item",
    icon: "heroicons-outline:user-group",
    url: "clients",
    end: true,
  },
  {
    id: "marketers",
    title: "COMERCIALIZADORES",
    type: "item",
    icon: "heroicons-outline:user-group",
    url: "marketers",
    end: true,
  },

  {
    id: 'appsc',
    title: 'APP CLIENTES',
    // subtitle: 'Custom made application designs',
    type: "collapse",
    icon: 'heroicons-outline:device-mobile',
    // translate: 'APPLICATIONS',
    children: [
      {
        id: "sliders",
        title: "Banner Home",
        //    translate: "Sliders",
        type: "item",
        icon: "heroicons-outline:collection",
        url: "sliders",

      },
      {
        id: "notifications",
        title: "Notificaciones",
        //    translate: "notifications",
        type: "item",
        icon: "heroicons-outline:speakerphone",
        url: "notifications",
        end: true,
      },

      {
        id: "News",
        title: "Novedades",
        //    translate: "News",
        type: "item",
        icon: "heroicons-outline:newspaper",
        url: "news",
        end: true,
      },
      {
        id: "misions",
        title: "Misiones",
        type: "item",
        icon: "material-outline:auto_awesome",
        url: "misions",
        end: true,
      },
      {
        id: "imperdibles",
        title: "Imperdibles",
        // translate: "Clients",
        type: "item",
        icon: "material-outline:stars",
        url: "imperdibles",
        end: true,
      },
      {
        id: 'bonus',
        title: 'Bonus',
        type: "collapse",
        icon: 'material-outline:bookmark_add',
        children: [
          {
            id: "bonusesQuestion",
            title: "Bonus Preguntas",
            type: "item",
            icon: "material-outline:question_answer",
            url: "bonuses",
            end: true,
          },
          {
            id: "bonusExecutions",
            title: "Bonus Camara",
            type: "item",
            icon: "material-outline:add_a_photo",
            url: "bonusExecutions",
            end: true,
          },
          {
            id: "checkPhotos",
            title: "Validar Imagenes",
            type: "item",
            icon: "material-outline:image_search",
            url: "checkPhotos",
            end: true,
          },
        ]
      },
      {
        id: "tricampeons",
        title: "Competencia",
        // translate: "Clients",
        type: "item",
        icon: "heroicons-outline:star",
        url: "tricampeons",
        end: true,
      },
      {
        id: "redentions",
        title: "Redenciones QR",
        //    translate: "notifications",
        type: "item",
        icon: "heroicons-outline:qrcode",
        url: "redentions",
        end: true,
      },
      {
        id: "bingos-image",
        title: "Imágenes",
        type: "item",
        icon: "heroicons-outline:photograph",
        url: "bingos/uploadImage",
        end: true,
      },
      {
        id: "prizes",
        title: "Catálogo de Premios",
        type: "item",
        icon: "heroicons-outline:gift",
        url: "prizes",
        end: true,
      },
      {
        id: "points",
        title: "Puntos Adicionales",
        type: "item",
        icon: "material-outline:add_reaction",
        url: "points",
        end: true,
      },
      {
        id: "canjes",
        title: "Canjes",
        type: "item",
        icon: "material-outline:change_circle",
        url: "canjes",
        end: true,
      },
      {
        id: "stocks",
        title: "Stock",
        type: "item",
        icon: "feather:box",
        url: "stocks",
        end: true,
      },

    ]
  },

  {
    id: 'appsco',
    title: 'APP CONSUMIDORES',
    // subtitle: 'Custom made application designs',
    type: "collapse",
    icon: 'heroicons-outline:device-mobile',
    // translate: 'APPLICATIONS',
    children: [
      {
        id: "slidersConsumer",
        title: "Banner Home",
        //    translate: "Sliders",
        type: "item",
        icon: "heroicons-outline:collection",
        url: "slidersConsumer",

      },
      {
        id: "promo",
        title: "Promociones",
        //    translate: "notifications",
        type: "item",
        icon: "material-outline:add_shopping_cart",
        url: "promotions",
        end: true,
      },
      {
        id: "coupons",
        title: "Cupones",
        //   translate: "Coupons",
        type: "item",
        icon: "heroicons-outline:tag",
        url: "coupons",
        end: true,
      },
      {
        id: "wallet",
        title: "Billetera Envases",
        // translate: "Clients",
        type: "item",
        icon: "material-outline:account_balance_wallet",
        //url: "clients",
        end: true,
      },
    ]
  },

  /*{
    id: "web",
    title: "WEB COMERCIALES",
    // translate: "Clients",
    type: "item",
    icon: "heroicons-outline:view-grid",
    // url: "clients",
    end: true,
  },*/
  /*{
    id: "metrics",
    title: "METRICAS",
    // translate: "Clients",
    type: "item",
    icon: "heroicons-outline:chart-pie",
    //url: "clients",
    end: true,
  },
  {
    id: 'divider-7',
    type: 'divider',
  },*/
  /*{
    id: "wallet",
    title: "BILLETERA VIRTUAL",
    // translate: "Clients",
    type: "item",
    icon: "heroicons-outline:currency-dollar",
    //url: "clients",
    end: true,
  },
  {
    id: 'divider-8',
    type: 'divider',
  },*/
  {
    id: "config",
    title: "CONFIGURACION",
    //translate: "Bingos",
    type: "collapse",
    icon: "heroicons-outline:cog",
    //end: true,
    children: [
      {
        id: "users",
        title: "Usuarios",
        //translate: "Users",
        type: "item",
        url: "users",
        end: true,
      },
      {
        id: "roles",
        title: "Perfiles",
        //translate: "Users",
        type: "item",
        url: "roles",
        end: true,
      },
    ],
  },

  {
    id: "logout",
    title: "SALIR",
    icon: "heroicons-outline:logout",
    url: "sign-out",
    type: "item",
    end: true,

  },
];

export default navigationConfig;
