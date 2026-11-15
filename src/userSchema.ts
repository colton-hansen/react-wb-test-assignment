import { z } from "zod";

const httpUrl = /^https?:\/\/\S+$/i;

export const userFormSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя, минимум 2 символа."),
  email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Укажите корректную почту."),
  phone: z.string().trim().refine((value) => value.length === 0 || value.length >= 5, "Слишком короткий номер."),
  city: z.string().trim(),
  company: z.string().trim(),
  position: z.string().trim(),
  avatar: z.string().trim().refine((value) => value.length === 0 || httpUrl.test(value), "Ссылка должна начинаться с http:// или https://."),
  about: z.string().trim(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const emptyUserForm: UserFormValues = {
  name: "",
  email: "",
  phone: "",
  city: "",
  company: "",
  position: "",
  avatar: "",
  about: "",
};
