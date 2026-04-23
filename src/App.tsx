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
  AdminActions,
  AdminProducts,
  AdminCatalog,
} from './pages';
import { AuthProvider, ProtectedRoute, useAuth } from './auth';

const ADMIN_ACTION_EMPLOYEE_TYPES = new Set([
  'manager',
  'admin',
  'super-admin',
]);

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
  const { employeeType, isAuthenticated } = useAuth();
  const canAccessAdminActions = employeeType
    ? ADMIN_ACTION_EMPLOYEE_TYPES.has(employeeType.toLowerCase())
    : false;

  const withDashboard = (element: React.ReactNode) => (
    <ProtectedRoute>
      <DashboardLayout>{element}</DashboardLayout>
    </ProtectedRoute>
  );

  const withAdminActionAccess = (element: React.ReactNode) =>
    withDashboard(
      canAccessAdminActions ? element : <Navigate to='/' replace />
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
        path='/admin/actions'
        element={withAdminActionAccess(<AdminActions />)}
      />
      <Route
        path='/admin/actions/products'
        element={withAdminActionAccess(<AdminProducts />)}
      />
      <Route
        path='/admin/actions/catalog'
        element={withAdminActionAccess(<AdminCatalog />)}
      />
      <Route
        path='*'
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
};
