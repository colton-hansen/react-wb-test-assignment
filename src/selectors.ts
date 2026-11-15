import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./store.ts";
import type { User } from "./types.ts";
import { usersApi } from "./usersApi.ts";

const emptyUsers: User[] = [];

const selectUsersResult = usersApi.endpoints.getUsers.select();

const selectUsers = createSelector(selectUsersResult, (result) => result.data ?? emptyUsers);

function compareUsersByName(left: User, right: User): number {
  return left.name.localeCompare(right.name, "ru");
}

// Сортировка зависит только от записей. Смена страницы берет готовый порядок и режет его.
const selectSortedUsers = createSelector(selectUsers, (users) => [...users].sort(compareUsersByName));

export const selectUserCount = createSelector(selectSortedUsers, (users) => users.length);

const selectListUi = (state: RootState) => state.listUi;

export const selectSafePage = createSelector(selectUserCount, selectListUi, (count, ui) => {
  const maxPage = Math.max(0, Math.ceil(count / ui.rowsPerPage) - 1);
  return Math.min(ui.page, maxPage);
});

export const selectVisibleUsers = createSelector(selectSortedUsers, selectListUi, selectSafePage, (users, ui, page) => {
  const start = page * ui.rowsPerPage;
  return users.slice(start, start + ui.rowsPerPage);
});

export const selectUserById = createSelector(
  selectUsers,
  (_state: RootState, id: string) => id,
  (users, id) => users.find((user) => user.id === id) ?? null,
);
