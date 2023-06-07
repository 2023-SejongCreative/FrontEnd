import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { api } from "../../api/Interceptors";
import { InputTextInModal, InputCheckInModal } from "../commons/InputInModal";
import { BtnInModal } from "../commons/BtnInModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
  alignItem: "center",
  justifyContent: "center",
};

const Button = styled.button`
  width: 80px;
  height: 30px;
  border: none;
  border-radius: 5px;
  background-color: antiquewhite;
  :hover {
    cursor: pointer;
  }
  font-weight: bold;
  margin: 10px;
`;

const ModalProfileUpdate = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  //진행 중인 프로젝트 생성하는 함수
  const profileProjectCreate = async (e) => {
    e.preventDefault();
    let body = {
      title: title,
      detail: detail,
    };
    if (title.length === 0) alert("Title을 입력해주세요");
    else {
      await api
        .post("/profile/content/create", body)
        .then((response) => {
          console.log(response);
          handleClose();
          navigate("/myprofile");
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <h3 onClick={handleOpen} style={{ margin: 0 }}>
        +
      </h3>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onSubmit={profileProjectCreate}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            프로젝트 정보 생성
          </Typography>
          <form>
            <div>
              Title : &nbsp;
              <InputTextInModal
                type="text"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              Content : &nbsp;
              <InputTextInModal
                type="text"
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
            <p style={{ textAlign: "center" }}>
              <BtnInModal type="submit" value="제출" />
            </p>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default ModalProfileUpdate;
