/********************************/
				/*puerto*/
/* *********************************/
process.env.PORT= process.env.PORT || 3000;

/***********************************/

/***********entorno***************/

process.env.NODE_ENV=process.env.NODE_ENV || 'dev'; 

/***********************************/

/**********************/
/*base de datos*/

let urlDB;

if (process.env.NODE_ENV=='dev'){
	urlDB='mongodb://localhost:27017/cafe';	
}else{
	urlDB='mongodb+srv://hector:Fidelito13__@cluster0.b8fhs.mongodb.net/cafe';
}

process.env.URLDB=urlDB;
/********************/





