/*
=========================================
APARTMENTS.JS
Administración de apartamentos
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const Apartments = {

    /*=========================================
    =            ESTADO DEL MÓDULO
    =========================================*/

    currentId: null,

    /*=========================================
    =            Render principal
    =========================================*/

    render() {

        return Components.layout({

            menu: CONFIG.MENU,

            active: "apartments",

            title: "Apartamentos",

            subtitle: "Administración de apartamentos y locales",

            content: this.content()

        });

    },



    /*=========================================
    =            Contenido
    =========================================*/

    content() {

        return `

            ${this.toolbar()}

            ${this.table()}

            ${this.form()}

        `;

    },

    /*=========================================
=            BARRA DE HERRAMIENTAS
=========================================*/

toolbar() {

    return Components.section({

        content:

            Components.buttonGroup([

                Components.button({

                    text: "Nuevo apartamento",

                    icon: "fa-plus",

                    className: "btn-primary",

                    dataAction: "new-apartment"

                })

            ])

    });

},

/*=========================================
=            TABLA
=========================================*/

table() {

    return Components.section({

        title: "Listado de apartamentos",

        content:

            Components.table({

                headers: [

                    "Unidad",

                    "Propietario",

                    "Tipo",

                    "Estado",

                    "Acciones"

                ],

                rows: this.getRows()

            })

    });

},

/*=========================================
=            FILAS DE LA TABLA
=========================================*/

getRows() {

    const apartments = this.loadData();

    if (!apartments.length) {

        return [

            Components.tableRow([

                "Sin registros",

                "-",

                "-",

                Components.neutral("Sin información"),

                "-"

            ])

        ];

    }

    return apartments.map(apartment =>

        Components.tableRow([

            apartment.unit,

            apartment.owner,

            apartment.type,

            Components.success("Activo"),

            Components.buttonGroup([

             Components.iconButton({

             icon: "fa-pen",

             className: "btn-primary",

             dataAction: "edit-apartment",

             dataId: apartment.id

             }),

            Components.iconButton({

             icon: "fa-trash",

             className: "btn-danger",

             dataAction: "remove-apartment",

             dataId: apartment.id
 
             })

             ])

        ])

    );

},

/*=========================================
=            FORMULARIO
=========================================*/

form() {

    return Components.modal({

        id: "apartmentModal",

        title: "Apartamento",

        content: `

            ${Components.formGroup({

                label: "Unidad",

                input:

                    Components.input({

                        id: "apartment-unit",

                        placeholder: "Ej: Apto 101"

                    })

            })}

            ${Components.formGroup({

                label: "Propietario",

                input:

                    Components.input({

                        id: "apartment-owner",

                        placeholder: "Nombre del propietario"

                    })

            })}

            ${Components.formGroup({

                label: "Tipo",

                input:

                    Components.select({

                        id: "apartment-type",

                        options: [

                            {

                                value: "apartamento",

                                text: "Apartamento"

                            },

                            {

                                value: "local",

                                text: "Local"

                            }

                        ]

                    })

            })}

        `,

        footer:

            Components.buttonGroup([

                Components.button({

                    text: "Cancelar",

                    className: "btn-outline",

                    dataAction: "close-modal"

                }),

                Components.button({

                    text: "Guardar",

                    icon: "fa-floppy-disk",

                    className: "btn-primary",

                    dataAction: "save-apartment"

                })

            ])

    });

},

/*=========================================
=            NUEVO APARTAMENTO
=========================================*/

new() {

    this.currentId = null;

    Components.openModal("apartmentModal");

},

/*=========================================
=            GUARDAR
=========================================*/

save() {

    console.log(

        "Guardar apartamento"

    );

},

/*=========================================
=            CARGAR FORMULARIO
=========================================*/

loadForm(data = {}) {

    Utils.setValue(

        "apartment-unit",

        data.unit || ""

    );

    Utils.setValue(

        "apartment-owner",

        data.owner || ""

    );

    Utils.setValue(

        "apartment-type",

        data.type || "apartamento"

    );

},

/*=========================================
=            LIMPIAR FORMULARIO
=========================================*/

clearForm() {

    this.loadForm();

},

/*=========================================
=            CARGAR DATOS
=========================================*/

loadData() {

    return STATE.apartments || [];

},

/*=========================================
=            ACTUALIZAR MÓDULO
=========================================*/

refresh() {

    const app = document.getElementById("app");

    if (!app) {

        return;

    }

    app.innerHTML = this.render();

},

/*=========================================
=            EDITAR
=========================================*/

edit(id) {

    const apartments = this.loadData();

    const apartment = apartments.find(

        item => item.id === id

    );

    if (!apartment) {

        return;

    }

    this.currentId = id;

    this.loadForm(apartment);

    Components.openModal("apartmentModal");

},

/*=========================================
=            ELIMINAR
=========================================*/

remove(id) {

    console.log(

        "Eliminar apartamento:",

        id

    );

},

};