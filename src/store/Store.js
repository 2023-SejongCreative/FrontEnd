import { create } from "zustand";

const useTypeStore = create((set) => ({
  type: "home",
  type_id: localStorage.getItem("id"),
  type_name: "",
  setTypeGroup(type_id, type_name) {
    set((state) => ({ type: "group", type_id: type_id, type_name: type_name }));
    console.log(type_id, type_name);
  },
  setTypeRoom(type_id, type_name) {
    set((state) => ({ type: "room", type_id: type_id, type_name: type_name }));
  },
  setTypeHome() {
    set((state) => ({ type: "home", type_id: localStorage.getItem("id") }));
  },
}));
const useHeaderMenuStore = create((set) => ({
  headerMenu: "plan",
  setHeaderMenu: (menu) => set((state) => ({ headerMenu: menu })),
}));
const useGroupsStore = create((set) => ({
  storeGroups: [],
  group_id: "",
  group_name: "",
  setStoreGroups(groups) {
    set((state) => ({ storeGroups: groups }));
  },
  //setGroupId와 setGroupName으로 분리해야될지도
  setGroupId(group_id, group_name) {
    set(() => ({ group_id: group_id, group_name: group_name }));
    console.log(group_id, group_name);
  },
  // setGroupName( group_name) {
  //   set(() => ({ group_name: group_name }));
  // },
}));
const useRoomsStore = create((set) => ({
  storeRooms: [],
  room_id: "",
  room_name: "",
  setStoreRooms: (rooms) => set((state) => ({ storeRooms: rooms })),
  setRoomId: (room_id, room_name) =>
    set(() => ({ room_id: room_id, room_name: room_name })),
}));

const useCalenderStore = create((set) => ({
  isBoard: false,
  setBoardState: () => set((state) => ({ isBoard: true })),
  setCalendarState: () => set((state) => ({ isBoard: false })),
}));

export {
  useCalenderStore,
  useTypeStore,
  useHeaderMenuStore,
  useGroupsStore,
  useRoomsStore,
};

//export default를 쓰게 되면 한 모듈당 하나만 export 할 수 있다->즉, 여러개 export 불가
