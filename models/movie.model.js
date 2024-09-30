module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define("movie", {
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        sinopsis: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        fechaLanzamiento: {
            type: Sequelize.DATE,
            allowNull: false
        },
        calificacion: {
            type: Sequelize.FLOAT, // Cambio a FLOAT para permitir decimales
            allowNull: false
        },
        linkTrailer: { // Nuevo campo para el enlace del trailer
            type: Sequelize.STRING,
            allowNull: true
        }
    });
    return Movie;
};
