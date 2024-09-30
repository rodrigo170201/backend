
module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/reparto.controller.js");

    // Ruta para mostrar el formulario para crear un nuevo reparto (requiere el ID de la película)
    router.get('/create', controller.createReparto); // Mostrar formulario para un nuevo reparto

    // Ruta para insertar un nuevo reparto desde el formulario
    router.post('/create', controller.insertReparto); // Insertar un nuevo reparto

    
    // Endpoint para obtener personas que participan en un reparto específico
    router.get('/:id/personas', controller.getPersonasByMovieId);

    // Usamos el prefijo '/reparto' para las rutas
    app.use('/reparto', router);
};
