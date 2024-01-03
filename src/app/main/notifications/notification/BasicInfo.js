import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Button, Typography, Grid, Select, MenuItem, } from "@mui/material";
import Switch from "@mui/material/Switch";
import { Controller, useFormContext } from "react-hook-form";
import {
  getVariables
} from '../store/notificationsSlice';
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const dispatch = useDispatch();
  const {
    id,
    title,
    img,
    channel,
    gec
  } = control._formValues;

  const [channels, setChannels] = useState();
  const [gecs, setGecs] = useState();
  const [imagen, setImagen] = useState(img)

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
    });
  }, [dispatch]);

  useEffect(() => {
    if (img) {
      setImagen(img);
    }
  }, [id])

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

  const onChangeImg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImagen(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Grid
        container
        padding={5}
        rowSpacing={4}
        columnSpacing={{ xs: 1, sm: 1, md: 2 }}
        alignItems="center"


      >
        <Grid item xs={6} md={4} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Titulo
          </Typography>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                autoFocus
                placeholder="Ingrese el Nombre"
                id="title"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
                inputProps={{ maxLength: 50 }}
              />
            )}
          />
        </Grid>

        <Grid item xs={4} md={2}>
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Vencimiento
          </Typography>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type='date'
                value={field.value ? moment(field.value).format('YYYY-MM-DD') : ''}
                id="due_name"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={4} md={2}>
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
                value={field.value || 0}
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
                onChange={(ev) => {
                  const value = ev.target.value;
                  field.onChange(value);
                  channelSelected(ev);
                }}
              >
                <MenuItem value={0}> Seleccione un Canal</MenuItem>
                {channels?.map((c, ci) => {
                  return <MenuItem key={ci} value={c.canal} > {c.canal}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={4} md={2}>
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
                value={field.value || 0}
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              >
                <MenuItem value={0} > Seleccione un GEC</MenuItem>
                {gecs?.map((g, gi) => {

                  return <MenuItem key={gi} value={g} > {g}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        {params !== "new" ? (
          <Grid item xs={6} md={2} >

            <div>
              <label style={{ marginLeft: 10 }}>Habilitar</label>
              <Controller
                name="enabled"
                control={control}
                render={({ field }) => (
                  <Switch
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={params === 'view'}
                    checked={field.value}
                  />
                )}
              />
            </div>

          </Grid>
        ) : null}
      </Grid>
      <Grid
        container
        padding={4}
        rowSpacing={5}
        columnSpacing={{ xs: 1, sm: 1, md: 4 }}
        alignItems="center"


      >
        <Grid item xs={4} md={5}>
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Descripcion
          </Typography>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                placeholder="Ingrese la Descripcion"
                id="description"
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                disabled={params === 'view'}
                inputProps={{ maxLength: 150 }}
              />
            )}
          />
        </Grid>
        {params !== "view" && (
          <Grid item xs={6} md={2} textAlign="center">
            <Typography className="mb-5 text-14 sm:text-16 truncate font-semibold">
              Imagen
            </Typography>
            <Controller
              name="img"
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
                      onChangeImg(e)
                    }}
                  />
                </Button>

              )}
            />

          </Grid>
        )}
        <Grid item xs={6} md={2} textAlign='center'>
          <img width={"90%"} className="rounded" src={imagen} />
        </Grid>


      </Grid>




    </div>
  );
}

export default BasicInfo;
