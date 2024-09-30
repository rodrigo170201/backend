module.exports = (sequelize, Sequelize) => {
    const Reparto = sequelize.define("reparto", {
        movieId: {
            type: Sequelize.INTEGER,  // Clave foránea de la película
            allowNull: false,
            references: {
                model: 'movies',  // Referencia a la tabla de películas
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        personaId: {
            type: Sequelize.INTEGER,  // Clave foránea de la persona
            allowNull: false,
            references: {
                model: 'personas',  // Referencia a la tabla de personas
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        esDirector: {
            type: Sequelize.BOOLEAN,  // Indica si la persona en el reparto es el director
            defaultValue: false
        }
        
    });


    /*Reparto.associate = function(models) {
        // Un reparto pertenece a una película
        Reparto.belongsTo(models.movies, { as: 'movie', foreignKey: 'movieId' });
        // Un reparto tiene una persona asociada (actor/actriz)
        Reparto.belongsTo(models.personas, { as: 'persona', foreignKey: 'personId' });
    };*/

    return Reparto;
};
