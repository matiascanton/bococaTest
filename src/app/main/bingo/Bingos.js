import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import BingosHeader from "./BingosHeader";
import BingosTable from "./BingosTable";

function Bingos() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<BingosHeader />}
      content={<BingosTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("bingosApp", reducer)(Bingos);
