import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';

import InicioSistemaNeuralVivo from './pages/InicioSistemaNeuralVivo';
import NuevaEntrada from './pages/NuevaEntrada';
import DetalleDeNodo from './pages/DetalleDeNodo';
import Historial from './pages/Historial';
import PerspectivasInsights from './pages/PerspectivasInsights';
import EthericSlate from './pages/EthericSlate';
import VincularReloj from './pages/VincularReloj';
import Login from './pages/Login';
import { useAuthStore } from './store/authStore';
import { useNeuralStore } from './store/neuralStore';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div className="app-loading">Conectando tu sesion...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppShell() {
  const location = useLocation();
  const { user } = useAuthStore();
  const hideChrome = location.pathname === '/login';

  return (
    <>
      {!hideChrome && user ? <AppHeader /> : null}
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/inicio_sistema_neural_vivo' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio_sistema_neural_vivo" element={<ProtectedRoute><InicioSistemaNeuralVivo /></ProtectedRoute>} />
        <Route path="/nueva_entrada" element={<ProtectedRoute><NuevaEntrada /></ProtectedRoute>} />
        <Route path="/detalle_de_nodo/:nodeId" element={<ProtectedRoute><DetalleDeNodo /></ProtectedRoute>} />
        <Route path="/historial" element={<ProtectedRoute><Historial /></ProtectedRoute>} />
        <Route path="/perspectivas_insights" element={<ProtectedRoute><PerspectivasInsights /></ProtectedRoute>} />
        <Route path="/etheric_slate" element={<ProtectedRoute><EthericSlate /></ProtectedRoute>} />
        <Route path="/vincular_reloj" element={<ProtectedRoute><VincularReloj /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? '/inicio_sistema_neural_vivo' : '/login'} replace />} />
      </Routes>
      {!hideChrome && user ? <BottomNav /> : null}
    </>
  );
}

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const bindAuthListener = useAuthStore((state) => state.bindAuthListener);
  const clearData = useNeuralStore((state) => state.clearData);

  useEffect(() => {
    initialize();
    const subscription = bindAuthListener();

    return () => {
      subscription?.unsubscribe();
    };
  }, [initialize, bindAuthListener]);

  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state, previous) => {
      if (previous?.user && !state.user) {
        clearData();
      }
    });

    return () => unsubscribe();
  }, [clearData]);

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
