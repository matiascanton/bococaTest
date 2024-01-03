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
import { updateStock, addFile, addStock, removeStock } from "../store/stockSlice";
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

function StockHeader(props) {
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
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const { stockId } = routeParams;
  const storage = getStorage();
  const user = useSelector(selectUser);

  const [loading, setLoading] = useState(false);


  const handleSaveStock = async () => {
    const data = getValues();
    console.log('data a guardar: ', data);
    delete data.stock
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
      if (stockId === "new") {

        dispatch(addStock(data)).then(() => {
          console.log(' se guardo con exito')
          navigate("/stocks");
        });

      } else {
        const result = Object.fromEntries(
          Object.entries(data).filter((k) => k[0] !== "updated_at")
        );

        dispatch(updateStock(result)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") setAlert(true);
          if (res.meta.requestStatus === "rejected") setAlert(false);
          navigate("/stocks");
        });

      }
    }
  };

  function handleRemoveStock() {
    const data = getValues();
    dispatch(removeStock(data.id)).then(() => {
      navigate("/stocks");
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
              to="/stocks"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Stocks</span>
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
                  ? "Nueva Stock"
                  : params === 'update'
                    ? "Actualizar Stock"
                    : 'Vista de Stock'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle de la Stock
              </Typography>
            </motion.div>
          </div>
        </div>

        {stockId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >
            <Button
              className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleRemoveStock}
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
              onClick={() => { handleSaveStock(); setLoading(true); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={
                stockId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
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

export default StockHeader;
