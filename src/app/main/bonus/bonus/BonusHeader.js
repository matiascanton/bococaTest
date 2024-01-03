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
import { updateBonus, addFile, addBonus, removeBonus } from "../store/bonusSlice";
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

function BonusHeader(props) {
  const { params } = props;
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const images = watch("image");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const estado = watch("status")
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const { bonusId } = routeParams;
  const storage = getStorage();
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(false);


  const handleSaveBonus = async () => {
    const data = getValues();
    console.log('data a guardar: ', data);
    delete data.bonus
    if (

      data.channel === 0 ||
      data.gec === 0 ||
      data.name === null ||
      data.month === 0 ||
      data.year === 0 ||
      data.points === null
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      if (bonusId === "new") {

        dispatch(addBonus(data)).then(() => {
          console.log(' se guardo con exito')
          navigate("/bonuses");
        });

      } else {
        const result = Object.fromEntries(
          Object.entries(data).filter((k) => k[0] !== "updated_at")
        );

        dispatch(updateBonus(result)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") setAlert(true);
          if (res.meta.requestStatus === "rejected") setAlert(false);
          navigate("/bonuses");
        });

      }
    }
  };

  function handleRemoveBonus() {
    setOpenDialog(true);
  }

  function confirmRemove() {
    const data = getValues();
    dispatch(removeBonus(data.id)).then(() => {
      navigate("/bonuses");
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
    dispatch(updateBonus(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setAlert(true);
      if (res.meta.requestStatus === "rejected") setAlert(false);
      navigate("/bonuses");
    });
  }

  function handleCancel() {
    const data = getValues();
    delete data.updated_at
    data.status = "cancelado"
    dispatch(updateBonus(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setAlert(true);
      if (res.meta.requestStatus === "rejected") setAlert(false);
      navigate("/bonuses");
    });
  }


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
              to="/bonuses"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Bonuses</span>
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
                  ? "Nueva Bonus"
                  : params === 'update'
                    ? "Actualizar Bonus"
                    : 'Vista de Bonus'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle de la Bonus
              </Typography>
            </motion.div>
          </div>
        </div>

        {bonusId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <Button
              className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleRemoveBonus}
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
              message="¿Estás seguro de que deseas eliminar esta Bonus?"
              onCancel={cancelRemove}
              onConfirm={confirmRemove}
            />

            <LoadingButton
              className="custom-button"
              color="secondary"
              onClick={() => { handleSaveBonus(); setLoading(true); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={
                bonusId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
              }
            >
              <span>Guardar</span>
            </LoadingButton>

            {bonusId === "update" &&
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
            {bonusId === "update" &&
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

export default BonusHeader;
