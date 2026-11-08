import React, { useState } from 'react';
import { Award, Plus, CheckCircle2, ShieldCheck, FileCheck, X, Check, Trees, Sun, Sparkles } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Compensacion, Proyecto } from '../types/database';

interface CompensacionesViewProps {
  isModalOpenInitial?: boolean;
  onCloseInitialModal?: () => void;
}

export const CompensacionesView: React.FC<CompensacionesViewProps> = ({
  isModalOpenInitial = false,
  onCloseInitialModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenInitial);
  const [isCertificadoModalOpen, setIsCertificadoModalOpen] = useState(false);

  // Form State
  const [idProyecto, setIdProyecto] = useState<number>(1);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().substring(0, 10));
  const [cantidadKg, setCantidadKg] = useState<string>('5000');
  const [comprobante, setComprobante] = useState<string>('VCS-VERRA-RET-2024-9988');

  const empresa = dbStore.getEmpresaActiva();
  const proyectos = dbStore.getProyectos();
  const compensaciones = dbStore.getCompensacionesDetalladas();
  const resumen = dbStore.getResumenHuella();

  const handleOpenCrear = () => {
    if (proyectos.length > 0) setIdProyecto(proyectos[0].id_proyecto);
    setFecha(new Date().toISOString().substring(0, 10));
    setCantidadKg('5000');
    setComprobante(`CERT-BONO-${Math.floor(1000 + Math.random() * 9000)}-${new Date().getFullYear()}`);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    if (onCloseInitialModal) onCloseInitialModal();
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    const cantNum = parseFloat(cantidadKg);
    if (!idProyecto || !fecha || !comprobante.trim() || isNaN(cantNum) || cantNum <= 0 || !empresa) {
      alert('Por favor ingrese valores válidos');
      return;
    }

    dbStore.saveCompensacion({
      id_empresa: empresa.id_empresa,
      id_proyecto: Number(idProyecto),
      fecha,
      cantidad_kg_co2e: cantNum,
      comprobante: comprobante.trim(),
    });

    handleCerrarModal();
  };

  const handleEliminar = (id: number) => {
    if (confirm(`¿Confirma anular el certificado de compensación #${id}? Se aplicará Soft Delete.`)) {
      dbStore.deleteCompensacion(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span>Tablas de BD: PROYECTO & COMPENSACION</span>
            <span>·</span>
            <span>Relación con EMPRESA para Mitigación de Huella</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Compensación Ecológica & Bonos de Carbono Verificados
          </h1>
          <p className="text-xs text-slate-500">
            Neutralización formal de emisiones de GEI mediante inversiones en proyectos de reforestación y energía renovable.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCertificadoModalOpen(true)}
            className="px-3.5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ver Certificado Oficial</span>
          </button>
          <button
            onClick={handleOpenCrear}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Compensación</span>
          </button>
        </div>
      </div>

      {/* Proyectos Disponibles */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          Proyectos Ambientales Registrados (`PROYECTO`)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {proyectos.map((proy) => (
            <div key={proy.id_proyecto} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <Trees className="w-4 h-4 text-emerald-600" />
                <span>Proyecto #{proy.id_proyecto}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{proy.nombre}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{proy.descripcion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de Compensaciones Registradas */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Registro Transaccional de Compensaciones (`COMPENSACION`)
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Total Mitigado: {resumen.totalCompensadoTon} t CO2e
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Proyecto Ambiental</th>
                <th className="py-3 px-4">Fecha de Retiro</th>
                <th className="py-3 px-4 text-right">Cantidad Mitigada</th>
                <th className="py-3 px-4">Comprobante / Serial Único</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {compensaciones.map((cp) => (
                <tr key={cp.id_compensacion} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-slate-400">#{cp.id_compensacion}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{cp.proyecto?.nombre}</div>
                    <div className="text-[10px] text-slate-400 font-mono">id_proyecto: {cp.id_proyecto}</div>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-700">{cp.fecha}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    <div className="font-bold text-emerald-700">+{cp.cantidad_ton_co2e} t CO2e</div>
                    <div className="text-[10px] text-slate-400">{cp.cantidad_kg_co2e.toLocaleString('es-CO')} kg</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800 text-[11px]">
                    <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{cp.comprobante}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleEliminar(cp.id_compensacion)}
                      title="Eliminar registro"
                      className="text-xs text-rose-600 hover:text-rose-800 p-1.5 rounded-md hover:bg-rose-50"
                    >
                      Anular
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Registrar Compensación */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">Registrar Bono de Compensación</h3>
                <p className="text-xs text-slate-500">Mapeado a la tabla relacional `compensacion`</p>
              </div>
              <button onClick={handleCerrarModal} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGuardar} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Proyecto Respaldador (`id_proyecto` FK)
                </label>
                <select
                  value={idProyecto}
                  onChange={(e) => setIdProyecto(Number(e.target.value))}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  {proyectos.map((p) => (
                    <option key={p.id_proyecto} value={p.id_proyecto}>
                      #{p.id_proyecto} - {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Fecha de Compensación (`fecha` DATE)
                  </label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cantidad a Mitigar (kg CO2e)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="1"
                    value={cantidadKg}
                    onChange={(e) => setCantidadKg(e.target.value)}
                    required
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-slate-400">
                    Equivale a {(parseFloat(cantidadKg) / 1000 || 0).toFixed(2)} t CO2e
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Comprobante / Serial de Registro (`comprobante` VARCHAR(255))
                </label>
                <input
                  type="text"
                  value={comprobante}
                  onChange={(e) => setComprobante(e.target.value)}
                  required
                  placeholder="Ej: VCS-VERRA-RET-2024-XXXX"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 font-mono text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Vista previa SQL */}
              <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                <div className="text-slate-400 text-[10px] mb-1 uppercase font-semibold">Sentencia SQL Generada:</div>
                <code>
                  INSERT INTO compensacion (id_empresa, id_proyecto, fecha, cantidad_kg_co2e, comprobante, creado_en) VALUES ({empresa?.id_empresa}, {idProyecto}, '{fecha}', {parseFloat(cantidadKg).toFixed(3)}, '{comprobante}', NOW());
                </code>
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
                  <span>Guardar Compensación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Certificado Oficial */}
      {isCertificadoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border-4 border-emerald-700 p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold uppercase tracking-tight text-slate-900">
                    Certificado de Mitigación de Huella de Carbono
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">ODS 13: Acción por el Clima · Estándar GHG Protocol</p>
                </div>
              </div>
              <button
                onClick={() => setIsCertificadoModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-4 space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Se certifica a:</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">{empresa?.nombre}</h4>
              <p className="text-xs text-slate-600 font-mono">NIT: {empresa?.nit}</p>

              <div className="max-w-md mx-auto bg-emerald-50 rounded-xl p-4 border border-emerald-200 space-y-1 my-4">
                <span className="text-xs text-emerald-800 font-semibold block">Volumen Total Compensado en el Sistema</span>
                <span className="text-3xl font-black text-emerald-900 font-mono">
                  {resumen.totalCompensadoTon} Toneladas CO2e
                </span>
                <span className="text-[11px] text-emerald-700 block">
                  ({resumen.totalCompensadoKg.toLocaleString('es-CO')} kg CO2 equivalente)
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
                Los créditos de carbono aquí acreditados han sido retirados formalmente en concordancia con los registros de la base de datos relacional y los proyectos de restauración ecológica en el territorio colombiano.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Auditoría de Base de Datos</span>
                <span className="font-mono text-slate-800 font-medium">phpMyAdmin / MySQL 8.0 Engine</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Fecha de Expedición</span>
                <span className="font-mono text-slate-800 font-medium">{new Date().toLocaleDateString('es-CO')}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsCertificadoModalOpen(false)}
                className="px-6 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Cerrar Certificado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
