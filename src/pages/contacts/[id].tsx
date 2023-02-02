import BaseLayout from "@/components/baseLayout/BaseLayout";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { IMenuProps } from "@/components/sidebar/Sidebar";
import TableData from "@/components/tableData/TableData";
import { useState, useEffect } from "react";
import { IContactsProps, IResultsProps } from "../api/contacts";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog";
import { deleteData, getAllData, getDataById } from "@/libs/rest/RESTClient";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Link from "next/link";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import Header from "@/components/header/Header";

export default function CadastrarEditar() {
  return (
    <SnackbarProvider
      iconVariant={{
        success: "✅",
        error: "✖️",
        warning: "⚠️",
        info: "ℹ️",
      }}
      maxSnack={5}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <AddEdit />
    </SnackbarProvider>
  );
}

function AddEdit() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contact, setContact] = useState<IContactsProps>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { id } = router.query;

  console.log(`AddEdit: ${id}`);

  // itens do menu
  const itensMenu: Array<IMenuProps> = [
    { titulo: "Inicial", url: "/", icone: <HomeIcon /> },
    { titulo: "Dashboard", url: "/dashboard", icone: <DashboardIcon /> },
    { titulo: "Grupos", url: "/grupos", icone: <PeopleIcon /> },
    { titulo: "Redes", url: "/redes", icone: <WifiIcon /> },
    { titulo: "Usuários", url: "/usuarios", icone: <AssignmentIndIcon /> },
  ];

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  async function handleResponse(variant: VariantType, message: String) {
    enqueueSnackbar(message, { variant });
  }

  const handleDelete = async (id: string) => {
    const result = await deleteData(`/api/contacts/${id}`);
    const json = await result.json();
    const { success, message, error }: IResultsProps = json;

    switch (success) {
      case true:
        handleResponse("success", message);
        setIsLoading(true);
        break;
      case false:
        handleResponse("error", String(error));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const response = await getDataById(`/api/contacts/${id}`);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IContactsProps[] = json.data;

        if (success) {
          handleResponse("success", message);
          setIsLoading(false);
          setContact(data[0]);
        } else {
          handleResponse("error", String(error));
          console.log(`Ocorreu um erro: ${error}`);
        }
      };
      fetchData();
    }
  }, [isLoading]);

  return (
    <BaseLayout itensMenu={itensMenu}>
      <Header titulo={"Contatos"} subtitulo={"Edição de dados"}></Header>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="nome"
            label="Nome"
            placeholder="Insira o nome do grupo aqui"
            name="nome"
            required
            autoComplete="nome"
            autoFocus
            // onChange={formik.handleChange}
            // value={formik.values.nome}
            // error={formik.touched.nome && Boolean(formik.errors.nome)}
            // helperText={formik.touched.nome && formik.errors.nome}
          />
        </div>
      </Box>
    </BaseLayout>
  );
}
