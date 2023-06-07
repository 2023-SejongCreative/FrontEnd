import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import { api } from "../../api/Interceptors";
import ModalPlan from "./ModalPlan";
import Board from "./Board";
import { useCalenderStore } from "../../store/Store";

const Button = styled.button`
  width: 80px;
  height: 30px;
  border: none;
  color: grey;
  background-color: antiquewhite;
  :hover {
    cursor: pointer;
  }
  font-weight: bold;
  &.selected {
    background-color: #f5b66c;
    color: black;
  }
`;

const Calendar = (props) => {
  const navigate = useNavigate();
  const [planList, setPlanList] = useState([]);
  const [selectBoard, setSelectBoard] = useState(false);
  const { isBoard, setBoardState, setCalendarState } = useCalenderStore();
  let groups, group_name;
  let event;
  if (props.groups !== undefined) groups = props.groups;
  if (props.group_name !== undefined) group_name = props.group_name;
  // const planList = [
  //   {
  //     plan_id: 3,
  //     title: "공부하기",
  //     start: "2023-05-13",
  //     end: "2023-05-14",
  //     extendedProps: {
  //       department: "",
  //     },
  //     color: "#f5b66c",
  //     allDay: true,
  //     content: "react",
  //     state: "미완료",
  //   },
  //   {
  //     plan_id: 4,
  //     title: "회의",
  //     start: "2023-05-13",
  //     end: "2023-05-14",
  //     extendedProps: {
  //       department: "",
  //     },
  //     color: "#f5b66c",
  //     allDay: true,
  //     content: "",
  //     state: "진행중",
  //   },
  // ];

  const handleDateClick = (e) => {
    event = {
      id: e.event.id,
      title: e.event.title,
      start: e.event.start,
      end: e.event.end,
      content: e.event.extendedProps.content,
      state: e.event.extendedProps.state,
    };
    navigate("/planEditNDelete", {
      state: {
        type: props.type,
        type_id: props.type_id,
        id: event.id,
        title: event.title,
        content: event.content,
        start: event.start,
        end: event.end,
        groups: props.groups,
        group_name: props.group_name,
      },
    });
  };
  const type = props.type;
  const type_id = props.type_id;
  const getPlan = async () => {
    console.log(type, type_id);
    await api
      .get(`/plan/${type}/${type_id}/list`)
      .then((response) => {
        //여기서 캘린더에 보여줄 planList 세팅하기
        console.log(response);
        response.data.plans.map((v, i) => {
          v["color"] = "#f5b66c";
        });
        setPlanList(response.data.plans);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getPlan();
  }, [type_id]);

  return (
    <>
      <ModalPlan type={props.type} type_id={props.type_id} />
      <div
        style={{
          textAlign: "center",
          alignItems: "center",
        }}
      >
        <div style={{ margin: 10 }}>
          <Button
            style={{
              borderRadius: "5px 0 0 5px",
              display: "inline-block",
            }}
            onClick={() => setBoardState(true)}
            className={isBoard ? "selected" : ""}
          >
            Board
          </Button>
          <Button
            style={{ borderRadius: " 0 5px 5px 0" }}
            onClick={() => setCalendarState(true)}
            className={isBoard ? "" : "selected"}
          >
            Calendar
          </Button>
        </div>
      </div>
      {isBoard ? (
        <Board planList={planList} />
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          dayMaxEvents={true}
          events={planList}
          height={"600px"}
          editable={true}
          eventClick={handleDateClick}
        />
      )}
    </>
  );
};

export default Calendar;
