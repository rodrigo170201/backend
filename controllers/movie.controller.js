const db = require("../models");
const { sendError500 } = require("../utils/request.utils");

// Endpoint para listar solo las películas 
exports.listMovies = async (req, res) => {
    try {
        const movies = await db.movies.findAll();
        res.render('movies/list', { movies });
    } catch (error) {
        sendError500(res, error);
    }
};


// Endpoint para obtener una película por su ID junto con su reparto completo
exports.getMovieById = async (req, res) => {
    const id = req.params.id;

    try {
        const movie = await db.movies.findByPk(id, {
            include: [
                {
                    model: db.reparto,
                    as: "reparto",
                    include: [
                        {
                            model: db.personas,
                            as: "persona"
                        }
                    ]
                }
            ]
        });

        if (!movie) {
            return res.status(404).json({ message: "Película no encontrada by id" });
        }

        //res.json(movie);
        res.render("movies/detalle.ejs",{movie});
    } catch (error) {
        sendError500(res, error);
    }
};


// Mostrar el formulario para crear una nueva película
exports.createMovie = async function (req, res) {
    res.render('movies/form.ejs', { movie: null, errors: null });
};

// Crear nueva película
exports.insertMovie = async (req, res) => {
    const { nombre, sinopsis, fechaLanzamiento, calificacion, linkTrailer } = req.body;

    // Validar que todos los campos obligatorios estén presentes
    if (!nombre || !sinopsis || !fechaLanzamiento || !calificacion || !linkTrailer) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Validar que la calificación sea un número entre 0 y 10
    const calificacionNumero = parseFloat(calificacion);
    if (isNaN(calificacionNumero) || calificacionNumero < 0 || calificacionNumero > 10) {
        return res.status(400).json({ message: "La calificación debe ser un número entre 0 y 10" });
    }

    try {
        // Crear la nueva película en la base de datos
        await db.movies.create({
            nombre,
            sinopsis,
            fechaLanzamiento,
            calificacion: calificacionNumero,
            linkTrailer // Incluir el nuevo campo
        });

        // Redirigir a la lista de películas
        res.redirect('/movies');
    } catch (error) {
        console.error('Error al crear película:', error);
        res.render('movies/form.ejs', { movie: req.body, errors: error });
    }
};


// Endpoint para ingresar al formulario para editar una película
exports.editMovie = function (req, res) {
    const { id } = req.params;

    // Busca la película por su ID
    db.movies.findByPk(id)
        .then(movie => {
            if (movie) {
                // Renderiza la vista del formulario de edición con los datos de la película
                res.render('movies/form.ejs', { movie: movie, errors: null });
            } else {
                res.status(404).send("Película no encontrada");
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error al obtener la película");
        });
};

// Actualizar película
exports.updateMovie = async (req, res) => {
    const id = req.params.id;
    const { nombre, sinopsis, fechaLanzamiento, calificacion, linkTrailer } = req.body;

    try {
        const pelicula = await db.movies.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        // Actualizar los campos
        pelicula.nombre = nombre || pelicula.nombre;
        pelicula.sinopsis = sinopsis || pelicula.sinopsis;
        pelicula.fechaLanzamiento = fechaLanzamiento || pelicula.fechaLanzamiento;
        pelicula.calificacion = parseFloat(calificacion) || pelicula.calificacion;
        pelicula.linkTrailer = linkTrailer || pelicula.linkTrailer;

        await pelicula.save();

        res.redirect(`/movies`);
    } catch (error) {
        sendError500(res, error);
    }
};



// Eliminar una película 
exports.deleteMovie = async (req, res) => {
    const id = req.params.id;

    try {
        const pelicula = await db.movies.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        await pelicula.destroy();  // Eliminar la película
        
        // Redirigir a la página de personas después de la eliminación
        res.redirect('/movies');  // Redirigir a la ruta /personas
    } catch (error) {
        sendError500(res, error);
    }
};

// GET: Renderiza la vista para subir la foto de la película
exports.uploadPhotoGet = async function (req, res) {
    const id = req.params.id;
    try {
        const movie = await db.movies.findByPk(id); // Asumiendo que tu modelo de películas se llama 'movies'
        if (!movie) {
            return res.status(404).send('Película no encontrada');
        }
        res.render('movies/uploadPhoto', { movie: movie, errors: null }); // Renderiza la vista 'uploadPhoto' para la película
    } catch (error) {
        console.error('Error al obtener la película:', error);
        res.status(500).send('Error al obtener la película');
    }
};

// POST: Procesa la subida de la foto de la película
exports.uploadPhotoPost = async function (req, res) {
    try {
        const id = req.params.id;
        const movie = await db.movies.findByPk(id);

        console.log(req.files); // Verifica si el archivo se está recibiendo correctamente

        if (!req.files || !req.files.photo) {
            res.render('movies/uploadPhoto.ejs', { errors: { message: 'Debe seleccionar una imagen' }, movie });
            return;
        }

        const image = req.files.photo;
        // eslint-disable-next-line no-undef
        const path = __dirname + '/../public/images/movies/' + movie.id + '.jpg'; // Ruta a la carpeta de imágenes de películas

        image.mv(path, function (err) {
            if (err) {
                console.log(err);
                res.render('movies/uploadPhoto.ejs', { errors: { message: 'Error al subir la imagen' }, movie });
                return;
            }
            res.redirect('/movies'); // Redirige a la lista de películas después de subir la imagen
        });

    } catch (error) {
        console.error('Error al procesar la carga de la imagen:', error);
        res.status(500).send('Error al procesar la carga de la imagen');
    }
};


