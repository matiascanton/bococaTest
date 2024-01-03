
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import MisionsHeader from "./MisionsHeader";
import MisionsTable from "./MisionsTable";

function Misions() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<MisionsHeader />}
            content={<MisionsTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("misionsApp", reducer)(Misions);
