//Require es como importar metodos desde paquetes instalados
const {conexion} = require("./basededatos/conexion")
const express = require("express")
const cors = require("cors")


//  Inicializar app
console.log("App de node Iniciada")

const puerto = 3900

//Conectar con la base de datos
conexion()

//Crear Serivdor Node
const app = express()

//Configurar cors
app.use(cors())

// Convertir body a objeto js
app.use(express.json())
app.use(express.urlencoded({extended:true}))


//RUTAS
//importo todas las rutas de article
const rutas_articulo=require("./routes/article")

//Todas las rutas empiezan con el prefijo /api+ruta
app.use("/api",rutas_articulo)

//Crear Servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor alojado en el puerto "+puerto)
})
