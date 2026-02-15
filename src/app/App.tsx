import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { LoginScreen } from '@/modules/auth/components/LoginScreen';
import { DashboardLayout } from '@/shared/layouts/DashboardLayout';
import { CalculatorLayout } from '@/modules/calculator/components/CalculatorLayout';
import { CostsPage } from '@/modules/costs/pages/CostsPage';
import { UserManagementPage } from '@/modules/admin/pages/UserManagementPage';

function App() {
  const { user } = useAuthStore();

  if (!user) return <LoginScreen />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/cotizador" replace />} />
          <Route path="cotizador" element={<CalculatorLayout />} />
          <Route path="matriz-costos" element={<CostsPage />} />
          <Route path="usuarios" element={<UserManagementPage />} />
          <Route path="notas" element={<div className="p-8 text-slate-500">Historial de Notas</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;