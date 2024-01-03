import { useEffect, useState } from "react";
import FusePageCarded from "@fuse/core/FusePageCarded";
import withReducer from "app/store/withReducer";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import reducer from "./store";
import PromoHeader from "./PromoHeader";
import PromoTable from "./PromoTable";
import PromoSummary from "./PromoSummary";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";

function Promo() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [tabValue, setTabValue] = useState(0);
  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  return (
    <FusePageCarded
      header={<PromoHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons={false}
            className="w-full px-24 -mx-4 min-h-40 mb-10"
            classes={{
              indicator: "flex justify-center bg-transparent w-full h-full",
            }}
            TabIndicatorProps={{
              children: (
                <Box
                  sx={{ bgcolor: "text.disabled" }}
                  className="w-full h-full rounded-full opacity-20"
                />
              ),
            }}
          >
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Cuenta Corriente"
            />
            <Tab
              className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
              disableRipple
              label="Resumen"
            />
          </Tabs>
          {tabValue === 0 && <PromoTable />}
          {tabValue === 1 && <PromoSummary />}
        </div>
      }
      scroll={isMobile ? "normal" : "content"}
    />
  );
}

export default withReducer("promoApp", reducer)(Promo);
