/*=========================================================
=
=        EDIFICIO LUCINA
=        CONFIGURACIÓN GENERAL
=
=        Desarrollado por CStM Lab
=
=========================================================*/

"use strict";

/*=========================================================
=                     INFORMACIÓN GENERAL
=========================================================*/

const APP_CONFIG = {

    appName: "Edificio Lucina",

    company: "CStM Lab",

    version: "1.0.0",

    environment: "production",

    currency: "COP",

    locale: "es-CO",

    menu: [

        {
            id: "dashboard",
            label: "Dashboard",
            icon: "fa-chart-pie"
        },

        {
            id: "apartments",
            label: "Apartamentos",
            icon: "fa-building"
        },

        {
            id: "movements",
            label: "Movimientos",
            icon: "fa-money-bill-transfer"
        },

        {
            id: "history",
            label: "Historial",
            icon: "fa-clock-rotate-left"
        },

        {
            id: "reports",
            label: "Reportes",
            icon: "fa-file-pdf"
        },

        {
            id: "settings",
            label: "Configuración",
            icon: "fa-gear"
        }

    ]

};


/*=========================================================
=                  DATOS DEL EDIFICIO
=========================================================*/

const BUILDING = {

    name: "Edificio Lucina",

    city: "Cali",

    country: "Colombia",

    apartments: 12,

    commercialUnits: 2,

    totalUnits: 14

};


/*=========================================================
=                 CUENTAS DEL EDIFICIO
=========================================================*/

const ACCOUNTS = [

    "Cuenta de ahorros",

    "Plan Semilla"

];


/*=========================================================
=             TIPOS DE MOVIMIENTO
=========================================================*/

const MOVEMENT_TYPES = [

    "Entrada",

    "Salida"

];


/*=========================================================
=          TIPOS DE INGRESOS
=========================================================*/

const INCOME_TYPES = [

    "Cuota de administración",

    "Cuota extraordinaria",

    "Pago de deuda"

];


/*=========================================================
=             CATEGORÍAS DE GASTOS
=========================================================*/

const EXPENSE_TYPES = [

    "Nómina",

    "Aseo",

    "Servicios públicos",

    "Arreglos",

    "Otros"

];


/*=========================================================
=              ESTADOS DE PAGO
=========================================================*/

const PAYMENT_STATUS = [

    "Pago OK",

    "Pendiente"

];


/*=========================================================
=                MESES DEL AÑO
=========================================================*/

const MONTHS = [

    "Enero",

    "Febrero",

    "Marzo",

    "Abril",

    "Mayo",

    "Junio",

    "Julio",

    "Agosto",

    "Septiembre",

    "Octubre",

    "Noviembre",

    "Diciembre"

];


/*=========================================================
=                     ROLES
=========================================================*/

const ROLES = {

    ADMIN: "admin",

    OWNER: "owner"

};

/*=========================================================
=                  COLECCIONES FIRESTORE
=========================================================*/

const COLLECTIONS = {

    apartments: "apartments",

    movements: "movements",

    reports: "reports",

    settings: "settings",

    users: "users"

};


/*=========================================================
=              DOCUMENTOS FIRESTORE
=========================================================*/

const DOCUMENTS = {

    configuration: "configuration",

    dashboard: "dashboard"

};