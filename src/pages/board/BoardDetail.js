import React, { useEffect } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";

import { Box, Divider, Grid, Toolbar } from "@mui/material";

import { useGroupsStore, useRoomsStore, useTypeStore } from "../../store/Store";
import BoardList from "../../components/board/BoardList";
import Header from "../../components/header/Header";
import SideBarAtGroup from "../../components/sidebar/SidebarAtGroup";
import SideBarAtRoom from "../../components/sidebar/SidebarAtRoom";
import InBoard from "../../components/board/InBoard";

const BoardDetail = () => {
  const location = useLocation();
  // const { group_id } = useParams();
  // const { room_id } = useParams();
  // const group_name = location.state.group_name;
  // const groups = location.state.groups;
  const { board_id } = useParams();
  // const { board_id } = location.state.board_id;
  const { type } = useTypeStore();
  const { storeGroups, setStoreGroups, setGroupId, group_id, group_name } =
    useGroupsStore();
  const { storeRooms, setStoreRooms, setRoomId, room_id, room_name } =
    useRoomsStore();
  console.log(storeGroups);
  useEffect(() => {
    let groups = storeGroups;
  }, []);
  return (
    <>
      <Box sx={{ display: "flex" }}>
        {type === "group" ? (
          <>
            <Header />
            <SideBarAtGroup
              group_id={group_id}
              group_name={group_name}
              groups={storeGroups}
            />
          </>
        ) : (
          <>
            <Header />
            <SideBarAtRoom
              room_name={room_name}
              rooms={storeRooms}
              group_id={group_id}
              groups={storeGroups}
            />
          </>
        )}
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />

          <Grid container alignItems="center">
            <BoardList />
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
      <InBoard board_id={board_id}></InBoard>
    </>
  );
};

export default BoardDetail;
