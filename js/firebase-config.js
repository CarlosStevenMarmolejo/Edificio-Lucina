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

if (!firebase.apps.length) {

    firebase.initializeApp(firebaseConfig);

}


/*=========================================================
=             FIRESTORE
=========================================================*/

const db = firebase.firestore();




/*=========================================================
=             VERIFICACIÓN
=========================================================*/

console.log(

    `${APP_CONFIG.appName} - Firebase inicializado`

);