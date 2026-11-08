import React from 'react';
import {
  Printer,
  FileCheck,
  Building2,
  Calendar,
  Layers,
  Database,
  Code2,
  CheckCircle2,
  Trees,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { dbStore } from '../services/dbStore';

export const AcademicDocumentView: React.FC = () => {
  const empresa = dbStore.getEmpresaActiva();
  const resumen = dbStore.getResumenHuella();
  const consumos = dbStore.getConsumosDetallados();
  const sedes = dbStore.getSedes();
  const factores = dbStore.getFactores();
  const compensaciones = dbStore.getCompensacionesDetalladas();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Barra de Acciones del Documento (Solo pantalla) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
            Punto 5 de la Tarea: Documento de Entrega con Evidencia de Interfaces
          </span>
          <h1 className="text-base font-bold text-slate-900">
            Documento Técnico Académico Formal (Eje 2 / Eje 3)
          </h1>
          <p className="text-xs text-slate-500">
            Listo para sustentación y exportación directa a formato PDF con estándar universitario.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-xs shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar en PDF</span>
        </button>
      </div>

      {/* CONTENEDOR DEL DOCUMENTO FORMAL (Estilizado para pantalla e impresión) */}
      <article className="bg-white p-8 md:p-14 rounded-2xl border border-slate-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-10 text-slate-800 leading-relaxed text-sm">
        {/* PORTADA ACADÉMICA FORMAL */}
        <header className="border-b-2 border-slate-900 pb-8 space-y-6 text-center">
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Fundación Universitaria del Área Andina
            </h2>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Facultad de Ingenierías y Ciencias Básicas · Ingeniería de Sistemas / Software
            </h3>
          </div>

          <div className="py-4 space-y-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight max-w-3xl mx-auto">
              Implementación de Aplicación Web para el ODS 13 (Acción por el Clima):
              Mapeo de Base de Datos Relacional vs. Modelo de Objetos (ORM) y Persistencia Transaccional
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl mx-auto italic">
              Actividad Evaluativa Eje 2 & Eje 3 — Cuadro Relacional phpMyAdmin, Mapeo Multilenguaje (Java, Python, C#, TypeScript) y Evidencia de Interfaces
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs text-left max-w-2xl mx-auto">
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Estudiante:</span>
              <strong className="text-slate-900 font-bold">Laura Villada</strong>
              <div className="text-[11px] text-slate-500">lvillada11@estudiantes.areandina.edu.co</div>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Contexto:</span>
              <strong className="text-slate-900 font-bold">ODS 13 & phpMyAdmin</strong>
              <div className="text-[11px] text-slate-500">MySQL / MariaDB 8.0 Engine</div>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-semibold text-[10px]">Fecha de Entrega:</span>
              <strong className="text-slate-900 font-bold">{new Date().toLocaleDateString('es-CO')}</strong>
              <div className="text-[11px] text-slate-500">Versión 1.0 Final</div>
            </div>
          </div>
        </header>

        {/* 1. INTRODUCCIÓN Y PROBLEMÁTICA ODS 13 */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>1. Introducción y Solución a la Problemática del ODS 13</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            El <strong>Objetivo de Desarrollo Sostenible 13 (Acción por el Clima)</strong> de las Naciones Unidas insta a adoptar medidas urgentes para combatir el cambio climático y sus efectos. Las organizaciones corporativas en Colombia y Latinoamérica se enfrentan al reto de cuantificar con rigor metrológico su huella de carbono (Alcances 1 y 2 del estándar internacional <em>GHG Protocol</em>), desglosarla por sedes operativas, vincularla a factores de emisión oficiales de la <strong>UPME</strong> (Unidad de Planeación Minero Energética) y el <strong>IPCC</strong>, y neutralizar el remanente mediante proyectos certificados de compensación ecológica.
          </p>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            Esta aplicación web soluciona integralmente dicha problemática, permitiendo que la organización <strong>{empresa?.nombre}</strong> (NIT: {empresa?.nit}) gestione su inventario de gases de efecto invernadero (GEI) de manera centralizada, calculando en tiempo real las toneladas de CO2e emitidas y compensadas a partir de la base de datos relacional creada en <strong>phpMyAdmin</strong>.
          </p>
        </section>

        {/* 2. ANÁLISIS DEL MODELO RELACIONAL (phpMyAdmin) */}
        <section className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>2. Diagrama del Modelo Relacional de la Base de Datos</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            A continuación se presenta el esquema relacional suministrado, construido y normalizado en <strong>phpMyAdmin</strong>. El diseño consta de <strong>8 tablas</strong> organizadas en tercera forma normal (3FN) con integridad referencial garantizada por claves foráneas (FK):
          </p>

          {/* Imagen suministrada por el usuario */}
          <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 text-center space-y-2">
            <img
              src="/assets/aistudio/image_b2dd23ab.png"
              alt="Diagrama Relacional de Base de Datos phpMyAdmin"
              className="max-h-[480px] w-auto mx-auto rounded-lg shadow-xs border border-slate-200 object-contain"
            />
            <span className="text-[11px] text-slate-500 font-medium block">
              Figura 1. Modelo Entidad-Relación Relacional (phpMyAdmin) con tablas USUARIO, EMPRESA, SEDE, FUENTE_EMISION, FACTOR_EMISION, CONSUMO, PROYECTO y COMPENSACION.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">Jerarquía de Emisiones:</strong>
              <p className="text-slate-600 text-[11px]">
                <code className="font-mono font-semibold">EMPRESA</code> (1) ➔ <code className="font-mono font-semibold">SEDE</code> (N) ➔ <code className="font-mono font-semibold">CONSUMO</code> (N). Cada consumo vincula un registro de <code className="font-mono font-semibold">FACTOR_EMISION</code> (FK) con precisión <code className="font-mono">DECIMAL(14,8)</code> para multiplicar la cantidad física y obtener los kg de CO2e.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-slate-900 block font-bold">Jerarquía de Mitigación:</strong>
              <p className="text-slate-600 text-[11px]">
                <code className="font-mono font-semibold">EMPRESA</code> (1) ➔ <code className="font-mono font-semibold">COMPENSACION</code> (N) ➔ respaldada por <code className="font-mono font-semibold">PROYECTO</code> (1). Registra seriales verificados de bonos de carbono para restar a la huella total.
              </p>
            </div>
          </div>
        </section>

        {/* 3. COMUNICACIÓN MODELO RELACIONAL VS MODELO DE OBJETOS (ORM) */}
        <section className="space-y-4 print-break-before">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>3. Comunicación: Modelo Relacional Vs. Modelo de Objetos (Mapeo ORM)</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            Para comunicar el modelo relacional (basado en tablas y álgebra relacional de Codd) con el modelo orientado a objetos (basado en clases, polimorfismo y encapsulamiento), se resolvió la <strong>Brecha de Impedancia (Object-Relational Impedance Mismatch)</strong> implementando un mapeo transparente mediante anotaciones estándar de la industria (JPA en Java, SQLAlchemy en Python, EF Core en C#):
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Concepto</th>
                  <th className="py-2.5 px-3">Modelo Relacional (SQL / phpMyAdmin)</th>
                  <th className="py-2.5 px-3">Modelo de Objetos (Dominio / POO)</th>
                  <th className="py-2.5 px-3">Técnica de Mapeo ORM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Estructura Base</td>
                  <td className="py-2 px-3 font-mono text-slate-700">Tabla normalizada (`consumo`)</td>
                  <td className="py-2 px-3 font-mono text-indigo-700">Clase de Entidad (`Consumo`)</td>
                  <td className="py-2 px-3 text-slate-600">`@Entity`, `@Table(name="consumo")`</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Identidad</td>
                  <td className="py-2 px-3 font-mono text-slate-700">Primary Key (`id_consumo INT AUTO_INCREMENT`)</td>
                  <td className="py-2 px-3 font-mono text-indigo-700">Identidad en memoria (`idConsumo Long`)</td>
                  <td className="py-2 px-3 text-slate-600">`@Id @GeneratedValue(strategy=IDENTITY)`</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Relación N a 1</td>
                  <td className="py-2 px-3 font-mono text-slate-700">Foreign Key numérica (`id_sede INT`)</td>
                  <td className="py-2 px-3 font-mono text-indigo-700">Referencia de objeto (`Sede sede`)</td>
                  <td className="py-2 px-3 text-slate-600">`@ManyToOne @JoinColumn(name="id_sede")`</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Relación 1 a N</td>
                  <td className="py-2 px-3 font-mono text-slate-700">Consulta SQL con `JOIN`</td>
                  <td className="py-2 px-3 font-mono text-indigo-700">Colección (`List&lt;Sede&gt; sedes`)</td>
                  <td className="py-2 px-3 text-slate-600">`@OneToMany(mappedBy="empresa")`</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-900">Comportamiento</td>
                  <td className="py-2 px-3 text-slate-700">Pasivo (Solo datos, triggers opcionales)</td>
                  <td className="py-2 px-3 font-mono text-indigo-700">Activo (`calcularEmisionesKg()`)</td>
                  <td className="py-2 px-3 text-slate-600">Métodos encapsulados en la entidad</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto space-y-2">
            <div className="text-indigo-400 font-semibold text-[11px]">
              // Extracto de Código: Entidad Consumo con Mapeo JPA y Lógica ODS 13
            </div>
            <pre className="text-slate-300">
{`@Entity
@Table(name = "consumo")
public class Consumo {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsumo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede", nullable = false)
    private Sede sede; // Mapeo ORM de Llave Foránea a Objeto

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_factor", nullable = false)
    private FactorEmision factor;

    @Column(precision = 14, scale = 3, nullable = false)
    private BigDecimal cantidad;

    // Lógica de Dominio Orientada a Objetos (ODS 13)
    public BigDecimal calcularEmisionesKg() {
        return this.cantidad.multiply(factor.getValor());
    }
}`}
            </pre>
          </div>
        </section>

        {/* 4. APLICACIÓN DE LA PERSISTENCIA DE DATOS */}
        <section className="space-y-4 print-break-inside-avoid">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>4. Aplicación de la Persistencia de Datos</span>
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            La persistencia de datos fue implementada bajo un esquema reactivo y transaccional que asegura la durabilidad (propiedad ACID de las bases de datos). Cada operación realizada en la interfaz web dispara inmediatamente la sentencia SQL correspondiente:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-emerald-700 block font-bold">1. Creación (INSERT):</strong>
              <code className="text-[10px] font-mono block bg-white p-1.5 rounded border border-slate-200 text-slate-800">
                INSERT INTO consumo (id_sede, id_factor, periodo, cantidad, creado_en) VALUES (1, 1, '2024-04-01', 14500.000, NOW());
              </code>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-amber-700 block font-bold">2. Modificación (UPDATE):</strong>
              <code className="text-[10px] font-mono block bg-white p-1.5 rounded border border-slate-200 text-slate-800">
                UPDATE factor_emision SET valor = 0.16430000, actualizado_en = NOW() WHERE id_factor = 1;
              </code>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
              <strong className="text-rose-700 block font-bold">3. Borrado Lógico (Soft Delete):</strong>
              <code className="text-[10px] font-mono block bg-white p-1.5 rounded border border-slate-200 text-slate-800">
                UPDATE consumo SET eliminado_en = NOW() WHERE id_consumo = 4;
              </code>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Además, el sistema incluye un generador de volcados completos (<code className="font-mono text-slate-800">.sql</code>) para importar en cualquier servidor phpMyAdmin local o remoto, garantizando interoperabilidad total con MySQL 8.0 y MariaDB.
          </p>
        </section>

        {/* 5. EVIDENCIA DE INTERFACES DEL SISTEMA */}
        <section className="space-y-6 print-break-before">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5 flex items-center gap-2">
            <span>5. Evidencia de Interfaces y Cumplimiento de Objetivos</span>
          </h2>

          {/* 5.1 Dashboard */}
          <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50 print-break-inside-avoid">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5.1 Módulo Dashboard ODS 13 (Consolidación de Huella de Carbono)
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Objetivo 1 Cumplido
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Presenta las métricas consolidadas en tiempo real: Emisiones Totales ({resumen.totalEmisionesTon} t CO2e), Compensación ({resumen.totalCompensadoTon} t CO2e), Balance Neto y % hacia Carbono Neutralidad, con gráficos de distribución por sede operativa y por fuente de recurso energético.
            </p>
            <div className="bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Emisión Total</span>
                <span className="font-bold font-mono text-slate-900">{resumen.totalEmisionesTon} t</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Compensación</span>
                <span className="font-bold font-mono text-emerald-700">{resumen.totalCompensadoTon} t</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Huella Neta</span>
                <span className="font-bold font-mono text-amber-700">{resumen.balanceNetoTon} t</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Mitigación</span>
                <span className="font-bold font-mono text-teal-700">{resumen.porcentajeCompensado}%</span>
              </div>
            </div>
          </div>

          {/* 5.2 Consumos */}
          <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50 print-break-inside-avoid">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5.2 Módulo de Registro y Cálculo de Consumos (`CONSUMO`)
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Objetivo 1 & 4 Cumplidos
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Formulario interactivo modal que vincula <code className="font-mono">SEDE</code> y <code className="font-mono">FACTOR_EMISION</code>, calculando automáticamente las emisiones mediante la regla de dominio <code className="font-mono text-emerald-800">cantidad * factor.valor</code> y desplegando la sentencia SQL antes de impactar el almacenamiento.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Registros activos en BD: {consumos.length} consumos validados en auditoría.
            </div>
          </div>

          {/* 5.3 Sedes y Factores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-break-inside-avoid">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5.3 Sedes Operativas (`SEDE`)
              </h3>
              <p className="text-xs text-slate-600">
                Gestión de centros de trabajo (Bogotá, Medellín, Cali). Permite auditoría geográfica y asignación de responsabilidades ambientales.
              </p>
              <div className="text-[11px] font-mono text-slate-500">Sedes activas: {sedes.length} sedes</div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5.4 Factores de Emisión (`FACTOR_EMISION`)
              </h3>
              <p className="text-xs text-slate-600">
                Mantenimiento de coeficientes oficiales de emisión de la UPME e IPCC con precisión <code className="font-mono font-bold">DECIMAL(14,8)</code>.
              </p>
              <div className="text-[11px] font-mono text-slate-500">Factores registrados: {factores.length} coeficientes</div>
            </div>
          </div>

          {/* 5.4 Compensaciones & Certificado */}
          <div className="space-y-2 border border-slate-200 rounded-xl p-4 bg-slate-50 print-break-inside-avoid">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5.5 Compensaciones Ambientales & Certificación (`COMPENSACION`)
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Alineación ODS 13
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Acreditación de bonos de carbono respaldados por proyectos ecológicos verificados (Reforestación Bosque de Niebla, Parque Fotovoltaico Guajira y REDD+ Selva Amazónica). Incluye generador de Certificado Oficial de Mitigación.
            </p>
          </div>

          {/* 5.5 Visualizador ORM & Consola SQL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-break-inside-avoid">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5.6 Visualizador de Mapeo ORM
              </h3>
              <p className="text-xs text-slate-600">
                Comparativa interactiva de código DDL de phpMyAdmin frente a clases de dominio en Java (Spring Boot JPA), Python (SQLAlchemy), C# (.NET) y TypeScript.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                5.7 Consola de Persistencia & Exportador SQL
              </h3>
              <p className="text-xs text-slate-600">
                Profiler de transacciones SQL en vivo y exportador del script completo <code className="font-mono">schema.sql</code> listo para ejecutar en phpMyAdmin.
              </p>
            </div>
          </div>
        </section>

        {/* 6. CONCLUSIONES */}
        <section className="space-y-3 print-break-inside-avoid">
          <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider border-b border-slate-200 pb-1.5">
            6. Conclusiones y Cumplimiento de Criterios
          </h2>
          <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside text-justify leading-relaxed">
            <li>
              <strong>Alineación con el ODS 13:</strong> Se desarrolló un software integral capaz de medir, monitorear y mitigar el impacto ambiental corporativo con trazabilidad científica por sede y recurso.
            </li>
            <li>
              <strong>Integración del Modelo Relacional de phpMyAdmin:</strong> Se incorporó fielmente el esquema de 8 tablas respetando sus tipos nativos, claves foráneas e índices.
            </li>
            <li>
              <strong>Superación de la Brecha de Impedancia:</strong> Se demostró cómo los marcos ORM modernos permiten mantener una arquitectura limpia desacoplando la persistencia en disco del modelo de dominio en memoria.
            </li>
            <li>
              <strong>Persistencia Verificada:</strong> El sistema provee tanto persistencia reactiva en cliente como un volcado SQL descargable que puede ser cargado inmediatamente en phpMyAdmin.
            </li>
          </ol>
        </section>

        {/* 7. REFERENCIAS */}
        <footer className="pt-6 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5 print-break-inside-avoid">
          <h3 className="font-bold uppercase tracking-wider text-slate-700 text-xs">Referencias Bibliográficas</h3>
          <p>• Naciones Unidas (2015). <em>Objetivo de Desarrollo Sostenible 13: Adoptar medidas urgentes para combatir el cambio climático y sus efectos</em>. ONU.</p>
          <p>• GHG Protocol (2004). <em>A Corporate Accounting and Reporting Standard</em>. World Resources Institute and World Business Council for Sustainable Development.</p>
          <p>• UPME (2024). <em>Factor de Emisión del Sistema Interconectado Nacional (SIN)</em>. Ministerio de Minas y Energía de Colombia.</p>
          <p>• Fowler, M. (2002). <em>Patterns of Enterprise Application Architecture</em>. Addison-Wesley Professional (Data Mapper & Identity Map Patterns).</p>
        </footer>
      </article>
    </div>
  );
};
