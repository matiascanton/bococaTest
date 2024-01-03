import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import RolesHeader from "./RolesHeader";
import RolesTable from "./RolesTable";

function RolePage() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<RolesHeader />}
      content={<RolesTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("usersApp", reducer)(RolePage);
