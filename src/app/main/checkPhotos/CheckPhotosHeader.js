import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import {
  selectCheckPhotosSearchText,
  setCheckPhotosSearchText,
} from "./store/checkPhotosSlice";

function CheckPhotosHeader(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectCheckPhotosSearchText);

  const dowloadPhotos = () => {
    console.log('descarga')
  }
  return (
    <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 w-full items-center justify-between py-32 px-24 md:px-32">
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="text-24 md:text-32 font-extrabold tracking-tight"
      >
        Validacion de Imagenes
      </Typography>

      <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">


        <Button
          className="custom-button"
          onClick={dowloadPhotos}
          variant="contained"
          color="secondary"
          startIcon={<FuseSvgIcon>heroicons-outline:download</FuseSvgIcon>}
        >
          Descargar
        </Button>


      </div>
    </div>
  );
}

export default CheckPhotosHeader;
