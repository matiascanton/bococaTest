import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormHelperText from "@mui/material/FormHelperText";
import jwtService from "../../auth/services/jwtService";
import { signup } from "./../../store/userSlice";
import { useDispatch } from "react-redux";
import Alert from "@mui/material/Alert";
import { useState } from "react";

//TODO testear el registro.

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Debe ingreasr un email válido")
    .required("Debe ingresa un email"),
  password: yup
    .string()
    .required("Por favor ingrese una contraseña.")
    .min(6, "Debe ingresar como mínimo 6 caracteres."),
  franchise: yup.string().required("Debe ingresar un Distribuidor"),
  femsa_id: yup.string().required("Debe ingresar un nro. de cliente."),
});

const defaultValues = {
  email: "",
  password: "",
  franchise: "",
  femsa_id: "",
};

function SignUpPage() {
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors, setError } = formState;
  const dispatch = useDispatch();
  const [openAlert, setAlert] = useState(false);
  const [msg, setMsg] = useState("");

  function onSubmit({ franchise, femsa_id, password, email }) {
    console.log(franchise, femsa_id, password, email, "la data");
    const data = {
      email,
      password,
      franchise,
      femsa_id,
    };
    dispatch(signup(data)).then((resp) => {
      if (resp.payload.success === true) {
        navigate("/login");
      } else {
        setAlert(true);
        setMsg(resp.payload.res);
      }
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          {/* <img className="w-48" src="assets/images/logo/logo.svg" alt="logo" /> */}

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Registrate
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>¿Tenés una cuenta?</Typography>
            <Link className="ml-4" to="/sign-in">
              Ingresá
            </Link>
          </div>

          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="franchise"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Distribuidor"
                  type="name"
                  error={!!errors.franchise}
                  helperText={errors?.franchise?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="femsa_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Nro. de Cliente"
                  type="name"
                  error={!!errors.femsa_id}
                  helperText={errors?.femsa_id?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Button
              variant="contained"
              color="secondary"
              className="w-full mt-24"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Creá tu cuenta
            </Button>
          </form>
          {openAlert ? <Alert severity="error">{msg}</Alert> : null}
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: "primary.main" }}
      >
        <Box
          className="absolute "
          component="img"
          src="https://images.pexels.com/photos/3819967/pexels-photo-3819967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)"
        ></Box>
      </Box>
    </div>
  );
}

export default SignUpPage;
