import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';

import InicioSistemaNeuralVivo from './pages/InicioSistemaNeuralVivo';
import NuevaEntrada from './pages/NuevaEntrada';
import DetalleDeNodo from './pages/DetalleDeNodo';
import Historial from './pages/Historial';
import PerspectivasInsights from './pages/PerspectivasInsights';
import EthericSlate from './pages/EthericSlate';

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Navigate to="/inicio_sistema_neural_vivo" replace />} />
        <Route path="/inicio_sistema_neural_vivo" element={<InicioSistemaNeuralVivo />} />
        <Route path="/nueva_entrada" element={<NuevaEntrada />} />
        <Route path="/detalle_de_nodo" element={<DetalleDeNodo />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/perspectivas_insights" element={<PerspectivasInsights />} />
        <Route path="/etheric_slate" element={<EthericSlate />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  );
}
