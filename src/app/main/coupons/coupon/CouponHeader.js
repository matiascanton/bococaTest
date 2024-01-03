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
import { updateCoupon, addCoupon } from "../store/couponSlice"

function CouponHeader(props) {
  const { params } = props;
  const dispatch = useDispatch();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid, dirtyFields } = formState;
  const theme = useTheme();
  const navigate = useNavigate();
  const images = watch("img_brief");
  const [openAlert, setAlert] = useState();
  const [preview, setPreview] = useState();
  const routeParams = useParams();
  const { couponId } = routeParams;

  function handleSaveCoupon() {
    const data = getValues();
    console.log('dataaaaaaaa', data)
    if (couponId === "new") {
      upLoadImg(data).then(() => {
        dispatch(addCoupon(data)).then(() => {
          navigate("/coupons");
        });
      });
    } else {
      upLoadImg(data).then(() => {
        dispatch(updateCoupon(data)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") setAlert(true);
          if (res.meta.requestStatus === "rejected") setAlert(false);
        });
      });
    }
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
              to="/coupons"
              color="inherit"
            >
              <FuseSvgIcon size={20}>
                {theme.direction === "ltr"
                  ? "heroicons-outline:arrow-sm-left"
                  : "heroicons-outline:arrow-sm-right"}
              </FuseSvgIcon>
              <span className="flex mx-4 font-medium">Cupones</span>
            </Typography>
          </motion.div>
          <div className="flex max-w-full">
            <div className="flex relative ">
              <motion.div
                className="hidden  sm:flex"
                initial={{ scale: 0 }}
                animate={{ scale: 1, transition: { delay: 0.3 } }}
              >
                {images !== "" ? (
                  <img
                    //  className="w-52 sm:w-48 rounded"
                    width={250}
                    src={preview}
                  />
                ) : (
                  <img
                    //    className="w-32 sm:w-48 rounded"
                    width={200}
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
                {images?.name || images === ""
                  ? "Nuevo Cupon"
                  : "Actualizar Cupon"}
              </Typography>
              <Typography variant="caption" className="font-medium">
                Detalle del Cupon
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
            disabled={
              couponId === "new" ? _.isEmpty(dirtyFields) || !isValid : null
            }
            onClick={handleSaveCoupon}
          >
            Guardar
          </Button>
        </motion.div>
      </div>
      {openAlert && (
        <Alert severity="success">Los datos se guardaron correctamente</Alert>
      )}
      {openAlert === false ? (
        <Alert severity="error">Hubo un problema al guardar los datos</Alert>
      ) : null}
    </div>
  );
}

export default CouponHeader;
