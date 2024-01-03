import FuseScrollbars from "@fuse/core/FuseScrollbars";
import _ from "@lodash";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import withRouter from "@fuse/core/withRouter";
import FuseLoading from "@fuse/core/FuseLoading";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { getStorage, ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { selectUser } from "app/store/userSlice";
import { getUploads, selectUploads, selectUploadsSearchText } from "./store/uploadsSlice";
import UploadsTableHead from "./UploadsTableHead";
import { getUploadedFiles } from "./store/uploadsSlice";
import moment from "moment";
import { Button, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Grid } from "@mui/material";
import { SpaRounded } from "@mui/icons-material";
import { addFile, processFile } from "./store/uploadSlice";
import * as XLSX from "xlsx";
import { grey } from '@mui/material/colors';
import LoadingButton from '@mui/lab/LoadingButton';


function UploadsTable(props) {
  const dispatch = useDispatch();
  const uploads = useSelector(selectUploads);
  const storage = getStorage();
  const navigate = useNavigate();
  const searchText = useSelector(selectUploadsSearchText);
  const [loading, setLoading] = useState(true);
  const [loadingFile, setLoadingFile] = useState(false)
  const [data, setData] = useState(uploads);
  const [page, setPage] = useState(0);
  const user = useSelector(selectUser);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: "asc",
    id: null,
  });
  const [uploadedFilesDirect, setUploadedFilesDirect] = useState("")
  const [uploadedFilesIndirect, setUploadedFilesIndirect] = useState("")
  const [uploadedFilesComer, setUploadedFilesComer] = useState("")
  const [uploadedFilesProduct, setUploadedFilesProduct] = useState("")
  const [files, setFiles] = useState("");
  const [filesName, setFilesName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("");
  const [secondType, setSecondType] = useState("");
  const [openAlert, setAlert] = useState({
    msg: "",
    alert: "",
  });
  const [error, setError] = useState({ result: false, text: '' })
  const [fileName, setFileName] = useState("");
  let fileClient = null;
  let fileProducts = null;
  let fileIndirect = null;
  let fileDirect = null;
  const color = grey[500];

  useEffect(() => {
    dispatch(getUploads()).then((resp) => {
      //setLoading(false);
    });
    dispatch(getUploadedFiles()).then((resp) => {
      console.log('restpppp1111', resp.payload)
      const ventaDirecta = resp.payload.filter(obj => obj.type === "venta_directa");
      const ventaIndirecta = resp.payload.filter(obj => obj.type === "venta_indirecta");
      const comercializadores = resp.payload.filter(obj => obj.type === "comercializadores");
      const products = resp.payload.filter(obj => obj.type === "products")
      setUploadedFilesDirect(ventaDirecta[0])
      setUploadedFilesIndirect(ventaIndirecta[0])
      setUploadedFilesComer(comercializadores[0])
      setUploadedFilesProduct(products[0])
      setLoading(false);
    });

  }, [dispatch]);

  useEffect(() => {
    if (searchText.length !== 0) {
      setData(_.filter(uploads, (item) => (item.type !== null ? item.type.toLowerCase().includes(searchText.toLowerCase()) : null)));
      setPage(0);
    } else {
      setData(uploads);
    }
  }, [uploads, searchText]);

  function handleRequestSort(event, property) {
    const id = property;
    let direction = "desc";

    if (order.id === property && order.direction === "desc") {
      direction = "asc";
    }

    setOrder({
      direction,
      id,
    });
  }

  /*useEffect(() => {
    setFilesName(files);

  }, [files])*/

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAlert({
      msg: "",
      alert: "",
    });
    setType("");
    setSecondType("");
    setFileName("");
    setFiles("");
  };

  const saveFiles = async () => {
    setLoadingFile(true)
    console.log('user', user)
    let subido = false;
    const fileData = {
      user_id: user.id,
      //user_id: "jose.bozzone",
      file_name: fileName,
      url: "",
      type: "",
    };
    const fileDataProcess = {
      type: "",
      user_id: user.id,
      file_name: "",
    }
    let downloadURL = "";
    if (type === "CLIENTES") {
      fileData.type = "clients";
    }
    if (type === "PRODUCTOS") {
      fileData.type = "products";
      fileDataProcess.type = "products"
      fileDataProcess.file_name = fileName
      fileData.file_name = fileName;
      dispatch(processFile(fileDataProcess)).then(async (res) => {
        console.log('resssss', res.payload.success)
        if (res.payload.success) {
          console.log(" se guardo con exito");
          const fileRef = ref(storage, `files/products/${fileData.type}/${fileData.file_name}`);
          const metadata = {
            contentType: "text/csv"
          };
          await uploadBytes(fileRef, files, metadata);
          downloadURL = await getDownloadURL(fileRef);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.log("error", res.payload.res);
          setError({ result: true, text: res.payload.res })
          setLoadingFile(false)
        }
      });
    }
    if (type === "PREMIOS") {
      fileData.type = "prizes";
    }
    if (type === "COMERCIALIZADORES") {
      fileData.type = "comercializadores";
      fileDataProcess.type = "comercializadores"
      fileDataProcess.file_name = fileName
      fileData.file_name = fileName;
      dispatch(processFile(fileDataProcess)).then(async (res) => {
        console.log('resssss', res.payload.success)
        if (res.payload.success) {
          console.log(" se guardo con exito");
          const fileRef = ref(storage, `files/commercials/${fileData.type}/${fileData.file_name}`);
          const metadata = {
            contentType: "text/csv"
          };
          await uploadBytes(fileRef, files, metadata);
          downloadURL = await getDownloadURL(fileRef);
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.log("error", res.payload.res);
          setError({ result: true, text: res.payload.res })
          setLoadingFile(false)
        }
      });
    }

    if (type === "COMPRAS") {
      if (secondType === "directa") {
        fileData.type = "direct";
        fileDataProcess.type = "venta_directa"
        fileDataProcess.file_name = fileName
        fileData.file_name = fileName;
        dispatch(processFile(fileDataProcess)).then(async (res) => {
          console.log('resssss', res.payload.success)
          if (res.payload.success) {
            console.log(" se guardo con exito");
            const fileRef = ref(storage, `files/sales/${fileData.type}/${fileData.file_name}`);
            const metadata = {
              contentType: "text/csv"
            };
            await uploadBytes(fileRef, files, metadata);
            downloadURL = await getDownloadURL(fileRef);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            console.log("error", res.payload.res);
            setError({ result: true, text: res.payload.res })
            setLoadingFile(false)
          }
        });

      }
      if (secondType === "indirecta") {
        fileData.type = "indirect";
        fileDataProcess.type = "venta_indirecta"
        fileDataProcess.file_name = fileName
        fileData.file_name = fileName;
        dispatch(processFile(fileDataProcess)).then(async (res) => {
          if (res.payload.success) {
            console.log(" se guardo con exito");
            const fileRef = ref(storage, `files/sales/${fileData.type}/${fileData.file_name}`);
            const metadata = {
              contentType: "text/csv"
            };
            await uploadBytes(fileRef, files, metadata);
            downloadURL = await getDownloadURL(fileRef);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            console.log("error", res.payload.res);
            setError({ result: true, text: res.payload.res })
            setLoadingFile(false)
          }

        });

      }
    } else {
      const fileRef = ref(storage, `files/${fileData.type}/${fileData.file_name}`);
      await uploadBytes(fileRef, files);
      downloadURL = await getDownloadURL(fileRef);
      console.log("downloadURL", downloadURL);
    }

    fileData.url = downloadURL;
    /*if (!error.result) {
      dispatch(addFile(fileData)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") { //window.location.reload() //navigate("/uploads");
          console.log("se guardo con exito");
        }
      });
    }*/
    setError({ result: false, text: '' })
  };

  const addFiles = (fileadd, index) => {
    console.log("fileadd", fileadd);
    const reader = new FileReader();

    reader.onload = () => {
      const fileName = fileadd.name;
      let nameRegex;
      if (secondType === "directa") {
        nameRegex = /^(directa)_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9])(_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9]))?\.csv$/;
      }
      if (secondType === "indirecta") {
        nameRegex = /^(indirecta)_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9])(_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9]))?\.csv$/;
      }
      if (type === "COMERCIALIZADORES") {
        nameRegex = /^(comercializadores)_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9])(_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9]))?\.csv$/;
      }
      if (type === "PRODUCTOS") {
        nameRegex = /^(productos)_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9])(_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9]))?\.csv$/;
      }

      //const nameRegex = /^(directa|indirecta)_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9])(_(0[1-9]|[1-2][0-9]|3[0-1])(0[1-9]|1[0-2])(2023|20[2-9][0-9]))?\.csv$/; // Expresión regular para verificar el formato del nombre del archivo
      const fileNameParts = fileName.split('_');
      //setSecondType(fileNameParts[0])
      //console.log('fileNameParts', fileNameParts)

      if (!nameRegex.test(fileName)) {
        setAlert({
          msg: "El nombre de archivo no cumple con el formato esperado (tipo_ddmmyyyy.csv o tipo_ddmmyyyy_ddmmyyyy.csv)",
          alert: false,
        });
        console.log("El nombre de archivo no cumple con el formato esperado (tipo_ddmmyyyy.csv)");
        return; // O realiza alguna acción adicional en caso de error
      }

      const fileContent = reader.result;
      const workbook = XLSX.read(fileContent, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rowCount = XLSX.utils.decode_range(worksheet['!ref']).e.r + 1;
      let expectedColumns = []
      if (type === "COMPRAS") {
        expectedColumns = ["Franquicia", "FemsaId", "Fecha", "SKU", "CU"]; // Reemplaza con los nombres de las columnas esperadas
      }
      if (type === "COMERCIALIZADORES") {
        expectedColumns = ["Apellido(s)", "Legajo", "Correo Electronico", "Nombre del depto", "Ruta"]; // Reemplaza con los nombres de las columnas esperadas
      }
      if (type === "PRODUCTOS") {
        expectedColumns = ["Sku", "Descripcion", "Categoria", "Consumo", "Retornable", "Marca", "Sabor", "Empaque", "Litros", "BOT/CJ BW", "Factor UC Valor", "Factor UC a CJ Calculado"]; // Reemplaza con los nombres de las columnas esperadas
      }
      const expectedColumnsmsg = expectedColumns.join(', ');
      const headerRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];
      const actualColumns = headerRow.map((cell) => cell.toString());
      console.log("testing:, ", actualColumns);

      if (rowCount > 150000) {
        setAlert({
          msg: "El archivo contiene mas de 150.000 registros " + expectedColumnsmsg,
          alert: false,
        });
        return; // O realiza alguna acción adicional en caso de error
      }
      if (actualColumns.length !== expectedColumns.length || !expectedColumns.every((col, index) => col === actualColumns[index])) {
        // El archivo no cumple con las columnas esperadas
        setAlert({
          msg: "El archivo no cumple con las columnas esperadas " + expectedColumnsmsg,
          alert: false,
        });
        return; // O realiza alguna acción adicional en caso de error
      }
      console.log("El archivo es correcto");
      setFileName(fileadd.name);
      setFiles(fileadd);
      // El archivo tiene el nombre correcto y cumple con las columnas esperadas, continúa con el proceso de carga
      // ...
    };

    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
    };

    reader.readAsBinaryString(fileadd);

    //const newFiles = files;
    //newFiles[index] = fileadd
    //const newFilesName = filesName;
    //newFilesName[index] = fileadd.name;
    //setFileName(fileadd.name)
    //setFilesName(newFilesName)
    //setFiles(fileadd)
    //console.log(files)
  };

  const handleDeleteFile = () => {
    setFiles("");
    setFileName("");
    setError({ result: false, text: '' })
  };

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          No se encontraron Competencias
        </Typography>
      </motion.div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col min-h-full">
        <FuseScrollbars className="grow overflow-x-auto">
          <Table stickyHeader className="min-w-xl " aria-labelledby="tableTitle">
            <UploadsTableHead order={order} onRequestSort={handleRequestSort} rowCount={data.length} />

            <TableBody>
              <TableRow className="h-100 cursor-pointer" hover key={1}>
                <TableCell className="p-4 md:p-12 " component="th" scope="row">
                  <Typography className="text-12 sm:text-18 truncate font-semibold">Actualización CLIENTES (Maestro)</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate ">-</Typography>
                </TableCell>
                <TableCell className="p-2 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    -
                  </Typography>
                </TableCell>
                <TableCell className="p-4 md:p-16 " component="th" scope="row" align="right" width="50px">
                  <Button className="custom-button" variant="outlined" component="label" disabled >
                    Cargar
                    <input
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      className="hidden"
                      id="button-avatar"
                      type="file"
                      disabled
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) {
                          return;
                        }
                        //fileClient = file;
                        //addFiles(file, 0);
                      }}
                    />
                  </Button>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" align="center">
                  <Typography className="text-12 sm:text-12 truncate ">Excel</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow className="h-72 cursor-pointer" hover key={2}>
                <TableCell className="p-4 md:p-12 " component="th" scope="row">
                  <Typography className="text-12 sm:text-18 truncate font-semibold">Actualización PRODUCTOS (Maestro SKU)</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {moment(uploadedFilesProduct?.updated_at).subtract(1, 'hours').format('DD/MM/YYYY - HH:mm') + ' - ' + uploadedFilesProduct?.file_name}
                  </Typography>
                </TableCell>
                <TableCell className="p-2 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {uploadedFilesProduct?.user_id}
                  </Typography>
                </TableCell>
                <TableCell className="p-4 md:p-16 " component="th" scope="row" align="right" width="50px">
                  <Button
                    className="custom-button"
                    variant="contained"
                    component="label"
                    color="primary"
                    onClick={() => {
                      setSecondType("");
                      setType("PRODUCTOS");
                      setIsModalOpen(true);

                    }}
                  >
                    Cargar
                  </Button>
                  <Typography className="text-14 sm:text-18 ml-10">{""}</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" align="center">
                  <Typography className="text-12 sm:text-12 truncate ">Excel</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow className="h-72 cursor-pointer" hover key={2}>
                <TableCell className="p-4 md:p-12 " component="th" scope="row">
                  <Typography className="text-12 sm:text-18 truncate font-semibold">Actualización COMERCIALIZADORES</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {moment(uploadedFilesComer?.updated_at).subtract(1, 'hours').format('DD/MM/YYYY - HH:mm') + ' - ' + uploadedFilesComer?.file_name}
                  </Typography>
                </TableCell>
                <TableCell className="p-2 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {uploadedFilesComer?.user_id}
                  </Typography>
                </TableCell>
                <TableCell className="p-4 md:p-16 " component="th" scope="row" align="right" width="50px">
                  <Button
                    className="custom-button"
                    variant="contained"
                    component="label"
                    color="primary"
                    onClick={() => {
                      setSecondType("");
                      setType("COMERCIALIZADORES");
                      setIsModalOpen(true);

                    }}
                  >
                    Cargar
                  </Button>
                  <Typography className="text-14 sm:text-18 ml-10">{""}</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" align="center">
                  <Typography className="text-12 sm:text-12 truncate ">CSV</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow className="h-72 cursor-pointer" hover key={2}>
                <TableCell className="p-4 md:p-12 " component="th" scope="row">
                  <Typography className="text-12 sm:text-18 truncate font-semibold">Actualización CATALOGO DE PREMIOS</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate ">-</Typography>
                </TableCell>
                <TableCell className="p-2 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    -
                  </Typography>
                </TableCell>
                <TableCell className="p-4 md:p-16 " component="th" scope="row" align="right" width="50px">
                  <Button className="custom-button" variant="outlined" component="label" disabled>
                    Cargar
                    <input
                      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      className="hidden"
                      id="button-avatar"
                      type="file"
                      disabled
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) {
                          return;
                        }
                        //addFiles(file, 1);
                      }}
                    />
                  </Button>


                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" align="center">
                  <Typography className="text-12 sm:text-12 truncate ">Excel</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow className="h-72 cursor-pointer" hover key={3}>
                <TableCell className="p-10 md:p-12 " component="th" scope="row" style={{ width: "500px" }}>
                  <Typography className="text-12 sm:text-18 truncate font-semibold">Actualización COMPRAS INDIRECTA</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {moment(uploadedFilesIndirect?.updated_at).subtract(1, 'hours').format('DD/MM/YYYY - HH:mm') + ' - ' + uploadedFilesIndirect?.file_name}
                  </Typography>
                </TableCell>
                <TableCell className="p-2 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {uploadedFilesIndirect?.user_id}
                  </Typography>
                </TableCell>
                <TableCell className="p-4 md:p-16 " component="th" scope="row" align="right" width="50px">
                  <Button
                    className="custom-button"
                    variant="contained"
                    component="label"
                    color="primary"
                    onClick={() => {
                      setSecondType("indirecta");
                      setType("COMPRAS");
                      setIsModalOpen(true);

                    }}
                  >
                    Cargar
                  </Button>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" align="center">
                  <Typography className="text-12 sm:text-12 truncate ">CSV</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
            <TableBody>
              <TableRow className="h-72 cursor-pointer" hover key={3}>
                <TableCell className="p-10 md:p-12 " component="th" scope="row" style={{ width: "500px" }}>
                  <Typography className="text-12 sm:text-18 truncate font-semibold">Actualización COMPRAS DIRECTA</Typography>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {moment(uploadedFilesDirect?.updated_at).subtract(1, 'hours').format('DD/MM/YYYY - HH:mm') + ' - ' + uploadedFilesDirect?.file_name}
                  </Typography>
                </TableCell>
                <TableCell className="p-2 md:p-12 " component="th" scope="row" width="550px">
                  <Typography className="text-12 sm:text-18 truncate " display="inline">
                    {uploadedFilesDirect?.user_id}
                  </Typography>
                </TableCell>
                <TableCell className="p-4 md:p-16 " component="th" scope="row" align="right" width="50px">
                  <Button
                    className="custom-button"
                    variant="contained"
                    component="label"
                    color="primary"
                    onClick={() => {
                      setSecondType("directa");
                      setType("COMPRAS");
                      setIsModalOpen(true);
                    }}
                  >
                    Cargar
                  </Button>
                </TableCell>
                <TableCell className="p-4 md:p-12 " component="th" scope="row" align="center">
                  <Typography className="text-12 sm:text-12 truncate ">CSV</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </FuseScrollbars>
      </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal} className="lg" maxWidth="lg" style={{ height: "400px", minWidth: "500px" }}>
        <DialogTitle sx={{ m: 2, p: 2 }}>Carga de archivos para {type} {secondType} </DialogTitle>

        <DialogContent style={{ alignSelf: "center", height: "200px", width: "800px" }}>
          <Grid container padding={1} rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }} justifyContent="center" alignItems="center">
            <Grid item xs={4} md={12} style={{ display: "flex" }} justifyContent="center">
              {openAlert.alert === false ? (
                <Alert severity="error" variant="filled" className=" text-12 sm:text-12 ">
                  {openAlert.msg}
                </Alert>
              ) : null}
              {error.result === true &&
                <Alert severity="error" variant="filled" className=" text-12 sm:text-12 ">
                  {error.text}
                </Alert>
              }
            </Grid>
            <Grid item xs={4} md={12} style={{ display: "flex" }} justifyContent="center">
              {files === "" && (
                <Button variant="contained" component="label" color="primary" className="m-2 custom-button" >
                  Subir Archivo
                  <input
                    accept=".csv"
                    className="hidden"
                    id="button-avatar"
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      console.log('file', file.size, 4 * 1024 * 1024)
                      if (!file) {
                        return;
                      }
                      if (file.size > 4 * 1024 * 1024) {
                        setAlert({
                          msg: "El archivo no debe pesar mas de 4 MB",
                          alert: false,
                        });
                        return;
                      }
                      if (!file.name.toLowerCase().endsWith(".csv")) {
                        setAlert({
                          msg: "El archivo no es de tipo CSV",
                          alert: false,
                        });
                        console.log("Por favor, seleccione un archivo CSV.");
                        return;
                      }
                      setAlert({
                        msg: "",
                        alert: "",
                      });

                      addFiles(file, 3);
                    }}
                  />
                </Button>
              )}
            </Grid>
            <Grid item xs={4} md={12} style={{ display: "flex" }} justifyContent="center">
              {fileName ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      backgroundColor: "#008000bf",
                      padding: "8px",
                      color: "white",
                      borderRadius: "20px",
                    }}
                  >
                    {" "}
                    {fileName}{" "}
                  </span>
                  <button onClick={() => handleDeleteFile()}>
                    <FuseSvgIcon size={32} color="error">
                      heroicons-outline:trash
                    </FuseSvgIcon>
                  </button>
                </div>
              ) : null}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ m: 0, p: 2 }}>
          <LoadingButton loading={loadingFile} className="whitespace-nowrap mx-4" variant="contained" disabled={!fileName} color="success" onClick={saveFiles}>
            SUBIR
          </LoadingButton>

          <Button className="whitespace-nowrap mx-4" variant="outlined" color="error" onClick={handleCloseModal}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default withRouter(UploadsTable);