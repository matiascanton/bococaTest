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
} from '../store/stocksSlice';
import { useDispatch, useSelector } from "react-redux";
import { listAllByFolder } from "app/configs/fbServices";
import Divider from '@mui/material/Divider';
import { filter, values } from "lodash";
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';

function BasicInfo(props) {
  const { params } = props;
  const methods = useFormContext();
  const { control, formState, setValue } = methods;
  const { errors } = formState;
  const {
    title,
    month,
    year,
    channel,
    gec,
    questions,
    bonus
  } = control._formValues;

  const [months, setMonths] = useState(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'])
  const [years, setYears] = useState([]);
  const [types, setTypes] = useState('sku');
  const [checked, setChecked] = useState(true);
  const [channels, setChannels] = useState();
  const [gecs, setGecs] = useState();
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [bonuses, setBonuses] = useState([]);
  const [bonusesSave, setBonusesSave] = useState([]);
  const [objUpdate, setObjUpdate] = useState("");
  const [chooseImage, setChooseImage] = useState(false);
  const [data, setData] = useState([]);
  const [imagen, setImagen] = useState(false)
  const [filterProducts, setFilterProducts] = useState(products);
  const [selectedBrand, setSelectedBrand] = useState([])
  const [question, setQuestion] = useState([])
  const [questionType, setQuestionType] = useState('0')
  const [options, setOptions] = useState(['', ''])
  const dispatch = useDispatch();
  const [formData, setFormData] = useState([]);
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
    const currentYear = new Date().getFullYear();
    const yearss = [];

    for (let i = 0; i < 5; i++) {
      yearss.push(currentYear + i);
    }
    setYears(yearss);

  }, [])

  useEffect(() => {
    dispatch(getVariables()).then((res) => {
      setChannels(res.payload.channels);
      setGecs(res.payload.gec);
      //setLoading(false);
    });
  }, [dispatch]);

  const changeQuestion = (event, value) => {
    const quest = value.props.value
    console.log('value', quest)
    setQuestionType(quest)
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

  const channelSelected = (ev) => {
    const gecList = channels.find(item => item.canal === ev.target.value)
    setGecs(gecList.gec)
  }


  const saveQuestion = () => {
    let opts = options
    if (questionType === 'pyr') {
      opts = []
    }
    setFormData([...formData, {
      type: questionType,
      question: question,
      options: opts,
    }]);
    setQuestion('')
    setOptions(['', ''])
    setQuestionType('0')

  }


  const handleAddOption = () => {
    setOptions([...options, ""]);
  }
  const handleDeleteOption = () => {
    if (options.length > 2) {
      const updatedOptions = [...options];
      updatedOptions.pop(); // Elimina el último elemento
      setOptions(updatedOptions);
    }

  };

  const handleEliminarClick = (indice) => {
    setFormData(formData.filter((objet, i) => i !== indice))
  };

  useEffect(() => {
    setValue("questions", formData
      , {
        shouldDirty: true,
        shouldValidate: true,
      });
  }, [formData])


  return (
    <div className="ml-10">
      <Grid
        container
        padding={2}
        rowSpacing={3}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}

      >
        <Grid item xs={6} md={6} >
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
              />
            )}
          />
        </Grid>

        <Grid item xs={4} md={3}>
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
        <Grid item xs={4} md={3}>
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

      </Grid>
      {params !== 'view' &&
        <>
          <Grid
            container
            padding={2}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 3 }}
          >
            <Grid item xs={6} md={4} >
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
            <Grid item xs={6} md={4} >
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
            <Grid item xs={6} md={4} >
              <Typography className="text-16 sm:text-16 truncate font-semibold">
                Puntos
              </Typography>
              <Controller
                name="bonus"
                control={control}
                render={({ field }) => (
                  <TextField
                    className=" mb-16"
                    required
                    {...field}
                    inputProps={{ inputMode: 'numeric' }}

                    placeholder="Ingrese Bonus"
                    id="bonus"
                    variant="outlined"
                    fullWidth
                    disabled={params === 'view'}
                    onChange={(event) => {
                      const value = parseInt(event.target.value);
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Grid>


          </Grid>

        </>
      }
      <Divider />
      <Grid
        container
        padding={2}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1 }}
      >
        <Grid item xs={4} md={2}>
          <Typography className="text-16 sm:text-16 truncate font-semibold">
            Tipo
          </Typography>
          <Select
            id="type"
            defaultValue={'0'}
            variant="outlined"
            fullWidth
            disabled={params === 'view'}
            onChange={changeQuestion}
          >
            <MenuItem value='0' >Seleccione tipo de pregunta</MenuItem>
            <MenuItem value='pyr' >Pregunta y respuesta</MenuItem>
            <MenuItem value='mc' >Pregunta de opciones multiples</MenuItem>
            <MenuItem value='mcu' >Pregunta de opcion unica</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Grid
        container
        padding={2}
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 1, md: 1 }}
      >
        {questionType !== '0' &&
          <>

            <Grid item xs={4} md={12}>
              <Typography className="text-16 sm:text-16 truncate font-semibold">
                Pregunta
              </Typography>
              <TextField value={question} fullWidth onChange={(e) => setQuestion(e.target.value)} />
            </Grid>


            {questionType !== 'pyr' &&
              <>
                {options.map((o, index) => (

                  <Grid item xs={6} md={2} key={index}>
                    <Typography className="text-16 sm:text-16 truncate font-semibold">
                      Opcion {index + 1}
                    </Typography>

                    <TextField fullWidth value={o} onChange={(e) => {
                      const updatedOptions = [...options];
                      updatedOptions[index] = e.target.value;
                      setOptions(updatedOptions);
                    }} />
                  </Grid>
                ))}
                <Grid item xs={4} md={0.3}>
                  <IconButton aria-label="Agregar" type="button" onClick={handleAddOption} className='mt-20'>
                    <FuseSvgIcon size={26} color="primary">
                      heroicons-outline:plus-circle
                    </FuseSvgIcon>
                  </IconButton>
                </Grid>
                <Grid item xs={4} md={0.3}>
                  <IconButton aria-label="Agregar" type="button" onClick={handleDeleteOption} className='mt-20'>
                    <FuseSvgIcon size={26} color="primary">
                      heroicons-outline:minus-circle
                    </FuseSvgIcon>
                  </IconButton>
                </Grid>

              </>
            }

            <Grid item xs={4} md={12}>
              <Button type="button" onClick={() => saveQuestion()} className="whitespace-nowrap mx-4 mt-20"
                variant="contained"
                color="primary">
                Guardar Pregunta
              </Button>
            </Grid>



          </>
        }
      </Grid>


      {questions?.map((item, index) => (
        <div key={index}>
          <Grid
            container
            padding={2}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 1, md: 1 }}

          >
            <>
              <Grid item xs={6} md={4}>
                <TextField fullWidth disabled label="Pregunta" value={item.question} />
              </Grid>
              {item.options.length > 0 &&
                item.options.map((i, ix) => (
                  <Grid item xs={6} md={1.5} key={`${i}-${ix}`}>
                    <TextField fullWidth disabled label={`Opción ${ix + 1}`} value={i} />
                  </Grid>
                ))
              }


              {params !== 'view' &&
                <Grid item xs={6} md={0.5}>
                  <IconButton aria-label="Agregar" type="button" onClick={() => handleEliminarClick(index)} >
                    <FuseSvgIcon size={26} color="error">
                      heroicons-outline:trash
                    </FuseSvgIcon>
                  </IconButton>
                </Grid>
              }
            </>
          </Grid>
        </div>

      ))
      }
      <Divider />


    </div >
  );
}

export default BasicInfo;
