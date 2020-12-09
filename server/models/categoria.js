const mongoose = require('mongoose');
const usuario = require('./usuario');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'la descripcion es requerida']
    },
    usuario: {
        type: Schema.Types.ObjectID,
        ref: usuario
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);