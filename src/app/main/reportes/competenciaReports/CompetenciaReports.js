
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import CompetenciaReportsHeader from "./CompetenciaReportsHeader";
import CompetenciaReportsTable from "./CompetenciaReportsTable";

function CompetenciaReports() {
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));



    return (
        <FusePageCarded
            header={<CompetenciaReportsHeader />}
            content={<CompetenciaReportsTable />}
            scroll={isMobile ? "normal" : "content"}
        />
    );
}

export default withReducer("competenciaReportsApp", reducer)(CompetenciaReports);
