import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from "redux-persist";
import listUiReducer from "./listUiSlice.ts";
import { usersApi } from "./usersApi.ts";

// Импорт redux-persist/lib/storage в Vite приходит без getItem.
// redux-thunk уже включен в getDefaultMiddleware, запросы описаны в usersApi.
const storage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// В persist только номер страницы и размер. Кэш запросов при перезагрузке берется заново.
const listUiPersist = persistReducer(
  {
    key: "listUi",
    storage,
    whitelist: ["page", "rowsPerPage"],
  },
  listUiReducer,
);

const rootReducer = combineReducers({
  [usersApi.reducerPath]: usersApi.reducer,
  listUi: listUiPersist,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(usersApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
