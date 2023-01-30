import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { blue, green, grey } from "@mui/material/colors";
import Header from "../header/Header";

interface ITableProps {
  data: any;
  columns: any;
  title: string;
  subtitle: string;
}

const TableData = ({ data, columns, title, subtitle }: ITableProps) => {
  const theme = useTheme();

  return (
    <Box m="20px">
      <Header titulo={title} subtitulo={subtitle}></Header>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: green,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: blue,
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: grey,
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: blue,
          },
          "& .MuiCheckbox-root": {
            color: `${green} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${grey} !important`,
          },
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          // pageSize={20}
          autoHeight
          // checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default TableData;
