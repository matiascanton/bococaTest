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
import { updateTricampeon, addFile, addTricampeon, removeTricampeon } from "../store/tricampeonSlice";
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

function TricampeonHeader(props) {
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
  const { tricampeonId } = routeParams;
  const storage = getStorage();
  const user = useSelector(selectUser);
  const excel_file = watch("file_id");
  const [loading, setLoading] = useState(false);

  const handleSaveTricampeon = async () => {

    const data = getValues();
    if (data.type === "") {
      data.type = 'clients'
    }

    console.log('data a guardar: ', data);

    if (
      data.name === '' ||
      data.image === undefined ||
      data.start_date === '' ||
      data.due_date === '' ||
      data.file_id === undefined ||
      data.terms === '' ||
      data.gift_1 === '' ||
      data.gift_2 === '' ||
      data.skus_1 === '' ||
      data.skus_2 === '' ||
      data.skus_3 === '' ||
      data.skus_4 === ''
    ) {
      setAlert({
        msg: "Existen campos vacíos",
        alert: false,
      });
      setTimeout(() => {
        setLoading(false)
      }, 1000);
    } else {
      if (data.type === '') {
        data.type = 'clients'
      }
      if (tricampeonId === "new") {
        const fileData = {
          //user_id: user.data.displayName,
          user_id: 'jose.bozzone',
          file_name: excel_file.name,
          type: 'competencia',
          url: '',
        };
        data.skus_1 = data.skus_1.split(/,\s*|\s+/);
        data.skus_2 = data.skus_2.split(/,\s*|\s+/);
        data.skus_3 = data.skus_3.split(/,\s*|\s+/);
        data.skus_4 = data.skus_4.split(/,\s*|\s+/);
        const fileRef = ref(storage, `files/competences/${data.name}`);
        await uploadBytes(fileRef, excel_file);
        const response = await dispatch(addFile(fileData));
        data.file_id = response.payload.res.id;

        upLoadSingleImg(data, images).then(() => {
          dispatch(addTricampeon(data)).then(() => {
            navigate("/tricampeons");
          });
        });

      } else {
        const result = Object.fromEntries(
          Object.entries(data).filter((k) => k[0] !== "updated_at")
        );
        const fileData = {
          // user_id: user.data.displayName,
          user_id: 'jose.bozzone',
          file_name: excel_file.name,
          type: 'competencia',
          url: '',
        };
        if (!Array.isArray(result.skus_1)) {
          result.skus_1 = result.skus_1.split(/,\s*|\s+/);
        }
        if (!Array.isArray(result.skus_2)) {
          result.skus_2 = result.skus_2.split(/,\s*|\s+/);
        }
        if (!Array.isArray(result.skus_3)) {
          result.skus_3 = result.skus_3.split(/,\s*|\s+/);
        }
        if (!Array.isArray(result.skus_4)) {
          result.skus_4 = result.skus_4.split(/,\s*|\s+/);
        }

        if (typeof excel_file !== "number") {
          const fileRef = ref(storage, `files/competences/${data.name}`);
          await uploadBytes(fileRef, excel_file);
          const response = await dispatch(addFile(fileData));
          result.file_id = response.payload.res.id;
        }



        console.log('testttttttttttttt', result)
        if (images instanceof File) {
          //delete data.image
          upLoadSingleImg(result, images).then(() => {
            dispatch(updateTricampeon(result)).then(() => {
              navigate("/tricampeons");
            });
          });
        } else {

          dispatch(updateTricampeon(result)).then(() => {
            navigate("/tricampeons");
          });
        }


      }
    }


  };

  function handleRemoveTricampeon() {
    setOpenDialog(true);

  }


  function confirmRemoveTricampeon() {
    const data = getValues();
    dispatch(removeTricampeon(data.id)).then(() => {
      navigate("/tricampeons");
    });
    setOpenDialog(false);
  }

  function cancelRemoveTricampeon() {
    setOpenDialog(false);
  }

  function handlePublic() {
    const data = getValues();
    delete data.updated_at
    data.status = "publicado"
    console.log('data', data)
    dispatch(updateTricampeon(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setAlert(true);
      if (res.meta.requestStatus === "rejected") setAlert(false);
      navigate("/tricampeons");
    });
  }

  function handleCancel() {
    const data = getValues();
    delete data.updated_at
    data.status = "cancelado"
    dispatch(updateTricampeon(data)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setAlert(true);
      if (res.meta.requestStatus === "rejected") setAlert(false);
      navigate("/tricampeons");
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
              to="/tricampeons"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Competencias</span>
            </Typography>
          </motion.div>
          <div className="flex max-w-full">
            <div className="flex relative ">
              <motion.div
                className="hidden  sm:flex"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.3 } }}
              >
                {images ? (
                  <img
                    //  className="w-52 sm:w-48 rounded"
                    width={150}
                    src={preview}
                    style={{ objectFit: 'contain', maxHeight: '100px' }}
                  />
                ) : (
                  <img
                    //    className="w-32 sm:w-48 rounded"
                    width={200}
                    style={{ objectFit: 'contain', maxHeight: '100px' }}
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
                {params === 'new'
                  ? "Nueva Competencia"
                  : params === 'update'
                    ? "Actualizar Competencia"
                    : 'Vista de Competencia'}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle de la Competencia
              </Typography>
            </motion.div>
          </div>
        </div>
        {tricampeonId !== "view" &&
          <motion.div
            className="flex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          >


            <Button
              className="whitespace-nowrap mx-4 custom-button"
              variant="contained"
              color="secondary"
              onClick={handleRemoveTricampeon}
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
              message="¿Estás seguro de que deseas eliminar esta Competencia?"
              onCancel={cancelRemoveTricampeon}
              onConfirm={confirmRemoveTricampeon}
            />

            <LoadingButton
              className="custom-button"
              color="secondary"
              onClick={() => { setLoading(true); handleSaveTricampeon(); }}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              disabled={
                tricampeonId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
              }
            >
              <span>Guardar</span>
            </LoadingButton>

            {tricampeonId === "update" &&
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
            {tricampeonId === "update" &&
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

export default TricampeonHeader;
