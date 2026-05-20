import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ApplicationFormPage from "./pages/ApplicationFormPage";
import ApplicationListPage from "./pages/ApplicationListPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/applications" replace />} />
        <Route path="/applications" element={<ApplicationListPage />} />
        <Route path="/applications/new" element={<ApplicationFormPage mode="create" />} />
        <Route path="/applications/:id/edit" element={<ApplicationFormPage mode="edit" />} />
        <Route path="/applications/:id" element={<ApplicationDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

