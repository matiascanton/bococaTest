import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDay } from "../../../utils";

function UploadImageHeader(props) {
  const methods = useFormContext();
  const { formState, watch } = methods;
  const { dirtyFields } = formState;
  const theme = useTheme();
  const images = watch("images");
  const storage = getStorage();
  const navigate = useNavigate();

  const handleSaveCoupon = async () => {
    const today = getDay();
    await Promise.all(
      images.map(async (item) => {
        const imageRef = ref(
          storage,
          `images/logos_sin_fondo/${item.name + "_" + today}`
        );
        await uploadBytes(imageRef, item);
      })

    ).then(() => {
      window.location.reload(false);

    }).catch((error) => {
      console.log(error)
    });
  };

  return (
    <div className="flex flex-col flex-1 w-full ">
      <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-32 px-24 md:px-32">
        <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
          {/*<motion.div
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
  </motion.div>*/}
          <div className="flex items-center max-w-full">
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography className="text-16 sm:text-20 truncate font-semibold">
                Subir imágenes
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
            disabled={_.isEmpty(dirtyFields)}
            onClick={handleSaveCoupon}
          >
            Guardar
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default UploadImageHeader;
