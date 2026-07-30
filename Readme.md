# Edificio Lucina — Administración

App web para administrar la propiedad horizontal del Edificio Lucina: cuotas de
administración, cuota extra, gastos y reportes consolidados. Pensada para que
el administrador gestione todo y cada propietario consulte su propio estado
de cuenta.

Sitio estático (HTML + CSS + JavaScript plano, sin build step) con
[Firebase Firestore](https://firebase.google.com/docs/firestore) como base de
datos, así que se puede hospedar gratis en GitHub Pages.

## Estructura del proyecto

```
├── assets/
│   └── Logo.png          # Logo del edificio
├── app-data.js            # Constantes y datos iniciales (semilla)
├── app.js                 # Lógica de la aplicación
├── firebase-init.js       # Configuración de Firebase (debes completarla)
├── index.html              # Punto de entrada
├── styles.css               # Estilos
└── README.md
```

## Configuración (una sola vez)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y
   crea un proyecto nuevo (gratis).
2. Dentro del proyecto: **Compilación → Firestore Database → Crear base de
   datos** (modo producción, la región que prefieras).
3. **Configuración del proyecto** (ícono de engranaje) → **Tus apps** → ícono
   web `</>` → registra una app. Copia el objeto `firebaseConfig` que te
   muestra.
4. Pega esos valores en `firebase-init.js`, reemplazando los valores de
   ejemplo (`TU_API_KEY`, `TU_PROYECTO`, etc.).
5. En **Firestore → Reglas**, pega esto para empezar:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /edificio/{docId} {
         allow read, write: if true;
       }
     }
   }
   ```

   Esto permite que cualquiera con el enlace de la app lea y escriba los
   datos del edificio (protegido solo por las contraseñas propias de la
   app, no por Firebase Authentication). Es razonable para un proyecto
   pequeño y privado. Si más adelante quieres reglas más estrictas
   (por ejemplo, ligadas a Firebase Authentication), es un cambio que se
   puede hacer después sin rehacer la app.

## Primer uso

La primera vez que se abre la app, si no hay datos en Firestore, se cargan
automáticamente los datos iniciales tomados del Excel original (cuotas de
administración, cuota extra y gastos de enero a junio). A partir de ahí,
todos los cambios se guardan en Firestore.

- El **administrador** crea su contraseña la primera vez que entra.
- Cada **propietario** elige su unidad y crea su propia contraseña la
  primera vez que entra.
- El administrador puede cambiar su propia contraseña y **restablecer** la
  de cualquier propietario desde la pestaña "Seguridad".

## Desplegar en GitHub Pages

1. Crea un repositorio en GitHub y sube todos estos archivos (manteniendo la
   carpeta `assets/`).
2. Ve a **Settings → Pages**.
3. En "Source" elige la rama `main` y la carpeta `/ (root)`.
4. Guarda. GitHub te dará una URL como
   `https://tu-usuario.github.io/tu-repositorio/`.
5. Comparte ese enlace con el administrador y los propietarios.

## Funcionalidades

- **Resumen**: recaudo total, gastos, cartera pendiente, avance de la cuota
  extra.
- **Cuotas**: tabla editable de pagos mensuales por unidad.
- **Cuota extra**: seguimiento de lo que debe y ha abonado cada unidad.
- **Gastos**: registrar, filtrar por mes y eliminar gastos, clasificados por
  categoría.
- **Consolidado**: gráfico y tabla de gastos por categoría y mes.
- **Seguridad**: cambiar la contraseña del administrador y restablecer las
  de los propietarios.
- **Vista de propietario**: cada unidad ve solo su propio historial de pagos
  y saldos.

## Notas

- Los valores de "abonado" de la cuota extra en los datos iniciales se
  estimaron a partir de columnas del Excel original que estaban un poco
  desalineadas. Revísalos en la pestaña "Cuota extra" y ajústalos si hace
  falta.
- Las contraseñas se guardan como hash SHA-256 (con un "pepper" fijo en el
  código), nunca en texto plano. No es infraestructura de grado bancario,
  pero es razonable para un edificio con datos privados que no se publican.
