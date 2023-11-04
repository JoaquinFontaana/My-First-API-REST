const {Router} = require("express")
const multer=require("multer")
const ArticuloHandler = require("../handelrs/article")

const router= Router()

const almacenamiento= multer.diskStorage({
    destination: function (req,file, cb){
        cb(null, './imagenes/articulos/')  //Ruta en la que se van a guardar las imagenes
    },
    filename: function(req,file,cb) { //Nombre que va a tener la imagen
        cb(null, "articulo"+ Date.now() + file.originalname)
    }
})

const subidas= multer({storage: almacenamiento})

router.post("/agregar", ArticuloHandler.crear)
router.get("/articulos/:ultimos?", ArticuloHandler.listar) // /parms? ?(opcional)
router.get("/articulo/:id",ArticuloHandler.uno) //Parametro obligatorio
router.delete("/articulo/:id", ArticuloHandler.borrar)
router.put("/articulo/:id",ArticuloHandler.editar)
router.post("/subir-imagen/:id", subidas.single("file") /*Midelware*/,ArticuloHandler.subir)
router.get("/buscar/:busqueda",ArticuloHandler.buscador)
module.exports = router;