import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ListUiState = {
  page: number;
  rowsPerPage: number;
};

const initialState: ListUiState = {
  page: 0,
  rowsPerPage: 5,
};

const listUiSlice = createSlice({
  name: "listUi",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
  },
});

export const { setPage, setRowsPerPage } = listUiSlice.actions;
export default listUiSlice.reducer;
