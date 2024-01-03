import { styled } from "@mui/material/styles";

const Root = styled("div")(({ theme }) => ({
  "& > .logo-icon": {
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  "& > .badge": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {
  return (
    <Root className="flex items-center">
      {/*  <img className="logo-icon w-32 h-32" src="assets/images/logo/logo.svg" alt="logo" />
       */}
      <div
        className="flex items-center py-4 px-8 mx-8 "
        style={{ color: "#61DAFB", justifyContent: 'center', alignItems: 'center' }}
      >
        <img
          src="assets/images/logo/coca-logo.png"
          alt="Logo Coca"
          width="75%"
        />
        {/*<span className="react-text text-12 mx-4">React</span>*/}
      </div>
    </Root>
  );
}

export default Logo;
