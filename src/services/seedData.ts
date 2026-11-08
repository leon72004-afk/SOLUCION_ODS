import { Usuario, Empresa, Sede, FuenteEmision, FactorEmision, Consumo, Proyecto, Compensacion } from '../types/database';

export const INITIAL_USUARIOS: Usuario[] = [
  {
    id_usuario: 1,
    nombre: 'Laura Villada',
    correo: 'lvillada11@estudiantes.areandina.edu.co',
    password_hash: '$2b$12$e8YkZ8mP4t0mZ0k3L9U2Oevy6E8G5u7I1X4b7v8C9w0a1b2c3d4e5', // bcrypt sample
    creado_en: '2024-01-15 08:30:00',
    actualizado_en: '2024-01-15 08:30:00',
    eliminado_en: null,
  },
  {
    id_usuario: 2,
    nombre: 'Carlos Mendoza Gómez',
    correo: 'cmendoza@sostenibilidad-andina.com',
    password_hash: '$2b$12$k8TzL9mN2p1qR3s4T5u6Ve9X0y1A2b3C4d5E6f7G8h9I0j1K2l3M4',
    creado_en: '2024-02-01 10:15:00',
    actualizado_en: '2024-02-01 10:15:00',
    eliminado_en: null,
  },
];

export const INITIAL_EMPRESAS: Empresa[] = [
  {
    id_empresa: 1,
    id_usuario: 1,
    nit: '901.458.720-3',
    nombre: 'BioIndustrias Andinas S.A.S.',
    creado_en: '2024-01-16 09:00:00',
    actualizado_en: '2024-01-16 09:00:00',
    eliminado_en: null,
  },
  {
    id_empresa: 2,
    id_usuario: 2,
    nit: '860.012.345-1',
    nombre: 'Logística Verde del Café S.A.',
    creado_en: '2024-02-02 11:00:00',
    actualizado_en: '2024-02-02 11:00:00',
    eliminado_en: null,
  },
];

export const INITIAL_SEDES: Sede[] = [
  {
    id_sede: 1,
    id_empresa: 1,
    nombre: 'Sede Principal Calle 72',
    direccion: 'Calle 72 # 10-34, Chapinero',
    ciudad: 'Bogotá D.C.',
    creado_en: '2024-01-18 10:00:00',
    actualizado_en: '2024-01-18 10:00:00',
    eliminado_en: null,
  },
  {
    id_sede: 2,
    id_empresa: 1,
    nombre: 'Planta de Producción Guayabal',
    direccion: 'Carrera 52 # 14-80, Guayabal',
    ciudad: 'Medellín',
    creado_en: '2024-01-18 10:15:00',
    actualizado_en: '2024-01-18 10:15:00',
    eliminado_en: null,
  },
  {
    id_sede: 3,
    id_empresa: 1,
    nombre: 'Centro Logístico Yumbo',
    direccion: 'Zona Franca del Pacífico Mz. 4',
    ciudad: 'Cali / Yumbo',
    creado_en: '2024-01-18 10:30:00',
    actualizado_en: '2024-01-18 10:30:00',
    eliminado_en: null,
  },
  // Sedes para Empresa 2 (Logística Verde del Café S.A.)
  {
    id_sede: 4,
    id_empresa: 2,
    nombre: 'Sede Principal Eje Cafetero',
    direccion: 'Km 5 Vía Armenia - Pereira',
    ciudad: 'Pereira',
    creado_en: '2024-02-05 09:00:00',
    actualizado_en: '2024-02-05 09:00:00',
    eliminado_en: null,
  },
  {
    id_sede: 5,
    id_empresa: 2,
    nombre: 'Centro de Acopio y Trilla',
    direccion: 'Zona Industrial Maltería Lote 8',
    ciudad: 'Manizales',
    creado_en: '2024-02-05 09:30:00',
    actualizado_en: '2024-02-05 09:30:00',
    eliminado_en: null,
  },
];

export const INITIAL_FUENTES: FuenteEmision[] = [
  {
    id_fuente: 1,
    nombre: 'Electricidad (Sistema Interconectado Nacional - SIN)',
    creado_en: '2024-01-10 08:00:00',
    actualizado_en: '2024-01-10 08:00:00',
    eliminado_en: null,
  },
  {
    id_fuente: 2,
    nombre: 'Gas Natural Comercial / Industrial',
    creado_en: '2024-01-10 08:05:00',
    actualizado_en: '2024-01-10 08:05:00',
    eliminado_en: null,
  },
  {
    id_fuente: 3,
    nombre: 'Combustible Diésel B10 (Flota vehicular y calderas)',
    creado_en: '2024-01-10 08:10:00',
    actualizado_en: '2024-01-10 08:10:00',
    eliminado_en: null,
  },
  {
    id_fuente: 4,
    nombre: 'Gasolina Corriente E10 (Vehículos de reparto)',
    creado_en: '2024-01-10 08:15:00',
    actualizado_en: '2024-01-10 08:15:00',
    eliminado_en: null,
  },
  {
    id_fuente: 5,
    nombre: 'Vuelos Corporativos Nacionales (Movilidad ejecutiva)',
    creado_en: '2024-01-10 08:20:00',
    actualizado_en: '2024-01-10 08:20:00',
    eliminado_en: null,
  },
];

