
const db = require("../models");
const { sendError500 } = require("../utils/request.utils");

// Mostrar el formulario para crear un nuevo reparto
exports.createReparto = async (req, res) => {
    try {
        // Obtener la lista de películas desde la base de datos
        const movies = await db.movies.findAll();
        
        // Obtener la lista de personas desde la base de datos
        const personas = await db.personas.findAll();

        // Renderizar la vista y pasar las películas, personas y cualquier otro dato necesario
        res.render('reparto/form.ejs', { movies, personas, reparto: null, errors: null });
    } catch (error) {
        console.error('Error en createReparto:', error);
        res.status(500).send('Error al cargar el formulario de reparto');
    }
};

// Crear nuevo reparto
exports.insertReparto = async (req, res) => {
    const { movieId, personaId, esDirector } = req.body; // Extraer datos del cuerpo de la solicitud

    // Validar la solicitud: todos los campos son obligatorios
    if (!movieId || !personaId) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Validar si la persona ya está en el reparto de la misma película (como actor o director)
        const existingReparto = await db.reparto.findOne({
            where: {
                movieId: movieId,
                personaId: personaId
            }
        });

        if (existingReparto) {
            return res.status(400).json({ message: "Esta persona ya está asociada a esta película." });
        }

        // Validar si se intenta agregar un director
        if (esDirector) {
            const existingDirector = await db.reparto.findOne({
                where: {
                    movieId: movieId,
                    esDirector: true
                }
            });
            if (existingDirector) {
                return res.status(400).json({ message: "Ya existe un director asociado a esta película." });
            }
        }

        // Crear el nuevo reparto en la base de datos
        await db.reparto.create({
            movieId,
            personaId,
            esDirector
        });

        // Redirigir a la página de lista de repartos o de la película
        res.redirect(`/movies`); // Cambia esto según tu ruta de lista de repartos

    } catch (error) {
        console.error('Error al crear reparto:', error);
        res.render('reparto/form.ejs', { reparto: req.body, errors: error, movieId });
    }
};

// Endpoint Personas que estan en una pelicula
exports.getPersonasByMovieId = async (req, res) => {
    const movieId = req.params.id; // ID de la película pasado como parámetro en la URL

    try {
        // Buscar todos los repartos asociados a la película con el ID especificado (usando movieId en la tabla reparto)
        const repartos = await db.reparto.findAll({
            where: { movieId: movieId }, // Filtrar por movieId en la tabla reparto
            include: [
                {
                    model: db.personas,
                    as: "persona"  
                }
            ]
        });

        if (repartos.length === 0) {
            return res.status(404).json({ message: "No se encontraron personas para esta película" });
        }

        // Extraer todas las personas del reparto
        const personas = repartos.map(reparto => reparto.persona);
        res.json(personas);

    } catch (error) {
        sendError500(res, error);
    }
};