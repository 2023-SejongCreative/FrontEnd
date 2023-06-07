import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import Divider from "@mui/material/Divider";
// import ListItemText from "@mui/material/ListItemText";
import {
  TextField,
  List,
  ListItem,
  Divider,
  ListItemText,
} from "@mui/material";

import ModalDmCreate from "./ModalDmCreate";
import styled from "styled-components";
import InDM from "./InDM";
import { api } from "../../api/Interceptors";

const MyListItem = styled(ListItem)`
  &:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: rgba(245, 182, 108, 0.2);
  }
  font-family: "Acme", sans-serif;
`;
const ChatListArea = (props) => {
  const navigate = useNavigate();
  const { dm_id } = useParams();
  const [chatList, setChatList] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    // 페이지가 렌더링 될 때 채팅 목록 불러오는 함수 호출
    getChatList();
  }, [dm_id]);

  const getChatList = async () => {
    api
      .get("/chat/chatlist")
      .then((response) => {
        // localStorage.setItem("chatList", response.dms);
        //response안 어디에 보내주는지 백엔드에 물어보고 수정할 것
        setChatList(response.data.dms);
        console.log(response);
      })
      .catch((err) => console.log(err));
  };

  const moveDMRoom = (dmID, dmName) => {
    navigate(`/chat/${dmID}`, {
      state: { chatList: chatList, dmID: dmID, dmName: dmName },
    });
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 300,
          bgcolor: "background.paper",
        }}
      >
        <ModalDmCreate />

        {/* <Divider
          sx={{
            borderColor: "DarkGrey",
          }}
        /> */}
        <TextField
          // id="standard-search"
          label="채팅방을 검색하세요"
          type="search"
          variant="standard"
          size="small"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
        {/* 채팅 리스트들 나열 시작 */}
        {chatList.length === 0 ? (
          <>
            <p
              style={{
                marginTop: 200,
                padding: 40,
                textAlign: "center",
                fontSize: 20,
                marginRight: 20,
              }}
            >
              채팅방을 생성하세요
            </p>
            <h1 style={{ visibility: "hidden" }}>
              <br />
              <br />
              <br />
              <br />
            </h1>
          </>
        ) : (
          <List>
            {chatList.map((v, i) => (
              <List key={v.id}>
                <MyListItem
                  alignItems="flex-start"
                  // 클릭하면 dm id 넘겨주기
                  onClick={() => moveDMRoom(v.id, v.name)}
                  className={dm_id == v.id ? "selected" : ""}
                >
                  <ListItemText primary={v.name} secondary={v.last_chat} />
                </MyListItem>
                <Divider
                  sx={{
                    borderColor: "grey",
                  }}
                />
              </List>
            ))}
          </List>
        )}
      </List>
      {/* 이렇게 안 하고 dmDetail페이지를 만들어서 페이지 이동? */}
      {/* <InDM /> */}
    </>
  );
};

export default ChatListArea;
