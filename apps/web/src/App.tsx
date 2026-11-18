import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import CompareVersionsPage from "./pages/CompareVersionsPage";
import VersionReviewPage from "./pages/VersionReviewPage";
import PortfolioManagePage from "./pages/PortfolioManagePage";
import PublicPortfolioPage from "./pages/PublicPortfolioPage";
import PublicProjectStoryPage from "./pages/PublicProjectStoryPage";
import SettingsPage from "./pages/SettingsPage";
import { WorkspaceLayout } from "./components/layout/WorkspaceLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/p/:username" element={<PublicPortfolioPage />} />
      <Route path="/p/:username/projects/:projectId" element={<PublicProjectStoryPage />} />
      <Route element={<WorkspaceLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<CreateProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:id/compare" element={<CompareVersionsPage />} />
        <Route path="/projects/:id/versions/:versionId" element={<VersionReviewPage />} />
        <Route path="/portfolio" element={<PortfolioManagePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}