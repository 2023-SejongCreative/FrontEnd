import React from "react";
import styled from "styled-components";

const CardStyle = styled.div`
  width: 300px;
  height: 600px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CardPersonal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 250px;
  height: 100px;
  background-color: wheat;
  border-radius: 5px;
  justify-content: center;
`;
const CardWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;
const StyleNoPlan = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 20px;
  margin: 100px;
`;
const CardText = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: medium;
  margin: 10px;
`;

const Board = ({ planList }) => {
  return (
    <CardWrapper>
      {planList.length == 0 ? (
        <CardWrapper>
          <StyleNoPlan style={{ margin: 100 }}>
            등록된 일정이 없습니다.
          </StyleNoPlan>
        </CardWrapper>
      ) : (
        <>
          {planList.map((v, i) => (
            <>
              {" "}
              {v.state === "미완료" && (
                <CardStyle>
                  <h3 style={{ color: "grey" }}>미완료</h3>
                  <CardPersonal>
                    <CardText>{v.title}</CardText>
                    <CardText>{`${v.start} ~ ${v.end}`}</CardText>
                  </CardPersonal>
                </CardStyle>
              )}
              {v.state === "진행중" && (
                <CardStyle>
                  <h3 style={{ color: "grey" }}>진행중</h3>
                  <CardPersonal>
                    <CardText>{v.title}</CardText>
                    <CardText>{`${v.start} ~ ${v.end}`}</CardText>
                  </CardPersonal>
                </CardStyle>
              )}
              {v.state === "완료" && (
                <CardStyle>
                  <h3 style={{ color: "grey" }}>완료</h3>
                  <CardPersonal>
                    <CardText>{v.title}</CardText>
                    <CardText>{`${v.start} ~ ${v.end}`}</CardText>
                  </CardPersonal>
                </CardStyle>
              )}
            </>
          ))}
        </>
      )}
    </CardWrapper>
  );
};

export default Board;
