
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import PointsHeader from "./PointsHeader";
import PointsTable from "./PointsTable";

function Points() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<PointsHeader />}
            content={<PointsTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("pointsApp", reducer)(Points);
