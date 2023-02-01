import BaseLayout from "@/components/baseLayout/BaseLayout";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { IMenuProps } from "@/components/sidebar/Sidebar";
import TableData from "@/components/tableData/TableData";
import { useState, useEffect } from "react";
import { IContactsProps, IResultsProps } from "./api/contacts";
import { Button, IconButton, Stack } from "@mui/material";
import { DeleteForever, Edit, Message } from "@mui/icons-material";
import ConfirmationDialog from "@/components/confirmationDialog/ConfirmationDialog";
import { getAllData, deleteData } from "@/libs/rest/RESTClient";
import { useSnackbar, VariantType } from "notistack";

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
      const onClick = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const currentRow = params.row;
        return alert(JSON.stringify(currentRow, null, 4));
      };
      
      const handleDelete = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const { id } = params.row;
      
        fetch(`/api/contacts/${String(id)}`, {method: "DELETE"});

      };

      return (
        <Stack direction="row" spacing={2}>
          <IconButton aria-label="excluir" onClick={handleDelete}>
            <DeleteForever />
          </IconButton>
          <IconButton aria-label="edit" onClick={onClick}>
            <Edit />
          </IconButton>
        </Stack>
      );
    },
  },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [contacts, setContacts] = useState<IContactsProps[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleResponse = (variant: VariantType, message: String) => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant });
  };


  useEffect(() => {
    console.log("useEffect");
    if (isLoading) {
      console.log("isLoading");
      const fetchData = async () => {
        console.log("fetching data");
        const response = await getAllData("/api/contacts");
        console.log("converting to json");
        const json = await response.json();
        console.log("getting only data");
        const data = await json.data;
      
        console.log("verifing result");
        if (json.sucess) {
          console.log("sucess");
          setContacts(data);
          setIsLoading(false);
        } else console.log(`Ocorreu um erro: ${json}`);      
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
      <Button onClick={handleResponse('error', 'Erro...')}>Show snackbar</Button>     


    </BaseLayout>
  );
}
function enqueueSnackbar() {
  throw new Error("Function not implemented.");
}

