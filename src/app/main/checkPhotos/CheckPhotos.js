import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import CheckPhotosHeader from "./CheckPhotosHeader";
import CheckPhotosList from "./CheckPhotosList";

function CheckPhotos() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <FusePageCarded
      header={<CheckPhotosHeader />}
      content={<CheckPhotosList />}
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("checkPhotosApp", reducer)(CheckPhotos);
