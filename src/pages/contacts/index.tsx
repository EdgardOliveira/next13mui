import BaseLayout from "@/components/baseLayout/BaseLayout";
import TableData from "@/components/tableData/TableData";
import { useState, useEffect } from "react";
import { IContactsProps, IResultsProps } from "../api/contacts";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";
import { deleteData, getAllData } from "@/libs/rest/RESTClient";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog";

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
    >
      <Home />
    </SnackbarProvider>
  );
}

function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [contacts, setContacts] = useState<IContactsProps[]>([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

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

  const handleAdd = () => {
    router.push("/contacts/0");
  };

  const handleEdit = async (id: string) => {
    router.push(`/contacts/${id}`);
  };

  const handleDelete = async (id: string) => {
    handleClickOpen();
    setDeleteId(id);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setDeleteId("");
  };

  const handleConfirm = () => {
    setOpen(false);
    setIsDeleting(true);
  };

  async function handleResponse(variant: VariantType, message: String) {
    enqueueSnackbar(message, { variant });
  }

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

  useEffect(() => {
    if (isDeleting) {
      const deletingData = async () => {
        const result = await deleteData(`/api/contacts/${deleteId}`);
        const json = await result.json();
        const { success, message, error }: IResultsProps = json;

        switch (success) {
          case true:
            handleResponse("success", message);
            setIsDeleting(false);
            setDeleteId("");
            setIsLoading(true);
            break;
          case false:
            handleResponse("error", String(error));
            break;
          default:
            break;
        }
      };
      deletingData();
    }
  }, [isDeleting]);

  return (
    <BaseLayout title="Contatos" subtitle="Listagem de contatos">
      <TableData
        rows={contacts}
        columns={columns}
        isLoading={isLoading}
        addButton={handleAdd}
      />
      <ConfirmationDialog
        title={"EXCLUIR REGISTRO"}
        contentText={"Realmente deseja excluir este registro?"}
        open={open}
        onClose={handleCancel}
        onConfirm={handleConfirm}
      />
    </BaseLayout>
  );
}
