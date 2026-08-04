/*
=========================================
APP.JS
Aplicación principal
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const App = {

    /*=========================================
    =            INICIALIZAR
    =========================================*/

    async init() {

        await Firebase.load();

        Events.init();

        STATE.currentView = "dashboard";

        this.render();

    },

/*=========================================
=            RENDER
=========================================*/

render() {

    this.loadModule(

        STATE.currentView ||

        "dashboard"

    );

},

/*=========================================
=            NAVEGAR
=========================================*/

navigate(view) {

    if (STATE.currentView === view) {

        return;

    }

    STATE.currentView = view;

    this.loadModule(view);

},

/*=========================================
=            ACTUALIZAR
=========================================*/

refresh() {

    this.render();

},

/*=========================================
=            DESTRUIR VISTA
=========================================*/

destroy() {

    const app = document.getElementById(

        "app"

    );

    if (!app) {

        return;

    }

    app.innerHTML = "";

},

/*=========================================
=            CARGAR MÓDULO
=========================================*/

loadModule(view) {

    switch(view){

        case "dashboard":

            Dashboard.refresh();

            break;

        case "apartments":

            Apartments.refresh();

            break;

        case "movements":

            Movements.refresh();

            break;

        case "history":

            History.refresh();

            break;

        case "reports":

            Reports.refresh();

            break;

        case "settings":

            Settings.refresh();

            break;

        default:

            Dashboard.refresh();

            break;

    }

},

};

/*=========================================
=            INICIO
=========================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => App.init()

);