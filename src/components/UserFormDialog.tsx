import { useEffect, useState, type FormEvent } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { addUser, clearSaveError, editUser } from "../usersSlice.ts";
import { useAppDispatch, useAppSelector } from "../hooks.ts";
import type { User, UserInput } from "../types.ts";

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
};

const empty: UserInput = {
  name: "",
  email: "",
  phone: "",
  city: "",
  company: "",
  position: "",
  avatar: "",
  about: "",
};

function toInput(user: User): UserInput {
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    company: user.company,
    position: user.position,
    avatar: user.avatar,
    about: user.about,
  };
}

function trimInput(input: UserInput): UserInput {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    city: input.city.trim(),
    company: input.company.trim(),
    position: input.position.trim(),
    avatar: input.avatar.trim(),
    about: input.about.trim(),
  };
}

function validate(input: UserInput): Partial<Record<keyof UserInput, string>> {
  const errors: Partial<Record<keyof UserInput, string>> = {};
  if (input.name.length < 2) errors.name = "Укажите имя, минимум 2 символа.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.email = "Укажите корректную почту.";
  if (input.phone && input.phone.length < 5) errors.phone = "Слишком короткий номер.";
  if (input.avatar && !/^https?:\/\/\S+$/i.test(input.avatar)) {
    errors.avatar = "Ссылка должна начинаться с http:// или https://.";
  }
  return errors;
}

export function UserFormDialog({ open, user, onClose }: Props) {
  const saving = useAppSelector((state) => state.users.saving);

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!saving) onClose();
      }}
      fullWidth
      maxWidth="sm"
    >
      {open && <UserForm key={user?.id ?? "new"} user={user} onClose={onClose} />}
    </Dialog>
  );
}

function UserForm({ user, onClose }: { user: User | null; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector((state) => state.users.saving);
  const saveError = useAppSelector((state) => state.users.saveError);
  const [values, setValues] = useState<UserInput>(() => (user ? toInput(user) : empty));
  const [errors, setErrors] = useState<Partial<Record<keyof UserInput, string>>>({});

  useEffect(() => {
    dispatch(clearSaveError());
  }, [dispatch]);

  function setField<K extends keyof UserInput>(key: K, value: UserInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const input = trimInput(values);
    const nextErrors = validate(input);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const result = user ? await dispatch(editUser({ id: user.id, input, createdAt: user.createdAt })) : await dispatch(addUser(input));

    if (addUser.fulfilled.match(result) || editUser.fulfilled.match(result)) onClose();
  }

  function handleClose() {
    if (!saving) onClose();
  }

  return (
    <>
      <DialogTitle>{user ? "Редактирование" : "Новый пользователь"}</DialogTitle>
      <form noValidate onSubmit={(event) => void handleSubmit(event)}>
        <DialogContent sx={{ display: "grid", gap: 2 }}>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <TextField autoFocus label="Имя" value={values.name} onChange={(event) => setField("name", event.target.value)} error={Boolean(errors.name)} helperText={errors.name} required />
          <TextField label="Почта" type="email" value={values.email} onChange={(event) => setField("email", event.target.value)} error={Boolean(errors.email)} helperText={errors.email} required />
          <TextField label="Телефон" value={values.phone} onChange={(event) => setField("phone", event.target.value)} error={Boolean(errors.phone)} helperText={errors.phone} />
          <TextField label="Город" value={values.city} onChange={(event) => setField("city", event.target.value)} />
          <TextField label="Компания" value={values.company} onChange={(event) => setField("company", event.target.value)} />
          <TextField label="Должность" value={values.position} onChange={(event) => setField("position", event.target.value)} />
          <TextField label="Ссылка на фото" value={values.avatar} onChange={(event) => setField("avatar", event.target.value)} error={Boolean(errors.avatar)} helperText={errors.avatar || "Необязательно. Если пусто, будут инициалы."} />
          <TextField label="О себе" value={values.about} onChange={(event) => setField("about", event.target.value)} multiline minRows={3} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={saving}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogActions>
      </form>
    </>
  );
}
