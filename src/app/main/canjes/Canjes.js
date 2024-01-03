
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import CanjesHeader from "./CanjesHeader";
import CanjesTable from "./CanjesTable";

function Canjes() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<CanjesHeader />}
            content={<CanjesTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("canjesApp", reducer)(Canjes);
