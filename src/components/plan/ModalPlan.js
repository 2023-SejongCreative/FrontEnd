import React from "react";
import { useState } from "react";
import styled from "styled-components";

import Box from "@mui/material/Box";
import { Modal } from "@mui/material";

import { api } from "../../api/Interceptors";
import { Button } from "../chat/ModalDmCreate";
import { InputTextInModal } from "../commons/InputInModal";
import { BtnInModal } from "../commons/BtnInModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};
export const StyleSelect = styled.select`
  margin: 5px;
  width: 60px;
  height: 30px;
  font-size: 15px;
  border: 1px dotted grey;
  border-radius: 5px;
  :focus {
    outline: none;
    border: 1px solid orange;
  }
`;

export const StyleRadio = styled.input.attrs({ type: "radio" })`
  accent-color: saddlebrown;
`;
export const StyleLabel = styled.label`
  cursor: pointer;
  margin: 10px;
`;

const ModalPlan = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let today = new Date();
  let yearToday = today.getFullYear();
  let monthToday = ("0" + (today.getMonth() + 1)).slice(-2);
  let dayToday = ("0" + today.getDate()).slice(-2);

  const [selectStartYear, setSelectStartyear] = useState(yearToday);
  const [selectStartMonth, setSelectStartMonth] = useState(monthToday);
  const [selectStartDay, setSelectStartDay] = useState(dayToday);

  const [selectEndYear, setSelectEndyear] = useState(yearToday);
  const [selectEndMonth, setSelectEndMonth] = useState(monthToday);
  const [selectEndDay, setSelectEndDay] = useState(dayToday);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState("");
  const stateArr = ["미완료", "완료", "진행중"];
  const [form, setForm] = useState({
    year: 2023,
    month: "01",
    day: "01",
  });

  const now = new Date();

  let years = [];
  for (let y = now.getFullYear(); y >= 2020; y -= 1) {
    years.push(y);
  }
  let month = [];
  for (let m = 1; m <= 12; m += 1) {
    if (m < 10) {
      // 날짜가 2자리로 나타나야 했기 때문에 1자리 월에 0을 붙혀준다
      month.push("0" + m.toString());
    } else {
      month.push(m.toString());
    }
  }
  let days = [];
  let date = new Date(form.year, form.month, 0).getDate();
  for (let d = 1; d <= date; d += 1) {
    if (d < 10) {
      // 날짜가 2자리로 나타나야 했기 때문에 1자리 일에 0을 붙혀준다
      days.push("0" + d.toString());
    } else {
      days.push(d.toString());
    }
  }

  const createPlan = async (e) => {
    e.preventDefault();

    const type = props.type;
    const type_id = props.type_id;
    let body = {
      title: title,
      content: content,
      start: `${selectStartYear}-${selectStartMonth}-${selectStartDay}`,
      end: `${selectEndYear}-${selectEndMonth}-${selectEndDay}`,
      state: state,
      //color: "#f5b66c",
    };
    console.log(body);
    if (title.length === 0) {
      alert("일정 제목을 입력해주세요!");
    } else {
      await api
        .post(`/plan/${type}/${type_id}/create`, body)
        .then((response) => {
          console.log(response);
          handleClose();
          window.location.reload();
        })
        .catch((err) => console.log(err));
    }
  };
  const handleRadioBtn = (e) => {
    setState(e.target.value);
  };
  return (
    <>
      <Button onClick={handleOpen}>+</Button>{" "}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} onSubmit={createPlan}>
          <form style={{ textAlign: "center" }}>
            <h2 style={{ margin: 10 }}>일정 생성</h2>
            <div>
              <label>시작 날짜 : </label>
              <StyleSelect
                onChange={(e) => {
                  setSelectStartyear(e.target.value);
                }}
                value={selectStartYear}
              >
                {years.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </StyleSelect>
              <StyleSelect
                onChange={(e) => {
                  setSelectStartMonth(e.target.value);
                }}
                value={selectStartMonth}
              >
                {month.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </StyleSelect>
              <StyleSelect
                onChange={(e) => {
                  setSelectStartDay(e.target.value);
                }}
                value={selectStartDay}
              >
                {days.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </StyleSelect>
            </div>
            <div>
              <label>종료 날짜 : </label>
              <StyleSelect
                onChange={(e) => {
                  setSelectEndyear(e.target.value);
                }}
                value={selectEndYear}
              >
                {years.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </StyleSelect>
              <StyleSelect
                onChange={(e) => {
                  setSelectEndMonth(e.target.value);
                }}
                value={selectEndMonth}
              >
                {month.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </StyleSelect>
              <StyleSelect
                onChange={(e) => {
                  setSelectEndDay(e.target.value);
                }}
                value={selectEndDay}
              >
                {days.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </StyleSelect>
            </div>
            <div>
              <label>일정 : </label>
              <InputTextInModal
                type="text"
                display="block"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>

            <div style={{ marginBottom: 10 }}>
              <label>내용 : </label>
              <InputTextInModal
                type="text"
                display="block"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
              />
            </div>
            <StyleLabel>
              {stateArr.map((v, i) => {
                return (
                  <StyleLabel key={v}>
                    {v}
                    <StyleRadio
                      type="radio"
                      value={v}
                      key={v}
                      checked={state === v}
                      onChange={handleRadioBtn}
                    />
                  </StyleLabel>
                );
              })}
            </StyleLabel>
            <div>
              <BtnInModal type="submit" value="생성" />
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default ModalPlan;
