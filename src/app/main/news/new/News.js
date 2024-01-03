import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import { useDeepCompareEffect } from "@fuse/hooks";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useLocation } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  selectNews,
  setNews,
  resetNews,
  newNews,
} from "../store/newSlice";
import reducer from "../store";
import NewsHeader from "./NewsHeader";
import BasicInfo from "./BasicInfo";

const schema = yup.object().shape({
  channel: yup.string().required("Debe seleccionar un Canal"),
  gec: yup.string().required("Debe seleccionar un Gec"),
  name: yup.string().required("Debe seleccionar un Nombre"),
  due_date: yup.string().required("Debe seleccionar una fecha"),
  img_brief: yup.mixed().test("required", "You need to provide a file", (file) => {
    return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
  }),
  img_description: yup.mixed().test("required", "You need to provide a file", (file) => {
    return file && file.size; // <-- u can use this if you don't want to allow empty files to be uploaded;
  }),
});

function News(props) {
  const dispatch = useDispatch();
  const news = useSelector(selectNews);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const routeParams = useParams();
  const [noNews, setnoNews] = useState(false);
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      channel: "",
      gec: "",
      due_date: "",
    },
    resolver: yupResolver(schema),
  });
  const { reset, watch, control, onChange, formState } = methods;
  const form = watch();
  const location = useLocation();
  useDeepCompareEffect(() => {
    function updateNewsState() {
      const { newsId } = routeParams;
      if (newsId === "new") {
        dispatch(newNews());
      } else {
        dispatch(setNews(location.state));
      }
    }

    updateNewsState();
  }, [dispatch, routeParams, location]);

  useEffect(() => {
    if (!news) {
      return;
    }
    /**
     * Reset the form on news state changes
     */
    reset(news);
  }, [news, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetNews());
      setnoNews(false);
    };
  }, [dispatch]);

  if (noNews) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-col flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay News!
        </Typography>
        <Button
          className="mt-24"
          component={Link}
          variant="outlined"
          to="/news"
          color="inherit"
        >
          Volver a News
        </Button>
      </motion.div>
    );
  }

  if (
    _.isEmpty(form) ||
    (news &&
      routeParams.newsId !== news.id &&
      routeParams.newsId !== "new" &&
      routeParams.newsId !== "update" &&
      routeParams.newsId !== "view")
  ) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={<NewsHeader />}
        content={<BasicInfo params={routeParams.newsId} />}
        scroll={isMobile ? "normal" : "content"}
      />
    </FormProvider>
  );
}

export default withReducer("newsApp", reducer)(News);
