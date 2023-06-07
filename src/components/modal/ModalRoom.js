import React from "react";
import { useState } from "react";
import styled from "styled-components";
// import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { api } from "../../api/Interceptors";
import { InputTextInModal, InputCheckInModal } from "../commons/InputInModal";
import { BtnInModal } from "../commons/BtnInModal";
import { StyleRadio, StyleLabel } from "../../components/plan/ModalPlan";

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
  :hover {
    cursor: pointer;
  }
`;

const ModalRoom = (props) => {
  const { group_id } = props;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [room_name, setRoom_name] = useState("");
  const [type, setType] = useState(1);

  const createRoom = async (e) => {
    e.preventDefault();

    let body = {
      room_name: room_name,
      type: type,
    };

    await api
      .post(`/${group_id}/createroom`, body)
      .then((response) => {
        console.log(response);
        let room_id = response.data;
        console.log(room_id);
        // navigate(`/room/${room_id}`, {
        //   state: { group_id: group_id, room_name: room_name },
        // });
        handleClose();
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Wrapper>
        <Button onClick={handleOpen}>
          + &nbsp;Room Create
          {/* <AddIcon /> */}
        </Button>
      </Wrapper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onSubmit={createRoom}>
          <h2 style={{ textAlign: "center" }}>룸 생성</h2>
          <form>
            룸 이름 :{" "}
            <InputTextInModal
              type="text"
              label="룸 이름"
              value={room_name}
              onChange={(e) => setRoom_name(e.target.value)}
            />
            <div style={{ textAlign: "center", margin: 15 }}>
              <StyleLabel>
                <StyleRadio
                  type="radio"
                  name="공개여부"
                  value="1"
                  checked
                  onClick={() => setType(1)}
                />
                public
              </StyleLabel>
              <StyleLabel>
                <StyleRadio
                  type="radio"
                  name="공개여부"
                  value="0"
                  onClick={() => setType(0)}
                />
                private
              </StyleLabel>
            </div>
            <p style={{ textAlign: "center" }}>
              <BtnInModal type="submit" value="생성" />
            </p>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default ModalRoom;
