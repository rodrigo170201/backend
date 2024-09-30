// routes/personas.routes.js

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/persona.controller.js");

    // Endpoint para listar todas las personas
    router.get('/', controller.listPersona);
    //Mostrar el formulario para crear persona
    router.get('/create', controller.createPersona);
    // Insertar nueva persona
    router.post('/create', controller.insertPersona);

    // Endpoint para obtener una persona por su ID(No lo utilizo )
    router.get('/:id', controller.getPersonaById);

    // Endpoint para obtener todas las películas en las que ha participado una persona
    router.get('/:id/peliculas', controller.getPeliculasByPersonaId);

    // Ruta para mostrar el formulario de edición de una persona
    router.get('/:id/edit',  controller.editPersona);  // Mostrar el formulario de edición

    // Ruta para actualizar una persona
    router.post('/:id/edit', controller.updatePersona);  // Procesar la actualización

    

    // Eliminar persona
    router.post('/:id/delete', controller.deletePersona);

    // GET: Renderiza la vista para subir la foto de la persona
    router.get('/:id/upload-photo',  controller.uploadPhotoGet);

    // POST: Procesa la subida de la foto de la persona
    router.post('/:id/upload-photo',  (req, res, next) => {
        console.log(req.files); // Verifica si el archivo se está recibiendo
        next();
    }, controller.uploadPhotoPost);



    // Usamos el prefijo '/personas' para las rutas
    app.use('/personas', router);
};