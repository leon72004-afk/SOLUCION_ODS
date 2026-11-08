/**
 * Definición de tipos de datos para la base de datos relacional y el modelo de objetos.
 * Coincide exactamente con el esquema relacional de phpMyAdmin:
 * - USUARIO
 * - EMPRESA
 * - SEDE
 * - FUENTE_EMISION
 * - FACTOR_EMISION
 * - CONSUMO
 * - PROYECTO
 * - COMPENSACION
 */

export interface Usuario {
  id_usuario: number; // INT AUTO_INCREMENT PK
  nombre: string; // VARCHAR(100)
  correo: string; // VARCHAR(150) UK
  password_hash: string; // VARCHAR(255)
  creado_en: string; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  actualizado_en: string; // TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

export interface Empresa {
  id_empresa: number; // INT AUTO_INCREMENT PK
  id_usuario: number; // INT FK -> USUARIO(id_usuario)
  nit: string; // VARCHAR(20) UK
  nombre: string; // VARCHAR(150)
  creado_en: string; // TIMESTAMP
  actualizado_en: string; // TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

export interface Sede {
  id_sede: number; // INT AUTO_INCREMENT PK
  id_empresa: number; // INT FK -> EMPRESA(id_empresa)
  nombre: string; // VARCHAR(100)
  direccion: string; // VARCHAR(200)
  ciudad: string; // VARCHAR(100)
  creado_en: string; // TIMESTAMP
  actualizado_en: string; // TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

export interface FuenteEmision {
  id_fuente: number; // INT AUTO_INCREMENT PK
  nombre: string; // VARCHAR(80) UK
  creado_en: string; // TIMESTAMP
  actualizado_en: string; // TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

export interface FactorEmision {
  id_factor: number; // INT AUTO_INCREMENT PK
  id_fuente: number; // INT FK -> FUENTE_EMISION(id_fuente)
  valor: number; // DECIMAL(14,8) - kg CO2e por unidad
  unidad_consumo: string; // VARCHAR(20) - kWh, m3, galón, etc.
  anio: number; // SMALLINT
  referencia: string; // VARCHAR(255)
  creado_en: string; // TIMESTAMP
  actualizado_en: string; // TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

export interface Consumo {
  id_consumo: number; // INT AUTO_INCREMENT PK
  id_sede: number; // INT FK -> SEDE(id_sede)
  id_factor: number; // INT FK -> FACTOR_EMISION(id_factor)
  periodo: string; // DATE (YYYY-MM-01)
  cantidad: number; // DECIMAL(14,3)
  creado_en: string; // TIMESTAMP
  actualizado_en: string; // TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

export interface Proyecto {
  id_proyecto: number; // INT AUTO_INCREMENT PK
  nombre: string; // VARCHAR(150)
  descripcion: string; // VARCHAR(500)
  creado_en: string; // TIMESTAMP
  actualizado_en: string; // TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

export interface Compensacion {
  id_compensacion: number; // INT AUTO_INCREMENT PK
  id_empresa: number; // INT FK -> EMPRESA(id_empresa)
  id_proyecto: number; // INT FK -> PROYECTO(id_proyecto)
  fecha: string; // DATE (YYYY-MM-DD)
  cantidad_kg_co2e: number; // DECIMAL(14,3)
  comprobante: string; // VARCHAR(255)
  creado_en: string; // TIMESTAMP
  actualizado_en: string; // TIMESTAMP
  eliminado_en: string | null; // TIMESTAMP NULL
}

/**
 * Modelo de Dominio Orientado a Objetos (Domain Model / DTO con relaciones hidratadas)
 */
export interface ConsumoDetallado extends Consumo {
  sede?: Sede;
  factor?: FactorEmision;
  fuente?: FuenteEmision;
  emision_calculada_kg_co2e: number; // cantidad * factor.valor
  emision_calculada_ton_co2e: number; // emision_calculada_kg_co2e / 1000
}

export interface CompensacionDetallada extends Compensacion {
  empresa?: Empresa;
  proyecto?: Proyecto;
  cantidad_ton_co2e: number; // cantidad_kg_co2e / 1000
}

export interface LogTransaccionSQL {
  id: string;
  timestamp: string;
  tipo: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  tabla: string;
  sentenciaSQL: string;
  descripcion: string;
  duracionMs: number;
}
