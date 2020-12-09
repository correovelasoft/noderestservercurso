const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verifica_admin_role } = require('../middelware/autenticacion');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', verificaToken, (req, res) => {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,

    })
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;

    limite = Number(limite);
    Usuario.find({ estado: true }, 'nombre email img role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    err: err
                })
            }
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuario: usuarios,
                    conteo: conteo
                })

            });
        })
})

app.post('/usuarios', [verificaToken, verifica_admin_role], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

})
app.put('/usuarios/:id', [verificaToken, verifica_admin_role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB,
            act: 'actualizo'
        });

    });
})
app.delete('/usuario/:id', [verificaToken, verifica_admin_role], (req, res) => {
    let id = req.params.id;
    let estado = {
            estado: false
        }
        //Usuario.findByIdAndRemove(id,(err,usuarioBorrado)=>{
    Usuario.findByIdAndUpdate(id, estado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            })
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado,
            message: 'usuario, borrado'
        });
    });
})

module.exports = app;