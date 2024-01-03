import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import CouponsHeader from "./CouponsHeader";
import CouponsTable from "./CouponsTable";

function Coupons() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<CouponsHeader />}
     content={<CouponsTable />} 
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("couponsApp", reducer)(Coupons);
