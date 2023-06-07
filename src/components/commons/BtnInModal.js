import React from "react";
import styled from "styled-components";

export const BtnInModal = styled.input.attrs({ type: "submit" })`
  width: 80px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: #f5b66c;
  :hover {
    cursor: pointer;
  }
  font-weight: bold;
  font-size: 20px;
  margin: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
export const ButtonInModal = styled.input.attrs({ type: "button" })`
  width: 80px;
  height: 40px;
  border: none;
  border-radius: 5px;
  background-color: #f5b66c;
  :hover {
    cursor: pointer;
  }
  font-weight: bold;
  font-size: 20px;
  margin: 20px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
// const BtnInModal = (props) => {
//   const { value, clickFunc } = props;
//   return <ButtonInModal onClick={clickFunc}>{value}</ButtonInModal>;
// };

// export default BtnInModal;
