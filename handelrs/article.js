//Importo libreria validator y mi modelo Article
const { response } = require("express");
const Articulo = require("../models/Article");
const {validarArticulo} = require("../helpers/validar")
const fs = require("fs")
const {ValidationError,DataBaseError,ExtensionError} = require("../errors/types")


const crear = (req,res) =>{
    
    //Parametros = datos ingresados por usuario
    let parametros= req.body;
    //Validacion en bloque try catch
    try{ 
    validarArticulo(parametros)
    } 
    catch(error) {
        return res.status(400).json({
            status:"error",
            mensaje:"Han faltado datos a enviar"
        })
    }
// Creo el objeto a guardar, apartir de mi modelo
    const articulo =new Articulo(parametros)
    
// Guardar el objeto en la base de datos
    articulo.save()
            .then((articuloguardado) =>{
                return res.status(200).json({
                    status: 'sucess',
                    Articulo: articuloguardado,
                    mensaje:"Articulo creado con exito"
                })
            })
            .catch((error) => {
                return res.status(400).json({
                    status:'error',
                    mensaje:'No se ha guardado el articulo'
                })
            })
}

const listar= (req,res) =>{

    let consulta = Articulo.find({})
                consulta.sort({fecha:-1})
                if(req.params.ultimos){ //Si recibo el parametro opcional aplico el limitador
                    consulta.limit(2)} 
                consulta.then(articulos =>{ 
                    if (Object.keys(articulos).length === 0) { //Si no hay ningun articulo en mi base de datos da un error
                        throw new Error();
                }
                res.status(200).json({
                    status: "sucesss",
                    cantidad:Object.keys(articulos).length,
                    articulos           //Devuelve todos los articulos en mi base de datos
                })
            })
                .catch(error => {
                    return res.status(404).json({
                        status:'error',
                        mensaje:"No se han encontrado articulos"
                    })
                })
    }

const uno = (req,res) =>{
    
    //Obtengo el id que ingreso el usuario por parametro
    const id = req.params.id 
    //Uso el metodo para buscar por id
    Articulo.findById(id)
    .then(articulo =>{
        //Si no existe el articulo doy un error
        if(!articulo){
            throw new Error()
        }
        return res.status(200).json({
            status:"sucess",
            articulo
        })
    })
    .catch(error =>{
        res.status(404).json({
            status:"error",
            mensaje:"No se ha encontrado el articulo"
        })
    })
}

const borrar = (req,res) =>{
    const  id = req.params.id
    Articulo.findOneAndDelete({_id: id})
        .then(articuloBorrado =>{
                            if(error || !articuloBorrado){
                                throw new Error()
                            }
                            return res.status(200).json({
                                status:"sucess",
                                articuloBorrado
                            })
                        })
                        .catch(error =>{
                            res.status(500).json({
                                status:"error",
                                mensaje:"Error al borrar el articulo"
                            })
    })
}

const editar=(req,res) =>{
    let articuloId = req.params.id
    //Buscar actualizar articulo

    let parametros = req.body

    //Validar datos
    try{ 
        validarArticulo(parametros)}
    catch(error) {
        return res.status(400).json({
            status:"error",
            mensaje:"Han faltado datos a enviar"
        })
    }

    Articulo.findOneAndUpdate({_id:articuloId}, req.body, {new:true}) //El metodo recibe un key value a buscar y los datos con los que actualizar
            .then(articuloActualizado =>{                             //y opciones(esta opcion hace que la promise te de el Articulo ya actualizado)
                res.status(200).json({
                    status:"sucess",
                    articuloActualizado
                })
            })
            .catch(error=>{
                res.status(500).json({
                    status:"error",
                    mensaje:"Ha ocurrido un error"
                })
            })
}


const subir=(req,res) =>{
    
    //Configurar multer

    //Tomar el fichero de imagen subido
    if(!req.file && !req.files){
        return res.status(400).json({
            status:"error",
            mensaje:"Peticion no valida"
        })
    }
    console.log(req.file)

    //Nombre del archivo
    let file = req.file.originalname

    //Extension del archivo
    let file_split = file.split("\.")
    let extension = file_split[1]

    //Comprobar extension del archivo

    // Borrar archivo y dar respuesta
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
        fs.unlink(req.file.path, (error) =>{
            return res.status(400).json({
                status:"error",
                mensaje:"Extension del archivo no valido"
            })
        })

    }else{
        let articuloId = req.params.id

        Articulo.findOneAndUpdate({_id:articuloId},{imagen: req.file.filename}, {new:true}) 
            .then( articuloActualizado =>{
                if(!articuloActualizado) throw new DataBaseError()
                res.status(200).json({
                status:"sucess",
                articulo:articuloActualizado
            })
        })
        .catch(error=>{
            res.status(500).json({
                status:"error",
                mensaje:"Ha ocurrido un error"
            })
        })
    }
}

const buscador = (req,res) =>{
    //Sacar el string de busqueda
    let busqueda = req.params.busqueda

    //FIND OR 
    Articulo.find({"$or":[
        {"title":{"$regex": busqueda, "$options":"i"}},
        {"content":{"$regex": busqueda, "$options":"i"}},
    ]})
    .sort({fecha: -1})
    //ORDEN
    .then(articulosEncontrados =>{
        if(!articulosEncontrados || Object.keys(articulosEncontrados).length === 0){
            throw new Error()
        }
        res.status(200).json({
            status:"sucess",
            articulosEncontrados
        })
    })
    .catch(error =>{
        res.status(404).json({
            status:"error",
            mensaje:"No se han encontrado los articulos"
        })
    })
    //EJECUTAR CONSULTA

    //DEVOLVER RESULTADO
}



module.exports = {
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    buscador
}

