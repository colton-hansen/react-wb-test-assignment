import Avatar from "@mui/material/Avatar";
import { initials } from "../format.ts";

type UserAvatarProps = {
  name: string;
  avatar: string;
  size?: number;
};

export function UserAvatar({ name, avatar, size = 40 }: UserAvatarProps) {
  return (
    <Avatar src={avatar || undefined} alt={name} sx={{ width: size, height: size, bgcolor: "#dbe4ff", color: "#1e3a8a" }}>
      {initials(name)}
    </Avatar>
  );
}
