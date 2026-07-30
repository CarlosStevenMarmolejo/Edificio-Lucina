// app-data.js
// Constantes y datos iniciales (semilla) del Edificio Lucina.
// Estos datos se cargan en Firestore SOLO la primera vez que la app arranca
// y no encuentra un documento existente. Después de eso, todo se lee y se
// escribe desde Firestore, así que puedes editar libremente desde la app.

const MONTHS = [
  ["ene", "Enero"], ["feb", "Febrero"], ["mar", "Marzo"], ["abr", "Abril"],
  ["may", "Mayo"], ["jun", "Junio"], ["jul", "Julio"], ["ago", "Agosto"],
  ["sep", "Septiembre"], ["oct", "Octubre"], ["nov", "Noviembre"], ["dic", "Diciembre"],
];

const CATEGORIAS = ["NOMINA", "ASEO", "SERVICIOS PUBLICOS", "ARREGLOS", "OTROS"];

const CAT_COLOR = {
  NOMINA: "#7F77DD",
  ASEO: "#1D9E75",
  "SERVICIOS PUBLICOS": "#378ADD",
  ARREGLOS: "#D85A30",
  OTROS: "#888780",
};

function seedUnits() {
  const rows = [
    ["local1", "Local 1 (huevos)", "Angela Canecio", 318000, 0, [318000,318000,318000,318000,318000,318000,0,0,0,0,0,0], 1440000, 0],
    ["local2", "Local 2 (ferreteria)", "Celmira Rivera", 212000, 636000, [212000,212000,212000,212000,0,0,0,0,0,0,0,0], 1440000, 0],
    ["ap201", "Apartamento 201", "Carlos Marmolejo", 357320.7, 0, [357320.7,357320.7,357320.7,357320.7,357320.7,357320.7,357320.7,0,0,0,0,0], 720000, 720000],
    ["ap202", "Apartamento 202", "Rosa Duque", 352028.12, 0, [332000,352028.12,352028.12,352028.12,352028.12,352028.12,352028.12,0,0,0,0,0], 1440000, 0],
    ["ap203", "Apartamento 203", "Lucila Gutierrez", 426138.02, 0, [426138.02,426138.02,426138.02,426138.02,426138.02,426138.02,0,0,0,0,0,0], 1440000, 0],
    ["ap301", "Apartamento 301", "Jennifer Alexandra", 355997.82, 0, [355997.82,355997.82,355997.82,355997.82,355997.82,355997.82,355997.82,0,0,0,0,0], 1220000, 220000],
    ["ap302", "Apartamento 302", "Ana Milena Alzate", 349380.24, 0, [349380.24,349380.24,349380.24,349380.24,349380.24,349380.24,349380.24,0,0,0,0,0], 480000, 480000],
    ["ap303", "Apartamento 303", "Adela Rendon", 440696.06, 0, [440696.06,440696.06,440696.06,440696.06,440696.06,440696.06,0,0,0,0,0,0], 940000, 500000],
    ["ap401", "Apartamento 401", "Cesar Cantero", 355997.82, 3797055.1, [0,0,4500000,0,0,0,0,0,0,0,0,0], 1440000, 0],
    ["ap402", "Apartamento 402", "Facundo Enriquez", 350704.18, 0, [330900,330900,350704.18,350704.18,350704.18,350704.18,350704.18,0,0,0,0,0], 1080000, 360000],
    ["ap403", "Apartamento 403", "Gustavo Isacaz", 460546.68, 1842186.72, [460546.68,460546.68,460546.68,0,0,0,0,0,0,0,0,0], 1440000, 0],
    ["ap501", "Apartamento 501", "Fernando Castillo", 375848.44, 751696.88, [375848.44,375848.44,375848.44,375848.44,375848.44,0,0,0,0,0,0,0], 720000, 600000],
    ["ap502", "Apartamento 502", "Jaime Lopez", 350704.18, 0, [350704.18,350704.18,350704.18,350704.18,350704.18,350704.18,350704.18,0,0,0,0,0], 720000, 600000],
    ["ap503", "Apartamento 503", "Maria Elena Paredes", 460546.68, 0, [460546.68,460546.68,460546.68,460546.68,460546.68,460546.68,0,0,0,0,0,0], 960000, 480000],
  ];
  return rows.map(([id, nombre, propietario, valorMensual, deudaPrevia, pagosArr, cuotaExtraDebe, cuotaExtraAbonado]) => {
    const pagos = {};
    MONTHS.forEach(([key], i) => (pagos[key] = pagosArr[i]));
    return { id, nombre, propietario, valorMensual, deudaPrevia, pagos, cuotaExtraDebe, cuotaExtraAbonado };
  });
}

