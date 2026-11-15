import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function Field({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography>{value.trim() ? value : "-"}</Typography>
    </Box>
  );
}
