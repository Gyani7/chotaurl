import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { AdminPage } from "@/pages/admin";
import { DocsPage } from "@/pages/docs";
import { ExpiredPage } from "@/pages/expired";
import { LinkNotFoundPage } from "@/pages/link-not-found";
import { NotFoundPage } from "@/pages/not-found";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/expired" element={<ExpiredPage />} />
      <Route path="/link-not-found" element={<LinkNotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
