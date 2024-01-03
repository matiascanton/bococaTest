import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import NotificationsHeader from "./NotificationsHeader";
import NotificationsTable from "./NotificationsTable";

function Notifications() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<NotificationsHeader />}
      content={<NotificationsTable />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("notificationsApp", reducer)(Notifications);
