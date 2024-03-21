import { Dispatch, useContext, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Autocomplete,
  Box,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { UserContext } from "../components/UserContextProvider";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First name",
    width: 150,
    editable: true,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 150,
    editable: true,
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 110,
    editable: true,
  },

  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
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
export default function SettingsDialog(props: {
  openState: [boolean, Dispatch<React.SetStateAction<boolean>>];
}) {
  const [open, setOpen] = props.openState;
  const { context, setContext } = useContext(UserContext);

  const [userSettings, setUserSettings] = useState(context.userSettingsChat);

  function saveSettings() {
    setContext((prev) => {
      return {
        ...prev,
        userSettingsChat: userSettings,
      };
    });
    console.log(userSettings);
    handleClose();
  }

  const handleClose = () => {
    setOpen(false);
  };

  const Models = [
    { value: "dolphin-mistral", label: "mistral" },
    { value: "dolphin-phi", label: "phi" },
    { value: "llama2-uncensored", label: "llama2" },
    { value: "tinyllama", label: "tinyllama" },
    { value: "deepseek-coder", label: "deepseek-coder" },
    { value: "qwen:0.5b", label: "qwen:0.5b" },
  ];
  const Index = [
    { value: "randome-index-1", label: "randome index 1" },
    { value: "randome-index-2", label: "randome index 2" },
    { value: "randome-index-3", label: "randome index 3" },
  ];
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle textAlign="center" id="dialog-title">
          {"User Settings"}
        </DialogTitle>

        <DialogContent sx={{ height: "70dvh" }}>
          <Box display="grid" gap="1em">
            <Box
              display="flex"
              gap="1em"
              width="100%"
              justifyContent="space-between"
            >
              <Autocomplete
                disablePortal
                disableClearable
                fullWidth
                value={userSettings.model}
                onChange={(_e, value) =>
                  setUserSettings({
                    ...userSettings,
                    model: value || { value: "qwen:0.5b", label: "qwen:0.5b" },
                  })
                }
                id="combo-box-demo"
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                options={Models}
                renderInput={(params) => (
                  <TextField {...params} label="Model" />
                )}
              />
              <Autocomplete
                disablePortal
                disableClearable
                fullWidth
                value={
                  userSettings.vectorDbIndex
                    ? userSettings.vectorDbIndex
                    : { value: "", label: "No Index selected" }
                }
                onChange={(_e, value) =>
                  setUserSettings({
                    ...userSettings,
                    vectorDbIndex: value || {
                      value: "randome-index-1",
                      label: "randome index 1",
                    },
                  })
                }
                id="combo-box-demo"
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                options={Index}
                renderInput={(params) => (
                  <TextField {...params} label="Model" />
                )}
              />
            </Box>
            <Box>
              <Typography>Temperature (0-1) {userSettings.temp}</Typography>
              <Slider
                aria-label="Temperature"
                value={userSettings.temp}
                onChange={(_e, value) => {
                  if (typeof value === "number")
                    setUserSettings({ ...userSettings, temp: value });
                }}
                valueLabelDisplay="auto"
                shiftStep={30}
                step={0.1}
                marks
                min={0}
                max={1}
              />
            </Box>
            <Box>
              <Typography
                sx={{ marginBottom: "1em", textAlign: "center" }}
                variant="h6"
              >
                Files in Index
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
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnSelector
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveSettings} autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
