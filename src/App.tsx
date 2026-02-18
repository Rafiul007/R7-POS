import { Routes, Route, Navigate } from 'react-router-dom';
import { AlertProvider, DashboardLayout } from './components';
import {
  Home,
  Products,
  Inventory,
  BranchSearch,
  Payments,
  CartPayment,
  Drawer,
  BulkUpload,
  Login,
  Signup,
} from './pages';
import { AuthProvider, ProtectedRoute, useAuth } from './auth';

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AlertProvider>
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
      <Route path='/branch-search' element={withDashboard(<BranchSearch />)} />
      <Route path='/payments' element={withDashboard(<Payments />)} />
      <Route path='/drawer' element={withDashboard(<Drawer />)} />
      <Route path='/bulk-upload' element={withDashboard(<BulkUpload />)} />
      <Route path='/cart-payment' element={withDashboard(<CartPayment />)} />
      <Route
        path='*'
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};
