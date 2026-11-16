import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type FieldProps = {
  label: string;
  value: string;
};

export function Field({ label, value }: FieldProps) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value.trim() ? value : "-"}</Typography>
    </Box>
  );
}
