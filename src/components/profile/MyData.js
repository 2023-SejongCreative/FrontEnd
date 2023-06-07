import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";

import { Avatar, Divider, Stack } from "@mui/material";

import { api } from "../../api/Interceptors";
import DefaultImage from "../../assets/DefaultImage.png";
import ModalProfileUpdate from "./ModalProfileUpdate";

const StyleDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Acme", sans-serif;
`;

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
  font-family: "Acme";
`;
const StyleIntroBox = styled.div`
  width: 400px;
  height: 80px;
  border: 1px dotted orange;
  border-radius: 5px;
  font-size: 15px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 5px;
  font-family: "Acme", sans-serif;
`;
const StyleInputFile = styled.input.attrs({ type: "file" })`
  display: none;
`;
export const StyleTextArea = styled.textarea`
  margin: 10px;
  border-radius: 5px;
  display: block;
  border: 1px dotted orange;
  outline-color: orange;
`;
const StyleViewImg = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 70%;
  overflow: hidden;
  object-fit: cover;
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
  font-family: "Acme", sans-serif;
`;

const ProjectWrapper = styled.div`
  display: flex;
  flex-wrap: wrap; // 복수의 행
  font-family: "Acme", sans-serif;
`;

const MyData = () => {
  const inputRef = useRef(null);
  const [profileData, setProfileData] = useState();
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [content, setContent] = useState([]);
  const [editMode, setEditMode] = useState(false);
  //const [editProjectMode, setEditProjectMode] = useState(Array(3).fill(false));
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [contentLength, setContentLength] = useState();
  const [editProjectMode, setEditProjectMode] = useState(false);

  let formData = new FormData();
  //서버로부터 프로필 데이터 get해옴
  const getProfileData = async () => {
    await api
      .get("/profile/me")
      .then((response) => {
        console.log(response);
        setProfileData(response.data);
        setName(response.data.name);
        setIntroduction(response.data.introduction);
        setContent(response.data.content);
        setContentLength(response.data.content.length);
        setImgFile(response.data.img);
      })
      .catch((err) => console.log(err));
  };
  console.log(contentLength, editProjectMode);

  // const onUploadImageButtonClick = useCallback(() => {
  //   if (!inputRef.current) {
  //     return;
  //   }
  //   inputRef.current.click();
  // }, []);
  // const onUploadImage = useCallback((e) => {
  //   if (!e.target.files) {
  //     return;
  //   }

  //   formData.append("img", e.target.files[0]);
  //   api
  //     .post("", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  //소개글 편집 후 저장하는 함수(formData에 집어넣음)
  const saveProfileData = () => {
    formData.append("introduction", introduction);
    setEditMode(false);
  };

  //프로필 페이지 렌더링 시 내 프로필 데이터를 서버로부터 가져옴
  useEffect(() => {
    getProfileData();
  }, []);

  const [imgFile, setImgFile] = useState("");
  const imgRef = useRef();

  // 이미지 업로드 input의 onChange
  const saveImgFile = (e) => {
    if (imgRef.current.files[0].length === 0) return;
    const file = imgRef.current.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImgFile(reader.result);
    };

    // formData.append("img", imgFile);
  };

  //진행 중인 프로젝트 수정하는 함수
  const editProject = async (e, id) => {
    e.preventDefault();
    let body = {
      title: title,
      detail: detail,
    };
    if (title.length === 0) alert("Title은 필수 입력입니다.");
    else {
      await api
        .post(`/profile/${id}/update`, body)
        .then((response) => {
          console.log(response);
          //만약 무한루프 돌면 지우기
          getProfileData();
          setEditProjectMode(false);
        })
        .catch((err) => console.log(err));
    }
  };

  //진행 중인 프로젝트 삭제하는 함수
  const deleteProject = (id) => {
    if (window.confirm("해당 프로젝트를 삭제하시겠습니까?")) {
      api
        .delete(`/profile/${id}/delete`)
        .then((response) => {
          console.log(response);
          response.status == 200
            ? alert("삭제가 완료되었습니다.")
            : alert("삭제 실패");
          getProfileData();
        })
        .catch((err) => console.log(err));
    }
  };

  //저장 눌렀을 시 서버에 사용자가 업로드한 이미지와 소개글을 formData 형태로 post
  const uadateImgNIntro = async () => {
    console.log("서버로 이미지랑 소개글 데이터 post하는 함수 실행!");
    let body = {
      img: imgFile,
      introduction: introduction,
    };
    console.log(body);
    await api.post("/profile/update", body).then((response) => {
      console.log(response);
      response.status == 200 ? alert("저장 완료") : alert("저장 실패");
    });
  };
  const onUploadImageButtonClick = useCallback(() => {
    if (!imgRef.current) return;

    imgRef.current.click();
  }, []);
  return (
    <StyleDataWrapper>
      <h2>{profileData && profileData.name} 님의 프로필</h2>
      {/* <StyleInputFile
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={onUploadImage}
      />
      <Button onClick={onUploadImageButtonClick} label="이미지 업로드">
        이미지 업로드
      </Button> */}

      <StyleViewImg width={"200px"} src={imgFile ? imgFile : DefaultImage} />
      {/* // 이미지 업로드 input */}
      <input
        type="file"
        accept="image/*"
        id="profileImg"
        ref={imgRef}
        onChange={saveImgFile}
        style={{ display: "none" }}
      />
      <div style={{ display: "inline" }}>
        <Button onClick={onUploadImageButtonClick}>업로드</Button>
      </div>
      {editMode ? (
        <>
          <StyleTextArea
            name="소개글 수정"
            cols="45"
            rows="5"
            placeholder={introduction}
            value={introduction}
            onChange={(e) =>
              e.target.value === ""
                ? setIntroduction("")
                : setIntroduction(e.target.value)
            }
            autoFocus
          ></StyleTextArea>
        </>
      ) : (
        <>
          <StyleIntroBox style={{ whiteSpace: "pre" }}>
            {introduction === "" ? "자신을 소개해주세요!" : introduction}
          </StyleIntroBox>
        </>
      )}

      <div style={{ display: "inline" }}>
        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>소개글 수정</Button>
        ) : (
          <Button onClick={saveProfileData}>완료</Button>
        )}
        <Button onClick={uadateImgNIntro}>저장</Button>
      </div>
      <Divider />
      <h2>OnGoing Project</h2>
      <ProjectWrapper>
        {content.length !== 0 ? (
          content.map((v, i) => (
            <StyleProjectCard key={v.id}>
              {editProjectMode ? (
                <>
                  <input
                    type="text"
                    placeholder="프로젝트 Title"
                    style={{
                      margin: 2,
                      width: 200,
                      height: 40,
                      border: "1px dotted grey",
                      borderRadius: 5,
                      marginTop: 5,
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="프로젝트 Detail"
                    style={{
                      margin: 2,
                      width: 200,
                      height: 40,
                      border: "1px dotted grey",
                      borderRadius: 5,
                    }}
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                  />
                  <div style={{ display: "inline" }}>
                    <Button onClick={() => setEditProjectMode(false)}>
                      취소
                    </Button>
                    <Button onClick={(e) => editProject(e, v.id)}>저장</Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ margin: 10 }}>{v.title}</h3>
                  <p style={{ margin: 0 }}>{v.detail}</p>
                  <div style={{ display: "inline" }}>
                    <Button onClick={() => setEditProjectMode(true)}>
                      수정
                    </Button>
                    <Button onClick={() => deleteProject(v.id)}>삭제</Button>
                  </div>
                </>
              )}
            </StyleProjectCard>
          ))
        ) : (
          <>
            <StyleProjectCard>
              <h4 style={{ marginTop: 50 }}>등록된 프로젝트가 없습니다.</h4>
            </StyleProjectCard>
          </>
        )}

        <StyleProjectCard style={{ cursor: "pointer" }}>
          <h1 style={{ marginTop: "35px" }}>
            <ModalProfileUpdate />
          </h1>
        </StyleProjectCard>
      </ProjectWrapper>
      {/* // 업로드 된 이미지 미리보기 */}
    </StyleDataWrapper>
  );
};

export default MyData;
