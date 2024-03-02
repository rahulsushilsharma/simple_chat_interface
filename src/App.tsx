import { Box, Button, Typography } from "@mui/material";
import "./App.css";

import { useState } from "react";
import Sidebar from "./pages/Chat";

function App() {
  const drawerWidth = 300;

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  // const drawerWidth = 240; // You can adjust the initial width of the drawer

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <Box
        style={{
          marginLeft: isDrawerOpen ? drawerWidth : 0,
          transition: "margin 0.3s",
        }}
      >
        {!isDrawerOpen && <Button onClick={handleDrawerOpen}>open</Button>}
        <Sidebar
          open={isDrawerOpen}
          drawerWidth={drawerWidth}
          handleClose={handleDrawerClose}
        />
        <Box padding="1em"></Box>
      </Box>
    </>
  );
}
export default App;
