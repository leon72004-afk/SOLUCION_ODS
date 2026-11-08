import React, { useState } from 'react';
import {
  Code2,
  Database,
  ArrowRightLeft,
  Layers,
  BookOpen,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ORM_ENTITIES, IMPEDANCE_MISMATCH_TOPICS, EntityMappingDetail } from '../data/ormMappingData';

type TargetLanguage = 'java' | 'python' | 'csharp' | 'typescript';

export const OrmMappingView: React.FC = () => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>('consumo');
  const [selectedLanguage, setSelectedLanguage] = useState<TargetLanguage>('java');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const selectedEntity = ORM_ENTITIES.find((e) => e.id === selectedEntityId) || ORM_ENTITIES[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(label);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCodeForLanguage = (entity: EntityMappingDetail, lang: TargetLanguage): string => {
    switch (lang) {
      case 'java':
        return entity.codigoJavaJpa;
      case 'python':
        return entity.codigoPythonSqlAlchemy;
      case 'csharp':
        return entity.codigoCSharpEf;
      case 'typescript':
        return entity.codigoTypeScript;
    }
  };

  const getLanguageLabel = (lang: TargetLanguage): string => {
    switch (lang) {
      case 'java':
        return 'Java (Spring Boot / JPA Hibernate)';
      case 'python':
        return 'Python (SQLAlchemy 2.0 / Pydantic)';
      case 'csharp':
        return 'C# (.NET 8 / Entity Framework Core)';
      case 'typescript':
        return 'TypeScript (Domain Entity / Data Mapper)';
    }
  };

  return (
    <div className="space-y-8">
      {/* Encabezado Pedagógico */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
              <span className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/30">
                Punto 2 & 3 de la Tarea
              </span>
              <span>·</span>
              <span className="text-slate-300">Object-Relational Mapping (ORM)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Comunicación: Modelo Relacional vs. Modelo de Objetos
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mapeo de la base de datos MySQL (phpMyAdmin) hacia clases de dominio orientadas a objetos.
              Explora cómo los conceptos de tablas, claves foráneas y registros se traducen a entidades,
              referencias de punteros y lógica encapsulada en <strong className="text-white">Java, Python, C# y TypeScript</strong>.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
            <button
              onClick={() => setSelectedLanguage('java')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedLanguage === 'java'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Java (JPA)
            </button>
            <button
              onClick={() => setSelectedLanguage('python')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedLanguage === 'python'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Python (SQLAlchemy)
            </button>
            <button
              onClick={() => setSelectedLanguage('csharp')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedLanguage === 'csharp'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              C# (.NET EF)
            </button>
            <button
              onClick={() => setSelectedLanguage('typescript')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedLanguage === 'typescript'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TypeScript
            </button>
          </div>
        </div>
      </div>

      {/* Selector de Entidades */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-2">
          Entidad a Comparar:
        </span>
        {ORM_ENTITIES.map((ent) => (
          <button
            key={ent.id}
            onClick={() => setSelectedEntityId(ent.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 ${
              selectedEntityId === ent.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>{ent.nombreTabla}</span>
            <span className="text-[10px] opacity-75 font-mono">({ent.atributos.length} cols)</span>
          </button>
        ))}
      </div>

      {/* Descripción de la entidad seleccionada */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 font-mono">
              Tabla: `{selectedEntity.nombreTabla}`
            </span>
            <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-bold text-indigo-700 font-mono">
              Clase: `{selectedEntity.nombreClase}`
            </span>
          </div>
          <span className="text-xs text-slate-500">Lenguaje activo: {getLanguageLabel(selectedLanguage)}</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{selectedEntity.descripcion}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span>Enfoque Relacional (phpMyAdmin)</span>
            </div>
            <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
              {selectedEntity.relacionesRelacionales.map((rel, idx) => (
                <li key={idx} className="font-mono text-[11px]">{rel}</li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 space-y-1">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-700" />
              <span>Enfoque de Objetos (Dominio / POO)</span>
            </div>
            <ul className="text-indigo-800 space-y-0.5 list-disc list-inside">
              {selectedEntity.relacionesObjetos.map((rel, idx) => (
                <li key={idx} className="font-mono text-[11px]">{rel}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Split Screen de Código: SQL vs OOP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lado Relacional: SQL DDL */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xs flex flex-col">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono font-medium">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Esquema SQL (MySQL / MariaDB en phpMyAdmin)</span>
            </div>
            <button
              onClick={() => handleCopy(selectedEntity.codigoSqlDdl, 'sql')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1 transition-colors"
            >
              {copiedCode === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'sql' ? 'Copiado' : 'Copiar DDL'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed flex-1 bg-slate-950/80">
            <code>{selectedEntity.codigoSqlDdl}</code>
          </pre>
        </div>

        {/* Lado Objetos: Código de la Clase con Anotaciones ORM */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xs flex flex-col">
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2 font-mono font-medium">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>{getLanguageLabel(selectedLanguage)}</span>
            </div>
            <button
              onClick={() => handleCopy(getCodeForLanguage(selectedEntity, selectedLanguage), 'oop')}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1 transition-colors"
            >
              {copiedCode === 'oop' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'oop' ? 'Copiado' : 'Copiar Código'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed flex-1 bg-slate-950/80">
            <code>{getCodeForLanguage(selectedEntity, selectedLanguage)}</code>
          </pre>
        </div>
      </div>

      {/* Matriz de Mapeo de Atributos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Matriz de Mapeo Columna Relacional ↔ Propiedad de Objeto
            </h2>
            <p className="text-xs text-slate-500">
              Equivalencia estricta de tipos de datos, restricciones y anotaciones ORM
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            {selectedEntity.atributos.length} atributos mapeados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Columna SQL</th>
                <th className="py-3 px-4">Tipo SQL</th>
                <th className="py-3 px-4">Propiedad Objeto</th>
                <th className="py-3 px-4">Tipo en {selectedLanguage.toUpperCase()}</th>
                <th className="py-3 px-4">Anotación ORM</th>
                <th className="py-3 px-4">Propósito / Detalle Técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {selectedEntity.atributos.map((attr, idx) => {
                let tipoLang = attr.tipoJava;
                if (selectedLanguage === 'python') tipoLang = attr.tipoPython;
                if (selectedLanguage === 'csharp') tipoLang = attr.tipoCSharp;
                if (selectedLanguage === 'typescript') tipoLang = attr.tipoTypeScript;

                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{attr.columnaSql}</td>
                    <td className="py-3 px-4 font-mono text-cyan-700 bg-cyan-50/50 rounded-xs">{attr.tipoSql}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-700">{attr.propiedadObjeto}</td>
                    <td className="py-3 px-4 font-mono text-slate-800">{tipoLang}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-amber-800 max-w-xs truncate" title={attr.anotacionOrm}>
                      {attr.anotacionOrm}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">{attr.descripcion}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teoría de la Brecha de Impedancia (Impedance Mismatch) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900">
            Fundamento Teórico: La Brecha de Impedancia Objeto-Relacional (Impedance Mismatch)
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          La discrepancia o brecha de impedancia es el conjunto de dificultades conceptuales y técnicas que surgen
          al combinar el paradigma relacional (basado en tablas, tuplas y teoría de conjuntos) con el paradigma
          orientado a objetos (basado en clases, punteros en memoria y encapsulamiento).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {IMPEDANCE_MISMATCH_TOPICS.map((topic, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <h3 className="text-xs font-bold text-slate-900">{topic.titulo}</h3>
              <div className="space-y-1.5 text-xs">
                <div>
                  <strong className="text-cyan-800 block text-[11px]">Perspectiva Relacional (SQL):</strong>
                  <p className="text-slate-600">{topic.relacional}</p>
                </div>
                <div>
                  <strong className="text-indigo-800 block text-[11px]">Perspectiva de Objetos (POO):</strong>
                  <p className="text-slate-600">{topic.objetos}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                  <strong className="text-emerald-800 block text-[11px]">Cómo lo resuelve el ORM:</strong>
                  <p className="text-slate-700">{topic.solucionOrm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
