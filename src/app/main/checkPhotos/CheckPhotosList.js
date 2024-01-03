import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";

import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  getCheckPhotos,
  selectCheckPhotos,
  selectCheckPhotosSearchText,
} from "./store/checkPhotosSlice";
import { Button, CircularProgress, ButtonGroup, Tooltip, Grid, Card, CardHeader, CardMedia, CardActions, IconButton } from "@mui/material";
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
  imageGrid: {
    width: '80%',
    height: '80%',
    objectFit: 'cover',
  },
  imageOne: {
    width: '70%',
    height: '70%',
    objectFit: 'cover',
  },
  actions: {
    justifyContent: 'center',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonGreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    border: '1px solid green',
    borderRadius: '20px',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: 'green',
      color: 'white'
    },
  },
  buttonRed: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    border: '1px solid red',
    borderRadius: '20px',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      backgroundColor: 'red',
      color: 'white'
    },
  },
  buttonsGroup: {
    padding: '5px',
    marginRight: '10px',
    marginBottom: '20px'

  },
  buttonGrid: {
    display: 'flex',
    alignItems: 'right',
    justifyContent: 'right',

  },
  buttonCheck: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5px !important',
    color: 'gray',
  },
  buttonType: {
    color: 'gray',
    borderColor: 'gray',
  }
}));

const CustomButtonGroup = styled(ButtonGroup)({
  borderRadius: '5px', // Cambia el valor según tus necesidades
  color: 'gray',
});

