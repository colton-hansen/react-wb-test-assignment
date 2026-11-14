import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { UserAvatar } from "../components/UserAvatar.tsx";
import { UserFormDialog } from "../components/UserFormDialog.tsx";
import { useAppDispatch, useAppSelector } from "../hooks.ts";
import type { User } from "../types.ts";
import { loadUsers, setPage, setRowsPerPage } from "../usersSlice.ts";

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));
  const { items, status, error, page, rowsPerPage } = useAppSelector((state) => state.users);
  const [formOpen, setFormOpen] = useState(false);
  const [formUser, setFormUser] = useState<User | null>(null);

  useEffect(() => {
    void dispatch(loadUsers());
  }, [dispatch]);

  // Режем список на клиенте: mockapi отдает все записи сразу и не присылает общее число.
  const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name, "ru"));
  const count = sorted.length;
  const maxPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);
  const safePage = Math.min(page, maxPage);

  useEffect(() => {
    if (page !== safePage) dispatch(setPage(safePage));
  }, [dispatch, page, safePage]);

  const visible = sorted.slice(safePage * rowsPerPage, safePage * rowsPerPage + rowsPerPage);
  const showSkeleton = status === "loading" && items.length === 0;
  const apiUrl = import.meta.env.VITE_API_URL ?? "";
  const localApi = apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1");

  function openCreate() {
    setFormUser(null);
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setFormUser(user);
    setFormOpen(true);
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h4">Пользователи</Typography>
          <Typography color="text.secondary">{showSkeleton ? "Загрузка..." : `${count} в списке`}</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          Добавить
        </Button>
      </Stack>

      {localApi && <Alert severity="warning">Данные идут с локального сервера. Перед сдачей замените VITE_API_URL на адрес mockapi.</Alert>}

      {status === "failed" && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void dispatch(loadUsers())}>
              Повторить
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {status === "loading" && items.length > 0 && <LinearProgress />}

      {showSkeleton &&
        (compact ? (
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
        ))}

      {!showSkeleton && count === 0 && status !== "loading" && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
          <Typography>Список пуст.</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={openCreate}>
            Добавить пользователя
          </Button>
        </Paper>
      )}

      {!showSkeleton && count > 0 && compact && (
        <Stack spacing={1.5}>
          {visible.map((user) => (
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
                {[user.phone, user.city, user.company].filter(Boolean).join(" · ") || "Контакты не заполнены"}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                <Button size="small" onClick={() => navigate(`/users/${user.id}`)}>
                  Открыть
                </Button>
                <Button size="small" onClick={() => openEdit(user)}>
                  Изменить
                </Button>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {!showSkeleton && count > 0 && !compact && (
        <TableContainer component={Paper} variant="outlined">
          <Table aria-label="Список пользователей">
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell>Почта</TableCell>
                <TableCell>Телефон</TableCell>
                <TableCell>Город</TableCell>
                <TableCell>Компания</TableCell>
                <TableCell align="right" width={72} />
              </TableRow>
            </TableHead>
            <TableBody>
              {visible.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  tabIndex={0}
                  onClick={() => navigate(`/users/${user.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") navigate(`/users/${user.id}`);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                      <UserAvatar name={user.name} avatar={user.avatar} size={36} />
                      <span>{user.name || "Без имени"}</span>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{user.city || "-"}</TableCell>
                  <TableCell>{user.company || "-"}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Редактировать">
                      <IconButton
                        aria-label={`Редактировать ${user.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          openEdit(user);
                        }}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {count > 0 && (
        <Paper variant="outlined">
          <TablePagination
            component="div"
            count={count}
            page={safePage}
            onPageChange={(_, next) => dispatch(setPage(next))}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(event) => dispatch(setRowsPerPage(Number(event.target.value)))}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="На странице"
            labelDisplayedRows={({ from, to, count: total }) => `${from}-${to} из ${total}`}
          />
        </Paper>
      )}

      <UserFormDialog open={formOpen} user={formUser} onClose={() => setFormOpen(false)} />
    </Stack>
  );
}
