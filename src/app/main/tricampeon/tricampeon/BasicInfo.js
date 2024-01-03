import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Grid, Typography, ToggleButtonGroup, ToggleButton, Select, MenuItem } from "@mui/material";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import {
  getBrands,
  getProducts,
  getVariables
} from '../store/tricampeonsSlice';
//import * as XLSX from 'xlsx';
//import axios from "axios";
/*import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
} from "firebase/storage";*/

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState } = methods;
  //const storage = getStorage();
  const { errors } = formState;
  const dispatch = useDispatch();
  const {
    id,
    name,
    type,
    start_date,
    due_date,
    image,
    channel,
    gec,
    file_id,
    terms,
    enabled,
    bonus,
    point,
    gift_1,
    gift_2,
    skus_1,
    skus_2,
    skus_3,
    skus_4

  } = control._formValues;
  //console.log('params', params)
  const [types, setTypes] = useState('clients');
  const [products, setProducts] = useState([]);
  const handleChangeDest = (event, newValue) => {
    setTypes(newValue); // actualizar el estado del tipo seleccionado
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {

    dispatch(getProducts()).then((res) => {
      setProducts(res.payload);
      //setLoading(false);
    });
  }, [dispatch]);

  const handleChange = (event) => {

    const {
      target: { value },
    } = event;
    console.log('testttt', value);
    setFormData({ ...formData, skus: typeof value === 'string' ? value.split(',') : value });
  };
  /*const getExcelData = async () => {
    const fileRef = ref(storage, `files/${name}`);
    const urlExcel = await getDownloadURL(fileRef);
    console.log('urlExcel: ', urlExcel)

    getDownloadURL(fileRef).then(url => {
      axios.get(url, { responseType: 'blob' })
        .then(response => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(response.data);
          reader.onload = () => {
            const data = new Uint8Array(reader.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            console.log(sheetData);
          };
        })
        .catch(error => {
          console.error(error);
        });
    });


  }


  if (params === 'view') {
    useEffect(() => {
      getExcelData()
    }, [name])

  }*/





  return (
    <div className="ml-10">
      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={6} md={3} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Nombre
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.name}
                helperText={errors?.name?.message}
                {...field}
                value={field.value || ''}
                placeholder="Ingrese Nombre"
                autoFocus
                id="name"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Desde
          </Typography>
          <Controller
            name="start_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}

                type='date'
                required
                value={field.value ? moment(field.value).format('YYYY-MM-DD') : ''}

                id="start_date"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Hasta
          </Typography>
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}

                required
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
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Destinatarios
          </Typography>
          <Controller
            name="type"
            control={control}
            defaultValue='clients'
            render={({ field }) => (
              <ToggleButtonGroup
                {...field}
                value={field.value || 'clients'}
                exclusive
                onChange={(event, newValue) => {
                  field.onChange(newValue); // actualizar el valor del campo 'type'
                  handleChangeDest(event, newValue); // actualizar el estado del tipo seleccionado
                }}
                aria-label="channel or client"
                id='type'
                disabled={params === 'view'}
              >
                <ToggleButton value="channel" aria-label="channel" >
                  Canal
                </ToggleButton>
                <ToggleButton value="clients" aria-label="clients" >
                  Cliente
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Grid>
        <Grid item xs={4} md={2}>
          <Typography className="text-14 sm:text-14 truncate font-semibold">
            Excel
          </Typography>
          <Controller
            name="file_id"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div className="mt-8 mb-16 flex flex-row  items-center">
                <Button variant="contained" component="label" color="primary">
                  Cargar
                  <input
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className="hidden"
                    id="button-avatar"
                    type="file"
                    disabled={params === 'view'}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) {
                        return;
                      }
                      onChange(file);
                    }}
                  />
                </Button>
                <Typography className="text-14 sm:text-10 ml-10">
                  {file_id?.name || ""}
                </Typography>

              </div>
            )}
          />
        </Grid>
      </Grid>
      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >

        <Grid item xs={6} md={3} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Premio 1
          </Typography>
          <Controller
            name="gift_1"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.gift_1}
                helperText={errors?.gift_1?.message}
                {...field}
                value={field.value || ''}
                placeholder="Ingrese Premio"
                id="gift_1"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={3} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Premio 2
          </Typography>
          <Controller
            name="gift_2"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.gift_2}
                helperText={errors?.gift_2?.message}
                {...field}
                value={field.value || ''}
                placeholder="Ingrese Premio"
                id="gift_2"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Puntos
          </Typography>
          <Controller
            name="points"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.points}
                helperText={errors?.points?.message}
                {...field}
                value={field.value || ''}
                placeholder="Ingrese Puntos"
                id="points"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Bonus
          </Typography>
          <Controller
            name="bonus"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.bonus}
                helperText={errors?.bonus?.message}
                {...field}
                value={field.value || ''}
                placeholder="Ingrese Bonus"
                id="bonus"
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
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={4} md={12}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Variables 1
          </Typography>
          <Controller
            name="skus_1"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.skus_1}
                helperText={errors?.skus_1?.message}
                {...field}
                value={field.value || ''}
                placeholder="1234, 1234, 1234"
                id="skus_1"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={4} md={12}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Variables 2
          </Typography>
          <Controller
            name="skus_2"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.skus_2}
                helperText={errors?.skus_2?.message}
                {...field}
                value={field.value || ''}
                placeholder="1234, 1234, 1234"
                id="skus_2"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={4} md={12}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Variables 3
          </Typography>
          <Controller
            name="skus_3"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.skus_3}
                helperText={errors?.skus_3?.message}
                {...field}
                value={field.value || ''}
                placeholder="1234, 1234, 1234"
                id="skus_3"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={4} md={12}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Variables 4
          </Typography>
          <Controller
            name="skus_4"
            control={control}
            render={({ field }) => (
              <TextField

                required
                error={!!errors.skus_4}
                helperText={errors?.skus_4?.message}
                {...field}
                value={field.value || ''}
                placeholder="1234, 1234, 1234"
                id="skus_4"
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
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >

        <Grid item xs={4} md={3}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Imagen Encabezado
          </Typography>
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Button variant="contained" component="label" color="primary">
                Cargar imagen
                <input
                  accept="image/*"
                  className="hidden"
                  id="button-avatar"
                  type="file"
                  disabled={params === 'view'}
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
          />
        </Grid>
      </Grid>
      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={6} md={12}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Reglamento y Legales
          </Typography>
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}

                required
                id="terms"
                variant="outlined"
                fullWidth
                placeholder="Ingrese el Reglamento"
                multiline
                rows={5}
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
      </Grid>
    </div >
  );
}

export default BasicInfo;
