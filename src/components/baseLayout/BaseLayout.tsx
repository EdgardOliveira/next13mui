import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../navbar/Navbar";
import { ReactNode, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { styled } from "@mui/material/styles";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

//Tipagem do menu
export interface IMenuProps {
  titulo: string;
  url: string;
  icone?: ReactNode;
}

interface ISidebarProps {
  children: ReactNode;
  itensMenu: Array<IMenuProps>;
}

export default function BaseLayout({ children, itensMenu }: ISidebarProps) {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar
        appName="Next13MUI"
        statusMenu={open}
        openMenu={handleDrawerOpen}
        closeMenu={handleDrawerClose}
      />
      <Sidebar
        statusMenu={open}
        closeMenu={handleDrawerClose}
        itensMenu={itensMenu}
      ></Sidebar>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
