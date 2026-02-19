import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { LoginScreen } from '@/modules/auth/components/LoginScreen';
import { DashboardLayout } from '@/shared/layouts/DashboardLayout';
import { CalculatorLayout } from '@/modules/calculator/components/CalculatorLayout';
import { CostsPage } from '@/modules/costs/pages/CostsPage';
import { UserManagementPage } from '@/modules/admin/pages/UserManagementPage';
import { BenefitsPage } from '@/modules/benefits/pages/BenefitsPage';
import { BenefitsProvider } from '@/shared/context/BenefitsContext';
import { ExchangeRateProvider } from '@/shared/context/ExchangeRateContext';
import { TollsProvider } from '@/shared/context/TollsContext';

function App() {
  const { user, status, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (status === 'checking') {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#0a0e17] transition-colors duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 relative z-10" />
        </div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium tracking-wide animate-pulse">
          Sincronizando seguridad...
        </p>
      </div>
    );
  }

  if (status === 'unauthenticated' || !user) {
    return <LoginScreen />;
  }

  return (
    <BrowserRouter>
      <BenefitsProvider>
        <ExchangeRateProvider>
          <TollsProvider>
            <Routes>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/cotizador" replace />} />
                <Route path="cotizador" element={<CalculatorLayout />} />
                <Route path="matriz-costos" element={<CostsPage />} />
                <Route path="matriz-beneficios" element={<BenefitsPage />} />
                <Route path="usuarios" element={<UserManagementPage />} />
                <Route
                  path="notas"
                  element={
                    <div className="p-8 text-slate-500 dark:text-slate-400 italic">
                      El gestor de notas estará disponible pronto.
                    </div>
                  }
                />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TollsProvider>
        </ExchangeRateProvider>
      </BenefitsProvider>
    </BrowserRouter>
  );
}

export default App;