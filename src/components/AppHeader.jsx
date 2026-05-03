import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function AppHeader({ subtitle }) {
  const { user, signOut, loading } = useAuthStore();
  const emailLabel = user?.email ? user.email.split('@')[0] : 'perfil';

  return (
    <header
      id="app-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg)',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Avatar placeholder */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1px solid rgba(72,72,72,0.15)',
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 18, color: 'var(--primary)' }}
            >
              person
            </span>
          </div>
          <Link
            to="/inicio_sistema_neural_vivo"
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              color: 'var(--on-surface)',
              letterSpacing: '-0.02em',
              textDecoration: 'none',
            }}
          >
            Mental Threads
          </Link>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--outline)',
              maxWidth: 120,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {emailLabel}
          </span>
          {subtitle && (
            <span
              style={{
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--outline-variant)',
                marginLeft: 4,
              }}
            >
              {subtitle}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--outline-variant)',
            }}
          >
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </span>
          <button
            style={{
              color: 'var(--primary)',
              background: 'transparent',
              border: '1px solid rgba(137,212,205,0.2)',
              cursor: 'pointer',
              padding: '0.5rem 0.9rem',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onClick={() => signOut()}
            disabled={loading}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            <span className="label-xs" style={{ letterSpacing: '0.08em' }}>Salir</span>
          </button>
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--surface-container)' }} />
    </header>
  );
}
