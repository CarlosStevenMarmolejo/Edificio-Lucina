/*
=========================================
EVENTS.JS
Administración centralizada de eventos
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const Events = {

        /*=========================================
    =            REGISTRO DE ACCIONES
    =========================================*/

    actions: {},

    changeActions: {},
    /*=========================================
    =            Inicializar eventos
    =========================================*/

init() {

    this.registerActions();

    this.registerChangeActions();

    this.registerClicks();

    this.registerChanges();

    this.registerInputs();

    this.registerKeyboard();

},

/*=========================================
=            REGISTRAR ACCIONES
=========================================*/

registerActions() {

    this.actions = {

        navigate: this.navigate.bind(this),

        "close-modal": this.closeModal.bind(this),

        "confirm-modal": this.confirmModal.bind(this),

        "new-apartment": this.newApartment.bind(this),

        "save-apartment": this.saveApartment.bind(this),

        "edit-apartment": this.editApartment.bind(this),

        "remove-apartment": this.removeApartment.bind(this),

        "new-movement": this.newMovement.bind(this),

        "save-movement": this.saveMovement.bind(this),

        "edit-movement": this.editMovement.bind(this),

        "remove-movement": this.removeMovement.bind(this),

        "reports-pdf" : this.reportsPDF.bind(this),

        "reports-excel" : this.reportsExcel.bind(this),

        "save-settings": this.saveSettings.bind(this),

        "login": this.login.bind(this),

        "logout": this.logout.bind(this),

    };

    this.changeActions = {

    };

},


    /*=========================================
    =            Clicks
    =========================================*/

    registerClicks() {

        document.addEventListener(

            "click",

            this.handleClick.bind(this)

        );

    },



    /*=========================================
    =            Changes
    =========================================*/

    registerChanges() {

        document.addEventListener(

            "change",

            this.handleChange.bind(this)

        );

    },



    /*=========================================
    =            Inputs
    =========================================*/

    registerInputs() {

        document.addEventListener(

            "input",

            this.handleInput.bind(this)

        );

    },



    /*=========================================
    =            Teclado
    =========================================*/

    registerKeyboard() {

        document.addEventListener(

            "keydown",

            this.handleKeyboard.bind(this)

        );

    },



    /*=========================================
    =            Handlers
    =========================================*/

/*=========================================
=            CLICK HANDLER
=========================================*/

/*=========================================
=            CLICK HANDLER
=========================================*/

handleClick(event){

    const element = event.target.closest("[data-action]");

    if(!element){

        return;

    }

    const action = element.dataset.action;

    const handler = this.actions[action];

    if(!handler){

        console.warn(

            `Acción no registrada: ${action}`

        );

        return;

    }

    handler(element,event);

},

/*=========================================
=            NAVEGACIÓN
=========================================*/

navigate(element) {

    const page = element.dataset.page;

    if (!page) {

        return;

    }

    App.navigate(page);

},


/*=========================================
=            CERRAR MODAL
=========================================*/

closeModal() {

    Components.closeModal("appModal");

},

/*=========================================
=            CONFIRMAR MODAL
=========================================*/

confirmModal() {

    console.log(

        "Confirmación pendiente de implementar."

    );

},

/*=========================================
=            NUEVO APARTAMENTO
=========================================*/

newApartment() {

    Apartments.new();

},

/*=========================================
=            GUARDAR APARTAMENTO
=========================================*/

saveApartment() {

    Apartments.save();

},

/*=========================================
=            EDITAR APARTAMENTO
=========================================*/

editApartment(element) {

    Apartments.edit(

        element.dataset.id

    );

},

/*=========================================
=            ELIMINAR APARTAMENTO
=========================================*/

removeApartment(element) {

    Apartments.remove(

        element.dataset.id

    );

},

/*=========================================
=            NUEVO MOVIMIENTO
=========================================*/

newMovement() {

    Movements.new();

},

/*=========================================
=            GUARDAR MOVIMIENTO
=========================================*/

saveMovement() {

    Movements.save();

},

/*=========================================
=            EDITAR MOVIMIENTO
=========================================*/

editMovement(element) {

    Movements.edit(

        element.dataset.id

    );

},

/*=========================================
=            ELIMINAR MOVIMIENTO
=========================================*/

removeMovement(element) {

    Movements.remove(

        element.dataset.id

    );

},

/*=========================================
=            REPORTES PDF
=========================================*/

reportsPDF() {

    Reports.exportPDF();

},

/*=========================================
=            REPORTES EXCEL
=========================================*/

reportsExcel() {

    Reports.exportExcel();

},

/*=========================================
=            GUARDAR CONFIGURACIÓN
=========================================*/

saveSettings() {

    Settings.save();

},

/*=========================================
=            LOGIN
=========================================*/

login() {

    Login.authenticate();

},

/*=========================================
=            LOGOUT
=========================================*/

logout() {

    Login.logout();

},

/*=========================================
=            BÚSQUEDA HISTORIAL
=========================================*/

historySearch() {

    History.refresh();

},

/*=========================================
=            CHANGE HANDLER
=========================================*/

handleChange(event){

    const element = event.target;

    const action = element.dataset.change;

    if(!action){

        return;

    }

    const handler = this.changeActions[action];

    if(!handler){

        console.warn(

            `Cambio no registrado: ${action}`

        );

        return;

    }

    handler(element,event);

},

/*=========================================
=            REGISTRAR CAMBIOS
=========================================*/

registerChangeActions(){

    this.changeActions = {

        // Aquí registraremos
        // todos los cambios del sistema.
         "history-search": this.historySearch.bind(this)

    };

},



/*=========================================
=            INPUT HANDLER
=========================================*/

handleInput(event) {

    const element = event.target;

    const action = element.dataset.input;

    if (!action) {

        return;

    }

    switch (action) {

        default:

            console.warn(

                `Input no registrado: ${action}`

            );

    }

},

/*=========================================
=            BUSCADOR
=========================================*/

search(element) {

    console.log(

        "Buscar:",

        element.value

    );

},

/*=========================================
=            FILTRO
=========================================*/

filter(element) {

    console.log(

        "Filtrar:",

        element.value

    );

},

/*=========================================
=            KEYBOARD HANDLER
=========================================*/

handleKeyboard(event) {

    switch (event.key) {

        case "Escape":

            Components.closeModal("appModal");

            break;

        case "Enter":

            this.enterPressed(event);

            break;

        default:

            break;

    }

},

/*=========================================
=            TECLA ENTER
=========================================*/

enterPressed(event) {

    console.log(

        "Enter presionado"

    );

},

/*=========================================
=            TECLA ESCAPE
=========================================*/

escapePressed() {

    this.closeModal();

},

};