const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fileUpload = require('express-fileupload');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

const db = require("./models");
db.sequelize.sync({
    //force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

// middleware para validación de errores en JSON
app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).json({
            msg: 'Error en el JSON'
        });
    } else {
        next();
    }
});

// Ruta para el endpoint raíz
app.get('/', (req, res) => {
    res.render('dashboard'); 
});

require('./routes')(app);

app.listen(3000, function () {
    console.log('Ingrese a http://localhost:3000')
})