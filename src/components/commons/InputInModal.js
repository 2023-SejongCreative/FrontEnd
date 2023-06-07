import styled from "styled-components";

export const InputTextInModal = styled.input.attrs({ type: "text" })`
  width: 220px;
  height: 40px;
  border: 1px dotted grey;
  :focus {
    outline: none;
    border: 1px solid orange;
  }
  border-radius: 5px;
  font-size: 20px;
  margin: 5px;
`;
export const InputCheckInModal = styled.input.attrs({ type: "checkbox" })`
  margin: 10px;
  accent-color: orange;
  zoom: 1.5;
`;
