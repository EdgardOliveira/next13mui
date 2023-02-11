import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  FilledInput,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import PasswordIcon from "@mui/icons-material/Password";
import Link from "next/link";
import { InferType, object, string } from "yup";
import { SnackbarProvider, useSnackbar, VariantType } from "notistack";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { IResultsProps } from "../api/contacts";
import { postData } from "@/libs/rest/RESTClient";
import { useRouter } from "next/router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Image from "next/image";

const validationSchema = object({
  email: string().min(1, "Campo obrigatório").email("E-mail inválido"),
  password: string().required("Campo obrigatório"),
}).required();

type TFormData = InferType<typeof validationSchema>;

interface ICredentialProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

const theme = createTheme();

export default function IdentificarSe() {
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
      <Login />
    </SnackbarProvider>
  );
}

function Login() {
  const [credential, setCredential] = useState<TFormData>({
    email: "",
    password: "",
  });
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<TFormData> = (values: TFormData) => {
    setIsValidating(true);
    setCredential({ email: values.email, password: values.password });
  };

  async function handleResponse(variant: VariantType, message: String) {
    enqueueSnackbar(message, { variant });
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (isValidating) {
      const postingData = async () => {
        const response = await postData(`/api/auth/login`, credential);
        const json = await response.json();
        const { success, message, error }: IResultsProps = json;
        const data: ICredentialProps = json.data;

        if (success) {
          handleResponse("success", message);
          setIsValidating(false);
          reset();
          router.push("/contacts");
        } else {
          handleResponse("error", String(error));
        }
      };
      postingData();
    }
  }, [credential]);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Image
              priority
              src="/password.svg"
              height={128}
              width={128}
              alt="Credentials"
            />
            <Typography component="h1" variant="h5">
              Identifique-se!
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth size="small" variant="filled">
                <InputLabel htmlFor="filled-adornment-password">
                  Senha
                </InputLabel>
                <FilledInput
                  id="filled-adornment-password"
                  type={showPassword ? "text" : "password"}
                  error={!!errors.password}
                  placeholder={"Insira a senha aqui"}
                  {...register("password")}
                  startAdornment={
                    <InputAdornment position="start">
                      <IconButton aria-label="password-icon" edge="start">
                        <PasswordIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="exibir senha"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText id="standard-weight-helper-text" error>
                  {errors.email ? errors.email.message : ""}
                </FormHelperText>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Verificar
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/signup">
                    <Typography component="h1">
                      Ainda não tem conta? Registre-se!
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
