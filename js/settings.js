/*
=========================================
SETTINGS.JS
Configuración
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const Settings = {

    /*=========================================
    =            RENDER PRINCIPAL
    =========================================*/

    render() {

        return Components.layout({

            menu: APP_CONFIG.menu,

            active: "settings",

            title: "Configuración",

            subtitle: "Parámetros generales del sistema",

            content: this.content()

        });

    },



    /*=========================================
    =            CONTENIDO
    =========================================*/

    content() {

        return `

            ${this.general()}

            ${this.form()}

        `;

    },

/*=========================================
=            CONFIGURACIÓN GENERAL
=========================================*/

general() {

    return Components.section({

        title: "Configuración General",

        content:

            Components.buttonGroup([

                Components.button({

                    text: "Guardar",

                    icon: "fa-floppy-disk",

                    className: "btn-primary",

                    dataAction: "save-settings"

                })

            ])

    });

},

/*=========================================
=            CARGAR DATOS
=========================================*/

loadData() {

    return STATE.database.settings || {};

},

/*=========================================
=            FORMULARIO
=========================================*/

form() {

    const settings = this.loadData();

    return Components.section({

        title: "Datos del edificio",

        content: `

            ${Components.formGroup({

                label: "Nombre del edificio",

                input: Components.input({

                    id: "building-name",

                    value: settings.name || "",

                    placeholder: "Nombre del edificio"

                })

            })}

            ${Components.formGroup({

                label: "Dirección",

                input: Components.input({

                    id: "building-address",

                    value: settings.address || "",

                    placeholder: "Dirección"

                })

            })}

        `

    });

},

/*=========================================
=            GUARDAR
=========================================*/

save() {

    const settings = this.loadData();

    settings.name = Utils.getValue(

        "building-name"

    );

    settings.address = Utils.getValue(

        "building-address"

    );

    STATE.database.settings = settings;

    this.refresh();

},


/*=========================================
=            ACTUALIZAR
=========================================*/

refresh() {

    const app = document.getElementById(

        "app"

    );

    if (!app) {

        return;

    }

    app.innerHTML = this.render();

},

};