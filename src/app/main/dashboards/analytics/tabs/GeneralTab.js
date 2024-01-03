import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'framer-motion';
import { getWidgets, selectWidgets, selectExportedData, selectSummaryInfo } from '../store/widgetsSlice';
import VisitorsOverviewWidget from '../widgets/VisitorsOverviewWidget';
import ColumnChartUsers from '../widgets/ColumnChartUsers';

function GeneralTab() {
  const dispatch = useDispatch();
  const widgets = useSelector(selectWidgets);

  useEffect(() => {
    dispatch(getWidgets());
  }, [dispatch]);

  return (
    <FusePageSimple
      //   header={<AnalyticsDashboardAppHeader />}
      content={
        <>
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
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-32 w-full p-24 md:p-32"
                  variants={container}
                  initial="hidden"
                  animate="show">
                  <motion.div variants={item} className="sm:col-span-2 lg:col-span-4">
                    <VisitorsOverviewWidget />
                  </motion.div>

                 {/*  <motion.div variants={item} className="sm:col-span-2 lg:col-span-4 ">
                    <ColumnChartUsers
                      title_y="usuarios"
                      stacked={false}
                      //     data={widgets.activeUsers.data}
                      categories={['kioscos', 'almacenes', 'self service', 'emergentes']}
                      title={'Usuarios activos vs nuevos '}
                    />
                  </motion.div> */}
                </motion.div>
              )
            );
          }, [widgets])}
        </>
      }
    />
  );
}

export default GeneralTab;
