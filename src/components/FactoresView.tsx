import React, { useState } from 'react';
import { Database, Plus, Edit2, Info, X, Check } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { FactorEmision, FuenteEmision } from '../types/database';

export const FactoresView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFactor, setEditingFactor] = useState<FactorEmision | null>(null);

  const [idFuente, setIdFuente] = useState<number>(1);
  const [valor, setValor] = useState<string>('0.16430000');
  const [unidadConsumo, setUnidadConsumo] = useState<string>('kWh');
  const [anio, setAnio] = useState<number>(2024);
  const [referencia, setReferencia] = useState<string>('Factor Oficial UPME');

  const fuentes = dbStore.getFuentes();
  const factores = dbStore.getFactores();

  const handleOpenCrear = () => {
    setEditingFactor(null);
    if (fuentes.length > 0) setIdFuente(fuentes[0].id_fuente);
    setValor('0.20000000');
    setUnidadConsumo('kWh');
    setAnio(2024);
    setReferencia('Directriz IPCC / UPME 2024');
    setIsModalOpen(true);
  };

  const handleOpenEditar = (factor: FactorEmision) => {
    setEditingFactor(factor);
    setIdFuente(factor.id_fuente);
    setValor(factor.valor.toString());
    setUnidadConsumo(factor.unidad_consumo);
    setAnio(factor.anio);
    setReferencia(factor.referencia);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setEditingFactor(null);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(valor);
    if (isNaN(valNum) || valNum <= 0) {
      alert('Por favor ingrese un valor de factor numérico válido mayor a cero');
      return;
    }

    dbStore.saveFactor({
      id_factor: editingFactor ? editingFactor.id_factor : undefined,
      id_fuente: Number(idFuente),
      valor: valNum,
      unidad_consumo: unidadConsumo.trim(),
      anio: Number(anio),
      referencia: referencia.trim(),
    });

    handleCerrarModal();
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span>Tablas de BD: FUENTE_EMISION & FACTOR_EMISION</span>
            <span>·</span>
            <span>Relación 1 a N con precisión DECIMAL(14,8)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Catálogo de Fuentes y Factores Oficiales de Emisión (GEI)
          </h1>
          <p className="text-xs text-slate-500">
            Coeficientes científicos certificados para convertir unidades físicas de consumo a kg CO2 equivalente.
          </p>
        </div>

        <button
          onClick={handleOpenCrear}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Factor de Emisión</span>
        </button>
      </div>

      {/* Nota científica */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block">Requisito Metrológico y de Base de Datos:</strong>
          La columna <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">valor</code> en la tabla <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">FACTOR_EMISION</code> está tipificada como <code className="font-mono font-bold">DECIMAL(14,8)</code> en MySQL. Esta precisión es mandatoria por el Protocolo de Gases de Efecto Invernadero (GHG Protocol) para evitar errores de redondeo en inventarios masivos de alcances 1, 2 y 3.
        </div>
      </div>

      {/* Tabla de Factores */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Fuente de Emisión (`FUENTE_EMISION`)</th>
                <th className="py-3 px-4 text-right">Valor Factor (`DECIMAL(14,8)`)</th>
                <th className="py-3 px-4">Unidad de Consumo</th>
                <th className="py-3 px-4 text-center">Año</th>
                <th className="py-3 px-4">Referencia Oficial / Entidad</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {factores.map((factor) => {
                const fuente = fuentes.find((f) => f.id_fuente === factor.id_fuente);
                return (
                  <tr key={factor.id_factor} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-400">#{factor.id_factor}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{fuente?.nombre}</div>
                      <div className="text-[10px] text-slate-400 font-mono">id_fuente: {factor.id_fuente}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800 tabular-nums text-sm">
                      {factor.valor.toFixed(8)}
                      <span className="text-[10px] font-normal text-slate-500 block">kg CO2e / {factor.unidad_consumo}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{factor.unidad_consumo}</td>
                    <td className="py-3 px-4 text-center font-mono tabular-nums text-slate-600">{factor.anio}</td>
                    <td className="py-3 px-4 text-slate-600 text-xs max-w-xs">{factor.referencia}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenEditar(factor)}
                        title="Editar factor"
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Factor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingFactor ? `Editar Factor #${editingFactor.id_factor}` : 'Nuevo Factor de Emisión'}
                </h3>
                <p className="text-xs text-slate-500">Mapeado a la tabla relacional `factor_emision`</p>
              </div>
              <button
                onClick={handleCerrarModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fuente de Emisión (`id_fuente` FK)
                </label>
                <select
                  value={idFuente}
                  onChange={(e) => setIdFuente(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {fuentes.map((f) => (
                    <option key={f.id_fuente} value={f.id_fuente}>
                      #{f.id_fuente} - {f.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Valor (`valor` DECIMAL(14,8))
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    min="0.00000001"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                    placeholder="0.16430000"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">kg CO2e por unidad</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unidad de Consumo (`unidad_consumo`)
                  </label>
                  <input
                    type="text"
                    value={unidadConsumo}
                    onChange={(e) => setUnidadConsumo(e.target.value)}
                    required
                    placeholder="kWh, m3, Galones..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Año (`anio` SMALLINT)
                  </label>
                  <input
                    type="number"
                    value={anio}
                    onChange={(e) => setAnio(Number(e.target.value))}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Referencia / Norma (`referencia` VARCHAR)
                  </label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    required
                    placeholder="UPME, IPCC, DEFRA..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Vista previa SQL */}
              <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                <div className="text-slate-400 text-[10px] mb-1 uppercase font-semibold">Sentencia SQL Generada:</div>
                {editingFactor ? (
                  <code>
                    UPDATE factor_emision SET id_fuente = {idFuente}, valor = {Number(valor).toFixed(8)}, unidad_consumo = '{unidadConsumo}', anio = {anio}, referencia = '{referencia}', actualizado_en = NOW() WHERE id_factor = {editingFactor.id_factor};
                  </code>
                ) : (
                  <code>
                    INSERT INTO factor_emision (id_fuente, valor, unidad_consumo, anio, referencia, creado_en) VALUES ({idFuente}, {Number(valor).toFixed(8)}, '{unidadConsumo}', {anio}, '{referencia}', NOW());
                  </code>
                )}
              </div>

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
                  <span>{editingFactor ? 'Actualizar Factor' : 'Guardar Factor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
