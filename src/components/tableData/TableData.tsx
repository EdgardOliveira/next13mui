import { Box, Skeleton, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { blue, green, grey } from "@mui/material/colors";
import Header from "../header/Header";

const LoadingSkeleton = () => (
  <Box
    sx={{
      height: "max-content",
    }}
  >
    {[...Array(10)].map((_, index) => (
      <Skeleton key={index} variant="rectangular" sx={{ my: 4, mx: 1 }} />
    ))}
  </Box>
);

interface ITableProps {
  data: any;
  columns: any;
  title: string;
  subtitle: string;
  isLoading: boolean;
}

const TableData = ({
  data,
  columns,
  title,
  subtitle,
  isLoading,
}: ITableProps) => {
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
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          autoHeight
          disableSelectionOnClick
          disableColumnMenu
          disableColumnSelector
          components={{
            Toolbar: GridToolbar,
            LoadingOverlay: LoadingSkeleton,
          }}
          loading={isLoading}
          sx={{ minHeight: 600 }}
        />
      </Box>
    </Box>
  );
};

export default TableData;
