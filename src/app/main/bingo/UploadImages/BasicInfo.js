import { useEffect, useState } from "react";
import { lighten } from "@mui/material/styles";
import { Controller, useFormContext } from "react-hook-form";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Box from "@mui/material/Box";
import Dropzone from "react-dropzone";
import Typography from "@mui/material/Typography";
import { formatFileSize } from "../../../utils";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { listAllByFolder } from "app/configs/fbServices";
import { Grid, TextField, Select, MenuItem } from "@mui/material";
import "./styles.css";
import IconButton from '@mui/material/IconButton';
import { getImages, updateImages } from "../store/bingoSlice";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import 'firebase/storage';
import firebase from 'firebase/app';
import { getStorage, ref, deleteObject, refFromURL, getMetadata } from "firebase/storage";


function BasicInfo(props) {
  const methods = useFormContext();
  const { control, watch, setValue } = methods;
  const [data, setData] = useState({});
  const [list, setList] = useState([])
  const [lista, setLista] = useState([])
  const [tipo, setTipo] = useState();
  const [loading, setLoading] = useState(false)
  const storage = getStorage();
  const dispatch = useDispatch();

  const handleDeleteImage = (url) => {
    const desertRef = ref(storage, url);
    // Elimina el archivo
    deleteObject(desertRef).then(() => {
      window.location.reload(false);
    }).catch((error) => {
      console.log(`Error al eliminar el archivo: ${error}`);
    });
  }

  const getImageNames = (urls) => {
    const imageNames = urls.map((url) => {
      //const parts = url.split('/');
      let fileName = url.split('%2F').pop().split('?')[0];
      fileName = fileName.replace(/%20/g, ' ');
      return fileName;
    });
    setData({
      list: imageNames.map((n) => ({ name: n, type: tipo }))
    })
  };



  /*useEffect(() => {
    changeSelectImg(0)
  }, [])*/

  /*const handleDeleteImage = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setValue("images", newData);
  };*/
  const saveLabel = (datos) => {
    const dataAguardar = {
      name: datos.name,
      type: datos.type,
      label: datos.label
    }

    dispatch(updateImages(dataAguardar)).then((res) => {
      //if (res.meta.requestStatus === "fulfilled")
      // if (res.meta.requestStatus === "rejected")
    });
  }

  const handleChange = (event, index) => {
    const updatedLabels = [...lista];
    updatedLabels[index].label = event.target.value;
    setLista(updatedLabels);
  };


  /*const changeImage = async () => {
    await setData([]);
    await listAllByFolder("images/logos_sin_fondo", setData);
    await listAllByFolder("images/logos_con_fondo", setData);
    await listAllByFolder("images/empaques", setData);
  };*/

  const changeSelectImg = async (e) => {
    await setList([]);
    switch (e) {
      case 1:
        setTipo("logos_con_fondo")
        await listAllByFolder("images/logos_con_fondo", setList);
        break;
      case 2:
        setTipo("logos_sin_fondo")
        await listAllByFolder("images/logos_sin_fondo", setList);
        break;
      case 3:
        setTipo("empaques")
        await listAllByFolder("images/empaques", setList);
        break;
    }
  }

  useEffect(() => {

    getImageNames(list);
    console.log('data', data)

    if (data) {
      dispatch(getImages(data)).then((resp) => {
        const respuesta = list.map((l, index) => {
          return {
            url: l,
            label: resp.payload[index]?.label,
            name: resp.payload[index]?.name,
            type: resp.payload[index]?.type
          }
        })
        setLista(respuesta)

        console.log('resp', resp.payload)

      });
    }

    setLoading(false)

  }, [list])


  return (
    <div className="flex flex-col flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-20 px-24 md:px-20">
      <Controller
        name="images"
        control={control}
        //defaultValue={[]}
        render={({ field: { onChange, value } }) => (
          <>
            <Grid
              container
              padding={5}
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            >
              <Grid item xs={6} md={4} ></Grid>
              <Grid item xs={6} md={4} textAlign={"center"}>
                <Typography className="text-16 sm:text-16 truncate font-semibold">
                  Imagenes
                </Typography>
                <Select
                  id="selectImg"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => {
                    setLoading(true)
                    const val = e.target.value
                    changeSelectImg(val)
                  }}
                  defaultValue={-1}
                >
                  <MenuItem key={3} value={-1} disabled> Seleccione una Categoria</MenuItem>
                  <MenuItem key={0} value={0} > Todas</MenuItem>
                  <MenuItem key={1} value={1} > Imagenes con Fondo</MenuItem>
                  <MenuItem key={2} value={2} > Imagenes sin Fondo</MenuItem>
                  <MenuItem key={4} value={3} > Empaques</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={4} ></Grid>
            </Grid>
            <Dropzone onDrop={onChange}>
              {({ getRootProps, getInputProps }) => (
                <Box
                  sx={{ /* flexDirection: "column", */ width: 380 }}
                  className="flex items-center justify-center "
                >
                  <Typography className="text-14 sm:text-14 mb-20 " sx={{ maxWidth: 210, wordBreak: 'break-all' }}>
                    Arrastre y suelte las imágenes aqui, o haga click y
                    seleccione las imágenes
                  </Typography>
                  <Box
                    {...getRootProps()}
                    sx={{
                      backgroundColor: (theme) =>
                        theme.palette.mode === "light"
                          ? lighten(theme.palette.background.default, 0.4)
                          : lighten(theme.palette.background.default, 0.02),
                    }}
                    component="label"
                    htmlFor="button-file"
                    className="productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
                  >
                    <input {...getInputProps()} />

                    <FuseSvgIcon size={32} color="action">
                      heroicons-outline:upload
                    </FuseSvgIcon>
                  </Box>
                </Box>
              )}
            </Dropzone>
            {value.length != 0 &&
              <ImageList sx={{ width: 1000, height: 250 }}>
                {value.map((item, key) => (
                  <ImageListItem key={key}>
                    <img
                      src={URL.createObjectURL(item)}
                      alt={item.name}
                      loading="lazy"
                      className="imgUpload"
                    />
                    <ImageListItemBar
                      title={item.name}
                      subtitle={formatFileSize(item.size)}
                      position="below"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            }


            <Grid
              container
              padding={5}
              rowSpacing={2}
              columnSpacing={{ xs: 1, sm: 1, md: 3 }}
            >

              {loading ? <FuseLoading /> :
                lista?.map((el, i) => (
                  <Grid key={i} item xs={6} md={2} textAlign={"center"}>

                    <img width={"100%"} className="rounded" src={el.url} alt={el.name} />
                    <TextField value={el.label} onChange={(event) => handleChange(event, i)}></TextField>
                    <button onClick={() => handleDeleteImage(el)}>
                      <FuseSvgIcon size={32} color="error">
                        heroicons-outline:trash
                      </FuseSvgIcon>
                    </button>
                    <button onClick={() => saveLabel(el)}>
                      <FuseSvgIcon size={32} color="success">
                        heroicons-outline:pencil-alt
                      </FuseSvgIcon>
                    </button>
                  </Grid>
                ))}
            </Grid>


          </>
        )}
      />
    </div>
  );
}

export default BasicInfo;