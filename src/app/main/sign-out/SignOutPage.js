import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import JwtService from "../../auth/services/jwtService";
import { Link } from "react-router-dom";
import { resetNavigation } from "app/store/fuse/navigationSlice";
import { useDispatch } from "react-redux";
import { userLoggedOut } from "app/store/userSlice";

function SignOutPage() {
  localStorage.clear();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetNavigation())
    dispatch(userLoggedOut())
    setTimeout(() => {
      JwtService.logout();
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <Paper className="flex items-center w-full sm:w-auto min-h-full sm:min-h-auto rounded-0 py-32 px-16 sm:p-48 sm:rounded-2xl sm:shadow">
        <div className="w-full max-w-460 sm:w-460 mx-auto sm:mx-0">
          <img
            className="w-100 mx-auto"
            src="assets/images/logo/canalCOCA-logo.png"
            alt="logo"
          />

          <Typography className="mt-32 text-2xl font-extrabold tracking-tight leading-tight text-center">
            Ha cerrado exitosamente la sesión
          </Typography>

          <div className="flex justify-center font-medium mt-10">
            <>
              <Typography>¿Querés volver?</Typography>
              <Link className="ml-4" to="/sign-in">
                Iniciar sesión
              </Link>
            </>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default SignOutPage;
