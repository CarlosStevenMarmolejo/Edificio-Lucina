"use strict";

/*
=========================================================
COMPONENTS.JS
Edificio Lucina
CStM Lab
=========================================================

Todas las funciones de este archivo tienen una única
responsabilidad:

Generar componentes visuales reutilizables.

NO contienen lógica de negocio.
NO consultan Firebase.
NO modifican el STATE.

Únicamente devuelven HTML.
=========================================================
*/

const Components = {

    /*=========================================
    =            LAYOUT
    =========================================*/

/*=========================================
=            HEADER PRINCIPAL
=========================================*/

header(title = "", subtitle = ""){

    const user = {

    name: STATE.session.name,

    role: STATE.session.role

};

    return `

        <header class="app-header">

            <div class="header-left">

                <img
                    src="assets/Logo.png"
                    alt="Edificio Lucina"
                    class="header-logo"
                >

                <div>

                    <h1 class="header-title">

                        ${title}

                    </h1>

                    <p class="header-subtitle">

                        ${subtitle}

                    </p>

                </div>

            </div>



            <div class="header-right">

                <div class="header-user">

                    <div class="header-user-name">

                        ${user.name || "Invitado"}

                    </div>

                    <div class="header-user-role">

                        ${user.role || ""}

                    </div>

                </div>



                <button

    class="btn btn-outline"

    id="logoutButton"

    data-action="logout"

>

                    <i class="fa-solid fa-right-from-bracket"></i>

                    Salir

                </button>

            </div>

        </header>

    `;

},

/*=========================================
=            SIDEBAR
=========================================*/

sidebar(menu = [], active = ""){

    return `

        <aside class="sidebar">

            <div class="sidebar-logo">

                <img
                    src="assets/Logo.png"
                    alt="Edificio Lucina"
                >

                <h2>

                    Edificio Lucina

                </h2>

            </div>

            <nav class="sidebar-menu">

                ${menu.map(item => `

                    <button

                        class="sidebar-item ${item.id === active ? "active" : ""}"

                        data-action="navigate"

                        data-page="${item.id}"

                    >

                        <i class="fa-solid ${item.icon}"></i>

                        <span>

                            ${item.label}

                        </span>

                    </button>

                `).join("")}

            </nav>

        </aside>

    `;

},

/*=========================================
=            FOOTER
=========================================*/

footer(){

    return `

        <footer class="app-footer">

            <span>

                © ${new Date().getFullYear()} Edificio Lucina

            </span>

            <span>

                Desarrollado por

                <strong>

                    CStM Lab

                </strong>

            </span>

        </footer>

    `;

},

/*=========================================
=            CONTENIDO
=========================================*/

content(html = ""){

    return `

        <section class="app-content">

            ${html}

        </section>

    `;

},

/*=========================================
=            LAYOUT PRINCIPAL
=========================================*/

layout({

    menu = [],

    active = "",

    title = "",

    subtitle = "",

    content = ""

}){

    return `

        <div class="app-layout">

            ${

                Components.sidebar(

                    menu,

                    active

                )

            }

            <div class="app-main">

                ${

                    Components.header(

                        title,

                        subtitle

                    )

                }

                ${

                    Components.content(

                        content

                    )

                }

                ${

                    Components.footer()

                }

            </div>

        </div>

    `;

},

/*=========================================
=            CONTENEDOR PRINCIPAL
=========================================*/

page(content = ""){

    return `

        <main class="page-container">

            ${content}

        </main>

    `;

},

/*=========================================
=            SECCIÓN
=========================================*/

section({

    title = "",

    content = ""

}) {

    return `

        <section class="page-section">

            <h2 class="section-title">

                ${title}

            </h2>

            ${content}

        </section>

    `;

},



    /*=========================================
    =            TARJETAS
    =========================================*/

/*=========================================
=            CARD
=========================================*/

card(content = "", className = ""){

    return `

        <div class="card ${className}">

            ${content}

        </div>

    `;

},

/*=========================================
=            TARJETA MÉTRICA
=========================================*/

metricCard({

    title = "",

    value = "",

    subtitle = "",

    icon = "fa-chart-column",

    color = "green"

}){

    return `

        <div class="metric-card">

            <div class="metric-top">

                <div>

                    <div class="metric-title">

                        ${title}

                    </div>

                    <div class="metric-value">

                        ${value}

                    </div>

                    ${
                        subtitle
                        ?

                        `

                        <div class="metric-subtitle">

                            ${subtitle}

                        </div>

                        `

                        :

                        ""

                    }

                </div>

                <div class="metric-icon ${color}">

                    <i class="fa-solid ${icon}"></i>

                </div>

            </div>

        </div>

    `;

},

/*=========================================
=            GRID DE TARJETAS
=========================================*/

cardsGrid(cards = []){

    return `

        <div class="cards-grid">

            ${cards.join("")}

        </div>

    `;

},

    /*=========================================
    =            BOTONES
    =========================================*/

/*=========================================
=            BOTÓN
=========================================*/

button({

    id = "",

    text = "",

    icon = "",

    type = "button",

    className = "btn-primary",

    disabled = false,

    dataAction = "",

    dataInput = "",

    dataModal = ""

}){

    return `

        <button

            ${id ? `id="${id}"` : ""}

            type="${type}"

            class="btn ${className}"

            ${disabled ? "disabled" : ""}

            ${dataAction ? `data-action="${dataAction}"` : ""}

            ${dataInput ? `data-input="${dataInput}"` : ""}

            ${dataModal ? `data-modal="${dataModal}"` : ""}

        >

            ${

                icon

                ?

                `<i class="fa-solid ${icon}"></i>`

                :

                ""

            }

            <span>${text}</span>

        </button>

    `;

},

/*=========================================
=            GRUPO DE BOTONES
=========================================*/

buttonGroup(buttons = []){

    return `

        <div class="button-group">

            ${buttons.join("")}

        </div>

    `;

},

/*=========================================
=            BOTÓN DE ICONO
=========================================*/

iconButton({

    icon,

    className = "btn-outline",

    dataAction = "",

    dataInput = "",

    dataId = "",

    title = ""

})
{

    return `

        <button

            class="btn ${className}"

            ${dataAction ? `data-action="${dataAction}"` : ""}

            ${dataInput ? `data-input="${dataInput}"` : ""}

            ${dataId ? `data-id="${dataId}"` : ""}

            title="${title}"

        >

            <i class="fa-solid ${icon}"></i>

        </button>

    `;

},

    /*=========================================
    =            FORMULARIOS
    =========================================*/

/*=========================================
=            INPUT
=========================================*/

input({

    id = "",

    type = "text",

    value = "",

    placeholder = "",

    className = "",

    disabled = false,

    required = false,

    dataAction = "",

    dataInput = "",

    dataChange = ""

}){

    return `

        <input

            ${id ? `id="${id}"` : ""}

            type="${type}"

            value="${value}"

            placeholder="${placeholder}"

            class="input ${className}"

            ${disabled ? "disabled" : ""}

            ${required ? "required" : ""}

            ${dataAction ? `data-action="${dataAction}"` : ""}

            ${dataInput ? `data-input="${dataInput}"` : ""}

            ${dataChange ? `data-change="${dataChange}"` : ""}

        >

    `;

},

/*=========================================
=            SELECT
=========================================*/

select({

    id = "",

    options = [],

    value = "",

    className = "",

    dataAction = "",

    dataChange= ""

}){

    return `

        <select

            ${id ? `id="${id}"` : ""}

            class="select ${className}"

            ${dataAction ? `data-action="${dataAction}"` : ""}

            ${dataChange ? `data-change="${dataChange}"` : ""}

        >

            ${options.map(option => `

                <option

                    value="${option.value}"

                    ${option.value == value ? "selected" : ""}

                >

                    ${option.label}

                </option>

            `).join("")}

        </select>

    `;

},

/*=========================================
=            TEXTAREA
=========================================*/

textarea({

    id = "",

    value = "",

    rows = 4,

    placeholder = "",

    className = ""

}){

    return `

        <textarea

            ${id ? `id="${id}"` : ""}

            rows="${rows}"

            class="textarea ${className}"

            placeholder="${placeholder}"

        >${value}</textarea>

    `;

},

/*=========================================
=            FORM GROUP
=========================================*/

formGroup({

    label = "",

    input = ""

}){

    return `

        <div class="form-group">

            <label class="form-label">

                ${label}

            </label>

            ${input}

        </div>

    `;

},

/*=========================================
=            FORM ROW
=========================================*/

formRow(content = ""){

    return `

        <div class="form-row">

            ${content}

        </div>

    `;

},

    /*=========================================
    =            TABLAS
    =========================================*/

/*=========================================
=            TABLA
=========================================*/

table({

    headers = [],

    rows = [],

    emptyMessage = "No hay información disponible."

}){

    return `

        <div class="table-container">

            <table class="table">

                <thead>

                    <tr>

                        ${headers.map(header => `

                            <th>

                                ${header}

                            </th>

                        `).join("")}

                    </tr>

                </thead>

                <tbody>

                    ${

                        rows.length

                        ?

                        rows.map(row => `

                            <tr>

                                ${row.map(column => `

                                    <td>

                                        ${column}

                                    </td>

                                `).join("")}

                            </tr>

                        `).join("")

                        :

                        `

                        <tr>

                            <td

                                colspan="${headers.length}"

                                class="table-empty"

                            >

                                ${emptyMessage}

                            </td>

                        </tr>

                        `

                    }

                </tbody>

            </table>

        </div>

    `;

},

/*=========================================
=            FILA DE TABLA
=========================================*/

tableRow(columns = []){

    return columns;

},

/*=========================================
=            CELDA
=========================================*/

tableCell(content = ""){

    return content;

},

/*=========================================
=            TOOLBAR DE TABLA
=========================================*/

tableToolbar(content = ""){

    return `

        <div class="table-toolbar">

            ${content}

        </div>

    `;

},
    /*=========================================
    =            BADGES
    =========================================*/

/*=========================================
=            BADGE
=========================================*/

badge({

    text = "",

    type = "neutral",

    icon = ""

}){

    return `

        <span class="badge badge-${type}">

            ${

                icon

                ?

                `<i class="fa-solid ${icon}"></i>`

                :

                ""

            }

            ${text}

        </span>

    `;

},

/*=========================================
=            BADGE SUCCESS
=========================================*/

success(text){

    return this.badge({

        text,

        type : "success",

        icon : "fa-circle-check"

    });

},

/*=========================================
=            BADGE WARNING
=========================================*/

warning(text){

    return this.badge({

        text,

        type : "warning",

        icon : "fa-triangle-exclamation"

    });

},

/*=========================================
=            BADGE DANGER
=========================================*/

danger(text){

    return this.badge({

        text,

        type : "danger",

        icon : "fa-circle-xmark"

    });

},

/*=========================================
=            BADGE INFO
=========================================*/

info(text){

    return this.badge({

        text,

        type : "info",

        icon : "fa-circle-info"

    });

},

/*=========================================
=            BADGE NEUTRAL
=========================================*/

neutral(text){

    return this.badge({

        text,

        type : "neutral"

    });

},
    /*=========================================
    =            MODALES
    =========================================*/

/*=========================================
=            MODAL
=========================================*/

modal({

    id = "appModal",

    title = "",

    content = "",

    footer = "",

    size = "md",

    closeButton = true

}){

    return `

        <div

            id="${id}"

            class="modal-overlay hidden"

        >

            <div class="modal modal-${size}">

                <div class="modal-header">

                    <h2 class="modal-title">

                        ${title}

                    </h2>

                    ${

                        closeButton

                        ?

                        `

                        <button

    class="modal-close"

    data-action="close-modal"

    data-modal="${id}"

>

                            <i class="fa-solid fa-xmark"></i>

                        </button>

                        `

                        :

                        ""

                    }

                </div>



                <div class="modal-body">

                    ${content}

                </div>



                <div class="modal-footer">

                    ${footer}

                </div>

            </div>

        </div>

    `;

},

/*=========================================
=            ABRIR MODAL
=========================================*/

openModal(id){

    const modal = document.getElementById(id);

    if(!modal){

        return;

    }

    modal.classList.remove("hidden");

},

/*=========================================
=            CERRAR MODAL
=========================================*/

closeModal(id){

    const modal = document.getElementById(id);

    if(!modal){

        return;

    }

    modal.classList.add("hidden");

},

/*=========================================
=            CONFIRMACIÓN
=========================================*/

confirm({

    title = "Confirmar",

    message = "",

    confirmText = "Aceptar",

    cancelText = "Cancelar"

}){

    return this.modal({

        id : "confirmModal",

        title,

        content : `

            <p>

                ${message}

            </p>

        `,

        footer :

            Components.buttonGroup([

                Components.button({

                    text : cancelText,

                    className : "btn-outline",

                    dataAction : "close-modal"

                }),

                Components.button({

                    text : confirmText,

                    className : "btn-primary",

                    dataAction : "confirm-modal"

                })

            ])

    });

},
    /*=========================================
    =            MENSAJES
    =========================================*/

/*=========================================
=            LOADER
=========================================*/

loader(message = "Cargando información..."){

    return `

        <div class="app-loader">

            <div class="loader-spinner"></div>

            <p class="loader-text">

                ${message}

            </p>

        </div>

    `;

},

/*=========================================
=            ESTADO VACÍO
=========================================*/

empty({

    title = "Sin información",

    message = "No hay datos para mostrar.",

    icon = "fa-folder-open"

}){

    return `

        <div class="empty-state">

            <i class="fa-solid ${icon} empty-icon"></i>

            <h3 class="empty-title">

                ${title}

            </h3>

            <p class="empty-message">

                ${message}

            </p>

        </div>

    `;

},

/*=========================================
=            MENSAJE DE ERROR
=========================================*/

error({

    title = "Ha ocurrido un error",

    message = "",

    buttonText = "",

    buttonAction = ""

}){

    return `

        <div class="error-state">

            <i class="fa-solid fa-circle-exclamation error-icon"></i>

            <h3 class="error-title">

                ${title}

            </h3>

            <p class="error-message">

                ${message}

            </p>

            ${

                buttonText

                ?

                Components.button({

                    text : buttonText,

                    icon : "fa-rotate-right",

                    className : "btn-primary",

                    dataAction : buttonAction

                })

                :

                ""

            }

        </div>

    `;

},

};