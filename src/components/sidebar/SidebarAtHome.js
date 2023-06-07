import React, { useEffect, useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

import { api } from "../../api/Interceptors";
import ModalCreate from "../modal/ModalGroup";
import {
  useGroupsStore,
  useHeaderMenuStore,
  useTypeStore,
} from "../../store/Store";
import WaffleLogo from "../../assets/Waffle Logo.png";

export const MyTitle = styled.h1`
  /* margin */
  margin: 0px;
  padding: 8px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
`;
const BtnWrapper = styled.div`
  text-align: center;
  position: fixed;
  bottom: 20px;
  left: 20px;
`;
export const StyleMySpace = styled.span`
  text-align: center;
  font-size: 22px;
  margin: 15px 15px 0 15px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 10px;
  :hover {
    cursor: pointer;
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

const SideBarAtHome = (props) => {
  let { setStoreGroups, storeGroups, setGroupId } = useGroupsStore();
  let { setTypeGroup, setTypeHome } = useTypeStore();
  const { setHeaderMenu } = useHeaderMenuStore();
  const [groups, setGroups] = useState([]);
  const [IsOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getGroups();
  }, []);

  const getGroups = async () => {
    const user_email = localStorage.getItem("email");
    await api
      .get(`/${user_email}/groups`, {
        headers: {
          access_token: localStorage.getItem("jwt_accessToken"),
        },
      })
      .then((response) => {
        console.log(response);
        setGroups(response.data.groups);
        setStoreGroups(response.data.groups);
      })
      .catch((err) => console.log(err));
  };
  console.log(storeGroups);

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
          setTypeHome();
        })
        .catch((err) => console.log(err));
    }
  };
  const moveGroupPage = (group_name, group_id) => {
    setTypeGroup(group_id);
    localStorage.setItem("type", "group");
    localStorage.setItem("group_id", group_id);
    localStorage.setItem("group_name", group_name);
    setGroupId(group_id, group_name);
    setHeaderMenu("plan");
    navigate(`/group/${group_id}`, {
      state: { group_name: group_name, groups: groups },
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
          <span>My space</span>
          <span style={{ margin: 10 }}>
            {IsOpen ? (
              <BsChevronUp></BsChevronUp>
            ) : (
              <BsChevronDown></BsChevronDown>
            )}
          </span>
        </StyleMySpace>
        <MyList className={IsOpen ? "show" : "hide"}>
          {groups.map((v, index) => (
            <ListItem
              key={v.group_id}
              onClick={() => {
                moveGroupPage(v.group_name, v.group_id);
              }}
            >
              <ListItemButton>
                <ListItemText primary={v.group_name} />
              </ListItemButton>
            </ListItem>
          ))}
        </MyList>
        <ModalCreate groups={groups} />
        <BtnWrapper>
          <LogoutBtn onClick={Logout}>Logout</LogoutBtn>
        </BtnWrapper>
      </Drawer>
    </div>
  );
};

export default SideBarAtHome;
