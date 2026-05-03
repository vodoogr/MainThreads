import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const { user, loading, error, signIn, signUp } = useAuthStore();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState('');

  if (user) {
    return <Navigate to="/inicio_sistema_neural_vivo" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    setMessage('');

    if (!email || !password) {
      setLocalError('Introduce tu email y tu contrasena.');
      return;
    }

    const action = mode === 'signin' ? signIn : signUp;
    const { error: authError } = await action({ email, password });

    if (authError) {
      setLocalError(authError.message);
      return;
    }

    if (mode === 'signup') {
      setMessage('Cuenta creada. Revisa tu email si Supabase pide confirmacion antes de entrar.');
    }
  };

  return (
    <ScreenContainer className="auth-screen">
      <section className="auth-shell">
        <div className="auth-hero">
          <span className="label-xs" style={{ color: 'var(--primary)' }}>ESPACIO PRIVADO</span>
          <h1 className="auth-title">Mental Threads</h1>
          <p className="auth-copy">
            Tu mapa mental ahora puede vivir protegido por sesion. Solo tus entradas
            autenticadas deberian ser visibles para ti.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-toggle">
            <button
              type="button"
              className={mode === 'signin' ? 'active' : ''}
              onClick={() => setMode('signin')}
            >
              Entrar
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Crear cuenta
            </button>
          </div>

          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </label>

          <label className="auth-field">
            <span>Contrasena</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimo 6 caracteres"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>

          {(localError || error) && (
            <div className="auth-feedback auth-error">{localError || error}</div>
          )}

          {message && (
            <div className="auth-feedback auth-success">{message}</div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Procesando...' : mode === 'signin' ? 'Entrar a mis hilos' : 'Crear cuenta'}
          </button>
        </form>
      </section>
    </ScreenContainer>
  );
}
