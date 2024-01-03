import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from "@lodash";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { motion } from "framer-motion";
import { getWidgets, selectWidgets } from "../store/widgetsSlice";
import ColumnChartMisionesProduct_Partic from "../widgets/ColumnChartMisionesProduct_Partic";
import ColumnMisionesCompletaron from "../widgets/ColumnMisionesCompletaron";
import ColumnMisionesParticipantes from "../widgets/ColumnMisionesParticipantes";

function MisionesTab() {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  return (
    <FusePageSimple
      //   header={<AnalyticsDashboardAppHeader />}
      content={
        <div style={{ backgroundColor: "#f1f5f9" }} className=" w-full">
          {useMemo(() => {
            const container = {
              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            };

            const item = {
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            };

            return (
              !_.isEmpty(widgets) && (
                <motion.div
                  className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-32 w-full p-24 md:p-32"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-4">
                    <ColumnMisionesParticipantes />
                  </motion.div>
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-4">
                    <ColumnMisionesCompletaron />
                  </motion.div>
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-4">
                    <ColumnChartMisionesProduct_Partic />
                  </motion.div>
                </motion.div>
              )
            );
          }, [widgets])}
        </div>
      }
    />
  );
}

export default MisionesTab;
