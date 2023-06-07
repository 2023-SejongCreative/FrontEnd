import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { FiEdit } from "react-icons/fi";
import { VscTrash } from "react-icons/vsc";
import { MdOutlineCancel } from "react-icons/md";
import { Divider } from "@mui/material";

import { api } from "../../api/Interceptors";
import { useGroupsStore, useRoomsStore } from "../../store/Store";
import ModalOtherProfile from "../commons/ModalOtherProfile";
import { InputTextInModal } from "../commons/InputInModal";
import { BtnInModal } from "../commons/BtnInModal";
import { StyleTextArea } from "../profile/MyData";

const BoardHeader = styled.div`
  width: ${(props) => props.resize[0] - 6000}px;
  height: ${(props) => props.resize[1] - 700}px;
  height: 50px;
  top: 80px;
  left: 580px;
  // background-color: #f5b66c;
  display: flex;
`;
const StyleBox = styled.div`
  position: fixed;
  width: 500px;
  height: 550px;
  width: ${(props) => props.resize[0] - 600}px;
  height: ${(props) => props.resize[1] - 200}px;
  top: 80px;
  left: 580px;
  overflow-y: scroll;
  font-family: "Inter", sans-serif;
`;
const StyleTitle = styled.p`
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  font-family: "Inter", sans-serif;
`;
const StyleWriter = styled.div`
  :hover {
    cursor: pointer;
  }
`;
const StyleDate = styled.p`
  position: fixed;
  top: 60px;
  right: 20px;
  margin-top: 30px;
  margin-right: 5px;
  font-family: "Inter", sans-serif;
`;
const StyleContent = styled.p`
  margin: 10px;
  font-family: "Inter", sans-serif;
`;
const StyleDMWrapper = styled.div`
  position: fixed;
  top: 700px;
  left: 600px;
  top: ${(props) => props.resize[1] - 100}px;
  left: ${(props) => props.resize[0] - 480}px;
  font-family: "Inter", sans-serif;
`;
const StyleForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: right; */
`;
const Wrapper = styled.div`
  text-align: center;
`;
const ButtonInBoard = styled.button`
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

