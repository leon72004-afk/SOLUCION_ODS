/**
 * Datos y explicaciones pedagógicas del Mapeo Objeto-Relacional (ORM)
 * Compara el Modelo Relacional (phpMyAdmin / SQL) vs el Modelo Orientado a Objetos (POJO / POCO / Data Classes)
 * en Java (JPA), Python (SQLAlchemy), C# (.NET Entity Framework Core) y TypeScript.
 */

export interface AttributeMapping {
  columnaSql: string;
  propiedadObjeto: string;
  tipoSql: string;
  tipoJava: string;
  tipoPython: string;
  tipoCSharp: string;
  tipoTypeScript: string;
  restriccionSql: string;
  anotacionOrm: string;
  descripcion: string;
}

export interface EntityMappingDetail {
  id: string;
  nombreTabla: string;
  nombreClase: string;
  descripcion: string;
  relacionesRelacionales: string[];
  relacionesObjetos: string[];
  atributos: AttributeMapping[];
  codigoSqlDdl: string;
  codigoJavaJpa: string;
  codigoPythonSqlAlchemy: string;
  codigoCSharpEf: string;
  codigoTypeScript: string;
}

export const ORM_ENTITIES: EntityMappingDetail[] = [
  {
    id: 'consumo',
    nombreTabla: 'CONSUMO',
    nombreClase: 'Consumo (Domain Entity)',
    descripcion: 'Representa el registro mensual de consumo de un recurso energético en una sede específica, con el factor de emisión asociado para el cálculo estandarizado de kg de CO2e.',
    relacionesRelacionales: [
      'FK (id_sede) -> SEDE(id_sede) [ON DELETE CASCADE]',
      'FK (id_factor) -> FACTOR_EMISION(id_factor) [ON DELETE RESTRICT]',
    ],
    relacionesObjetos: [
      '@ManyToOne / Sede sede (Referencia directa al objeto sede)',
      '@ManyToOne / FactorEmision factor (Referencia directa al objeto factor)',
      'Método de negocio: calcularEmisionesKg() = cantidad * factor.getValor()',
    ],
    atributos: [
      {
        columnaSql: 'id_consumo',
        propiedadObjeto: 'idConsumo',
        tipoSql: 'INT',
        tipoJava: 'Long',
        tipoPython: 'int',
        tipoCSharp: 'int',
        tipoTypeScript: 'number',
        restriccionSql: 'PRIMARY KEY AUTO_INCREMENT',
        anotacionOrm: '@Id @GeneratedValue(strategy = GenerationType.IDENTITY)',
        descripcion: 'Identificador único subrogado de la transacción de consumo.',
      },
      {
        columnaSql: 'id_sede',
        propiedadObjeto: 'sede',
        tipoSql: 'INT',
        tipoJava: 'Sede',
        tipoPython: 'Sede (relationship)',
        tipoCSharp: 'Sede',
        tipoTypeScript: 'Sede',
        restriccionSql: 'FOREIGN KEY -> SEDE(id_sede)',
        anotacionOrm: '@ManyToOne @JoinColumn(name = "id_sede")',
        descripcion: 'En BD es un número entero (FK). En POO es la referencia al objeto Sede en memoria.',
      },
      {
        columnaSql: 'id_factor',
        propiedadObjeto: 'factor',
        tipoSql: 'INT',
        tipoJava: 'FactorEmision',
        tipoPython: 'FactorEmision (relationship)',
        tipoCSharp: 'FactorEmision',
        tipoTypeScript: 'FactorEmision',
        restriccionSql: 'FOREIGN KEY -> FACTOR_EMISION(id_factor)',
        anotacionOrm: '@ManyToOne @JoinColumn(name = "id_factor")',
        descripcion: 'En BD guarda la FK. En el modelo de objetos se navega directamente a las propiedades del factor.',
      },
      {
        columnaSql: 'periodo',
        propiedadObjeto: 'periodo',
        tipoSql: 'DATE',
        tipoJava: 'LocalDate',
        tipoPython: 'date',
        tipoCSharp: 'DateOnly',
        tipoTypeScript: 'string',
        restriccionSql: 'NOT NULL (YYYY-MM-01)',
        anotacionOrm: '@Column(name = "periodo", nullable = false)',
        descripcion: 'Mes y año contable del registro de inventario de GEI.',
      },
      {
        columnaSql: 'cantidad',
        propiedadObjeto: 'cantidad',
        tipoSql: 'DECIMAL(14,3)',
        tipoJava: 'BigDecimal',
        tipoPython: 'Decimal',
        tipoCSharp: 'decimal',
        tipoTypeScript: 'number',
        restriccionSql: 'NOT NULL',
        anotacionOrm: '@Column(precision = 14, scale = 3)',
        descripcion: 'Magnitud consumida en las unidades del factor (kWh, m3, galones).',
      },
      {
        columnaSql: 'creado_en',
        propiedadObjeto: 'creadoEn',
        tipoSql: 'TIMESTAMP',
        tipoJava: 'LocalDateTime',
        tipoPython: 'datetime',
        tipoCSharp: 'DateTime',
        tipoTypeScript: 'string',
        restriccionSql: 'DEFAULT CURRENT_TIMESTAMP',
        anotacionOrm: '@CreationTimestamp @Column(name = "creado_en")',
        descripcion: 'Auditoría automática de creación de la fila.',
      },
      {
        columnaSql: 'eliminado_en',
        propiedadObjeto: 'eliminadoEn',
        tipoSql: 'TIMESTAMP NULL',
        tipoJava: 'LocalDateTime',
        tipoPython: 'Optional[datetime]',
        tipoCSharp: 'DateTime?',
        tipoTypeScript: 'string | null',
        restriccionSql: 'DEFAULT NULL',
        anotacionOrm: '@Column(name = "eliminado_en")',
        descripcion: 'Permite borrado lógico (Soft Delete) sin violar integridad referencial.',
      },
    ],
    codigoSqlDdl: `CREATE TABLE \`consumo\` (
  \`id_consumo\` int(11) NOT NULL AUTO_INCREMENT,
  \`id_sede\` int(11) NOT NULL,
  \`id_factor\` int(11) NOT NULL,
  \`periodo\` date NOT NULL COMMENT 'YYYY-MM-01',
  \`cantidad\` decimal(14,3) NOT NULL,
  \`creado_en\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`actualizado_en\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  \`eliminado_en\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id_consumo\`),
  KEY \`idx_consumo_sede\` (\`id_sede\`),
  KEY \`idx_consumo_factor\` (\`id_factor\`),
  CONSTRAINT \`fk_consumo_sede\` FOREIGN KEY (\`id_sede\`) 
    REFERENCES \`sede\` (\`id_sede\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_consumo_factor\` FOREIGN KEY (\`id_factor\`) 
    REFERENCES \`factor_emision\` (\`id_factor\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    codigoJavaJpa: `package co.edu.areandina.ecotrack.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "consumo")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Consumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consumo")
    private Long idConsumo;

    // Mapeo ORM: Llave Foránea a Objeto Sede
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sede", nullable = false)
    private Sede sede;

    // Mapeo ORM: Llave Foránea a Objeto FactorEmision
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_factor", nullable = false)
    private FactorEmision factor;

    @Column(name = "periodo", nullable = false)
    private LocalDate periodo;

    @Column(name = "cantidad", precision = 14, scale = 3, nullable = false)
    private BigDecimal cantidad;

    @CreationTimestamp
    @Column(name = "creado_en", updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "eliminado_en")
    private LocalDateTime eliminadoEn;

    // Lógica de negocio en el objeto (Encapsulamiento ODS 13)
    public BigDecimal calcularEmisionesKg() {
        if (cantidad == null || factor == null || factor.getValor() == null) {
            return BigDecimal.ZERO;
        }
        return this.cantidad.multiply(factor.getValor());
    }

    public BigDecimal calcularEmisionesToneladas() {
        return calcularEmisionesKg().divide(BigDecimal.valueOf(1000));
    }
}`,
    codigoPythonSqlAlchemy: `from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from sqlalchemy import Integer, Numeric, Date, DateTime, ForeignKey, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Consumo(Base):
    __tablename__ = "consumo"

    id_consumo: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_sede: Mapped[int] = mapped_column(ForeignKey("sede.id_sede", ondelete="CASCADE"), nullable=False)
    id_factor: Mapped[int] = mapped_column(ForeignKey("factor_emision.id_factor", ondelete="RESTRICT"), nullable=False)
    periodo: Mapped[date] = mapped_column(Date, nullable=False)
    cantidad: Mapped[Decimal] = mapped_column(Numeric(14, 3), nullable=False)
    creado_en: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    actualizado_en: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    eliminado_en: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relaciones del Modelo de Objetos
    sede: Mapped["Sede"] = relationship("Sede", back_populates="consumos")
    factor: Mapped["FactorEmision"] = relationship("FactorEmision")

    def calcular_emisiones_kg(self) -> Decimal:
        """Cálculo dinámico de emisiones de GEI según estándar GHG Protocol."""
        if not self.factor or not self.factor.valor:
            return Decimal("0.0")
        return self.cantidad * self.factor.valor`,
    codigoCSharpEf: `using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EcoTrack.Ods13.Domain.Entities
{
    [Table("consumo")]
    public class Consumo
    {
        [Key]
        [Column("id_consumo")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdConsumo { get; set; }

        [Column("id_sede")]
        public int IdSede { get; set; }

        [ForeignKey(nameof(IdSede))]
        public virtual Sede Sede { get; set; } = null!;

        [Column("id_factor")]
        public int IdFactor { get; set; }

        [ForeignKey(nameof(IdFactor))]
        public virtual FactorEmision Factor { get; set; } = null!;

        [Column("periodo", TypeName = "date")]
        public DateOnly Periodo { get; set; }

        [Column("cantidad", TypeName = "decimal(14,3)")]
        public decimal Cantidad { get; set; }

        [Column("creado_en")]
        public DateTime CreadoEn { get; set; } = DateTime.UtcNow;

        [Column("actualizado_en")]
        public DateTime ActualizadoEn { get; set; } = DateTime.UtcNow;

        [Column("eliminado_en")]
        public DateTime? EliminadoEn { get; set; }

        // Método de Dominio ODS 13
        public decimal CalcularEmisionesKg() => Cantidad * (Factor?.Valor ?? 0m);
        public decimal CalcularEmisionesTon() => CalcularEmisionesKg() / 1000m;
    }
}`,
    codigoTypeScript: `export interface ConsumoEntity {
  id_consumo: number;
  id_sede: number;
  id_factor: number;
  periodo: string; // YYYY-MM-01
  cantidad: number;
  creado_en: string;
  actualizado_en: string;
  eliminado_en: string | null;
  // Propiedades hidratadas por el ORM / Data Mapper:
  sede?: SedeEntity;
  factor?: FactorEmisionEntity;
}

export class ConsumoModel {
  constructor(public data: ConsumoEntity) {}

  public get emisionKgCo2e(): number {
    return this.data.factor ? this.data.cantidad * this.data.factor.valor : 0;
  }

  public get emisionTonCo2e(): number {
    return this.emisionKgCo2e / 1000;
  }
}`,
  },
  {
    id: 'empresa',
    nombreTabla: 'EMPRESA',
    nombreClase: 'Empresa (Domain Entity)',
    descripcion: 'Entidad corporativa responsable del inventario de carbono corporativo. Centraliza las sedes operativas y las inversiones en proyectos de compensación.',
    relacionesRelacionales: [
      'FK (id_usuario) -> USUARIO(id_usuario) [Propietario / Administrador]',
      '1 a N con SEDE (una empresa tiene múltiples sedes operativas)',
      '1 a N con COMPENSACION (una empresa registra múltiples compensaciones)',
    ],
    relacionesObjetos: [
      '@ManyToOne / Usuario propietario',
      '@OneToMany / List<Sede> sedes',
      '@OneToMany / List<Compensacion> compensaciones',
      'Método: calcularHuellaNeta() = totalEmisiones() - totalCompensado()',
    ],
    atributos: [
      {
        columnaSql: 'id_empresa',
        propiedadObjeto: 'idEmpresa',
        tipoSql: 'INT',
        tipoJava: 'Long',
        tipoPython: 'int',
        tipoCSharp: 'int',
        tipoTypeScript: 'number',
        restriccionSql: 'PRIMARY KEY AUTO_INCREMENT',
        anotacionOrm: '@Id @GeneratedValue(strategy = GenerationType.IDENTITY)',
        descripcion: 'Clave primaria autoincremental.',
      },
      {
        columnaSql: 'id_usuario',
        propiedadObjeto: 'usuarioPropietario',
        tipoSql: 'INT',
        tipoJava: 'Usuario',
        tipoPython: 'Usuario',
        tipoCSharp: 'Usuario',
        tipoTypeScript: 'Usuario',
        restriccionSql: 'FOREIGN KEY -> USUARIO(id_usuario)',
        anotacionOrm: '@ManyToOne @JoinColumn(name = "id_usuario")',
        descripcion: 'Usuario administrador que gestiona la organización.',
      },
      {
        columnaSql: 'nit',
        propiedadObjeto: 'nit',
        tipoSql: 'VARCHAR(20)',
        tipoJava: 'String',
        tipoPython: 'str',
        tipoCSharp: 'string',
        tipoTypeScript: 'string',
        restriccionSql: 'UNIQUE KEY (uk_empresa_nit)',
        anotacionOrm: '@Column(length = 20, unique = true, nullable = false)',
        descripcion: 'Número de Identificación Tributaria oficial.',
      },
      {
        columnaSql: 'nombre',
        propiedadObjeto: 'nombre',
        tipoSql: 'VARCHAR(150)',
        tipoJava: 'String',
        tipoPython: 'str',
        tipoCSharp: 'string',
        tipoTypeScript: 'string',
        restriccionSql: 'NOT NULL',
        anotacionOrm: '@Column(length = 150, nullable = false)',
        descripcion: 'Razón social de la organización.',
      },
    ],
    codigoSqlDdl: `CREATE TABLE \`empresa\` (
  \`id_empresa\` int(11) NOT NULL AUTO_INCREMENT,
  \`id_usuario\` int(11) NOT NULL,
  \`nit\` varchar(20) NOT NULL,
  \`nombre\` varchar(150) NOT NULL,
  \`creado_en\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`actualizado_en\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  \`eliminado_en\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id_empresa\`),
  UNIQUE KEY \`uk_empresa_nit\` (\`nit\`),
  KEY \`idx_empresa_usuario\` (\`id_usuario\`),
  CONSTRAINT \`fk_empresa_usuario\` FOREIGN KEY (\`id_usuario\`) 
    REFERENCES \`usuario\` (\`id_usuario\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    codigoJavaJpa: `@Entity
@Table(name = "empresa")
@Getter @Setter
public class Empresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEmpresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 20)
    private String nit;

    @Column(nullable = false, length = 150)
    private String nombre;

    @OneToMany(mappedBy = "empresa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sede> sedes = new ArrayList<>();

    @OneToMany(mappedBy = "empresa")
    private List<Compensacion> compensaciones = new ArrayList<>();
}`,
    codigoPythonSqlAlchemy: `class Empresa(Base):
    __tablename__ = "empresa"

    id_empresa: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    id_usuario: Mapped[int] = mapped_column(ForeignKey("usuario.id_usuario"), nullable=False)
    nit: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)

    usuario: Mapped["Usuario"] = relationship("Usuario", back_populates="empresas")
    sedes: Mapped[list["Sede"]] = relationship("Sede", back_populates="empresa", cascade="all, delete-orphan")
    compensaciones: Mapped[list["Compensacion"]] = relationship("Compensacion", back_populates="empresa")`,
    codigoCSharpEf: `[Table("empresa")]
