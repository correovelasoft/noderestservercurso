const express = require('express');
const { verificaToken } = require('../middelware/autenticacion');
const app = express();
const Producto = require('../models/producto');

// obtener productos
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .sort('nombre')
        /* .populate('usuario', 'nombre, email') */
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                producto: productoBD
            })
        })

});
/*mostar una producto por id*/
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                })
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: 'id no existe'
                })
            }
            res.json({
                ok: true,
                producto: productoBD
            })
        })

});
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); // para buscar por letras que coincidan
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                producto: productoBD
            })
        })
});

/*crear un nuevo producto*/

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: err
            })

        }
        res.json({
            ok: true,
            producto: productoDB
        })

    });

});

/*actualizar la categoaia*/

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;
    let elProducto = {
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria
    }
    Producto.findByIdAndUpdate(id, elProducto, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: err
            })

        }
        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'actualizado'
        })

    });
});
app.delete('/producto/:id', [verificaToken], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let elProducto = {
        disponible: body.disponible
    }
    Producto.findByIdAndUpdate(id, elProducto, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: 'id no existe'
            })

        }
        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'actualizado'
        })

    });

});

module.exports = app;