const InBoard = ({ board_id }) => {
  const navigate = useNavigate();
  const { storeGroups } = useGroupsStore();
  const { storeRooms } = useRoomsStore();
  const [resize, setResize] = useState([]);
  const [boardDetail, setBoardDetail] = useState({});
  const [modeEdit, setModeEdit] = useState(false);
  const [noticeOrNot, setNoticeOrNot] = useState("1");
  const [newtitle, setNewtitle] = useState("");
  const [newcontent, setNewcontent] = useState("");
  const [other, setOther] = useState({});
  const [seeOtherProfile, setSeeOtherProfile] = useState(false);
  //e.log(storeGroups, storeRooms);
  // let other = {};

  let today = new Date();

  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let day = ("0" + today.getDate()).slice(-2);
  let date = year + "-" + month + "-" + day;

  const handleResize = () => {
    setResize([window.innerWidth, window.innerHeight]);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [resize]);
  useEffect(() => {
    getBoardDetail();
  }, [board_id]);

  const getBoardDetail = async () => {
    await api
      .get(`/note/${board_id}`)
      .then((response) => {
        console.log(response);
        setBoardDetail(response.data);
        setOther({ name: response.data.writer, id: response.data.id });
      })
      .catch((err) => console.log(err));
  };

  const remove = (e) => {
    let manager;
    let type = localStorage.getItem("type");
    let type_id =
      type == "group"
        ? localStorage.getItem("group_id")
        : localStorage.getItem("room_id");
    if (type === "group") {
      storeGroups.map((v, i) => {
        if (v.group_id == type_id) manager = v.manager;

        console.log(v.manager);
      });
    } else if (type === "room") {
      storeRooms.map((v, i) => {
        if (v.room_id == type_id) manager = v.manager;
        console.log(v.manager);
      });
    }

    if (window.confirm("글을 삭제하시겠습니까?")) {
      console.log(manager);
      e.preventDefault();
      api
        .delete(`/note/${board_id}/delete/${manager}`)
        .then((response) => {
          console.log(response);

          response.status === 200
            ? alert("게시글 삭제 완료")
            : alert("삭제 권한이 없습니다!");

          // navigate(`/${type}/${type_id}/board`, {
          //   state: { type_name: type_name, groups: storeGroups, rooms: storeRooms },
          // });

          navigate(`/${type}/${type_id}/board`, {
            state: { group: storeGroups },
          });
          //BoardPage로 이동
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400)
            alert("수정 및 삭제는 작성자 및 관리자만 할 수 있습니다.");
        });
    }
  };
  const editboard = (e) => {
    let manager;
    let type = localStorage.getItem("type");
    let type_id =
      type === "group"
        ? localStorage.getItem("group_id")
        : localStorage.getItem("room_id");
    if (type === "group") {
      storeGroups.map((v, i) => {
        if (v.group_id == type_id) manager = v.manager;
      });
    } else if (type === "room") {
      storeRooms.map((v, i) => {
        if (v.room_id === type_id) manager = v.manager;
      });
    }
    e.preventDefault();

    let body = {
      title: newtitle,
      content: newcontent,
      date: date,
      notice: noticeOrNot,
    };
    if (newtitle.length === 0) alert("Title은 필수 입력입니다.");
    else {
      api
        .post(`/note/${board_id}/update/${manager}`, body)
        .then((response) => {
          console.log(response);
          setModeEdit(false);
          getBoardDetail();
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 400)
            alert("수정 및 삭제는 작성자 및 관리자만 할 수 있습니다.");
        });
    }
  };

  return (
    <StyleDMWrapper resize={resize}>
      <StyleBox resize={resize}>
        {/* <BoardHeader resize={resize}>
          <VscTrash onClick={remove}></VscTrash>
          <FiEdit onClick={() => setModeEdit(true)}></FiEdit>
        </BoardHeader> */}
        <div style={{ height: 500 }}>
          {modeEdit === false ? (
            <>
              <StyleWriter
                style={{ margin: 20 }}
                onClick={() => setSeeOtherProfile(!seeOtherProfile)}
              >
                작성자 보기
              </StyleWriter>
              {seeOtherProfile ? (
                <ModalOtherProfile other={other}></ModalOtherProfile>
              ) : (
                ""
              )}
              <StyleTitle>{boardDetail.title}</StyleTitle>
              <StyleDate>{boardDetail.date}</StyleDate>
              <StyleContent>{boardDetail.content}</StyleContent>
            </>
          ) : (
            <>
              <form onSubmit={editboard}>
                <InputTextInModal
                  type="text"
                  placeholder={boardDetail.title}
                  value={newtitle}
                  onChange={(e) => setNewtitle(e.target.value)}
                  style={{ width: 460 }}
                />
                <StyleTextArea
                  name="content"
                  cols="60"
                  rows="20"
                  placeholder={boardDetail.content}
                  value={newcontent}
                  onChange={(e) => setNewcontent(e.target.value)}
                  style={{ borderColor: "grey" }}
                ></StyleTextArea>
                공지글인가요?
                <input
                  type="checkbox"
                  value={noticeOrNot}
                  onClick={() => setNoticeOrNot("0")}
                />
                <BtnInModal type="submit" />
              </form>
            </>
          )}
        </div>
        <Divider></Divider>
        <div style={{ display: "flex" }}>
          {!modeEdit ? (
            <FiEdit
              onClick={() => setModeEdit(true)}
              style={{ fontSize: 25 }}
            ></FiEdit>
          ) : (
            <MdOutlineCancel
              onClick={() => setModeEdit(false)}
              style={{ fontSize: 25 }}
            ></MdOutlineCancel>
          )}
          <VscTrash onClick={remove} style={{ fontSize: 25 }}></VscTrash>
        </div>
      </StyleBox>
    </StyleDMWrapper>
  );
};

export default InBoard;
