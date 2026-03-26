import { Routes, Route } from 'react-router-dom';
import { AdminProvider } from '../context/AdminContext';
import AdminLayout from '../components/features/admin/AdminLayout';
import ProductList from '../components/features/admin/ProductList';
import ProductForm from '../components/features/admin/ProductForm';
import AdminOrders from '../components/features/admin/AdminOrders';

export default function AdminPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/orders" element={<AdminOrders />} />
          <Route path="/new" element={<ProductForm />} />
          <Route path="/edit/:id" element={<ProductForm />} />
        </Routes>
      </AdminLayout>
    </AdminProvider>
  );
}
