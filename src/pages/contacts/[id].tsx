import BaseLayout from "@/components/baseLayout/BaseLayout";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SaveIcon from "@mui/icons-material/Save";
import { IMenuProps } from "@/components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import { IContactsProps, IResultsProps } from "../api/contacts";
import { Box, Button, TextField } from "@mui/material";
import { getDataById, postData } from "@/libs/rest/RESTClient";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, number, object, string } from "yup";
import { type } from "os";

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
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [contact, setContact] = useState<IContactsProps>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
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

  // itens do menu
  const itensMenu: Array<IMenuProps> = [
    { titulo: "Inicial", url: "/", icone: <HomeIcon /> },
    { titulo: "Dashboard", url: "/dashboard", icone: <DashboardIcon /> },
    { titulo: "Grupos", url: "/grupos", icone: <PeopleIcon /> },
    { titulo: "Redes", url: "/redes", icone: <WifiIcon /> },
    { titulo: "Usuários", url: "/usuarios", icone: <AssignmentIndIcon /> },
  ];

  const onSubmit: SubmitHandler<TFormData> = (values: TFormData) => {
    setContact(values as IContactsProps);
    setIsPosting(true);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const isAddMode: boolean = Number(id) === 0 ? true : false;

  async function handleResponse(variant: VariantType, message: String) {
    enqueueSnackbar(message, { variant });
  }

  useEffect(() => {
    console.log(`useEffect somente uma vez: id: ${id}`);
    if (!isAddMode) {
      setIsLoading(true);
    }
  }, []);

  useEffect(() => {
    console.log(`useEffect do getbyid`);
    //se não estiver no modo de cadastro... carrega os dados do id fornecido
    if (!isAddMode) {
      console.log(`estou no modo Edição... consultando api`);
      const fetchData = async () => {
        const response = await getDataById(`/api/contacts/${id}`);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IContactsProps = json.data;

        if (success) {
          console.log(`use effet getById... tive sucesso na consulta...`);
          handleResponse("success", message);
          setContact(data);
          console.log(`Dados retornados: ${JSON.stringify(data, null, 4)}`);
          console.log(`desativando o isLoading`);
          setIsLoading(false);
        } else {
          handleResponse("error", String(error));
          console.log(`Ocorreu um erro: ${error}`);
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    console.log(
      `useEffect da mudança de contatos ... setValue ${JSON.stringify(
        contact,
        null,
        4
      )}`
    );
    if (contact) {
      setValue("name", contact.name);
      setValue("email", contact.email);
      setValue("age", contact.age);
      setValue("phone", contact.phone);
      setValue("address", contact.address);
      setValue("city", contact.city);
      setValue("zipCode", contact.zipCode);
      setValue("registrarId", contact.registrarId);
      setIsLoading(false);
    }
  }, [contact]);

  useEffect(() => {
    console.log(`useEffect posting...`);
    if (isPosting) {
      console.log(`estou postando dados para api...`);
      const postingData = async () => {
        const response = await postData(`/api/contacts`, contact);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IContactsProps[] = json.data;

        if (success) {
          handleResponse("success", message);
          console.log(`registro cadastrado... trocando para listagem...`);
          reset();
          router.push("/contacts");
        } else {
          handleResponse("error", String(error));
        }
      };
      postingData();
    }
  }, [contact]);

  return (
    <BaseLayout itensMenu={itensMenu}>
      <Header titulo={"Contatos"} subtitulo={"Edição de dados"}></Header>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <TextField
              label="Nome"
              type={"text"}
              fullWidth
              variant="outlined"
              error={!!errors.name}
              placeholder={"Insira o nome aqui"}
              helperText={errors.name ? errors.name.message : ""}
              {...register("name")}
            />
          </Box>
          <Box>
            <TextField
              label="E-mail"
              type={"email"}
              fullWidth
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              {...register("email")}
            />
          </Box>
          <Box>
            <TextField
              label="Idade"
              type={"number"}
              fullWidth
              variant="outlined"
              error={!!errors.age}
              helperText={errors.age ? errors.age.message : ""}
              {...register("age")}
            />
          </Box>
          <Box>
            <TextField
              label="Telefone"
              type={"phone"}
              fullWidth
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone ? errors.phone.message : ""}
              {...register("phone")}
            />
          </Box>
          <Box>
            <TextField
              label="Endereço"
              type={"text"}
              fullWidth
              variant="outlined"
              error={!!errors.address}
              helperText={errors.address ? errors.address.message : ""}
              {...register("address")}
            />
          </Box>
          <Box>
            <TextField
              label="Cidade"
              type={"text"}
              fullWidth
              variant="outlined"
              error={!!errors.city}
              helperText={errors.city ? errors.city.message : ""}
              {...register("city")}
            />
          </Box>
          <Box>
            <TextField
              label="CEP"
              type={"number"}
              fullWidth
              variant="outlined"
              error={!!errors.zipCode}
              helperText={errors.zipCode ? errors.zipCode.message : ""}
              {...register("zipCode")}
            />
          </Box>
          <Box>
            <TextField
              label="Registrar Id"
              type={"number"}
              fullWidth
              variant="outlined"
              error={!!errors.registrarId}
              helperText={errors.registrarId ? errors.registrarId.message : ""}
              {...register("registrarId")}
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              onClick={handleSubmit(onSubmit)}
            >
              Salvar
            </Button>
          </Box>
        </form>
      </Box>
    </BaseLayout>
  );
}
