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
import { addNews, updateNews, removeNews } from "../store/newSlice";
import { useDispatch } from "react-redux";
import { upLoadSingleImg } from "../../../utils";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import ConfirmationDialog from "app/shared-components/confirmationDialog";

function NewsHeader(props) {
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const imageMini = watch("img_brief");
  const imageDetail = watch("img_description")
  const name = watch("channel");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { newsId } = routeParams;
  const [loading, setLoading] = useState(false);

  function handleSaveNews() {
    const data = getValues();
    if (
      data.channel === 0 ||
      data.gec === 0 ||
      data.name === '' ||
      data.date_due === null
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });

    } else {

      if (newsId === "new") {

        upLoadSingleImg(data, imageMini).then(() => {
          data.img_brief = data.image
          delete data.image
          upLoadSingleImg(data, imageDetail).then(() => {
            data.img_description = data.image
            delete data.image
            dispatch(addNews(data)).then(() => {
              setLoading(false)
              navigate("/news");
            });
          });
        });

      } else {

        delete data.updated_at
        if (imageMini instanceof File) {
          upLoadSingleImg(data, imageMini).then(() => {
            data.img_brief = data.image
            delete data.image
          });
        }
        if (imageDetail instanceof File) {
          upLoadSingleImg(data, imageDetail).then(() => {
            data.img_description = data.image
            delete data.image
          });
        }
        dispatch(updateNews(data)).then((res) => {
          console.log('dataaaa2', res)
          if (res.meta.requestStatus === "fulfilled") setAlert(true);
          if (res.meta.requestStatus === "rejected") setAlert(false);
          setLoading(false)
          navigate("/news");
        });

      }
    }
    setLoading(false)
  }

  function handleRemoveNews() {
    setOpenDialog(true);
  }

  function confirmRemoveNews() {
    const data = getValues();
    dispatch(removeNews(data.id)).then(() => {
      navigate("/news");
    });
    setOpenDialog(false);
  }

  function cancelRemoveNews() {
    setOpenDialog(false);
  }

  /*useEffect(() => {
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
  }, [images]);*/

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
              to="/news"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Novedades</span>
            </Typography>
          </motion.div>

          <div className="flex items-center max-w-full">

            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {newsId === 'update' ? "Actualizar Novedad" :
                  newsId === 'new' ? "Nueva Novedad" : 'Ver Novedad'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle del Novedad
              </Typography>
            </motion.div>
          </div>
        </div>
        {newsId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <Button
              className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleRemoveNews}
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
              message="¿Estás seguro de que deseas eliminar esta Novedad?"
              onCancel={cancelRemoveNews}
              onConfirm={confirmRemoveNews}
            />

            <LoadingButton
              className="custom-button"
              color="secondary"
              onClick={() => { handleSaveNews(); setLoading(true); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={
                newsId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
              }
            >
              <span>Guardar</span>
            </LoadingButton>
          </motion.div>
        }
      </div>
      {openAlert.alert && (
        <Alert severity="success">Los datos se guardaron correctamente</Alert>
      )}
      {openAlert.alert === false ? (
        <Alert severity="error">{openAlert.msg}</Alert>
      ) : null}
    </div>
  );
}

export default NewsHeader;
