/***********************************************************************
 *
 *  EDIFICIO LUCINA
 *  Sistema de Administración de Propiedad Horizontal
 *
 *  Desarrollado por:
 *  CStM Lab
 *
 *  Versión:
 *  2.0.0
 *
 **********************************************************************/

/*=========================================================
=                    CONFIGURACIÓN                        =
=========================================================*/

const APP = {

    NAME: "Edificio Lucina",

    VERSION: "2.0.0",

    COMPANY: "CStM Lab",

    YEAR: "2026"

};

const FIRESTORE = {

    COLLECTION: "edificio",

    DOCUMENT: "lucina"

};

const SECURITY = {

    PASSWORD_PEPPER: "edificio-lucina-2026"

};

/*=========================================================
=                    ESTADO GLOBAL                        =
=========================================================*/

const STATE = {

    //-------------------------------------
    // Usuario conectado
    //-------------------------------------

    session: {

        logged: false,

        role: null,

        apartmentId: null

    },

    //-------------------------------------
    // Navegación
    //-------------------------------------

    navigation: {

        page: "dashboard"

    },

    //-------------------------------------
    // Datos cargados desde Firebase
    //-------------------------------------

    database: null,

    //-------------------------------------
    // Dashboard
    //-------------------------------------

    dashboard: {

        monthlyDebt: 0,

        totalDebt: 0,

        savingsBalance: 0,

        seedBalance: 0,

        apartmentsInDebt: [],

        latestMovements: []

    },

    //-------------------------------------
    // Formularios
    //-------------------------------------

    forms: {

        movement: {},

        apartment: {},

        report: {}

    },

    //-------------------------------------
    // Filtros
    //-------------------------------------

    filters: {

        apartment: "todos",

        month: "todos",

        movement: "todos"

    }

};

/*=========================================================
=                    VARIABLES                            =
=========================================================*/

let chartInstance = null;

let firestoreListener = null;

/*=========================================================
=                    SELECTORES                           =
=========================================================*/

const $ = (id) => document.getElementById(id);

const $$ = (selector) => document.querySelector(selector);

const $$$ = (selector) => document.querySelectorAll(selector);

/*=========================================================
=                    UTILIDADES                           =
=========================================================*/

function money(value){

    return new Intl.NumberFormat(

        "es-CO",

        {

            style: "currency",

            currency: "COP",

            maximumFractionDigits: 0

        }

    ).format(Number(value || 0));

}

function number(value){

    return new Intl.NumberFormat(

        "es-CO"

    ).format(Number(value || 0));

}

function today(){

    return new Date()

        .toISOString()

        .split("T")[0];

}

function now(){

    return Date.now();

}

function uuid(){

    return crypto.randomUUID();

}

function deepClone(object){

    return JSON.parse(

        JSON.stringify(object)

    );

}

function capitalize(text){

    if(!text) return "";

    return text

        .charAt(0)

        .toUpperCase()

        + text.slice(1);

}

function monthName(month){

    const months=[

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

    return months[month] || "";

}

function formatDate(date){

    return new Date(date)

        .toLocaleDateString(

            "es-CO"

        );

}

/*=========================================================
=                SEGURIDAD                                =
=========================================================*/

async function hashPassword(password){

    const encoder = new TextEncoder();

    const data = encoder.encode(

        SECURITY.PASSWORD_PEPPER +

        ":" +

        password

    );

    const hash = await crypto.subtle.digest(

        "SHA-256",

        data

    );

    return Array

        .from(

            new Uint8Array(hash)

        )

        .map(byte =>

            byte

            .toString(16)

            .padStart(2,"0")

        )

        .join("");

}
/*=========================================================
=              COMPONENTES REUTILIZABLES                  =
=========================================================*/

/**
 * Renderiza el contenido principal de la aplicación
 */
function renderApp(html) {

    $("app").innerHTML = html;

}

/**
 * Tarjeta de estadísticas
 */
function createMetricCard({

    title,

    value,

    subtitle = "",

    icon = "fa-solid fa-chart-column",

    color = "green"

}) {

    return `

        <div class="metric-card">

            <div class="metric-top">

                <div>

                    <div class="metric-label">

                        ${title}

                    </div>

                    <div class="metric-value ${color}">

                        ${value}

                    </div>

                    ${subtitle
                        ? `<div class="metric-sub">${subtitle}</div>`
                        : ""
                    }

                </div>

                <div class="metric-icon">

                    <i class="${icon}"></i>

                </div>

            </div>

        </div>

    `;

}

/**
 * Botón
 */
function createButton({

    text,

    action,

    icon = "",

    type = "primary",

    id = "",

    disabled = false

}) {

    return `

        <button

            ${id ? `id="${id}"` : ""}

            class="btn btn-${type}"

            data-action="${action}"

            ${disabled ? "disabled" : ""}

        >

            ${icon
                ? `<i class="${icon}"></i>`
                : ""
            }

            <span>

                ${text}

            </span>

        </button>

    `;

}

/**
 * Campo Input
 */
function createInput({

    id,

    placeholder = "",

    type = "text",

    value = "",

    required = false,

    readonly = false

}) {

    return `

        <input

            id="${id}"

            type="${type}"

            value="${value}"

            placeholder="${placeholder}"

            ${required ? "required" : ""}

            ${readonly ? "readonly" : ""}

        >

    `;

}

/**
 * Select
 */
function createSelect({

    id,

    options = [],

    selected = ""

}) {

    return `

        <select id="${id}">

            ${options.map(option => `

                <option

                    value="${option.value}"

                    ${option.value === selected ? "selected" : ""}

                >

                    ${option.label}

                </option>

            `).join("")}

        </select>

    `;

}

/**
 * Badge
 */
function createBadge(text, type = "success") {

    return `

        <span class="badge badge-${type}">

            ${text}

        </span>

    `;

}

/**
 * Tarjeta genérica
 */
function createCard({

    title = "",

    body = "",

    footer = ""

}) {

    return `

        <div class="card">

            ${title
                ? `

                <div class="card-header">

                    <h3>

                        ${title}

                    </h3>

                </div>

                `
                : ""
            }

            <div class="card-body">

                ${body}

            </div>

            ${footer
                ? `

                <div class="card-footer">

                    ${footer}

                </div>

                `
                : ""
            }

        </div>

    `;

}

/**
 * Cabecera de sección
 */
function createSectionHeader(

    title,

    subtitle = ""

) {

    return `

        <div class="section-header">

            <div>

                <h2>

                    ${title}

                </h2>

                ${subtitle

                    ? `<p>${subtitle}</p>`

                    : ""

                }

            </div>

        </div>

    `;

}

/**
 * Espaciador
 */
function spacer(height = 20) {

    return `

        <div style="height:${height}px;"></div>

    `;

}

/**
 * Loader
 */
function createLoader(text = "Cargando información...") {

    return `

        <div class="loading">

            <i class="fa-solid fa-spinner fa-spin"></i>

            <p>

                ${text}

            </p>

        </div>

    `;

}

/**
 * Mensaje vacío
 */
function emptyState(

    title,

    message

) {

    return `

        <div class="empty-state">

            <h3>

                ${title}

            </h3>

            <p>

                ${message}

            </p>

        </div>

    `;

}
