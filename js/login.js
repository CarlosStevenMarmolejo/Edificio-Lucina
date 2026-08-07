/*
=========================================
LOGIN.JS
Sistema de Autenticación
Edificio Lucina
CStM Lab
=========================================
*/

"use strict";

const Login = {

    /*=========================================
    =            RENDER
    =========================================*/

    render() {

        return `

            <div class="login-page">

                ${this.card()}

            </div>

        `;

    },



    /*=========================================
    =            TARJETA
    =========================================*/

    card() {

        return `

            <div class="login-card">

                ${this.logo()}

                ${this.form()}

            </div>

        `;

    },



    /*=========================================
    =            LOGO
    =========================================*/

    logo() {

        return `

            <div class="login-logo">

                <img
                    src="assets/Logo.png"
                    alt="Edificio Lucina">

                <h1>

                    Edificio Lucina

                </h1>

                <p>

                    Sistema de Administración

                </p>

            </div>

        `;

    },



    /*=========================================
    =            FORMULARIO
    =========================================*/

    form() {

        return `

            <div class="login-form">

                ${Components.input({

                    id: "login-user",

                    placeholder: "Usuario"

                })}

                ${Components.input({

                    id: "login-password",

                    type: "password",

                    placeholder: "Contraseña"

                })}

                ${Components.button({

                    text: "Iniciar Sesión",

                    icon: "fa-right-to-bracket",

                    className: "btn-primary w-100",

                    dataAction: "login"

                })}

            </div>

        `;

    },



    /*=========================================
    =            MOSTRAR
    =========================================*/

    show() {

        const app = document.getElementById(

    "app"

);

if (!app) {

    return;

}

app.innerHTML = this.render();

    },

    /*=========================================
=            AUTENTICAR
=========================================*/

async authenticate() {

    const username = Utils.getValue(

        "login-user"

    );

    const password = Utils.getValue(

        "login-password"

    );

    if (!username || !password) {

        alert(

            "Debe ingresar usuario y contraseña."

        );

        return;

    }

    try {

        const user = await Firebase.getUser(

            username

        );

        if (!user) {

            alert(

                "Usuario no encontrado."

            );

            return;

        }

        const passwordHash = await Utils.hashPassword(password);

if (user.password !== passwordHash) {

    alert("Contraseña incorrecta.");

    return;

}

        STATE.session.logged = true;

        STATE.session.name = user.name;

        STATE.session.role = user.role;

        STATE.session.apartmentId = user.apartmentId;

        App.render();

    }

    catch(error){

        console.error(error);

        alert(

            "Error iniciando sesión."

        );

    }

},

/*=========================================
=            CERRAR SESIÓN
=========================================*/

logout() {

    STATE.session.logged = false;

    STATE.session.name = null;

    STATE.session.role = null;

    STATE.session.apartmentId = null;

    STATE.currentView = "dashboard";

    this.show();

},

};