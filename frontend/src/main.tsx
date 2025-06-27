import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from "react-router";
import Products from './components/Products.tsx';
import Sales from './components/Sales.tsx';
import { Settings } from 'lucide-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/productos" element={<Products/>} />
      <Route path="/ventas" element={<Sales/>} />
      <Route path="/ajustes" element={<Settings/>} />

    </Routes>
</BrowserRouter>
  </StrictMode>,
)
