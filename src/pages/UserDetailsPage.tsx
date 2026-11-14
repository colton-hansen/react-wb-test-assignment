import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { UserAvatar } from "../components/UserAvatar.tsx";
import { UserFormDialog } from "../components/UserFormDialog.tsx";
import { formatDate } from "../format.ts";
import { useAppDispatch, useAppSelector } from "../hooks.ts";
import { loadUser } from "../usersSlice.ts";

export default function UserDetailsPage() {
  const { id = "" } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, current, currentStatus, currentError } = useAppSelector((state) => state.users);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    void dispatch(loadUser(id));
  }, [dispatch, id]);

  const fromList = items.find((item) => item.id === id);
  const fresh = current?.id === id ? current : null;
  const user = currentStatus === "failed" ? null : (fresh ?? fromList ?? null);

  return (
    <Stack spacing={2}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ alignSelf: "flex-start" }}>
        К списку
      </Button>

      {currentStatus === "loading" && <LinearProgress />}

      {currentStatus === "failed" && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void dispatch(loadUser(id))}>
              Повторить
            </Button>
          }
        >
          {currentError}
        </Alert>
      )}

      {!user && currentStatus !== "failed" && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Skeleton variant="circular" width={84} height={84} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" height={40} />
              <Skeleton width="25%" />
            </Box>
          </Stack>
        </Paper>
      )}

      {user && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
            <UserAvatar name={user.name} avatar={user.avatar} size={84} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4">{user.name || "Без имени"}</Typography>
              <Typography color="text.secondary">{[user.position, user.company].filter(Boolean).join(" · ") || "Должность не указана"}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                ID {user.id}
              </Typography>
            </Box>
            <Button variant="outlined" onClick={() => setFormOpen(true)}>
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
      )}

      {user && <UserFormDialog open={formOpen} user={user} onClose={() => setFormOpen(false)} />}
    </Stack>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value.trim() ? value : "-"}</Typography>
    </Box>
  );
}
