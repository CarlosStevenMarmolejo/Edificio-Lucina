// firebase-init.js
//
// 1. Ve a https://console.firebase.google.com y crea un proyecto (gratis).
// 2. Dentro del proyecto, ve a "Compilación" > "Firestore Database" > "Crear base de datos"
//    (elige modo "producción", región la que quieras, ej. nam5 o southamerica-east1).
// 3. Ve a "Configuración del proyecto" (ícono de engranaje) > "Tus apps" > "Web" (</>)
//    y registra una app. Copia el objeto firebaseConfig que te muestra y pégalo abajo,
//    reemplazando los valores de ejemplo.
// 4. En Firestore > Reglas, usa algo como esto para empezar (luego puedes reforzarlo):
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /edificio/{docId} {
//          allow read, write: if true;
//        }
//      }
//    }
//
//    Nota: "allow read, write: if true" permite que cualquiera con el link lea y escriba
//    los datos del edificio. Es aceptable para un proyecto pequeño y privado (el link no
//    se publica), pero si quieres más seguridad, dime y te ayudo a agregar reglas basadas
//    en Firebase Authentication en vez de las contraseñas propias de la app.

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();