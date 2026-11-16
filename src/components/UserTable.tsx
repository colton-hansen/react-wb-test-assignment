import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import type { User } from "../types.ts";
import { UserAvatar } from "./UserAvatar.tsx";

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
};

const columns = [
  { label: "Имя", width: "22%" },
  { label: "Почта", width: "26%" },
  { label: "Телефон", width: "18%" },
  { label: "Город", width: "15%" },
  { label: "Компания", width: "15%" },
] as const;

const clippedCell = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

export function UserTable({ users, onEdit }: UserTableProps) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Список пользователей" sx={{ tableLayout: "fixed", width: "100%" }}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.label} style={{ width: column.width }} />
          ))}
          <col style={{ width: 72 }} />
        </colgroup>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.label} sx={clippedCell}>
                {column.label}
              </TableCell>
            ))}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
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
              <TableCell sx={clippedCell}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
                  <Box sx={{ display: "flex", flexShrink: 0 }}>
                    <UserAvatar name={user.name} avatar={user.avatar} size={36} />
                  </Box>
                  <Box component="span" title={user.name || undefined} sx={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {user.name || "Без имени"}
                  </Box>
                </Stack>
              </TableCell>
              <TableCell title={user.email || undefined} sx={clippedCell}>
                {user.email || "-"}
              </TableCell>
              <TableCell title={user.phone || undefined} sx={clippedCell}>
                {user.phone || "-"}
              </TableCell>
              <TableCell title={user.city || undefined} sx={clippedCell}>
                {user.city || "-"}
              </TableCell>
              <TableCell title={user.company || undefined} sx={clippedCell}>
                {user.company || "-"}
              </TableCell>
              <TableCell align="right" sx={{ px: 1 }}>
                <Tooltip title="Редактировать">
                  <IconButton
                    aria-label={`Редактировать ${user.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(user);
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
  );
}
