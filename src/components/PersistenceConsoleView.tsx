import React, { useState } from 'react';
import {
  Terminal,
  Database,
  Download,
  Copy,
  Check,
  RotateCcw,
  Trash2,
  HardDrive,
  Info,
  ExternalLink,
  TableProperties,
} from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { LogTransaccionSQL } from '../types/database';

export const PersistenceConsoleView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroTabla, setFiltroTabla] = useState<string>('todas');

  const logs = dbStore.getSqlLogs();
  const usuarios = dbStore.getUsuarios();
  const empresas = dbStore.getEmpresas();
  const sedes = dbStore.getAllSedes();
  const fuentes = dbStore.getFuentes();
  const factores = dbStore.getFactores();
  const consumos = dbStore.getConsumosDetallados();
  const proyectos = dbStore.getProyectos();
  const compensaciones = dbStore.getCompensacionesDetalladas();

  const handleDownloadSql = () => {
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
  };

  const handleCopySql = () => {
    const sqlContent = dbStore.generatePhpMyAdminSqlDump();
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleResetData = () => {
    if (confirm('¿Desea restablecer toda la base de datos a sus valores iniciales? Se regenerarán las 8 tablas con los datos de prueba oficiales.')) {
      dbStore.resetToSeeds();
    }
  };

  const handleClearLogs = () => {
    dbStore.clearSqlLogs();
  };

  const logsFiltrados = logs.filter((log) => {
    if (filtroTipo !== 'todos' && log.tipo !== filtroTipo) return false;
    if (filtroTabla !== 'todas' && log.tabla !== filtroTabla) return false;
    return true;
  });

  const tablasEstadisticas = [
    { nombre: 'USUARIO', filas: usuarios.length, rol: 'Identidad y credenciales' },
    { nombre: 'EMPRESA', filas: empresas.length, rol: 'Organización propietaria' },
    { nombre: 'SEDE', filas: sedes.length, rol: 'Puntos físicos de consumo' },
    { nombre: 'FUENTE_EMISION', filas: fuentes.length, rol: 'Catálogo de recursos' },
    { nombre: 'FACTOR_EMISION', filas: factores.length, rol: 'Factores oficiales UPME/IPCC' },
    { nombre: 'CONSUMO', filas: consumos.length, rol: 'Transacciones mensuales' },
    { nombre: 'PROYECTO', filas: proyectos.length, rol: 'Iniciativas ambientales' },
    { nombre: 'COMPENSACION', filas: compensaciones.length, rol: 'Bonos de carbono acreditados' },
  ];

  return (
    <div className="space-y-8">
      {/* Encabezado */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/30">
                Punto 4 de la Tarea
              </span>
              <span>·</span>
              <span className="text-slate-300">Arquitectura de Persistencia y SQL</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Demostración Activa de Persistencia de Datos
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consola transaccional en tiempo real que captura cada instrucción SQL disparada por el motor de la aplicación.
              Permite exportar el volcado <code className="text-amber-300">.sql</code> completo compatible al 100% con phpMyAdmin y MySQL.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleDownloadSql}
              className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar .SQL para phpMyAdmin</span>
            </button>
            <button
              onClick={handleCopySql}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Script Copiado!' : 'Copiar Script Completo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de Tablas en el Motor de Base de Datos */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              Estado de las 8 Tablas en el Almacenamiento Persistente
            </h2>
          </div>
          <button
            onClick={handleResetData}
            title="Restablecer base de datos"
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Datos de Fábrica</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {tablasEstadisticas.map((tab) => (
            <div key={tab.nombre} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block truncate" title={tab.nombre}>
                {tab.nombre}
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 block tabular-nums">
                {tab.filas}
              </span>
              <span className="text-[10px] text-slate-400 block truncate" title={tab.rol}>
                {tab.rol}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Consola de Transacciones SQL en Vivo */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        {/* Barra superior de la consola */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-mono">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">SQL Query Profiler / Transaction Log</span>
            <span className="text-slate-500">({logsFiltrados.length} sentencias registradas)</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filtro por Tipo */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-slate-800 text-slate-300 border border-slate-700 rounded-md px-2 py-1 text-xs font-mono focus:outline-hidden"
            >
              <option value="todos">Todos los comandos</option>
              <option value="INSERT">Solo INSERT</option>
              <option value="UPDATE">Solo UPDATE</option>
              <option value="DELETE">Solo DELETE</option>
              <option value="SELECT">Solo SELECT</option>
            </select>

            {/* Filtro por Tabla */}
            <select
              value={filtroTabla}
              onChange={(e) => setFiltroTabla(e.target.value)}
              className="bg-slate-800 text-slate-300 border border-slate-700 rounded-md px-2 py-1 text-xs font-mono focus:outline-hidden"
            >
              <option value="todas">Todas las tablas</option>
              {tablasEstadisticas.map((t) => (
                <option key={t.nombre} value={t.nombre}>
                  {t.nombre}
                </option>
              ))}
            </select>

            <button
              onClick={handleClearLogs}
              title="Limpiar registro de consultas"
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido de la consola */}
        <div className="p-4 space-y-3 font-mono text-xs max-h-[460px] overflow-y-auto divide-y divide-slate-800/60">
          {logsFiltrados.length === 0 ? (
            <div className="py-12 text-center text-slate-600">
              No hay transacciones registradas con los filtros actuales.
            </div>
          ) : (
            logsFiltrados.map((log) => {
              let badgeColor = 'text-blue-400 bg-blue-950/60 border-blue-800';
              if (log.tipo === 'INSERT') badgeColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
              if (log.tipo === 'UPDATE') badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-800';
              if (log.tipo === 'DELETE') badgeColor = 'text-rose-400 bg-rose-950/60 border-rose-800';

              return (
                <div key={log.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${badgeColor}`}>
                        {log.tipo}
                      </span>
                      <span className="text-slate-400 font-semibold">{log.tabla}</span>
                      <span>·</span>
                      <span className="text-slate-500">{log.descripcion}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">{log.duracionMs} ms</span>
                      <span>·</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                  <pre className="text-emerald-300 text-xs overflow-x-auto whitespace-pre-wrap py-1 bg-slate-900/50 p-2.5 rounded-md border border-slate-800/80">
                    <code>{log.sentenciaSQL}</code>
                  </pre>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Guía de Importación en phpMyAdmin */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-amber-700" />
          <h2 className="text-base font-bold text-slate-900">
            Guía Paso a Paso: Cómo Ejecutar este Esquema en tu phpMyAdmin Local
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-700">
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
              1
            </span>
            <strong className="block text-slate-900 font-semibold">Descargar Script SQL</strong>
            <p className="text-slate-600">
              Haz clic en el botón superior <strong className="text-slate-800">"Descargar .SQL para phpMyAdmin"</strong> para obtener el archivo con el DDL y los datos.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
              2
            </span>
            <strong className="block text-slate-900 font-semibold">Abrir phpMyAdmin</strong>
            <p className="text-slate-600">
              Inicia XAMPP, WampServer o Docker y navega a <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">http://localhost/phpmyadmin</code>.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
              3
            </span>
            <strong className="block text-slate-900 font-semibold">Pestaña "Importar"</strong>
            <p className="text-slate-600">
              Selecciona la pestaña <strong className="text-slate-800">"Importar"</strong> en la barra superior de phpMyAdmin y carga el archivo descargado.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px]">
              4
            </span>
            <strong className="block text-slate-900 font-semibold">Ejecutar y Verificar</strong>
            <p className="text-slate-600">
              Haz clic en <strong className="text-slate-800">"Continuar"</strong>. Se creará automáticamente la base <code className="text-emerald-700 font-mono">gestion_carbono_ods13</code> con las 8 tablas relacionadas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