public class Empresa
{
    [Key]
    [Column("id_empresa")]
    public int IdEmpresa { get; set; }

    [Column("id_usuario")]
    public int IdUsuario { get; set; }
    public virtual Usuario Usuario { get; set; } = null!;

    [Column("nit")]
    [MaxLength(20)]
    public string Nit { get; set; } = string.Empty;

    [Column("nombre")]
    [MaxLength(150)]
    public string Nombre { get; set; } = string.Empty;

    public virtual ICollection<Sede> Sedes { get; set; } = new List<Sede>();
    public virtual ICollection<Compensacion> Compensaciones { get; set; } = new List<Compensacion>();
}`,
    codigoTypeScript: `export interface Empresa {
  id_empresa: number;
  id_usuario: number;
  nit: string;
  nombre: string;
  creado_en: string;
  actualizado_en: string;
  eliminado_en: string | null;
  // Navegación ORM:
  sedes?: Sede[];
  compensaciones?: Compensacion[];
}`,
  },
  {
    id: 'factor_emision',
    nombreTabla: 'FACTOR_EMISION',
    nombreClase: 'FactorEmision (Domain Entity)',
    descripcion: 'Contiene el coeficiente de cálculo de emisión de gases de efecto invernadero (GEI) por unidad de consumo, expresado con alta precisión DECIMAL(14,8).',
    relacionesRelacionales: [
      'FK (id_fuente) -> FUENTE_EMISION(id_fuente)',
      '1 a N con CONSUMO (un factor de emisión es utilizado por múltiples consumos)',
    ],
    relacionesObjetos: [
      '@ManyToOne / FuenteEmision fuente',
      '@OneToMany / List<Consumo> consumos',
      'Atributos de auditoría científica: anio, referencia (UPME, IPCC, DEFRA)',
    ],
    atributos: [
      {
        columnaSql: 'id_factor',
        propiedadObjeto: 'idFactor',
        tipoSql: 'INT',
        tipoJava: 'Long',
        tipoPython: 'int',
        tipoCSharp: 'int',
        tipoTypeScript: 'number',
        restriccionSql: 'PRIMARY KEY AUTO_INCREMENT',
        anotacionOrm: '@Id @GeneratedValue(strategy = GenerationType.IDENTITY)',
        descripcion: 'Clave primaria autoincremental.',
      },
      {
        columnaSql: 'valor',
        propiedadObjeto: 'valor',
        tipoSql: 'DECIMAL(14,8)',
        tipoJava: 'BigDecimal',
        tipoPython: 'Decimal',
        tipoCSharp: 'decimal',
        tipoTypeScript: 'number',
        restriccionSql: 'NOT NULL COMMENT "kg CO2e por unidad"',
        anotacionOrm: '@Column(precision = 14, scale = 8, nullable = false)',
        descripcion: 'Alta precisión numérica indispensable para normativas de cambio climático.',
      },
      {
        columnaSql: 'unidad_consumo',
        propiedadObjeto: 'unidadConsumo',
        tipoSql: 'VARCHAR(20)',
        tipoJava: 'String',
        tipoPython: 'str',
        tipoCSharp: 'string',
        tipoTypeScript: 'string',
        restriccionSql: 'NOT NULL',
        anotacionOrm: '@Column(length = 20, nullable = false)',
        descripcion: 'Unidad física de medida (kWh, m3, Galones, Km).',
      },
      {
        columnaSql: 'anio',
        propiedadObjeto: 'anio',
        tipoSql: 'SMALLINT',
        tipoJava: 'Integer',
        tipoPython: 'int',
        tipoCSharp: 'short',
        tipoTypeScript: 'number',
        restriccionSql: 'NOT NULL',
        anotacionOrm: '@Column(name = "anio")',
        descripcion: 'Vigencia del factor regulatorio oficial.',
      },
    ],
    codigoSqlDdl: `CREATE TABLE \`factor_emision\` (
  \`id_factor\` int(11) NOT NULL AUTO_INCREMENT,
  \`id_fuente\` int(11) NOT NULL,
  \`valor\` decimal(14,8) NOT NULL COMMENT 'kg CO2e por unidad',
  \`unidad_consumo\` varchar(20) NOT NULL,
  \`anio\` smallint(6) NOT NULL,
  \`referencia\` varchar(255) NOT NULL,
  \`creado_en\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`actualizado_en\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  \`eliminado_en\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id_factor\`),
  KEY \`idx_factor_fuente\` (\`id_fuente\`),
  CONSTRAINT \`fk_factor_fuente\` FOREIGN KEY (\`id_fuente\`) 
    REFERENCES \`fuente_emision\` (\`id_fuente\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    codigoJavaJpa: `@Entity
