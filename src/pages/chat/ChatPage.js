import React from "react";

import { Box, Divider, Grid, Toolbar } from "@mui/material";

import Header from "../../components/header/Header";
import SideBarAtHome from "../../components/sidebar/SidebarAtHome";
import ChatListArea from "../../components/chat/ChatListArea";

const ChatPage = () => {
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
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default ChatPage;
