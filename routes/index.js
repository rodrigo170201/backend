module.exports = app => {
    require('./persona.routes')(app);
    require('./movie.routes')(app);
    require('./reparto.routes')(app);
}