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
import { addCanje } from "../store/canjeSlice";
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

function CanjeHeader(props) {
  const { params } = props;

  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const images = watch("img");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const { canjeId } = routeParams;
  const storage = getStorage();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);


  const handleSaveCanje = async () => {
    const data = getValues();
    console.log('data a guardar: ', data);
    if (data.canjes[0].title === '') {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      console.log('user', user)
      console.log('data', data.canjes)
      const canjesModificados = data.canjes.map(canje => {
        if (canje.channel === "") {
          delete canje.channel;
          delete canje.gec;
          canje.client_ids = canje.client_ids.split(/\s*,\s*/);
        } else {
          delete canje.client_ids;
        }
        canje.user_id = user.id
        return canje;
      });
      console.log('CANJES', canjesModificados)

      try {
        // Usamos Promise.all para esperar a que todas las promesas se resuelvan
        await Promise.all(canjesModificados.map(canje => dispatch(addCanje(canje))));
        navigate("/canjes");
      } catch (error) {
        // Maneja los errores, si es necesario
        console.error("Error al agregar canjes:", error);
      }

    }
  };

  function handleRemoveCanje() {
    const data = getValues();
    dispatch(removeCanje(data.id)).then(() => {
      navigate("/canjes");
    });
  }

  ///TODO eliminar este useEffect, creado para ver los archivos en el storage
  /*useEffect(() => {
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
  }, []);*/

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
              to="/canjes"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Canjes</span>
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
                  ? "Nuevo Canje"
                  : params === 'update'
                    ? "Actualizar Canej"
                    : 'Vista de Canje'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle del canje
              </Typography>
            </motion.div>
          </div>
        </div>

        {canjeId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <Button
              className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleRemoveCanje}
              startIcon={
                <FuseSvgIcon className="hidden sm:flex">
                  heroicons-outline:trash
                </FuseSvgIcon>
              }
            >
              Eliminar
            </Button>
            <LoadingButton
              className="custom-button"
              color="secondary"
              onClick={() => { handleSaveCanje(); setLoading(true); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"

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

export default CanjeHeader;
