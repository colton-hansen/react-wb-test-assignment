import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { queryError } from "../api.ts";
import { UserDetailsCard } from "../components/UserDetailsCard.tsx";
import { UserFormDialog } from "../components/UserFormDialog.tsx";
import { useAppSelector } from "../hooks.ts";
import { selectUserById } from "../selectors.ts";
import { useGetUserQuery } from "../usersApi.ts";

export default function UserDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const cached = useAppSelector((state) => selectUserById(state, id));
  const { data, isError, error, isFetching, refetch } = useGetUserQuery(id, { skip: !id });
  const user = isError ? null : (data ?? cached);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <Stack spacing={2}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ alignSelf: "flex-start" }}>
        К списку
      </Button>

      {isFetching && <LinearProgress />}

      {isError && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        >
          {queryError(error, "Не удалось открыть карточку.")}
        </Alert>
      )}

      {!user && !isError && (
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

      {user && <UserDetailsCard user={user} onEdit={() => setFormOpen(true)} />}
      {user && <UserFormDialog open={formOpen} user={user} onClose={() => setFormOpen(false)} />}
    </Stack>
  );
}