function seedGastos() {
  const raw = [
    ["ene", "Servicios publicos (Acueducto)", "SERVICIOS PUBLICOS", 376450, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["ene", "Servicios publicos (Energia)", "SERVICIOS PUBLICOS", 196500, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["ene", "Empresa de aseo", "ASEO", 1820000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["ene", "Pago administrador", "NOMINA", 1000000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["ene", "Seguro edificio", "SERVICIOS PUBLICOS", 900000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["ene", "Guaya parqueadero publico", "ARREGLOS", 45000, "EFECTIVO", "Cuenta de ahorros", "OK"],
    ["ene", "Mantenimiento Ascensor", "ARREGLOS", 291000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["feb", "Seguro edificio", "SERVICIOS PUBLICOS", 900000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["feb", "Estampillas", "OTROS", 35000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["feb", "Servicios publicos (Acueducto)", "SERVICIOS PUBLICOS", 380000, "TRANSFERENCIA", "Plan Semilla", "OK"],
    ["feb", "Servicios publicos (Energia)", "SERVICIOS PUBLICOS", 185000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["feb", "Empresa de aseo", "ASEO", 1820000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["feb", "Pago administrador", "NOMINA", 1000000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["feb", "Mantenimiento Ascensor", "ARREGLOS", 291000, "TRANSFERENCIA", "Plan Semilla", "OK"],
    ["mar", "Compra reflectores y sensores", "ARREGLOS", 170000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Mano de obra luces + cableado", "ARREGLOS", 300000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Codificacion puerta", "ARREGLOS", 400000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Fumigacion", "ASEO", 300000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Seguro edificio", "SERVICIOS PUBLICOS", 900000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Servicios publicos (Acueducto)", "SERVICIOS PUBLICOS", 485000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Servicios publicos (Energia)", "SERVICIOS PUBLICOS", 583880, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Empresa de aseo", "ASEO", 1820000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Pago administrador", "NOMINA", 1000000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Mantenimiento Ascensor", "ARREGLOS", 290000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["mar", "Arreglo Ascensor (Tesla, anticipo 50%)", "ARREGLOS", 2100000, "TRANSFERENCIA", "Plan Semilla", "OK"],
    ["abr", "Seguro edificio", "SERVICIOS PUBLICOS", 900000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["abr", "Servicios publicos (Acueducto)", "SERVICIOS PUBLICOS", 482332, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["abr", "Servicios publicos (Energia)", "SERVICIOS PUBLICOS", 586465, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["abr", "Empresa de aseo", "ASEO", 1820000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["abr", "Pago administrador", "NOMINA", 1000000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["abr", "Mantenimiento Ascensor", "ARREGLOS", 290000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["abr", "Compra de tierra para jardin", "ARREGLOS", 35000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["may", "Seguro edificio", "SERVICIOS PUBLICOS", 900000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["may", "Servicios publicos (Acueducto)", "SERVICIOS PUBLICOS", 492420, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["may", "Servicios publicos (Energia)", "SERVICIOS PUBLICOS", 583880, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["may", "Empresa de aseo", "ASEO", 1820000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["may", "Pago administrador", "NOMINA", 1000000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["may", "Mantenimiento Ascensor", "ARREGLOS", 290000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["may", "Compra de tierra para jardin y abono", "ARREGLOS", 55000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["jun", "Seguro edificio", "SERVICIOS PUBLICOS", 900000, "TRANSFERENCIA", "Cuenta de ahorros", "PENDIENTE"],
    ["jun", "Servicios publicos (Acueducto)", "SERVICIOS PUBLICOS", 485000, "TRANSFERENCIA", "Cuenta de ahorros", "PENDIENTE"],
    ["jun", "Servicios publicos (Energia)", "SERVICIOS PUBLICOS", 583880, "TRANSFERENCIA", "Cuenta de ahorros", "PENDIENTE"],
    ["jun", "Empresa de aseo", "ASEO", 1820000, "TRANSFERENCIA", "Cuenta de ahorros", "PENDIENTE"],
    ["jun", "Pago administrador", "NOMINA", 1000000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
    ["jun", "Mantenimiento Ascensor", "ARREGLOS", 290000, "TRANSFERENCIA", "Cuenta de ahorros", "OK"],
  ];
  return raw.map((r, i) => ({
    id: "g" + i, mes: r[0], concepto: r[1], categoria: r[2], valor: r[3],
    metodoPago: r[4], cuenta: r[5], estado: r[6],
  }));
}

function seedAuth() {
  return { adminHash: null, units: {} };
}

function seedData() {
  return { units: seedUnits(), gastos: seedGastos(), auth: seedAuth() };
}