@Table(name = "factor_emision")
public class FactorEmision {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFactor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_fuente", nullable = false)
    private FuenteEmision fuente;

    @Column(precision = 14, scale = 8, nullable = false)
    private BigDecimal valor;

    @Column(name = "unidad_consumo", length = 20, nullable = false)
    private String unidadConsumo;

    @Column(nullable = false)
    private Integer anio;

    @Column(length = 255)
    private String referencia;
}`,
    codigoPythonSqlAlchemy: `class FactorEmision(Base):
    __tablename__ = "factor_emision"

    id_factor: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_fuente: Mapped[int] = mapped_column(ForeignKey("fuente_emision.id_fuente"))
    valor: Mapped[Decimal] = mapped_column(Numeric(14, 8), nullable=False)
    unidad_consumo: Mapped[str] = mapped_column(String(20), nullable=False)
    anio: Mapped[int] = mapped_column(Integer, nullable=False)
    referencia: Mapped[str] = mapped_column(String(255))

    fuente: Mapped["FuenteEmision"] = relationship("FuenteEmision")`,
    codigoCSharpEf: `[Table("factor_emision")]
public class FactorEmision
{
    [Key]
    public int IdFactor { get; set; }

    [ForeignKey(nameof(Fuente))]
    public int IdFuente { get; set; }
    public virtual FuenteEmision Fuente { get; set; } = null!;

