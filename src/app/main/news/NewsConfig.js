import { lazy } from "react";


const News = lazy(() => import("./News"));
const New = lazy(() => import("./new/News"));


const NewsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "news",
      element: <News />,
    },
    {
      path: "news/:newsId",
      element: <New />,
    },
  ],
};

export default NewsConfig;
