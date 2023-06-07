import React, { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import { api } from "../../api/Interceptors";
import DefaultImage from "../../assets/DefaultImage.png";
import { StyleOtherName } from "../chat/DmMiniBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
  alignItem: "center",
  justifyContent: "center",
  textAlign: "center",
};
const StyleViewImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 70%;
  overflow: hidden;
  object-fit: cover;
`;
const ButtonInDM = styled.button`
  width: 30px;
  height: 30px;
  color: #f2c8a1;
  border: solid 1px #f2c8a1;
  border-radius: 50%;
  background-color: white;
  font-size: 24px;

  margin: auto;
  :hover {
    cursor: pointer;
  }
  margin: 5px;
`;
const StyleProjectCard = styled.div`
  width: 300px;
  height: 120px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
`;

const ProjectWrapper = styled.div`
  display: flex;
  flex-wrap: wrap; // 복수의 행
`;

const ModalOtherProfile = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [otherProfile, setOtherProfile] = useState();
  const { other } = props;

  const getOtherProfile = async () => {
    await api
      .get(`/profile/other/${other.id}`)
      .then((response) => {
        console.log(response);
        setOtherProfile(response.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getOtherProfile();
  }, [other]);

  return (
    <div>
      <StyleOtherName onClick={handleOpen} style={{ margin: 0 }}>
        {props.other.name} &nbsp;
      </StyleOtherName>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2"> */}
          <h2>{otherProfile && otherProfile.name}의 프로필</h2>
          {/* </Typography> */}
          <StyleViewImg
            width={"200px"}
            src={
              otherProfile && otherProfile.img ? otherProfile.img : DefaultImage
            }
          />
          <div>{otherProfile && otherProfile.introduction}</div>
          <h3>Ongoing Project</h3>
          {otherProfile && otherProfile.content.length === 0 ? (
            "등록된 프로젝트가 없습니다."
          ) : (
            <>
              <ProjectWrapper
                style={{ width: 760, height: 190, overflow: "scroll" }}
              >
                {otherProfile !== undefined &&
                  otherProfile.content.map((v, i) => (
                    <StyleProjectCard>
                      <h3 style={{ margin: 10 }}>
                        {/* {otherProfile && otherProfile.content.title} */}
                        {v.title}
                      </h3>
                      {/* <p>{otherProfile && otherProfile.content.detail}</p> */}
                      <p>{v.detail}</p>
                    </StyleProjectCard>
                  ))}
              </ProjectWrapper>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};
export default ModalOtherProfile;
