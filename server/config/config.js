/*Puerto global se está asignando a process.env.PORT si estoy en un servidor remoto
y se le asigna el que este libre o el puerto 3000 cuando el process.env.PORT no exista como en un servidor local
*/
/**********
 * Puerto global
 **********/

process.env.PORT = process.env.PORT || 3000;

/********************
 * Duración del token
 ********************/
//h = Horas
process.env.DURATION_TOKEN = '12h';

/********************
 * SEED
 ********************/

process.env.SEED = process.env.SEED || 'seed';

/********************
 * ENVIRONMENT
 ********************/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

/********************
 * DB_URI
 ********************/
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI
};

process.env.URLDB = urlDB;

/********************
 * GOOGLE CLIENT ID
 ********************/
process.env.CLIENT_ID = process.env.CLIENT_ID || '286373470004-eqapiu9qdqb5c2ieo8ltsmte89ab7lro.apps.googleusercontent.com';