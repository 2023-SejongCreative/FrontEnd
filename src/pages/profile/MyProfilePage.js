import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Box, Toolbar, Grid, Divider } from "@mui/material";

import Header from "../../components/header/Header";
import SideBarAtHome from "../../components/sidebar/SidebarAtHome";
import MyData from "../../components/profile/MyData";
import OngoingProject from "../../components/profile/OngoingProject";

const StyleProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MyProfilePage = () => {
  const navigate = useNavigate();
  let isLogined = localStorage.getItem("isLogined");
  useEffect(() => {
    if (!isLogined) navigate("/login");
  }, [isLogined]);
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Header />
        <SideBarAtHome />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <StyleProfileWrapper>
            {" "}
            <MyData />
          </StyleProfileWrapper>

          <Grid container alignItems="center">
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: "DarkGrey",
              }}
            />
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default MyProfilePage;
