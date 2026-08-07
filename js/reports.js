/*
=========================================
REPORTS.JS
Reportes
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const Reports = {

    chartInstance: null,

    /*=========================================
    =            RENDER PRINCIPAL
    =========================================*/

    render() {

        return Components.layout({

            menu: APP_CONFIG.menu,

            active: "reports",

            title: "Reportes",

            subtitle: "Indicadores y estadísticas",

            content: this.content()

        });

    },



    /*=========================================
    =            CONTENIDO
    =========================================*/

    content() {

        return `

            ${this.toolbar()}
        
            ${this.summary()}

            ${this.chart()}

            ${this.table()}

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

                text: "Exportar PDF",

                icon: "fa-file-pdf",

                className: "btn-danger",

                dataAction: "reports-pdf"

            }),

            Components.button({

                text: "Exportar Excel",

                icon: "fa-file-excel",

                className: "btn-success",

                dataAction: "reports-excel"

            })

        ])

});

},  

    /*=========================================
=            RESUMEN
=========================================*/

summary() {

    const summary = this.buildSummary();

    return Components.section({

        title: "Resumen",

        content:

            Components.cardsGrid([

                Components.metricCard({

                    title: "Movimientos",

                    value: summary.totalMovements,

                    icon: "fa-list",

                    color: "primary"

                }),

                Components.metricCard({

                    title: "Ingresos",

                    value: formatCurrency(

                        summary.totalIncome

                    ),

                    icon: "fa-arrow-trend-up",

                    color: "success"

                }),

                Components.metricCard({

                    title: "Gastos",

                    value: formatCurrency(

                        summary.totalExpenses

                    ),

                    icon: "fa-arrow-trend-down",

                    color: "danger"

                }),

                Components.metricCard({

                    title: "Balance",

                    value: formatCurrency(

                        summary.balance

                    ),

                    icon: "fa-scale-balanced",

                    color: "warning"

                })

            ])

    });

},

/*=========================================
=            GRÁFICA
=========================================*/

chart() {

    return Components.section({

        title: "Comportamiento",

        content: `

            <div class="reports-chart">

                <canvas id="reports-chart"></canvas>

            </div>

        `

    });

},

/*=========================================
=            TABLA
=========================================*/

table() {

    return Components.section({

        title: "Reporte",

        content:

            Components.table({

                headers: [

                    "Concepto",

                    "Valor"

                ],

                rows: this.buildTable()

            })

    });

},

/*=========================================
=            CARGAR DATOS
=========================================*/

loadData() {

    return STATE.database.movements || [];

},

/*=========================================
=            FILTRAR DATOS
=========================================*/

filterData(data) {

    return data;

},

/*=========================================
=            EXPORTAR PDF
=========================================*/

exportPDF() {

    console.log(

        "Exportar PDF"

    );

},

/*=========================================
=            EXPORTAR EXCEL
=========================================*/

exportExcel() {

    console.log(

        "Exportar Excel"

    );

},

/*=========================================
=            RESUMEN
=========================================*/

buildSummary() {

    const data = this.filterData(

    this.loadData()

     );

    const summary = {

        totalMovements: data.length,

        totalIncome: 0,

        totalExpenses: 0,

        balance: 0

    };

    data.forEach(item => {

        const value = Number(item.value) || 0;

        if (item.type === "gasto") {

            summary.totalExpenses += value;

        } else {

            summary.totalIncome += value;

        }

    });

    summary.balance =

        summary.totalIncome -

        summary.totalExpenses;

    return summary;

},

/*=========================================
=            TABLA
=========================================*/

buildTable() {

    const summary = this.buildSummary();

    return [

        Components.tableRow([

            "Total movimientos",

            summary.totalMovements

        ]),

        Components.tableRow([

            "Total ingresos",

            formatCurrency(

                summary.totalIncome

            )

        ]),

        Components.tableRow([

            "Total gastos",

            formatCurrency(

                summary.totalExpenses

            )

        ]),

        Components.tableRow([

            "Balance",

            formatCurrency(

                summary.balance

            )

        ])

    ];

},

/*=========================================
=            DATOS DE LA GRÁFICA
=========================================*/

buildChart() {

    const summary = this.buildSummary();

    return {

        labels: [

            "Ingresos",

            "Gastos"

        ],

        values: [

            summary.totalIncome,

            summary.totalExpenses

        ]

    };

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

    this.renderChart();

},

/*=========================================
=            RENDERIZAR GRÁFICA
=========================================*/

renderChart() {

    const canvas = document.getElementById(

        "reports-chart"

    );

    if (!canvas) {

        return;

    }

    if (this.chartInstance) {

        this.chartInstance.destroy();

    }

    const chart = this.buildChart();

    this.chartInstance = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: chart.labels,

            datasets: [{

                data: chart.values

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false

        }

    });

},

};