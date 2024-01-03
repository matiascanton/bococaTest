import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import jwtService from "../../auth/services/jwtService";
import { login } from "./../../store/userSlice";
import { useDispatch } from "react-redux";
import { AES, enc } from "crypto-js";
import Alert from "@mui/material/Alert";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "app/configs/fbServices";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(4, "Password is too short - must be at least 4 chars."),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function SignInPage() {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const { isValid, dirtyFields, errors } = formState;
  const navigate = useNavigate();
  const [openAlert, setAlert] = useState(false);

  //TODO limpiar localstorage, al actualizar la pagina le pega a la api
  /* useEffect(() => {
    setValue('email', 'admin@fusetheme.com', { shouldDirty: true, shouldValidate: true });
    setValue('password', 'admin', { shouldDirty: true, shouldValidate: true });
  }, [setValue]);
  */

  function onSubmit({ email, password }) {
    const data = {
      email,
      password,
    };
    dispatch(login(data)).then((resp) => {
      console.log(resp);
      if (!_.isEmpty(resp.payload) && resp.payload.first_name) {
        //se guarda esta info para manteter la sesion al actualizar la pagina
        const envryptedObject = AES.encrypt(
          JSON.stringify(resp.payload),
          "MYKEY91/"
        );
        localStorage.setItem("data", envryptedObject.toString());

        setTimeout(() => {
          console.log(resp.payload);
          if (resp.payload.profile === "estadistica") {
            navigate("/dashboards");
          } else if (resp.payload.profile === "contenido") {
            navigate("/competenciaReports");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        setAlert(true);
      }
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          {/* <img className="w-48" src="assets/images/logo/logo.svg" alt="logo" /> */}

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Iniciar sesión
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>¿No tenés cuenta?</Typography>
            <Link className="ml-4" to="/sign-up">
              Registrate
            </Link>
          </div>

          <form
            name="loginForm"
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
                  autoFocus
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

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              {/*   <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      label="Recuérdame"
                      control={<Checkbox size="small" {...field} />}
                    />
                  </FormControl>
                )}
              /> */}

              <Link className="text-md font-medium" to="/reset-pass">
                ¿Olvidaste la contraseña?
              </Link>
            </div>

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Ingresar
            </Button>

            {/*   <div className="flex items-center mt-32">
              <div className="flex-auto mt-px border-t" />
              <Typography className="mx-8" color="text.secondary">
                Or continue with
              </Typography>
              <div className="flex-auto mt-px border-t" />
            </div>

            <div className="flex items-center mt-32 space-x-16">
              <Button variant="outlined" className="flex-auto">
                <FuseSvgIcon size={20} color="action">
                  feather:facebook
                </FuseSvgIcon>
              </Button>
              <Button variant="outlined" className="flex-auto">
                <FuseSvgIcon size={20} color="action">
                  feather:twitter
                </FuseSvgIcon>
              </Button>
              <Button variant="outlined" className="flex-auto">
                <FuseSvgIcon size={20} color="action">
                  feather:github
                </FuseSvgIcon>
              </Button>
            </div> */}
          </form>
          {openAlert ? (
            <Alert severity="error">No se encuentra el usuario</Alert>
          ) : null}
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: "primary.main" }}
      >
        {/*     <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "primary.light" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg> */}
        <Box
          className="absolute "
          component="img"
          src="https://images.pexels.com/photos/3819967/pexels-photo-3819967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260)"
        ></Box>
      </Box>
    </div>
  );
}

export default SignInPage;
