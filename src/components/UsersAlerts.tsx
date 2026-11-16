import { memo } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import { queryError } from "../api.ts";
import { useAppSelector } from "../hooks.ts";
import { selectUserCount } from "../selectors.ts";
import { useGetUsersQuery } from "../usersApi.ts";

export const UsersAlerts = memo(function UsersAlerts() {
  const count = useAppSelector(selectUserCount);
  const { isError, error, isFetching, refetch } = useGetUsersQuery();

  return (
    <>
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
