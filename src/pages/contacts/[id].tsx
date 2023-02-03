import BaseLayout from "@/components/baseLayout/BaseLayout";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { IMenuProps } from "@/components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import { IContactsProps, IResultsProps } from "../api/contacts";
import { Box, TextField } from "@mui/material";
import { getDataById } from "@/libs/rest/RESTClient";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, number, object, string } from "yup";

// A função abaixo demonstra o uso de uma expressão regular que identifica, de forma simples, telefones válidos no Brasil.
// Nenhum DDD iniciado por 0 é aceito, e nenhum número de telefone pode iniciar com 0 ou 1.
// Exemplos válidos: +55 (11) 98888-8888 / 9999-9999 / 21 98888-8888 / 5511988888888
const phoneRegExp =
  /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;

const validationSchema = object({
  name: string().required("Campo obrigatório"),
  email: string().min(1, "Campo obrigatório").email("Email inválido"),
  age: number().positive().integer().required("Campo obrigatório"),
  phone: string()
    .required("Campo obrigatório")
    .matches(phoneRegExp, "O telefone informado é inválido"),
  address: string().required("Campo obrigatório"),
  city: string().required("Campo obrigatório"),
  zipCode: string().required("Campo obrigatório"),
  registrarId: number().required("Campo obrigatório"),
}).required();

type TFormData = InferType<typeof validationSchema>;

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
  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitSuccessful,
      isDirty,
      isSubmitted,
      isSubmitting,
      isValid,
    },
  } = useForm<TFormData>({
    resolver: yupResolver(validationSchema),
  });

  console.log(`AddEdit: ${id}`);

  // itens do menu
  const itensMenu: Array<IMenuProps> = [
    { titulo: "Inicial", url: "/", icone: <HomeIcon /> },
    { titulo: "Dashboard", url: "/dashboard", icone: <DashboardIcon /> },
    { titulo: "Grupos", url: "/grupos", icone: <PeopleIcon /> },
    { titulo: "Redes", url: "/redes", icone: <WifiIcon /> },
    { titulo: "Usuários", url: "/usuarios", icone: <AssignmentIndIcon /> },
  ];

  const onSubmit: SubmitHandler<TFormData> = (values: TFormData) => {
    console.log(values);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="name"
            label="Nome"
            placeholder="Insira o nome aqui"
            {...register("name")}
            // required
            autoComplete="name"
            autoFocus
            // onChange={}
            // value={}
            error={!!errors.name?.message}
            helperText={!!errors.name?.message}
          />
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="email"
            label="E-mail"
            placeholder="Insira o e-mail aqui"
            {...register("email")}
            // required
            autoComplete="email"
            autoFocus
            // onChange={}
            // value={}
            error={!!errors.email?.message}
            helperText={!!errors.email?.message}
          />
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="age"
            label="Idade"
            placeholder="Insira a idade aqui"
            {...register("age")}
            // required
            autoComplete="age"
            autoFocus
            // onChange={}
            // value={}
            error={!!errors.age?.message}
            helperText={!!errors.age?.message}
          />
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="address"
            label="Endereço"
            placeholder="Insira o endereço aqui"
            {...register("address")}
            // required
            autoComplete="address"
            autoFocus
            // onChange={}
            // value={}
            error={!!errors.address?.message}
            helperText={!!errors.address?.message}
          />
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="city"
            label="Cidade"
            placeholder="Insira a cidade aqui"
            {...register("city")}
            // required
            autoComplete="city"
            autoFocus
            // onChange={}
            // value={}
            error={!!errors.city?.message}
            helperText={!!errors.city?.message}
          />
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="zipCoode"
            label="CEP"
            placeholder="Insira o cep aqui"
            {...register("zipCode")}
            // required
            autoComplete="zipCode"
            autoFocus
            // onChange={}
            // value={}
            error={!!errors.zipCode?.message}
            helperText={!!errors.zipCode?.message}
          />
          <TextField
            variant="filled"
            margin="normal"
            fullWidth
            id="registrarId"
            label="Id Cadastrador"
            placeholder="Insira o id aqui"
            {...register("registrarId")}
            // required
            autoComplete="registrarId"
            autoFocus
            // onChange={}
            // value={}
            error={!!errors.registrarId?.message}
            helperText={!!errors.registrarId?.message}
          />
          <button type="submit">Enviar</button>
        </form>
      </Box>
    </BaseLayout>
  );
}
