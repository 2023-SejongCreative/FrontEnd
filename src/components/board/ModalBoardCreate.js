import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { api } from "../../api/Interceptors";
import { useTypeStore } from "../../store/Store";
import { useGroupsStore } from "../../store/Store";
import { useRoomsStore } from "../../store/Store";
import { BtnInModal } from "../commons/BtnInModal";
import { InputTextInModal, InputCheckInModal } from "../commons/InputInModal";
import { StyleTextArea } from "../../components/profile/MyData";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const Wrapper = styled.div`
  text-align: center;
`;
export const Button = styled.button`
  width: 30px;
  height: 30px;
  color: white;
  border: none;
  border-radius: 50%;
  background-color: #f2c8a1;
  font-size: 20px;
  font-weight: bold;
  margin: auto;
  :hover {
    cursor: pointer;
  }
  margin: 15px;
`;
const createInput = styled.input`
  margin: 10px;
`;

const ModalBoardCreate = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  let { type, type_id, setTypeGroup, setTypeRoom } = useTypeStore();
  const { group_id } = useGroupsStore();
  const { room_id } = useRoomsStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noticeOrNot, setNoticeOrNot] = useState(false);

  // if (type === "group") type_id = group_id;
  // else type_id = room_id;
  let today = new Date();

  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let day = ("0" + today.getDate()).slice(-2);
  let date = year + "-" + month + "-" + day;
  console.log(date);

  useEffect(() => {
    console.log(localStorage.getItem("type"));
    localStorage.getItem("type") == "group"
      ? setTypeGroup(group_id)
      : setTypeRoom(room_id);
  }, []);
  const createBoard = (e) => {
    e.preventDefault();

    let body = {
      title: title,
      content: content,
      date: date,
      notice: noticeOrNot === true ? "0" : "1",
    };
    if (title.length === 0) alert("Title은 필수 입력입니다.");
    else {
      api
        .post(`/note/${type}/${type_id}/create`, body)
        .then((response) => {
          console.log(response);
          if (response.status === 200) {
            handleClose();
            console.log(type, type_id, response.data);
            navigate(`/${type}/${type_id}/board/${response.data}`);
          } else alert("게시글 생성에 실패하였습니다.");
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400)
            alert("관리자만 공지글을 생성할 수 있습니다.");
        });
    }
  };
  return (
    <div>
      <Button onClick={handleOpen}>+</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onSubmit={createBoard}>
          <h2 style={{ textAlign: "center" }}>게시글 생성</h2>
          <form>
            <div>
              게시글 제목 :
              <InputTextInModal
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <div>게시글 내용:</div>
              <StyleTextArea
                name="content"
                cols="68"
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ borderColor: "grey" }}
              ></StyleTextArea>
            </div>
            <div style={{ textAlign: "center" }}>
              공지글인가요?
              <InputCheckInModal
                type="checkbox"
                value={noticeOrNot}
                onClick={() => setNoticeOrNot(!noticeOrNot)}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <BtnInModal value="생성하기" />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default ModalBoardCreate;
