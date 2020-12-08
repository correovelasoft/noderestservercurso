require ('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.json('Get usuario');
})

app.post('/usuarios', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'nombre vacio'
        })
    } else {
        res.json({
            body
        });

    }
})
app.put('/usuarios/:id', function(req, res) {
    let id = req.params.id;
    res.json(`PUT usuarios ${id}`);
})
app.delete('/usuarios', function(req, res) {
    res.json('DELETE usuarios');
})

app.listen(process.env.PORT, () => {
    console.log(`escuchando el puerto ${process.env.PORT}`);
})