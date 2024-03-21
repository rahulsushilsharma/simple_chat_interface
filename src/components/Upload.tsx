import {
  Autocomplete,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import theme from "../theme";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    // width: 150,
    flex: 1,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    // width: 150,
    flex: 1,

    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    flex: 1,

    // width: 110,
    editable: true,
  },

  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    flex: 1,

    // width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.firstName || ""} ${params.row.lastName || ""}`,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 31 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  { id: 10, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 11, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 12, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 13, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 14, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 15, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 16, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 17, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 18, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 19, lastName: "ROZE", firstName: "DANIEL", age: 65 },
  { id: 20, lastName: "ROZE", firstName: "DANIEL", age: 65 },
];
function MyDropzone() {
  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const { ref, ...rootProps } = getRootProps();

  return (
    <Box
      ref={ref}
      sx={{
        padding: "1em",
        border: "3px dashed" + theme.palette.primary.main,
        borderRadius: "0.5em",
      }}
    >
      <Paper {...rootProps}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </Paper>
    </Box>
  );
}

export default function Upload() {
  const Indexs = [
    { value: "randome-index-1", label: "randome index 1" },
    { value: "randome-index-2", label: "randome index 2" },
    { value: "randome-index-3", label: "randome index 3" },
  ];

  const [index, setIndex] = useState(Indexs[0]);
  const [tab, setTab] = useState("upload");

  function handleIndexChange(index: { value: string; label: string }) {
    setIndex(index);
  }
  return (
    <>
      <Paper
        sx={{
          padding: "1em",
        }}
      >
        <Box sx={{ display: "flex", gap: "1em", justifyContent: "center" }}>
          <Button
            onClick={() => setTab("upload")}
            variant={tab === "upload" ? "contained" : "outlined"}
          >
            Upload
          </Button>
          <Button
            onClick={() => setTab("details")}
            variant={tab === "details" ? "contained" : "outlined"}
          >
            Details
          </Button>
        </Box>
        {tab === "upload" ? (
          <Box
            sx={{
              padding: "1em",
              display: "flex",
              flexDirection: "column",
              gap: "3em",
            }}
          >
            <Typography variant="h5" sx={{ textAlign: "center" }}>
              Upload
            </Typography>
            <Box>
              <Autocomplete
                disablePortal
                disableClearable
                fullWidth
                value={index}
                onChange={(_e, value) => handleIndexChange(value)}
                id="combo-box-demo"
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                options={Indexs}
                renderInput={(params) => (
                  <TextField {...params} label="Index" />
                )}
              />
            </Box>
            <MyDropzone />
          </Box>
        ) : (
          <Box width="100%">
            <Box>Details</Box>
            <Box width="100%">
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Details
              </Typography>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                disableRowSelectionOnClick
                disableColumnSelector
              />
            </Box>
          </Box>
        )}
      </Paper>
    </>
  );
}
