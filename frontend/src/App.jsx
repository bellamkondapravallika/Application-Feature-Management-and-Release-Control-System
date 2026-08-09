import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ToastProvider from './components/ToastProvider';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import FeatureFlagsPage from './pages/FeatureFlagsPage';
import EnvironmentsPage from './pages/EnvironmentsPage';
import OverridesPage from './pages/OverridesPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';
import GroupManagementPage from './pages/GroupManagementPage';
import GroupMembersPage from './pages/GroupMembersPage';
import TargetingRulesPage from './pages/TargetingRulesPage';
import SDKDocumentationPage from "./pages/SDKDocumentationPage";
import IntegrationExamplePage from "./pages/IntegrationExamplePage";

const App = () => {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="feature-flags" element={<FeatureFlagsPage />} />
          <Route path="environments" element={<EnvironmentsPage />} />
          <Route path="overrides" element={<OverridesPage />} />
          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="group-management" element={<GroupManagementPage />} />
          <Route path="group-members" element={<GroupMembersPage />} />
          <Route path="targeting-rules" element={<TargetingRulesPage />} />
          <Route path="/sdk-documentation" element={<SDKDocumentationPage />} />
          <Route path="/integration-examples" element={<IntegrationExamplePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      
    </ToastProvider>
  );
};

export default App;
