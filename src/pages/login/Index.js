import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  //   CssBaseline,
  TextField,
  FormControl,
  Grid,
  Box,
  Container,
} from "@mui/material/";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MyButton, MyTypography, MyLink } from "./style";

import { api } from "../../api/Interceptors";

const Index = () => {
  const goRegister = () => {
    navigate("/register");
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   const theme = createTheme();

  const navigate = useNavigate();

  //form 전송
  const handleSubmit = async (e) => {
    let body = {
      email: email,
      password: password,
    };
    e.preventDefault();

    await api
      .post("/login", body)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          alert("로그인 완료! Waffle에 오신걸 환영합니다❤️");

          //새로고침하면 axios network 에러나는 문제를 해결하기 위해 defaults.headers에 넣어줌
          axios.defaults.headers.common["access_token"] =
            response.headers.access_token;

          navigate("/", { state: { user_email: email } });

          localStorage.setItem(
            "jwt_accessToken",
            response.headers.access_token
          );
          localStorage.setItem(
            "jwt_refreshToken",
            response.headers.refresh_token
          );
          localStorage.setItem("isLogined", true);
          localStorage.setItem("email", email);
          localStorage.setItem("id", response.data);
          // setTimeout(onSlientRefresh, 1500000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        if (error.response.data.code === "LOGIN-001")
          alert("일치하는 회원이 없습니다. 먼저 회원가입을 진행해주세요!");
        else if (error.response.data.code === "LOGIN-002") {
          alert("비밀번호가 일치하지 않습니다.");
        }
      });
  };

  const onSlientRefresh = () => {
    api
      .post(
        "/reissue",
        {},
        {
          headers: {
            access_token: localStorage.getItem("jwt_accessToken"),
            refresh_token: localStorage.getItem("jwt_refreshToken"),
          },
        }
      )
      .then((response) => {
        localStorage.setItem("jwt_accessToken", response.headers.access_token);
        localStorage.setItem(
          "jwt_refreshToken",
          response.headers.refresh_token
        );
        localStorage.setItem("isLogined", true);
        setInterval(onSlientRefresh, 1500000); //25분마다 리이슈 요청
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    // <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      {/* <CssBaseline /> */}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <MyTypography component="h1" variant="h5">
          Waffle 로그인
        </MyTypography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <FormControl component="fieldset" variant="standard">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  autoFocus
                  fullWidth
                  type="email"
                  label="이메일 주소를 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <MyButton
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              size="large"
            >
              로그인
            </MyButton>
          </FormControl>
        </Box>
        <MyLink component="button" onClick={goRegister}>
          회원가입 하러 가기
        </MyLink>
      </Box>
    </Container>
    // </ThemeProvider>
  );
};
export default Index;
