import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { InputTextInModal } from "../commons/InputInModal";
import { api } from "../../api/Interceptors";
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
  :hover {
    cursor: pointer;
  }
  position: fixed;
  bottom: 70px;
  left: 20px;
`;

const ModalGroup = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [group_name, setGroup_name] = useState("");
  const email = localStorage.getItem("email");
  const groups = props.groups;

  const createGroupRoom = async (e) => {
    e.preventDefault();
    let body = {
      group_name: group_name,
      email: email,
    };
    await api
      .post("/creategroup", body)
      .then((response) => {
        console.log(response);
        let group_id = response.data;
        handleClose();
        // navigate(`/group/${group_id}`, {
        //   state: { groups: groups, group_name: group_name },
        // });
        navigate("/");
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Wrapper>
        <Button onClick={handleOpen}>
          + &nbsp;Group Create
          {/* <AddIcon /> */}
        </Button>
      </Wrapper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onSubmit={createGroupRoom}>
          <h2 style={{ textAlign: "center" }}>그룹 생성</h2>
          <form>
            그룹 이름 :{" "}
            <InputTextInModal
              type="text"
              label="그룹 이름"
              value={group_name}
              onChange={(e) => setGroup_name(e.target.value)}
            />
            <p style={{ textAlign: "center" }}>
              <BtnInModal type="submit" value="생성" />
            </p>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default ModalGroup;
