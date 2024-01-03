
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import UploadsHeader from "./UploadsHeader";
import UploadsTable from "./UploadsTable";

function Uploads() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<UploadsHeader />}
            content={<UploadsTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("uploadsApp", reducer)(Uploads);
