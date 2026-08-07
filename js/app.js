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

    if(!STATE.session.logged){

    Login.show();

    return;

}

if(!STATE.currentView){

    STATE.currentView = "dashboard";

}

this.loadModule(STATE.currentView);

},

/*=========================================
=            NAVEGAR
=========================================*/

navigate(view) {

    if (STATE.currentView === view) {

        return;

    }

    STATE.previousView = STATE.currentView;

    STATE.currentView = view;

    this.loadModule(view);

}

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

            Dashboard.render();

            break;

        case "apartments":

            Apartments.render();

            break;

        case "movements":

            Movements.render();

            break;

        case "history":

            History.render();

            break;

        case "reports":

            Reports.render();

            break;

        case "settings":

            Settings.render();

            break;

        default:

            Dashboard.render();

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