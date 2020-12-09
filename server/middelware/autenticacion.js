/*   verificar token*/
const jwt=require('jsonwebtoken');

let verificaToken=(req,res,next)=>{
	let token=req.get('token');

	jwt.verify(token,process.env.SEED,(err,decoded)=>{
		if (err) {
			return res.status(401).json({
				ok:false,
				err: {
					message:'token no valido'
				}
			});
		}
		req.usuario=decoded.usuario;
		next();
	});

	/*res.json({
		token:token
	});*/
};

/*verifica admin role*/

let verifica_admin_role=(req,res,next)=>{
	let usuario=req.usuario;

	if (usuario.role==='admin_role'){
		next();
		return;
	}else{
		return res.json({
			ok:false,
			err:'el usuario no es admin'
		})

	}

};


module.exports = {
	verificaToken,
	verifica_admin_role
}