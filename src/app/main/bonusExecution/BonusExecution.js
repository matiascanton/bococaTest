
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import BonusExecutionsHeader from "./BonusExecutionsHeader";
import BonusExecutionsTable from "./BonusExecutionsTable";

function BonusExecutions() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<BonusExecutionsHeader />}
            content={<BonusExecutionsTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("bonusExecutionsApp", reducer)(BonusExecutions);
