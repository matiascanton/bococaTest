
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import PrizesHeader from "./PrizesHeader";
import PrizesTable from "./PrizesTable";

function Prizes() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<PrizesHeader />}
            content={<PrizesTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("prizesApp", reducer)(Prizes);
