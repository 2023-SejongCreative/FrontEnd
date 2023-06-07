import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

import Header from "../../components/header/Header";
import SideBarAtHome from "../../components/sidebar/SidebarAtHome";
import Calendar from "../../components/plan/Calendar";

const Index = () => {
  const navigate = useNavigate();
  const user_email = localStorage.getItem("email");
  const [planState, setPlanState] = useState("Calendar");
  let my_id = localStorage.getItem("id");

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <SideBarAtHome />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />

        <Calendar type="home" type_id={my_id} />
      </Box>
    </Box>
  );
};

export default Index;
