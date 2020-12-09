require ('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

/*LAS RUTAS*/
app.use(require('./routes/index'));
// parse application/x-www-form-urlencoded


mongoose.connect(process.env.URLDB,
   {useNewUrlParser:true,useCreateIndex:true,  useUnifiedTopology: true},
  (err,res)=>{
  if (err){
      throw err; 
  }else{
      console.log('base de datos ONLINE');
  }
});
app.listen(process.env.PORT, () => {
    console.log(`escuchando el puerto ${process.env.PORT}`);
})