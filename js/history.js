/*
=========================================
HISTORY.JS
Historial de movimientos
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const History = {

    /*=========================================
    =            Render principal
    =========================================*/

    render() {

        return Components.layout({

            menu: CONFIG.MENU,

            active: "history",

            title: "Historial",

            subtitle: "Consulta y búsqueda de movimientos",

            content: this.content()

        });

    },



    /*=========================================
    =            Contenido
    =========================================*/

    content() {

        return `

            ${this.filters()}

            ${this.table()}

        `;

    },

    /*=========================================
=            FILTROS
=========================================*/

filters() {

    return Components.section({

        title: "Filtros",

        content: `

            <div class="history-filters">

                ${Components.input({

    id: "history-search",

    placeholder: "Buscar...",

    dataChange: "history-search"

})

            </div>

        `

    });

},

/*=========================================
=            TABLA
=========================================*/

table() {

    return Components.section({

        title: "Historial",

        content:

            Components.table({

                headers: [

                    "Fecha",

                    "Unidad",

                    "Tipo",

                    "Concepto",

                    "Valor"

                ],

rows: this.getRows()

            })

    });

},

/*=========================================
=            CARGAR DATOS
=========================================*/

loadData() {

    return STATE.movements || [];

},

/*=========================================
=            APLICAR FILTROS
=========================================*/

applyFilters(data) {

    const searchText = Utils.getValue(

        "history-search"

    );

    data = this.search(

        data,

        searchText

    );

    data = this.filterByDate(

        data

    );

    data = this.filterByApartment(

        data

    );

    data = this.filterByType(

        data

    );

    return data;

},

/*=========================================
=            BUSCAR
=========================================*/

search(data, text) {

    if (!text) {

        return data;

    }

    const query = text.toLowerCase();

    return data.filter(item =>

        (item.concept || "")

            .toLowerCase()

            .includes(query)

        ||

        (item.unit || "")

            .toLowerCase()

            .includes(query)

        ||

        (item.type || "")

            .toLowerCase()

            .includes(query)

    );

},

/*=========================================
=            FILTRAR POR FECHA
=========================================*/

filterByDate(data) {

    return data;

},

/*=========================================
=            FILTRAR POR APARTAMENTO
=========================================*/

filterByApartment(data) {

    return data;

},

/*=========================================
=            FILTRAR POR TIPO
=========================================*/

filterByType(data) {

    return data;

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

/*=========================================
=            FILAS DE LA TABLA
=========================================*/

getRows() {

    const data = this.applyFilters(

        this.loadData()

    );

    if (!data.length) {

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

    return data.map(item =>

        Components.tableRow([

            item.date,

            item.unit || "-",

            item.type,

            item.concept,

            formatCurrency(

                item.value

            )

        ])

    );

},



};