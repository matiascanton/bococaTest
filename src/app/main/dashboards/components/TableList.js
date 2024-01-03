import React from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { lighten } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

function TableList({ exportedData, showEmptyMessage }) {
  const column = ['Fecha', 'Canal', 'Gec', 'sku', 'Ventas'];
  if (exportedData.length === 0 && showEmptyMessage) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full mt-24">
        <Typography color="text.secondary" variant="h5">
          No se encontraron Datos
        </Typography>
      </motion.div>
    );
  }

  return (
    <TableContainer component={Paper} className="mt-24">
      <Table>
        <TableHead>
          <TableRow>
            {column.map((col) => {
              return (
                <TableCell
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? lighten(theme.palette.background.default, 0.4)
                        : lighten(theme.palette.background.default, 0.02),
                  }}
                  key={col}>
                  {col}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Filas de datos */}
          {exportedData.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell>{row.fecha}</TableCell>
              <TableCell>{row.canal}</TableCell>
              <TableCell>{row.gec}</TableCell>
              <TableCell>{row.sku}</TableCell>
              <TableCell>{row.usuarios}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableList;
