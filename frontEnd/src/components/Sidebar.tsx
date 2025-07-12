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
import { memo, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsDialog from "./Settings";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { SessonInterface } from "../interfaces/Interfaces";

interface SidebarProps {
  open: boolean;
  handleClose: () => void;
  drawerWidth: number;
  setSesson: React.Dispatch<React.SetStateAction<SessonInterface>>;
  sesson: SessonInterface;
  sessons: SessonInterface[];
  deleteSession: (id: string) => void;
}

export default memo(function Sidebar(props: SidebarProps) {
  const {
    open,
    handleClose,
    drawerWidth,
    setSesson,
    sesson,
    sessons,
    deleteSession,
  } = props;
  const [openSettings, setOpenSettings] = useState(false);
  console.log("sessons", sessons);
  const DrawerList = (
    <Box>
      <List sx={{ minHeight: "88dvh" }}>
        {sessons?.map((session, index: number) => (
          <Tooltip key={index} title={session?.name} placement="right">
            <ListItem
              key={index}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteSession(session?.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemButton
                onClick={() => setSesson(session)}
                selected={sesson.id === session.id}
                // adding delete button
              >
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText
                  primary={session?.name}
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
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
        {DrawerList}
      </Drawer>
      <SettingsDialog openState={[openSettings, setOpenSettings]} />
    </div>
  );
});
