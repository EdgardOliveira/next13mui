import BaseLayout from "@/components/baseLayout/BaseLayout";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import WifiIcon from "@mui/icons-material/Wifi";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SaveIcon from "@mui/icons-material/Save";
import CheckIcon from "@mui/icons-material/Check";
import { IMenuProps } from "@/components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import { IContactsProps, IResultsProps } from "../api/contacts";
import { Box, CircularProgress, Fab, TextField, Tooltip } from "@mui/material";
import { getDataById, postData, updateData } from "@/libs/rest/RESTClient";
import { SnackbarProvider, VariantType, useSnackbar } from "notistack";
import { useRouter } from "next/router";
import Header from "@/components/header/Header";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType, number, object, string } from "yup";
import { green } from "@mui/material/colors";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [contact, setContact] = useState<IContactsProps>();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
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

  const buttonSx = {
    ...(isLoading && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const onSubmit: SubmitHandler<TFormData> = (values: TFormData) => {
    setContact(values as IContactsProps);

    switch (isAddMode) {
      case true:
        setIsPosting(true);
        break;
      case false:
        setIsUpdating(true);
        break;
    }
  };

  const isAddMode: boolean = Number(id) === 0 ? true : false;

  async function handleResponse(variant: VariantType, message: String) {
    enqueueSnackbar(message, { variant });
  }

  useEffect(() => {
    //se não estiver no modo de cadastro... carrega os dados do id fornecido
    if (!isAddMode && isLoading) {
      const fetchData = async () => {
        const response = await getDataById(`/api/contacts/${id}`);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IContactsProps = json.data;

        if (success) {
          handleResponse("success", message);
          setIsLoading(false);
          setContact(data);
        } else {
          handleResponse("error", String(error));
        }
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
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
    if (isPosting) {
      const postingData = async () => {
        const response = await postData(`/api/contacts/${id}`, contact);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IContactsProps = json.data;

        if (success) {
          handleResponse("success", message);
          setIsPosting(false);
          setIsLoading(false);
          reset();
          router.push("/contacts");
        } else {
          handleResponse("error", String(error));
        }
      };
      postingData();
    }
  }, [contact]);

  useEffect(() => {
    if (isUpdating) {
      const updatingData = async () => {
        const response = await updateData(`/api/contacts/${id}`, contact);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: IContactsProps = json.data;

        if (success) {
          handleResponse("success", message);
          setIsUpdating(false);
          setIsLoading(false);
          reset();
          router.push("/contacts");
        } else {
          handleResponse("error", String(error));
        }
      };
      updatingData();
    }
  }, [contact]);

  return (
    <BaseLayout itensMenu={itensMenu}>
      <Header
        title={"Contatos"}
        subtitle={isAddMode ? "Cadastrar dados" : "Editar dados"}
      ></Header>
      <Box
        sx={{
          "& .MuiTextField-root": { m: 1, width: "35ch" },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              "& .MuiTextField-root": { m: 1, width: "45ch" },
            }}
          >
            <TextField
              label="Nome"
              type={"text"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.name}
              placeholder={"Insira o nome aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.name ? errors.name.message : ""}
              {...register("name")}
            />
          </Box>
          <Box>
            <TextField
              label="E-mail"
              type={"email"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.email}
              placeholder={"Insira o e-mail aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.email ? errors.email.message : ""}
              {...register("email")}
            />
          </Box>
          <Box>
            <TextField
              label="Idade"
              type={"number"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.age}
              placeholder={"Insira a idade aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.age ? errors.age.message : ""}
              {...register("age")}
            />
          </Box>
          <Box>
            <TextField
              label="Telefone"
              type={"phone"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.phone}
              placeholder={"Insira o telefone aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.phone ? errors.phone.message : ""}
              {...register("phone")}
            />
          </Box>
          <Box>
            <TextField
              label="Endereço"
              type={"text"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.address}
              placeholder={"Insira o endereço aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.address ? errors.address.message : ""}
              {...register("address")}
            />
          </Box>
          <Box>
            <TextField
              label="Cidade"
              type={"text"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.city}
              placeholder={"Insira a cidade aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.city ? errors.city.message : ""}
              {...register("city")}
            />
          </Box>
          <Box>
            <TextField
              label="CEP"
              type={"number"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.zipCode}
              placeholder={"Insira o CEP aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.zipCode ? errors.zipCode.message : ""}
              {...register("zipCode")}
            />
          </Box>
          <Box>
            <TextField
              label="Registrar Id"
              type={"number"}
              fullWidth
              variant="filled"
              size="small"
              error={!!errors.registrarId}
              placeholder={"Insira o id do registrador aqui"}
              InputLabelProps={{ shrink: true }}
              helperText={errors.registrarId ? errors.registrarId.message : ""}
              {...register("registrarId")}
            />
          </Box>
          <Box sx={{ m: 1, position: "relative" }}>
            <Tooltip title="Salvar">
              <Fab
                aria-label="Salvar"
                color="primary"
                sx={buttonSx}
                onClick={handleSubmit(onSubmit)}
              >
                {isPosting || isUpdating ? <CheckIcon /> : <SaveIcon />}
              </Fab>
            </Tooltip>
            {isPosting || isUpdating && (
              <CircularProgress
                size={68}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
        </form>
      </Box>
    </BaseLayout>
  );
}
