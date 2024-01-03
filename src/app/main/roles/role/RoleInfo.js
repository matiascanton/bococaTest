import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Controller, useFormContext } from "react-hook-form";

function RoleInfo(props) {
  const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;

  return (
    <div>
      <Controller
        name="last_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.last_name}
            required
            helperText={errors?.last_name?.message}
            label="Apellido"
            autoFocus
            id="last_name"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="first_name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.first_name}
            required
            helperText={errors?.first_name?.message}
            label="Nombre"
            id="first_name"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            className="mt-8 mb-16"
            error={!!errors.email}
            required
            helperText={errors?.email?.message}
            label="Email"
            id="email"
            variant="outlined"
            fullWidth
          />
        )}
      />

      <label style={{ marginLeft: 10 }}>Habilitar</label>
      <Controller
        name="enabled"
        control={control}
        render={({ field }) => (
          <Switch
            onChange={(e) => field.onChange(e.target.checked)}
            checked={field.value}
          />
        )}
      />
    </div>
  );
}

export default RoleInfo;
