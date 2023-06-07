import React from "react";
import { useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";

import Header from "../../components/header/Header";
import SidebarAtGroup from "../../components/sidebar/SidebarAtGroup";
import Calendar from "../../components/plan/Calendar";
import BoardList from "../../components/board/BoardList";
import { useTypeStore, useHeaderMenuStore } from "../../store/Store";

const Group = () => {
  const navigate = useNavigate();
  const { group_id } = useParams();
  const location = useLocation();
  // const { type_name } = useTypeStore();
  // console.log(type_name);
  const group_name = localStorage.getItem("group_name");

  const groups = location.state.groups;
  const { headerMenu } = useHeaderMenuStore();
  const { setTypeGroup } = useTypeStore();
  console.log(headerMenu);
  useEffect(() => {
    setTypeGroup(group_id);
  }, []);
  let isLogined = localStorage.getItem("isLogined");
  useEffect(() => {
    if (!isLogined) navigate("/login");
  }, [isLogined]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Header />
        <SidebarAtGroup
          group_id={group_id}
          group_name={group_name}
          groups={groups}
          // groupNames={groupNames}
        />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          {/* {headerMenu === "plan" ? (
            <Calendar
              type="group"
              type_id={group_id}
              groups={groups}
              group_name={group_name}
            />
          ) : (
            <BoardList />
          )} */}
          <Calendar
            type="group"
            type_id={group_id}
            groups={groups}
            group_name={group_name}
          />
        </Box>
      </Box>
    </div>
  );
};

export default Group;
