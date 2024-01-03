import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";

function Card(props) {
  const { title, cantidad, trending, mes } = props;

  return (
    
      <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden" sx={{ borderColor: "#989696", borderWidth: "2px" }}>
        <div className="flex items-start justify-between m-24 mb-0">
          <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
            {title}
          </Typography>
          {mes && (
            <div className="ml-8">
              <Chip size="small" className="font-medium text-sm" label={mes} />
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-center mx-24 mt-12">
          <Typography className="text-7xl font-bold tracking-tighter leading-tight">
            {cantidad.toLocaleString('de-DE')}
          </Typography>

          {trending && (
            <div className="flex lg:flex-col lg:ml-12">
              <FuseSvgIcon size={20} className="text-green-500">
                heroicons-solid:trending-up
              </FuseSvgIcon>
            </div>
          )}
        </div>
      </Paper>
    
  );
}

export default Card;
