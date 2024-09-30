module.exports = {
    isRequestValid: (requiredFields, body, res) => {
        for (const field of requiredFields) {
            if (!body[field]) {
                res.status(400).json({
                    msg: `Falta el campo ${field}`
                });
                return false;
            }
        }
        return true;
    },
    sendError500: (res, error) => { // Agrega 'res' aquí
        console.log('Error', error);
        res.status(500).json({
            msg: 'Error en el servidor'
        });
    },
};
