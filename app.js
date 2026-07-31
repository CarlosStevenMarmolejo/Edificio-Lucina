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

    database: {

    building: null,

    apartments: [],

    movements: [],

    expenses: [],

    reports: [],

    users: [],

    settings: {}

},

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
/*=========================================================
=              FIREBASE Y NÚCLEO DE LA APP                =
=========================================================*/

/**
 * Referencias a Firestore
 */

const BuildingRef = db.collection("building");

const ApartmentsRef = db.collection("apartments");

const MovementsRef = db.collection("movements");

const ExpensesRef = db.collection("expenses");

const UsersRef = db.collection("users");

const SettingsRef = db.collection("settings");


/*=========================================================
=                CARGA DE INFORMACIÓN                     =
=========================================================*/

async function loadDatabase(){

    try{

        renderLoading();

        await Promise.all([

            loadBuilding(),

            loadApartments(),

            loadMovements(),

            loadExpenses(),

            loadUsers(),

            loadSettings()

        ]);

        render();

    }

    catch(error){

        console.error(error);

        renderConnectionError(error);

    }

}


/*=========================================================
=                  FIRESTORE                              =
=========================================================*/

async function loadBuilding(){

    const snapshot = await BuildingRef.get();

    STATE.database.building = snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

async function loadApartments(){

    const snapshot = await ApartmentsRef.get();

    STATE.database.apartments = snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

async function loadMovements(){

    const snapshot = await MovementsRef.get();

    STATE.database.movements = snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

async function loadExpenses(){

    const snapshot = await ExpensesRef.get();

    STATE.database.expenses = snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

async function loadUsers(){

    const snapshot = await UsersRef.get();

    STATE.database.users = snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}

async function loadSettings(){

    const snapshot = await SettingsRef.get();

    STATE.database.settings = snapshot.docs.map(doc=>({

        id:doc.id,

        ...doc.data()

    }));

}


/*=========================================================
=                    RENDER                               =
=========================================================*/

function render(){

    if(!STATE.session.logged){

        return renderLogin();

    }

    switch(STATE.navigation.page){

        case "dashboard":

            return renderDashboard();

        default:

            return renderDashboard();

    }

}


/*=========================================================
=                  PANTALLAS BASE                         =
=========================================================*/

function renderLoading(){

    renderApp(

        createLoader(

            "Conectando con Firebase..."

        )

    );

}


function renderConnectionError(error){

    renderApp(

        `

        <div class="page-wrap">

            ${createCard({

                title:"Error de conexión",

                body:`

                    <p>

                        No fue posible conectarse con Firebase.

                    </p>

                    <br>

                    <small>

                        ${error.message}

                    </small>

                    <br><br>

                    ${createButton({

                        text:"Reintentar",

                        action:"reload",

                        icon:"fa-solid fa-rotate-right"

                    })}

                `

            })}

        </div>

        `

    );

}


/*=========================================================
=                    INIT                                 =
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async ()=>{

        restoreSession();

        await loadDatabase();

    }

);
/*=========================================================
=                  MOTOR DE LA APLICACIÓN                 =
=========================================================*/

/**
 * Cambia la página actual
 */
function navigate(page){

    STATE.navigation.page = page;

    render();

}

/**
 * Inicia sesión
 */
function login(role, apartmentId = null){

    STATE.session.logged = true;

    STATE.session.role = role;

    STATE.session.apartmentId = apartmentId;

    navigate("dashboard");

}

/**
 * Cierra sesión
 */
function logout(){

    STATE.session.logged = false;

    STATE.session.role = null;

    STATE.session.apartmentId = null;

    navigate("login");

}

/**
 * Devuelve verdadero si el usuario es administrador
 */
function isAdmin(){

    return STATE.session.role === "admin";

}

/**
 * Devuelve verdadero si el usuario es propietario
 */
function isOwner(){

    return STATE.session.role === "owner";

}

/**
 * Apartamento activo
 */
function getCurrentApartment(){

    if(!STATE.session.apartmentId){

        return null;

    }

    return STATE.database.apartments.find(

        apartment => apartment.id === STATE.session.apartmentId

    );

}

/**
 * Reinicia todos los formularios
 */
function resetForms(){

    STATE.forms = {

        movement:{},

        apartment:{},

        report:{}

    };

}

/**
 * Refresca toda la aplicación
 */
function refresh(){

    render();

}
/*=========================================================
=                 LOGIN DEL SISTEMA                       =
=========================================================*/

function renderLogin(){

    renderApp(`

    <section class="login-page">

        <div class="login-container">

            <!-- Panel izquierdo -->

            <div class="login-left">

                <img
                    src="assets/Logo.png"
                    class="login-logo-large"
                    alt="Edificio Lucina">

                <h1>

                    Edificio Lucina

                </h1>

                <h2>

                    Sistema Inteligente de Administración

                </h2>

                <p>

                    Administre la cartera, los ingresos, los gastos,
                    los reportes y la información del edificio desde
                    cualquier lugar.

                </p>

            </div>

            <!-- Panel derecho -->

            <div class="login-right">

                <div class="login-card">

                    <h3>

                        Bienvenido

                    </h3>

                    <span>

                        Seleccione el tipo de acceso

                    </span>

                    <div class="login-options">

                        <button
                            class="login-option admin"
                            id="btnAdmin">

                            <i class="fa-solid fa-user-shield"></i>

                            Administrador

                        </button>

                        <button
                            class="login-option owner"
                            id="btnOwner">

                            <i class="fa-solid fa-building-user"></i>

                            Propietario

                        </button>

                    </div>

                    <div
                        id="loginForm">

                    </div>

                </div>

            </div>

        </div>

        <div class="cstm-signature">

            Desarrollado por

            <strong>

                CStM Lab

            </strong>

        </div>

    </section>

    `);

    initializeLogin();

}
/*=========================================================
=           INICIALIZAR LOGIN                             =
=========================================================*/

function initializeLogin(){

    const adminButton = document.getElementById("btnAdmin");

    const ownerButton = document.getElementById("btnOwner");

    adminButton.addEventListener(

        "click",

        renderAdminLogin

    );

    ownerButton.addEventListener(

        "click",

        renderOwnerLogin

    );

}
/*=========================================================
=           FORMULARIO ADMINISTRADOR                      =
=========================================================*/

function renderAdminLogin(){

    const container = document.getElementById("loginForm");

    container.innerHTML = `

        <div class="login-form">

            <label>

                Contraseña del administrador

            </label>

            <input
                type="password"
                id="adminPassword"
                placeholder="Ingrese su contraseña">

            <button
                class="btn-primary login-submit"
                id="adminLoginButton">

                <i class="fa-solid fa-right-to-bracket"></i>

                Ingresar

            </button>

            <div
                id="adminLoginMessage"
                class="login-message">

            </div>

        </div>

    `;

    document
        .getElementById("adminLoginButton")
        .addEventListener("click", loginAdministrator);

}


/*=========================================================
=            FORMULARIO PROPIETARIO                       =
=========================================================*/

function renderOwnerLogin(){

    const container = document.getElementById("loginForm");

    const apartments = STATE.database.apartments || [];

    container.innerHTML = `

        <div class="login-form">

            <label>

                Apartamento o Local

            </label>

            <select id="ownerApartment">

                <option value="">

                    Seleccione...

                </option>

                ${apartments.map(apartment=>`

                    <option value="${apartment.id}">

                        ${apartment.id}

                    </option>

                `).join("")}

            </select>

            <label>

                Contraseña

            </label>

            <input
                type="password"
                id="ownerPassword"
                placeholder="Ingrese su contraseña">

            <button
                class="btn-primary login-submit"
                id="ownerLoginButton">

                <i class="fa-solid fa-right-to-bracket"></i>

                Ingresar

            </button>

            <div
                id="ownerLoginMessage"
                class="login-message">

            </div>

        </div>

    `;

    document
        .getElementById("ownerLoginButton")
        .addEventListener("click", loginOwner);

}
/*=========================================================
=                  LOGIN ADMINISTRADOR                    =
=========================================================*/

async function loginAdministrator(){

    const password = document
        .getElementById("adminPassword")
        .value
        .trim();

    if(password.length===0){

        return showLoginMessage(

            "adminLoginMessage",

            "Debe ingresar la contraseña.",

            true

        );

    }

    /*
        Firebase se conectará aquí
    */

    login("admin");

}


/*=========================================================
=                    LOGIN PROPIETARIO                    =
=========================================================*/

async function loginOwner(){

    const apartment = document
        .getElementById("ownerApartment")
        .value;

    const password = document
        .getElementById("ownerPassword")
        .value
        .trim();

    if(apartment===""){

        return showLoginMessage(

            "ownerLoginMessage",

            "Seleccione un apartamento.",

            true

        );

    }

    if(password.length===0){

        return showLoginMessage(

            "ownerLoginMessage",

            "Ingrese la contraseña.",

            true

        );

    }

    /*
        Firebase se conectará aquí
    */

    login(

        "owner",

        apartment

    );

}
/*=========================================================
=                 MENSAJES DEL LOGIN                      =
=========================================================*/

function showLoginMessage(

    id,

    message,

    error=false

){

    const element = document.getElementById(id);

    if(!element) return;

    element.textContent = message;

    element.style.color = error
        ? "#C62828"
        : "#2E7D32";

}
/*=========================================================
=            VALIDACIÓN DEL ADMINISTRADOR                =
=========================================================*/

async function loginAdministrator(){

    const password = document
        .getElementById("adminPassword")
        .value
        .trim();

    if(password===""){

        return showLoginMessage(

            "adminLoginMessage",

            "Debe ingresar la contraseña.",

            true

        );

    }

    showLoginMessage(

        "adminLoginMessage",

        "Verificando credenciales..."

    );

    /*
    ======================================================
    AQUÍ SE HARÁ LA VALIDACIÓN CON FIREBASE
    ======================================================
    */

    setTimeout(()=>{

        createSession({

            role:"admin",

            apartment:null,

            name:"Administrador"

        });

    },700);

}



/*=========================================================
=              VALIDACIÓN DEL PROPIETARIO                =
=========================================================*/

async function loginOwner(){

    const apartment=document
        .getElementById("ownerApartment")
        .value;

    const password=document
        .getElementById("ownerPassword")
        .value
        .trim();

    if(apartment===""){

        return showLoginMessage(

            "ownerLoginMessage",

            "Seleccione un apartamento.",

            true

        );

    }

    if(password===""){

        return showLoginMessage(

            "ownerLoginMessage",

            "Debe ingresar la contraseña.",

            true

        );

    }

    showLoginMessage(

        "ownerLoginMessage",

        "Verificando información..."

    );

    /*
    ======================================================
    AQUÍ SE VALIDARÁ EL APARTAMENTO EN FIREBASE
    ======================================================
    */

    setTimeout(()=>{

        createSession({

            role:"owner",

            apartment,

            name:apartment

        });

    },700);

}
/*=========================================================
=                  CREAR SESIÓN                           =
=========================================================*/

function createSession(user){

    STATE.session.logged=true;

    STATE.session.role=user.role;

    STATE.session.apartmentId=user.apartment;

    STATE.session.user=user;

    sessionStorage.setItem(

        "lucina-session",

        JSON.stringify(user)

    );

    navigate("dashboard");

}
/*=========================================================
=               RECUPERAR SESIÓN                          =
=========================================================*/

function restoreSession(){

    const session=sessionStorage.getItem(

        "lucina-session"

    );

    if(!session){

        return;

    }

    try{

        const user=JSON.parse(session);

        STATE.session.logged=true;

        STATE.session.role=user.role;

        STATE.session.apartmentId=user.apartment;

        STATE.session.user=user;

    }

    catch(error){

        sessionStorage.removeItem(

            "lucina-session"

        );

    }

}
/*=========================================================
=                 CERRAR SESIÓN                           =
=========================================================*/

function logout(){

    sessionStorage.removeItem(

        "lucina-session"

    );

    STATE.session={

        logged:false,

        role:null,

        apartmentId:null,

        user:null

    };

    navigate("login");

}
/*=========================================================
=                 DASHBOARD PRINCIPAL                     =
=========================================================*/

function renderDashboard(){

    if(isAdmin()){

        renderAdministratorDashboard();

        return;

    }

    if(isOwner()){

        renderOwnerDashboard();

        return;

    }

    logout();

}


/*=========================================================
=              DASHBOARD ADMINISTRADOR                    =
=========================================================*/

function renderAdministratorDashboard(){

    renderApp(`

        <main class="dashboard-page">

            <div id="dashboardHeader"></div>

            <div id="dashboardSidebar"></div>

            <section class="dashboard-content">

                <div id="dashboardCards"></div>

                <div id="dashboardAlerts"></div>

                <div id="dashboardActions"></div>

                <div id="dashboardRecent"></div>

            </section>

            <div id="dashboardFooter"></div>

        </main>

    `);

    renderDashboardHeader();

    renderDashboardSidebar();

    renderDashboardCards();

    renderDashboardAlerts();

    renderDashboardActions();

    renderRecentMovements();

    renderDashboardFooter();

}
/*=========================================================
=               HEADER DEL DASHBOARD                      =
=========================================================*/

function renderDashboardHeader(){

    const container=document.getElementById(

        "dashboardHeader"

    );

    container.innerHTML=`

        <header class="dashboard-header">

            <div>

                <h1>

                    Panel Administrativo

                </h1>

                <span>

                    Edificio Lucina

                </span>

            </div>

            <button
                class="btn-secondary"
                onclick="logout()">

                <i class="fa-solid fa-right-from-bracket"></i>

                Cerrar sesión

            </button>

        </header>

    `;

}
/*=========================================================
=              MENÚ LATERAL                               =
=========================================================*/

function renderDashboardSidebar(){

    const container=document.getElementById(

        "dashboardSidebar"

    );

    container.innerHTML=`

        <aside class="dashboard-sidebar">

            <button>

                <i class="fa-solid fa-house"></i>

                Inicio

            </button>

            <button>

                <i class="fa-solid fa-money-bill-transfer"></i>

                Movimiento Nuevo

            </button>

            <button>

                <i class="fa-solid fa-building"></i>

                Apartamentos

            </button>

            <button>

                <i class="fa-solid fa-file-lines"></i>

                Historial

            </button>

            <button>

                <i class="fa-solid fa-chart-column"></i>

                Reportes

            </button>

            <button>

                <i class="fa-solid fa-gear"></i>

                Configuración

            </button>

        </aside>

    `;

}
/*=========================================================
=                 FOOTER                                  =
=========================================================*/

function renderDashboardFooter(){

    const container=document.getElementById(

        "dashboardFooter"

    );

    container.innerHTML=`

        <footer class="dashboard-footer">

            Sistema desarrollado por

            <strong>

                CStM Lab

            </strong>

            © 2026

        </footer>

    `;

}
/*=========================================================
=              COMPONENTES REUTILIZABLES                  =
=========================================================*/


/**
 * Tarjeta de métricas
 */

function createMetricCard(config={}){

    return `

        <article class="metric-card">

            <div class="metric-card-icon">

                <i class="${config.icon || "fa-solid fa-chart-column"}"></i>

            </div>

            <div class="metric-card-content">

                <span class="metric-card-title">

                    ${config.title || ""}

                </span>

                <h2 class="metric-card-value">

                    ${config.value || "$0"}

                </h2>

                ${config.subtitle ? `

                    <small>

                        ${config.subtitle}

                    </small>

                ` : ""}

            </div>

        </article>

    `;

}


/*=========================================================
=                     BOTONES                             =
=========================================================*/

function createButton(config={}){

    return `

        <button

            class="${config.class || "btn-primary"}"

            id="${config.id || ""}"

            data-action="${config.action || ""}"

        >

            ${config.icon ? `

                <i class="${config.icon}"></i>

            ` : ""}

            ${config.text || "Botón"}

        </button>

    `;

}


/*=========================================================
=                  TÍTULOS DE SECCIÓN                     =
=========================================================*/

function createSectionTitle(title){

    return `

        <div class="section-title">

            <h2>

                ${title}

            </h2>

        </div>

    `;

}


/*=========================================================
=                     ALERTAS                             =
=========================================================*/

function createAlert(config={}){

    return `

        <div class="alert-card ${config.type || "info"}">

            <div class="alert-icon">

                <i class="${config.icon || "fa-solid fa-circle-info"}"></i>

            </div>

            <div class="alert-content">

                <strong>

                    ${config.title || ""}

                </strong>

                <p>

                    ${config.message || ""}

                </p>

            </div>

        </div>

    `;

}
/*=========================================================
=                COMPONENTES DE LAYOUT                    =
=========================================================*/


function createCard(content){

    return `

        <section class="card">

            ${content}

        </section>

    `;

}



function createDivider(){

    return `

        <hr class="divider">

    `;

}



function createEmptyState(message){

    return `

        <div class="empty-state">

            <i class="fa-regular fa-folder-open"></i>

            <p>

                ${message}

            </p>

        </div>

    `;

}
/*=========================================================
=                UTILIDADES VISUALES                      =
=========================================================*/


function money(value){

    return new Intl.NumberFormat(

        "es-CO",

        {

            style:"currency",

            currency:"COP",

            maximumFractionDigits:0

        }

    ).format(value || 0);

}



function percentage(value,total){

    if(total===0){

        return "0%";

    }

    return (

        (value/total)*100

    ).toFixed(1)+"%";

}



function currentDate(){

    return new Date()

        .toLocaleDateString(

            "es-CO"

        );

}
/*=========================================================
=              TARJETAS DEL DASHBOARD                     =
=========================================================*/

function renderDashboardCards(){

    const container = document.getElementById("dashboardCards");

    if(!container) return;

    container.innerHTML = `

        ${createSectionTitle("Resumen Financiero")}

        <div class="dashboard-cards-grid">

            ${createMetricCard({
                title:"Cartera del mes",
                value:money(0),
                subtitle:"Pendiente de cálculo",
                icon:"fa-solid fa-calendar-days"
            })}

            ${createMetricCard({
                title:"Cartera total",
                value:money(0),
                subtitle:"Acumulada",
                icon:"fa-solid fa-wallet"
            })}

            ${createMetricCard({
                title:"Ingresos del mes",
                value:money(0),
                subtitle:"Recaudado",
                icon:"fa-solid fa-arrow-trend-up"
            })}

            ${createMetricCard({
                title:"Gastos del mes",
                value:money(0),
                subtitle:"Ejecutados",
                icon:"fa-solid fa-arrow-trend-down"
            })}

        </div>

    `;

}



/*=========================================================
=                  ALERTAS                                =
=========================================================*/

function renderDashboardAlerts(){

    const container = document.getElementById("dashboardAlerts");

    if(!container) return;

    container.innerHTML = `

        ${createSectionTitle("Alertas")}

        ${createAlert({

            type:"warning",

            icon:"fa-solid fa-triangle-exclamation",

            title:"No existen alertas",

            message:"Cuando existan apartamentos con mora superior a tres meses aparecerán aquí."

        })}

    `;

}



/*=========================================================
=               ACCIONES RÁPIDAS                          =
=========================================================*/

function renderDashboardActions(){

    const container = document.getElementById("dashboardActions");

    if(!container) return;

    container.innerHTML = `

        ${createSectionTitle("Acciones Rápidas")}

        <div class="dashboard-actions">

            ${createButton({

                text:"Movimiento Nuevo",

                icon:"fa-solid fa-money-bill-transfer",

                class:"btn-primary",

                action:"newMovement"

            })}

        </div>

    `;

}



/*=========================================================
=             MOVIMIENTOS RECIENTES                       =
=========================================================*/

function renderRecentMovements(){

    const container = document.getElementById("dashboardRecent");

    if(!container) return;

    container.innerHTML = `

        ${createSectionTitle("Últimos movimientos")}

        ${createEmptyState(

            "Todavía no existen movimientos registrados."

        )}

    `;

}
/*=========================================================
=                 MOTOR DE NAVEGACIÓN                     =
=========================================================*/

function navigate(page, data = null){

    STATE.currentPage = page;

    STATE.currentData = data;

    renderCurrentPage();

}



/*=========================================================
=            RENDERIZADOR PRINCIPAL                       =
=========================================================*/

function renderCurrentPage(){

    switch(STATE.currentPage){

        case "login":

            renderLogin();

            break;

        case "dashboard":

            renderDashboard();

            break;

        case "movements":

            renderMovements();

            break;

        case "apartments":

            renderApartments();

            break;

        case "history":

            renderHistory();

            break;

        case "reports":

            renderReports();

            break;

        case "settings":

            renderSettings();

            break;

        default:

            renderLogin();

    }

}
/*=========================================================
=          PANTALLAS EN DESARROLLO                        =
=========================================================*/

function renderMovements(){

    renderApp(`

        <div class="page-placeholder">

            <i class="fa-solid fa-money-bill-transfer"></i>

            <h2>Movimiento Nuevo</h2>

            <p>

                Este módulo será desarrollado en las siguientes entregas.

            </p>

        </div>

    `);

}



function renderApartments(){

    renderApp(`

        <div class="page-placeholder">

            <i class="fa-solid fa-building"></i>

            <h2>Apartamentos</h2>

            <p>

                Próximamente.

            </p>

        </div>

    `);

}



function renderHistory(){

    renderApp(`

        <div class="page-placeholder">

            <i class="fa-solid fa-file-lines"></i>

            <h2>Historial</h2>

            <p>

                Próximamente.

            </p>

        </div>

    `);

}



function renderReports(){

    renderApp(`

        <div class="page-placeholder">

            <i class="fa-solid fa-chart-column"></i>

            <h2>Reportes</h2>

            <p>

                Próximamente.

            </p>

        </div>

    `);

}



function renderSettings(){

    renderApp(`

        <div class="page-placeholder">

            <i class="fa-solid fa-gear"></i>

            <h2>Configuración</h2>

            <p>

                Próximamente.

            </p>

        </div>

    `);

}