    [Column(TypeName = "decimal(14,8)")]
    public decimal Valor { get; set; }

    [MaxLength(20)]
    public string UnidadConsumo { get; set; } = string.Empty;

    public short Anio { get; set; }
    public string Referencia { get; set; } = string.Empty;
}`,
    codigoTypeScript: `export interface FactorEmision {
  id_factor: number;
  id_fuente: number;
  valor: number; // decimal(14,8)
  unidad_consumo: string;
  anio: number;
  referencia: string;
  fuente?: FuenteEmision;
}`,
  },
  {
    id: 'compensacion',
    nombreTabla: 'COMPENSACION',
    nombreClase: 'Compensacion (Domain Entity)',
    descripcion: 'Acredita la neutralización de emisiones de CO2e mediante bonos de carbono respaldados por proyectos ambientales verificados.',
    relacionesRelacionales: [
      'FK (id_empresa) -> EMPRESA(id_empresa) [ON DELETE CASCADE]',
      'FK (id_proyecto) -> PROYECTO(id_proyecto) [ON DELETE RESTRICT]',
    ],
    relacionesObjetos: [
      '@ManyToOne / Empresa empresa',
      '@ManyToOne / Proyecto proyecto',
      'Propiedad de validación de serial y certificado de estándar internacional',
    ],
    atributos: [
      {
        columnaSql: 'id_compensacion',
        propiedadObjeto: 'idCompensacion',
        tipoSql: 'INT',
        tipoJava: 'Long',
        tipoPython: 'int',
        tipoCSharp: 'int',
        tipoTypeScript: 'number',
        restriccionSql: 'PRIMARY KEY AUTO_INCREMENT',
        anotacionOrm: '@Id @GeneratedValue(strategy = GenerationType.IDENTITY)',
        descripcion: 'Clave primaria de la transacción de compensación.',
      },
      {
        columnaSql: 'cantidad_kg_co2e',
        propiedadObjeto: 'cantidadKgCo2e',
        tipoSql: 'DECIMAL(14,3)',
        tipoJava: 'BigDecimal',
        tipoPython: 'Decimal',
        tipoCSharp: 'decimal',
        tipoTypeScript: 'number',
        restriccionSql: 'NOT NULL',
        anotacionOrm: '@Column(name = "cantidad_kg_co2e", precision = 14, scale = 3)',
        descripcion: 'Kilos de CO2e mitigados o capturados por el proyecto.',
      },
      {
        columnaSql: 'comprobante',
        propiedadObjeto: 'comprobante',
        tipoSql: 'VARCHAR(255)',
        tipoJava: 'String',
        tipoPython: 'str',
        tipoCSharp: 'string',
        tipoTypeScript: 'string',
        restriccionSql: 'NOT NULL',
        anotacionOrm: '@Column(length = 255, nullable = false)',
        descripcion: 'Identificador del certificado o serial en el registro de carbono.',
      },
    ],
    codigoSqlDdl: `CREATE TABLE \`compensacion\` (
  \`id_compensacion\` int(11) NOT NULL AUTO_INCREMENT,
  \`id_empresa\` int(11) NOT NULL,
  \`id_proyecto\` int(11) NOT NULL,
  \`fecha\` date NOT NULL,
  \`cantidad_kg_co2e\` decimal(14,3) NOT NULL,
  \`comprobante\` varchar(255) NOT NULL,
  \`creado_en\` timestamp NOT NULL DEFAULT current_timestamp(),
  \`actualizado_en\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  \`eliminado_en\` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (\`id_compensacion\`),
  KEY \`idx_compensacion_empresa\` (\`id_empresa\`),
  KEY \`idx_compensacion_proyecto\` (\`id_proyecto\`),
  CONSTRAINT \`fk_compensacion_empresa\` FOREIGN KEY (\`id_empresa\`) 
    REFERENCES \`empresa\` (\`id_empresa\`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT \`fk_compensacion_proyecto\` FOREIGN KEY (\`id_proyecto\`) 
    REFERENCES \`proyecto\` (\`id_proyecto\`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
    codigoJavaJpa: `@Entity
