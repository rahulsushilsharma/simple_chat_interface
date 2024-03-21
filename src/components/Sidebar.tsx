import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import theme from "../theme";
import { memo, useMemo, useState } from "react";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsDialog from "./Settings";




export default memo(function Sidebar(props: any) {
  const { open, handleClose, drawerWidth, setSesson, sesson, sessons } = props;
  const [openSettings, setOpenSettings] = useState(false);
  const DrawerList = (
    <Box>
      <List sx={{ minHeight: "88dvh" }}>
        {sessons?.map((text: any, index: any) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => setSesson(text)}
              selected={sesson.id === text.id}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text?.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List
        sx={{
          position: "sticky",
          bottom: 0,
          background: theme.palette.background.default,
        }}
      >
        <ListItem disablePadding>
          <ListItemButton onClick={() => setOpenSettings(true)}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const Cached = useMemo(() => DrawerList, [sessons, sesson.id]);

  return (
    <div>
      <Drawer
        PaperProps={{ style: { width: drawerWidth } }}
        variant="persistent"
        open={open}
      >
        <Box
          sx={{
            zIndex: 9,
            position: "sticky",
            top: 0,
            background: theme.palette.background.default,
            display: "flex",
            justifyContent: "space-between",
            padding: "5px",
            gap: "5px",
          }}
        >
          <Button
            variant="outlined"
            fullWidth
            onClick={() =>
              setSesson({
                id: "-1",
                name: "",
              })
            }
          >
            + New Chat
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            <MenuIcon />
          </Button>
        </Box>
        {Cached}
        {/* {DrawerList} */}
      </Drawer>
      <SettingsDialog openState={[openSettings, setOpenSettings]} />
    </div>
  );
});
