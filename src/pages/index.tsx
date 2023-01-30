import BaseLayout from "@/components/baseLayout/BaseLayout";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { IMenuProps } from "@/components/sidebar/Sidebar";
import TableData from "@/components/tableData/TableData";
import { useState, useEffect } from "react";
import { IContactsProps } from "./api/contacts";
import { IconButton, Stack } from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";

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
        const currentRow = params.row;
        const { id } = currentRow;
        return alert(
          fetch(`/api/contacts/${String(id)}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((json) => json.data)
        );
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
  const [contacts, setContacts] = useState<IContactsProps[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((response) => response.json())
      .then((contacts) => setContacts(contacts.data));
  }, []);

  return (
    <BaseLayout itensMenu={itensMenu}>
      <TableData
        title={"Contatos"}
        subtitle={"Lista de contatos para futura referência"}
        data={contacts}
        columns={columns}
      />
    </BaseLayout>
  );
}