@Table(name = "compensacion")
public class Compensacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCompensacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_empresa", nullable = false)
    private Empresa empresa;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "cantidad_kg_co2e", precision = 14, scale = 3, nullable = false)
    private BigDecimal cantidadKgCo2e;

    @Column(nullable = false)
    private String comprobante;
}`,
    codigoPythonSqlAlchemy: `class Compensacion(Base):
    __tablename__ = "compensacion"

    id_compensacion: Mapped[int] = mapped_column(Integer, primary_key=True)
    id_empresa: Mapped[int] = mapped_column(ForeignKey("empresa.id_empresa"))
    id_proyecto: Mapped[int] = mapped_column(ForeignKey("proyecto.id_proyecto"))
    fecha: Mapped[date] = mapped_column(Date, nullable=False)
    cantidad_kg_co2e: Mapped[Decimal] = mapped_column(Numeric(14, 3), nullable=False)
    comprobante: Mapped[str] = mapped_column(String(255), nullable=False)

    empresa: Mapped["Empresa"] = relationship("Empresa", back_populates="compensaciones")
    proyecto: Mapped["Proyecto"] = relationship("Proyecto")`,
    codigoCSharpEf: `[Table("compensacion")]
public class Compensacion
{
    [Key]
    public int IdCompensacion { get; set; }

