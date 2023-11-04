
//Importo mongoose
const mongoose = require("mongoose")
const { ConectionError }=require("../errors/types");
//Conexion es una async function que usa el metodo de la libreria mongoose
//para hacer la conexion a la base de datos
const conexion = async () => {
    try {
      mongoose.set("strictQuery", false);
      //Uso await por si tarda el metodo
      await mongoose.connect('mongodb://localhost:27017/mi_blog')
      
      console.log("Conectado a la base de datos")
    } catch (error) {
      console.log(error);
      throw new ConectionError('Error a la hora de iniciar la BD');
    }
  }
  //Exporto la funcion para usarla en index.js
module.exports = {
    conexion
}