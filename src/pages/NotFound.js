import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Style404Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Style404Card = styled.div`
  width: 480px;
  height: 480px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin: 30px;
`;
const Style404Text = styled.div`
  font-family: "Noto Sans KR", sans-serif;
  font-size: 25px;
  margin: 10px;
  text-align: center;
`;

const StyleGoHomeBtn = styled.button`
  width: 200px;
  height: 40px;
  border: solid 2px orange;
  font-family: "Noto Sans KR", sans-serif;
  background-color: white;
  color: orange;
  font-size: 20px;
  border-radius: 5px;
  margin: 30px;
  :hover {
    cursor: pointer;
  }
`;

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Style404Wrapper>
      <Style404Card>
        <Style404Text>Not Found!</Style404Text>
        <Style404Text>존재하지 않는 페이지입니다.</Style404Text>

        <StyleGoHomeBtn onClick={() => navigate("/")}>
          메인 홈으로 이동
        </StyleGoHomeBtn>
      </Style404Card>
    </Style404Wrapper>
  );
};

export default NotFound;
