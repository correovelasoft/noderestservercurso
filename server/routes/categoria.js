const express = require('express');
const { verificaToken, verifica_admin_role } = require('../middelware/autenticacion');
const app = express();
const Categoria = require('../models/categoria');

/*mostar las categorias*/
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                })
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })

});

/*mostar una categoria_por_id*/
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'id no es valido'
            })

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

/*crear una nueva categoria*/

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err
            })

        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });

});

/*actualizar la categoaia*/

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: err
            })

        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            mensaje: 'actualizado'
        })

    });
});

app.delete('/categoria/:id', [verificaToken, verifica_admin_role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: 'id no existe'
            })

        }
        res.json({
            ok: true,
            categoria: categoriaDB,
            mensaje: 'borrado'
        })

    });

});


module.exports = app;