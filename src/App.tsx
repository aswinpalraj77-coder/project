import { RouterProvider, useRouter } from '@/router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { CitizenPortal } from '@/pages/citizen/CitizenPortal';
import { OfficerPortal } from '@/pages/officer/OfficerPortal';
import { AdminPortal } from '@/pages/admin/AdminPortal';

function Routes() {
  const { path } = useRouter();
  const { user } = useAuth();

  if (path === '/' || path === '') return <LandingPage />;
  if (path === '/login') return <LoginPage />;

  // portal routes — require auth
  if (path.startsWith('/citizen')) {
    if (!user || user.role !== 'citizen') return <LoginPage />;
    return <CitizenPortal />;
  }
  if (path.startsWith('/officer')) {
    if (!user || user.role !== 'officer') return <LoginPage />;
    return <OfficerPortal />;
  }
  if (path.startsWith('/admin')) {
    if (!user || user.role !== 'admin') return <LoginPage />;
    return <AdminPortal />;
  }

  return <LandingPage />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider>
            <Routes />
          </RouterProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
