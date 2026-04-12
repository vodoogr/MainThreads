import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/inicio_sistema_neural_vivo', icon: 'home', label: 'Inicio', filledIcon: true },
  { to: '/historial', icon: 'history', label: 'Historial' },
  { to: '/perspectivas_insights', icon: 'auto_awesome', label: 'Perspectivas' },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav" id="bottom-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.to || (item.to === '/inicio_sistema_neural_vivo' && pathname === '/');
        return (
          <Link
            key={item.to}
            to={item.to}
            className={isActive ? 'active' : ''}
          >
            <span className={`material-symbols-outlined ${isActive && item.filledIcon ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
