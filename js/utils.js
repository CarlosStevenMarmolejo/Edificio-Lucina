/*=========================================================
=        Desarrollado por CStM Lab
=========================================================*/

"use strict";

/*=========================================================
=                 UTILIDADES GENERALES
=========================================================*/

const Utils = {

    /*=========================================================
    =            FORMATEAR DINERO (COP)
    =========================================================*/

    formatCurrency(value){

        value = Number(value) || 0;

        return new Intl.NumberFormat(
            APP_CONFIG.locale,
            {
                style: "currency",
                currency: APP_CONFIG.currency,
                maximumFractionDigits: 0
            }
        ).format(value);

    },

    /*=========================================================
    =              FORMATEAR NÚMEROS
    =========================================================*/

    formatNumber(value){

        value = Number(value) || 0;

        return new Intl.NumberFormat(
            APP_CONFIG.locale
        ).format(value);

    },

    /*=========================================================
    =               FORMATEAR FECHA
    =========================================================*/

    formatDate(date){

        if(!date){

            return "";

        }

        return new Date(date).toLocaleDateString(
            APP_CONFIG.locale,
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    },

    /*=========================================================
    =          FORMATO FECHA INPUT (YYYY-MM-DD)
    =========================================================*/

    formatInputDate(date){

        if(!date){

            date = new Date();

        }

        return new Date(date)
            .toISOString()
            .split("T")[0];

    },

    /*=========================================================
    =            OBTENER FECHA ACTUAL
    =========================================================*/

    today(){

        return this.formatInputDate(new Date());

    },

    /*=========================================================
    =             GENERAR ID ÚNICO
    =========================================================*/

    generateId(prefix = "ID"){

        return prefix +
            "_" +
            Date.now() +
            "_" +
            Math.floor(Math.random() * 10000);

    },

    /*=========================================================
    =             CONVERTIR A NÚMERO
    =========================================================*/

    toNumber(value){

        value = Number(value);

        if(isNaN(value)){

            return 0;

        }

        return value;

    },

    /*=========================================================
    =            OBTENER VALOR DE INPUT
    =========================================================*/

    getValue(id){

        const element = document.getElementById(id);

        if(!element){

            return "";

        }

        return String(element.value).trim();

    },

    /*=========================================
=            HASH PASSWORD
=========================================*/

async hashPassword(password){

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hash = await crypto.subtle.digest(

        "SHA-256",

        data

    );

    return Array.from(

        new Uint8Array(hash)

    )

    .map(byte =>

        byte.toString(16).padStart(2,"0")

    )

    .join("");

},

};