export const INITIAL_FACTORES: FactorEmision[] = [
  {
    id_factor: 1,
    id_fuente: 1,
    valor: 0.16430000, // kg CO2e / kWh (Factor oficial UPME Colombia 2024)
    unidad_consumo: 'kWh',
    anio: 2024,
    referencia: 'UPME - Factor de Emisión Red Eléctrica Nacional SIN 2024',
    creado_en: '2024-01-12 09:00:00',
    actualizado_en: '2024-01-12 09:00:00',
    eliminado_en: null,
  },
  {
    id_factor: 2,
    id_fuente: 2,
    valor: 1.98600000, // kg CO2e / m3
    unidad_consumo: 'm3',
    anio: 2024,
    referencia: 'IPCC Directrices Nacionales de GEI / UPME',
    creado_en: '2024-01-12 09:05:00',
    actualizado_en: '2024-01-12 09:05:00',
    eliminado_en: null,
  },
  {
    id_factor: 3,
    id_fuente: 3,
    valor: 10.21000000, // kg CO2e / Galón
    unidad_consumo: 'Galones',
    anio: 2024,
    referencia: 'Resolución Ministerio de Ambiente y Desarrollo Sostenible',
    creado_en: '2024-01-12 09:10:00',
    actualizado_en: '2024-01-12 09:10:00',
    eliminado_en: null,
  },
  {
    id_factor: 4,
    id_fuente: 4,
    valor: 8.78000000, // kg CO2e / Galón
    unidad_consumo: 'Galones',
    anio: 2024,
    referencia: 'GHG Protocol Mobile Combustion Tool v2.6',
    creado_en: '2024-01-12 09:15:00',
    actualizado_en: '2024-01-12 09:15:00',
    eliminado_en: null,
  },
  {
    id_factor: 5,
    id_fuente: 5,
    valor: 0.15800000, // kg CO2e / pasajero-km
    unidad_consumo: 'Pasajero-km',
    anio: 2024,
    referencia: 'DEFRA UK / ICAO Carbon Calculator',
    creado_en: '2024-01-12 09:20:00',
    actualizado_en: '2024-01-12 09:20:00',
    eliminado_en: null,
  },
];

export const INITIAL_CONSUMOS: Consumo[] = [
  // Enero 2024
  {
    id_consumo: 1,
    id_sede: 1, // Bogotá
    id_factor: 1, // Electricidad
    periodo: '2024-01-01',
    cantidad: 14500.000, // 14,500 kWh -> 2,382.35 kg CO2e
    creado_en: '2024-02-05 14:00:00',
    actualizado_en: '2024-02-05 14:00:00',
    eliminado_en: null,
  },
  {
    id_consumo: 2,
    id_sede: 2, // Medellín
    id_factor: 1, // Electricidad
    periodo: '2024-01-01',
    cantidad: 28000.000, // 28,000 kWh -> 4,600.40 kg CO2e
    creado_en: '2024-02-05 14:15:00',
    actualizado_en: '2024-02-05 14:15:00',
    eliminado_en: null,
  },
  {
    id_consumo: 3,
    id_sede: 2, // Medellín
    id_factor: 2, // Gas Natural
    periodo: '2024-01-01',
    cantidad: 3200.000, // 3,200 m3 -> 6,355.20 kg CO2e
    creado_en: '2024-02-05 14:20:00',
    actualizado_en: '2024-02-05 14:20:00',
    eliminado_en: null,
  },
  {
    id_consumo: 4,
    id_sede: 3, // Yumbo
    id_factor: 3, // Diésel B10
    periodo: '2024-01-01',
    cantidad: 850.000, // 850 Galones -> 8,678.50 kg CO2e
    creado_en: '2024-02-05 14:30:00',
    actualizado_en: '2024-02-05 14:30:00',
    eliminado_en: null,
  },
  // Febrero 2024
  {
    id_consumo: 5,
    id_sede: 1, // Bogotá
    id_factor: 1, // Electricidad
    periodo: '2024-02-01',
    cantidad: 13900.000, // 13,900 kWh
    creado_en: '2024-03-04 11:00:00',
    actualizado_en: '2024-03-04 11:00:00',
    eliminado_en: null,
  },
  {
    id_consumo: 6,
    id_sede: 2, // Medellín
    id_factor: 1, // Electricidad
    periodo: '2024-02-01',
    cantidad: 26500.000, // 26,500 kWh
    creado_en: '2024-03-04 11:10:00',
    actualizado_en: '2024-03-04 11:10:00',
    eliminado_en: null,
  },
  {
    id_consumo: 7,
    id_sede: 3, // Yumbo
    id_factor: 4, // Gasolina
    periodo: '2024-02-01',
    cantidad: 620.000, // 620 Galones -> 5,443.60 kg CO2e
    creado_en: '2024-03-04 11:20:00',
    actualizado_en: '2024-03-04 11:20:00',
    eliminado_en: null,
  },
  // Marzo 2024
  {
    id_consumo: 8,
    id_sede: 1, // Bogotá
    id_factor: 5, // Vuelos ejecutivos
    periodo: '2024-03-01',
    cantidad: 12400.000, // 12,400 Pasajero-km -> 1,959.20 kg CO2e
    creado_en: '2024-04-02 09:30:00',
    actualizado_en: '2024-04-02 09:30:00',
    eliminado_en: null,
  },
  {
    id_consumo: 9,
    id_sede: 2, // Medellín
    id_factor: 2, // Gas Natural
    periodo: '2024-03-01',
    cantidad: 3050.000,
    creado_en: '2024-04-02 09:40:00',
    actualizado_en: '2024-04-02 09:40:00',
    eliminado_en: null,
  },
  // Consumos para Empresa 2 (Logística Verde del Café S.A. - Sedes 4 y 5)
  {
    id_consumo: 10,
    id_sede: 4, // Pereira
    id_factor: 1, // Electricidad
    periodo: '2024-02-01',
    cantidad: 9200.000,
    creado_en: '2024-03-05 10:00:00',
    actualizado_en: '2024-03-05 10:00:00',
    eliminado_en: null,
  },
  {
    id_consumo: 11,
    id_sede: 4, // Pereira
    id_factor: 3, // Diésel flota cafetera
    periodo: '2024-02-01',
    cantidad: 1400.000,
    creado_en: '2024-03-05 10:15:00',
    actualizado_en: '2024-03-05 10:15:00',
    eliminado_en: null,
  },
  {
    id_consumo: 12,
    id_sede: 5, // Manizales
    id_factor: 2, // Gas Natural para tostadoras
    periodo: '2024-02-01',
    cantidad: 2100.000,
    creado_en: '2024-03-05 10:30:00',
    actualizado_en: '2024-03-05 10:30:00',
    eliminado_en: null,
  },
];

