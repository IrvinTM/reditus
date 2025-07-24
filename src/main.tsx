import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from "react-router";
import Sales from './components/sales/Sales.tsx';
import { Settings } from 'lucide-react';
import Products from './components/products/ProductsPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/productos" element={<Products/>} />
      <Route path="/vender" element={<Sales/>} />
      <Route path="/ajustes" element={<Settings/>} />

    </Routes>
</BrowserRouter>
  </StrictMode>,
)
