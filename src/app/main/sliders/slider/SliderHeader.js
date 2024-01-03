import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Alert from "@mui/material/Alert";
import { Link, useParams, useNavigate } from "react-router-dom";
import { addSlider, updateSlider, removeSlider } from "../store/sliderSlice";
import { useDispatch } from "react-redux";
import { upLoadSingleImg } from "../../../utils";
import ConfirmationDialog from "app/shared-components/confirmationDialog";

function SliderHeader(props) {
  console.log('headerpropssssssssssssssss', props)
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const images = watch("image");
  const name = watch("channel");
  const type = props.type;
  const [openAlert, setAlert] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sliderId } = routeParams;

  function handleSaveSlider() {
    const data = getValues();
    data.type = type;
    if (sliderId === "new") {
      upLoadSingleImg(data, images).then(() => {
        dispatch(addSlider(data)).then(() => {
          if (type === 'consumers') {
            navigate("/slidersConsumer");
          } else {
            navigate("/sliders");
          }
        });
      });
    } else {
      upLoadSingleImg(data, images).then(() => {
        dispatch(updateSlider(data)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") setAlert(true);
          if (res.meta.requestStatus === "rejected") setAlert(false);
        });
      });
    }
  }

  function handleRemoveSlider() {
    setOpenDialog(true);
  }

  function confirmRemove() {
    dispatch(removeSlider()).then(() => {
      if (type === 'consumers') {
        navigate("/slidersConsumer");
      } else {
        navigate("/sliders");
      }
    });
    setOpenDialog(false);
  }

  function cancelRemove() {
    setOpenDialog(false);
  }

  useEffect(() => {
    //actualizo la imagen en el header
    if (images?.name !== undefined) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreview(reader.result);
      });
      reader.readAsDataURL(images);
    } else {
      setPreview(images);
    }
  }, [images]);

  return (
    <div className="flex flex-col flex-1 w-full ">
      <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
        <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
          >
            <Typography
              className="flex items-center sm:mb-12"
              component={Link}
              role="button"
              to={
                props.type === 'consumers'
                  ? '/slidersConsumer'
                  : '/sliders'
              }
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Sliders</span>
            </Typography>
          </motion.div>

          <div className="flex items-center max-w-full">
            <div className="flex items-center">
              <motion.div
                className="hidden sm:flex"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.3 } }}
              >
                {images !== "" ? (
                  <img
                    //  className="w-52 sm:w-48 rounded"
                    width={150}
                    src={preview}
                  />
                ) : (
                  <img
                    //    className="w-32 sm:w-48 rounded"
                    width={100}
                    src="assets/images/apps/ecommerce/product-image-placeholder.png"
                  />
                )}
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {console.log('name', name)}
                {name ? "Actualizar Slider" : "Nuevo Slider"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle del Slider
              </Typography>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
        >
          <Button
            className="whitespace-nowrap mx-4 custom-button"
            variant="contained"
            color="secondary"
            onClick={handleRemoveSlider}
            startIcon={
              <FuseSvgIcon className="hidden sm:flex">
                heroicons-outline:trash
              </FuseSvgIcon>
            }
          >
            Eliminar
          </Button>
          <ConfirmationDialog
            open={openDialog}
            title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar este Banner?"
            onCancel={cancelRemove}
            onConfirm={confirmRemove}
          />
          <Button
            className="whitespace-nowrap mx-4 custom-button"
            variant="contained"
            color="secondary"
            disabled={
              sliderId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
            }
            onClick={handleSaveSlider}
          >
            Guardar
          </Button>
        </motion.div>
      </div>
      {openAlert && (
        <Alert severity="success">Los datos se guardaron correctamente</Alert>
      )}
      {openAlert === false ? (
        <Alert severity="error">hubo un problema al guardar los datos</Alert>
      ) : null}
    </div>
  );
}

export default SliderHeader;
