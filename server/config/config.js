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