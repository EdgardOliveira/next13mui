import { Typography, Box } from "@mui/material";

//Tipagem do Header
interface IHeaderProps {
  titulo: String;
  subtitulo: String;
}

export default function Header({ titulo, subtitulo }: IHeaderProps) {
  return (
    <Box mb="30px">
      <Typography variant="h2" fontWeight="bold" sx={{ m: "0 0 5px 0" }}>
        {titulo}
      </Typography>
      <Typography variant="h5">{subtitulo}</Typography>
    </Box>
  );
}
