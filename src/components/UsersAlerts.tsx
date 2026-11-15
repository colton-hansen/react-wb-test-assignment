import { memo } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { queryError } from "../api.ts";
import { useAppSelector } from "../hooks.ts";
import { selectUserCount } from "../selectors.ts";
import { useGetUsersQuery } from "../usersApi.ts";

const apiUrl = import.meta.env.VITE_API_URL ?? "";
const localApi = apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1");

export const UsersAlerts = memo(function UsersAlerts() {
  const count = useAppSelector(selectUserCount);
  const { isError, error, isFetching, refetch } = useGetUsersQuery();

  return (
    <>
      {localApi && <Alert severity="warning">Данные идут с локального сервера. Перед сдачей замените VITE_API_URL на адрес mockapi.</Alert>}
      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        >
          {queryError(error, "Не удалось загрузить список.")}
        </Alert>
      )}
      {isFetching && count > 0 && <LinearProgress />}
    </>
  );
});
