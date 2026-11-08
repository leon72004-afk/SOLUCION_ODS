/**
 * Servicio de Persistencia y Motor de Mapeo de Base de Datos (Data Mapper / ORM Simulation)
 * Implementa persistencia local reactiva y registra transacciones SQL en tiempo real
 * para demostrar el funcionamiento de la base de datos de phpMyAdmin.
 */

import {
  Usuario,
  Empresa,
  Sede,
  FuenteEmision,
  FactorEmision,
  Consumo,
  Proyecto,
  Compensacion,
  ConsumoDetallado,
  CompensacionDetallada,
  LogTransaccionSQL,
} from '../types/database';

import {
  INITIAL_USUARIOS,
  INITIAL_EMPRESAS,
  INITIAL_SEDES,
  INITIAL_FUENTES,
  INITIAL_FACTORES,
  INITIAL_CONSUMOS,
  INITIAL_PROYECTOS,
  INITIAL_COMPENSACIONES,
} from './seedData';

const STORAGE_KEY = 'ecotrack_ods13_db_v1';
const SQL_LOGS_KEY = 'ecotrack_ods13_sql_logs_v1';
const AUTH_USER_KEY = 'ecotrack_ods13_auth_user_id_v1';

interface DbState {
  usuarios: Usuario[];
  empresas: Empresa[];
  sedes: Sede[];
  fuentes: FuenteEmision[];
  factores: FactorEmision[];
  consumos: Consumo[];
  proyectos: Proyecto[];
  compensaciones: Compensacion[];
  activeEmpresaId: number;
}

class DatabaseStore {
  private state: DbState;
  private currentUserId: number | null = null;
  private sqlLogs: LogTransaccionSQL[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
    this.currentUserId = this.loadCurrentUserId();
    this.sqlLogs = this.loadSqlLogs();

    // Validar si el usuario activo tiene empresas asignadas
    if (this.currentUserId) {
      const userEmpresas = this.getEmpresasForUser(this.currentUserId);
      if (userEmpresas.length > 0 && !userEmpresas.some(e => e.id_empresa === this.state.activeEmpresaId)) {
        this.state.activeEmpresaId = userEmpresas[0].id_empresa;
      }
    }
  }

