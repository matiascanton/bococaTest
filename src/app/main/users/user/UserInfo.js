import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import { Grid, Typography, Select, MenuItem, Button } from "@mui/material";
import React, { useState, useEffect } from "react";

import { Controller, useFormContext } from "react-hook-form";

function UserInfo(props) {
 const {isNew} = props
   const methods = useFormContext();
  const { control, formState } = methods;
  const { errors } = formState;
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="m-10">
      <Grid
        container
        padding={5}
        rowSpacing={2}
        columnSpacing={{ xs: 1, sm: 1, md: 3 }}
      >
        <Grid item xs={6} md={3}>
          <Typography className="text-12 sm:text-18 truncate font-semibold">
            Apellido
          </Typography>
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
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography className="text-12 sm:text-18 truncate font-semibold">
            Nombre
          </Typography>
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
        </Grid>
        <Grid item xs={6} md={3}>
          <Typography className="text-12 sm:text-18 truncate font-semibold">
            Email
          </Typography>
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
        </Grid>

        <Grid item xs={6} md={3}>
          <Typography className="text-12 sm:text-18 truncate font-semibold">
            Rol
          </Typography>
          <Controller
            className="mt-8 mb-16"
            name="profile"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                id="profile"
                value={field.value || "0"}
                variant="outlined"
                fullWidth
                onChange={(ev) => {
                  const value = ev.target.value;
                  field.onChange(value);
                }}
              >
                <MenuItem value="0"> Seleccione un Rol</MenuItem>
                <MenuItem value="admin"> Admin</MenuItem>
                <MenuItem value="contenido"> Contenido</MenuItem>
                <MenuItem value="datos"> Datos</MenuItem>
                <MenuItem value="estadistica"> Estadistica</MenuItem>
                <MenuItem value="usuario"> Usuario</MenuItem>
                <MenuItem value="superadmin"> SuperAdmin</MenuItem>
                <MenuItem value="carga_datos"> Carga de datos</MenuItem>
              </Select>
            )}
          />
        </Grid>


        {isNew ==="new"? (   <Grid item xs={6} md={3}>
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
        </Grid>):null}
     
        <Grid item xs={6} md={3}>
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
        </Grid>

        <Grid item xs={6} md={3}>
          <Controller
            name="photo_url"
            control={control}
            render={({ field: { onChange, value } }) => (
              <div>
                <Button variant="contained" component="label" color="primary">
                  Cargar Imagen
                  <input
                    accept="image/*"
                    className="hidden"
                    id="button-avatar"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) {
                        return;
                      }
                      // Create a preview URL for the selected image
                      const previewURL = URL.createObjectURL(file);
                      setImagePreview(previewURL);
                      onChange(file);
                    }}
                  />
                </Button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100%", marginTop: "10px" }}
                  />
                )}
              </div>
            )}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default UserInfo;
