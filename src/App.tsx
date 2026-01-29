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
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Home />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/products'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Products />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/inventory'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Inventory />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/payments'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Payments />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/cart-payment'
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CartPayment />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='*'
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};