    [ForeignKey(nameof(Empresa))]
    public int IdEmpresa { get; set; }
    public virtual Empresa Empresa { get; set; } = null!;

    [ForeignKey(nameof(Proyecto))]
    public int IdProyecto { get; set; }
    public virtual Proyecto Proyecto { get; set; } = null!;

    public DateOnly Fecha { get; set; }
    public decimal CantidadKgCo2e { get; set; }
    public string Comprobante { get; set; } = string.Empty;
}`,
    codigoTypeScript: `export interface Compensacion {
  id_compensacion: number;
  id_empresa: number;
  id_proyecto: number;
  fecha: string;
  cantidad_kg_co2e: number;
  comprobante: string;
  empresa?: Empresa;
  proyecto?: Proyecto;
}`,
  },
];

export const IMPEDANCE_MISMATCH_TOPICS = [
  {
    titulo: '1. Diferencia de Paradigmas (Relacional vs. Orientado a Objetos)',
    relacional: 'Basado en el Álgebra Relacional de E.F. Codd y la teoría de conjuntos. Los datos se organizan en tuplas (filas) y relaciones (tablas) normalizadas. No existe noción de comportamiento o encapsulamiento.',
    objetos: 'Basado en principios de Abstracción, Encapsulamiento, Herencia y Polimorfismo. Los objetos combinan estado (campos) y comportamiento (métodos de cálculo de huella de carbono).',
    solucionOrm: 'El ORM actúa como puente bidireccional traduciendo tablas a clases y filas a instancias en memoria, inyectando métodos de negocio en las entidades.',
  },
  {
    titulo: '2. Identidad de Datos vs. Identidad de Objetos',
    relacional: 'Identidad definida por Claves Primarias (PK) numéricas o compuestas (`id_consumo`, `id_empresa`). Dos filas con los mismos datos pero distinta PK son entidades separadas.',
    objetos: 'Identidad definida por la dirección física de memoria (`==` por referencia) y por igualdad lógica (`equals()` / `hashCode()` o `===`).',
    solucionOrm: 'El patrón Identity Map y el Persistence Context de Hibernate / SQLAlchemy aseguran que una misma fila de BD solo tenga una única instancia viva en memoria.',
  },
  {
    titulo: '3. Asociaciones y Navegación (Llaves Foráneas vs. Punteros)',
    relacional: 'Las relaciones son no direccionales y se materializan mediante Llaves Foráneas (FK) que requieren sentencias explícitas `JOIN` entre tablas indexadas.',
    objetos: 'Las relaciones son dirigidas mediante referencias en memoria (`consumo.getSede().getNombre()`). Las relaciones bidireccionales deben mantenerse explícitamente en el código.',
    solucionOrm: 'Mapeo `@ManyToOne`, `@OneToMany` y Carga Perezosa (Lazy Loading) o Anticipada (Eager Loading) para hidratar grafos de objetos automáticamente.',
  },
  {
    titulo: '4. Granularidad y Tipos de Datos Específicos',
    relacional: 'Tipos escalares estándar de base de datos (`INT`, `VARCHAR(150)`, `DECIMAL(14,8)`, `DATE`).',
    objetos: 'Tipos ricos de dominio y Value Objects (e.g., `EmisionCO2e`, `PeriodoContable`, `CoordenadaGeo`).',
    solucionOrm: 'Uso de anotaciones `@Embedded` / `@Embeddable` o conversores JPA (`AttributeConverter`) para mapear objetos de valor en una o más columnas de BD.',
  },
];
