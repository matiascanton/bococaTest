
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import ImperdiblesHeader from "./ImperdiblesHeader";
import ImperdiblesTable from "./ImperdiblesTable";

function Imperdibles() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<ImperdiblesHeader />}
            content={<ImperdiblesTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("imperdiblesApp", reducer)(Imperdibles);
