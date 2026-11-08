import React, { useState } from 'react';
import {
  Leaf,
  Database,
  FileText,
  BarChart3,
  Building2,
  Flame,
  Award,
  Download,
  LogOut,
  User,
  Plus,
  ChevronDown,
  X,
  Check,
} from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Empresa, Usuario } from '../types/database';

export type ActiveTab =
  | 'dashboard'
  | 'consumos'
  | 'sedes'
  | 'factores'
  | 'compensaciones'
  | 'documento';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onExportSql: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onExportSql,
  onLogout,
}) => {
  const currentUser = dbStore.getCurrentUser();
  const empresasUsuario = dbStore.getEmpresasForUser();
  const activeEmpresaId = dbStore.getActiveEmpresaId();
  const empresaActiva = dbStore.getEmpresaActiva();

  const [isModalNuevaEmpresaOpen, setIsModalNuevaEmpresaOpen] = useState(false);
  const [nuevaEmpresaNombre, setNuevaEmpresaNombre] = useState('');
  const [nuevaEmpresaNit, setNuevaEmpresaNit] = useState('');

  const handleCrearEmpresa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaEmpresaNombre.trim() || !nuevaEmpresaNit.trim() || !currentUser) {
      alert('Por favor complete los campos de la nueva empresa.');
      return;
    }

    dbStore.saveEmpresa({
      id_usuario: currentUser.id_usuario,
      nombre: nuevaEmpresaNombre.trim(),
      nit: nuevaEmpresaNit.trim(),
    });

    setIsModalNuevaEmpresaOpen(false);
    setNuevaEmpresaNombre('');
    setNuevaEmpresaNit('');
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* FILA 1: Barra Superior con Marca, Selector de Empresa y Botón CERRAR SESIÓN SIEMPRE VISIBLE */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Marca / Identificador */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xs">
              <Leaf className="w-4 h-4 font-black" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-tight text-white leading-tight">
                EcoTrack <span className="text-emerald-400">ODS 13</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Huella de Carbono Corporativa (phpMyAdmin)
              </div>
            </div>
          </div>

          {/* Selector de Empresa y Acciones de Usuario */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Selector de Empresa */}
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/90 py-1.5 px-2.5 rounded-lg border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                value={activeEmpresaId}
                onChange={(e) => {
                  if (e.target.value === 'nueva') {
                    setIsModalNuevaEmpresaOpen(true);
                  } else {
                    dbStore.setActiveEmpresaId(Number(e.target.value));
                  }
                }}
                aria-label="Seleccionar organización activa"
                className="bg-transparent font-medium text-white focus:outline-hidden cursor-pointer max-w-[130px] sm:max-w-[190px] truncate"
              >
                {empresasUsuario.map((emp) => (
                  <option key={emp.id_empresa} value={emp.id_empresa} className="bg-slate-900 text-white">
                    {emp.nombre}
                  </option>
                ))}
                <option value="nueva" className="bg-slate-900 text-emerald-400 font-bold">
                  + Registrar otra empresa...
                </option>
              </select>
            </div>

            {/* Nombre del Usuario Conectado */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/60 py-1.5 px-2.5 rounded-lg border border-slate-700/60">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-200">{currentUser?.nombre}</span>
            </div>

            {/* Exportar SQL */}
            <button
              onClick={onExportSql}
              title="Descargar script SQL completo para phpMyAdmin"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Exportar SQL</span>
            </button>

            {/* BOTÓN CERRAR SESIÓN DESTACADO EN ROJO */}
            <button
              onClick={onLogout}
              title="Cerrar sesión y volver al inicio"
              className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-rose-950 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 text-white" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILA 2: Pestañas de Navegación del Sistema */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 overflow-x-auto py-1.5">
          <nav className="flex items-center gap-1 text-xs font-medium">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard ODS</span>
            </button>

            <button
              onClick={() => onSelectTab('consumos')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'consumos'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Consumos</span>
            </button>

            <button
              onClick={() => onSelectTab('sedes')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'sedes'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Sedes</span>
            </button>

            <button
              onClick={() => onSelectTab('factores')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'factores'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Factores GEI</span>
            </button>

            <button
              onClick={() => onSelectTab('compensaciones')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'compensaciones'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Compensaciones</span>
            </button>

            <button
              onClick={() => onSelectTab('documento')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'documento'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Doc. Entrega</span>
            </button>
          </nav>

          {/* Indicador de Organización Activa a la derecha */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono shrink-0">
            <span>NIT: {empresaActiva?.nit}</span>
          </div>
        </div>
      </div>

      {/* Modal Registrar Otra Empresa para el Usuario Activo */}
      {isModalNuevaEmpresaOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registrar Nueva Empresa</h3>
                <p className="text-xs text-slate-500">
                  Asociada al usuario actual: {currentUser?.nombre} (`id_usuario`: #{currentUser?.id_usuario})
                </p>
              </div>
              <button
                onClick={() => setIsModalNuevaEmpresaOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCrearEmpresa} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Razón Social / Nombre de la Empresa (`nombre`)
                </label>
                <input
                  type="text"
                  value={nuevaEmpresaNombre}
                  onChange={(e) => setNuevaEmpresaNombre(e.target.value)}
                  placeholder="Ej: AgroIndustrias del Valle S.A."
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIT (`nit` VARCHAR(20) UK)
                </label>
                <input
                  type="text"
                  value={nuevaEmpresaNit}
                  onChange={(e) => setNuevaEmpresaNit(e.target.value)}
                  placeholder="Ej: 901.884.221-5"
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                <div className="text-slate-400 text-[10px] mb-1 uppercase font-semibold">Sentencia SQL Generada:</div>
                <code>
                  INSERT INTO empresa (id_usuario, nit, nombre, creado_en) VALUES ({currentUser?.id_usuario}, '{nuevaEmpresaNit}', '{nuevaEmpresaNombre}', NOW());
                </code>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalNuevaEmpresaOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Crear y Cambiar a Empresa</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
