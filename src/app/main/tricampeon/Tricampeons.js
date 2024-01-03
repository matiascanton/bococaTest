
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import TricampeonsHeader from "./TricampeonsHeader";
import TricampeonsTable from "./TricampeonsTable";

function Tricampeons() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<TricampeonsHeader />}
            content={<TricampeonsTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("tricampeonsApp", reducer)(Tricampeons);
