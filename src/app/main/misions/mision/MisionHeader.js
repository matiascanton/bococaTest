import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import { upLoadImg } from "../../../utils";
import { updateMision, addFile, addMision, removeMision } from "../store/misionSlice";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { selectUser } from "app/store/userSlice";
import { upLoadSingleImg } from "../../../utils";
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import ConfirmationDialog from "app/shared-components/confirmationDialog";

function MisionHeader(props) {
  const { params } = props;
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const images = watch("image");
  const estado = watch("status")
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const { misionId } = routeParams;
  const storage = getStorage();
  const user = useSelector(selectUser);
  const excel_file = watch("file_id");
  const [loading, setLoading] = useState(false);
  const handleSaveMision = async () => {
    const data = getValues();
    console.log('data a guardar: ', data);

    if (

      data.channel === "0" ||
      data.gec === "0" ||
      data.name === "" ||
      data.month === 0 ||
      data.year === 0 ||
      data.missions.length === 0
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      setLoading(true);
      if (misionId === "new") {
        if (data.bonus === undefined || data.bonus === '') {
          data.bonus = 0;
        }

        dispatch(addMision(data)).then(() => {
          console.log(' se guardo con exito')
          navigate("/misions");
        });

      } else {

        const result = Object.fromEntries(
          Object.entries(data).filter((k) => k[0] !== "updated_at")
        );

        if (result.bonus === undefined || result.bonus === '') {
          result.bonus = 0;
        }

        result.missions.forEach(function (objeto) {
          objeto.points = parseInt(objeto.points);
          objeto.target = parseInt(objeto.target);
        });
        console.log('guardar', result)

        dispatch(updateMision(result)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") setAlert(true);
          if (res.meta.requestStatus === "rejected") setAlert(false);
          navigate("/misions");
        });

      }
    }
  };

  function handleRemoveMision() {
    setOpenDialog(true);
  }

  function confirmRemove() {
    const data = getValues();
    dispatch(removeMision(data.id)).then(() => {
      navigate("/misions");
    });
    setOpenDialog(false);
  }

  function cancelRemove() {
    setOpenDialog(false);
  }

  function handlePublic() {
    const data = getValues();
    delete data.updated_at
    data.status = "publicado"
    console.log('data', data)
    dispatch(updateMision(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setAlert(true);
      if (res.meta.requestStatus === "rejected") setAlert(false);
      navigate("/misions");
    });
  }

  function handleCancel() {
    const data = getValues();
    delete data.updated_at
    data.status = "cancelado"
    dispatch(updateMision(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setAlert(true);
      if (res.meta.requestStatus === "rejected") setAlert(false);
      navigate("/misions");
    });
  }

  ///TODO eliminar este useEffect, creado para ver los archivos en el storage
  useEffect(() => {
    const listRef = ref(storage, "files/bingo");

    listAll(listRef)
      .then((res) => {
        console.log(res, "res");
        res.prefixes.forEach((folderRef) => {
          console.log(folderRef, "folderRef");
        });
        res.items.forEach((itemRef) => {
          console.log(itemRef, "itemRef");
        });
      })
      .catch((error) => { });
  }, []);

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
              to="/misions"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Misiones</span>
            </Typography>
          </motion.div>
          <div className="flex max-w-full">

            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {params === 'new'
                  ? "Nueva Misión"
                  : params === 'update'
                    ? "Actualizar Misión"
                    : 'Vista de Misión'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle de la Misión
              </Typography>
            </motion.div>
          </div>
        </div>
        {misionId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <ConfirmationDialog
              open={openDialog}
              title="Confirmar Eliminación"
              message="¿Estás seguro de que deseas eliminar esta Mision?"
              onCancel={cancelRemove}
              onConfirm={confirmRemove}
            />
            {misionId === "update" &&
              <Button
                className="whitespace-nowrap mx-4 custom-button"
                variant="contained"
                color="secondary"
                onClick={handleRemoveMision}
                startIcon={
                  <FuseSvgIcon className="hidden sm:flex">
                    heroicons-outline:trash
                  </FuseSvgIcon>
                }
              >
                Eliminar
              </Button>
            }
            <LoadingButton
              className="custom-button"
              color="secondary"
              onClick={() => { handleSaveMision(); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={
                misionId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
              }
            >
              <span>Guardar</span>
            </LoadingButton>

            {misionId === "update" &&
              estado === "pendiente" &&
              <Button
                className="whitespace-nowrap mx-4"
                variant="contained"
                color="success"
                onClick={handlePublic}
                startIcon={
                  <FuseSvgIcon className="hidden sm:flex">
                    heroicons-outline:upload
                  </FuseSvgIcon>
                }
              >
                Publicar
              </Button>
            }
            {misionId === "update" &&
              estado === "publicado" &&
              <Button
                className="whitespace-nowrap mx-4"
                variant="contained"
                color="error"
                onClick={handleCancel}
                startIcon={
                  <FuseSvgIcon className="hidden sm:flex">
                    heroicons-outline:x
                  </FuseSvgIcon>
                }
              >
                Cancelar
              </Button>
            }

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

export default MisionHeader;