export const INITIAL_PROYECTOS: Proyecto[] = [
  {
    id_proyecto: 1,
    nombre: 'Reforestación Bosque de Niebla en la Cordillera Central',
    descripcion: 'Restauración ecológica de cuencas hidrográficas y siembra de 25,000 especies nativas (Palma de cera y Aliso) en Caldas y Tolima para captura certificada de carbono.',
    creado_en: '2024-01-20 15:00:00',
    actualizado_en: '2024-01-20 15:00:00',
    eliminado_en: null,
  },
  {
    id_proyecto: 2,
    nombre: 'Parque Fotovoltaico Sol de la Guajira',
    descripcion: 'Generación limpia de 80 MW que desplaza generación térmica basada en carbón y fuel-oil, acreditada bajo el estándar internacional VCS (Verified Carbon Standard).',
    creado_en: '2024-01-20 15:15:00',
    actualizado_en: '2024-01-20 15:15:00',
    eliminado_en: null,
  },
  {
    id_proyecto: 3,
    nombre: 'Conservación REDD+ Selva Amazónica del Putumayo',
    descripcion: 'Protección de 120,000 hectáreas de bosque primario contra la deforestación ilegal con participación activa de comunidades indígenas y monitoreo satelital.',
    creado_en: '2024-01-20 15:30:00',
    actualizado_en: '2024-01-20 15:30:00',
    eliminado_en: null,
  },
];

export const INITIAL_COMPENSACIONES: Compensacion[] = [
  {
    id_compensacion: 1,
    id_empresa: 1,
    id_proyecto: 1, // Reforestación Bosque de Niebla
    fecha: '2024-02-15',
    cantidad_kg_co2e: 12500.000, // 12.5 Toneladas CO2e
    comprobante: 'CERT-CERCARBO-2024-00892',
    creado_en: '2024-02-15 16:00:00',
    actualizado_en: '2024-02-15 16:00:00',
    eliminado_en: null,
  },
  {
    id_compensacion: 2,
    id_empresa: 1,
    id_proyecto: 2, // Parque Fotovoltaico
    fecha: '2024-03-20',
    cantidad_kg_co2e: 15000.000, // 15.0 Toneladas CO2e
    comprobante: 'VCS-VERRA-RET-2024-9941',
    creado_en: '2024-03-20 17:30:00',
    actualizado_en: '2024-03-20 17:30:00',
    eliminado_en: null,
  },
  {
    id_compensacion: 3,
    id_empresa: 2, // Empresa 2
    id_proyecto: 3, // REDD+ Amazonía
    fecha: '2024-02-28',
    cantidad_kg_co2e: 8000.000, // 8.0 Toneladas CO2e
    comprobante: 'CERT-AMAZON-REDD-2024-1102',
    creado_en: '2024-02-28 14:00:00',
    actualizado_en: '2024-02-28 14:00:00',
    eliminado_en: null,
  },
];
