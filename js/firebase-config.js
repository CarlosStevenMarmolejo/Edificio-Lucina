/*=========================================================
=
=        EDIFICIO LUCINA
=        FIREBASE CONFIG
=
=        Desarrollado por CStM Lab
=
=========================================================*/

"use strict";

/*=========================================================
=             CONFIGURACIÓN DE FIREBASE
=========================================================*/

/*
    Reemplaza estos valores por los de tu proyecto
    Firebase cuando lo conectemos.
*/

const firebaseConfig = {

    apiKey: "",

    authDomain: "",

    projectId: "",

    storageBucket: "",

    messagingSenderId: "",

    appId: ""

};



/*=========================================================
=             INICIALIZAR FIREBASE
=========================================================*/

firebase.initializeApp(firebaseConfig);



/*=========================================================
=             FIRESTORE
=========================================================*/

const db = firebase.firestore();



/*=========================================================
=             COLECCIONES
=========================================================*/

const COLLECTIONS = {

    apartments : "apartments",

    movements : "movements",

    reports : "reports",

    settings : "settings",

    users : "users"

};



/*=========================================================
=             DOCUMENTOS PRINCIPALES
=========================================================*/

const DOCUMENTS = {

    dashboard : "dashboard",

    configuration : "configuration"

};



/*=========================================================
=             VERIFICACIÓN
=========================================================*/

console.log(

    `${APP_CONFIG.appName} - Firebase inicializado`

);