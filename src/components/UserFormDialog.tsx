import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { queryError } from "../api.ts";
import type { User } from "../types.ts";
import { emptyUserForm, userFormSchema, type UserFormValues } from "../userSchema.ts";
import { useAddUserMutation, useEditUserMutation } from "../usersApi.ts";

type UserFormDialogProps = {
  open: boolean;
  user: User | null;
  onClose: () => void;
};

type UserFormProps = {
  user: User | null;
  onClose: () => void;
};

type FormTextFieldProps = {
  name: keyof UserFormValues;
  label: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  minRows?: number;
  hint?: string;
  autoFocus?: boolean;
};

function FormTextField({ name, label, required, type, multiline, minRows, hint, autoFocus }: FormTextFieldProps) {
  const { control } = useFormContext<UserFormValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          autoFocus={autoFocus}
          label={label}
          type={type}
          required={required}
          multiline={multiline}
          minRows={minRows}
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? hint}
        />
      )}
    />
  );
}

export function UserFormDialog({ open, user, onClose }: UserFormDialogProps) {
  if (!open) return null;
  return <UserForm key={user?.id ?? "new"} user={user} onClose={onClose} />;
}

function UserForm({ user, onClose }: UserFormProps) {
  const { name, email, phone, city, company, position, avatar, about } = user ?? emptyUserForm;
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { name, email, phone, city, company, position, avatar, about },
  });
  const [addUser, addState] = useAddUserMutation();
  const [editUser, editState] = useEditUserMutation();
  const saving = user ? editState.isLoading : addState.isLoading;
  const saveError = user ? editState.error : addState.error;

  async function onSubmit(values: UserFormValues) {
    try {
      if (user) await editUser({ id: user.id, input: values, createdAt: user.createdAt }).unwrap();
      else await addUser(values).unwrap();
      onClose();
    } catch {
      // Текст ошибки уже лежит в состоянии мутации.
    }
  }

  return (
    <FormProvider {...form}>
      <Dialog
        open
        onClose={() => {
          if (!saving) onClose();
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{user ? "Редактирование" : "Новый пользователь"}</DialogTitle>
        <form noValidate onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <DialogContent sx={{ display: "grid", gap: 2 }}>
            {saveError && <Alert severity="error">{queryError(saveError, "Не удалось сохранить пользователя.")}</Alert>}
            <FormTextField name="name" label="Имя" required autoFocus />
            <FormTextField name="email" label="Почта" type="email" required />
            <FormTextField name="phone" label="Телефон" />
            <FormTextField name="city" label="Город" />
            <FormTextField name="company" label="Компания" />
            <FormTextField name="position" label="Должность" />
            <FormTextField name="avatar" label="Ссылка на фото" hint="Необязательно. Если пусто, будут инициалы." />
            <FormTextField name="about" label="О себе" multiline minRows={3} />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => { if (!saving) onClose(); }} disabled={saving}>
              Отмена
            </Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </FormProvider>
  );
}
