import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import ModalInviteGroup from "../modal/ModalInviteGroup";
import ModalRoom from "../modal/ModalRoom";
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
const MyListItem = styled(ListItem)`
  &:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: rgba(245, 182, 108, 0.2);
  }
`;

const DeleteBtn = styled.div`
  width: 200px;
  height: 40px;
  border-radius: 10px;
  border: none;
  color: white;
  background-color: #f5b66c;
  font-size: 15px;
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
  border-radius: 10px;
  border: solid 1px #f5b66c;
  background-color: white;
  font-size: 15px;
  font-weight: bold;
  margin: auto;
  :hover {
    cursor: pointer;
  }
  margin-top: 10px;
`;
const drawerWidth = 240;

const SideBarAtGroup = (props) => {
  const [IsOpen, setIsOpen] = useState(false);
  const { setStoreGroups, setGroupId, storeGroups } = useGroupsStore();
  const { setStoreRooms, setRoomId } = useRoomsStore();
  const { setTypeGroup, setTypeRoom, setTypeHome } = useTypeStore();
  const { setHeaderMenu } = useHeaderMenuStore();
  const { group_id } = useParams();
  const { group_name, groups } = props;
  const [rooms, setRooms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setTypeGroup(group_id, group_name);
    setGroupId(group_id, group_name);
    setStoreGroups(groups);
    //여기서 현재 들어와있는 그룹 name 보여주기(약간 myspace처럼)
    getRooms();
  }, [group_id]);

  const getRooms = async () => {
    //룸 목록 요청 api
    await api
      .get(`/${group_id}/rooms`)
      .then((response) => {
        console.log(response);
        setRooms(response.data.room);
        setStoreRooms(response.data.room);
      })
      .catch((err) => console.log(err));
  };

  const DeleteGroup = async () => {
    let index;
    groups.forEach((v, i) => {
      if (v.group_id == group_id) index = i;
    });
    if (groups[index].manager !== 1) {
      alert("관리자만 삭제할 수 있습니다.");
    } else {
      if (window.confirm(`${group_name} 그룹을 삭제하시겠습니까?`)) {
        await api
          .delete(`/${group_id}/deletegroup`)
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              alert("그룹 삭제가 완료되었습니다.");
              setHeaderMenu("plan");
              navigate("/");
            } else alert("관리자가 아닙니다!");
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 400) alert("관리자가 아닙니다!");
          });
      } else {
        alert("룸 삭제를 취소하셨습니다.");
      }
    }
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
          setHeaderMenu("plan");
        })
        .catch((err) => console.log(err));
    }
  };
  const moveGroupPage = async (group_name, group_id) => {
    setGroupId(group_id, group_name);
    localStorage.setItem("group_name", group_name);
    localStorage.setItem("group_id", group_id);
    setHeaderMenu("plan");
    navigate(`/group/${group_id}`, {
      state: { groups: groups, group_name: group_name },
    });
    // window.location.reload();
  };
  const moveRoomPage = async (room_name, room_id) => {
    setRoomId(room_id, room_name);
    setHeaderMenu("plan");
    navigate(`/room/${room_id}`, {
      state: {
        rooms: rooms,
        room_name: room_name,
        group_id: group_id,
        groups: groups,
        // groupNames: groupNames,
      },
    });
    // window.location.reload();
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
          {rooms.map((v, index) => (
            <ListItem key={v.room_id}>
              <ListItemButton
                onClick={() => moveRoomPage(v.room_name, v.room_id)}
              >
                <ListItemText primary={v.room_name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <BtnWrapper>
          <ModalInviteGroup group_id={group_id} />
        </BtnWrapper>
        <ModalRoom
          group_id={group_id}
          groups={groups}
          rooms={rooms}
          // groupNames={groupNames}
        />
        <BtnWrapper>
          <DeleteBtn onClick={DeleteGroup}>-&nbsp;Group Delete</DeleteBtn>
          <LogoutBtn onClick={Logout}>Logout</LogoutBtn>
        </BtnWrapper>
      </Drawer>
    </div>
  );
};

export default SideBarAtGroup;
