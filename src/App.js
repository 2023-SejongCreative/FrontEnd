import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Index";
import Login from "./pages/login/Index";
import Register from "./pages/register/Index";
import ChatPage from "./pages/chat/ChatPage";
import ChatDetail from "./pages/chat/ChatDetail";
import VideoPage from "./pages/videochat/VideoPage";
import VideoPage2 from "./pages/videochat/VideoPage2";
import MyProfilePage from "./pages/profile/MyProfilePage";
import Group from "./pages/group/Group";
import Room from "./pages/room/Room";
import PlanEdit from "./pages/plan/PlanEdit";
import BoardPage from "./pages/board/BoardPage";
import BoardDetail from "./pages/board/BoardDetail";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/auth/PrivateRoute";

function App() {
  return (
    <>
      {" "}
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute auth={false} />}>
            <Route path="/login" element={<Login></Login>}></Route>
            <Route path="/register" element={<Register></Register>}></Route>
          </Route>
          <Route element={<PrivateRoute auth={true} />}>
            <Route path="/" element={<Home></Home>}></Route>
            <Route
              path="/planEditNDelete"
              element={<PlanEdit></PlanEdit>}
            ></Route>

            <Route path="/group/:group_id" element={<Group></Group>}></Route>
            <Route path="/room/:room_id" element={<Room></Room>}></Route>
            <Route
              path="/group/:group_id/board"
              element={<BoardPage></BoardPage>}
            ></Route>
            <Route
              path="/group/:group_id/board/:board_id"
              element={<BoardDetail></BoardDetail>}
            ></Route>
            <Route
              path="/room/:room_id/board"
              element={<BoardPage></BoardPage>}
            ></Route>
            <Route
              path="/room/:room_id/board/:board_id"
              element={<BoardDetail></BoardDetail>}
            ></Route>
            <Route path="/chat" element={<ChatPage></ChatPage>}></Route>
            <Route
              path="/chat/:dm_id"
              element={<ChatDetail></ChatDetail>}
            ></Route>
            <Route
              path="/openvidu/:dm_id"
              element={<VideoPage></VideoPage>}
            ></Route>
            {/* <Route
            path="/openvidu2/:dm_id"
            element={<VideoPage2></VideoPage2>}
            ></Route> */}
            <Route
              path="/myprofile"
              element={<MyProfilePage></MyProfilePage>}
            ></Route>
          </Route>
          <Route path="*" element={<NotFound></NotFound>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
