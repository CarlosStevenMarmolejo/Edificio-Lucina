/*=========================================================
=
=        EDIFICIO LUCINA
=        FIREBASE
=
=        Desarrollado por CStM Lab
=
=========================================================*/

"use strict";

/*=========================================================
=            API FIREBASE
=========================================================*/

const Firebase = {

    /*=========================================
    =            Inicialización
    =========================================*/

    initialized : false,



    init(){

        if(this.initialized){

            return;

        }

        if(typeof firebase === "undefined"){

            throw new Error("Firebase no fue cargado.");

        }

        if(typeof db === "undefined"){

            throw new Error("Firestore no fue inicializado.");

        }

        this.initialized = true;

        console.log("Firebase API lista.");

    },

    /*=========================================
=            CARGAR FIREBASE
=========================================*/

async load(){

    this.init();

    const connected = await this.checkConnection();

    if(!connected){

        throw new Error(

            "No fue posible conectar con Firestore."

        );

    }

},


    /*=========================================
    =            Referencia colección
    =========================================*/

    collection(name){

        return db.collection(name);

    },



    /*=========================================
    =            Referencia documento
    =========================================*/

    document(collectionName, documentId){

        return db
            .collection(collectionName)
            .doc(documentId);

    },



    /*=========================================
    =            Verificar conexión
    =========================================*/

    async checkConnection(){

        try{

            await this
                .collection(COLLECTIONS.settings)
                .limit(1)
                .get();

            console.log("Conexión con Firestore correcta.");

            return true;

        }

        catch(error){

            console.error(error);

            return false;

        }

    },
    /*=========================================
    =            APARTAMENTOS
    =========================================*/

    async getApartments(){

        try{

            const snapshot = await this
                .collection(COLLECTIONS.apartments)
                .orderBy("name")
                .get();

            return snapshot.docs.map(doc => ({

                id : doc.id,

                ...doc.data()

            }));

        }

        catch(error){

            console.error("Error obteniendo apartamentos:", error);

            return [];

        }

    },



    /*=========================================
    =            MOVIMIENTOS
    =========================================*/

    async getMovements(){

        try{

            const snapshot = await this
                .collection(COLLECTIONS.movements)
                .orderBy("date","desc")
                .get();

            return snapshot.docs.map(doc => ({

                id : doc.id,

                ...doc.data()

            }));

        }

        catch(error){

            console.error("Error obteniendo movimientos:", error);

            return [];

        }

    },



    /*=========================================
    =            CONFIGURACIÓN
    =========================================*/

    async getSettings(){

        try{

            const document = await this
                .document(
                    COLLECTIONS.settings,
                    DOCUMENTS.configuration
                )
                .get();

            if(!document.exists){

                return null;

            }

            return document.data();

        }

        catch(error){

            console.error("Error obteniendo configuración:", error);

            return null;

        }

    },



    /*=========================================
    =            DASHBOARD
    =========================================*/

    async getDashboard(){

        try{

            const document = await this
                .document(
                    COLLECTIONS.reports,
                    DOCUMENTS.dashboard
                )
                .get();

            if(!document.exists){

                return null;

            }

            return document.data();

        }

        catch(error){

            console.error("Error obteniendo dashboard:", error);

            return null;

        }

    },
    /*=========================================
    =            GUARDAR APARTAMENTO
    =========================================*/

    async saveApartment(apartment){

        try{

            if(!apartment.id){

                apartment.id = Utils.generateId("APT");

            }

            await this
                .document(
                    COLLECTIONS.apartments,
                    apartment.id
                )
                .set(apartment);

            return apartment.id;

        }

        catch(error){

            console.error("Error guardando apartamento:", error);

            throw error;

        }

    },



    /*=========================================
    =            GUARDAR MOVIMIENTO
    =========================================*/

    async saveMovement(movement){

        try{

            if(!movement.id){

                movement.id = Utils.generateId("MOV");

            }

            await this
                .document(
                    COLLECTIONS.movements,
                    movement.id
                )
                .set(movement);

            return movement.id;

        }

        catch(error){

            console.error("Error guardando movimiento:", error);

            throw error;

        }

    },



    /*=========================================
    =            GUARDAR CONFIGURACIÓN
    =========================================*/

    async saveSettings(settings){

        try{

            await this
                .document(
                    COLLECTIONS.settings,
                    DOCUMENTS.configuration
                )
                .set(settings);

            return true;

        }

        catch(error){

            console.error("Error guardando configuración:", error);

            throw error;

        }

    },



    /*=========================================
    =            GUARDAR DASHBOARD
    =========================================*/

    async saveDashboard(data){

        try{

            await this
                .document(
                    COLLECTIONS.reports,
                    DOCUMENTS.dashboard
                )
                .set(data);

            return true;

        }

        catch(error){

            console.error("Error guardando dashboard:", error);

            throw error;

        }

    },
    /*=========================================
    =            ACTUALIZAR APARTAMENTO
    =========================================*/

    async updateApartment(id, data){

        try{

            await this
                .document(
                    COLLECTIONS.apartments,
                    id
                )
                .update(data);

            return true;

        }

        catch(error){

            console.error("Error actualizando apartamento:", error);

            throw error;

        }

    },



    /*=========================================
    =            ACTUALIZAR MOVIMIENTO
    =========================================*/

    async updateMovement(id, data){

        try{

            await this
                .document(
                    COLLECTIONS.movements,
                    id
                )
                .update(data);

            return true;

        }

        catch(error){

            console.error("Error actualizando movimiento:", error);

            throw error;

        }

    },



    /*=========================================
    =            ACTUALIZAR CONFIGURACIÓN
    =========================================*/

    async updateSettings(data){

        try{

            await this
                .document(
                    COLLECTIONS.settings,
                    DOCUMENTS.configuration
                )
                .update(data);

            return true;

        }

        catch(error){

            console.error("Error actualizando configuración:", error);

            throw error;

        }

    },



    /*=========================================
    =            ACTUALIZAR DASHBOARD
    =========================================*/

    async updateDashboard(data){

        try{

            await this
                .document(
                    COLLECTIONS.reports,
                    DOCUMENTS.dashboard
                )
                .update(data);

            return true;

        }

        catch(error){

            console.error("Error actualizando dashboard:", error);

            throw error;

        }

    },
    /*=========================================
    =            ELIMINAR APARTAMENTO
    =========================================*/

    async deleteApartment(id){

        try{

            await this
                .document(
                    COLLECTIONS.apartments,
                    id
                )
                .delete();

            return true;

        }

        catch(error){

            console.error("Error eliminando apartamento:", error);

            throw error;

        }

    },



    /*=========================================
    =            ELIMINAR MOVIMIENTO
    =========================================*/

    async deleteMovement(id){

        try{

            await this
                .document(
                    COLLECTIONS.movements,
                    id
                )
                .delete();

            return true;

        }

        catch(error){

            console.error("Error eliminando movimiento:", error);

            throw error;

        }

    },



    /*=========================================
    =            ELIMINAR REPORTE
    =========================================*/

    async deleteReport(id){

        try{

            await this
                .document(
                    COLLECTIONS.reports,
                    id
                )
                .delete();

            return true;

        }

        catch(error){

            console.error("Error eliminando reporte:", error);

            throw error;

        }

    },



    /*=========================================
    =            TRANSACCIONES
    =========================================*/

    async runTransaction(callback){

        try{

            return await db.runTransaction(callback);

        }

        catch(error){

            console.error("Error en la transacción:", error);

            throw error;

        }

    },
    /*=========================================
    =            OBTENER APARTAMENTO
    =========================================*/

    async getApartmentById(id){

        try{

            const document = await this
                .document(
                    COLLECTIONS.apartments,
                    id
                )
                .get();

            if(!document.exists){

                return null;

            }

            return {

                id : document.id,

                ...document.data()

            };

        }

        catch(error){

            console.error("Error obteniendo apartamento:", error);

            throw error;

        }

    },



    /*=========================================
    =            OBTENER MOVIMIENTO
    =========================================*/

    async getMovementById(id){

        try{

            const document = await this
                .document(
                    COLLECTIONS.movements,
                    id
                )
                .get();

            if(!document.exists){

                return null;

            }

            return {

                id : document.id,

                ...document.data()

            };

        }

        catch(error){

            console.error("Error obteniendo movimiento:", error);

            throw error;

        }

    },



    /*=========================================
    =            MOVIMIENTOS POR APARTAMENTO
    =========================================*/

    async getMovementsByApartment(apartmentId){

        try{

            const snapshot = await this
                .collection(COLLECTIONS.movements)
                .where("apartmentId","==",apartmentId)
                .orderBy("date","desc")
                .get();

            return snapshot.docs.map(doc=>({

                id:doc.id,

                ...doc.data()

            }));

        }

        catch(error){

            console.error(error);

            return [];

        }

    },



    /*=========================================
    =            MOVIMIENTOS POR FECHA
    =========================================*/

    async getMovementsByDate(start,end){

        try{

            const snapshot = await this
                .collection(COLLECTIONS.movements)
                .where("date",">=",start)
                .where("date","<=",end)
                .orderBy("date","desc")
                .get();

            return snapshot.docs.map(doc=>({

                id:doc.id,

                ...doc.data()

            }));

        }

        catch(error){

            console.error(error);

            return [];

        }

    },



    /*=========================================
    =            GASTOS POR CATEGORÍA
    =========================================*/

    async getExpensesByCategory(category){

        try{

            const snapshot = await this
                .collection(COLLECTIONS.movements)
                .where("type","==","expense")
                .where("category","==",category)
                .get();

            return snapshot.docs.map(doc=>({

                id:doc.id,

                ...doc.data()

            }));

        }

        catch(error){

            console.error(error);

            return [];

        }

    },
    /*=========================================
    =            INGRESOS TOTALES
    =========================================*/

    async getTotalIncome(){

        const movements = await this.getMovements();

        return movements
            .filter(m => m.type === "income")
            .reduce((total,m)=>total + Number(m.total || 0),0);

    },



    /*=========================================
    =            GASTOS TOTALES
    =========================================*/

    async getTotalExpenses(){

        const movements = await this.getMovements();

        return movements
            .filter(m => m.type === "expense")
            .reduce((total,m)=>total + Number(m.total || 0),0);

    },



    /*=========================================
    =            BALANCE ACTUAL
    =========================================*/

    async getCurrentBalance(){

        const income = await this.getTotalIncome();

        const expenses = await this.getTotalExpenses();

        return income - expenses;

    },



    /*=========================================
    =            CARTERA TOTAL
    =========================================*/

    async getOutstandingDebt(){

        const apartments = await this.getApartments();

        return apartments.reduce((total,apartment)=>{

            return total + Number(apartment.totalDebt || 0);

        },0);

    },



    /*=========================================
    =            CARTERA DEL MES
    =========================================*/

    async getCurrentMonthDebt(month){

        const apartments = await this.getApartments();

        return apartments.reduce((total,apartment)=>{

            if(apartment.currentMonth === month){

                total += Number(apartment.currentDebt || 0);

            }

            return total;

        },0);

    },



    /*=========================================
    =            MOROSOS
    =========================================*/

    async getDefaulters(){

        const apartments = await this.getApartments();

        return apartments.filter(apartment=>{

            return Number(apartment.monthsDue || 0) >= 3;

        });

    },



    /*=========================================
    =            DASHBOARD
    =========================================*/

    async getDashboardSummary(currentMonth){

        return {

            totalIncome :

                await this.getTotalIncome(),

            totalExpenses :

                await this.getTotalExpenses(),

            currentBalance :

                await this.getCurrentBalance(),

            totalDebt :

                await this.getOutstandingDebt(),

            currentMonthDebt :

                await this.getCurrentMonthDebt(currentMonth),

            defaulters :

                await this.getDefaulters()

        };

    },



    /*=========================================
    =            BUSCAR USUARIO
    =========================================*/

async getUser(username) {

    try {

        const snapshot = await this
            .collection(COLLECTIONS.users)
            .where("username", "==", username)
            .limit(1)
            .get();

        if (snapshot.empty) {

            return null;

        }

        const document = snapshot.docs[0];

        return {

            id: document.id,

            ...document.data()

        };

    }

    catch (error) {

        console.error("Error obteniendo usuario:", error);

        throw error;

    }

},

};
