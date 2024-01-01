import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FoodBankIcon from "@mui/icons-material/FoodBank";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function Otp() {
  const { enqueueSnackbar } = useSnackbar();
  const [updatepassword, setUpdatepassword] = React.useState(false);
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const otp = { otp: data.get("otp") };
    axios
      .post("http://localhost:8080/api/v1/auth/validateotp", otp)
      .then(function (response) {
        response.status === 204
          ? enqueueSnackbar("Invalid Otp", {
              variant: "error",
              autoHideDuration: 1000,
            })
          : setUpdatepassword(true);
      })
      .catch(function (error) {
        enqueueSnackbar("Interal Sever Error", {
          variant: "error",
          autoHideDuration: 1000,
        });
      });
  };
  const handleUpdatepassword = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const updatedPassword = { password: data.get("password") };
    axios
      .post("http://localhost:8080/api/v1/auth/updatepassword", updatedPassword)
      .then(function (response) {
        if (response.status === 200) {
          enqueueSnackbar("Password Updated Successfully", {
            variant: "success",
            autoHideDuration: 1000,
          });
          navigate("/");
        }
      })
      .catch(function (error) {
        enqueueSnackbar("Interal Sever Error", {
          variant: "error",
          autoHideDuration: 1000,
        });
      });
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <FoodBankIcon></FoodBankIcon>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Recipe Sharing App
          </Typography>
        </Toolbar>
      </AppBar>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="text"
                id="otp"
                label="otp"
                name="otp"
                autoComplete="Otp"
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                VALIDATE OTP
              </Button>
            </Box>
            {updatepassword ? (
              <Box
                component="form"
                onSubmit={handleUpdatepassword}
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  id="password"
                  label="password"
                  name="password"
                  autoComplete="password"
                  autoFocus
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  UPDATE PASSWORD
                </Button>
              </Box>
            ) : null}
          </Box>
        </Container>
      </ThemeProvider>
    </Box>
  );
}
