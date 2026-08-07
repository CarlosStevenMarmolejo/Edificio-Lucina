/*
=========================================
DASHBOARD.JS
Panel principal del administrador
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const Dashboard = {

        /*=========================================
    =            DATOS DEL DASHBOARD
    =========================================*/

    data: {

        totalCollected: 0,

        totalDebt: 0,

        apartments: 0,

        expenses: 0

    },

    /*=========================================
    =            Render principal
    =========================================*/

    render() {

     this.loadData();

     return Components.layout({

        menu: CONFIG.MENU,

        active: "dashboard",

        title: "Dashboard",

        subtitle: "Resumen general",

        content: this.content()

    });

},

    /*=========================================
=            CARGAR DATOS
=========================================*/

loadData() {

    this.data.totalCollected = 0;

    this.data.totalDebt = 0;

    this.data.apartments = 0;

    this.data.expenses = 0;

},

/*=========================================
=            ACTUALIZAR DASHBOARD
=========================================*/

refresh() {

    const app = document.getElementById("app");

    if (!app) {

        return;

    }

    app.innerHTML = this.render();

},

/*=========================================
=            ACTUALIZAR TARJETAS
=========================================*/

updateCards() {

    this.loadData();

    this.refresh();

},

/*=========================================
=            ACTUALIZAR TABLAS
=========================================*/

updateTables() {

    this.refresh();

},

/*=========================================
=            CONTENIDO
=========================================*/

content() {

    return `

        ${this.summaryCards()}

        ${this.pendingPayments()}

        ${this.expenses()}

        ${this.recentMovements()}

    `;

},

/*=========================================
=            TARJETAS RESUMEN
=========================================*/

summaryCards() {

    return Components.cardsGrid([

        Components.metricCard({

            title: "Recaudado",

            value: formatMoney(

                this.data.totalCollected

            ),

            icon: "fa-wallet",

            color: "success"

        }),

        Components.metricCard({

            title: "Cartera",

            value: formatMoney(

                this.data.totalDebt

            ),

            icon: "fa-file-invoice-dollar",

            color: "danger"

        }),

        Components.metricCard({

            title: "Apartamentos",

            value: this.data.apartments,

            icon: "fa-building",

            color: "primary"

        }),

        Components.metricCard({

            title: "Gastos",

            value: formatMoney(

                this.data.expenses

            ),

            icon: "fa-receipt",

            color: "warning"

        })

    ]);

},

/*=========================================
=            ACTIVIDAD RECIENTE
=========================================*/

recentMovements() {

    return Components.section({

        title: "Actividad reciente",

        content:

            Components.table({

                headers: [

                    "Fecha",

                    "Tipo",

                    "Descripción",

                    "Valor"

                ],

                rows: [

                    Components.tableRow([

                        "Sin registros",

                        "-",

                        "-",

                        "-"

                    ])

                ]

            })

    });

},

/*=========================================
=            CARTERA PENDIENTE
=========================================*/

pendingPayments() {

    return Components.section({

        title: "Apartamentos con saldo pendiente",

        content:

            Components.table({

                headers: [

                    "Unidad",

                    "Propietario",

                    "Saldo",

                    "Estado"

                ],

                rows: [

                    Components.tableRow([

                        "Sin registros",

                        "-",

                        "-",

                        Components.neutral("Sin información")

                    ])

                ]

            })

    });

},

/*=========================================
=            GASTOS RECIENTES
=========================================*/

expenses() {

    return Components.section({

        title: "Gastos recientes",

        content:

            Components.table({

                headers: [

                    "Fecha",

                    "Concepto",

                    "Categoría",

                    "Valor"

                ],

                rows: [

                    Components.tableRow([

                        "Sin registros",

                        "-",

                        "-",

                        "-"

                    ])

                ]

            })

    });

},

};