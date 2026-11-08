import React, { useState } from 'react';
import { Leaf, Lock, Mail, ArrowRight, Building2, User, UserPlus, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { dbStore } from '../services/dbStore';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Campos para Registro de Nuevo Usuario y Empresa
  const [regNombre, setRegNombre] = useState('');
  const [regCorreo, setRegCorreo] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmpresaNombre, setRegEmpresaNombre] = useState('');
  const [regNit, setRegNit] = useState('');

  const usuarios = dbStore.getUsuarios();
  const empresas = dbStore.getEmpresas();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!correo.trim()) {
      setErrorMsg('Por favor ingrese su correo electrónico.');
      return;
    }

    const result = dbStore.login(correo, password);
    if (result.success) {
      onLoginSuccess();
    } else {
      setErrorMsg(result.error || 'Credenciales incorrectas');
    }
  };

  const handleQuickLogin = (email: string) => {
    setErrorMsg(null);
    const result = dbStore.login(email);
    if (result.success) {
      onLoginSuccess();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!regNombre.trim() || !regCorreo.trim() || !regEmpresaNombre.trim() || !regNit.trim()) {
      setErrorMsg('Por favor complete todos los campos obligatorios.');
      return;
    }

    try {
      dbStore.registerUserAndEmpresa(
        { nombre: regNombre, correo: regCorreo, password: regPassword },
        { nombre: regEmpresaNombre, nit: regNit }
      );
      onLoginSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar la organización.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Luces sutiles de fondo (Aesthetic) */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-6 relative z-10">
        {/* Cabecera de Marca */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-2">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            EcoTrack <span className="text-emerald-400 font-black">ODS 13</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Plataforma Corporativa de Huella de Carbono & Base de Datos Multi-Empresa phpMyAdmin
          </p>
        </div>

        {/* Tarjeta de Inicio de Sesión */}
        <div className="bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 md:p-8 shadow-2xl space-y-6">
          {/* Selector de Modo (Tabs) */}
          <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => { setMode('login'); setErrorMsg(null); }}
              className={`flex-1 py-2 font-semibold rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(null); }}
              className={`flex-1 py-2 font-semibold rounded-md transition-all ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Registrar Organización
            </button>
          </div>

          {errorMsg && (
            <div className="bg-rose-950/50 border border-rose-800 rounded-lg p-3 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico (`correo` en USUARIO)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="usuario@dominio.com"
                    required
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña (`password_hash`)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
              >
                <span>Ingresar a la Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Acceso Rápido con Usuarios Registrados en Base de Datos */}
              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block text-center">
                  Cuentas Registradas en phpMyAdmin (1-Clic)
                </span>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('lvillada11@estudiantes.areandina.edu.co')}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        Laura Villada (Estudiante Areandina)
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        BioIndustrias Andinas S.A.S. (NIT: 901.458.720-3)
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('cmendoza@sostenibilidad-andina.com')}
                    className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        Carlos Mendoza Gómez
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Logística Verde del Café S.A. (NIT: 860.012.345-1)
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="text-xs text-slate-400">
                Registra un nuevo usuario en la tabla <code className="text-emerald-400 font-mono">USUARIO</code> y vincula su primera <code className="text-emerald-400 font-mono">EMPRESA</code> mediante la llave foránea <code className="text-emerald-400 font-mono">id_usuario</code>.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Completo del Administrador (`nombre`)
                </label>
                <input
                  type="text"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  placeholder="Ej: Ing. Andrés Restrepo"
                  required
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico (`correo` UK)
                </label>
                <input
                  type="email"
                  value={regCorreo}
                  onChange={(e) => setRegCorreo(e.target.value)}
                  placeholder="andres@miempresa.com"
                  required
                  className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre Empresa (`EMPRESA`)
                  </label>
                  <input
                    type="text"
                    value={regEmpresaNombre}
                    onChange={(e) => setRegEmpresaNombre(e.target.value)}
                    placeholder="Ej: Soluciones Verdes S.A.S."
                    required
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    NIT (`nit` UK)
                  </label>
                  <input
                    type="text"
                    value={regNit}
                    onChange={(e) => setRegNit(e.target.value)}
                    placeholder="900.123.456-7"
                    required
                    className="w-full text-xs bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrar y Crear Organización</span>
              </button>
            </form>
          )}
        </div>

        {/* Pie informativo técnico */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          <span>Relación 1:N USUARIO ➔ EMPRESA</span>
          <span className="mx-2">·</span>
          <span>Integridad Referencial phpMyAdmin</span>
        </div>
      </div>
    </div>
  );
};
