import React from "react";
import { useState } from "react";
import styled from "styled-components";

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
};

const Wrapper = styled.div`
  text-align: center;
`;
const Button = styled.button`
  width: 200px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background-color: #f5b66c;
  font-size: 15px;
  font-weight: bold;
  margin: auto;
  margin-bottom: 10px;
  :hover {
    cursor: pointer;
  }
`;

const ModalInviteGroup = (props) => {
  const { group_id } = props;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inviteEmail, setInviteEmail] = useState("");
  //   const email = useSelector((state) => state.user.email);

  const InviteGroup = async (e) => {
    e.preventDefault();

    await api
      .post(`/${group_id}/invitegroup`, { email: inviteEmail })
      .then((response) => {
        console.log(response);
        if (response.status === 200)
          alert(`${inviteEmail} 님을 초대하였습니다.`);

        handleClose();
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 409) alert("이미 초대된 사용자입니다.");
      });
  };

  return (
    <div>
      <Wrapper>
        <Button onClick={handleOpen}>
          초대하기
          {/* <AddIcon /> */}
        </Button>
      </Wrapper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onSubmit={InviteGroup}>
          <h2 style={{ textAlign: "center" }}>그룹에 사용자 초대</h2>
          <form>
            초대 이메일
            <InputTextInModal
              type="text"
              label="초대자 이메일"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <p style={{ textAlign: "center" }}>
              <BtnInModal type="submit" value="초대하기" />
            </p>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default ModalInviteGroup;
