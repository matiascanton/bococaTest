
import { useEffect, useState } from 'react';
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import MarketersHeader from "./MarketersHeader";
import MarketersTable from "./MarketersTable";



function Marketers() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  

  return (
    <FusePageCarded
      header={<MarketersHeader />}
       content={<MarketersTable />} 
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("marketersApp", reducer)(Marketers);
