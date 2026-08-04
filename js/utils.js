/*=========================================================
=
=        EDIFICIO LUCINA
=        FUNCIONES UTILITARIAS
=
=        Desarrollado por CStM Lab
=
=========================================================*/

"use strict";

/*=========================================================
=            FORMATEAR DINERO (COP)
=========================================================*/

function formatMoney(value){

    value = Number(value) || 0;

    return new Intl.NumberFormat(

        APP_CONFIG.locale,

        {

            style:"currency",

            currency:APP_CONFIG.currency,

            maximumFractionDigits:0

        }

    ).format(value);

}


/*=========================================================
=              FORMATEAR NÚMEROS
=========================================================*/

function formatNumber(value){

    value = Number(value) || 0;

    return new Intl.NumberFormat(

        APP_CONFIG.locale

    ).format(value);

}


/*=========================================================
=               FORMATEAR FECHA
=========================================================*/

function formatDate(date){

    if(!date) return "";

    return new Date(date).toLocaleDateString(

        APP_CONFIG.locale,

        {

            year:"numeric",

            month:"long",

            day:"numeric"

        }

    );

}


/*=========================================================
=          FORMATO FECHA INPUT (YYYY-MM-DD)
=========================================================*/

function formatInputDate(date){

    if(!date){

        date = new Date();

    }

    return new Date(date)

        .toISOString()

        .split("T")[0];

}


/*=========================================================
=            OBTENER FECHA ACTUAL
=========================================================*/

function today(){

    return formatInputDate(new Date());

}


/*=========================================================
=             GENERAR ID ÚNICO
=========================================================*/

function generateId(prefix="ID"){

    return prefix +

        "_" +

        Date.now() +

        "_" +

        Math.floor(Math.random()*10000);

}


/*=========================================================
=             CONVERTIR A NÚMERO
=========================================================*/

function toNumber(value){

    value = Number(value);

    if(isNaN(value)){

        return 0;

    }

    return value;

}