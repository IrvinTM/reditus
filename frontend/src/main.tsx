import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from "react-router";
import Sales from './components/sales/Sales.tsx';
import Settings from './components/Settings.tsx';
import Products from './components/products/ProductsPage.tsx';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider.tsx';
import SaleHistory from './components/sales/SalesHistoryPage.tsx';
import SaleViewPage from './components/sales/SaleViewPage.tsx';
import CustomersPage from './components/customers/CustomersPage.tsx';
import SuppliersPage from './components/suppliers/SuppliersPage.tsx';
import UsersManagement from './components/users/UsersManagement.tsx';
import ThemeSettings from './components/settings/ThemeSettings.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import ProtectedRoute from './auth/ProtectedRoute.tsx';
import LoginPage from './auth/LoginPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="reditus-theme">
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
      <Route path="/productos" element={<ProtectedRoute><Products/></ProtectedRoute>} />
      <Route path="/clientes" element={<ProtectedRoute><CustomersPage/></ProtectedRoute>} />
      <Route path="/proveedores" element={<ProtectedRoute><SuppliersPage/></ProtectedRoute>} />
      <Route path="/vender" element={<ProtectedRoute><Sales/></ProtectedRoute>} />
      <Route path="/ajustes" element={<ProtectedRoute><Settings/></ProtectedRoute>} />
      <Route path="/ajustes/tema" element={<ProtectedRoute><ThemeSettings/></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><UsersManagement/></ProtectedRoute>} />
      <Route path="/historialdeventas" element={<ProtectedRoute><SaleHistory/></ProtectedRoute>} />
      <Route path="/ventas/:saleId" element={<ProtectedRoute><SaleViewPage/></ProtectedRoute>} />

    </Routes>
</BrowserRouter>

    <Toaster position="top-right"/>
</ThemeProvider>
    </AuthProvider>
  </StrictMode>,

)
