import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { Button, Grid, Typography } from "@mui/material";


import moment from "moment";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useDispatch, useSelector } from "react-redux";
import {
  getBrands,
  getProducts,
  getVariables
} from '../store/bingosSlice';

import { listAllByFolder } from "app/configs/fbServices";
import "./styles.css";
function BasicInfo(props) {
  const methods = useFormContext();
  const [loading, setLoading] = useState(true);
  const { control, formState, setValue } = methods;
  const { errors } = formState;
  const [checked, setChecked] = useState(false);
  const {
    id,
    expire_at,
    header,
    excel_file,
    created_at,
    line_1,
    line_2,
    mission_1,
    mission_2,
    mission_3,
    mission_4,
    mission_5,
    mission_6,
    mission_7,
    mission_8,
    mission_9,
    mission_10,
    name,
    year_month,
    type,
    updated_at,
    header_line_1,
    header_line_2
  } = control._formValues;
  let a = [];
  let b = [];
  const [formattedDate, setFormattedDate] = useState(moment(expire_at).format('YYYY-MM-DD'));
  const [targetValues, setTargetValues] = useState([]);
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
  const [chooseImage, setChooseImage] = useState(false);
  const [objUpdate, setObjUpdate] = useState("");
  const { params } = props;
  const [open, setOpen] = useState([false, false, false, false, false, false, false, false, false, false]);
  const [labelValue, setLabelValue] = useState('');
  const [selectedMission, setSelectedMission] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [channels, setChannels] = useState();
  const [gecs, setGecs] = useState();
  const [brandId, setBrandId] = useState(null);
  const [qty, setQty] = useState([]);

  const handleOpen = (index, m) => {
    console.log('aveeer', m)
    let skus = [];
    let qtys = [];
    if (m.item != null) {
      m.item.target.map((tgt) => {
        skus.push(tgt.sku)
        qtys.push(tgt.qty)
      })
      setBrandId(m.item.brand_id)
      setFilterProducts(products.filter(p => p.brand_id === m.item.brand_id))
      setSelectedOptions(skus);
      setQty(qtys);
    }


    setSelectedMission(index);
  };
  const handleSaveMission = (index, m) => {
    console.log('mmmm', m);
    console.log('selectedOptions', selectedOptions);
    console.log('selectedOptions', qty);
    const targetNew = selectedOptions.map((option, opIndex) => ({
      sku: option,
      qty: qty[opIndex]
    }));
    m.item.target = targetNew;
    m.item.brand_id = brandId;
    m.item.label = labelValue;


    setValue(`mission_${index + 1}`, {
      ...control._formValues[`mission_${index + 1}`],
      brand_id: brandId,
      label: labelValue,
      target: targetNew
    }, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSelectedMission(null);
    setSelectedOptions([]);
    setQty([]);
    setLabelValue('');
    setBrandId(null);

  }


  const handleChangeBrand = (value, i) => {
    const brandsList = selectedBrand;
    const brandDetail = brands.filter(b => b.id === value)
    console.log(brandDetail);
    brandsList[i] = { id: brandDetail[0].id, logo: brandDetail[0].logo, color: brandDetail[0].color };
    setBrandId(value);
    setFilterProducts(products.filter(p => p.brand_id === value))
    setSelectedOptions([]);
    setQty([]);
    setSelectedBrand(brandsList)
  };

  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState(products);
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
  const misionName = [mission_1, mission_2, mission_3, mission_4, mission_5, mission_6, mission_7, mission_8, mission_9, mission_10]

  useEffect(() => {
    if (misionName) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    dispatch(getBrands()).then((res) => {
      setBrands(res.payload);
      //setLoading(false);
    });
    dispatch(getProducts()).then((res) => {
      setProducts(res.payload);
      //setLoading(false);
    });
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
      setGecs(res.payload.gec);
      //setLoading(false);
    });
  }, [dispatch]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    minHeight: 500,
    bgcolor: 'white',
    boxShadow: 3,
    p: 5,
  };

  const handleDateChange = (event) => {
    const inputDate = event.target.value; // Valor de input tipo date
    const newDate = moment(inputDate).format('YYYY-MM-DD'); // Convertir a formato deseado
    setFormattedDate(newDate);
  };

  useEffect(() => {
    setChecked(mission_5?.cmd === "take_photo" ? true : false);
  }, [mission_5]);

  const changeImage = async (el) => {
    setObjUpdate(el);
    setChooseImage(true);
    await setData([]);
    await listAllByFolder("images/logos_sin_fondo", setData);
  };

  const handleChange = (event, m) => {
    const qtys = qty;
    qtys.push('');

    const {
      target: { value },
    } = event;
    console.log('testttt', value);
    setSelectedOptions(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
    setQty(qtys)
  };

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
            Actualizar imagen de: {objUpdate.name}
          </Typography>
        </Grid>

        {data.map((el, i) => (
          <Grid key={i} item xs={6} md={2} textAlign={"center"}>
            <Controller
              name={objUpdate.propertyName}
              control={control}
              render={({ field }) => {
                return (
                  <img
                    className="rounded"
                    src={el}
                    onClick={(e) => {
                      //console.log(objUpdate.propertyName, "property name");
                      const elem = ["header", "header_line_1", "header_line_2", "line_1", "line_2"];
                      !elem.includes(objUpdate.propertyName)
                        ? field.onChange({
                          cmd: field.value?.cmd || "none",
                          img: el,
                        })
                        : field.onChange(el);

                      setChooseImage(false);
                    }}
                    alt="el"
                  />
                );
              }}
            />
            {/* <img width={"100%"} className="rounded" src={el} alt="item" /> */}
          </Grid>
        ))}
      </Grid>
    );
  }

  return (

    <Grid
      container
      padding={5}
      rowSpacing={2}
      columnSpacing={{ xs: 1, sm: 1, md: 3 }}
    >
      {loading ? (
        <Typography> loading... </Typography>
      ) : (
        <>
          <Grid item xs={12} md={3}>
            {params === "update" ? (
              <div>
                <Typography className="text-16 sm:text-20 truncate font-semibold">
                  {name} ({year_month})
                </Typography>
                <Typography className="text-16 sm:text-20 truncate font-normal">
                  Creado: {moment(created_at).format("DD/MM/YYYY")}
                </Typography>
              </div>
            ) : (
              <div>
                <Typography className="text-16 sm:text-20 truncate font-semibold">
                  Nombre
                </Typography>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      error={!!errors.name}
                      required
                      helperText={errors?.name?.message}
                      autoFocus
                      id="name"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </div>
            )}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Tomar foto
            </Typography>
            <Typography className="text-16 sm:text-20 truncate font-normal">
              Reemplaza Misión 5
            </Typography>
          </Grid>

          <Grid item xs={4} md={1}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Habilitar
            </Typography>
            <Controller
              name="mission_5"
              control={control}
              render={({ field }) => {
                return (
                  <Switch
                    onChange={(e) => {
                      setChecked(e.target.checked);
                      field.onChange({
                        img: field.value.img,
                        cmd: e.target.checked ? "take_photo" : "none",
                      });
                    }}
                    checked={checked}
                  />
                );
              }}
            />
          </Grid>

          <Grid item xs={8} md={2}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Fecha de expiración
            </Typography>

            <Controller
              name="expire_at"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  value={formattedDate}
                  className="mt-8 mb-16"
                  error={!!errors.expire_at}
                  required
                  onChange={handleDateChange}
                  helperText={errors?.expire_at?.message}
                  id="expire_at"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={8} md={2}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
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
                  label="Canal"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value='0' > Seleccione un Canal</MenuItem>
                  {channels?.map((c, ci) => {

                    return <MenuItem key={ci} value={c.id} > {c.id}</MenuItem>

                  })}
                  {/* <MenuItem value="Cocas" style={{ backgroundColor: 'red' }}><img className="imgSelect" src="assets/images/etc/coca.jpg" /></MenuItem> */}

                </Select>
              )}
            />
          </Grid>
          <Grid item xs={8} md={2}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
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
                  label="GEC"
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value='0' > Seleccione un GEC</MenuItem>
                  {gecs?.map((g, gi) => {

                    return <MenuItem key={gi} value={g.id} > {g.id}</MenuItem>

                  })}
                  {/* <MenuItem value="Cocas" style={{ backgroundColor: 'red' }}><img className="imgSelect" src="assets/images/etc/coca.jpg" /></MenuItem> */}

                </Select>
              )}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Subir archivo excel
            </Typography>
            <Controller
              name="excel_file"
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
                  <Typography className="text-14 sm:text-18 ml-10">
                    {excel_file?.name || ""}
                  </Typography>
                </div>
              )}
            />
          </Grid>

          <br />
          <Grid item xs={12} md={6}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Encabezado Bingo
            </Typography>

            <img width={"60%"} className="rounded" src={header || ""} alt="item" />
            <Button className="hoverEdit"
              onClick={() =>
                changeImage({
                  propertyName: "header",
                })
              }
            >
              Cargar imagen
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Encabezado Linea 1
            </Typography>

            <img width={"60%"} className="rounded" src={header_line_1 || ""} alt="item" />
            <Button className="hoverEdit"
              onClick={() =>
                changeImage({
                  propertyName: "header_line_1",
                })
              }
            >
              Cargar imagen
            </Button>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Encabezado Linea 2
            </Typography>

            <img width={"60%"} className="rounded" src={header_line_2 || ""} alt="item" />
            <Button className="hoverEdit"
              onClick={() =>
                changeImage({
                  propertyName: "header_line_2",
                })
              }
            >
              Cargar imagen
            </Button>
          </Grid>


          {[
            mission_1,
            mission_2,
            mission_3,
            mission_4,
            mission_5,
            mission_6,
            mission_7,
            mission_8,
            mission_9,
            mission_10,
          ].map((el, i) => {

            const mision = {
              name: "Misión " + (i + 1),
              propertyName: "mission_" + (i + 1),
              item: el
            };
            const imagenMarca = brands.find(objeto => objeto.id === mision?.item?.brand_id);
            return (
              <Grid key={i} item xs={6} md={2.4} textAlign={"center"}>
                <Typography className="text-16 sm:text-20 truncate font-semibold">
                  Misión {i + 1}
                </Typography>
                <div className="imgH">
                  {el?.cmd != "take_photo" ? (
                    <div>
                      {imagenMarca &&
                        <div style={{ backgroundColor: '#' + imagenMarca.color }}>
                          <img
                            width={"100%"}
                            className="rounded"

                            src={imagenMarca.logo}
                            alt="item" />
                        </div>}

                      {/*<img
                        width={"100%"}
                        className="rounded"
                        src={el?.img}
                        alt="item"
                    />*/}


                    </div>

                  ) : (
                    el?.cmd === "take_photo" &&
                    "SACAR FOTO"
                  )}
                </div>

                {/* <Button className="hoverEdit" onClick={() => changeImage(mision)}>
                  Cargar imagen
                </Button> */}

                <Button className="hoverEdit" onClick={() => handleOpen(i, mision)} >Cargar Mision</Button>

                <Modal
                  open={selectedMission === i}
                  key={i}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className='modal'
                  BackdropProps={{ style: { backgroundColor: "transparent" } }}
                >

                  <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                      {mision.name}
                    </Typography>

                    <Controller
                      name={`mission_${i + 1}.label`}
                      control={control}
                      render={({ field }) => (

                        <TextField
                          {...field}
                          className="mt-8 mb-16"
                          error={!!errors.label}
                          value={mision.item?.label || ''}
                          //onChange={(e) => changeLabel(e, mision, i)}
                          onChange={(event) => {
                            setLabelValue(event.target.value);
                            field.onChange(event);
                          }}
                          required
                          helperText={errors?.label?.message}
                          id={`mission_${i + 1}.label`}
                          label='Label'

                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />

                    <Controller
                      name={`mission_${i + 1}.brand_id`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <InputLabel id="marcas-select" sx={{ fontSize: 12 }}>
                            Marcas
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="marcas-select"
                            id={`mission_${i + 1}.brand_id`}
                            value={field.value || '0'}
                            label="Marcas"
                            fullWidth
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                              handleChangeBrand(value, i);
                            }}
                          >
                            <MenuItem value='0'> Seleccione una Marca</MenuItem>
                            {brands.map((br, bri) => {

                              return <MenuItem key={i + '-' + bri} value={br.id} style={{ backgroundColor: '#' + br.color }}> {(br.logo) ? <img className="imgSelect" src={br.logo} /> : br.brand}</MenuItem>

                            })}

                          </Select>
                        </div>
                      )}
                    />
                    {brandId != null &&
                      <Controller
                        name={`mission_${i + 1}.target.sku`}
                        control={control}
                        render={({ field }) => (
                          <div className="skuObj">
                            <InputLabel id={`select-sku-${i}`} sx={{ fontSize: 12 }}>
                              SKU
                            </InputLabel>
                            <Select
                              labelId={`select-sku-${i}`}
                              id={`mission_${i + 1}.target.sku`}
                              multiple
                              value={selectedOptions || '0'}
                              onChange={(e) => handleChange(e, mision)}
                              input={<OutlinedInput label="Tag" />}
                              renderValue={(selected) => selected.join(', ')}
                              MenuProps={MenuProps}
                              fullWidth
                            >
                              {filterProducts.map((option) => (
                                <MenuItem key={option.sku} value={option.sku}>
                                  <Checkbox checked={selectedOptions.indexOf(option.sku) > -1} />
                                  <ListItemText primary={option.sku} />
                                </MenuItem>
                              ))}
                            </Select>
                          </div>
                        )}
                      />
                    }
                    {/* <Controller
                      name={`mission_${i + 1}.target.sku`}
                      control={control}
                      defaultValue={[]}
                      render={({ field }) => (
                        <div className="skuObj">
                          <InputLabel id={`select-sku-${i}`} sx={{ fontSize: 12 }}>
                            SKU
                          </InputLabel>
                          <Select
                            labelId={`select-sku-${i}`}
                            id={`mission_${i + 1}.target.sku`}
                            multiple
                            value={field.value}
                            onChange={(e) => {
                              const selectedOptions = e.target.value;
                              field.onChange(selectedOptions);
                            }}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            fullWidth
                          >
                            {filterProducts.map((option) => (
                              <MenuItem key={option.sku} value={option.sku}>
                                <Checkbox checked={field.value.indexOf(option.sku) > -1} />
                                <ListItemText primary={option.sku} />
                              </MenuItem>
                            ))}
                          </Select>
                        </div>
                      )}
                    /> */}


                    <hr
                      style={{
                        color: 'black',
                        backgroundColor: '#605f5f82',
                        height: 2,
                        marginBottom: 15
                      }}
                    />
                    {selectedOptions.length > 0 ?
                      <div className="skuList">

                        {selectedOptions.map((option, opIndex) => (
                          <Grid container direction="row" spacing={1} key={opIndex}>
                            <Grid item xs={2} md={6}>
                              <TextField id="modal-modal-title" label='SKU' value={option} />
                            </Grid>
                            <Grid item xs={2} md={6}>
                              <Controller
                                name={`qty-${option}-${opIndex}`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    className="mt-8 mb-16"
                                    type='number'
                                    error={!!errors.qty}
                                    required
                                    value={qty[opIndex] || ''}
                                    onChange={(event) => {
                                      setQty((prevQty) => {
                                        const updatedQty = [...prevQty];
                                        updatedQty[opIndex] = event.target.value;
                                        return updatedQty;
                                      });
                                      field.onChange(event);
                                    }}
                                    helperText={errors?.qty?.message}
                                    id={`qty-${option}-${opIndex}`}
                                    label='Objetivo'
                                    size="small"
                                    variant="outlined"
                                    fullWidth
                                  />
                                )}
                              />
                            </Grid>
                          </Grid>
                        ))}

                      </div>
                      :
                      <Typography variant="h6" component="h2">
                        No hay SKU seleccionados
                      </Typography>
                    }

                    <Box className="buttonBox"
                      p={2}
                    >
                      <Button className="hoverEdit" onClick={() => handleSaveMission(i, mision)} >Guardar</Button>
                    </Box>
                  </Box>
                </Modal>
              </Grid >
            );
          })}

          <Grid item xs={12} md={6}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Premios Linea 1
            </Typography>

            <img width={"60%"} className="rounded" src={line_1 || ""} alt="item" />
            <Button className="hoverEdit"
              onClick={() =>
                changeImage({
                  propertyName: "line_1",
                })
              }
            >
              Cargar imagen
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              Premios Linea 2
            </Typography>
            <img width={"60%"} className="rounded" src={line_2 || ""} alt="item" />
            <Button className="hoverEdit"
              onClick={() =>
                changeImage({
                  propertyName: "line_2",
                })
              }
            >
              Cargar imagen
            </Button>
          </Grid>
        </>
      )}

    </Grid >
  );
}

export default BasicInfo;
