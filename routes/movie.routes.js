module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/movie.controller.js");

    // Endpoint para listar todas las películas sin reparto
    router.get('/', controller.listMovies);

    // Mostrar el formulario para crear una nueva película
    router.get('/create', controller.createMovie);

    // Insertar nueva película
    router.post('/create', controller.insertMovie);

    // Endpoint para obtener detalle de una pelicula
    router.get('/:id', controller.getMovieById);

    // Ruta para mostrar el formulario de edición de película
    router.get('/:id/edit', controller.editMovie);

    // Ruta para actualizar una película por su ID
    router.post('/:id/edit', controller.updateMovie);

    // Endpoint para eliminar una película por su ID
    router.post('/:id/delete', controller.deleteMovie);

    // GET: Renderiza la vista para subir la foto de la película
    router.get('/:id/upload-photo', controller.uploadPhotoGet);

    // POST: Procesa la subida de la foto de la película
    router.post('/:id/upload-photo', (req, res, next) => {
        console.log(req.files); // Verifica si el archivo se está recibiendo correctamente
        next();
    }, controller.uploadPhotoPost);

    // Usamos el prefijo '/movies' para las rutas
    app.use('/movies', router);
};
