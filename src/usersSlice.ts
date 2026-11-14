import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createUser, fetchUser, fetchUsers, getErrorMessage, updateUser } from "./api.ts";
import type { User, UserInput } from "./types.ts";

type Status = "idle" | "loading" | "succeeded" | "failed";

type UsersState = {
  items: User[];
  status: Status;
  error: string | null;
  page: number;
  rowsPerPage: number;
  current: User | null;
  currentStatus: Status;
  currentError: string | null;
  saving: boolean;
  saveError: string | null;
};

const initialState: UsersState = {
  items: [],
  status: "idle",
  error: null,
  page: 0,
  rowsPerPage: 5,
  current: null,
  currentStatus: "idle",
  currentError: null,
  saving: false,
  saveError: null,
};

export const loadUsers = createAsyncThunk<User[], void, { rejectValue: string }>("users/load", async (_, { rejectWithValue }) => {
  try {
    return await fetchUsers();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const loadUser = createAsyncThunk<User, string, { rejectValue: string }>("users/loadOne", async (id, { rejectWithValue }) => {
  try {
    return await fetchUser(id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const addUser = createAsyncThunk<User, UserInput, { rejectValue: string }>("users/add", async (input, { rejectWithValue }) => {
  try {
    return await createUser(input);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// PUT подменяет запись целиком, без createdAt дата на карточке пропадает.
export const editUser = createAsyncThunk<User, { id: string; input: UserInput; createdAt?: string }, { rejectValue: string }>("users/edit", async ({ id, input, createdAt }, { rejectWithValue }) => {
  try {
    return await updateUser(id, createdAt ? { ...input, createdAt } : input);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

function upsert(items: User[], user: User) {
  const index = items.findIndex((item) => item.id === user.id);
  if (index >= 0) items[index] = user;
  else items.push(user);
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
      state.page = 0;
    },
    clearSaveError(state) {
      state.saveError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Не удалось загрузить список.";
      })
      .addCase(loadUser.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
        upsert(state.items, action.payload);
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.current = null;
        state.currentError = action.payload ?? "Не удалось открыть карточку.";
      })
      .addCase(addUser.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.saving = false;
        upsert(state.items, action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload ?? "Не удалось создать пользователя.";
      })
      .addCase(editUser.pending, (state) => {
        state.saving = true;
        state.saveError = null;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.saving = false;
        upsert(state.items, action.payload);
        if (state.current?.id === action.payload.id) state.current = action.payload;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload ?? "Не удалось сохранить изменения.";
      });
  },
});

export const { setPage, setRowsPerPage, clearSaveError } = usersSlice.actions;
export default usersSlice.reducer;
