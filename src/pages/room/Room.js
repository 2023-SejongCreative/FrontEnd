import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Box, Toolbar } from "@mui/material";

import Header from "../../components/header/Header";
import SidebarAtRoom from "../../components/sidebar/SidebarAtRoom";
import Calendar from "../../components/plan/Calendar";
import { useTypeStore, useHeaderMenuStore } from "../../store/Store";

const Room = () => {
  const navigate = useNavigate();
  const { room_id } = useParams();
  const location = useLocation();
  const room_name = location.state.room_name;
  const rooms = location.state.rooms;
  const group_id = location.state.group_id;
  const groups = location.state.groups;

  const { setTypeRoom } = useTypeStore();
  useEffect(() => {
    setTypeRoom(room_id);
    localStorage.setItem("type", "room");
    localStorage.setItem("room_id", room_id);
  }, []);

  let isLogined = localStorage.getItem("isLogined");
  useEffect(() => {
    if (!isLogined) navigate("/login");
  }, [isLogined]);

  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Header />
        <SidebarAtRoom
          room_name={room_name}
          rooms={rooms}
          group_id={group_id}
          groups={groups}
        />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <Calendar type="room" type_id={room_id} />
        </Box>
      </Box>
    </div>
  );
};

export default Room;
