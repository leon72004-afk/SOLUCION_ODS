import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, MapPin, X, Check, Flame } from 'lucide-react';
import { dbStore } from '../services/dbStore';
import { Sede } from '../types/database';

interface SedesViewProps {
  onVerConsumosSede?: (id_sede: number) => void;
}

export const SedesView: React.FC<SedesViewProps> = ({ onVerConsumosSede }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSede, setEditingSede] = useState<Sede | null>(null);

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');

  const sedes = dbStore.getSedes();
  const consumos = dbStore.getConsumosDetallados();
  const empresa = dbStore.getEmpresaActiva();

  const handleOpenCrear = () => {
    setEditingSede(null);
    setNombre('');
    setDireccion('');
    setCiudad('Bogotá D.C.');
    setIsModalOpen(true);
  };

  const handleOpenEditar = (sede: Sede) => {
    setEditingSede(sede);
    setNombre(sede.nombre);
    setDireccion(sede.direccion);
    setCiudad(sede.ciudad);
    setIsModalOpen(true);
  };

  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setEditingSede(null);
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !direccion.trim() || !ciudad.trim() || !empresa) {
      alert('Por favor complete todos los campos');
      return;
    }

    dbStore.saveSede({
      id_sede: editingSede ? editingSede.id_sede : undefined,
      id_empresa: empresa.id_empresa,
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
    });

    handleCerrarModal();
  };

  const handleEliminar = (id: number) => {
    if (confirm(`¿Confirma eliminar la sede #${id}? Esta acción marcará eliminado_en en la base de datos.`)) {
      dbStore.deleteSede(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
            <span>Tabla de BD: SEDE</span>
            <span>·</span>
            <span>Relación 1 a N con EMPRESA y 1 a N con CONSUMO</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            Sedes Operativas de {empresa?.nombre}
          </h1>
          <p className="text-xs text-slate-500">
            Centros de trabajo, plantas industriales y puntos de atención donde se miden los consumos de energía.
          </p>
        </div>

        <button
          onClick={handleOpenCrear}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nueva Sede</span>
        </button>
      </div>

      {/* Grid de Sedes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {sedes.map((sede) => {
          const consumosSede = consumos.filter((c) => c.id_sede === sede.id_sede);
          const totalEmisionesKg = consumosSede.reduce((acc, c) => acc + c.emision_calculada_kg_co2e, 0);
          const totalEmisionesTon = Math.round((totalEmisionesKg / 1000) * 100) / 100;

          return (
            <div
              key={sede.id_sede}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditar(sede)}
                      title="Editar sede"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEliminar(sede.id_sede)}
                      title="Eliminar sede"
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{sede.nombre}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{sede.ciudad} · {sede.direccion}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Consumos</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">{consumosSede.length}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Emisión</span>
                    <span className="font-mono font-bold text-rose-700 text-sm">{totalEmisionesTon} t CO2e</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>id_sede: #{sede.id_sede}</span>
                <span>Registrado: {sede.creado_en.substring(0, 10)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Crear / Editar Sede */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingSede ? `Editar Sede #${editingSede.id_sede}` : 'Registrar Nueva Sede'}
                </h3>
                <p className="text-xs text-slate-500">Mapeado a la tabla relacional `sede`</p>
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
                  Nombre de la Sede (`nombre` VARCHAR(100))
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Planta Norte, Sede Administrativa..."
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dirección (`direccion` VARCHAR(200))
                </label>
                <input
                  type="text"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Carrera 15 # 85-20"
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ciudad (`ciudad` VARCHAR(100))
                </label>
                <input
                  type="text"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ej: Bogotá, Medellín, Cali, Barranquilla..."
                  required
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Vista previa SQL */}
              <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-emerald-400 overflow-x-auto">
                <div className="text-slate-400 text-[10px] mb-1 uppercase font-semibold">Sentencia SQL Generada:</div>
                {editingSede ? (
                  <code>
                    UPDATE sede SET nombre = '{nombre}', direccion = '{direccion}', ciudad = '{ciudad}', actualizado_en = NOW() WHERE id_sede = {editingSede.id_sede};
                  </code>
                ) : (
                  <code>
                    INSERT INTO sede (id_empresa, nombre, direccion, ciudad, creado_en) VALUES ({empresa?.id_empresa}, '{nombre}', '{direccion}', '{ciudad}', NOW());
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
                  <span>{editingSede ? 'Actualizar Sede' : 'Guardar Sede'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
