import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  TextField,
  List,
  ListItem,
  Divider,
  ListItemText,
} from "@mui/material";

import { api } from "../../api/Interceptors";
import { useNavigate, useParams } from "react-router-dom";
import { useGroupsStore, useRoomsStore, useTypeStore } from "../../store/Store";
import BoardDetail from "../../pages/board/BoardDetail";
import ModalBoardCreate from "./ModalBoardCreate";

const MyListItem = styled(ListItem)`
  &:hover {
    cursor: pointer;
  }
  &.selected {
    background-color: rgba(245, 182, 108, 0.2);
  }
  font-family: "Inter", sans-serif;
`;

const BoardList = () => {
  //   const boardList = {
  //     notices: [{ id: "1", title: "공지글1", content: "공지합니다", date: "" }],
  //     notes: [{ id: "2", title: "게시판글1", content: "게시내용", date: "" }],
  //   };
  let type = localStorage.getItem("type");
  let type_id =
    type == "group"
      ? localStorage.getItem("group_id")
      : localStorage.getItem("room_id");
  let board_id;
  const [boardNotice, setBoardNotice] = useState([]);
  const [boardNote, setBoardNote] = useState([]);
  let { setTypeGroup, setTypeRoom } = useTypeStore();
  const { storeGroups, setStoreGroups, setGroupId, group_id, group_name } =
    useGroupsStore();
  const { storeRooms, setStoreRooms, setRoomId, room_id, room_name } =
    useRoomsStore();

  // const { board_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/note/${type}/${type_id}/notelist`)
      .then((response) => {
        console.log(response);
        setBoardNotice(response.data.notices);
        setBoardNote(response.data.notes);
      })
      .catch((err) => console.log(err));
  }, [board_id]);
  return (
    <>
      <List
        sx={{
          width: "100%",
          maxWidth: 300,
          bgcolor: "background.paper",
        }}
      >
        <ModalBoardCreate />
        {/* <Divider
          sx={{
            borderColor: "DarkGrey",
          }}
        /> */}
        <TextField
          // id="standard-search"
          label="게시글을 검색하세요"
          type="search"
          variant="standard"
          size="small"
          onChange={(e) => {}}
        />
        {/* 게시판 공지글 나열 시작 */}
        {boardNote.length === 0 && boardNotice.length === 0 ? (
          <>
            <p
              style={{
                marginTop: 200,
                padding: 40,
                marginRight: 20,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              게시글이 없습니다
            </p>
            <h1 style={{ visibility: "hidden" }}>
              <br />
              <br />
              <br />
              <br />
            </h1>
          </>
        ) : (
          <>
            <List>
              {boardNotice.map((v, i) => (
                <List key={v.id}>
                  <MyListItem
                    alignItems="flex-start"
                    // 클릭하면 id 넘겨주기
                    onClick={() =>
                      navigate(`/${type}/${type_id}/board/${v.id}`, {
                        state: { board_id: v.id },
                      })
                    }
                    className={board_id === v.id ? "selected" : ""}
                  >
                    <ListItemText
                      primaryTypographyProps={{ fontWeight: "bold" }}
                      secondaryTypographyProps={{ fontWeight: "bold" }}
                      primary={v.title}
                      secondary={v.content.slice(0, 10)}
                    />
                  </MyListItem>
                  <Divider
                    sx={{
                      borderColor: "grey",
                    }}
                  />
                </List>
              ))}
            </List>
            {/* 게시판 일반 글 나열  */}
            <List>
              {boardNote.map((v, i) => (
                <List key={v.id}>
                  <MyListItem
                    alignItems="flex-start"
                    // 클릭하면 id 넘겨주기
                    onClick={() =>
                      navigate(`/${type}/${type_id}/board/${v.id}`)
                    }
                    className={board_id === v.id ? "selected" : ""}
                  >
                    <ListItemText
                      primary={v.title}
                      secondary={v.content.slice(0, 10)}
                    />
                  </MyListItem>
                  <Divider
                    sx={{
                      borderColor: "grey",
                    }}
                  />
                </List>
              ))}
            </List>
          </>
        )}
      </List>
      {/* <BoardDetail></BoardDetail> */}
    </>
  );
};

export default BoardList;
