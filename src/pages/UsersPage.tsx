import { useCallback, useState } from "react";
import Stack from "@mui/material/Stack";
import { UserFormDialog } from "../components/UserFormDialog.tsx";
import { UsersAlerts } from "../components/UsersAlerts.tsx";
import { UsersHeader } from "../components/UsersHeader.tsx";
import { UsersList } from "../components/UsersList.tsx";
import { UsersPagination } from "../components/UsersPagination.tsx";
import type { User } from "../types.ts";

type FormState = {
  open: boolean;
  user: User | null;
};

export default function UsersPage() {
  const [form, setForm] = useState<FormState>({ open: false, user: null });
  const openCreate = useCallback(() => setForm({ open: true, user: null }), []);
  const openEdit = useCallback((user: User) => setForm({ open: true, user }), []);
  const closeForm = useCallback(() => setForm((current) => ({ ...current, open: false })), []);

  return (
    <Stack spacing={2}>
      <UsersHeader onCreate={openCreate} />
      <UsersAlerts />
      <UsersList onCreate={openCreate} onEdit={openEdit} />
      <UsersPagination />
      <UserFormDialog open={form.open} user={form.user} onClose={closeForm} />
    </Stack>
  );
}
