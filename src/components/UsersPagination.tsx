import { memo } from "react";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useAppDispatch, useAppSelector } from "../hooks.ts";
import { setPage, setRowsPerPage } from "../listUiSlice.ts";
import { selectSafePage, selectUserCount } from "../selectors.ts";

export const UsersPagination = memo(function UsersPagination() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectUserCount);
  const page = useAppSelector(selectSafePage);
  const rowsPerPage = useAppSelector((state) => state.listUi.rowsPerPage);

  if (count === 0) return null;

  return (
    <Paper variant="outlined">
      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(_, next) => dispatch(setPage(next))}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => dispatch(setRowsPerPage(Number(event.target.value)))}
        rowsPerPageOptions={[5, 10, 20]}
        labelRowsPerPage="На странице"
        labelDisplayedRows={({ from, to, count: total }) => `${from}-${to} из ${total}`}
      />
    </Paper>
  );
});
