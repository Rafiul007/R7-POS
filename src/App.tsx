import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components';
import {
  Home,
  Products,
  Inventory,
  Payments,
  CartPayment,
  Login,
  Signup,
} from './pages';
import { AuthProvider, ProtectedRoute, useAuth } from './auth';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  const withDashboard = (element: React.ReactNode) => (
    <ProtectedRoute>
      <DashboardLayout>{element}</DashboardLayout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route
        path='/login'
        element={isAuthenticated ? <Navigate to='/' replace /> : <Login />}
      />
      <Route
        path='/signup'
        element={isAuthenticated ? <Navigate to='/' replace /> : <Signup />}
      />
      <Route path='/' element={withDashboard(<Home />)} />
      <Route path='/products' element={withDashboard(<Products />)} />
      <Route path='/inventory' element={withDashboard(<Inventory />)} />
      <Route path='/payments' element={withDashboard(<Payments />)} />
      <Route path='/cart-payment' element={withDashboard(<CartPayment />)} />
      <Route
        path='*'
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};
