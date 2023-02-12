import BaseLayout from "@/components/baseLayout/BaseLayout";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog";
import TableData from "@/components/tableData/TableData";
import { deleteData, getAllData } from "@/libs/rest/RESTClient";
import { DeleteForever, Edit } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import { SnackbarProvider, useSnackbar, VariantType } from "notistack";
import { useEffect, useState } from "react";
import { IResultsProps } from "../api/contacts";
import { IResourcesProps } from "../api/resources";

export default function Recursos() {
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
      <Resource />
    </SnackbarProvider>
  );
}

function Resource() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [resources, setResources] = useState<IResourcesProps[]>();
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const columns = [
    { field: "id", headerName: "IDs", flex: 0.5 },
    {
      field: "name",
      headerName: "NOMES",
      flex: 1,
    },
    {
      field: "description",
      headerName: "DESCRIÇÕES",
      flex: 1,
    },
    {
      field: "status",
      headerName: "STATUS",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "AÇÕES",
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
    router.push("/resources/0");
  };

  const handleEdit = async (id: string) => {
    router.push(`/resources/${id}`);
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
        const response = await getAllData("/api/resources");
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IResourcesProps[] = json.data;

        if (success) {
          handleResponse("success", message);
          setIsLoading(false);
          setResources(data);
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
        const result = await deleteData(`/api/resources/${deleteId}`);
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
    <BaseLayout title="Recursos" subtitle="Listagem de recursos do sistema">
      <TableData
        rows={resources}
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
