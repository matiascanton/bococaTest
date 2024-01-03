import React, { useEffect, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import { Controller, useFormContext, useFieldArray, useForm } from "react-hook-form";
import { Button, Grid, Typography, ToggleButtonGroup, ToggleButton, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Card, CardMedia, CardContent } from "@mui/material";
import moment from "moment";
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  getBrands,
  getProducts,
  getVariables
} from '../store/misionsSlice';
import { useDispatch, useSelector } from "react-redux";
import { listAllByFolder } from "app/configs/fbServices";
import Divider from '@mui/material/Divider';
import { filter, values } from "lodash";
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState, setValue } = methods;
  const { errors } = formState;
  const {
    name,
    month,
    year,
    channel,
    gec,
    //file_id,
    missions,
    bonus
  } = control._formValues;
  console.log('params', props)
  const [months, setMonths] = useState(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])
  const [years, setYears] = useState([]);
  const [types, setTypes] = useState('sku');
  const [checked, setChecked] = useState(true);
  const [channels, setChannels] = useState();
  const [gecs, setGecs] = useState();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [misiones, setMisiones] = useState([]);
  const [misionesSave, setMisionesSave] = useState([]);
  const [objUpdate, setObjUpdate] = useState("");
  const [chooseImage, setChooseImage] = useState(false);
  const [data, setData] = useState([]);
  const [imagen, setImagen] = useState(false)
  const [filterProducts, setFilterProducts] = useState(products);
  const [selectedBrand, setSelectedBrand] = useState([])
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    cmd: "sku",
    label: '',
    instructions: '',
    img: "",
    skus: [],
    target: "",
    points: "",
    brand: [],
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
  const handleChangeDest = (event, newValue) => {
    setTypes(newValue); // actualizar el estado del tipo seleccionado
  };

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearss = [];

    for (let i = 0; i < 5; i++) {
      yearss.push(currentYear + i);
    }
    setYears(yearss);

  }, [])

  useEffect(() => {
    dispatch(getBrands()).then((res) => {
      setBrands(res.payload.sort((x, y) => x.brand.localeCompare(y.brand)));
      //setLoading(false);
    });
    dispatch(getProducts()).then((res) => {
      console.log('products', res.payload)
      setProducts(res.payload.sort((a, b) => (a.sku > b.sku) ? 1 : -1));
      setFilterProducts(res.payload.sort((a, b) => (a.sku > b.sku) ? 1 : -1));
      //setLoading(false);
    });
    dispatch(getVariables()).then((res) => {

      setChannels(res.payload.channels);
      //setLoading(false);
    });
  }, [dispatch]);

  useEffect(() => {
    setMisiones(missions)
  }, [missions])
  /*const missionsRef = useRef(false);
  
  if (missions && !missionsRef.current) {
    setMisiones(missions);
    missionsRef.current = true;
  }*/

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

  useEffect(() => {
    setValue("missions", misiones
      , {
        shouldDirty: true,
        shouldValidate: true,
      });
  }, [misionesSave])

  const changeImage = async (el) => {
    setObjUpdate(el);
    setChooseImage(true);
  };

  const changeSelectImg = async (e) => {
    await setData([]);
    try {
      switch (e.target.value) {
        case 1:
          await listAllByFolder("images/logos_con_fondo", setData);
          break;
        case 2:
          await listAllByFolder("images/logos_sin_fondo", setData);
          break;
        case 3:
          await listAllByFolder("images/empaques", setData);
          break;
        /* case 4:
           await listAllByFolder("images/productos", setData);
           break;*/
        default:
          await listAllByFolder("images/logos_con_fondo", setData);
          await listAllByFolder("images/logos_sin_fondo", setData);
          await listAllByFolder("images/empaques", setData);
          break;
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Ocultar el componente CircularProgress
    }
  }

  const handleChangeObj = (event, index) => {
    const updatedItems = [...misiones];
    updatedItems[index].target = event.target.value;
    // Aquí puedes guardar los datos nuevos, enviarlos al servidor o actualizar el estado global de la aplicación.
    console.log('update', updatedItems);
    setMisiones(updatedItems)
  };

  const handleChangePoints = (event, index) => {
    const updatedItems = [...misiones];
    updatedItems[index].points = event.target.value;
    // Aquí puedes guardar los datos nuevos, enviarlos al servidor o actualizar el estado global de la aplicación.
    console.log('update', updatedItems);
    setMisiones(updatedItems)
  };


  /*const saveMission = () => {
    setValue("missions", misiones
      , {
        shouldDirty: true,
        shouldValidate: true,
      });
    console.log('misionessssssssssss', misiones)
    console.log('misisssssssionssss', missions)
  
  }*/

  /*const handleChangeBrand = (value) => {
    console.log('marca', value)
    const brandDetail = brands.filter(b => b.id === value)
    console.log(brandDetail);
    //brandsList[i] = { id: brandDetail[0].id, logo: brandDetail[0].logo, color: brandDetail[0].color };
    //setBrandId(value);
    setFilterProducts(products.filter(p => p.brand_id === value))
    setFormData({ ...formData, skus: [] })
  };*/
  const handleChangeBrand = (event) => {
    const {
      target: { value },
    } = event;
    setFormData({ ...formData, brand: typeof value === 'string' ? value.split(',') : value });

    let productosfiltered = []
    console.log('value', value)
    if (value.length === 0) {
      productosfiltered = products
    } else {
      productosfiltered = (products.filter((p) => value.includes(p.brand)))
    }
    setFilterProducts(productosfiltered)

  }


  const handleAdd = () => {
    const misionAdd = formData;
    misionAdd.cmd = types;

    if (misionAdd.skus.length !== 0) {
      if (misiones) {
        setMisiones([...misiones, misionAdd]);
        setMisionesSave([...misiones, misionAdd])
      } else {
        setMisiones([misionAdd]);
        setMisionesSave([misionAdd])
      }
      setFormData({
        cmd: "",
        label: '',
        instructions: '',
        img: "",
        skus: [],
        target: "",
        points: "",
        brand: [],
      });
      setImagen(false)
      setFilterProducts(products)
    }

  };



  const handleEliminarClick = (indice) => {
    setMisiones(misiones.filter((objeto, i) => i !== indice));
    setMisionesSave(misiones.filter((objeto, i) => i !== indice))
  };

  const selectImage = (e) => {
    setFormData({ ...formData, img: e.target.src })
    setImagen(true)
  }

  const handleChange = (event) => {

    const {
      target: { value },
    } = event;
    console.log('testttt', value);
    setFormData({ ...formData, skus: typeof value === 'string' ? value.split(',') : value });
  };




  const placeholder = "Seleccione";


  if (chooseImage) {
    return (

      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >

        <Grid item xs={12}>
          <Typography className="text-16 sm:text-20 truncate font-bold">
            Seleccionar imagen
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Select
            id="selectImg"
            variant="outlined"
            fullWidth
            onChange={(e) => { setLoading(true); changeSelectImg(e); }}
            defaultValue={-1}
          >
            <MenuItem key={3} value={-1} disabled> Seleccione una Categoria</MenuItem>
            <MenuItem key={0} value={0} > Todas</MenuItem>
            <MenuItem key={1} value={1} > Imagenes con Fondo</MenuItem>
            <MenuItem key={2} value={2} > Imagenes sin Fondo</MenuItem>
            <MenuItem key={4} value={3} > Empaques</MenuItem>

          </Select>
        </Grid>

        {loading ? (
          <Grid sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '30vh', width: '100vw' }}>
            <CircularProgress />
          </Grid>
        ) : (

          data.map((el, i) => (
            <Grid key={i} item xs={6} md={2} textAlign={"center"}>
              <img
                className="rounded"
                src={el}
                onClick={(e) => {
                  selectImage(e);
                  setChooseImage(false);
                }}
                alt="el"
              />

            </Grid>
          ))

        )}

      </Grid>
    );
  }

  return (
    <div className="ml-10">
      <Grid
        container
        padding={2}
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 1, md: 4 }}
        alignItems="center"
        textAlign="center"
      >
        <Grid item xs={6} md={3} >
          <Typography className="text-14 sm:text-16 truncate font-semibold">
            Nombre
          </Typography>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField

                required
                {...field}
                autoFocus
                placeholder="Ingrese el Nombre"
                id="name"
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              />
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Mes
          </Typography>
          <Controller
            name="month"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="month"
                value={field.value || 0}
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              >
                <MenuItem key={0} value={0} > Seleccione un Mes</MenuItem>
                {months?.map((m, mindex) => {
                  return <MenuItem key={mindex + 1} value={mindex + 1} > {m}</MenuItem>
                })}
              </Select>
            )}
          />
        </Grid>
        <Grid item xs={6} md={2} >
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Año
          </Typography>
          <Controller
            name="year"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="year"
                value={field.value || 0}
                variant="outlined"
                fullWidth
                disabled={params === 'view'}
              >
                <MenuItem key={0} value={0} > Seleccione un Año</MenuItem>
                {years?.map((y, yindex) => {
                  return <MenuItem key={yindex} value={y} > {y}</MenuItem>
                })}
              </Select>
            )}
          />
        </Grid>
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
                disabled={params === 'view'}
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
                disabled={params === 'view'}
              >
                <MenuItem value='0' > Seleccione un GEC</MenuItem>
                {gecs?.map((g, gi) => {

                  return <MenuItem key={gi} value={g} > {g}</MenuItem>

                })}
              </Select>
            )}
          />
        </Grid>
        {/*<Grid item xs={4} md={2}>
          <Typography className="text-14 sm:text-16 truncate font-semibold">
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) {
                        return;
                      }
                      onChange(file);
                    }}
                  />
                </Button>
                <Typography className="text-14 sm:text-16 ml-10">
                  {file_id?.name || ""}
                </Typography>

              </div>
            )}
          />
        </Grid>*/}
      </Grid>
      {params !== 'view' &&
        <>
          <Grid
            container
            padding={2}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
            alignItems="center"
            textAlign="center"

          >

            <Grid item xs={4} md={1.7}>
              <Typography className="text-16 sm:text-16 truncate font-semibold">
                Tipo
              </Typography>
              <ToggleButtonGroup
                value={types}
                exclusive
                onChange={(event) => {
                  setFormData({
                    cmd: "",
                    label: '',
                    instructions: '',
                    img: "",
                    skus: [],
                    target: "",
                    points: "",
                    brand: [],
                  });
                  setTypes(event.target.value); // actualizar el estado del tipo seleccionado
                  setFormData({ ...formData, cmd: event.target.value });
                  setImagen(false)
                }}
                aria-label="channel or client"
                id='type'

              >
                <ToggleButton value="photo" aria-label="Foto" >
                  Foto
                </ToggleButton>
                <ToggleButton value="sku" aria-label="Producto" >
                  Producto
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          </Grid>
          <Grid
            container
            padding={2}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}
            alignItems="center"
            textAlign="center"

          >

            {types === 'sku' ?
              <>
                <Grid item xs={4} md={1.5} display={'grid'} justifyItems={'center'} alignItems={'center'}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">

                  </Typography>
                  <Button className="text-10 mt-20" variant="contained" component="label" color="primary" onClick={() =>
                    changeImage({
                      propertyName: "header",
                    })
                  }> Cargar Imagen</Button>

                  {imagen &&

                    < img width={"60%"} className="rounded" alignItems="center" src={formData.img} />}
                </Grid>
                <Grid item xs={4} md={2}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    Label
                  </Typography>
                  <TextField value={formData.label} onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  } />
                </Grid>
                <Grid item xs={4} md={2.5}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    Marcas
                  </Typography>
                  <Select
                    labelId="marca-multiple-checkbox-label"
                    multiple
                    value={formData.brand}
                    onChange={(e) => handleChangeBrand(e)}
                    input={<OutlinedInput />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    label='Sku'
                    fullWidth
                  >
                    {brands.map((option) => (
                      <MenuItem key={option.id} value={option.brand}>
                        <Checkbox checked={formData.brand.indexOf(option.brand) > -1} />
                        <ListItemText primary={option.brand} />
                      </MenuItem>
                    ))}
                  </Select>

                </Grid>

                <Grid item xs={4} md={3}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    SKUs
                  </Typography>
                  <Select
                    multiple
                    value={formData.skus || 0}
                    onChange={(e) => handleChange(e)}
                    input={<OutlinedInput />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                    label='Sku'
                    fullWidth
                  >
                    {filterProducts.map((option) => (
                      <MenuItem style={{ width: 100 }} key={option.sku} value={option.sku}>
                        <Checkbox checked={formData.skus.indexOf(option.sku) > -1} />
                        <ListItemText className="text-10 sm:text-8" primary={option.sku + ' - ' + option.description} />
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={4} md={1}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    Objetivo
                  </Typography>
                  <TextField value={formData.target} inputProps={{ inputMode: 'numeric' }} onChange={(e) =>
                    setFormData({ ...formData, target: parseInt(e.target.value) })
                  } />
                </Grid>
                <Grid item xs={4} md={1}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    Puntos
                  </Typography>
                  <TextField value={formData.points} inputProps={{ inputMode: 'numeric' }} onChange={(e) =>
                    setFormData({ ...formData, points: parseInt(e.target.value) })
                  } />
                </Grid>

              </>
              :
              <>
                <Grid item xs={4} md={4}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    Label
                  </Typography>
                  <TextField fullWidth value={formData.label} onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  } /></Grid>
                <Grid item xs={4} md={6}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    Descripción
                  </Typography>
                  <TextField fullWidth value={formData.instructions} onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  } />
                </Grid>
                <Grid item xs={4} md={1}>
                  <Typography className="text-16 sm:text-16 truncate font-semibold">
                    Puntos
                  </Typography>
                  <TextField value={formData.points} inputProps={{ inputMode: 'numeric' }} onChange={(e) =>
                    setFormData({ ...formData, points: parseInt(e.target.value) })
                  } />
                </Grid>
              </>

            }
            <Grid item xs={4} md={1}>
              <IconButton aria-label="Agregar" type="button" onClick={() => handleAdd()} className='mt-20'>
                <FuseSvgIcon size={26} color="primary">
                  heroicons-outline:plus-circle
                </FuseSvgIcon>
              </IconButton>
              {/*<Button variant="contained" component="label" color="primary" type="button" onClick={() => handleAdd()}>
                Agregar
          </Button>*/}
            </Grid>



          </Grid >
        </>
      }
      <Divider />
      {
        misiones?.map((item, index) => (
          <div key={item.id}>
            <Grid
              container
              padding={2}
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 1, md: 1 }}
              alignItems="center"
              textAlign="center"
              justify="center"
            >
              {item.cmd === 'sku' ?
                <>
                  <Grid item xs={6} md={1} style={{ display: "flex", justifyContent: "center" }}>
                    <img width={"70%"} src={item.img} alt="item" />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField disabled fullWidth label="Label" value={item.label} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField disabled fullWidth label="SKUs" value={item.skus} />
                  </Grid>
                  <Grid item xs={6} md={1}>
                    <TextField fullWidth label="Objetivo" value={item.target} onChange={(event) => handleChangeObj(event, index)} />
                  </Grid>
                  <Grid item xs={6} md={1}>
                    <TextField fullWidth label="Puntos" value={item.points} onChange={(event) => handleChangePoints(event, index)} />
                  </Grid>
                  {params !== 'view' &&
                    <Grid item xs={6} md={1}>
                      <IconButton aria-label="Agregar" type="button" onClick={() => handleEliminarClick(index)} >
                        <FuseSvgIcon size={26} color="error">
                          heroicons-outline:trash
                        </FuseSvgIcon>
                      </IconButton>
                      {/*<Button variant="contained" component="label" color="primary" type="button" onClick={() => handleEliminarClick(index)}> x </Button>*/}
                    </Grid>
                  }
                </>
                :
                <>
                  <Grid item xs={6} md={4}>
                    <TextField fullWidth disabled label="Label" value={item.label} />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField fullWidth disabled label="Descripcion" value={item.instructions} />
                  </Grid>
                  <Grid item xs={6} md={1}>
                    <TextField fullWidth disabled label="Puntos" value={item.points} />
                  </Grid>
                  {params !== 'view' &&
                    <Grid item xs={6} md={1}>
                      <IconButton aria-label="Agregar" type="button" onClick={() => handleEliminarClick(index)} >
                        <FuseSvgIcon size={26} color="error">
                          heroicons-outline:trash
                        </FuseSvgIcon>
                      </IconButton>
                      {/*<Button variant="contained" component="label" color="primary" type="button" onClick={() => handleEliminarClick(index)}> x </Button>*/}
                    </Grid>
                  }

                </>
              }

            </Grid>
          </div>

        ))
      }
      <Divider />
      <Grid
        container
        padding={2}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
        alignItems="center"

        justify="center"
      >

        <Grid item xs={6} md={5} >
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Bonus (En caso de completar las misiones)
          </Typography>
          <Controller
            name="bonus"
            control={control}
            render={({ field }) => (
              <TextField
                className=" mb-16"
                {...field}
                inputProps={{ inputMode: 'numeric' }}
                placeholder="Ingrese Bonus"
                id="bonus"
                variant="outlined"
                defaultValue={0}
                fullWidth
                disabled={params === 'view'}
                onChange={(event) => {
                  if (event.target.value !== '') {
                    const value = parseInt(event.target.value);
                    field.onChange(value);
                  } else {
                    field.onChange('');
                  }

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
