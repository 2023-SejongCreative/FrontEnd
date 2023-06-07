import React from "react";
import styled from "styled-components";

import { Box, Card, CardContent, Typography } from "@mui/material";

import ModalOtherProfile from "../commons/ModalOtherProfile";

const MessageBox = styled(Card)`
  height: 40px;
`;
export const StyleOtherName = styled.p`
  font-weight: bold;
  margin: 5px;
  :hover {
    cursor: pointer;
  }
`;

const DmMiniBox = ({ user_name, user_email, time, content }) => {
  let isUser = localStorage.getItem("email") === user_email;
  const color = isUser ? "#f5b66c" : "white";
  return (
    <Box padding={`5px`}>
      {user_email !== localStorage.getItem("email") && (
        <StyleOtherName>{user_name}</StyleOtherName>
        // <ModalOtherProfile name={user_name}></ModalOtherProfile>
      )}
      <MessageBox style={{ backgroundColor: color }}>
        <CardContent>
          <Typography style={{ lineHeight: "10px" }}>{content}</Typography>
        </CardContent>
      </MessageBox>
      <Typography>{time}</Typography>
    </Box>
  );
};

export default DmMiniBox;
