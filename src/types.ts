export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  company: string;
  position: string;
  avatar: string;
  about: string;
  createdAt?: string;
};

export type UserInput = Omit<User, "id" | "createdAt">;
