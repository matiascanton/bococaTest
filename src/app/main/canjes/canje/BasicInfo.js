import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Grid, Typography, ToggleButtonGroup, ToggleButton, Select, MenuItem } from "@mui/material";
import {
  getVariables,
  getProducts,
} from '../store/canjesSlice';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Alert from "@mui/material/Alert";


function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState, setValue } = methods;
  //const storage = getStorage();
  const { errors } = formState;
  const dispatch = useDispatch();
  const [channels, setChannels] = useState();
  const [products, setProducts] = useState([]);
  const [canjesSave, setCanjesSave] = useState([]);
  const [gecs, setGecs] = useState();
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const {
    canjesaguardar,
  } = control._formValues;
  const [types, setTypes] = useState('cliente');
  const [titulo, setTitulo] = useState('');
  const [formData, setFormData] = useState({
    gec: "",
    channel: '',
    title: '',
    skus: [],
    qty: "",
    client_ids: [],
  });
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 5;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300
      },
    },
  };
  console.log('params', params)

  useEffect(() => {
    setValue("canjes", canjesSave
      , {
        shouldDirty: true,
        shouldValidate: true,
      });
  }, [canjesSave])

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
      //setLoading(false);
    });
    dispatch(getProducts()).then((res) => {
      console.log('products', res.payload)
      setProducts(res.payload.sort((a, b) => (a.sku > b.sku) ? 1 : -1));
      //setLoading(false);
    });
  }, [dispatch]);

  /*useEffect(() => {
    if (client_id) {
      setTypes('cliente')
    }
    if (channel) {
      setTypes('canal')
    }

  }, [control._formValues])*/

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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log('testttt', value);
    setFormData({ ...formData, skus: typeof value === 'string' ? value.split(',') : value });
  };

  const handleAdd = () => {
    if (formData.title === "" || formData.skus === "" || formData.qty === "") {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      setAlert({
        msg: "",
        alert: true,
      });
      const canjeAdd = formData;
      if (canjeAdd.skus.length !== 0) {
        setCanjesSave([...canjesSave, canjeAdd]);
        setFormData({
          title: canjeAdd.title,
          gec: "",
          channel: '',
          skus: [],
          qty: "",
          client_ids: [],
        });
      }
    }

  };

  const handleEliminarClick = (indice) => {
    setCanjesSave(canjesSave.filter((objeto, i) => i !== indice));

  };

  return (
    <div className="ml-10">
      {openAlert.alert === false ? (
        <Alert severity="error">{openAlert.msg}</Alert>
      ) : null}
      <Grid
        container
        padding={4}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >

        <Grid item xs={4} md={1.7}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Tipo
          </Typography>
          <ToggleButtonGroup
            value={types}
            className="mt-8 mb-16"
            exclusive
            onChange={(event) => {
              setTypes(event.target.value); // actualizar el estado del tipo seleccionado
            }}
            aria-label="channel or client"
            id='type'
            disabled={canjesSave.length > 0}
          >
            <ToggleButton value="cliente" aria-label="Cliente" >
              Cliente
            </ToggleButton>
            <ToggleButton value="canal" aria-label="Canal" >
              Canal
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={4} md={4}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Titulo
          </Typography>
          <TextField
            className="mt-8 mb-16"
            required
            value={formData.title}
            placeholder="Ingrese el Nombre"
            id="title"
            variant="outlined"
            fullWidth

            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

        </Grid>


      </Grid>
      <Grid
        container
        padding={4}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
        alignItems="center"

        justify="center"
      >
        {types === 'cliente' ?
          <Grid item xs={6} md={4} >
            <Typography className="text-16 sm:text-16 truncate font-semibold">
              Clientes
            </Typography>
            <TextField
              className="mt-8 mb-16"
              required
              value={formData.client_ids}
              placeholder="Ingrese los ID separados por coma. Ejemplo: 111,222,333"
              autoFocus
              id="client_ids"
              variant="outlined"
              fullWidth

              onChange={(e) => setFormData({ ...formData, client_ids: e.target.value })}
            />
          </Grid>
          :
          <>
            <Grid item xs={4} md={2}>
              <Typography className="text-16 sm:text-14 truncate font-semibold">
                Canal
              </Typography>
              <Select

                id="channel"
                className="mt-8 mb-16"
                value={formData.channel || '0'}
                variant="outlined"
                fullWidth
                onChange={(ev) => {
                  const value = ev.target.value;
                  channelSelected(ev);
                  setFormData({ ...formData, channel: value })
                }}
              >
                <MenuItem value='0' > Seleccione un Canal</MenuItem>
                {channels?.map((c, ci) => {

                  return <MenuItem key={ci} value={c.canal} > {c.canal}</MenuItem>

                })}
              </Select>


            </Grid>
            <Grid item xs={4} md={2}>
              <Typography className="text-16 sm:text-14 truncate font-semibold">
                GEC
              </Typography>
              <Select
                className="mt-8 mb-16"
                id="gec"
                value={formData.gec || '0'}
                variant="outlined"
                fullWidth
                onChange={(ev) => {
                  const value = ev.target.value;
                  setFormData({ ...formData, gec: value })
                }}
              >
                <MenuItem value='0' > Seleccione un GEC</MenuItem>
                {gecs?.map((g, gi) => {

                  return <MenuItem key={gi} value={g} > {g}</MenuItem>

                })}
              </Select>


            </Grid>
          </>

        }
        <Grid item xs={6} md={4} >
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            SKUs
          </Typography>

          <Select
            className="mt-8 mb-16"
            multiple
            value={formData.skus || 0}
            onChange={(e) => handleChange(e)}
            input={<OutlinedInput />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            label='Sku'
            fullWidth
            placeholder="asd"
          >
            {products.map((option) => (
              <MenuItem key={option.sku} value={option.sku}>
                <Checkbox checked={formData.skus.indexOf(option.sku) > -1} />
                <ListItemText className="text-10 sm:text-8" primary={option.sku + ' - ' + option.description} />
              </MenuItem>
            ))}
          </Select>


        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Cantidad
          </Typography>
          <TextField
            className="mt-8 mb-16"
            required
            value={formData.qty}
            placeholder="Ingrese la Cantidad"
            id="qty"
            variant="outlined"
            fullWidth
            inputProps={{
              pattern: '[0-9,]*', // Permite números y comas, excluye el punto (.)
              inputMode: 'numeric',
              maxLength: 30 // Opcionalmente, puedes especificar la cantidad máxima de caracteres
            }}
            onChange={(e) => setFormData({ ...formData, qty: parseInt(e.target.value) })}
          />

        </Grid>
        <Grid item xs={4} md={1}>
          <IconButton aria-label="Agregar" type="button" onClick={() => handleAdd()} className='mt-20'>
            <FuseSvgIcon size={26} color="primary">
              heroicons-outline:plus-circle
            </FuseSvgIcon>
          </IconButton>
        </Grid>
      </Grid>

      {canjesSave?.map((item, index) => (
        <div key={index}>
          <Grid
            container
            padding={4}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            alignItems="center"
            textAlign="center"
            justify="center"
          >
            {types === 'cliente' ?
              <Grid item xs={6} md={4} style={{ display: "flex", justifyContent: "center" }}>
                <TextField disabled fullWidth label="Clientes" value={item.client_ids} />
              </Grid>
              : <>
                <Grid item xs={6} md={2} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField disabled fullWidth label="Canal" value={item.channel} />
                </Grid>
                <Grid item xs={6} md={2} style={{ display: "flex", justifyContent: "center" }}>
                  <TextField disabled fullWidth label="GEC" value={item.gec} />
                </Grid>

              </>}

            <Grid item xs={6} md={4}>
              <TextField disabled fullWidth label="SKUs" value={item.skus} />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField disabled fullWidth label="Cantidad" value={item.qty} />
            </Grid>
            <Grid item xs={6} md={1}>
              <IconButton aria-label="Agregar" type="button" onClick={() => handleEliminarClick(index)} >
                <FuseSvgIcon size={26} color="error">
                  heroicons-outline:trash
                </FuseSvgIcon>
              </IconButton>
            </Grid>
          </Grid>
        </div>
      ))}
    </div >
  );
}

export default BasicInfo;