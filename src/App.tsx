import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components';
import { Home, Products, Inventory, Payments } from './pages';

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Products />} />
        <Route path='/inventory' element={<Inventory />} />
        <Route path='/payments' element={<Payments />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
