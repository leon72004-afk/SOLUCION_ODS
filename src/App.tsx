import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ConsumosView } from './components/ConsumosView';
import { SedesView } from './components/SedesView';
import { FactoresView } from './components/FactoresView';
import { CompensacionesView } from './components/CompensacionesView';
import { AcademicDocumentView } from './components/AcademicDocumentView';
import { LoginView } from './components/LoginView';
import { dbStore } from './services/dbStore';
import { Check } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [, setTick] = useState(0);
  const [openNuevoConsumoModal, setOpenNuevoConsumoModal] = useState(false);
  const [openNuevaCompensacionModal, setOpenNuevaCompensacionModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Suscribirse a cambios en la base de datos persistente
  useEffect(() => {
    const unsubscribe = dbStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return () => unsubscribe();
  }, []);

  const currentUser = dbStore.getCurrentUser();
  const empresa = dbStore.getEmpresaActiva();

  const handleExportSql = () => {
    const sqlContent = dbStore.generatePhpMyAdminSqlDump();
    const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `gestion_carbono_ods13_phpmyadmin_${Date.now()}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Script SQL para phpMyAdmin descargado con éxito.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGoToConsumosModal = () => {
    setActiveTab('consumos');
    setOpenNuevoConsumoModal(true);
  };

  const handleGoToCompensacionesModal = () => {
    setActiveTab('compensaciones');
    setOpenNuevaCompensacionModal(true);
  };

  const handleLogout = () => {
    dbStore.logout();
    setTick((t) => t + 1);
    showToast('Sesión cerrada correctamente.');
  };

  // Si no hay un usuario autenticado, mostrar la pantalla de Login
  if (!currentUser) {
    return (
      <LoginView
        onLoginSuccess={() => {
          setTick((t) => t + 1);
          showToast(`¡Bienvenido! Sesión iniciada.`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Barra de Navegación Principal (Multi-Empresa y Sesión) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onExportSql={handleExportSql}
        onLogout={handleLogout}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={setActiveTab}
            onOpenNuevoConsumo={handleGoToConsumosModal}
            onOpenNuevaCompensacion={handleGoToCompensacionesModal}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'consumos' && (
          <ConsumosView
            isModalOpenInitial={openNuevoConsumoModal}
            onCloseInitialModal={() => setOpenNuevoConsumoModal(false)}
          />
        )}

        {activeTab === 'sedes' && <SedesView />}

        {activeTab === 'factores' && <FactoresView />}

        {activeTab === 'compensaciones' && (
          <CompensacionesView
            isModalOpenInitial={openNuevaCompensacionModal}
            onCloseInitialModal={() => setOpenNuevaCompensacionModal(false)}
          />
        )}

        {activeTab === 'documento' && <AcademicDocumentView />}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Pie de Página Académico */}
      <footer className="no-print bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="font-semibold text-slate-800">
              EcoTrack ODS 13 · Plataforma Multi-Empresa de Gestión de Huella de Carbono
            </div>
            <div>
              Fundación Universitaria del Área Andina · Facultad de Ingenierías y Ciencias Básicas · Eje 2 & Eje 3
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px]">
            <span>Organización Activa: #{empresa?.id_empresa}</span>
            <span>·</span>
            <span>MySQL / phpMyAdmin 3FN</span>
            <span>·</span>
            <span>ODS 13 Acción por el Clima</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
