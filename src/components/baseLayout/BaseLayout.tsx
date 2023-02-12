import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "../navbar/Navbar";
import { ReactNode, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { styled } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import Header from "../header/Header";

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

// itens do menu
const itensMenu: Array<IMenuProps> = [
  { titulo: "Inicial", url: "/", icone: <HomeIcon /> },
  { titulo: "Dashboard", url: "/dashboard", icone: <DashboardIcon /> },
  { titulo: "Grupos", url: "/grupos", icone: <PeopleIcon /> },
  { titulo: "Redes", url: "/redes", icone: <WifiIcon /> },
  { titulo: "Usuários", url: "/usuarios", icone: <AssignmentIndIcon /> },
];

interface IBaseLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function BaseLayout({
  title,
  subtitle,
  children,
}: IBaseLayoutProps) {
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
      <SnackbarProvider maxSnack={4} preventDuplicate>
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
          <Header title={title} subtitle={subtitle} />
          {children}
        </Box>
      </SnackbarProvider>
    </Box>
  );
}
