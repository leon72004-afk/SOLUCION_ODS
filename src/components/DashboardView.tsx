import React from 'react';
import {
  Flame,
  Award,
  TrendingDown,
  Building2,
  Calendar,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  User,
} from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { ActiveTab } from './Navbar';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenNuevoConsumo: () => void;
  onOpenNuevaCompensacion: () => void;
  onLogout?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNuevoConsumo,
  onOpenNuevaCompensacion,
  onLogout,
}) => {
  const currentUser = dbStore.getCurrentUser();
  const empresa = dbStore.getEmpresaActiva();
  const resumen = dbStore.getResumenHuella();
  const consumos = dbStore.getConsumosDetallados();
  const sedes = dbStore.getSedes();
  const fuentes = dbStore.getFuentes();
  const compensaciones = dbStore.getCompensacionesDetalladas();

  // Emisiones por Sede
  const emisionesPorSede = sedes.map((sede) => {
    const consumosSede = consumos.filter((c) => c.id_sede === sede.id_sede);
    const totalKg = consumosSede.reduce((sum, c) => sum + c.emision_calculada_kg_co2e, 0);
    return {
      sede,
      totalKg,
      totalTon: Math.round((totalKg / 1000) * 100) / 100,
      porcentaje: resumen.totalEmisionesKg > 0 ? (totalKg / resumen.totalEmisionesKg) * 100 : 0,
    };
  });

  // Emisiones por Fuente
  const emisionesPorFuente = fuentes.map((fuente) => {
    const consumosFuente = consumos.filter((c) => c.fuente?.id_fuente === fuente.id_fuente);
    const totalKg = consumosFuente.reduce((sum, c) => sum + c.emision_calculada_kg_co2e, 0);
    return {
      fuente,
      totalKg,
      totalTon: Math.round((totalKg / 1000) * 100) / 100,
      porcentaje: resumen.totalEmisionesKg > 0 ? (totalKg / resumen.totalEmisionesKg) * 100 : 0,
    };
  }).filter((f) => f.totalKg > 0);

  return (
    <div className="space-y-8">
      {/* ODS 13 Context Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <span className="bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/30">
                ODS 13: Acción por el Clima
              </span>
              <span>·</span>
              <span className="text-slate-300">Usuario: {currentUser?.nombre}</span>
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Cerrar sesión actual"
                  className="px-2.5 py-1 bg-rose-600/90 hover:bg-rose-500 text-white rounded-md text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto sm:ml-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Gestión de Huella de Carbono & Neutralidad
            </h1>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Monitoreo operativo de emisiones de alcance 1 y 2 para <strong className="text-white">{empresa?.nombre}</strong> (NIT: {empresa?.nit}).
              Solución de ingeniería de software conectada al esquema relacional de 8 tablas en phpMyAdmin.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={onOpenNuevoConsumo}
              className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Consumo</span>
            </button>
            <button
              onClick={onOpenNuevaCompensacion}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Registrar Bono CO2</span>
            </button>
          </div>
        </div>

        {/* Metas ODS 13 */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Meta 13.2 - Integración de Medidas</strong>
              Cuantificación de emisiones de CO2e con factores oficiales (UPME / IPCC) por sede.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Meta 13.3 - Educación y Capacidad</strong>
              Mapeo didáctico Objeto-Relacional (ORM) en Java, Python, .NET y TypeScript.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block">Persistencia Transaccional</strong>
              Ejecución y registro de sentencias SQL sincronizadas con phpMyAdmin.
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Emisiones */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Emisiones Totales</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {resumen.totalEmisionesTon.toLocaleString('es-CO')} <span className="text-sm font-normal text-slate-500">t CO2e</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-mono tabular-nums">
            <span>{resumen.totalEmisionesKg.toLocaleString('es-CO')} kg CO2e</span>
            <span>·</span>
            <span>{resumen.numConsumos} registros</span>
          </div>
        </div>

        {/* Compensaciones Certificadas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Compensación Bonos</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {resumen.totalCompensadoTon.toLocaleString('es-CO')} <span className="text-sm font-normal text-slate-500">t CO2e</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 font-mono tabular-nums">
            <span>{resumen.totalCompensadoKg.toLocaleString('es-CO')} kg mitigados</span>
            <span>·</span>
            <span>{compensaciones.length} proyectos</span>
          </div>
        </div>

        {/* Balance Neto */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Huella Neta Remanente</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${resumen.esCarbonoNeutro ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {resumen.balanceNetoTon.toLocaleString('es-CO')} <span className="text-sm font-normal text-slate-500">t CO2e</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {resumen.esCarbonoNeutro ? (
              <span className="text-emerald-700 font-semibold">¡Organización Carbono Neutro!</span>
            ) : (
              <span>Resta compensar {resumen.balanceNetoKg.toLocaleString('es-CO')} kg</span>
            )}
          </div>
        </div>

        {/* Progreso Neutralidad */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Índice de Mitigación</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {resumen.porcentajeCompensado}%
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, resumen.porcentajeCompensado)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts & Breakdowns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose por Sede */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Emisiones por Sede Operativa</h2>
              <p className="text-xs text-slate-500">Distribución de huella de carbono según ubicación física</p>
            </div>
            <button
              onClick={() => onNavigate('sedes')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Ver sedes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {emisionesPorSede.map((item) => (
              <div key={item.sede.id_sede} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800">{item.sede.nombre} ({item.sede.ciudad})</span>
                  <span className="font-mono tabular-nums text-slate-600">
                    {item.totalTon} t CO2e ({item.porcentaje.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.max(2, item.porcentaje)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desglose por Fuente de Emisión */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Emisiones por Fuente de Energía / Recurso</h2>
              <p className="text-xs text-slate-500">Cálculo aplicando factores oficiales de emisión (UPME / IPCC)</p>
            </div>
            <button
              onClick={() => onNavigate('factores')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Ver factores</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {emisionesPorFuente.map((item) => (
              <div key={item.fuente.id_fuente} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate max-w-[280px]" title={item.fuente.nombre}>
                    {item.fuente.nombre}
                  </span>
                  <span className="font-mono tabular-nums text-slate-600">
                    {item.totalTon} t CO2e ({item.porcentaje.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all"
                    style={{ width: `${Math.max(2, item.porcentaje)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Relación con la Tarea y los 5 Puntos Solicitados */}
      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Cumplimiento de los 5 Puntos del Eje Temático
          </h2>
          <button
            onClick={() => onNavigate('documento')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Ver Documento Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div
            onClick={() => onNavigate('dashboard')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer space-y-1"
          >
            <div className="font-bold text-emerald-700">1. Problemática ODS</div>
            <div className="text-slate-600">
              Solución integral para ODS 13: inventario de GEI, huella por sede y metas de carbono neutro.
            </div>
          </div>

          <div
            onClick={() => onNavigate('documento')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer space-y-1"
          >
            <div className="font-bold text-indigo-700">2. Mapeo Relacional vs Objeto</div>
            <div className="text-slate-600">
              Explicación de la brecha de impedancia, DDL SQL de phpMyAdmin vs Clases POO y relaciones @ManyToOne.
            </div>
          </div>

          <div
            onClick={() => onNavigate('documento')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer space-y-1"
          >
            <div className="font-bold text-indigo-700">3. Lenguajes Soportados</div>
            <div className="text-slate-600">
              Implementaciones canónicas en Java (JPA), Python (SQLAlchemy), C# (.NET) y TypeScript.
            </div>
          </div>

          <div
            onClick={() => onNavigate('documento')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-amber-300 transition-colors cursor-pointer space-y-1"
          >
            <div className="font-bold text-amber-700">4. Persistencia de Datos</div>
            <div className="text-slate-600">
              Persistencia transaccional ACID, borrado lógico (soft delete) y volcado SQL para phpMyAdmin.
            </div>
          </div>

          <div
            onClick={() => onNavigate('documento')}
            className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors cursor-pointer space-y-1"
          >
            <div className="font-bold text-blue-700">5. Documento de Entrega</div>
            <div className="text-slate-600">
              Informe académico formal estructurado con capturas, análisis del MER y exportador directo a PDF.
            </div>
          </div>
        </div>
      </div>

      {/* Últimos registros de consumos y compensaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recientes Consumos */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Últimos Consumos Registrados</h3>
            <button
              onClick={() => onNavigate('consumos')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Ver todos ({consumos.length})
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {consumos.slice(0, 4).map((c) => (
              <div key={c.id_consumo} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                <div>
                  <div className="font-semibold text-slate-800">{c.sede?.nombre}</div>
                  <div className="text-slate-500">
                    {c.fuente?.nombre} · {c.cantidad.toLocaleString('es-CO')} {c.factor?.unidad_consumo}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900 tabular-nums">
                    {c.emision_calculada_ton_co2e} t CO2e
                  </div>
                  <div className="text-slate-400 font-mono tabular-nums">{c.periodo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recientes Compensaciones */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Compensaciones Registradas</h3>
            <button
              onClick={() => onNavigate('compensaciones')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Ver todas ({compensaciones.length})
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {compensaciones.map((cp) => (
              <div key={cp.id_compensacion} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                <div className="max-w-[280px]">
                  <div className="font-semibold text-slate-800 truncate">{cp.proyecto?.nombre}</div>
                  <div className="text-slate-500 font-mono text-[11px] truncate">
                    Comprobante: {cp.comprobante}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-emerald-700 tabular-nums">
                    +{cp.cantidad_ton_co2e} t CO2e
                  </div>
                  <div className="text-slate-400 font-mono tabular-nums">{cp.fecha}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
