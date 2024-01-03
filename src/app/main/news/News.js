import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import NewsHeader from "./NewsHeader";
import NewsTable from "./NewsTable";

function News() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<NewsHeader />}
      content={<NewsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("newsApp", reducer)(News);
