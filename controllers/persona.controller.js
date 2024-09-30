const db = require("../models");
const {  sendError500 } = require("../utils/request.utils");
//isRequestValid,

exports.listPersona = async(req,res) =>{
    try{
        const personas = await db.personas.findAll();
        // Renderizar la vista 'list.ejs' y pasarle los datos de las personas
        res.render('personas/list', { personas });
    }catch(error){
        sendError500(error);
    }
}
//Endpoint no utilizo(me obtiene el id de la persona)
exports.getPersonaById = async (req,res) =>{
    const id = req.params.id;
        
    try{
        const persona = await getPersonaOr404(id,res);
        if(!persona){
            return;
        }
        res.json(persona);

    }catch(error){
        sendError500(error);
    }
}

// Endpoint para obtener las peliculas de una persona
exports.getPeliculasByPersonaId = async (req, res) => {
    const id = req.params.id;

    try {
        const persona = await db.personas.findByPk(id, {
            include: [
                {
                    model: db.reparto,
                    as: "repartos",
                    include: [
                        {
                            model: db.movies,
                            as: "pelicula"
                        }
                    ]
                }
            ]
        });

        if (!persona) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        const peliculas = persona.repartos.map(reparto => reparto.pelicula);
        res.render('personas/peliculas', { peliculas, persona });

    } catch (error) {
        sendError500(res, error);
    }
};

//get persona
exports.createPersona = async function (req, res) {
    res.render('personas/form.ejs', { persona: null, errors: null });
};


// Crear persona
exports.insertPersona = async (req, res) => {
    const { nombre, apellido, fechaNacimiento, lugarNacimiento } = req.body;

    // Validar la solicitud: todos los campos son obligatorios
    if (!nombre || !apellido || !fechaNacimiento || !lugarNacimiento) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
        // Crear la nueva persona en la base de datos
        await db.personas.create({
            nombre,
            apellido,
            fechaNacimiento,
            lugarNacimiento
        });

        res.redirect('/personas');

    } catch (error) {
        // Manejo de errores
        console.error('Error al crear persona:', error);
        // Renderizar el formulario con el error
        res.render('personas/form.ejs', { persona: req.body, errors: error });
    }
};

// Endpoint para ingresar al formulario para editar una persona
exports.editPersona = async function (req, res) {
    const { id } = req.params;

    try {
        const persona = await db.personas.findByPk(id);
        if (!persona) {
            return res.status(404).send("Persona no encontrada");
        }

        // Renderiza el formulario con los datos de la persona
        res.render('personas/form.ejs', { persona: persona, errors: null });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener la persona");
    }
};

// Editar persona
exports.updatePersona = async (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, fechaNacimiento, lugarNacimiento } = req.body;

    try {
        const persona = await db.personas.findByPk(id);
        if (!persona) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        // Actualizar los campos de la persona
        persona.nombre = nombre || persona.nombre;
        persona.apellido = apellido || persona.apellido;
        persona.fechaNacimiento = fechaNacimiento || persona.fechaNacimiento;
        persona.lugarNacimiento = lugarNacimiento || persona.lugarNacimiento;

        await persona.save();  // Guardar los cambios
        res.redirect('/personas');
    } catch (error) {
        sendError500(res, error);
    }
};

// Eliminar persona
exports.deletePersona = async (req, res) => {
    const id = req.params.id;

    try {
        const persona = await db.personas.findByPk(id);
        if (!persona) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        await persona.destroy();  
        res.redirect('/personas');
    } catch (error) {
        sendError500(res, error);
    }
};


// GET: Renderiza la vista para subir la foto de la persona
exports.uploadPhotoGet = async function (req, res) {
    const id = req.params.id;
    try {
        const persona = await db.personas.findByPk(id); // Asumiendo que tu modelo de personas se llama 'personas'
        if (!persona) {
            return res.status(404).send('Persona no encontrada');
        }
        res.render('personas/uploadPhoto', { persona: persona, errors: null }); // Cambié 'burger' a 'persona'
    } catch (error) {
        console.error('Error al obtener la persona:', error);
        res.status(500).send('Error al obtener la persona');
    }
};

// POST: Procesa la subida de la foto de la persona
exports.uploadPhotoPost = async function (req, res) {
    try {
        const id = req.params.id;
        const persona = await db.personas.findByPk(id);

        console.log(req.files); // Verifica si el archivo se está recibiendo

        if (!req.files || !req.files.photo) {
            res.render('personas/uploadPhoto.ejs', { errors: { message: 'Debe seleccionar una imagen' }, persona });
            return;
        }

        const image = req.files.photo;
        // eslint-disable-next-line no-undef
        const path = __dirname + '/../public/images/profiles/' + persona.id + '.jpg'; // Ruta a la carpeta de imágenes de personas

        image.mv(path, function (err) {
            if (err) {
                console.log(err);
                res.render('personas/uploadPhoto.ejs', { errors: { message: 'Error al subir la imagen' }, persona });
                return;
            }
            res.redirect('/personas'); // Redirige a la lista de personas después de subir la imagen
        });

    } catch (error) {
        console.error('Error al procesar la carga de la imagen:', error);
        res.status(500).send('Error al procesar la carga de la imagen');
    }
};

async function getPersonaOr404(id, res) {
    const persona = await db.personas.findByPk(id);
    if (!persona) {
        res.status(404).json({
            msg: 'Persona no encontrada'
        });
        return;
    }
    return persona;
}
