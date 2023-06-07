import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import { Toolbar, CssBaseline, AppBar } from "@mui/material";

import {
  useGroupsStore,
  useHeaderMenuStore,
  useRoomsStore,
  useTypeStore,
} from "../../store/Store";

import DefaultImage from "../../assets/DefaultImage.png";

export const MyToolbar = styled(Toolbar)`
  background-color: white;
`;
const StyleViewImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 70%;
  overflow: hidden;
  object-fit: cover;
  cursor: pointer;
  position: fixed;
  top: 15px;
  right: 15px;
`;
export const HeaderBtn = styled.button`
  margin: 0;
  padding: 20px;
  font-size: 20px;
  border: none;
  background-color: white;
  /*color,font-size */
  color: black;
  cursor: pointer;
  :hover {
    background-color: rgba(245, 182, 108, 0.1);
  }
  ::after {
    background-color: rgba(245, 182, 108, 0.1);
  }
  &.selected {
    background-color: rgba(245, 182, 108, 0.3);
  }
  font-family: "Inter", sans-serif;
`;
export const MyTitle = styled.h1`
  margin: 0;
  /* padding: 8px; */
  text-align: center;
  cursor: pointer;
`;
const drawerWidth = 240;

const Header = () => {
  const navigate = useNavigate();
  // const { type, type_name } = useTypeStore();
  // const type_id = useParams();
  const type = localStorage.getItem("type");
  const type_id =
    type == "group"
      ? localStorage.getItem("group_id")
      : localStorage.getItem("room_id");

  const { setHeaderMenu, headerMenu } = useHeaderMenuStore();
  const { storeGroups, group_id, group_name } = useGroupsStore();
  const { storeRooms, room_id, room_name } = useRoomsStore();
  const moveChat = () => {
    setHeaderMenu("chat");
    navigate("/chat");
  };
  const movetoBoard = () => {
    setHeaderMenu("board");
    let id = type === "group" ? group_id : room_id;
    let name = type === "group" ? group_name : room_name;
    navigate(`/${type}/${id}/board`, {
      state: { type_name: name, groups: storeGroups, rooms: storeRooms },
    });
  };
  const moveProfile = () => {
    setHeaderMenu("profile");
    navigate("/myprofile");
  };
  const movePlan = () => {
    setHeaderMenu("plan");
    navigate(`/`);
  };
  const movePlanInGroupRoom = () => {
    setHeaderMenu("plan");
    navigate(`/${type}/${type_id}`, {
      state: { groups: storeGroups },
    });
  };
  return (
    <div>
      {" "}
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <MyToolbar>
          {type === "home" ? (
            <>
              <HeaderBtn
                id="일정"
                onClick={movePlan}
                className={headerMenu === "plan" ? "selected" : ""}
              >
                일정
              </HeaderBtn>
              <HeaderBtn
                id="프로필"
                onClick={moveProfile}
                className={headerMenu === "profile" ? "selected" : ""}
              >
                프로필
              </HeaderBtn>
              <HeaderBtn
                id="채팅"
                onClick={moveChat}
                className={headerMenu === "chat" ? "selected" : ""}
              >
                채팅
              </HeaderBtn>
            </>
          ) : (
            <>
              <HeaderBtn
                id="일정"
                onClick={movePlanInGroupRoom}
                className={headerMenu === "plan" ? "selected" : ""}
              >
                일정
              </HeaderBtn>
              <HeaderBtn
                id="게시판"
                onClick={movetoBoard}
                className={headerMenu === "board" ? "selected" : ""}
              >
                게시판
              </HeaderBtn>
              <HeaderBtn
                id="프로필"
                onClick={moveProfile}
                className={headerMenu === "profile" ? "selected" : ""}
              >
                프로필
              </HeaderBtn>
              <HeaderBtn
                id="채팅"
                onClick={moveChat}
                className={headerMenu === "chat" ? "selected" : ""}
              >
                채팅
              </HeaderBtn>
            </>
          )}
          {/* <p style={{ textAlign: "right" }}> */}
          <StyleViewImg src={DefaultImage} onClick={moveProfile} />
          {/* </p> */}
        </MyToolbar>
      </AppBar>
    </div>
  );
};

export default Header;
