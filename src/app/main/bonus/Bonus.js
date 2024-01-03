
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import BonusesHeader from "./BonusesHeader";
import BonusesTable from "./BonusesTable";

function Bonuses() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<BonusesHeader />}
            content={<BonusesTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("bonusesApp", reducer)(Bonuses);
