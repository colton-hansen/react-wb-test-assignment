import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link as RouterLink, Route, Routes } from "react-router-dom";
import UserDetailsPage from "./pages/UserDetailsPage.tsx";
import UsersPage from "./pages/UsersPage.tsx";

export default function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <Link component={RouterLink} to="/" underline="none" color="inherit" variant="h6">
            Пользователи
          </Link>
        </Toolbar>
      </Box>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailsPage />} />
          <Route path="*" element={<Typography>Страница не найдена.</Typography>} />
        </Routes>
      </Container>
    </Box>
  );
}
