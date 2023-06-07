import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
// import * as StompJs from "@stomp/stompjs";

import { Box, Divider, Grid, Toolbar } from "@mui/material";

import SideBarAtHome from "../../components/sidebar/SidebarAtHome";
import ChatListArea from "../../components/chat/ChatListArea";
import Header from "../../components/header/Header";
import InDM from "../../components/chat/InDM";
import { api } from "../../api/Interceptors";

// const StyleDMWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;
// const StyleForm = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: space-between;
// `;

// const MyInputBlock = styled.div`
//   display: flex;
// `;
// const MyInput = styled.input`
//   width: 300px;
//   height: 50px;
//   background-color: #fcfcfc;
//   border: 1px solid #dee2e6;
//   border-radius: 4px;
//   padding: 0 12px;
//   font-size: 16px;
//   &:focus {
//     outline: none;
//     border-color: #f5b66c;
//   }
// `;
// const Wrapper = styled.div`
//   text-align: center;
// `;
// const Button = styled.button`
//   width: 50px;
//   height: 30px;
//   color: white;
//   border: none;
//   border-radius: 10px;
//   background-color: #f5b66c;
//   font-size: 15px;
//   font-weight: bold;

//   margin: auto;
//   :hover {
//     cursor: pointer;
//   }
//   margin: 15px;
// `;

const ChatDetail = () => {
  const { dm_id } = useParams();
  const location = useLocation();
  // const dmID = location.state.dmID;
  const dmName = location.state.dmName;
  // const chatList = location.state.chatList;

  useEffect(() => {
    // 페이지가 렌더링 될 때 채팅 목록 불러오기
    // api
    //   .get("/chat/chatlist")
    //   .then((response) => {
    //     localStorage.setItem("chatList", response.data);
    //     //response안 어디에 보내주는지 백엔드에 물어보고 수정할 것
    //     setChatList(response.data);
    //     console.log(response);
    //   })
    //   .catch((err) => console.log(err));
  }, []);

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

          <Grid container alignItems="center">
            <ChatListArea />

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: "DarkGrey",
              }}
            />

            {/* 선택된 채팅방 내용 */}
          </Grid>
        </Box>
      </Box>
      <InDM dmName={dmName} />
    </div>
  );
};

export default ChatDetail;
