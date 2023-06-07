import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import ModalInviteRoom from "../modal/ModalInviteRoom";
import { api } from "../../api/Interceptors";
import {
  useGroupsStore,
  useHeaderMenuStore,
  useRoomsStore,
  useTypeStore,
} from "../../store/Store";
import { StyleMySpace } from "./SidebarAtHome";
import WaffleLogo from "../../assets/Waffle Logo.png";

export const MyTitle = styled.h1`
  margin: 0;
  padding: 8px;
  text-align: center;
  cursor: pointer;
`;
const BtnWrapper = styled.div`
  text-align: center;
`;
const MyListItem = styled(ListItem)`
  &:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: rgba(245, 182, 108, 0.2);
  }
`;
const MyList = styled(List)`
  &.show {
    transition: opacity 0.2s linear;
    transform: translate(0);
    opacity: 1;
    z-index: 1;
  }
  &.hide {
    transition: all 0.2s linear;
    transform: translateY(-9999px);
    opacity: 0;
  }
`;
const DeleteBtn = styled.div`
  width: 200px;
  height: 50px;
  border-radius: 10px;
  border: none;
  color: white;
  background-color: #f5b66c;
  font-size: 20px;
  font-weight: bold;
  margin: auto;
  align-items: center;
  :hover {
    cursor: pointer;
  }
  padding-top: 10px;
  margin-top: 10px;
`;
const LogoutBtn = styled.button`
  width: 200px;
  height: 40px;
  border: solid 1px #f5b66c;
  background-color: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
  margin: auto;
  :hover {
    cursor: pointer;
  }
  margin-top: 10px;
`;
const drawerWidth = 240;

const SidebarAtRoom = (props) => {
  const [IsOpen, setIsOpen] = useState(false);
  const { setTypeGroup, setTypeRoom, setTypeHome } = useTypeStore();
  const { setStoreRooms, setRoomId } = useRoomsStore();
  const { storeGroups, setStoreGroups, setGroupId } = useGroupsStore();
  const { setHeaderMenu } = useHeaderMenuStore();
  const { room_id } = useParams();
  const { room_name, rooms, group_id, groups } = props;

  const navigate = useNavigate();
  useEffect(() => {
    setTypeRoom(room_id);
  }, []);

  const DeleteRoom = async () => {
    // let index;
    // rooms.forEach((v, i) => {
    //   if (v.room_id === room_id) index = i;
    // });
    // if (rooms[index].manager != 1) alert("관리자만 삭제할 수 있습니다.");
    // else {
    if (window.confirm(`${room_name} 룸을 삭제하시겠습니까?`)) {
      await api
        .delete(`/${room_id}/deleteroom`)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            alert("룸 삭제가 완료되었습니다.");
            navigate("/");
            setHeaderMenu("plan");
          } else alert("관리자가 아닙니다!");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400) alert("관리자가 아닙니다!");
        });
    } else {
      alert("룸 삭제를 취소하셨습니다.");
    }
    // }
  };

  const Logout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      api
        .post(
          "/",
          {},
          {
            headers: {
              access_token: localStorage.getItem("jwt_accessToken"),
              refresh_token: localStorage.getItem("jwt_refreshToken"),
            },
          }
        )
        .then((response) => {
          console.log(response);
          localStorage.removeItem("jwt_accessToken");
          localStorage.removeItem("jwt_refreshToken");
          localStorage.setItem("isLogined", false);
          alert("로그아웃 성공! 다음에 또 만나요❤️");
          navigate("/login");
        })
        .catch((err) => console.log(err));
    }
  };
  const moveGroupPage = async (group_name, group_id) => {
    setGroupId(group_id, group_name);
    localStorage.setItem("type", "group");
    localStorage.setItem("group_name", group_name);
    localStorage.setItem("group_id", group_id);
    setHeaderMenu("plan");
    navigate(`/group/${group_id}`, {
      state: { groups: groups, group_name: group_name },
    });
  };
  const moveRoomPage = async (room_name, room_id) => {
    setRoomId(room_id, room_name);
    localStorage.setItem("type", "room");
    localStorage.setItem("room_name", room_name);
    localStorage.setItem("room_id", room_id);
    setHeaderMenu("plan");
    navigate(`/room/${room_id}`, {
      state: {
        rooms: rooms,
        room_name: room_name,
        group_id: group_id,
        groups: groups,
      },
    });
  };
  const moveHome = () => {
    navigate("/");
    setHeaderMenu("plan");
    setTypeHome();
    localStorage.setItem("type", "home");
  };
  return (
    <div>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <MyTitle onClick={moveHome}>
          <img src={WaffleLogo} alt="Waffle" width={130} />
        </MyTitle>
        <Divider />
        <StyleMySpace onClick={() => setIsOpen(!IsOpen)}>
          <span>{localStorage.getItem("group_name")}</span>
          <span style={{ margin: 10 }}>
            {IsOpen ? (
              <BsChevronUp></BsChevronUp>
            ) : (
              <BsChevronDown></BsChevronDown>
            )}
          </span>
        </StyleMySpace>

        <MyList className={IsOpen ? "show" : "hide"}>
          {groups.length !== 0
            ? groups.map((v, index) => (
                <MyListItem
                  key={v.group_id}
                  className={group_id == v.group_id ? "selected" : ""}
                >
                  <ListItemButton
                    onClick={() => moveGroupPage(v.group_name, v.group_id)}
                  >
                    <ListItemText primary={v.group_name} />
                  </ListItemButton>
                </MyListItem>
              ))
            : storeGroups.map((v, index) => (
                <MyListItem
                  key={v.group_id}
                  className={group_id == v.group_id ? "selected" : ""}
                >
                  <ListItemButton
                    onClick={() => moveGroupPage(v.group_name, v.group_id)}
                  >
                    <ListItemText primary={v.group_name} />
                  </ListItemButton>
                </MyListItem>
              ))}
        </MyList>
        <Divider />

        <List>
          {/* <div onClick={() => navigate(`/room/${room_id}`)}>{room_name}</div> */}
          {rooms &&
            rooms.map((v, index) => (
              <MyListItem
                key={v.room_id}
                className={room_id == v.room_id ? "selected" : ""}
              >
                <ListItemButton
                  onClick={() => moveRoomPage(v.room_name, v.room_id)}
                >
                  <ListItemText primary={v.room_name} />
                </ListItemButton>
              </MyListItem>
            ))}
        </List>
        <BtnWrapper>
          <ModalInviteRoom room_id={room_id} />
          <DeleteBtn onClick={DeleteRoom}>-&nbsp;Room Delete</DeleteBtn>
          <LogoutBtn onClick={Logout}>Logout</LogoutBtn>
        </BtnWrapper>
      </Drawer>
    </div>
  );
};

export default SidebarAtRoom;
