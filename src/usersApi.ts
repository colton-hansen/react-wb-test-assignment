import { createApi, type BaseQueryFn } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { endpoint, getErrorMessage } from "./api.ts";
import { asUser, asUsers } from "./mapUser.ts";
import type { User } from "./types.ts";
import type { UserFormValues } from "./userSchema.ts";

type Request = {
  url: string;
  method: "get" | "post" | "put";
  data?: unknown;
};

const axiosBaseQuery: BaseQueryFn<Request, unknown, string> = async ({ url, method, data }) => {
  try {
    const response = await axios({
      url: `${endpoint()}${url}`,
      method,
      data,
      headers: { "content-type": "application/json" },
    });
    return { data: response.data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Users", "User"],
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => ({ url: "", method: "get" }),
      transformResponse: asUsers,
      providesTags: (result) =>
        result
          ? [...result.map((user) => ({ type: "User" as const, id: user.id })), { type: "Users", id: "LIST" }]
          : [{ type: "Users", id: "LIST" }],
    }),
    getUser: build.query<User, string>({
      query: (id) => ({ url: `/${id}`, method: "get" }),
      transformResponse: asUser,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
    }),
    addUser: build.mutation<User, UserFormValues>({
      query: (body) => ({ url: "", method: "post", data: body }),
      transformResponse: asUser,
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    // PUT подменяет запись целиком, без createdAt дата на карточке пропадает.
    editUser: build.mutation<User, { id: string; input: UserFormValues; createdAt?: string }>({
      query: ({ id, input, createdAt }) => ({
        url: `/${id}`,
        method: "put",
        data: createdAt ? { ...input, createdAt } : input,
      }),
      transformResponse: asUser,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Users", id: "LIST" }, { type: "User", id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useAddUserMutation, useEditUserMutation } = usersApi;
