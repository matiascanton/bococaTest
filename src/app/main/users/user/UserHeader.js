import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { removeUser, updateUser, addUser } from "../store/userSlice";
import Alert from "@mui/material/Alert";
import {
  getStorage,
  ref,
  listAll,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../../configs/fbServices";

function UserHeader(props) {
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const name = watch("last_name");
  const images = watch("photo_url");
  const theme = useTheme();
  const navigate = useNavigate();
  const routeParams = useParams();
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [preview, setPreview] = useState();

  const handleSaveUser = async () => {
    const { userId } = routeParams;
    const data = getValues();

    if (
      data.email === "" ||
      data.first_name === "" ||
      data.last_name === "" ||
      data.password === ""
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
    } else {
      if (
        !(
          typeof images === "string" &&
          (images.startsWith("https://firebasestorage.googleapis.com") || images.startsWith("assets/images/user3.png"))
        )
      ) {
        if (images) {
          const extension = images.name.split(".").pop().toLowerCase();
          const imageRef = ref(storage, `users/${data.id}.${extension}`);

          await uploadBytes(imageRef, images);
          const imageUrl = await getDownloadURL(imageRef);
          data.photo_url = imageUrl;
        }
      }

      if (userId === "new") {
        dispatch(addUser(data)).then(() => {
          navigate("/users");
        });
      } else {
        dispatch(updateUser(data)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") setAlert({
            msg: "Se guardaron los datos correctamente",
            alert: true,
          });
          if (res.meta.requestStatus === "rejected") setAlert({
            msg: "Hubo un problema al guardas los datos",
            alert: false,
          });
        });
      }
    }
  };
  function handleRemoveUser() {
    dispatch(removeUser()).then(() => {
      navigate("/users");
    });
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
              to="/users"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Usuarios</span>
            </Typography>
          </motion.div>

          <div className="flex items-center max-w-full">
            <div className="flex items-center">
              <motion.div
                className="hidden sm:flex"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.3 } }}
              >
                <img
                  //  className="w-52 sm:w-48 rounded"
                  width={150}
                  src={preview}
                />
              </motion.div>
            </div>
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                {name || "Nuevo Usuario"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detealle del Usuario
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
            onClick={handleRemoveUser}
            startIcon={
              <FuseSvgIcon className="hidden sm:flex">
                heroicons-outline:trash
              </FuseSvgIcon>
            }
          >
            Eliminar
          </Button>
          <Button
            className="whitespace-nowrap mx-4 custom-button"
            variant="contained"
            color="secondary"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            onClick={handleSaveUser}
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

export default UserHeader;
