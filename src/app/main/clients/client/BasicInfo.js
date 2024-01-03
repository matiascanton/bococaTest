
import { useEffect, useState } from 'react';
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { ToggleButtonGroup, ToggleButton, Button, Typography, Grid, Select, MenuItem, Tab, Tabs, Box, VariablesTab, Paper, Table, TableBody, TableHead, TableCell, TableRow } from "@mui/material";
import moment from "moment";
import RadialBar from '../graphs/RadialBar';
import { useDispatch, useSelector } from "react-redux";
import { getCanjes } from '../store/clientSlice';
import QRCode from 'qrcode.react';

function BasicInfo(props) {
  const methods = useFormContext();
  const dispatch = useDispatch();
  const { control, formState } = methods;
  const { errors } = formState;
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [dataClient, setDataClient] = useState([
    { id: 1, trx: 123, description: 'Coca', points: 50, created_at: '10-05-23' },
    { id: 2, trx: 231, description: 'Fanta', points: 100, created_at: '10-05-23' },
    { id: 3, trx: 233, description: 'Sprite', points: 250, created_at: '10-05-23' },
    { id: 4, trx: 344, description: 'Coca', points: 150, created_at: '10-05-23' },
    { id: 5, trx: 545, description: 'Agua', points: 350, created_at: '10-05-23' },
    { id: 6, trx: 344, description: 'Pepsi', points: 500, created_at: '10-05-23' }])
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });
  const [canjes, setCanjes] = useState()
  const [types, setTypes] = useState('mes')
  const {
    id
  } = control._formValues;

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  useEffect(() => {
    if (tabValue === 1) {
      dispatch(getCanjes()).then((resp) => {
        setCanjes(resp.payload);
        console.log('test', resp.payload)
      });
    }
  }, [dispatch, tabValue]);

  return (
    <div className="md-40 ml-40 mt-20">
      <Grid
        container
        padding={3}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1 }}

      >
        <Tabs
          value={tabValue}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="w-full px-24 -mx-4 min-h-40 mb-10"
          classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
          TabIndicatorProps={{
            children: (
              <Box
                sx={{ bgcolor: 'text.disabled' }}
                className="w-full h-full rounded-full opacity-20"
              />
            ),
          }}
        >
          <Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Perfil del Cliente"
          />
          {/*<Tab
            className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
            disableRipple
            label="Estadisticas del Cliente"
          />*/}

        </Tabs>
      </Grid>
      {tabValue === 1 &&
        <>

          <Grid
            container
            padding={1}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
            alignItems="center"
          >
            <Grid item xs={4} md={2}>
              <ToggleButtonGroup
                value={types}
                exclusive
                onChange={(event) => {
                  setTypes(event.target.value); // actualizar el estado del tipo seleccionado
                }}
                aria-label="mes or ano"
                id='type'
              >
                <ToggleButton value="mes" aria-label="Mes" >
                  Mes
                </ToggleButton>
                <ToggleButton value="ano" aria-label="Año" >
                  Año
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={6} md={10} ></Grid>
            <Grid item xs={6} md={2} >
              <Paper elevation={3} className='p-20' style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div >

                  <Typography className=" text-36 sm:text-36 truncate font-bold" color="red" textAlign="center">1250</Typography>
                  <Typography className=" text-14 sm:text-16 truncate " color="red" textAlign="center">Puntos</Typography>
                </div>

              </Paper>

            </Grid>
            <Grid item xs={6} md={1} ></Grid>
            <Grid item xs={6} md={3} >
              <RadialBar
                title={'Imperdible'}
                data={70}

              />
            </Grid>
            <Grid item xs={6} md={3} >
              <RadialBar
                title={'Misiones'}
                data={30}

              />
            </Grid>
            <Grid item xs={6} md={3} >
              <RadialBar
                title={'Competencia'}
                data={45}

              />
            </Grid>
            <Grid item xs={6} md={12} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">Canjes</Typography>
              <Table stickyHeader className="min-w-xl " aria-labelledby="tableTitle">
                <TableHead>
                  <TableRow>
                    <TableCell>TRX</TableCell>
                    <TableCell>Descripcion</TableCell>
                    <TableCell>Puntos</TableCell>
                    <TableCell>Fecha</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_.orderBy(dataClient, [(o) => o[order.id]], [order.direction])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((d) => {
                      return (
                        <>
                          <TableRow>
                            <TableCell
                              className="p-4 md:p-16 "
                              component="th"
                              scope="row"
                              key={d.id}
                            >
                              {d.trx}
                            </TableCell>
                            <TableCell
                              className="p-4 md:p-16 "
                              component="th"
                              scope="row"
                            >
                              {d.description}
                            </TableCell>
                            <TableCell
                              className="p-4 md:p-16 "
                              component="th"
                              scope="row"
                            >
                              {d.points}
                            </TableCell>
                            <TableCell
                              className="p-4 md:p-16 "
                              component="th"
                              scope="row"
                            >
                              {d.created_at}
                            </TableCell>
                          </TableRow>

                        </>
                      );
                    })}
                </TableBody>
              </Table>
            </Grid>

          </Grid>
        </>
      }
      {tabValue === 0 &&
        <>
          <Grid
            container
            padding={1}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
            alignItems="center"
            justifyItems="center"
          >
            <Grid item xs={6} md={12} style={{ height: '200px', display: 'flex', justifyContent: 'center', alignContent: 'center' }} >
              <Controller
                name="qr_code"
                control={control}
                render={({ field }) => (
                  <QRCode style={{ width: '200px', height: '200px' }} value={field} />
                )}
              />
            </Grid>
          </Grid>
          <Grid
            container
            padding={5}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 2 }}
            alignItems="center"
          >
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Cliente BLIVE
              </Typography>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.id}
                    required
                    helperText={errors?.id?.message}
                    id="id"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Razon Social
              </Typography>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.address}
                    required
                    helperText={errors?.address?.message}
                    id="address"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Cliente FEMSA
              </Typography>
              <Controller
                name="femsa_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.femsa_id}
                    required
                    helperText={errors?.femsa_id?.message}

                    id="femsa_id"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Fecha de Creacion
              </Typography>
              <Controller
                name="created_at"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.created_at}
                    required
                    value={moment(field.value).format('DD-MM-YYYY')}
                    helperText={errors?.created_at?.message}
                    id="created_at"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                CUIT
              </Typography>
              <Controller
                name="cuit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.cuit}
                    required
                    helperText={errors?.cuit?.message}

                    id="cuit"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Fecha de Registro
              </Typography>
              <Controller
                name="created_at"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.created_at}
                    required
                    helperText={errors?.created_at?.message}
                    value={moment(field.value).format('DD-MM-YYYY')}
                    id="created_at"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Domicilio
              </Typography>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.address}
                    required
                    helperText={errors?.address?.message}

                    id="address"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Codigo Canje
              </Typography>
              <Controller
                name="operative_unit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.operative_unit}
                    required
                    helperText={errors?.operative_unit?.message}
                    id="operative_unit"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Localidad
              </Typography>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.city}
                    required
                    helperText={errors?.city?.message}

                    id="city"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Franquicia
              </Typography>
              <Controller
                name="franchise"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.franchise}
                    required
                    helperText={errors?.franchise?.message}

                    id="franchise"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Telefono
              </Typography>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.mobile}
                    required
                    helperText={errors?.mobile?.message}

                    id="mobile"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Tipo de Atencion
              </Typography>
              <Controller
                name="attention_type"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.attention_type}
                    required
                    helperText={errors?.attention_type?.message}

                    id="attention_type"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Email
              </Typography>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.email}
                    required
                    helperText={errors?.email?.message}

                    id="email"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Canal
              </Typography>
              <Controller
                name="channel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.channel}
                    required
                    helperText={errors?.channel?.message}

                    id="channel"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                NSE
              </Typography>
              <Controller
                name="nse"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.nse}
                    required
                    helperText={errors?.nse?.message}

                    id="nse"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Unidad Operativa
              </Typography>
              <Controller
                name="operative_unit"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.operative_unit}
                    required
                    helperText={errors?.operative_unit?.message}

                    id="operative_unit"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Segmento
              </Typography>
              <Controller
                name="business_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.business_name}
                    required
                    helperText={errors?.business_name?.message}

                    id="business_name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                GEC
              </Typography>
              <Controller
                name="gec"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.gec}
                    required
                    helperText={errors?.gec?.message}

                    id="gec"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Dias de Entrega
              </Typography>
              <Controller
                name="business_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.business_name}
                    required
                    helperText={errors?.business_name?.message}

                    id="business_name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Ruta
              </Typography>
              <Controller
                name="business_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.business_name}
                    required
                    helperText={errors?.business_name?.message}

                    id="business_name"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={6} md={6} >
              <Typography className="text-14 sm:text-14 truncate font-semibold">
                Registrado
              </Typography>
              <Controller
                name="is_authenticated"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-8 mb-16"
                    error={!!errors.is_authenticated}
                    required
                    helperText={errors?.is_authenticated?.message}

                    id="is_authenticated"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>
        </>}
    </div>
  );
}

export default BasicInfo;
