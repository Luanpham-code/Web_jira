// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   listProjec: [], // nên đặt camelCase
// };

// const projectSlice = createSlice({
//   name: "projectSlice",
//   initialState,
//   reducers: {
//     setListProjecAction: (state, action) => {
//       state.listProjec = action.payload;
//     },
//   },
// });

// // export action để dispatch
// export const { setListProjecAction } = projectSlice.actions;

// // export reducer mặc định
// export default projectSlice.reducer;

// stores/Project.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listProjec: [],   // tên trùng với useSelector
};

const projectSlice = createSlice({
  name: 'projectSlice',
  initialState,
  reducers: {
    setListProjecAction: (state, action) => {
      state.listProjec = action.payload;
    },
  },
});

export const { setListProjecAction } = projectSlice.actions;
export default projectSlice.reducer;