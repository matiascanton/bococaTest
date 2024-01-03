import { useEffect, useState } from "react";
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import BonusTab from "./tabs/BonusTab";
import { makeStyles } from "@mui/styles";
import AnalyticsDashboardAppHeader from "./AnalyticsDashboardAppHeader";
import ImperdiblesTab from "./tabs/ImperdiblesTab";
import MisionesTab from "./tabs/MisionesTab";
import GeneralTab from "./tabs/GeneralTab";
import CanjeTab from "./tabs/CanjeTab";
import CompetenciasTab from "./tabs/CompetenciasTab";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#f1f5f9",
    marginBottom: "12px",
  },
});

function AnalyticsDashboard() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [tabValue, setTabValue] = useState(0);
  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  const classes = useStyles();

  return (
    <FusePageCarded
      header={<AnalyticsDashboardAppHeader />}
      content={
        <div className={classes.root}>
          {/*   </div>content={ <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0"> */}

       {/*    <Tabs
            style={{ position: "sticky", top: "0", zIndex: "100" }}
            // tabItemContainerStyle={{ position: "fixed", top: "0" }}
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            variant="standard"
            scrollButtons={false}
            //className="w-full px-24 -mx-4 min-h-40 mb-10 bgColor:blue"
            className={classes.root}
            classes={{
              indicator: "flex justify-center bg-transparent w-full h-full",
            }}
            TabIndicatorProps={{
              children: <Box sx={{ bgcolor: "text.disabled" }} className="w-full h-full rounded-full opacity-20" />,
            }}
          >
           <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12" disableRipple label="General" />
              <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12" disableRipple label="Imperdibles" />
            <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12" disableRipple label="Misiones" />
            <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12" disableRipple label="Bonus" />
            <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12" disableRipple label="Canje" />
            <Tab className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12" disableRipple label="Competencias" /> 
          </Tabs>
        */}   {tabValue === 0 && <GeneralTab />}
         {tabValue === 1 && <ImperdiblesTab />}
          {tabValue === 2 && <MisionesTab />}
          {tabValue === 3 && <BonusTab />}
          {tabValue === 4 && <CanjeTab />}
          {tabValue === 5 && <CompetenciasTab />} 
        </div>
      }
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("analyticsDashboardApp", reducer)(AnalyticsDashboard);
