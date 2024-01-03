import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Grid, Typography, ToggleButtonGroup, ToggleButton, Select, MenuItem } from "@mui/material";
import {
  getVariables
} from '../store/pointsSlice';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";


function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  //const storage = getStorage();
  const { errors } = formState;
  const dispatch = useDispatch();
  const [channels, setChannels] = useState();
  const [gecs, setGecs] = useState();
  const {
    id,
    client_id,
    description,
    points,
    channel,
    gec,
  } = control._formValues;
  const [types, setTypes] = useState('cliente');
  console.log('params', params)

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
      //setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (client_id) {
      setTypes('cliente')
    }
    if (channel) {
      setTypes('canal')
    }

  }, [control._formValues])

  const channelSelected = (ev) => {
    const gecList = channels.find(item => item.canal === ev.target.value)
    setGecs(gecList.gec)
  }

  useEffect(() => {
    if (control._formValues.channel) {
      if (channels.length >= 1) {
        const gecList = channels.find(item => item.canal === control._formValues.channel)
        console.log('gec', gec)
        setGecs(gecList.gec)
      }
    }
  }, [channels])


  return (
    <div className="ml-10">
      <Grid
        container
        padding={4}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        {params === 'new' &&
          <Grid item xs={4} md={1.7}>
            <Typography className="text-16 sm:text-16 truncate font-semibold">
              Tipo
            </Typography>
            <ToggleButtonGroup
              value={types}
              exclusive
              onChange={(event) => {
                setTypes(event.target.value); // actualizar el estado del tipo seleccionado
              }}
              aria-label="channel or client"
              id='type'
              disabled={params === 'view'}
            >
              <ToggleButton value="cliente" aria-label="Cliente" >
                Cliente
              </ToggleButton>
              <ToggleButton value="canal" aria-label="Canal" >
                Canal
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        }
        {types === 'cliente' ?
          <Grid item xs={6} md={7} >
            <Typography className="text-12 sm:text-14 truncate font-semibold">
              Ingrese ID de cliente separados por coma.
            </Typography>
            <Controller
              name="client_id"
              control={control}
              render={({ field }) => (
                <TextField
                  required
                  error={!!errors.client_id}
                  helperText={errors?.client_id?.message}
                  {...field}
                  value={field.value || ''}
                  placeholder=" Ejemplo: 300896, 300899, 12023, 12366"
                  autoFocus
                  id="client_id"
                  variant="outlined"
                  fullWidth
                  disabled={params === 'view'}
                />
              )}
            />
          </Grid>
          :
          <>
            <Grid item xs={4} md={2}>
              <Typography className="text-16 sm:text-14 truncate font-semibold">
                Canal
              </Typography>
              <Controller
                name="channel"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="channel"
                    value={field.value || '0'}
                    variant="outlined"
                    fullWidth
                    onChange={(ev) => {
                      const value = ev.target.value;
                      field.onChange(value);
                      channelSelected(ev);
                    }}
                  >
                    <MenuItem value='0' > Seleccione un Canal</MenuItem>
                    {channels?.map((c, ci) => {
                      console.log('dield', field.value)
                      return <MenuItem key={ci} value={c.canal} > {c.canal}</MenuItem>

                    })}
                  </Select>
                )}
              />
            </Grid>
            <Grid item xs={4} md={2}>
              <Typography className="text-16 sm:text-14 truncate font-semibold">
                GEC
              </Typography>
              <Controller
                name="gec"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="gec"
                    value={field.value || '0'}
                    variant="outlined"
                    fullWidth
                  >
                    <MenuItem value='0' > Seleccione un GEC</MenuItem>
                    {gecs?.map((g, gi) => {

                      return <MenuItem key={gi} value={g} > {g}</MenuItem>

                    })}
                  </Select>
                )}
              />
            </Grid>
          </>
        }



      </Grid>
      <Grid
        container
        padding={4}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={6} md={7} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Detalle CONCEPTO o REFERENCIA
          </Typography>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                required
                error={!!errors.description}
                helperText={errors?.description?.message}
                {...field}
                value={field.value || ''}
                placeholder="Ingrese un Detalle"
                id="description"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>

      </Grid>
      <Grid
        container
        padding={4}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={6} md={4} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Cantidad de PUNTOS A AÑADIR por cliente
          </Typography>
          <Controller
            name="points"
            control={control}
            render={({ field }) => (
              <TextField
                className="mt-8 mb-16"
                required
                error={!!errors.name}
                helperText={errors?.name?.message}
                {...field}
                value={field.value || ''}
                placeholder="Números enteros, sin puntuación. Ejemplo: 1250"

                id="points"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
                inputProps={{
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                  maxLength: 10 // Opcionalmente, puedes especificar la cantidad máxima de caracteres
                }}
              />
            )}
          />

        </Grid>
      </Grid>
    </div >
  );
}

export default BasicInfo;