  private loadCurrentUserId(): number | null {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) {
        const id = Number(stored);
        if (!isNaN(id) && this.state.usuarios.some(u => u.id_usuario === id && !u.eliminado_en)) {
          return id;
        }
      }
    } catch {
      // Fallback
    }
    return null;
  }

  private loadState(): DbState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }

    return {
      usuarios: [...INITIAL_USUARIOS],
      empresas: [...INITIAL_EMPRESAS],
      sedes: [...INITIAL_SEDES],
      fuentes: [...INITIAL_FUENTES],
      factores: [...INITIAL_FACTORES],
      consumos: [...INITIAL_CONSUMOS],
      proyectos: [...INITIAL_PROYECTOS],
      compensaciones: [...INITIAL_COMPENSACIONES],
      activeEmpresaId: 1,
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // Ignore
    }
    this.notify();
  }

  private loadSqlLogs(): LogTransaccionSQL[] {
    try {
      const stored = localStorage.getItem(SQL_LOGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'init-1',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        tipo: 'SELECT',
        tabla: 'EMPRESA',
        sentenciaSQL: 'SELECT e.*, u.nombre as propietario FROM empresa e JOIN usuario u ON e.id_usuario = u.id_usuario WHERE e.id_empresa = 1 AND e.eliminado_en IS NULL;',
        descripcion: 'Carga inicial de entidad Empresa activa y usuario propietario',
        duracionMs: 1.4,
      },
      {
        id: 'init-2',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        tipo: 'SELECT',
        tabla: 'CONSUMO',
        sentenciaSQL: 'SELECT c.*, s.nombre AS sede, f.valor, fe.nombre AS fuente FROM consumo c JOIN sede s ON c.id_sede = s.id_sede JOIN factor_emision f ON c.id_factor = f.id_factor JOIN fuente_emision fe ON f.id_fuente = fe.id_fuente WHERE s.id_empresa = 1 AND c.eliminado_en IS NULL;',
        descripcion: 'Consulta relacional con JOIN múltiple para cálculo de huella de carbono',
        duracionMs: 2.1,
      },
    ];
  }

  private logSQL(
    tipo: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT',
    tabla: string,
    sentenciaSQL: string,
    descripcion: string,
    duracionMs: number = Math.round((Math.random() * 2 + 0.5) * 10) / 10
  ): void {
    const log: LogTransaccionSQL = {
      id: `sql-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      tipo,
      tabla,
      sentenciaSQL,
      descripcion,
      duracionMs,
    };
    this.sqlLogs.unshift(log);
    if (this.sqlLogs.length > 50) {
      this.sqlLogs.pop();
    }
    try {
      localStorage.setItem(SQL_LOGS_KEY, JSON.stringify(this.sqlLogs));
    } catch {
      // Ignore
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // --- Autenticación y Sesión de Usuario (Tabla USUARIO) ---
  public getCurrentUser(): Usuario | null {
    if (!this.currentUserId) return null;
    return this.state.usuarios.find(u => u.id_usuario === this.currentUserId && !u.eliminado_en) || null;
  }

  public login(correo: string, password?: string): { success: boolean; error?: string; usuario?: Usuario } {
    const cleanEmail = correo.trim().toLowerCase();
    const user = this.state.usuarios.find(
      u => u.correo.toLowerCase() === cleanEmail && !u.eliminado_en
    );

    if (!user) {
      this.logSQL(
        'SELECT',
        'USUARIO',
        `SELECT * FROM usuario WHERE correo = '${cleanEmail}' AND eliminado_en IS NULL; -- Intento fallido de inicio de sesión`,
        `Fallo de autenticación: usuario '${cleanEmail}' no encontrado`
      );
      return { success: false, error: 'Usuario no encontrado con el correo suministrado.' };
    }

    this.currentUserId = user.id_usuario;
    try {
      localStorage.setItem(AUTH_USER_KEY, String(user.id_usuario));
    } catch {
      // Ignore
    }

    // Auto-asignar la empresa del usuario
    const userEmpresas = this.getEmpresasForUser(user.id_usuario);
    if (userEmpresas.length > 0) {
      this.state.activeEmpresaId = userEmpresas[0].id_empresa;
    }

    this.logSQL(
      'SELECT',
      'USUARIO',
      `SELECT u.*, e.id_empresa, e.nombre AS empresa FROM usuario u LEFT JOIN empresa e ON u.id_usuario = e.id_usuario WHERE u.id_usuario = ${user.id_usuario} AND u.eliminado_en IS NULL;`,
      `Inicio de sesión exitoso: ${user.nombre} (${user.correo})`
    );

    this.saveState();
    return { success: true, usuario: user };
  }

  public logout(): void {
    const prevUser = this.getCurrentUser();
    this.currentUserId = null;
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch {
      // Ignore
    }

    if (prevUser) {
      this.logSQL(
        'SELECT',
        'USUARIO',
        `-- Cierre de sesión para usuario #${prevUser.id_usuario} (${prevUser.correo})`,
        `Cierre de sesión de ${prevUser.nombre}`
      );
    }

    this.notify();
  }

  public getEmpresasForUser(id_usuario?: number): Empresa[] {
    const userId = id_usuario ?? this.currentUserId;
    if (!userId) return this.getEmpresas();
    const userEmpresas = this.state.empresas.filter(e => e.id_usuario === userId && !e.eliminado_en);
    return userEmpresas.length > 0 ? userEmpresas : this.getEmpresas();
  }

  public saveEmpresa(data: { id_empresa?: number; id_usuario: number; nit: string; nombre: string }): Empresa {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (data.id_empresa) {
      const index = this.state.empresas.findIndex(e => e.id_empresa === data.id_empresa);
      if (index === -1) throw new Error('Empresa no encontrada');

      const updated: Empresa = {
        ...this.state.empresas[index],
        nit: data.nit.trim(),
        nombre: data.nombre.trim(),
        actualizado_en: now,
      };
      this.state.empresas[index] = updated;

      this.logSQL(
        'UPDATE',
        'EMPRESA',
        `UPDATE empresa SET nit = '${updated.nit}', nombre = '${updated.nombre.replace(/'/g, "\\'")}', actualizado_en = NOW() WHERE id_empresa = ${updated.id_empresa};`,
        `Actualización de empresa #${updated.id_empresa}`
      );

      this.saveState();
      return updated;
    } else {
      const nextId = this.state.empresas.reduce((max, e) => Math.max(max, e.id_empresa), 0) + 1;
      const nueva: Empresa = {
        id_empresa: nextId,
        id_usuario: data.id_usuario,
        nit: data.nit.trim(),
        nombre: data.nombre.trim(),
        creado_en: now,
        actualizado_en: now,
        eliminado_en: null,
      };
      this.state.empresas.push(nueva);
      this.state.activeEmpresaId = nextId;

      this.logSQL(
        'INSERT',
        'EMPRESA',
        `INSERT INTO empresa (id_usuario, nit, nombre, creado_en, actualizado_en) VALUES (${nueva.id_usuario}, '${nueva.nit}', '${nueva.nombre.replace(/'/g, "\\'")}', NOW(), NOW());`,
        `Registro de nueva empresa #${nextId}`
      );

      this.saveState();
      return nueva;
    }
  }

  public registerUserAndEmpresa(
    usuarioData: { nombre: string; correo: string; password?: string },
    empresaData: { nombre: string; nit: string }
  ): { usuario: Usuario; empresa: Empresa } {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    // Validar si el correo ya existe
    if (this.state.usuarios.some(u => u.correo.toLowerCase() === usuarioData.correo.trim().toLowerCase() && !u.eliminado_en)) {
      throw new Error('El correo electrónico ya se encuentra registrado en el sistema.');
    }

    const nextUserId = this.state.usuarios.reduce((max, u) => Math.max(max, u.id_usuario), 0) + 1;
    const nuevoUsuario: Usuario = {
      id_usuario: nextUserId,
      nombre: usuarioData.nombre.trim(),
      correo: usuarioData.correo.trim().toLowerCase(),
      password_hash: '$2b$12$' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
      creado_en: now,
      actualizado_en: now,
      eliminado_en: null,
    };
    this.state.usuarios.push(nuevoUsuario);

    this.logSQL(
      'INSERT',
      'USUARIO',
      `INSERT INTO usuario (nombre, correo, password_hash, creado_en) VALUES ('${nuevoUsuario.nombre.replace(/'/g, "\\'")}', '${nuevoUsuario.correo}', '${nuevoUsuario.password_hash}', NOW());`,
      `Registro de nuevo usuario #${nextUserId}`
    );

    // Crear Empresa asociada
    const nextEmpId = this.state.empresas.reduce((max, e) => Math.max(max, e.id_empresa), 0) + 1;
    const nuevaEmpresa: Empresa = {
      id_empresa: nextEmpId,
      id_usuario: nextUserId,
      nit: empresaData.nit.trim(),
      nombre: empresaData.nombre.trim(),
      creado_en: now,
      actualizado_en: now,
      eliminado_en: null,
    };
    this.state.empresas.push(nuevaEmpresa);

    this.logSQL(
      'INSERT',
      'EMPRESA',
      `INSERT INTO empresa (id_usuario, nit, nombre, creado_en) VALUES (${nextUserId}, '${nuevaEmpresa.nit}', '${nuevaEmpresa.nombre.replace(/'/g, "\\'")}', NOW());`,
      `Registro de empresa inicial #${nextEmpId} para usuario #${nextUserId}`
    );

    // Crear al menos una sede inicial por defecto para la nueva empresa
    const nextSedeId = this.state.sedes.reduce((max, s) => Math.max(max, s.id_sede), 0) + 1;
    const nuevaSede: Sede = {
      id_sede: nextSedeId,
      id_empresa: nextEmpId,
      nombre: 'Sede Principal',
      direccion: 'Sede Administrativa Central',
      ciudad: 'Bogotá D.C.',
      creado_en: now,
      actualizado_en: now,
      eliminado_en: null,
    };
    this.state.sedes.push(nuevaSede);

    this.currentUserId = nextUserId;
    this.state.activeEmpresaId = nextEmpId;
    try {
      localStorage.setItem(AUTH_USER_KEY, String(nextUserId));
    } catch {
      // Ignore
    }

    this.saveState();
    return { usuario: nuevoUsuario, empresa: nuevaEmpresa };
  }

  // --- Getters del Estado ---
  public getActiveEmpresaId(): number {
    return this.state.activeEmpresaId;
  }

  public setActiveEmpresaId(id: number): void {
    this.state.activeEmpresaId = id;
    this.logSQL(
      'SELECT',
      'EMPRESA',
      `SELECT * FROM empresa WHERE id_empresa = ${id} AND eliminado_en IS NULL LIMIT 1;`,
      `Cambio de contexto activo a Empresa ID #${id}`
    );
    this.saveState();
  }

  public getEmpresaActiva(): Empresa | undefined {
    return this.state.empresas.find(
      (e) => e.id_empresa === this.state.activeEmpresaId && !e.eliminado_en
    );
  }

  public getUsuarios(): Usuario[] {
    return this.state.usuarios.filter((u) => !u.eliminado_en);
  }

  public getEmpresas(): Empresa[] {
    return this.state.empresas.filter((e) => !e.eliminado_en);
  }

  public getSedes(id_empresa?: number): Sede[] {
    const empId = id_empresa ?? this.state.activeEmpresaId;
    return this.state.sedes.filter(
      (s) => s.id_empresa === empId && !s.eliminado_en
    );
  }

  public getAllSedes(): Sede[] {
    return this.state.sedes.filter((s) => !s.eliminado_en);
  }

  public getFuentes(): FuenteEmision[] {
    return this.state.fuentes.filter((f) => !f.eliminado_en);
  }

  public getFactores(): FactorEmision[] {
    return this.state.factores.filter((f) => !f.eliminado_en);
  }

  public getProyectos(): Proyecto[] {
    return this.state.proyectos.filter((p) => !p.eliminado_en);
  }

  public getSqlLogs(): LogTransaccionSQL[] {
    return [...this.sqlLogs];
  }

  public clearSqlLogs(): void {
    this.sqlLogs = [];
    localStorage.removeItem(SQL_LOGS_KEY);
    this.notify();
  }

  // --- Consumos Detallados con Relaciones Hidratadas ---
  public getConsumosDetallados(id_empresa?: number): ConsumoDetallado[] {
    const empId = id_empresa ?? this.state.activeEmpresaId;
    const sedesEmpresa = this.getSedes(empId);
    const sedeIds = new Set(sedesEmpresa.map((s) => s.id_sede));

    const consumos = this.state.consumos.filter(
      (c) => sedeIds.has(c.id_sede) && !c.eliminado_en
    );

    return consumos.map((c) => {
      const sede = this.state.sedes.find((s) => s.id_sede === c.id_sede);
      const factor = this.state.factores.find((f) => f.id_factor === c.id_factor);
      const fuente = factor
        ? this.state.fuentes.find((fu) => fu.id_fuente === factor.id_fuente)
        : undefined;

      const valorFactor = factor ? factor.valor : 0;
      const emisionKg = c.cantidad * valorFactor;

      return {
        ...c,
        sede,
        factor,
        fuente,
        emision_calculada_kg_co2e: Math.round(emisionKg * 1000) / 1000,
        emision_calculada_ton_co2e: Math.round((emisionKg / 1000) * 1000) / 1000,
      };
    });
  }

  // --- Compensaciones Detalladas con Relaciones Hidratadas ---
  public getCompensacionesDetalladas(id_empresa?: number): CompensacionDetallada[] {
    const empId = id_empresa ?? this.state.activeEmpresaId;
    const compensaciones = this.state.compensaciones.filter(
      (c) => c.id_empresa === empId && !c.eliminado_en
    );

    return compensaciones.map((c) => {
      const empresa = this.state.empresas.find((e) => e.id_empresa === c.id_empresa);
      const proyecto = this.state.proyectos.find((p) => p.id_proyecto === c.id_proyecto);
      return {
        ...c,
        empresa,
        proyecto,
        cantidad_ton_co2e: Math.round((c.cantidad_kg_co2e / 1000) * 1000) / 1000,
      };
    });
  }

  // --- Métricas de Huella de Carbono (ODS 13) ---
  public getResumenHuella(id_empresa?: number) {
    const consumos = this.getConsumosDetallados(id_empresa);
    const compensaciones = this.getCompensacionesDetalladas(id_empresa);

    const totalEmisionesKg = consumos.reduce(
      (acc, c) => acc + c.emision_calculada_kg_co2e,
      0
    );
    const totalCompensadoKg = compensaciones.reduce(
      (acc, c) => acc + c.cantidad_kg_co2e,
      0
    );

    const balanceNetoKg = totalEmisionesKg - totalCompensadoKg;
    const porcentajeCompensado =
      totalEmisionesKg > 0
        ? Math.min(100, Math.round((totalCompensadoKg / totalEmisionesKg) * 1000) / 10)
        : 100;

    return {
      totalEmisionesKg: Math.round(totalEmisionesKg * 100) / 100,
      totalEmisionesTon: Math.round((totalEmisionesKg / 1000) * 100) / 100,
      totalCompensadoKg: Math.round(totalCompensadoKg * 100) / 100,
      totalCompensadoTon: Math.round((totalCompensadoKg / 1000) * 100) / 100,
      balanceNetoKg: Math.round(balanceNetoKg * 100) / 100,
      balanceNetoTon: Math.round((balanceNetoKg / 1000) * 100) / 100,
      porcentajeCompensado,
      esCarbonoNeutro: balanceNetoKg <= 0,
      numConsumos: consumos.length,
      numSedes: this.getSedes(id_empresa).length,
    };
  }

  // --- CRUD: Consumo ---
  public saveConsumo(data: Omit<Consumo, 'id_consumo' | 'creado_en' | 'actualizado_en' | 'eliminado_en'> & { id_consumo?: number }): Consumo {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (data.id_consumo) {
      // UPDATE
      const index = this.state.consumos.findIndex((c) => c.id_consumo === data.id_consumo);
      if (index === -1) throw new Error('Consumo no encontrado');

      const updated: Consumo = {
        ...this.state.consumos[index],
        id_sede: data.id_sede,
        id_factor: data.id_factor,
        periodo: data.periodo,
        cantidad: Number(data.cantidad),
        actualizado_en: now,
      };
      this.state.consumos[index] = updated;

      this.logSQL(
        'UPDATE',
        'CONSUMO',
        `UPDATE consumo SET id_sede = ${updated.id_sede}, id_factor = ${updated.id_factor}, periodo = '${updated.periodo}', cantidad = ${updated.cantidad.toFixed(3)}, actualizado_en = NOW() WHERE id_consumo = ${updated.id_consumo};`,
        `Actualización de registro de consumo #${updated.id_consumo}`
      );

      this.saveState();
      return updated;
    } else {
      // INSERT
      const nextId =
        this.state.consumos.reduce((max, c) => Math.max(max, c.id_consumo), 0) + 1;
      const nuevo: Consumo = {
        id_consumo: nextId,
        id_sede: data.id_sede,
        id_factor: data.id_factor,
        periodo: data.periodo,
        cantidad: Number(data.cantidad),
        creado_en: now,
        actualizado_en: now,
        eliminado_en: null,
      };
      this.state.consumos.push(nuevo);

      this.logSQL(
        'INSERT',
        'CONSUMO',
        `INSERT INTO consumo (id_sede, id_factor, periodo, cantidad, creado_en, actualizado_en) VALUES (${nuevo.id_sede}, ${nuevo.id_factor}, '${nuevo.periodo}', ${nuevo.cantidad.toFixed(3)}, NOW(), NOW());`,
        `Nuevo consumo registrado (ID generado: ${nextId})`
      );

      this.saveState();
      return nuevo;
    }
  }

  public deleteConsumo(id_consumo: number, soft: boolean = true): void {
    const index = this.state.consumos.findIndex((c) => c.id_consumo === id_consumo);
    if (index === -1) return;

    if (soft) {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      this.state.consumos[index].eliminado_en = now;
      this.logSQL(
        'UPDATE',
        'CONSUMO',
        `UPDATE consumo SET eliminado_en = NOW() WHERE id_consumo = ${id_consumo}; -- Borrado lógico (Soft delete)`,
        `Eliminación lógica de consumo #${id_consumo}`
      );
    } else {
      this.state.consumos.splice(index, 1);
      this.logSQL(
        'DELETE',
        'CONSUMO',
        `DELETE FROM consumo WHERE id_consumo = ${id_consumo};`,
        `Eliminación física de consumo #${id_consumo}`
      );
    }
    this.saveState();
  }

  // --- CRUD: Compensacion ---
  public saveCompensacion(data: Omit<Compensacion, 'id_compensacion' | 'creado_en' | 'actualizado_en' | 'eliminado_en'> & { id_compensacion?: number }): Compensacion {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (data.id_compensacion) {
      // UPDATE
      const index = this.state.compensaciones.findIndex((c) => c.id_compensacion === data.id_compensacion);
      if (index === -1) throw new Error('Compensación no encontrada');

      const updated: Compensacion = {
        ...this.state.compensaciones[index],
        id_empresa: data.id_empresa,
        id_proyecto: data.id_proyecto,
        fecha: data.fecha,
        cantidad_kg_co2e: Number(data.cantidad_kg_co2e),
        comprobante: data.comprobante,
        actualizado_en: now,
      };
      this.state.compensaciones[index] = updated;

      this.logSQL(
        'UPDATE',
        'COMPENSACION',
        `UPDATE compensacion SET id_empresa = ${updated.id_empresa}, id_proyecto = ${updated.id_proyecto}, fecha = '${updated.fecha}', cantidad_kg_co2e = ${updated.cantidad_kg_co2e.toFixed(3)}, comprobante = '${updated.comprobante.replace(/'/g, "\\'")}', actualizado_en = NOW() WHERE id_compensacion = ${updated.id_compensacion};`,
        `Actualización de compensación ambiental #${updated.id_compensacion}`
      );

      this.saveState();
      return updated;
    } else {
      // INSERT
      const nextId =
        this.state.compensaciones.reduce((max, c) => Math.max(max, c.id_compensacion), 0) + 1;
      const nuevo: Compensacion = {
        id_compensacion: nextId,
        id_empresa: data.id_empresa,
        id_proyecto: data.id_proyecto,
        fecha: data.fecha,
        cantidad_kg_co2e: Number(data.cantidad_kg_co2e),
        comprobante: data.comprobante,
        creado_en: now,
        actualizado_en: now,
        eliminado_en: null,
      };
      this.state.compensaciones.push(nuevo);

      this.logSQL(
        'INSERT',
        'COMPENSACION',
        `INSERT INTO compensacion (id_empresa, id_proyecto, fecha, cantidad_kg_co2e, comprobante, creado_en, actualizado_en) VALUES (${nuevo.id_empresa}, ${nuevo.id_proyecto}, '${nuevo.fecha}', ${nuevo.cantidad_kg_co2e.toFixed(3)}, '${nuevo.comprobante.replace(/'/g, "\\'")}', NOW(), NOW());`,
        `Registro de compensación de CO2e (ID generado: ${nextId})`
      );

      this.saveState();
      return nuevo;
    }
  }

  public deleteCompensacion(id_compensacion: number): void {
    const index = this.state.compensaciones.findIndex((c) => c.id_compensacion === id_compensacion);
    if (index === -1) return;

    this.state.compensaciones[index].eliminado_en = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.logSQL(
      'UPDATE',
      'COMPENSACION',
      `UPDATE compensacion SET eliminado_en = NOW() WHERE id_compensacion = ${id_compensacion};`,
      `Eliminación lógica de compensación #${id_compensacion}`
    );
    this.saveState();
  }

  // --- CRUD: Sede ---
  public saveSede(data: Omit<Sede, 'id_sede' | 'creado_en' | 'actualizado_en' | 'eliminado_en'> & { id_sede?: number }): Sede {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (data.id_sede) {
      const index = this.state.sedes.findIndex((s) => s.id_sede === data.id_sede);
      if (index === -1) throw new Error('Sede no encontrada');

      const updated: Sede = {
        ...this.state.sedes[index],
        id_empresa: data.id_empresa,
        nombre: data.nombre,
        direccion: data.direccion,
        ciudad: data.ciudad,
        actualizado_en: now,
      };
      this.state.sedes[index] = updated;

      this.logSQL(
        'UPDATE',
        'SEDE',
        `UPDATE sede SET nombre = '${updated.nombre.replace(/'/g, "\\'")}', direccion = '${updated.direccion.replace(/'/g, "\\'")}', ciudad = '${updated.ciudad.replace(/'/g, "\\'")}', actualizado_en = NOW() WHERE id_sede = ${updated.id_sede};`,
        `Actualización de sede operativa #${updated.id_sede}`
      );

      this.saveState();
      return updated;
    } else {
      const nextId = this.state.sedes.reduce((max, s) => Math.max(max, s.id_sede), 0) + 1;
      const nueva: Sede = {
        id_sede: nextId,
        id_empresa: data.id_empresa,
        nombre: data.nombre,
        direccion: data.direccion,
        ciudad: data.ciudad,
        creado_en: now,
        actualizado_en: now,
        eliminado_en: null,
      };
      this.state.sedes.push(nueva);

      this.logSQL(
        'INSERT',
        'SEDE',
        `INSERT INTO sede (id_empresa, nombre, direccion, ciudad, creado_en, actualizado_en) VALUES (${nueva.id_empresa}, '${nueva.nombre.replace(/'/g, "\\'")}', '${nueva.direccion.replace(/'/g, "\\'")}', '${nueva.ciudad.replace(/'/g, "\\'")}', NOW(), NOW());`,
        `Registro de nueva sede operativa (ID generado: ${nextId})`
      );

      this.saveState();
      return nueva;
    }
  }

  public deleteSede(id_sede: number): void {
    const index = this.state.sedes.findIndex((s) => s.id_sede === id_sede);
    if (index === -1) return;

    this.state.sedes[index].eliminado_en = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.logSQL(
      'UPDATE',
      'SEDE',
      `UPDATE sede SET eliminado_en = NOW() WHERE id_sede = ${id_sede};`,
      `Eliminación lógica de sede #${id_sede}`
    );
    this.saveState();
  }

  // --- CRUD: Factor & Fuente ---
  public saveFactor(data: Omit<FactorEmision, 'id_factor' | 'creado_en' | 'actualizado_en' | 'eliminado_en'> & { id_factor?: number }): FactorEmision {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (data.id_factor) {
      const index = this.state.factores.findIndex((f) => f.id_factor === data.id_factor);
      if (index === -1) throw new Error('Factor no encontrado');

      const updated: FactorEmision = {
        ...this.state.factores[index],
        id_fuente: data.id_fuente,
        valor: Number(data.valor),
        unidad_consumo: data.unidad_consumo,
        anio: Number(data.anio),
        referencia: data.referencia,
        actualizado_en: now,
      };
      this.state.factores[index] = updated;

      this.logSQL(
        'UPDATE',
        'FACTOR_EMISION',
        `UPDATE factor_emision SET id_fuente = ${updated.id_fuente}, valor = ${updated.valor.toFixed(8)}, unidad_consumo = '${updated.unidad_consumo}', anio = ${updated.anio}, referencia = '${updated.referencia.replace(/'/g, "\\'")}', actualizado_en = NOW() WHERE id_factor = ${updated.id_factor};`,
        `Actualización de factor de emisión #${updated.id_factor}`
      );

      this.saveState();
      return updated;
    } else {
      const nextId = this.state.factores.reduce((max, f) => Math.max(max, f.id_factor), 0) + 1;
      const nuevo: FactorEmision = {
        id_factor: nextId,
        id_fuente: data.id_fuente,
        valor: Number(data.valor),
        unidad_consumo: data.unidad_consumo,
        anio: Number(data.anio),
        referencia: data.referencia,
        creado_en: now,
        actualizado_en: now,
        eliminado_en: null,
      };
      this.state.factores.push(nuevo);

      this.logSQL(
        'INSERT',
        'FACTOR_EMISION',
        `INSERT INTO factor_emision (id_fuente, valor, unidad_consumo, anio, referencia, creado_en, actualizado_en) VALUES (${nuevo.id_fuente}, ${nuevo.valor.toFixed(8)}, '${nuevo.unidad_consumo}', ${nuevo.anio}, '${nuevo.referencia.replace(/'/g, "\\'")}', NOW(), NOW());`,
        `Registro de nuevo factor de emisión (ID generado: ${nextId})`
      );

      this.saveState();
      return nuevo;
    }
  }

  // --- CRUD: Proyectos ---
  public saveProyecto(data: Omit<Proyecto, 'id_proyecto' | 'creado_en' | 'actualizado_en' | 'eliminado_en'> & { id_proyecto?: number }): Proyecto {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    if (data.id_proyecto) {
      const index = this.state.proyectos.findIndex((p) => p.id_proyecto === data.id_proyecto);
      if (index === -1) throw new Error('Proyecto no encontrado');

      const updated: Proyecto = {
        ...this.state.proyectos[index],
        nombre: data.nombre,
        descripcion: data.descripcion,
        actualizado_en: now,
      };
      this.state.proyectos[index] = updated;

      this.logSQL(
        'UPDATE',
        'PROYECTO',
        `UPDATE proyecto SET nombre = '${updated.nombre.replace(/'/g, "\\'")}', descripcion = '${updated.descripcion.replace(/'/g, "\\'")}', actualizado_en = NOW() WHERE id_proyecto = ${updated.id_proyecto};`,
        `Actualización de proyecto ambiental #${updated.id_proyecto}`
      );

      this.saveState();
      return updated;
    } else {
      const nextId = this.state.proyectos.reduce((max, p) => Math.max(max, p.id_proyecto), 0) + 1;
      const nuevo: Proyecto = {
        id_proyecto: nextId,
        nombre: data.nombre,
        descripcion: data.descripcion,
        creado_en: now,
        actualizado_en: now,
        eliminado_en: null,
      };
      this.state.proyectos.push(nuevo);

      this.logSQL(
        'INSERT',
        'PROYECTO',
        `INSERT INTO proyecto (nombre, descripcion, creado_en, actualizado_en) VALUES ('${nuevo.nombre.replace(/'/g, "\\'")}', '${nuevo.descripcion.replace(/'/g, "\\'")}', NOW(), NOW());`,
        `Registro de nuevo proyecto ecológico (ID generado: ${nextId})`
      );

      this.saveState();
      return nuevo;
    }
  }

  // --- Reset a valores iniciales ---
  public resetToSeeds(): void {
    this.state = {
      usuarios: [...INITIAL_USUARIOS],
      empresas: [...INITIAL_EMPRESAS],
      sedes: [...INITIAL_SEDES],
      fuentes: [...INITIAL_FUENTES],
      factores: [...INITIAL_FACTORES],
      consumos: [...INITIAL_CONSUMOS],
      proyectos: [...INITIAL_PROYECTOS],
      compensaciones: [...INITIAL_COMPENSACIONES],
      activeEmpresaId: 1,
    };
    this.saveState();
    this.logSQL(
      'INSERT',
      'SISTEMA',
      '-- BASE DE DATOS RESTAURADA A SEMILLAS DE PRUEBA OFICIALES',
      'Restauración general de datos en phpMyAdmin'
    );
  }

  // --- Generador de Script SQL para phpMyAdmin ---
  public generatePhpMyAdminSqlDump(): string {
    const lines: string[] = [
      '--',
      '-- phpMyAdmin SQL Dump',
      '-- Sistema: EcoTrack ODS 13 - Gestión de Huella de Carbono',
      '-- Servidor: 127.0.0.1 (MySQL / MariaDB)',
      `-- Generado el: ${new Date().toISOString().replace('T', ' ').substring(0, 19)}`,
      '-- Versión del servidor: 10.4.32-MariaDB / MySQL 8.0',
      '--',
      '',
      'SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";',
      'START TRANSACTION;',
      'SET time_zone = "+00:00";',
      '',
      '/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;',
      '/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;',
      '/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;',
      '/*!40101 SET NAMES utf8mb4 */;',
      '',
      '--',
      '-- Base de datos: `gestion_carbono_ods13`',
      '--',
      'CREATE DATABASE IF NOT EXISTS `gestion_carbono_ods13` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;',
      'USE `gestion_carbono_ods13`;',
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `usuario`',
      '--',
      'DROP TABLE IF EXISTS `consumo`;',
      'DROP TABLE IF EXISTS `compensacion`;',
      'DROP TABLE IF EXISTS `sede`;',
      'DROP TABLE IF EXISTS `factor_emision`;',
      'DROP TABLE IF EXISTS `fuente_emision`;',
      'DROP TABLE IF EXISTS `proyecto`;',
      'DROP TABLE IF EXISTS `empresa`;',
      'DROP TABLE IF EXISTS `usuario`;',
      '',
      'CREATE TABLE `usuario` (',
      '  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,',
      '  `nombre` varchar(100) NOT NULL,',
      '  `correo` varchar(150) NOT NULL,',
      '  `password_hash` varchar(255) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_usuario`),',
      '  UNIQUE KEY `uk_usuario_correo` (`correo`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      '',
      '--',
      '-- Volcado de datos para la tabla `usuario`',
      '--',
    ];

    if (this.state.usuarios.length > 0) {
      lines.push('INSERT INTO `usuario` (`id_usuario`, `nombre`, `correo`, `password_hash`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const userValues = this.state.usuarios.map(
        (u, i) =>
          `(${u.id_usuario}, '${u.nombre.replace(/'/g, "\\'")}', '${u.correo.replace(/'/g, "\\'")}', '${u.password_hash}', '${u.creado_en}', '${u.actualizado_en}', ${u.eliminado_en ? `'${u.eliminado_en}'` : 'NULL'})${i === this.state.usuarios.length - 1 ? ';' : ','}`
      );
      lines.push(...userValues);
    }

    lines.push(
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `empresa`',
      '--',
      'CREATE TABLE `empresa` (',
      '  `id_empresa` int(11) NOT NULL AUTO_INCREMENT,',
      '  `id_usuario` int(11) NOT NULL,',
      '  `nit` varchar(20) NOT NULL,',
      '  `nombre` varchar(150) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_empresa`),',
      '  UNIQUE KEY `uk_empresa_nit` (`nit`),',
      '  KEY `idx_empresa_usuario` (`id_usuario`),',
      '  CONSTRAINT `fk_empresa_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      ''
    );

    if (this.state.empresas.length > 0) {
      lines.push('INSERT INTO `empresa` (`id_empresa`, `id_usuario`, `nit`, `nombre`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const empValues = this.state.empresas.map(
        (e, i) =>
          `(${e.id_empresa}, ${e.id_usuario}, '${e.nit}', '${e.nombre.replace(/'/g, "\\'")}', '${e.creado_en}', '${e.actualizado_en}', ${e.eliminado_en ? `'${e.eliminado_en}'` : 'NULL'})${i === this.state.empresas.length - 1 ? ';' : ','}`
      );
      lines.push(...empValues);
    }

    lines.push(
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `sede`',
      '--',
      'CREATE TABLE `sede` (',
      '  `id_sede` int(11) NOT NULL AUTO_INCREMENT,',
      '  `id_empresa` int(11) NOT NULL,',
      '  `nombre` varchar(100) NOT NULL,',
      '  `direccion` varchar(200) NOT NULL,',
      '  `ciudad` varchar(100) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_sede`),',
      '  KEY `idx_sede_empresa` (`id_empresa`),',
      '  CONSTRAINT `fk_sede_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      ''
    );

    if (this.state.sedes.length > 0) {
      lines.push('INSERT INTO `sede` (`id_sede`, `id_empresa`, `nombre`, `direccion`, `ciudad`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const sedeValues = this.state.sedes.map(
        (s, i) =>
          `(${s.id_sede}, ${s.id_empresa}, '${s.nombre.replace(/'/g, "\\'")}', '${s.direccion.replace(/'/g, "\\'")}', '${s.ciudad.replace(/'/g, "\\'")}', '${s.creado_en}', '${s.actualizado_en}', ${s.eliminado_en ? `'${s.eliminado_en}'` : 'NULL'})${i === this.state.sedes.length - 1 ? ';' : ','}`
      );
      lines.push(...sedeValues);
    }

    lines.push(
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `fuente_emision`',
      '--',
      'CREATE TABLE `fuente_emision` (',
      '  `id_fuente` int(11) NOT NULL AUTO_INCREMENT,',
      '  `nombre` varchar(80) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_fuente`),',
      '  UNIQUE KEY `uk_fuente_nombre` (`nombre`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      ''
    );

    if (this.state.fuentes.length > 0) {
      lines.push('INSERT INTO `fuente_emision` (`id_fuente`, `nombre`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const fuenteValues = this.state.fuentes.map(
        (f, i) =>
          `(${f.id_fuente}, '${f.nombre.replace(/'/g, "\\'")}', '${f.creado_en}', '${f.actualizado_en}', ${f.eliminado_en ? `'${f.eliminado_en}'` : 'NULL'})${i === this.state.fuentes.length - 1 ? ';' : ','}`
      );
      lines.push(...fuenteValues);
    }

    lines.push(
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `factor_emision`',
      '--',
      'CREATE TABLE `factor_emision` (',
      '  `id_factor` int(11) NOT NULL AUTO_INCREMENT,',
      '  `id_fuente` int(11) NOT NULL,',
      '  `valor` decimal(14,8) NOT NULL COMMENT "kg CO2e por unidad",',
      '  `unidad_consumo` varchar(20) NOT NULL,',
      '  `anio` smallint(6) NOT NULL,',
      '  `referencia` varchar(255) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_factor`),',
      '  KEY `idx_factor_fuente` (`id_fuente`),',
      '  CONSTRAINT `fk_factor_fuente` FOREIGN KEY (`id_fuente`) REFERENCES `fuente_emision` (`id_fuente`) ON DELETE RESTRICT ON UPDATE CASCADE',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      ''
    );

    if (this.state.factores.length > 0) {
      lines.push('INSERT INTO `factor_emision` (`id_factor`, `id_fuente`, `valor`, `unidad_consumo`, `anio`, `referencia`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const factorValues = this.state.factores.map(
        (f, i) =>
          `(${f.id_factor}, ${f.id_fuente}, ${f.valor.toFixed(8)}, '${f.unidad_consumo}', ${f.anio}, '${f.referencia.replace(/'/g, "\\'")}', '${f.creado_en}', '${f.actualizado_en}', ${f.eliminado_en ? `'${f.eliminado_en}'` : 'NULL'})${i === this.state.factores.length - 1 ? ';' : ','}`
      );
      lines.push(...factorValues);
    }

    lines.push(
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `consumo`',
      '--',
      'CREATE TABLE `consumo` (',
      '  `id_consumo` int(11) NOT NULL AUTO_INCREMENT,',
      '  `id_sede` int(11) NOT NULL,',
      '  `id_factor` int(11) NOT NULL,',
      '  `periodo` date NOT NULL COMMENT "YYYY-MM-01",',
      '  `cantidad` decimal(14,3) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_consumo`),',
      '  KEY `idx_consumo_sede` (`id_sede`),',
      '  KEY `idx_consumo_factor` (`id_factor`),',
      '  CONSTRAINT `fk_consumo_sede` FOREIGN KEY (`id_sede`) REFERENCES `sede` (`id_sede`) ON DELETE CASCADE ON UPDATE CASCADE,',
      '  CONSTRAINT `fk_consumo_factor` FOREIGN KEY (`id_factor`) REFERENCES `factor_emision` (`id_factor`) ON DELETE RESTRICT ON UPDATE CASCADE',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      ''
    );

    if (this.state.consumos.length > 0) {
      lines.push('INSERT INTO `consumo` (`id_consumo`, `id_sede`, `id_factor`, `periodo`, `cantidad`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const consumoValues = this.state.consumos.map(
        (c, i) =>
          `(${c.id_consumo}, ${c.id_sede}, ${c.id_factor}, '${c.periodo}', ${c.cantidad.toFixed(3)}, '${c.creado_en}', '${c.actualizado_en}', ${c.eliminado_en ? `'${c.eliminado_en}'` : 'NULL'})${i === this.state.consumos.length - 1 ? ';' : ','}`
      );
      lines.push(...consumoValues);
    }

    lines.push(
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `proyecto`',
      '--',
      'CREATE TABLE `proyecto` (',
      '  `id_proyecto` int(11) NOT NULL AUTO_INCREMENT,',
      '  `nombre` varchar(150) NOT NULL,',
      '  `descripcion` varchar(500) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_proyecto`)',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      ''
    );

    if (this.state.proyectos.length > 0) {
      lines.push('INSERT INTO `proyecto` (`id_proyecto`, `nombre`, `descripcion`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const proyValues = this.state.proyectos.map(
        (p, i) =>
          `(${p.id_proyecto}, '${p.nombre.replace(/'/g, "\\'")}', '${p.descripcion.replace(/'/g, "\\'")}', '${p.creado_en}', '${p.actualizado_en}', ${p.eliminado_en ? `'${p.eliminado_en}'` : 'NULL'})${i === this.state.proyectos.length - 1 ? ';' : ','}`
      );
      lines.push(...proyValues);
    }

    lines.push(
      '',
      '-- --------------------------------------------------------',
      '--',
      '-- Estructura de tabla para la tabla `compensacion`',
      '--',
      'CREATE TABLE `compensacion` (',
      '  `id_compensacion` int(11) NOT NULL AUTO_INCREMENT,',
      '  `id_empresa` int(11) NOT NULL,',
      '  `id_proyecto` int(11) NOT NULL,',
      '  `fecha` date NOT NULL,',
      '  `cantidad_kg_co2e` decimal(14,3) NOT NULL,',
      '  `comprobante` varchar(255) NOT NULL,',
      '  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),',
      '  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),',
      '  `eliminado_en` timestamp NULL DEFAULT NULL,',
      '  PRIMARY KEY (`id_compensacion`),',
      '  KEY `idx_compensacion_empresa` (`id_empresa`),',
      '  KEY `idx_compensacion_proyecto` (`id_proyecto`),',
      '  CONSTRAINT `fk_compensacion_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE,',
      '  CONSTRAINT `fk_compensacion_proyecto` FOREIGN KEY (`id_proyecto`) REFERENCES `proyecto` (`id_proyecto`) ON DELETE RESTRICT ON UPDATE CASCADE',
      ') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;',
      ''
    );

    if (this.state.compensaciones.length > 0) {
      lines.push('INSERT INTO `compensacion` (`id_compensacion`, `id_empresa`, `id_proyecto`, `fecha`, `cantidad_kg_co2e`, `comprobante`, `creado_en`, `actualizado_en`, `eliminado_en`) VALUES');
      const compValues = this.state.compensaciones.map(
        (cp, i) =>
          `(${cp.id_compensacion}, ${cp.id_empresa}, ${cp.id_proyecto}, '${cp.fecha}', ${cp.cantidad_kg_co2e.toFixed(3)}, '${cp.comprobante.replace(/'/g, "\\'")}', '${cp.creado_en}', '${cp.actualizado_en}', ${cp.eliminado_en ? `'${cp.eliminado_en}'` : 'NULL'})${i === this.state.compensaciones.length - 1 ? ';' : ','}`
      );
      lines.push(...compValues);
    }

    lines.push(
      '',
      'COMMIT;',
      '',
      '/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;',
      '/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;',
      '/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;',
      '-- Fin del script SQL para phpMyAdmin'
    );

    return lines.join('\n');
  }
}

export const dbStore = new DatabaseStore();