function CheckPhotosList(props) {
  const dispatch = useDispatch();
  const checkPhotos = useSelector(selectCheckPhotos);
  const classes = useStyles();
  //const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(null);
  const [grid, setGrid] = useState(true)
  //const [data, setData] = useState(checkPhotos);
  const [data, setData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState();
  const [dataType, setDataType] = useState(0)
  const [filterData, setFilterData] = useState(data)
  const [cant, setCant] = useState([{ id: 0, num: 0 }, { id: 1, num: 0 }, { id: 2, num: 0 }, { id: 3, num: 0 }])


  useEffect(() => {
    setData([
      { id: 1, client_id: '1234', url: 'https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/images%2Fproductos%2F291.png?alt=media&token=759d39a5-228c-4201-b125-41ba81d3c38d', estado: null },
      { id: 2, client_id: '2222', url: 'https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/images%2Fproductos%2F2649.png?alt=media&token=32c0e2f4-18b5-4554-8c27-8e152178f190', estado: "APROBADO" },
      { id: 3, client_id: '1234434', url: 'https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/images%2Fproductos%2F99515.png?alt=media&token=77e7fac6-cd9f-4146-b064-dad582efd2ec', estado: null },
      { id: 4, client_id: '1212334', url: 'https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/images%2Fproductos%2F99130.png?alt=media&token=e0d8a83b-80d6-4880-8e9c-210affa7300a', estado: "RECHAZADO" },
      { id: 5, client_id: '165654', url: 'https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/images%2Fproductos%2F39.png?alt=media&token=f9cc4258-9f00-4d9f-8139-8e13cb416173', estado: null },
      { id: 6, client_id: '123344', url: 'https://firebasestorage.googleapis.com/v0/b/femsa-arg.appspot.com/o/images%2Fproductos%2F100538.png?alt=media&token=39604115-016d-4324-85b2-d76434fb54b0', estado: null }])

  }, [])

  const handleAccept = (objData) => {

    const updatedImageData = [...data];
    const itemIndex = updatedImageData.findIndex(item => item.client_id === objData.client_id);
    updatedImageData[itemIndex].estado = "APROBADO"
    setData(updatedImageData);
    setIsLoading(null);
  };

  const handleReject = (objData) => {
    const updatedImageData = [...data];
    const itemIndex = updatedImageData.findIndex(item => item.client_id === objData.client_id);
    updatedImageData[itemIndex].estado = "RECHAZADO"
    setData(updatedImageData);
    setIsLoading(false);
  };

  const handleAcceptOne = (objData) => {
    const updatedImageData = [...data];
    const itemIndex = updatedImageData.findIndex(item => item.client_id === objData.client_id);
    updatedImageData[itemIndex].estado = "APROBADO"
    setData(updatedImageData);
    console.log('objData', objData);
    const indiceObjetoNull = data.findIndex((objeto) => objeto.estado === null);
    setCurrentImageIndex(data[indiceObjetoNull])

  };

  const handleRejectOne = () => {
    const updatedImageData = [...data];
    const itemIndex = updatedImageData.findIndex(item => item.client_id === objData.client_id);
    updatedImageData[itemIndex].estado = "RECHAZADO"
    setData(updatedImageData);
    console.log('objData', objData);
    const indiceObjetoNull = data.findIndex((objeto) => objeto.estado === null);
    setCurrentImageIndex(data[indiceObjetoNull])
  };

  const handleChangeType = (tipo) => {
    setDataType(tipo)
  }

  useEffect(() => {
    let dataOrdenada = [...filterData];

    dataOrdenada.sort((a, b) => {
      if (a.estado === null && b.estado !== null) {
        return -1; // a viene antes que b
      } else if (a.estado !== null && b.estado === null) {
        return 1; // a viene después de b
      } else {
        return 0; // no se cambia el orden
      }
    });
    if (dataType === 0) {
      setFilterData(dataOrdenada)
    }
    if (dataType === 1) {
      setFilterData(dataOrdenada.filter(item => item.estado === null));
    }
    if (dataType === 2) {
      setFilterData(dataOrdenada.filter(item => item.estado === "APROBADO"));
    }
    if (dataType === 3) {
      setFilterData(dataOrdenada.filter(item => item.estado === "RECHAZADO"));
    }

  }, [data]);

  useEffect(() => {

    if (dataType === 0) {
      setFilterData(data)
    }
    if (dataType === 1) {
      setFilterData(data.filter(item => item.estado === null));
    }
    if (dataType === 2) {
      setFilterData(data.filter(item => item.estado === "APROBADO"));
    }
    if (dataType === 3) {
      setFilterData(data.filter(item => item.estado === "RECHAZADO"));
    }
  }, [dataType]);
  /*useEffect(() => {
    dispatch(getCheckPhotos()).then((resp) => {
      setLoading(false);
    });
    
  }, [dispatch]);*/


  const changeGrid = () => {
    if (grid) {
      const indiceObjetoNull = data.findIndex((objeto) => objeto.estado === null);
      setCurrentImageIndex(data[indiceObjetoNull])
    }
    setGrid(!grid)
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No hay imagenes para Validar
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full p-10 m-10">
      <FuseScrollbars className="grow overflow-x-auto p-5">
        <div className={classes.buttonsGroup}>
          <CustomButtonGroup variant="outlined" className={classes.buttonCheck} aria-label="info button group">
            <Button className={classes.buttonType} onClick={() => handleChangeType(0)} sx={{ backgroundColor: dataType === 0 && '#9d9999', color: dataType === 0 && 'white !important' }} disabled={!grid}>Todos</Button>
            <Button className={classes.buttonType} onClick={() => handleChangeType(1)} sx={{ backgroundColor: dataType === 1 && '#9d9999', color: dataType === 1 && 'white !important' }} disabled={!grid}>Sin Clasificar</Button>
            <Button className={classes.buttonType} onClick={() => handleChangeType(2)} sx={{ backgroundColor: dataType === 2 && '#9d9999', color: dataType === 2 && 'white !important' }} disabled={!grid}>Aprobados</Button>
            <Button className={classes.buttonType} onClick={() => handleChangeType(3)} sx={{ backgroundColor: dataType === 3 && '#9d9999', color: dataType === 3 && 'white !important' }} disabled={!grid}>Rechazados</Button>
          </CustomButtonGroup>

          <div className={classes.buttonGrid}>
            <Button onClick={changeGrid} >
              Vista:
              <FuseSvgIcon size={40} color="info">
                {grid ? 'heroicons-solid:view-grid' : 'heroicons-solid:photograph'}
              </FuseSvgIcon>
            </Button>
          </div>
        </div>

        {grid ? (
          <Grid container spacing={2}>
            {filterData.map((image, index) => (
              <Grid item key={index} xs={6} sm={4} md={3}>
                <Card sx={{ maxWidth: 345, border: 3, borderColor: image.estado === null ? '#f7f7f7' : image.estado === "APROBADO" ? "green" : "red" }}>
                  <CardHeader
                    subheader={`Cliente: ${image.client_id}`}
                  />
                  <div className={classes.imageContainer}>
                    <CardMedia
                      component="img"

                      className={classes.imageGrid}
                      image={image.url}
                      alt={image.id}
                    /></div>
                  <CardActions className={classes.actions}>


                    <Button className={classes.buttonGreen}
                      onClick={(event) => {
                        setIsLoading(index);
                        setTimeout(() => {
                          handleAccept(image);
                        }, 1000);
                      }}
                      sx={{ backgroundColor: image.estado === "APROBADO" ? 'green' : 'white', color: image.estado === "APROBADO" ? 'white' : 'green' }}>
                      {isLoading === index ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        <FuseSvgIcon size={30} >
                          heroicons-solid:check
                        </FuseSvgIcon>
                      )}
                    </Button>
                    <Button className={classes.buttonRed} onClick={(event) => handleReject(image)} sx={{ backgroundColor: image.estado === "RECHAZADO" ? 'red' : 'white', color: image.estado === "RECHAZADO" ? 'white' : 'red' }}>
                      <FuseSvgIcon size={30} >
                        heroicons-solid:x
                      </FuseSvgIcon>
                    </Button>



                  </CardActions>

                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={3}></Grid>
            <Grid item xs={12} sm={12} md={6}>
              <Card>
                <CardHeader subheader={`Cliente: ${currentImageIndex.client_id}`} />
                <div className={classes.imageContainer}>
                  <CardMedia
                    component="img"
                    height="100"
                    className={classes.imageOne}
                    image={currentImageIndex.url}
                    title={currentImageIndex.id}
                  /></div>
                <CardActions className={classes.actions}>
                  <IconButton aria-label="add to favorites" onClick={() => handleAcceptOne(currentImageIndex)}>
                    <FuseSvgIcon size={40} color="success">
                      heroicons-outline:check-circle
                    </FuseSvgIcon>
                  </IconButton>
                  <IconButton aria-label="share" onClick={() => handleRejectOne(currentImageIndex)}>
                    <FuseSvgIcon size={40} color="error">
                      heroicons-outline:x-circle
                    </FuseSvgIcon>
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={12} md={3}></Grid>
          </Grid>
        )}




      </FuseScrollbars>

    </div>
  );
}

export default withRouter(CheckPhotosList);
