import React, { useState } from 'react';
import {
  Flame,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Calculator,
  X,
  Check,
  Building2,
  Calendar,
  Info,
} from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { ConsumoDetallado, FactorEmision } from '../types/database';

interface ConsumosViewProps {
  isModalOpenInitial?: boolean;
  onCloseInitialModal?: () => void;
}

export const ConsumosView: React.FC<ConsumosViewProps> = ({
  isModalOpenInitial = false,
  onCloseInitialModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenInitial);
  const [editingConsumo, setEditingConsumo] = useState<ConsumoDetallado | null>(null);

  // Filtros
  const [filtroSede, setFiltroSede] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');

  // Form State
  const [idSede, setIdSede] = useState<number>(1);
  const [idFactor, setIdFactor] = useState<number>(1);
  const [periodo, setPeriodo] = useState<string>('2024-04-01');
  const [cantidad, setCantidad] = useState<string>('10000');

  const sedes = dbStore.getSedes();
  const factores = dbStore.getFactores();
  const fuentes = dbStore.getFuentes();
  const consumos = dbStore.getConsumosDetallados();

  // Factor seleccionado actualmente para cálculo en vivo
  const factorSeleccionado = factores.find((f) => f.id_factor === Number(idFactor)) || factores[0];
  const fuenteSeleccionada = factorSeleccionado
    ? fuentes.find((fu) => fu.id_fuente === factorSeleccionado.id_fuente)
    : undefined;

  const cantidadNum = parseFloat(cantidad) || 0;
  const emisionCalculadaKg = factorSeleccionado ? cantidadNum * factorSeleccionado.valor : 0;
  const emisionCalculadaTon = emisionCalculadaKg / 1000;

  const handleOpenCrear = () => {
    setEditingConsumo(null);
    if (sedes.length > 0) setIdSede(sedes[0].id_sede);
    if (factores.length > 0) setIdFactor(factores[0].id_factor);
    setPeriodo(new Date().toISOString().substring(0, 7) + '-01');
    setCantidad('1000');
    setIsModalOpen(true);
  };

  const handleOpenEditar = (consumo: ConsumoDetallado) => {
    setEditingConsumo(consumo);
    setIdSede(consumo.id_sede);
    setIdFactor(consumo.id_factor);
    setPeriodo(consumo.periodo);
    setCantidad(consumo.cantidad.toString());
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setEditingConsumo(null);
    if (onCloseInitialModal) onCloseInitialModal();
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idSede || !idFactor || !periodo || isNaN(cantidadNum) || cantidadNum <= 0) {
      alert('Por favor ingrese valores válidos');
      return;
    }

    dbStore.saveConsumo({
      id_consumo: editingConsumo ? editingConsumo.id_consumo : undefined,
      id_sede: Number(idSede),
      id_factor: Number(idFactor),
      periodo,
      cantidad: cantidadNum,
    });

    handleCerrarModal();
  };

  const handleEliminar = (id: number) => {
    if (confirm(`¿Confirma eliminar el registro de consumo #${id}? Se aplicará Soft Delete (eliminado_en = NOW()) para mantener integridad referencial.`)) {
      dbStore.deleteConsumo(id, true);
    }
  };

  // Filtrado
  const consumosFiltrados = consumos.filter((c) => {
    if (filtroSede !== 'todas' && c.id_sede !== Number(filtroSede)) {
      return false;
    }
    if (busqueda.trim() !== '') {
      const q = busqueda.toLowerCase();
      const sedeNombre = c.sede?.nombre.toLowerCase() || '';
      const fuenteNombre = c.fuente?.nombre.toLowerCase() || '';
      const per = c.periodo.toLowerCase();
      return sedeNombre.includes(q) || fuenteNombre.includes(q) || per.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span>Tabla de BD: CONSUMO</span>
            <span>·</span>
            <span>Relación con SEDE y FACTOR_EMISION</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Registro y Cuantificación de Consumos Energéticos
          </h1>
          <p className="text-xs text-slate-500">
            Ingreso mensual de consumos por sede con cálculo determinístico de kg CO2e según factor oficial.
          </p>
        </div>

        <button
          onClick={handleOpenCrear}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Consumo</span>
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por sede, recurso o periodo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="text-xs w-full md:w-64 focus:outline-hidden text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Sede:</span>
          <select
            value={filtroSede}
            onChange={(e) => setFiltroSede(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden text-slate-700"
          >
            <option value="todas">Todas las sedes ({sedes.length})</option>
            {sedes.map((s) => (
              <option key={s.id_sede} value={s.id_sede}>
                {s.nombre} ({s.ciudad})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Datos / Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Sede Operativa</th>
                <th className="py-3 px-4">Fuente / Recurso</th>
                <th className="py-3 px-4">Periodo</th>
                <th className="py-3 px-4 text-right">Cantidad Consumida</th>
                <th className="py-3 px-4 text-right">Factor de Emisión</th>
                <th className="py-3 px-4 text-right">Emisión Total</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {consumosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No se encontraron registros de consumo coincidentes.
                  </td>
                </tr>
              ) : (
                consumosFiltrados.map((c) => (
                  <tr key={c.id_consumo} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">#{c.id_consumo}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.sede?.nombre}</div>
                      <div className="text-[11px] text-slate-500">{c.sede?.ciudad}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{c.fuente?.nombre}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">{c.factor?.referencia}</div>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">{c.periodo}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-slate-900">
                      {c.cantidad.toLocaleString('es-CO')} {c.factor?.unidad_consumo}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-600">
                      {c.factor?.valor} kg/u
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <div className="font-bold text-rose-700">{c.emision_calculada_ton_co2e} t CO2e</div>
                      <div className="text-[10px] text-slate-400">{c.emision_calculada_kg_co2e.toLocaleString('es-CO')} kg</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditar(c)}
                          title="Editar registro (Dispara UPDATE en BD)"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEliminar(c.id_consumo)}
                          title="Eliminar registro (Soft delete en BD)"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Consumo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingConsumo ? `Editar Consumo #${editingConsumo.id_consumo}` : 'Registrar Consumo de Recurso'}
                </h3>
                <p className="text-xs text-slate-500">Mapeado a la tabla relacional `consumo`</p>
              </div>
              <button
                onClick={handleCerrarModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="p-6 space-y-4">
              {/* Sede */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sede Operativa (`id_sede` FK)
                </label>
                <select
                  value={idSede}
                  onChange={(e) => setIdSede(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {sedes.map((s) => (
                    <option key={s.id_sede} value={s.id_sede}>
                      {s.nombre} — {s.ciudad} ({s.direccion})
                    </option>
                  ))}
                </select>
              </div>

              {/* Factor de Emisión */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Factor de Emisión Oficial (`id_factor` FK)
                </label>
                <select
                  value={idFactor}
                  onChange={(e) => setIdFactor(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {factores.map((f) => {
                    const fuente = fuentes.find((fu) => fu.id_fuente === f.id_fuente);
                    return (
                      <option key={f.id_factor} value={f.id_factor}>
                        {fuente?.nombre} | Factor: {f.valor} kg CO2e/{f.unidad_consumo} ({f.referencia})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Grid Periodo & Cantidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Periodo Contable (`periodo` DATE)
                  </label>
                  <input
                    type="date"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cantidad ({factorSeleccionado?.unidad_consumo})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Cálculo en Vivo (Lógica de Dominio del Objeto) */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Cálculo Automático de Emisiones (ODS 13)</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>Fórmula:</span>
                    <span>Cantidad × Factor = kg CO2e</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>Operación:</span>
                    <span>
                      {cantidadNum.toLocaleString('es-CO')} × {factorSeleccionado?.valor}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-emerald-800 pt-1 border-t border-emerald-200">
                    <span>Total Emisión:</span>
                    <span>
                      {emisionCalculadaTon.toFixed(3)} t CO2e ({emisionCalculadaKg.toFixed(2)} kg)
                    </span>
                  </div>
                </div>
              </div>

              {/* Vista previa de la sentencia SQL que se ejecutará */}
              <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                <div className="text-slate-400 text-[10px] mb-1 uppercase font-semibold">Sentencia SQL Generada:</div>
                {editingConsumo ? (
                  <code>
                    UPDATE consumo SET id_sede = {idSede}, id_factor = {idFactor}, periodo = '{periodo}', cantidad = {cantidadNum.toFixed(3)}, actualizado_en = NOW() WHERE id_consumo = {editingConsumo.id_consumo};
                  </code>
                ) : (
                  <code>
                    INSERT INTO consumo (id_sede, id_factor, periodo, cantidad, creado_en) VALUES ({idSede}, {idFactor}, '{periodo}', {cantidadNum.toFixed(3)}, NOW());
                  </code>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCerrarModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingConsumo ? 'Actualizar Registro' : 'Guardar en Base de Datos'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
