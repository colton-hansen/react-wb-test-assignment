import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { formatDate, roleLine } from "../format.ts";
import type { User } from "../types.ts";
import { Field } from "./Field.tsx";
import { UserAvatar } from "./UserAvatar.tsx";

type Props = {
  user: User;
  onEdit: () => void;
};

export function UserDetailsCard({ user, onEdit }: Props) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
        <UserAvatar name={user.name} avatar={user.avatar} size={84} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">{user.name || "Без имени"}</Typography>
          <Typography color="text.secondary">{roleLine([user.position, user.company])}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            ID {user.id}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={onEdit}>
          Редактировать
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
          mt: 3,
        }}
      >
        <Field label="Почта" value={user.email} />
        <Field label="Телефон" value={user.phone} />
        <Field label="Город" value={user.city} />
        <Field label="Компания" value={user.company} />
        <Field label="Должность" value={user.position} />
        <Field label="Добавлен" value={formatDate(user.createdAt)} />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          О себе
        </Typography>
        <Typography sx={{ whiteSpace: "pre-wrap" }}>{user.about.trim() || "-"}</Typography>
      </Box>
    </Paper>
  );
}
