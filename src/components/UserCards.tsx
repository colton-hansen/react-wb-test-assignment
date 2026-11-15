import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { contactLine } from "../format.ts";
import type { User } from "../types.ts";
import { UserAvatar } from "./UserAvatar.tsx";

type Props = {
  users: User[];
  onEdit: (user: User) => void;
};

export function UserCards({ users, onEdit }: Props) {
  const navigate = useNavigate();

  return (
    <Stack spacing={1.5}>
      {users.map((user) => (
        <Paper key={user.id} variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <UserAvatar name={user.name} avatar={user.avatar} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontWeight: 650 }} noWrap>
                {user.name || "Без имени"}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email || "Почта не указана"}
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {contactLine([user.phone, user.city, user.company])}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Button size="small" onClick={() => navigate(`/users/${user.id}`)}>
              Открыть
            </Button>
            <Button size="small" onClick={() => onEdit(user)}>
              Изменить
            </Button>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
