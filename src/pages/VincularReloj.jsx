import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import { useNeuralStore } from '../store/neuralStore';

export default function VincularReloj() {
  const navigate = useNavigate();
  const { connectedWatch, syncWatch } = useNeuralStore();
  const [clientId, setClientId] = useState('');
  const [isLinking, setIsLinking] = useState(false);

  const handleLink = async () => {
    setIsLinking(true);
    // Simulación de apertura de ventana OAuth de Huawei
    await syncWatch();
    setTimeout(() => {
      setIsLinking(false);
      navigate('/inicio_sistema_neural_vivo');
    }, 2000);
  };

  return (
    <ScreenContainer>
      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        <header>
          <button 
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', marginBottom: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <span className="material-symbols-outlined">arrow_back</span> Volver
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 300 }}>Centro de <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Dispositivos</span></h1>
        </header>

        <section className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: '50%', background: 'rgba(137,212,205,0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' 
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--primary)' }}>watch</span>
          </div>
          
          <h2 style={{ fontSize: '1.25rem', marginBottom: 8 }}>{connectedWatch ? 'Huawei Watch GT5 Conectado' : 'Vincular Huawei Watch'}</h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Sincroniza tu variabilidad cardíaca (HRV) y niveles de estrés para una evolución neural precisa.
          </p>

          {!connectedWatch ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300, margin: '0 auto' }}>
              <input 
                type="text"
                placeholder="Introducir Huawei Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                style={{ 
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
                  padding: '12px', borderRadius: '12px', color: 'white', textAlign: 'center' 
                }}
              />
              <button 
                onClick={handleLink}
                disabled={isLinking}
                className="btn-primary"
                style={{ padding: '12px', borderRadius: '12px', fontWeight: 600 }}
              >
                {isLinking ? 'AUTORIZANDO EN HUAWEI...' : 'VINCULAR AHORA'}
              </button>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--primary)', borderRadius: '1rem', padding: '1rem', background: 'rgba(137,212,205,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="label-xs">Batería</span>
                <span style={{ color: 'var(--primary)' }}>{connectedWatch.battery}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="label-xs">Última descarga de datos</span>
                <span>Hoy, 22:45h</span>
              </div>
              <button 
                onClick={() => { /* Lógica de desvinculación */ }}
                style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#fa746f', cursor: 'pointer', fontSize: '0.8rem' }}
              >
                Desvincular dispositivo
              </button>
            </div>
          )}
        </section>

        <section style={{ opacity: 0.6 }}>
           <h3 className="label-xs" style={{ marginBottom: 12 }}>¿Cómo obtener mi Client ID?</h3>
           <ol style={{ fontSize: '0.8rem', paddingLeft: '1.2rem', lineHeight: 1.6 }}>
             <li>Entra en el portal de <a href="https://developer.huawei.com/" style={{ color: 'var(--primary)' }}>HUAWEI Developers</a>.</li>
             <li>Crea un proyecto en "AppGallery Connect".</li>
             <li>Habilita "Health Kit" en la sección de APIs.</li>
             <li>Copia el Client ID de tu aplicación.</li>
           </ol>
        </section>
      </div>
    </ScreenContainer>
  );
}
