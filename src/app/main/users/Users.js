import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import UserssHeader from "./UsersHeader";
import UsersTable from "./UsersTable";

function UserPage() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<UserssHeader />}
      content={<UsersTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("usersApp", reducer)(UserPage);
