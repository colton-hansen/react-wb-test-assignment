import { memo } from "react";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAppSelector } from "../hooks.ts";
import { selectUserCount } from "../selectors.ts";
import { useGetUsersQuery } from "../usersApi.ts";

type Props = {
  onCreate: () => void;
};

export const UsersHeader = memo(function UsersHeader({ onCreate }: Props) {
  const count = useAppSelector(selectUserCount);
  const { isLoading } = useGetUsersQuery();

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
      <Box>
        <Typography variant="h4">Пользователи</Typography>
        <Typography color="text.secondary">{isLoading && count === 0 ? "Загрузка..." : `${count} в списке`}</Typography>
      </Box>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onCreate}>
        Добавить
      </Button>
    </Stack>
  );
});
