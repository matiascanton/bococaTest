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
import { updateBingo, addFile, addBingo, removeBingo } from "../store/bingoSlice";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { selectUser } from "app/store/userSlice";

function CouponHeader(props) {
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const images = watch("header");
  const name = watch("name");
  const excel_file = watch("excel_file");
  const bingoFile = watch("bingoFile");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const { bingoId } = routeParams;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storage = getStorage();

  function handleRemoveBingo() {
    const data = getValues();

    dispatch(removeBingo(data.id)).then(() => {
      navigate("/bingos");
    });
  }


  const handleSaveCoupon = async () => {
    const data = getValues();
    console.log('data a guardar: ', data);
    var dt = new Date();
    const month = dt.getMonth() + 1;
    const year = dt.getFullYear().toString().substring(2);
    const ym = [year, month].join("");
    data.year_month = ym;
    console.log(data, "get values form");

    if (

      // data.id === "" ||
      data.created_at === "" ||
      data.header === null ||
      data.line_1 === null ||
      data.line_2 === null ||
      data.header_line_1 === null ||
      data.header_line_2 === null ||
      data.mission_1 === null ||
      data.mission_2 === null ||
      data.mission_3 === null ||
      data.mission_4 === null ||
      data.mission_5 === null ||
      data.mission_6 === null ||
      data.mission_7 === null ||
      data.mission_8 === null ||
      data.mission_9 === null ||
      data.mission_10 === null ||
      data.name === "" ||
      data.year_month === ""
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      if (bingoId === "new") {
        //addBingo(data).then(async (res) => {
        const res = await dispatch(addBingo(data));
        if (res.length === 0) {
          setAlert({
            msg: "Hubo un problema al crear el bingo",
            alert: false,
          });
        } else {
          const fileData = {
            user_id: user.data.displayName,
            file_name: name,
          };

          const fileRef = ref(storage, `files/${excel_file.name}`);
          await uploadBytes(fileRef, excel_file);
          fileData.file_url = await getDownloadURL(fileRef);
          await dispatch(addFile(fileData)).then(() => {
            navigate("/bingos");
            //TODO implementar alert si hay error al subir el archivo
            /**
             * {
                "user_id": "joseb", 
                "file_name": "septiembre2021"
                faltaria la url en firebase??
            }
            */
          });
        }
        //});
      } else {
        const result = Object.fromEntries(
          Object.entries(data).filter((k) => k[0] !== "updated_at")
        );
        // TODO  agregar subir archivo excel al actualizar
        updateBingo(result).then(() => setAlert(true));
        //TODO agregar codigo para subir el excel
      }
    }
  };
  console.log(isValid, dirtyFields, "dirty");

  ///TODO eliminar este useEffect, creado para ver los archivos en el storage
  useEffect(() => {
    const listRef = ref(storage, "files/bingos");

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
              to="/bingos"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Bingos</span>
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
                    src={images}
                    alt={name}
                  />
                ) : null}
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {name ? "Actualizar Bingo" : "Nuevo Bingo"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle del Bingo
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
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            onClick={handleRemoveBingo}
            startIcon={
              <FuseSvgIcon className="hidden sm:flex">
                heroicons-outline:trash
              </FuseSvgIcon>
            }
          >
            Eliminar
          </Button>
          <Button
            className="whitespace-nowrap mx-4"
            variant="contained"
            color="secondary"
            disabled={_.isEmpty(dirtyFields) /* || !isValid */}
            onClick={handleSaveCoupon}
          >
            Guardar
          </Button>
        </motion.div>
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

export default CouponHeader;
