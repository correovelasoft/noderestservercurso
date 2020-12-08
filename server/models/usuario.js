const mongoose= require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
let Schema=mongoose.Schema;

let rolesValidos={
	values:['admin_role','user_role'],
	message:'{VALUE}, no es un rol valido'
}
let usuarioSchema=new Schema({
	nombre:{
		type:String,
		required: [true,'el nombre es necesario']
	},
	email:{
		type:String,
		required: [true,'el email es necesario'],
		unique:true
	},
	password:{
		type:String,
		required: [true,'el pass es necesario']
	},
	img:{
		type:String,
		required: [false]
	}, /* no es obigalotoi*/
	role:{
		type:String,
		default: 'user_role',
		enum: rolesValidos
	}, /* defatult user role*/
	estado:{
		type:Boolean,
		default: true
	},// boolean
	google:{
		type:Boolean,
		default: false
	} /* boolean*/
});

usuarioSchema.methods.toJson=function(){
	let user=this;
	let userObject=user.toObject();
	delete userObject.password;
	return userObject;
}
usuarioSchema.plugin(uniqueValidator,{
	message:'{PATH} debe ser unico'
});

module.exports = mongoose.model('usuario',usuarioSchema);