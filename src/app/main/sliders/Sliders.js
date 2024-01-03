import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import SlidersHeader from "./SlidersHeader";
import SlidersTable from "./SlidersTable";

function Sliders(prop) {
  console.log('prop', prop.type)
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<SlidersHeader type={prop.type} />}
      content={<SlidersTable type={prop.type} />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("slidersApp", reducer)(Sliders);
