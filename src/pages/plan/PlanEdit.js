import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { Box, Toolbar } from "@mui/material";

import SideBarAtHome from "../../components/sidebar/SidebarAtHome";
import SideBarAtGroup from "../../components/sidebar/SidebarAtGroup";
import SideBarAtRoom from "../../components/sidebar/SidebarAtGroup";
import Header from "../../components/header/Header";
import { api } from "../../api/Interceptors";
import { InputTextInModal } from "../../components/commons/InputInModal";
import { BtnInModal, ButtonInModal } from "../../components/commons/BtnInModal";
import {
  StyleLabel,
  StyleRadio,
  StyleSelect,
} from "../../components/plan/ModalPlan";

export const StyleEditWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PlanEdit = () => {
  const navigate = useNavigate();
  let isLogined = localStorage.getItem("isLogined");
  useEffect(() => {
    if (!isLogined) navigate("/login");
  }, [isLogined]);

  let today = new Date();
  let yearToday = today.getFullYear();
  let monthToday = ("0" + (today.getMonth() + 1)).slice(-2);
  let dayToday = ("0" + today.getDate()).slice(-2);
  const location = useLocation();
  const groups = location.state.groups;
  const group_name = location.state.group_name;
  const type = location.state.type;
  const type_id = location.state.type_id;
  const title = location.state.title;
  const content = location.state.content;
  const start = location.state.start;
  const end = location.state.end;
  const plan_id = location.state.id;
  const [selectStartYear, setSelectStartyear] = useState(yearToday);
  const [selectStartMonth, setSelectStartMonth] = useState(monthToday);
  const [selectStartDay, setSelectStartDay] = useState(dayToday);

  const [selectEndYear, setSelectEndyear] = useState(yearToday);
  const [selectEndMonth, setSelectEndMonth] = useState(monthToday);
  const [selectEndDay, setSelectEndDay] = useState(dayToday);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
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
  const editPlan = async (e) => {
    e.preventDefault();

    let body = {
      title: newTitle,
      content: newContent,
      start: `${selectStartYear}-${selectStartMonth}-${selectStartDay}`,
      end: `${selectEndYear}-${selectEndMonth}-${selectEndDay}`,
      state: state,
    };
    console.log(body);
    if (newTitle.length === 0) {
      alert("일정 제목을 입력해주세요!");
    } else {
      await api
        .post(`/plan/${plan_id}/update`, body)
        .then((response) => {
          console.log(response);
          if (type === "home") navigate("/");
          else
            navigate(`/${type}/${type_id}`, {
              state: { group_name: group_name, groups: groups },
            });
        })
        .catch((err) => console.log(err));
    }

    // //해당 type의 일정 페이지로 이동
  };
  const deletePlan = async () => {
    if (window.confirm("일정을 삭제하시겠습니까?"))
      await api
        .delete(`/plan/${plan_id}/delete`)
        .then((response) => {
          alert("일정 삭제 완료");

          if (type === "home") navigate("/");
          else
            navigate(`/${type}/${type_id}`, {
              state: { group_name: group_name, groups: groups },
            });
        })
        .catch((err) => console.log(err));
  };
  const handleRadioBtn = (e) => {
    setState(e.target.value);
  };
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <Header />
        {type === "home" ? (
          <SideBarAtHome />
        ) : type === "group" ? (
          <SideBarAtGroup group_name={group_name} groups={groups} />
        ) : (
          <SideBarAtRoom />
        )}

        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <StyleEditWrapper onSubmit={editPlan}>
            <h2>일정 수정하기</h2>
            <div>
              <StyleLabel>시작 날짜 : </StyleLabel>
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
            <InputTextInModal
              type="text"
              value={newTitle}
              placeholder={title}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <InputTextInModal
              type="text"
              value={newContent}
              placeholder={content}
              onChange={(e) => setNewContent(e.target.value)}
            />
            <StyleLabel>
              {stateArr.map((v, i) => {
                return (
                  <StyleLabel>
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
            <p>
              <BtnInModal type="submit" value="EDIT" />
              <ButtonInModal
                type="button"
                value="DELETE"
                onClick={deletePlan}
              />
            </p>
          </StyleEditWrapper>
        </Box>
      </Box>
    </div>
  );
};

export default PlanEdit;
