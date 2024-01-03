import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import PromotionsHeader from "./PromotionsHeader";
import PromotionsTable from "./PromotionsTable";

function Promotions() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<PromotionsHeader />}
      content={<PromotionsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("promotionsApp", reducer)(Promotions);
