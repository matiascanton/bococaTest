import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext } from "react-hook-form";
import { Button, Grid, Typography, ToggleButtonGroup, ToggleButton, Select, MenuItem, Switch } from "@mui/material";
import {
  getBrands,
  getProducts,
  getVariables
} from '../store/prizesSlice';
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

import Autocomplete from '@mui/material/Autocomplete';

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState, setValue } = methods;
  //const storage = getStorage();
  const { errors } = formState;
  const dispatch = useDispatch();
  const [channels, setChannels] = useState();
  const [gecs, setGecs] = useState();
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState(products);
  const [brands, setBrands] = useState([]);

  const {
    id,
    title,
    category,
    img,
    channel,
    gec,
    description,
    sku,
    points,
    status,
  } = control._formValues;
  console.log('params', control._formValues)
  const [types, setTypes] = useState(null);
  const [data, setData] = useState({})

  const handleChangeDest = (event, newValue) => {
    setTypes(newValue); // actualizar el estado del tipo seleccionado
  };
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
  useEffect(() => {
    dispatch(getBrands()).then((res) => {
      setBrands(res.payload.sort((x, y) => x.brand.localeCompare(y.brand)));
      //setLoading(false);
    });
    dispatch(getProducts()).then((res) => {
      setProducts(res.payload.sort((a, b) => (a.sku > b.sku) ? 1 : -1));
      setFilterProducts(res.payload.sort((a, b) => (a.sku > b.sku) ? 1 : -1));
      //setLoading(false);
    });
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
      //setLoading(false);
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
  const transformValue = (value) => {
    const product = filterProducts.find((item) => item.sku === value);
    if (product) {
      return `${product.sku} - ${product.description}`;
    }
    return '';
  }

  const handleSkuChange = (value) => {
    console.log('eeeeeee', value)
    setData({ img: value.image, description: value.description, brand: value.brand, size: value.size })

  }

  /*useEffect(() => {
    setValue("description", data.description
      , {
        shouldDirty: true,
        shouldValidate: true,
      });
    setValue('image', data.image, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [data])*/




  return (
    <div className="ml-10">
      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={6} md={4} >
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Categoria
          </Typography>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                {...field}

                id="category"
                value={field.value || 'PRODUCTO'}
                variant="outlined"
                fullWidth
              >
                {/*<MenuItem value='0' > Seleccione una Categoria</MenuItem>*/}
                <MenuItem value='PRODUCTO' > Producto</MenuItem>
              </Select>
            )}
          />
        </Grid>


        <Grid item xs={4} md={4}>
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
                  return <MenuItem key={ci} value={c.canal} > {c.canal}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={4} md={4}>
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
      </Grid>
      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={4} md={4}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            SKU
          </Typography>
          {/*<Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={field.value || null}
                  options={filterProducts}
                  onChange={(event, newValue) => {
                    field.onChange(newValue); // Actualiza el valor del campo utilizando field.onChange
                    handleSkuChange(newValue); // Llama a la función handleSkuChange con el nuevo valor
                  }}
                  getOptionLabel={(option) => (option ? option.sku + ' - ' + option.description : '')}
                  renderInput={(params) => <TextField placeholder="Buscar SKU" {...params} />}
                />
                {console.log('field', field.value)}
              </>
            )
            }
          />*/}
          <Controller
            name="sku"
            control={control}
            render={({ field }) => {
              //const transformedValue = transformValue(field.value); // Realiza la transformación del valor
              //console.log('field', transformedValue)
              return (
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={field.value || null} // Utiliza el valor transformado
                  options={filterProducts}
                  onChange={(event, newValue) => {
                    field.onChange(newValue);
                    handleSkuChange(newValue);
                  }}

                  getOptionLabel={
                    (option) => {
                      if (option && option.sku && option.description) {
                        return `${option.sku} - ${option.description}`;
                      }
                      if (typeof field.value !== 'string') {
                        const selectedOption = filterProducts.find(
                          (option) => option.sku === field.value
                        );
                        if (selectedOption && selectedOption.sku && selectedOption.description) {
                          return `${selectedOption.sku} - ${selectedOption.description}`;
                        }
                      }
                      return '';
                    }}

                  renderInput={(params) => <TextField placeholder="Buscar SKU" {...params} />}
                />
              );
            }}
          />

        </Grid>
        <Grid item xs={6} md={4} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Descripcion
          </Typography>
          <TextField
            fullWidth
            value={data.description || description}
            disabled
          />
        </Grid>
        <Grid item xs={4} md={4}>
          <Typography className="text-16 sm:text-14 truncate font-semibold">
            Imagen
          </Typography>
          <img style={{ position: "absolute", textAlign: "center" }} src={data.img || img}></img>
        </Grid>
      </Grid>
      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >

        <Grid item xs={6} md={4} >
          <Typography className="text-12 sm:text-14 truncate font-semibold">
            Puntos Requeridos
          </Typography>
          <Controller
            name="points"
            control={control}
            render={({ field }) => (
              <TextField
                className="mt-8 mb-16"
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
                onChange={(event) => {
                  const value = parseInt(event.target.value);
                  field.onChange(value);
                }}
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*'
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
