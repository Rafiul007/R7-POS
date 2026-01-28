import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components';
import { Home, Products, Inventory, Payments, CartPayment } from './pages';

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/payments' element={<Payments />} />
        <Route path='/cart-payment' element={<CartPayment />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
