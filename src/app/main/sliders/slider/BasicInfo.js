import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography, Grid, Select, MenuItem, } from "@mui/material";
import Switch from "@mui/material/Switch";
import InputLabel from "@mui/material/InputLabel";
import { Controller, useFormContext } from "react-hook-form";
import {
  getVariables
} from '../store/slidersSlice';
import { useDispatch, useSelector } from "react-redux";

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const dispatch = useDispatch();
  const {
    channel,
    gec
  } = control._formValues;

  const [channels, setChannels] = useState([]);
  const [gecs, setGecs] = useState();

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
    });
  }, [dispatch]);

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
    <div className="m-10">
      <Grid
        container
        padding={4}
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
        alignItems="center"
        textAlign="center"
      >
        <Grid item xs={6} md={2} >
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => (

              <Button variant="contained" component="label" color="primary">
                Cargar Imagen
                <input
                  accept="image/*"
                  className="hidden"
                  id="button-avatar"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) {
                      return;
                    }
                    onChange(file);
                  }}
                />
              </Button>

            )}
          /></Grid>
        <Grid item xs={4} md={2.5}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
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
                  console.log('field', field.value)
                  return <MenuItem key={ci} value={c.canal} > {c.canal}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={4} md={2.5}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
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
                {console.log('asd', field.value)}
                <MenuItem value='0' > Seleccione un GEC</MenuItem>
                {gecs?.map((g, gi) => {

                  return <MenuItem key={gi} value={g} > {g}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        {/*<Grid item xs={6} md={3} >
          <Typography className="text-16 sm:text-18 truncate font-semibold">
            Tipo
          </Typography>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  {...field}
                  labelId="demo-select-small"
                  id="demo-select-small"
                  value={field.value}
                  label="Tipo"
                  // id="status"
                  fullWidth
                >
                  <MenuItem value="Almacenes">Almacenes</MenuItem>
                  <MenuItem value="BCR">BCR</MenuItem>
                  <MenuItem value="Canillita">Canillita</MenuItem>
                  <MenuItem value="Carniceria">Carniceria</MenuItem>
                  <MenuItem value="Casas_de_Comida">Casas de Comida</MenuItem>
                  <MenuItem value="Dieteticas">Dieteticas</MenuItem>
                  <MenuItem value="Farmacias">Farmacias</MenuItem>
                  <MenuItem value="Heladerias">Heladerias</MenuItem>
                  <MenuItem value="Fiambreria">Fiambreria</MenuItem>
                  <MenuItem value="Kioscos">Kioscos</MenuItem>
                  <MenuItem value="Locutorios">Locutorios</MenuItem>
                  <MenuItem value="Otros">Oros</MenuItem>
                  <MenuItem value="Self-service">Self Service</MenuItem>
                  <MenuItem value="Automotor">Automotor</MenuItem>
                  <MenuItem value="Verdulerias">Verdulerias</MenuItem>
                  <MenuItem value="promotions">Promociones</MenuItem>

                </Select>
              </div>
            )} />
        </Grid>*/}
        <Grid item xs={6} md={2} >
          {/* <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.type}
            required
            helperText={errors?.type?.message}
            label="Tipo"
            id="type"
            variant="outlined"
            fullWidth
          />
        )}
      /> */}
          {params !== "new" ? (
            <div>
              <label style={{ marginLeft: 10 }}>Habilitar</label>
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    onChange={(e) => field.onChange(e.target.checked)}
                    checked={field.value}
                  />
                )}
              />
            </div>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
}

export default BasicInfo;
