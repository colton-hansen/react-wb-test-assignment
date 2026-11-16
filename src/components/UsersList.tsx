import { memo } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useAppSelector } from "../hooks.ts";
import { selectUserCount, selectVisibleUsers } from "../selectors.ts";
import type { User } from "../types.ts";
import { useGetUsersQuery } from "../usersApi.ts";
import { UserCards } from "./UserCards.tsx";
import { UserTable } from "./UserTable.tsx";

type UsersListProps = {
  onCreate: () => void;
  onEdit: (user: User) => void;
};

export const UsersList = memo(function UsersList({ onCreate, onEdit }: UsersListProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));
  const users = useAppSelector(selectVisibleUsers);
  const count = useAppSelector(selectUserCount);
  const { isLoading, isError } = useGetUsersQuery();
  const showSkeleton = isLoading && count === 0;

  if (showSkeleton) {
    return compact ? (
      <Stack spacing={1.5}>
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} variant="rounded" height={108} />
        ))}
      </Stack>
    ) : (
      <Paper variant="outlined">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} height={52} sx={{ mx: 2 }} />
        ))}
      </Paper>
    );
  }

  if (!isError && count === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
        <Typography>Список пуст.</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={onCreate}>
          Добавить пользователя
        </Button>
      </Paper>
    );
  }

  if (count === 0) return null;
  if (compact) return <UserCards users={users} onEdit={onEdit} />;
  return <UserTable users={users} onEdit={onEdit} />;
});
