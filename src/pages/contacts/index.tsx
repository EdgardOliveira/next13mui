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
import { Button, IconButton, Stack, Tooltip } from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog";
import { deleteData, getAllData } from "@/libs/rest/RESTClient";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Iniciar() {
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
      // preventDuplicate
    >
      <Home />
    </SnackbarProvider>
  );
}

function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contacts, setContacts] = useState<IContactsProps[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  // itens do menu
  const itensMenu: Array<IMenuProps> = [
    { titulo: "Inicial", url: "/", icone: <HomeIcon /> },
    { titulo: "Dashboard", url: "/dashboard", icone: <DashboardIcon /> },
    { titulo: "Grupos", url: "/grupos", icone: <PeopleIcon /> },
    { titulo: "Redes", url: "/redes", icone: <WifiIcon /> },
    { titulo: "Usuários", url: "/usuarios", icone: <AssignmentIndIcon /> },
  ];

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "zipCode",
      headerName: "Zip Code",
      flex: 1,
    },
    { field: "registrarId", headerName: "Registrar ID" },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      sortable: false,
      disableClickEventBubbling: true,
      headerAlign: "center",
      align: "center",

      renderCell: (params: any) => {
        const { id } = params.row;

        return (
          <Stack direction="row" spacing={2}>
            <Tooltip title="Excluir">
              <IconButton
                aria-label="excluir"
                onClick={() => handleDelete(String(id))}
                color={"error"}
              >
                <DeleteForever />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                aria-label="edit"
                onClick={() => handleEdit(String(id))}
                color={"warning"}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
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

  const handleEdit = async (id: string) => {
    console.log("paginando para contactos id");
    router.push(`/contacts/${id}`);
  };

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const fetchData = async () => {
        const response = await getAllData("/api/contacts");
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IContactsProps[] = json.data;

        if (success) {
          handleResponse("success", message);
          // feedback();
          setIsLoading(false);
          setContacts(data);
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
      <TableData
        title={"Contatos"}
        subtitle={"Lista de contatos para futura referência"}
        data={contacts}
        columns={columns}
      />
      <ConfirmationDialog
        title="EXCLUSÃO DE REGISTRO"
        message="Realmente deseja excluir o registro?"
        status={openDialog}
        isDeleting={isDeleting}
        handleClose={handleClose}
      />
      <Button variant="outlined" onClick={handleClickOpen}>
        Disparo de ConfirmationDialog
      </Button>
    </BaseLayout>
  );
}
