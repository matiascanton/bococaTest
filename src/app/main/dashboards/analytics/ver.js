


const currentDate = new Date().toISOString().slice(0, 10);
const currentMonthData = filteredData.filter(
  (item) => item.fecha.slice(0, 7) === currentDate.slice(0, 7)
);

const currentMonthSeriesData = currentMonthData.map((item) => ({
  x: new Date(item.fecha).getTime(),
  y: item.usuarios,
}));

const groupedData = currentMonthSeriesData.reduce((acc, item) => {
  const date = item.x;
  if (acc[date]) {
    acc[date].y += item.y;
  } else {
    acc[date] = item;
  }
  return acc;
}, {});

const seriesData = Object.values(groupedData);


/* 
    if (currentRange === "histórico") {
      setSeries([{ data: historicalSeriesData }]);
    } else {
      setSeries([{ data: seriesData }]);
    } */




    const uniqueMonths = [
      ...new Set(filteredData.map((item) => item.fecha.slice(0, 7))),
    ];


    //agrupa los datos por mes
    const historicalSeriesData = uniqueMonths.map((month) => {
      const usuariosPorMes = filteredData
        .filter((item) => item.fecha.slice(0, 7) === month)
        .reduce((total, item) => total + item.usuarios, 0);
      return {
        x: new Date(month).getTime(),
        y: usuariosPorMes,
      };
    });



    /////////////
    const historicalData = filteredData.filter((item) => {
      const year = new Date(item.fecha).getFullYear();
      return year < currentYear;
    });

    const currentYearData = filteredData.filter((item) => {
      const year = new Date(item.fecha).getFullYear();
      return year === currentYear;
    });

      // Genera un arreglo de días del mes seleccionado
      const daysOfMonth = Array.from({ length: 31 }, (_, i) =>
        (i + 1).toString()
      ); // Considera hasta 31 días
      console.log(daysOfMonth)
      setSelectedMonthDays(daysOfMonth);