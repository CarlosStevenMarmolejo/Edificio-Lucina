/*
=========================================
MOVEMENTS.JS
Movimientos financieros
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const Movements = {

        /*=========================================
    =            ESTADO DEL MÓDULO
    =========================================*/

    currentId: null,

    /*=========================================
    =            Render principal
    =========================================*/

    render() {

        return Components.layout({

            menu: APP_CONFIG.menu,

            active: "movements",

            title: "Movimientos",

            subtitle: "Administración de ingresos y gastos",

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

    title: "Acciones",

    content:

        Components.buttonGroup([

            Components.button({

                text: "Nuevo movimiento",

                icon: "fa-plus",

                className: "btn-primary",

                dataAction: "new-movement"

            })

        ])

});

},

/*=========================================
=            TABLA
=========================================*/

table() {

    return Components.section({

        title: "Movimientos registrados",

        content:

            Components.table({

                headers: [

                    "Fecha",

                    "Tipo",

                    "Concepto",

                    "Valor",

                    "Acciones"

                ],

                rows: this.getRows()

            })

    });

},

/*=========================================
=            FORMULARIO
=========================================*/

form() {

    return Components.modal({

        id: "movementModal",

        title: "Movimiento",

        content: `

            ${Components.formGroup({

                label: "Tipo",

                input:

                    Components.select({

                        id: "movement-type",

                        options: [

                            {

                                value: "administracion",

                                label: "Cuota de administración"

                            },

                            {

                                value: "extraordinaria",

                                label: "Cuota extraordinaria"

                            },

                            {

                                value: "gasto",

                                label: "Gasto"

                            },

                            {

                                value: "ingreso",

                                label: "Otro ingreso"

                            }

                        ]

                    })

            })}

            ${Components.formGroup({

                label: "Concepto",

                input:

                    Components.input({

                        id: "movement-concept",

                        placeholder: "Descripción del movimiento"

                    })

            })}

            ${Components.formGroup({

                label: "Valor",

                input:

                    Components.input({

                        id: "movement-value",

                        type: "number",

                        placeholder: "$0"

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

                    dataAction: "save-movement"

                })

            ])

    });

},

/*=========================================
=            NUEVO MOVIMIENTO
=========================================*/

new() {

    this.currentId = null;

    this.clearForm();

    Components.openModal("movementModal");

},

/*=========================================
=            GUARDAR
=========================================*/

save() {

    console.log(

        "Guardar movimiento"

    );

},

/*=========================================
=            CARGAR FORMULARIO
=========================================*/

loadForm(data = {}) {

    Utils.setValue(

        "movement-type",

        data.type || "administracion"

    );

    Utils.setValue(

        "movement-concept",

        data.concept || ""

    );

    Utils.setValue(

        "movement-value",

        data.value || ""

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

    return STATE.database.movements || [];

},

/*=========================================
=            FILAS DE LA TABLA
=========================================*/

getRows() {

    const movements = this.loadData();

    if (!movements.length) {

        return [

            Components.tableRow([

                "Sin registros",

                "-",

                "-",

                "-",

                "-"

            ])

        ];

    }

    return movements.map(movement =>

        Components.tableRow([

            movement.date,

            movement.type,

            movement.concept,

            formatCurrency(

                movement.value

            ),

            Components.buttonGroup([

                Components.iconButton({

                    icon: "fa-pen",

                    className: "btn-primary",

                    dataAction: "edit-movement",

                    dataId: movement.id

                }),

                Components.iconButton({

                    icon: "fa-trash",

                    className: "btn-danger",

                    dataAction: "remove-movement",

                    dataId: movement.id

                })

            ])

        ])

    );

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

    const movements = this.loadData();

    const movement = movements.find(

        item => item.id === id

    );

    if (!movement) {

        return;

    }

    this.currentId = id;

    this.loadForm(movement);

    Components.openModal("movementModal");

},

/*=========================================
=            ELIMINAR
=========================================*/

remove(id) {

    console.log(

        "Eliminar movimiento:",

        id

    );

},

};