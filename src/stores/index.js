// import { configureStore } from "@reduxjs/toolkit";
// import projectSlice from "./Project/index.js"


// export const store = configureStore({
//   reducer: {
//     // là nơi chứa các reducer của ứng dụng
//     projectSlice : projectSlice,
//   },
// });

import { configureStore } from '@reduxjs/toolkit';
import projectSlice from './Project/index.js';
export const store = configureStore({
  reducer: {
    projectSlice,
  },
});