/*=========================================================
=
=        EDIFICIO LUCINA
=        ESTADO GLOBAL DE LA APLICACIÓN
=
=        Desarrollado por CStM Lab
=
=========================================================*/

"use strict";

/*=========================================================
=                 ESTADO GLOBAL
=========================================================*/

const STATE = {

    /*=====================================
      Información de la aplicación
    =====================================*/

    initialized: false,

    loading: false,



    /*=====================================
      Navegación
    =====================================*/

    currentPage: "login",

    previousPage: null,



    /*=====================================
      Usuario autenticado
    =====================================*/

    session: {

        logged: false,

        role: null,

        apartmentId: null,

        name: null

    },



    /*=====================================
      Información cargada
    =====================================*/

    database: {

        apartments: [],

        movements: [],

        reports: [],

        settings: {}

    },



    /*=====================================
      Dashboard
    =====================================*/

    dashboard: {

        monthlyPortfolio: 0,

        totalPortfolio: 0,

        totalIncome: 0,

        totalExpenses: 0,

        alerts: []

    },



    /*=====================================
      Reportes
    =====================================*/

    reports: {

        selectedApartment: null,

        selectedYear: new Date().getFullYear(),

        selectedMonth: new Date().getMonth() + 1

    },



    /*=====================================
      Filtros
    =====================================*/

    filters: {

        apartment: null,

        movementType: null,

        dateFrom: null,

        dateTo: null

    }

};